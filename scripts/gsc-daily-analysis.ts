/**
 * 每日GSC数据拉取 + 趋势分析
 *
 * 执行内容：
 * 1. 拉取最近7天的GSC数据（按搜索词+页面维度）
 * 2. 按日期去重存储到 data/seo/raw/
 * 3. 分析最近3天的趋势（对比28天基线）
 * 4. 保存分析结果到 data/seo/analysis/
 * 5. 清理12个月前的旧数据
 *
 * 使用方式：
 *   npx tsx scripts/gsc-daily-analysis.ts
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { GSCClient } from '../lib/seo/gsc-client';
import { convertUrgentQueryToTopic, discoverUserQuestions } from '../lib/seo/llm-analyzer';
import { generateEmbeddingForText } from '../lib/embeddings/qwen';
import { cosineSimilarity } from '../lib/embeddings/similarity';
import { loadArticleEmbeddings } from '../lib/embeddings/internal-linking';
import type { ArticleEmbedding } from '../lib/embeddings/types';
import {
  saveDailyRawData,
  loadRawDataRange,
  getStoredDates,
  loadAnalysis,
  saveAnalysis,
  cleanupOldData,
  type DailyRawData,
  type QueryRecord,
  type PageRecord,
} from '../lib/seo/data-store';
import { detectTrends, type DailyTrendAnalysis } from '../lib/seo/trend-detector';

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * 获取日期范围内的每一天
 */
function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * 主函数
 */
async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  GSC Daily Data Fetch + Trend Analysis                  ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();

  // 1. 连接GSC
  console.log('🔌 Connecting to GSC API...');
  const client = new GSCClient();
  const connected = await client.testConnection();
  if (!connected) {
    console.error('❌ Failed to connect to GSC. Check credentials.');
    process.exit(1);
  }
  console.log(`✅ Connected | Site: ${client.getSiteUrl()} | Auth: ${client.getAuthMethod()}\n`);

  // 2. 计算日期范围（最近7天，考虑3天延迟）
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() - 3); // GSC数据延迟3天
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 6); // 往前7天

  const startStr = formatDate(startDate);
  const endStr = formatDate(endDate);
  console.log(`📅 Fetching data: ${startStr} → ${endStr} (7 days)\n`);

  // 3. 逐天拉取数据（按日期+搜索词+页面维度）
  const datesToFetch = getDateRange(startStr, endStr);
  let newDays = 0;
  let updatedDays = 0;

  for (const date of datesToFetch) {
    process.stdout.write(`   ${date}: `);

    try {
      // 拉搜索词数据
      const queryResponse = await client.query({
        startDate: date,
        endDate: date,
        dimensions: ['query'],
        rowLimit: 25000,
      });

      // 拉页面数据
      const pageResponse = await client.query({
        startDate: date,
        endDate: date,
        dimensions: ['page'],
        rowLimit: 25000,
      });

      const queries: QueryRecord[] = (queryResponse.rows || []).map(r => ({
        query: r.keys?.[0] || '',
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: r.ctr || 0,
        position: r.position || 0,
      }));

      const pages: PageRecord[] = (pageResponse.rows || []).map(r => ({
        page: r.keys?.[0] || '',
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: r.ctr || 0,
        position: r.position || 0,
      }));

      const totalImpressions = queries.reduce((s, q) => s + q.impressions, 0);
      const totalClicks = queries.reduce((s, q) => s + q.clicks, 0);
      const avgPosition = queries.length > 0
        ? queries.reduce((s, q) => s + q.position * q.impressions, 0) /
          Math.max(queries.reduce((s, q) => s + q.impressions, 0), 1)
        : 0;

      const dailyData: DailyRawData = {
        date,
        fetchedAt: new Date().toISOString(),
        queries,
        pages,
        summary: {
          totalQueries: queries.length,
          totalImpressions: totalImpressions,
          totalClicks: totalClicks,
          avgPosition,
          pagesWithImpressions: pages.length,
        },
      };

      // 存储（去重：同日期覆盖）
      const existingDates = getStoredDates();
      const isUpdate = existingDates.includes(date);
      saveDailyRawData(dailyData);

      if (isUpdate) {
        updatedDays++;
        console.log(`updated (${queries.length} queries, ${totalImpressions} impr)`);
      } else {
        newDays++;
        console.log(`new (${queries.length} queries, ${totalImpressions} impr)`);
      }

      // 速率限制
      await new Promise(r => setTimeout(r, 300));
    } catch (err: any) {
      console.log(`error: ${err.message}`);
    }
  }

  console.log(`\n📊 Fetch complete: ${newDays} new + ${updatedDays} updated days\n`);

  // 4. 趋势分析（最近3天 vs 最近28天基线）
  console.log('🔍 Running trend analysis...\n');

  const storedDates = getStoredDates();
  if (storedDates.length >= 3) {
    const recent3Dates = storedDates.slice(-3);
    const baseline28Start = storedDates.length >= 28
      ? storedDates[storedDates.length - 28]
      : storedDates[0];
    const baselineEnd = storedDates[storedDates.length - 1];

    const recentData = loadRawDataRange(recent3Dates[0], recent3Dates[recent3Dates.length - 1]);
    const baselineData = loadRawDataRange(baseline28Start, baselineEnd);

    const trends = detectTrends(recentData, baselineData);

    // 保存分析结果
    const analysisDate = storedDates[storedDates.length - 1];
    saveAnalysis(`daily-${analysisDate}.json`, trends);

    // 输出报告
    console.log(`   Period: ${trends.date} (3-day analysis)`);
    console.log(`   Impressions change: ${trends.impressionsChange >= 0 ? '+' : ''}${trends.impressionsChange.toFixed(1)}%`);
    console.log(`   Clicks change: ${trends.clicksChange >= 0 ? '+' : ''}${trends.clicksChange.toFixed(1)}%`);
    console.log(`   New queries: ${trends.newQueries.length}`);
    console.log(`   Rising queries: ${trends.risingQueries.length}`);
    console.log(`   Alerts: ${trends.alerts.length}`);

    if (trends.alerts.length > 0) {
      console.log(`\n   ⚡ TREND ALERTS:`);
      for (const alert of trends.alerts.slice(0, 5)) {
        console.log(`      [${alert.type}] score=${alert.score} "${alert.query}"`);
        console.log(`         ${alert.reason}`);
      }
    }

    if (trends.risingQueries.length > 0) {
      console.log(`\n   📈 Rising queries:`);
      for (const rq of trends.risingQueries.slice(0, 5)) {
        console.log(`      "${rq.query}" (${rq.changeRatio.toFixed(1)}x, ${rq.recentImpressions} recent impr)`);
      }
    }
  } else {
    console.log(`   ⚠️  Not enough data for trend analysis (need ≥3 days, have ${storedDates.length})`);
    console.log(`   Data will accumulate over the next few days.`);
  }

  // 5. 紧急选题处理（线2：如果有高分警报，写入紧急选题文件）
  if (storedDates.length >= 3) {
    const analysisDate = storedDates[storedDates.length - 1];
    const dailyAnalysis = loadAnalysis(`daily-${analysisDate}.json`);

    if (dailyAnalysis?.alerts?.length > 0) {
      // 只取score≥50的高分警报
      const highAlerts = dailyAnalysis.alerts.filter((a: any) => a.score >= 50);

      if (highAlerts.length > 0) {
        console.log(`\n🚨 ${highAlerts.length} high-score alerts → Perplexity + LLM processing`);

        const urgentTopics = [];
        for (const alert of highAlerts.slice(0, 3)) {
          console.log(`\n   Processing: "${alert.query}" (${alert.type}, score ${alert.score})`);

          // Step 1: Perplexity查真实搜索问题（了解这个方向用户真正关心什么）
          console.log(`   🌐 Perplexity: discovering real questions...`);
          let perplexityQuestions: string[] = [];
          try {
            const pResult = await discoverUserQuestions(alert.query);
            perplexityQuestions = pResult.questions.slice(0, 5);
            if (perplexityQuestions.length > 0) {
              console.log(`      → ${perplexityQuestions.length} real questions found`);
              console.log(`      → Sample: "${perplexityQuestions[0]}"`);
            }
          } catch (pErr: any) {
            console.warn(`      ⚠️  Perplexity failed: ${pErr.message}`);
          }

          // Step 2: LLM分析原因 + 生成完整选题（基于Perplexity的真实数据）
          console.log(`   🧠 LLM: analyzing + generating topic...`);
          try {
            const topic = await convertUrgentQueryToTopic({
              query: alert.query,
              impressions: alert.recentImpressions || 0,
              position: alert.recentPosition || 0,
              alertType: alert.type,
              alertReason: alert.reason + (perplexityQuestions.length > 0
                ? `. Real user questions: ${perplexityQuestions.join('; ')}`
                : ''),
            });

            urgentTopics.push({
              ...topic,
              query: alert.query,
              type: alert.type,
              score: alert.score,
              perplexityQuestions,
              createdAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            });

            console.log(`   → Title: "${topic.title}"`);
            console.log(`   → PK: "${topic.primaryKeyword}"`);
          } catch (err: any) {
            console.warn(`   ⚠️  LLM failed: ${err.message}`);
            urgentTopics.push({
              title: `${alert.query}: What You Need to Know`,
              primaryKeyword: alert.query,
              description: `Learn about ${alert.query} — practical guidance for adults 35+.`,
              topicCluster: 'trending',
              reasoning: alert.reason,
              query: alert.query,
              type: alert.type,
              score: alert.score,
              perplexityQuestions,
              createdAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            });
          }
        }

        // 去重检查：与已有2209篇文章的embedding对比
        let existingEmbeddings: ArticleEmbedding[] = [];
        try {
          existingEmbeddings = loadArticleEmbeddings();
        } catch { /* ignore */ }

        const dedupedTopics = [];
        for (const ut of urgentTopics) {
          if (existingEmbeddings.length > 0) {
            try {
              const inputText = `${ut.title}\n${ut.description}\nPrimary keyword: ${ut.primaryKeyword}`;
              const emb = await generateEmbeddingForText(inputText);
              let maxSim = 0;
              let maxSlug = '';
              for (const article of existingEmbeddings) {
                const sim = cosineSimilarity(emb, article.embedding);
                if (sim > maxSim) { maxSim = sim; maxSlug = article.slug; }
              }
              if (maxSim > 0.80) {
                console.log(`   🚫 Dedup rejected: "${ut.title}" (sim ${maxSim.toFixed(3)} with "${maxSlug.substring(0, 40)}")`);
                continue;
              }
              console.log(`   ✅ Dedup passed: "${ut.title}" (max sim ${maxSim.toFixed(3)})`);
            } catch (dedupErr: any) {
              console.warn(`   ⚠️  Dedup check failed: ${dedupErr.message}, keeping topic`);
            }
          }
          dedupedTopics.push(ut);
        }

        const urgentPath = path.join(process.cwd(), 'data', 'seo', 'urgent-topics.json');
        fs.writeFileSync(urgentPath, JSON.stringify(dedupedTopics, null, 2), 'utf8');
        console.log(`\n   Written ${dedupedTopics.length} urgent topics (${urgentTopics.length - dedupedTopics.length} rejected by dedup)`);
      } else {
        // 没有高分警报，清理过期的紧急选题
        const urgentPath = path.join(process.cwd(), 'data', 'seo', 'urgent-topics.json');
        if (fs.existsSync(urgentPath)) {
          const existing = JSON.parse(fs.readFileSync(urgentPath, 'utf8'));
          const now = new Date().toISOString();
          const valid = existing.filter((t: any) => t.expiresAt > now);
          if (valid.length < existing.length) {
            fs.writeFileSync(urgentPath, JSON.stringify(valid, null, 2), 'utf8');
            console.log(`\n🧹 Cleaned ${existing.length - valid.length} expired urgent topics`);
          }
        }
      }
    }
  }

  // 6. 清理旧数据
  console.log('\n🧹 Cleaning up old data...');
  const cleanup = cleanupOldData();
  if (cleanup.rawDeleted > 0 || cleanup.analysisDeleted > 0) {
    console.log(`   Deleted: ${cleanup.rawDeleted} raw + ${cleanup.analysisDeleted} analysis files`);
  } else {
    console.log(`   No old data to clean up`);
  }

  // 6. 总结
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Daily GSC analysis completed in ${duration}s`);
  console.log(`   Data stored: data/seo/raw/${startStr} → ${endStr}`);
  console.log(`   Total stored days: ${getStoredDates().length}\n`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
