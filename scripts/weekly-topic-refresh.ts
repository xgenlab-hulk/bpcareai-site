/**
 * 每周选题库更新
 *
 * 线1（稳定线）的核心脚本：
 * 1. 分析最近7天的GSC数据
 * 2. 识别内容缺口和高价值方向
 * 3. 生成新选题候选
 * 4. 评分排序
 * 5. 补充到选题库
 *
 * 使用方式：npm run seo:weekly
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { getStoredDates, loadRawDataRange, saveAnalysis } from '../lib/seo/data-store';
import { scoreTopics, type TopicCandidate } from '../lib/seo/topic-scorer';
import { generateTopicCandidatesForKeyword } from '../lib/llm/qwen-topics';
import {
  getTopicsInventory,
  getTotalTopicsCount,
  type PlannedTopic,
} from '../lib/topics/manager';

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  Weekly Topic Refresh — GSC-Driven                      ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // 1. 加载GSC数据
  const storedDates = getStoredDates();
  if (storedDates.length < 3) {
    console.log('⚠️  Not enough GSC data (need ≥3 days). Run seo:daily first.\n');
    return;
  }

  const last7Start = storedDates[Math.max(storedDates.length - 7, 0)];
  const last7End = storedDates[storedDates.length - 1];
  const last7Data = loadRawDataRange(last7Start, last7End);

  console.log(`📊 Analyzing ${last7Data.length} days of GSC data (${last7Start} → ${last7End})\n`);

  // 2. 汇总搜索词
  const queryAgg = new Map<string, { impressions: number; clicks: number; position: number }>();
  for (const day of last7Data) {
    for (const q of day.queries) {
      const e = queryAgg.get(q.query) || { impressions: 0, clicks: 0, position: 0 };
      e.impressions += q.impressions;
      e.clicks += q.clicks;
      e.position = q.position; // 取最新的
      queryAgg.set(q.query, e);
    }
  }

  console.log(`   Total search terms: ${queryAgg.size}`);
  const totalImpr = Array.from(queryAgg.values()).reduce((s, q) => s + q.impressions, 0);
  console.log(`   Total impressions: ${totalImpr}`);

  // 3. 识别GSC中的高价值方向
  const gscOpportunities: { query: string; impressions: number; position: number }[] = [];
  for (const [query, data] of queryAgg) {
    // 排除品牌词和太短的词
    if (query.length < 10) continue;
    if (['bpcare', 'bp care', 'bp rating'].some(b => query.includes(b))) continue;

    gscOpportunities.push({ query, impressions: data.impressions, position: data.position });
  }

  gscOpportunities.sort((a, b) => b.impressions - a.impressions);
  console.log(`   GSC opportunities (non-brand, len>10): ${gscOpportunities.length}\n`);

  if (gscOpportunities.length > 0) {
    console.log('   Top GSC opportunities:');
    for (const opp of gscOpportunities.slice(0, 10)) {
      console.log(`     ${String(opp.impressions).padStart(4)} impr | pos ${opp.position.toFixed(1).padStart(5)} | "${opp.query}"`);
    }
    console.log('');
  }

  // 4. 检查当前选题库状态
  const inventory = getTopicsInventory();
  const totalTopics = getTotalTopicsCount();
  console.log(`📚 Current topic library: ${totalTopics} topics across ${inventory.filter(i => i.count > 0).length} categories\n`);

  // 5. 加载已有文章的标题和PK（用于选题生成的去重参考）
  const indexPath = path.join(process.cwd(), 'data', 'articles-index.json');
  const articles = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const existingTitles = articles.map((a: any) => a.title);
  const existingPKs = articles.map((a: any) => a.primaryKeyword).filter(Boolean);
  const plannedTitles = inventory.flatMap(i => i.topics.map(t => t.title));

  // 6. 为每个核心分类生成新选题
  const coreTopics = [
    { keyword: 'blood pressure', angles: ['diet', 'exercise', 'medication', 'monitoring', 'symptoms', 'sleep', 'stress'] },
    { keyword: 'diabetes', angles: ['diet', 'exercise', 'blood sugar monitoring', 'medication', 'symptoms', 'meal timing'] },
    { keyword: 'heart health', angles: ['diet', 'exercise', 'symptoms', 'prevention', 'medication', 'women-specific'] },
    { keyword: 'cholesterol', angles: ['diet', 'medication', 'natural remedies', 'testing'] },
    { keyword: 'healthy eating for seniors', angles: ['heart-healthy foods', 'blood sugar friendly foods', 'sodium reduction'] },
    { keyword: 'exercise for seniors', angles: ['walking', 'low-impact', 'strength training', 'flexibility'] },
  ];

  console.log('🤖 Generating new topic candidates per category...\n');

  const allCandidates: TopicCandidate[] = [];

  for (const ct of coreTopics) {
    const categoryCount = inventory.find(i =>
      i.topic.toLowerCase().includes(ct.keyword.split(' ')[0])
    )?.count || 0;

    // 每个分类生成10个候选（如果库存<10才生成）
    if (categoryCount >= 15) {
      console.log(`   ${ct.keyword}: ${categoryCount} topics in stock, skip generation`);
      continue;
    }

    const toGenerate = Math.min(10, 15 - categoryCount);
    console.log(`   ${ct.keyword}: generating ${toGenerate} candidates...`);

    try {
      // 把GSC机会词作为额外的上下文传给LLM
      const gscContext = gscOpportunities
        .filter(o => ct.angles.some(a => o.query.includes(a)) || o.query.includes(ct.keyword.split(' ')[0]))
        .slice(0, 5)
        .map(o => o.query);

      const candidates = await generateTopicCandidatesForKeyword({
        coreKeyword: ct.keyword,
        existingTitles,
        existingPKs,
        alreadyPlannedTitles: [...plannedTitles, ...allCandidates.map(c => c.title)],
        angles: ct.angles,
        batchSize: toGenerate,
      });

      for (const c of candidates) {
        allCandidates.push({
          title: c.title,
          primaryKeyword: c.primaryKeyword,
          description: c.description,
          topicCluster: c.topicCluster,
          source: 'weekly-refresh',
        });
      }

      console.log(`     → ${candidates.length} validated candidates`);
    } catch (err: any) {
      console.error(`     → Error: ${err.message}`);
    }

    // 速率限制
    await new Promise(r => setTimeout(r, 1000));
  }

  // 7. 评分排序
  console.log(`\n📊 Scoring ${allCandidates.length} candidates...\n`);
  const scored = scoreTopics(allCandidates);

  // 8. 输出结果
  console.log('═══ TOP 20 SCORED TOPICS ═══\n');
  for (let i = 0; i < Math.min(20, scored.length); i++) {
    const t = scored[i];
    console.log(`#${(i + 1).toString().padStart(2)} | Score ${t.score.toString().padStart(2)} | [${t.topicCluster}]`);
    console.log(`     "${t.title}"`);
    console.log(`     PK: "${t.primaryKeyword}"`);
    console.log(`     集群:${t.breakdown.clusterNeed} 需求:${t.breakdown.searchDemand} 差异:${t.breakdown.differentiation} 时效:${t.breakdown.timeliness}`);
    console.log(`     ${t.reasoning}`);
    console.log('');
  }

  // 9. 写入选题库
  console.log('💾 Updating topic library...\n');
  let totalAdded = 0;

  // 分类关键词映射（用于精准匹配选题到选题库文件）
  const categoryKeywords: Record<string, string[]> = {
    'blood pressure': ['blood pressure', 'bp', 'hypertension', 'systolic', 'diastolic'],
    'diabetes': ['diabetes', 'blood sugar', 'glucose', 'insulin', 'hba1c', 'a1c', 'diabetic'],
    'heart health': ['heart', 'cardiac', 'cardiovascular', 'cholesterol', 'artery'],
    'cholesterol': ['cholesterol', 'ldl', 'hdl', 'triglyceride', 'statin'],
    'healthy eating for seniors': ['food', 'diet', 'eating', 'nutrition', 'meal', 'breakfast', 'dinner', 'snack', 'soup', 'recipe'],
    'exercise for seniors': ['exercise', 'walking', 'yoga', 'tai chi', 'stretch', 'fitness', 'aerobic'],
  };

  for (const item of inventory) {
    const keywords = categoryKeywords[item.topic] || [item.topic];
    const matchingTopics = scored.filter(t => {
      const text = `${t.primaryKeyword} ${t.title}`.toLowerCase();
      return keywords.some(kw => text.includes(kw));
    });

    if (matchingTopics.length === 0) continue;

    // 转为PlannedTopic格式
    const newTopics: PlannedTopic[] = matchingTopics.map(t => ({
      title: t.title,
      description: t.description,
      primaryKeyword: t.primaryKeyword,
      topicCluster: t.topicCluster,
      coreKeyword: item.topic,
      createdAt: new Date().toISOString(),
    }));

    // 合并到现有选题
    const existing = item.topics;
    const combined = [...existing, ...newTopics];

    fs.writeFileSync(item.filePath, JSON.stringify(combined, null, 2), 'utf8');
    console.log(`   ${item.topic}: +${newTopics.length} topics (total: ${combined.length})`);
    totalAdded += newTopics.length;
  }

  console.log(`\n✅ Added ${totalAdded} new topics to library`);

  // 10. 保存周度分析报告
  const weekNum = getISOWeek(new Date());
  const report = {
    week: `${new Date().getFullYear()}-W${weekNum}`,
    generatedAt: new Date().toISOString(),
    gscData: {
      daysAnalyzed: last7Data.length,
      totalSearchTerms: queryAgg.size,
      totalImpressions: totalImpr,
      topOpportunities: gscOpportunities.slice(0, 20),
    },
    candidates: scored.slice(0, 30).map(t => ({
      title: t.title,
      pk: t.primaryKeyword,
      score: t.score,
      breakdown: t.breakdown,
      reasoning: t.reasoning,
    })),
    topicsAdded: totalAdded,
    libraryStatus: inventory.map(i => ({ topic: i.topic, count: i.count })),
  };

  saveAnalysis(`weekly-${report.week}.json`, report);
  console.log(`📄 Report saved: data/seo/analysis/weekly-${report.week}.json\n`);
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
