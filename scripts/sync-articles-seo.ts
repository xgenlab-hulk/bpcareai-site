/**
 * 文章级 SEO 数据同步脚本
 *
 * 功能：
 * - 读取所有文章列表
 * - 为每篇文章获取 GSC 数据（最近 7 天和 30 天）
 * - 获取每篇文章的 top keywords
 * - 计算趋势并保存
 *
 * 使用方式：
 *   npm run sync:articles-seo
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { GSCClient } from '../lib/seo/gsc-client';
import type {
  ArticleSEOMetrics,
  ArticlesSEOData,
  PeriodMetrics,
  KeywordMetric,
} from '../lib/seo/types';

interface ArticleIndex {
  slug: string;
  topicCluster?: string;
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        Article-Level SEO Data Sync                    ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();

  try {
    // 1. 读取文章索引
    const articlesIndexPath = path.join(process.cwd(), 'data', 'articles-index.json');
    if (!fs.existsSync(articlesIndexPath)) {
      throw new Error('articles-index.json not found. Please run article generation first.');
    }

    const articles: ArticleIndex[] = JSON.parse(fs.readFileSync(articlesIndexPath, 'utf8'));
    console.log(`📚 Found ${articles.length} articles\n`);

    // 2. 初始化 GSC Client
    console.log('🔌 Connecting to Google Search Console API...\n');
    const client = new GSCClient();

    // 3. 获取站点 URL 和构建基础 URL
    const siteUrl = client.getSiteUrl();
    // 从 sc-domain:bpcareai.com 提取域名
    const domain = siteUrl.replace('sc-domain:', '');
    const baseUrl = `https://${domain}`;
    console.log(`📍 Site: ${baseUrl}\n`);

    // 4. 计算日期范围
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 3); // GSC 数据延迟

    const start7Days = new Date(endDate);
    start7Days.setDate(start7Days.getDate() - 7);

    const start30Days = new Date(endDate);
    start30Days.setDate(start30Days.getDate() - 30);

    const endDateStr = client.formatDate(endDate);
    const start7DaysStr = client.formatDate(start7Days);
    const start30DaysStr = client.formatDate(start30Days);

    console.log(`📅 Date ranges:`);
    console.log(`   Last 7 days:  ${start7DaysStr} to ${endDateStr}`);
    console.log(`   Last 30 days: ${start30DaysStr} to ${endDateStr}\n`);

    // 5. 获取所有页面的数据（一次性拉取，避免多次 API 调用）
    console.log('📊 Fetching page metrics from GSC...');
    const pages7Days = await client.getPageMetrics(start7DaysStr, endDateStr);
    const pages30Days = await client.getPageMetrics(start30DaysStr, endDateStr);
    console.log(`   ✅ Fetched data for ${pages30Days.length} pages\n`);

    // 6. 创建页面 URL 到数据的映射
    const pageMap7Days = new Map(
      pages7Days.map((row) => [row.keys?.[0] || '', row])
    );
    const pageMap30Days = new Map(
      pages30Days.map((row) => [row.keys?.[0] || '', row])
    );

    // 7. 处理每篇文章
    console.log('🔍 Processing article SEO metrics...\n');
    const articleMetrics: ArticleSEOMetrics[] = [];
    let processedCount = 0;

    for (const article of articles) {
      processedCount++;
      const articleUrl = `${baseUrl}/${article.slug}`;

      // 进度显示
      if (processedCount % 10 === 0 || processedCount === articles.length) {
        console.log(`   Processing: ${processedCount}/${articles.length}`);
      }

      // 获取 7 天和 30 天的数据
      const data7Days = pageMap7Days.get(articleUrl);
      const data30Days = pageMap30Days.get(articleUrl);

      // 如果 30 天内没有数据，跳过该文章
      if (!data30Days || (data30Days.clicks ?? 0) === 0) {
        continue;
      }

      // 获取 top keywords（仅对有流量的文章）
      let topKeywords: KeywordMetric[] = [];
      try {
        const keywordsData = await client.getPageKeywords(
          articleUrl,
          start30DaysStr,
          endDateStr
        );

        topKeywords = keywordsData
          .filter((kw) => kw.keys && kw.keys.length > 0)
          .map((kw) => ({
            query: kw.keys![0],
            clicks: kw.clicks ?? 0,
            impressions: kw.impressions ?? 0,
            ctr: kw.ctr ?? 0,
            position: kw.position ?? 0,
          }))
          .sort((a, b) => b.clicks - a.clicks)
          .slice(0, 10); // Top 10 keywords
      } catch (error) {
        console.error(`   ⚠️  Failed to fetch keywords for ${article.slug}`);
      }

      // 构建指标对象
      const metrics7Days: PeriodMetrics = {
        clicks: data7Days?.clicks ?? 0,
        impressions: data7Days?.impressions ?? 0,
        ctr: data7Days?.ctr ?? 0,
        position: data7Days?.position ?? 0,
      };

      const metrics30Days: PeriodMetrics = {
        clicks: data30Days?.clicks ?? 0,
        impressions: data30Days?.impressions ?? 0,
        ctr: data30Days?.ctr ?? 0,
        position: data30Days?.position ?? 0,
        topKeywords,
      };

      // 计算趋势（7天 vs 30天日均）
      const avg7Days = metrics7Days.clicks / 7;
      const avg30Days = metrics30Days.clicks / 30;
      let trend: 'up' | 'down' | 'stable' = 'stable';

      if (avg7Days > avg30Days * 1.1) {
        trend = 'up';
      } else if (avg7Days < avg30Days * 0.9) {
        trend = 'down';
      }

      // 计算关键词和排名相关指标
      const keywordCount = topKeywords.length;
      const topKeywordPosition = topKeywords.length > 0 ? topKeywords[0].position : 0;

      articleMetrics.push({
        slug: article.slug,
        url: articleUrl,
        topicCluster: article.topicCluster,
        metrics: {
          last7Days: metrics7Days,
          last30Days: metrics30Days,
          trend,
        },
        keywordCount,
        topKeywordPosition,
      });
    }

    console.log(`\n✅ Processed ${articleMetrics.length} articles with SEO data\n`);

    // 8. 保存数据
    const outputPath = path.join(process.cwd(), 'data', 'articles-seo.json');
    const outputData: ArticlesSEOData = {
      lastUpdated: new Date().toISOString(),
      articles: articleMetrics.sort((a, b) => b.metrics.last30Days.clicks - a.metrics.last30Days.clicks),
    };

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`💾 Data saved to: ${outputPath}\n`);

    // 9. 显示统计摘要
    const totalClicks = articleMetrics.reduce((sum, a) => sum + a.metrics.last30Days.clicks, 0);
    const totalImpressions = articleMetrics.reduce(
      (sum, a) => sum + a.metrics.last30Days.impressions,
      0
    );
    const avgCTR = totalClicks / totalImpressions || 0;

    const articlesWithTraffic = articleMetrics.filter((a) => a.metrics.last30Days.clicks > 0);
    const trendingUp = articleMetrics.filter((a) => a.metrics.trend === 'up');
    const trendingDown = articleMetrics.filter((a) => a.metrics.trend === 'down');

    console.log('═'.repeat(60));
    console.log('📈 Summary Statistics (Last 30 Days)');
    console.log('═'.repeat(60));
    console.log(`  Articles with traffic:  ${articlesWithTraffic.length}/${articles.length}`);
    console.log(`  Total clicks:           ${totalClicks.toLocaleString()}`);
    console.log(`  Total impressions:      ${totalImpressions.toLocaleString()}`);
    console.log(`  Average CTR:            ${(avgCTR * 100).toFixed(2)}%`);
    console.log(`\n  Trending up:    ${trendingUp.length} articles 📈`);
    console.log(`  Stable:         ${articleMetrics.length - trendingUp.length - trendingDown.length} articles ➡️`);
    console.log(`  Trending down:  ${trendingDown.length} articles 📉`);

    if (articleMetrics.length > 0) {
      console.log(`\n  Top 5 Articles by Clicks:`);
      articleMetrics.slice(0, 5).forEach((a, i) => {
        console.log(
          `    ${i + 1}. ${a.slug.substring(0, 50)}... (${a.metrics.last30Days.clicks} clicks)`
        );
      });
    }

    console.log('═'.repeat(60));

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ Sync completed in ${duration}s\n`);
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure articles-index.json exists in the data/ directory');
    console.error('   2. Verify GSC credentials are correctly configured');
    console.error('   3. Check that your site has some GSC data available');
    process.exit(1);
  }
}

main();
