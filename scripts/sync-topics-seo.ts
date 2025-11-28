/**
 * Topic Cluster SEO 数据同步脚本
 *
 * 功能：
 * - 读取文章级 SEO 数据
 * - 按 Topic Cluster 聚合数据
 * - 计算每个主题的总体表现和机会评分
 * - 生成内容策略建议
 *
 * 使用方式：
 *   npm run sync:topics-seo
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import type {
  ArticlesSEOData,
  ArticleSEOMetrics,
  TopicSEOMetrics,
  TopicsSEOData,
} from '../lib/seo/types';

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        Topic Cluster SEO Analysis                     ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();

  try {
    // 1. 读取文章级 SEO 数据
    const articlesPath = path.join(process.cwd(), 'data', 'articles-seo.json');
    if (!fs.existsSync(articlesPath)) {
      throw new Error(
        'articles-seo.json not found. Please run sync:articles-seo first.'
      );
    }

    const articlesData: ArticlesSEOData = JSON.parse(
      fs.readFileSync(articlesPath, 'utf8')
    );
    console.log(`📚 Loaded ${articlesData.articles.length} articles\n`);

    // 2. 按 Topic Cluster 分组
    const topicGroups = new Map<string, ArticleSEOMetrics[]>();

    for (const article of articlesData.articles) {
      const topic = article.topicCluster || 'uncategorized';
      if (!topicGroups.has(topic)) {
        topicGroups.set(topic, []);
      }
      topicGroups.get(topic)!.push(article);
    }

    console.log(`📊 Found ${topicGroups.size} topic clusters\n`);

    // 3. 计算每个 Topic 的指标
    const topicMetrics: TopicSEOMetrics[] = [];

    for (const [topicCluster, articles] of Array.from(topicGroups.entries())) {
      // 聚合 30 天数据
      const totalClicks = articles.reduce(
        (sum, a) => sum + a.metrics.last30Days.clicks,
        0
      );
      const totalImpressions = articles.reduce(
        (sum, a) => sum + a.metrics.last30Days.impressions,
        0
      );
      const avgCTR = totalClicks / totalImpressions || 0;
      const avgPosition =
        articles.reduce((sum, a) => sum + a.metrics.last30Days.position, 0) /
          articles.length || 0;

      // 获取 top 3 文章
      const topArticles = articles
        .sort((a, b) => b.metrics.last30Days.clicks - a.metrics.last30Days.clicks)
        .slice(0, 3)
        .map((a) => ({
          slug: a.slug,
          clicks: a.metrics.last30Days.clicks,
        }));

      // 评估表现 (Performance)
      let performance: 'excellent' | 'good' | 'average' | 'poor' = 'poor';
      const avgClicksPerArticle = totalClicks / articles.length;

      if (avgClicksPerArticle >= 20 && avgCTR >= 0.03 && avgPosition < 15) {
        performance = 'excellent';
      } else if (avgClicksPerArticle >= 10 && avgCTR >= 0.02 && avgPosition < 25) {
        performance = 'good';
      } else if (avgClicksPerArticle >= 5 || totalImpressions > 100) {
        performance = 'average';
      }

      // 评估机会 (Opportunity)
      let opportunity: 'high' | 'medium' | 'low' = 'low';
      const hasImpressionsButLowClicks = totalImpressions > 500 && avgCTR < 0.02;
      const goodPositionButLowTraffic = avgPosition < 20 && totalClicks < 50;
      const highImpressionsLowPosition = totalImpressions > 1000 && avgPosition > 30;

      if (hasImpressionsButLowClicks || goodPositionButLowTraffic) {
        opportunity = 'high';
      } else if (highImpressionsLowPosition || (totalImpressions > 200 && avgCTR < 0.03)) {
        opportunity = 'medium';
      }

      topicMetrics.push({
        topicCluster,
        articleCount: articles.length,
        metrics: {
          last30Days: {
            clicks: totalClicks,
            impressions: totalImpressions,
            ctr: avgCTR,
            avgPosition: avgPosition,
          },
        },
        topArticles,
        performance,
        opportunity,
      });
    }

    // 4. 排序：优先显示高机会和高表现的主题
    const sortedTopics = topicMetrics.sort((a, b) => {
      // 优先级：high opportunity > excellent performance > clicks
      const aScore =
        (a.opportunity === 'high' ? 1000 : a.opportunity === 'medium' ? 500 : 0) +
        (a.performance === 'excellent' ? 100 : a.performance === 'good' ? 50 : 0) +
        a.metrics.last30Days.clicks;

      const bScore =
        (b.opportunity === 'high' ? 1000 : b.opportunity === 'medium' ? 500 : 0) +
        (b.performance === 'excellent' ? 100 : b.performance === 'good' ? 50 : 0) +
        b.metrics.last30Days.clicks;

      return bScore - aScore;
    });

    // 5. 保存数据
    const outputPath = path.join(process.cwd(), 'data', 'topics-seo.json');
    const outputData: TopicsSEOData = {
      lastUpdated: new Date().toISOString(),
      topics: sortedTopics,
    };

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`💾 Data saved to: ${outputPath}\n`);

    // 6. 显示统计摘要
    const totalClicks = topicMetrics.reduce(
      (sum, t) => sum + t.metrics.last30Days.clicks,
      0
    );
    const totalImpressions = topicMetrics.reduce(
      (sum, t) => sum + t.metrics.last30Days.impressions,
      0
    );

    const excellentTopics = topicMetrics.filter((t) => t.performance === 'excellent');
    const goodTopics = topicMetrics.filter((t) => t.performance === 'good');
    const highOpportunity = topicMetrics.filter((t) => t.opportunity === 'high');
    const mediumOpportunity = topicMetrics.filter((t) => t.opportunity === 'medium');

    console.log('═'.repeat(60));
    console.log('📈 Topic Cluster Analysis');
    console.log('═'.repeat(60));
    console.log(`\n  Total Topics:       ${topicMetrics.length}`);
    console.log(`  Total Clicks:       ${totalClicks.toLocaleString()}`);
    console.log(`  Total Impressions:  ${totalImpressions.toLocaleString()}\n`);

    console.log('  Performance Distribution:');
    console.log(`    🌟 Excellent:  ${excellentTopics.length}`);
    console.log(`    ✅ Good:       ${goodTopics.length}`);
    console.log(`    ⚠️  Average:    ${topicMetrics.filter((t) => t.performance === 'average').length}`);
    console.log(`    ❌ Poor:       ${topicMetrics.filter((t) => t.performance === 'poor').length}\n`);

    console.log('  Opportunity Distribution:');
    console.log(`    🎯 High:    ${highOpportunity.length} topics (优化优先)`);
    console.log(`    📊 Medium:  ${mediumOpportunity.length} topics`);
    console.log(`    ➡️  Low:     ${topicMetrics.filter((t) => t.opportunity === 'low').length} topics\n`);

    if (highOpportunity.length > 0) {
      console.log('  🎯 High Opportunity Topics (Top 5):');
      highOpportunity.slice(0, 5).forEach((t, i) => {
        console.log(
          `    ${i + 1}. ${t.topicCluster} (${t.articleCount} articles, ${t.metrics.last30Days.impressions} impressions)`
        );
      });
      console.log('');
    }

    if (excellentTopics.length > 0) {
      console.log('  🌟 Excellent Performing Topics:');
      excellentTopics.forEach((t, i) => {
        console.log(
          `    ${i + 1}. ${t.topicCluster} (${t.metrics.last30Days.clicks} clicks, CTR: ${(t.metrics.last30Days.ctr * 100).toFixed(2)}%)`
        );
      });
      console.log('');
    }

    console.log('═'.repeat(60));

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ Analysis completed in ${duration}s\n`);
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure articles-seo.json exists (run sync:articles-seo first)');
    console.error('   2. Check that articles have topicCluster field');
    process.exit(1);
  }
}

main();
