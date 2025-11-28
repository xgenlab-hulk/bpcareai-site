/**
 * GSC 数据同步脚本
 *
 * 功能：
 * - 从 Google Search Console 拉取最近 90 天的数据
 * - 保存到本地 JSON 文件
 * - 支持增量更新
 *
 * 使用方式：
 *   npm run sync:gsc
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { GSCClient } from '../lib/seo/gsc-client';
import type { DailyMetrics, SEOMetricsData } from '../lib/seo/types';

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        Google Search Console Data Sync                ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();

  try {
    // 1. 初始化 GSC Client
    console.log('🔌 Connecting to Google Search Console API...\n');
    const client = new GSCClient();

    // 2. 测试连接
    const isConnected = await client.testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to GSC API. Please check your credentials.');
    }
    console.log('✅ Connected to GSC API successfully!\n');
    console.log(`📍 Site URL: ${client.getSiteUrl()}\n`);

    // 3. 计算日期范围（最近 90 天）
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 3); // GSC 数据有 2-3 天延迟

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 90);

    const startDateStr = client.formatDate(startDate);
    const endDateStr = client.formatDate(endDate);

    console.log(`📅 Fetching data from ${startDateStr} to ${endDateStr}\n`);

    // 4. 获取网站级数据
    console.log('📊 Fetching website metrics...');
    const websiteData = await client.getWebsiteMetrics(startDateStr, endDateStr);

    console.log(`   ✅ Fetched ${websiteData.length} days of data\n`);

    // 5. 转换数据格式
    const dailyMetrics: DailyMetrics[] = websiteData.map((row) => ({
      date: row.keys![0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    }));

    // 6. 计算汇总数据
    const calculateSummary = (days: number) => {
      const recentData = dailyMetrics.slice(-days);
      const totalClicks = recentData.reduce((sum, d) => sum + d.clicks, 0);
      const totalImpressions = recentData.reduce((sum, d) => sum + d.impressions, 0);
      const avgCTR = totalClicks / totalImpressions || 0;
      const avgPosition = recentData.reduce((sum, d) => sum + d.position, 0) / recentData.length;

      return {
        clicks: totalClicks,
        impressions: totalImpressions,
        ctr: avgCTR,
        position: avgPosition,
      };
    };

    // 7. 保存到文件
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const outputPath = path.join(dataDir, 'seo-metrics.json');
    const outputData: SEOMetricsData = {
      lastUpdated: new Date().toISOString(),
      dateRange: {
        start: startDateStr,
        end: endDateStr,
      },
      daily: dailyMetrics,
      summary: {
        last7Days: calculateSummary(7),
        last30Days: calculateSummary(30),
        last90Days: calculateSummary(90),
      },
    };

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`💾 Data saved to: ${outputPath}\n`);

    // 8. 显示统计摘要
    const { last30Days, last90Days } = outputData.summary!;

    console.log('═'.repeat(60));
    console.log('📈 Summary Statistics');
    console.log('═'.repeat(60));
    console.log('\nLast 30 Days:');
    console.log(`  Clicks:       ${last30Days.clicks.toLocaleString()}`);
    console.log(`  Impressions:  ${last30Days.impressions.toLocaleString()}`);
    console.log(`  Average CTR:  ${(last30Days.ctr * 100).toFixed(2)}%`);
    console.log(`  Avg Position: ${last30Days.position.toFixed(1)}`);
    console.log('\nLast 90 Days:');
    console.log(`  Clicks:       ${last90Days.clicks.toLocaleString()}`);
    console.log(`  Impressions:  ${last90Days.impressions.toLocaleString()}`);
    console.log(`  Average CTR:  ${(last90Days.ctr * 100).toFixed(2)}%`);
    console.log(`  Avg Position: ${last90Days.position.toFixed(1)}`);
    console.log('═'.repeat(60));

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ Sync completed in ${duration}s\n`);
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check that all environment variables are set correctly in .env.local');
    console.error('   2. Verify your Google account has access to the site in Search Console');
    console.error('   3. Make sure the GSC_SITE_URL matches exactly what you see in Search Console');
    console.error('   4. Run: npx tsx scripts/generate-gsc-token.ts to refresh your token\n');
    process.exit(1);
  }
}

main();
