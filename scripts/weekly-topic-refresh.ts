/**
 * 每周选题生成（周六执行）
 *
 * 核心逻辑：
 * 1. 检查本周剩余选题（未被消费的）
 * 2. 计算需要新生成的数量 = 35 - 剩余数
 * 3. 脚本汇总GSC数据
 * 4. LLM深度分析（搜索意图、CTR归因、机会识别）
 * 5. 生成新选题候选 → 评分排序
 * 6. 保留优质剩余选题 + 新生成选题 = 35个（下周选题库）
 * 7. 输出已有文章优化建议（线B）
 *
 * 使用方式：npm run seo:weekly
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { getStoredDates, loadRawDataRange, saveAnalysis } from '../lib/seo/data-store';
import { scoreTopics, type TopicCandidate } from '../lib/seo/topic-scorer';
import { generateTopicCandidatesForKeyword } from '../lib/llm/qwen-topics';
import { runWeeklyDeepAnalysis, discoverUserQuestions, type WeeklyAnalysisInput, type PerplexityInsight } from '../lib/seo/llm-analyzer';
import {
  getTopicsInventory,
  getTotalTopicsCount,
  type PlannedTopic,
} from '../lib/topics/manager';
import { generateEmbeddingForText } from '../lib/embeddings/qwen';
import { cosineSimilarity, buildTopicInputText } from '../lib/embeddings/similarity';
import { loadArticleEmbeddings } from '../lib/embeddings/internal-linking';
import type { ArticleEmbedding } from '../lib/embeddings/types';

const WEEKLY_TARGET = 35; // 每周目标选题数（7天 x 5篇/天）
const DAILY_TARGET = 5;

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  Weekly Topic Refresh — Generate Next Week\'s 35 Topics  ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // ========================================
  // Step 1: 检查本周剩余选题
  // ========================================
  const inventory = getTopicsInventory();
  const currentTotal = getTotalTopicsCount();
  console.log(`📚 Current topic library: ${currentTotal} topics remaining\n`);

  for (const item of inventory) {
    if (item.count > 0) {
      console.log(`   ${item.topic}: ${item.count}`);
    }
  }

  // 决定保留多少、新生成多少
  let toKeep = 0;
  let toGenerate = WEEKLY_TARGET;

  if (currentTotal > 0) {
    // 评估剩余选题质量——有score的保留，无score的丢弃
    const remaining = inventory.flatMap(i =>
      i.topics.filter(t => (t.score || 0) >= 30) // 只保留评分≥30的
    );
    toKeep = Math.min(remaining.length, WEEKLY_TARGET);
    toGenerate = WEEKLY_TARGET - toKeep;
    console.log(`\n   保留优质剩余: ${toKeep} (score≥30)`);
    console.log(`   需要新生成: ${toGenerate}`);
  }

  console.log(`   下周总目标: ${WEEKLY_TARGET}\n`);

  if (toGenerate <= 0) {
    console.log('✅ 剩余选题足够，无需生成新选题\n');
    return;
  }

  // ========================================
  // Step 2: 汇总GSC数据
  // ========================================
  const storedDates = getStoredDates();
  let gscQueries: any[] = [];
  let gscPages: any[] = [];

  if (storedDates.length >= 3) {
    const last7Start = storedDates[Math.max(storedDates.length - 7, 0)];
    const last7End = storedDates[storedDates.length - 1];
    const last7Data = loadRawDataRange(last7Start, last7End);

    console.log(`📊 GSC data: ${last7Data.length} days (${last7Start} → ${last7End})\n`);

    // 汇总搜索词
    const queryAgg = new Map<string, { impressions: number; clicks: number; position: number }>();
    for (const day of last7Data) {
      for (const q of day.queries) {
        const e = queryAgg.get(q.query) || { impressions: 0, clicks: 0, position: 0 };
        e.impressions += q.impressions; e.clicks += q.clicks; e.position = q.position;
        queryAgg.set(q.query, e);
      }
    }

    gscQueries = Array.from(queryAgg.entries())
      .sort((a, b) => b[1].impressions - a[1].impressions)
      .map(([q, d]) => ({
        query: q, impressions: d.impressions, clicks: d.clicks,
        avgPosition: d.position,
        ctr: d.impressions > 0 ? +(d.clicks / d.impressions * 100).toFixed(1) : 0,
      }));

    // 汇总页面
    const pageAgg = new Map<string, { impr: number; clicks: number; pos: number }>();
    for (const day of last7Data) {
      for (const p of day.pages) {
        const e = pageAgg.get(p.page) || { impr: 0, clicks: 0, pos: 0 };
        e.impr += p.impressions; e.clicks += p.clicks; e.pos = p.position;
        pageAgg.set(p.page, e);
      }
    }

    gscPages = Array.from(pageAgg.entries())
      .sort((a, b) => b[1].impr - a[1].impr)
      .slice(0, 20)
      .map(([page, d]) => ({
        slug: page.split('/articles/')[1] || page.split('/').pop() || page,
        impressions: d.impr, clicks: d.clicks,
        ctr: d.impr > 0 ? +(d.clicks / d.impr * 100).toFixed(1) : 0,
        position: +d.pos.toFixed(1),
      }));

    console.log(`   Search terms: ${gscQueries.length}`);
    console.log(`   Pages with impressions: ${gscPages.length}\n`);
  } else {
    console.log('⚠️  Not enough GSC data, generating topics without GSC analysis\n');
  }

  // ========================================
  // Step 3: LLM深度分析
  // ========================================
  let llmAnalysis: any = null;

  if (gscQueries.length > 0) {
    console.log('🧠 Running LLM deep analysis...');
    try {
      llmAnalysis = await runWeeklyDeepAnalysis({
        queries: gscQueries,
        topPages: gscPages,
        monthlyTrend: `${storedDates.length} days of GSC data available`,
        currentTopicLibrary: `${currentTotal} topics across ${inventory.filter(i => i.count > 0).length} categories`,
        siteInfo: 'BPCareAI - cardiovascular health website for adults 35+, 2200+ articles',
      });
      console.log('   ✅ Analysis complete\n');

      if (llmAnalysis.topicPriorities) {
        console.log('   📋 LLM选题建议:');
        const priorities = typeof llmAnalysis.topicPriorities === 'string'
          ? llmAnalysis.topicPriorities
          : JSON.stringify(llmAnalysis.topicPriorities, null, 2);
        console.log(`   ${priorities.substring(0, 300)}...\n`);
      }
    } catch (err: any) {
      console.warn(`   ⚠️  LLM analysis failed: ${err.message}\n`);
    }
  }

  // ========================================
  // Step 3.5: Perplexity深挖各方向的真实搜索需求
  // ========================================
  console.log('🔍 Perplexity — discovering what users actually search...\n');

  const perplexityData = new Map<string, PerplexityInsight>();
  const configFile = JSON.parse(fs.readFileSync('automation-config.json', 'utf8'));
  const coreTopicsList = configFile.topicManagement.coreTopics || [];

  // 收集每个方向已有的文章标题（传给Perplexity避免重复）
  const articlesByKeyword = new Map<string, string[]>();
  const allArticles = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'articles-index.json'), 'utf8'));
  for (const ct of coreTopicsList) {
    const kw = ct.keyword.toLowerCase();
    const related = allArticles
      .filter((a: any) => (a.title || '').toLowerCase().includes(kw.split(' ')[0]))
      .map((a: any) => a.title)
      .slice(0, 20);
    articlesByKeyword.set(ct.keyword, related);
  }

  // 对P1和P2方向调Perplexity
  const priorityTopics = coreTopicsList.filter((ct: any) => ct.priority === 'P1' || ct.priority === 'P2');

  for (const ct of priorityTopics) {
    console.log(`   🌐 "${ct.keyword}"...`);
    const existingTitlesForKeyword = articlesByKeyword.get(ct.keyword) || [];
    const insight = await discoverUserQuestions(ct.keyword, existingTitlesForKeyword);
    perplexityData.set(ct.keyword, insight);
    console.log(`      → ${insight.questions.length} real search questions`);
    if (insight.questions.length > 0) {
      console.log(`      Sample: "${insight.questions[0]}"`);
    }
    if (insight.competitorCoverage) {
      console.log(`      Competitors: ${insight.competitorCoverage.substring(0, 80)}...`);
    }
    if (insight.whyItMatters) {
      console.log(`      Why now: ${insight.whyItMatters.substring(0, 80)}...`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('');

  // ========================================
  // Step 4: 生成新选题候选（注入Perplexity发现的真实搜索问题）
  // ========================================
  const indexPath = path.join(process.cwd(), 'data', 'articles-index.json');
  const articles = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const existingTitles = articles.map((a: any) => a.title);
  const existingPKs = articles.map((a: any) => a.primaryKeyword).filter(Boolean);
  const plannedTitles = inventory.flatMap(i => i.topics.map(t => t.title));

  // 读取config中的coreTopics
  const config = JSON.parse(fs.readFileSync('automation-config.json', 'utf8'));
  const coreTopics = config.topicManagement.coreTopics || [];

  // 按P1→P2→P3优先级分配生成数量
  const p1Topics = coreTopics.filter((ct: any) => ct.priority === 'P1');
  const p2Topics = coreTopics.filter((ct: any) => ct.priority === 'P2');
  const p3Topics = coreTopics.filter((ct: any) => ct.priority === 'P3');

  // P1分配50%，P2分配30%，P3分配20%
  const p1Count = Math.ceil(toGenerate * 0.5);
  const p2Count = Math.ceil(toGenerate * 0.3);
  const p3Count = toGenerate - p1Count - p2Count;

  const allCandidates: TopicCandidate[] = [];

  async function generateForGroup(topics: any[], totalCount: number, label: string) {
    if (topics.length === 0 || totalCount <= 0) return;
    const perTopic = Math.max(3, Math.ceil(totalCount / topics.length));

    console.log(`\n🤖 Generating ${label} topics (${totalCount} total, ${perTopic}/category)...\n`);

    for (const ct of topics) {
      // 注入Perplexity发现的真实搜索问题+竞品洞察到angles中
      const pData = perplexityData.get(ct.keyword);
      const enrichedAngles = [...(ct.angles || [])];
      if (pData && pData.questions.length > 0) {
        for (const q of pData.questions.slice(0, 8)) {
          enrichedAngles.push(`Real user search: "${q}"`);
        }
        console.log(`   ${ct.keyword}: +${Math.min(8, pData.questions.length)} real search questions`);
      }
      if (pData && pData.competitorCoverage) {
        enrichedAngles.push(`Competitor insight: ${pData.competitorCoverage}`);
      }
      if (pData && pData.whyItMatters) {
        enrichedAngles.push(`Trending context: ${pData.whyItMatters}`);
      }

      try {
        const candidates = await generateTopicCandidatesForKeyword({
          coreKeyword: ct.keyword,
          existingTitles,
          existingPKs,
          alreadyPlannedTitles: [...plannedTitles, ...allCandidates.map(c => c.title)],
          angles: enrichedAngles,
          batchSize: perTopic,
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
        console.log(`   ${ct.keyword}: ${candidates.length} candidates`);
      } catch (err: any) {
        console.error(`   ${ct.keyword}: Error - ${err.message}`);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  await generateForGroup(p1Topics, p1Count, 'P1 (highest priority)');
  await generateForGroup(p2Topics, p2Count, 'P2 (data-backed)');
  await generateForGroup(p3Topics, p3Count, 'P3 (maintain authority)');

  // ========================================
  // Step 5: 评分排序
  // ========================================
  console.log(`\n📊 Scoring ${allCandidates.length} candidates...\n`);
  const scored = scoreTopics(allCandidates);

  // 取需要的数量（多取一些，去重后可能减少）
  const topScoredRaw = scored.slice(0, toGenerate + 10);

  // ========================================
  // Step 5.5: 两阶段去重
  // ========================================

  // 阶段1: 文本级预筛（0成本，本地计算）
  // 用PK词级重叠快速过滤明显重复
  console.log(`\n🔍 Stage 1: Text-level dedup (${topScoredRaw.length} candidates)...`);

  const STOP_WORDS = new Set(['a','an','the','of','for','in','at','to','and','or','is','vs','after','when','how','does','can','what','that','with','your','my','do','are','you','should','not','from','this','than','more','will']);
  const GENERIC_WORDS = new Set(['blood','pressure','heart','health','diabetes','sugar','seniors','adults','over','age','high','low','normal']);

  function getSpecificWords(text: string): Set<string> {
    return new Set(
      text.toLowerCase().split(/\s+/)
        .filter(w => w.length > 2 && !STOP_WORDS.has(w) && !GENERIC_WORDS.has(w))
    );
  }

  function pkOverlap(pk1: string, pk2: string): number {
    const w1 = getSpecificWords(pk1);
    const w2 = getSpecificWords(pk2);
    if (w1.size === 0) return 0;
    let common = 0;
    Array.from(w1).forEach(w => { if (w2.has(w)) common++; });
    return common / w1.size;
  }

  const existingPKsForDedup = articles.map((a: any) => (a.primaryKeyword || '').toLowerCase()).filter(Boolean);
  const textFilteredCandidates = [];
  let textDedupRejected = 0;

  for (const candidate of topScoredRaw) {
    // Check vs published articles: reject if >70% specific word overlap
    let maxOverlap = 0;
    for (const epk of existingPKsForDedup) {
      const overlap = pkOverlap(candidate.primaryKeyword, epk);
      if (overlap > maxOverlap) maxOverlap = overlap;
    }
    // Also check vs already accepted candidates in this batch
    for (const accepted of textFilteredCandidates) {
      const overlap = pkOverlap(candidate.primaryKeyword, accepted.primaryKeyword);
      if (overlap > maxOverlap) maxOverlap = overlap;
    }

    if (maxOverlap > 0.7) {
      console.log(`   🚫 Text dedup: "${candidate.title.substring(0, 50)}..." (PK overlap ${(maxOverlap * 100).toFixed(0)}%)`);
      textDedupRejected++;
      continue;
    }
    textFilteredCandidates.push(candidate);
  }
  console.log(`   Stage 1 result: ${textFilteredCandidates.length} passed, ${textDedupRejected} rejected\n`);

  // 阶段2: Embedding精筛（只对通过阶段1的候选调API）
  const needEmbeddingCheck = textFilteredCandidates.slice(0, toGenerate + 5);
  console.log(`🔍 Stage 2: Embedding dedup (${needEmbeddingCheck.length} candidates)...\n`);

  let existingEmbeddings: ArticleEmbedding[] = [];
  try {
    existingEmbeddings = loadArticleEmbeddings();
  } catch { /* ignore */ }

  const topScored: typeof scored = [];
  const TOPIC_DEDUP_THRESHOLD = 0.85;

  if (existingEmbeddings.length > 0) {
    const acceptedEmbeddings: number[][] = [];

    for (const candidate of needEmbeddingCheck) {
      if (topScored.length >= toGenerate) break;

      try {
        const text = buildTopicInputText({
          title: candidate.title,
          description: candidate.description,
          primaryKeyword: candidate.primaryKeyword,
        });
        const emb = await generateEmbeddingForText(text);

        let maxSim = 0;
        let maxSlug = '';
        for (const article of existingEmbeddings) {
          const sim = cosineSimilarity(emb, article.embedding);
          if (sim > maxSim) { maxSim = sim; maxSlug = article.slug; }
        }
        for (const accepted of acceptedEmbeddings) {
          const sim = cosineSimilarity(emb, accepted);
          if (sim > maxSim) { maxSim = sim; maxSlug = '(batch dup)'; }
        }

        if (maxSim > TOPIC_DEDUP_THRESHOLD) {
          console.log(`   🚫 Embedding dedup: "${candidate.title.substring(0, 45)}..." (sim ${maxSim.toFixed(3)} with "${maxSlug.substring(0, 30)}")`);
          continue;
        }

        topScored.push(candidate);
        acceptedEmbeddings.push(emb);
      } catch (err: any) {
        topScored.push(candidate);
        console.warn(`   ⚠️  Embedding failed for "${candidate.title.substring(0, 40)}": ${err.message}, keeping`);
      }

      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n   ✅ Stage 2 result: ${topScored.length} accepted\n`);
  } else {
    topScored.push(...needEmbeddingCheck.slice(0, toGenerate));
    console.log('   ⚠️  No article embeddings found, skipping embedding dedup\n');
  }

  // If still not enough after both stages, fill from text-filtered candidates
  if (topScored.length < toGenerate) {
    for (const c of textFilteredCandidates) {
      if (topScored.length >= toGenerate) break;
      if (!topScored.some(t => t.title === c.title)) {
        topScored.push(c);
      }
    }
  }

  console.log(`Top ${Math.min(10, topScored.length)} scored topics:`);
  for (let i = 0; i < Math.min(10, topScored.length); i++) {
    const t = topScored[i];
    console.log(`  #${i + 1} Score ${t.score.toFixed(0)} | "${t.title.substring(0, 50)}"`);
  }

  // ========================================
  // Step 6: 写入选题库
  // ========================================
  console.log('\n💾 Writing next week\'s topic library...\n');

  const weekNum = getISOWeek(new Date());
  const nextWeek = `${new Date().getFullYear()}-W${weekNum + 1}`;

  // 清空所有选题文件，写入新的
  const categoryKeywords: Record<string, string[]> = {
    'blood pressure': ['blood pressure', 'bp', 'hypertension', 'systolic', 'diastolic', 'nsaid', 'ibuprofen'],
    'diabetes': ['diabetes', 'blood sugar', 'glucose', 'insulin', 'hba1c', 'a1c', 'diabetic'],
    'heart health': ['heart', 'cardiac', 'cardiovascular', 'cholesterol', 'artery', 'palpitation'],
    'cholesterol': ['cholesterol', 'ldl', 'hdl', 'triglyceride', 'statin'],
    'healthy eating for seniors': ['food', 'diet', 'eating', 'nutrition', 'meal', 'breakfast', 'dinner', 'snack', 'soup', 'recipe', 'fiber', 'soft food'],
    'exercise for seniors': ['exercise', 'walking', 'yoga', 'tai chi', 'stretch', 'fitness', 'aerobic', 'chair', 'seated'],
  };

  let totalWritten = 0;

  for (const item of inventory) {
    const keywords = categoryKeywords[item.topic] || [item.topic];

    // 保留的旧选题（score≥30）
    const kept = item.topics.filter(t => (t.score || 0) >= 30);

    // 匹配的新选题（附带该方向的Perplexity数据）
    const pData = perplexityData.get(item.topic);
    const newTopics: PlannedTopic[] = topScored
      .filter(t => {
        const text = `${t.primaryKeyword} ${t.title}`.toLowerCase();
        return keywords.some(kw => text.includes(kw));
      })
      .map(t => ({
        title: t.title,
        description: t.description,
        primaryKeyword: t.primaryKeyword,
        topicCluster: t.topicCluster,
        coreKeyword: item.topic,
        createdAt: new Date().toISOString(),
        score: t.score,
        scheduledWeek: nextWeek,
        ...(pData && pData.questions.length > 0 ? {
          perplexityQuestions: pData.questions.slice(0, 5),
          competitorCoverage: pData.competitorCoverage || undefined,
        } : {}),
      }));

    const combined = [...kept, ...newTopics];
    fs.writeFileSync(item.filePath, JSON.stringify(combined, null, 2), 'utf8');
    console.log(`   ${item.topic}: ${kept.length} kept + ${newTopics.length} new = ${combined.length}`);
    totalWritten += combined.length;
  }

  console.log(`\n✅ Next week's library: ${totalWritten} topics (target: ${WEEKLY_TARGET})`);

  // ========================================
  // Step 7: 输出已有文章优化建议（线B）
  // ========================================
  if (llmAnalysis?.articleOptimizations?.length > 0) {
    console.log(`\n📝 Article Optimization Suggestions: ${llmAnalysis.articleOptimizations.length} articles\n`);
    for (const opt of llmAnalysis.articleOptimizations) {
      console.log(`   ${opt.slug}: "${opt.suggestedTitle}"`);
    }
    saveAnalysis('article-optimizations-pending.json', {
      generatedAt: new Date().toISOString(),
      optimizations: llmAnalysis.articleOptimizations,
    });
  }

  // ========================================
  // Step 8: 保存周报
  // ========================================
  const report = {
    week: nextWeek,
    generatedAt: new Date().toISOString(),
    config: { weeklyTarget: WEEKLY_TARGET, dailyTarget: DAILY_TARGET },
    previousWeek: { remaining: currentTotal, kept: toKeep },
    newGenerated: topScored.length,
    totalWritten,
    gscData: {
      daysAnalyzed: storedDates.length >= 3 ? 7 : 0,
      totalSearchTerms: gscQueries.length,
    },
    llmAnalysis: llmAnalysis ? {
      searchIntentAnalysis: llmAnalysis.searchIntentAnalysis?.substring(0, 500),
      topicPriorities: llmAnalysis.topicPriorities?.substring(0, 500),
      articleOptimizations: llmAnalysis.articleOptimizations?.length || 0,
    } : null,
    perplexityInsights: Object.fromEntries(
      Array.from(perplexityData.entries()).map(([k, v]) => [k, {
        questionsFound: v.questions.length,
        topQuestions: v.questions.slice(0, 10),
        competitorCoverage: v.competitorCoverage,
        whyItMatters: v.whyItMatters,
      }])
    ),
    topTopics: topScored.slice(0, 10).map(t => ({
      title: t.title, pk: t.primaryKeyword, score: t.score,
      breakdown: t.breakdown, reasoning: t.reasoning,
    })),
  };

  saveAnalysis(`weekly-${nextWeek}.json`, report);
  console.log(`\n📄 Report: data/seo/analysis/weekly-${nextWeek}.json\n`);
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
