/**
 * 选题优先级评分系统 v2
 *
 * 服务于两条线：
 * - 线1（稳定线）：每周评分，更新选题库优先级
 * - 线2（应急线）：每天快速评分，判断突发趋势选题的价值
 *
 * 评分维度（0-100）：
 * - 主题集群覆盖需求 (0-30): 该集群是否需要更多内容来建立权威
 * - 搜索需求验证 (0-25): GSC/Perplexity是否有真实搜索需求
 * - 内容差异化 (0-25): 与已有文章的角度是否不同
 * - 时效性+趋势 (0-20): 是否有上升趋势或时间窗口
 */

import fs from 'fs';
import path from 'path';
import type { DailyRawData } from './data-store';
import { getStoredDates } from './data-store';

// ============================================================
// 类型定义
// ============================================================

export interface TopicCandidate {
  title: string;
  primaryKeyword: string;
  description: string;
  topicCluster: string;
  source: 'topic-library' | 'gsc-trend' | 'gsc-gap' | 'weekly-refresh' | 'manual';
}

export interface ScoredTopic extends TopicCandidate {
  score: number;
  breakdown: {
    clusterNeed: number;       // 0-30
    searchDemand: number;      // 0-25
    differentiation: number;   // 0-25
    timeliness: number;        // 0-20
  };
  matchedQuery?: string;
  reasoning: string;           // 人可读的评分理由
}

// 主题集群定义：基于GSC 90天数据分析确定的优先级和目标
// P1 = 最大机会（GSC有信号+大缺口），P2 = 有数据支撑的新方向，P3 = 加强已有优势
const CLUSTER_TARGETS: Record<string, { target: number; priority: string; keywords: string[] }> = {
  // P1: exercise-induced-bp有947次展示(最高)，lifestyle集群只有46篇(77%缺口)，且indoor-heating-bp CTR 3.1%(最高)
  'lifestyle-interventions': { target: 200, priority: 'P1', keywords: ['exercise', 'walking', 'yoga', 'fitness', 'weight', 'sleep', 'stress', 'breathing', 'indoor', 'heating', 'weather'] },
  // P1: HbA1c方向41展示+趋势急升+已有好排名(5.4)，快速扩大机会
  'diabetes-management': { target: 500, priority: 'P1', keywords: ['diabetes', 'blood sugar', 'glucose', 'insulin', 'hba1c', 'a1c', 'diabetic'] },
  // P2: cholesterol 8篇文章有搜索信号但近期趋势下降；soft foods 17个搜索变体完全未覆盖
  'nutrition-diet-management': { target: 400, priority: 'P2', keywords: ['food', 'diet', 'eating', 'nutrition', 'meal', 'salt', 'sodium', 'fiber', 'soft food', 'soup', 'cholesterol'] },
  // P2: cardiovascular-health 41%缺口，nocturia/heart failure有12次展示
  'cardiovascular-health': { target: 300, priority: 'P2', keywords: ['heart', 'cardiac', 'cardiovascular', 'artery', 'nocturia', 'palpitation'] },
  // P3: 已有476篇+NSAIDs排名好但0点击（需优化已有文章而非写新的）
  'hypertension-management': { target: 600, priority: 'P3', keywords: ['blood pressure', 'hypertension', 'bp', 'systolic', 'diastolic', 'nsaid'] },
  // P3: 药物安全方向GSC有信号，但文章已有54篇
  'medication-safety': { target: 150, priority: 'P3', keywords: ['medication', 'medicine', 'drug', 'pill', 'supplement', 'side effect'] },
};

// ============================================================
// 数据读取
// ============================================================

/**
 * 获取每个cluster的当前文章数量
 */
function getClusterArticleCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  const indexPath = path.join(process.cwd(), 'data', 'articles-index.json');
  if (!fs.existsSync(indexPath)) return counts;

  try {
    const articles = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    for (const article of articles) {
      const cluster = article.topicCluster || 'unknown';
      counts.set(cluster, (counts.get(cluster) || 0) + 1);
    }
  } catch { /* ignore */ }

  return counts;
}

/**
 * 获取已有文章的PK列表（用于差异化检查）
 */
function getExistingPKs(): string[] {
  const indexPath = path.join(process.cwd(), 'data', 'articles-index.json');
  if (!fs.existsSync(indexPath)) return [];

  try {
    const articles = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    return articles.map((a: any) => (a.primaryKeyword || '').toLowerCase().trim()).filter(Boolean);
  } catch { return []; }
}

/**
 * 从GSC数据中提取搜索词汇总
 */
function getQueryBaseline(): Map<string, {
  impressions: number;
  clicks: number;
  position: number;
  trend: 'up' | 'down' | 'stable';
}> {
  const dates = getStoredDates();
  if (dates.length === 0) return new Map();

  const last28 = dates.slice(-28);
  const allData = last28.map(d => {
    try {
      return JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'data', 'seo', 'raw', `${d}.json`), 'utf8')
      ) as DailyRawData;
    } catch { return null; }
  }).filter(Boolean) as DailyRawData[];

  if (allData.length === 0) return new Map();

  const queryMap = new Map<string, {
    impressions: number; clicks: number;
    posSum: number; posWeight: number;
    recentImpr: number;
  }>();

  const recentCutoff = Math.max(allData.length - 3, 0);

  allData.forEach((day, idx) => {
    for (const q of day.queries) {
      const e = queryMap.get(q.query) || { impressions: 0, clicks: 0, posSum: 0, posWeight: 0, recentImpr: 0 };
      e.impressions += q.impressions;
      e.clicks += q.clicks;
      e.posSum += q.position * q.impressions;
      e.posWeight += q.impressions;
      if (idx >= recentCutoff) e.recentImpr += q.impressions;
      queryMap.set(q.query, e);
    }
  });

  const result = new Map<string, { impressions: number; clicks: number; position: number; trend: 'up' | 'down' | 'stable' }>();
  const totalDays = allData.length;
  const recentDays = Math.min(3, totalDays);

  for (const [query, d] of queryMap) {
    const position = d.posWeight > 0 ? d.posSum / d.posWeight : 100;
    const baseDailyAvg = d.impressions / totalDays;
    const recentDailyAvg = d.recentImpr / recentDays;
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (baseDailyAvg > 0) {
      const ratio = recentDailyAvg / baseDailyAvg;
      if (ratio >= 1.5) trend = 'up';
      else if (ratio <= 0.5) trend = 'down';
    }
    result.set(query, { impressions: d.impressions, clicks: d.clicks, position, trend });
  }

  return result;
}

/**
 * 获取最近7天各cluster的文章产出数
 */
function getRecentOutput(): Map<string, number> {
  const counts = new Map<string, number>();
  const indexPath = path.join(process.cwd(), 'data', 'articles-index.json');
  if (!fs.existsSync(indexPath)) return counts;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  try {
    const articles = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    for (const a of articles) {
      if (a.date >= cutoffStr) {
        counts.set(a.topicCluster || 'unknown', (counts.get(a.topicCluster || 'unknown') || 0) + 1);
      }
    }
  } catch { /* ignore */ }

  return counts;
}

// ============================================================
// 匹配逻辑
// ============================================================

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'of', 'for', 'in', 'at', 'to', 'and', 'or', 'is', 'vs',
  'after', 'when', 'how', 'does', 'can', 'what', 'that', 'with', 'your', 'my',
  'do', 'are', 'you', 'should', 'not', 'from', 'this', 'than', 'more', 'will',
]);

const GENERIC_WORDS = new Set([
  'blood', 'pressure', 'heart', 'health', 'diabetes', 'sugar', 'seniors',
  'adults', 'over', 'age', 'high', 'low', 'normal',
]);

function extractWords(text: string): { all: Set<string>; specific: Set<string> } {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
  return {
    all: new Set(words),
    specific: new Set(words.filter(w => !GENERIC_WORDS.has(w))),
  };
}

/**
 * 在GSC搜索词中找最佳匹配
 *
 * 两层匹配：
 * - 精确匹配：至少2个特定词重叠（高置信度）
 * - 方向匹配：至少1个特定词 + 1个通用词重叠（低置信度，但说明方向相关）
 */
function findBestGSCMatch(
  pk: string,
  baseline: Map<string, { impressions: number; clicks: number; position: number; trend: string }>
): { query: string; impressions: number; clicks: number; position: number; trend: string; matchType: 'exact' | 'direction' } | null {
  const pkW = extractWords(pk);
  let bestExact: { query: string; data: any; score: number } | null = null;
  let bestDirection: { query: string; data: any; score: number } | null = null;

  for (const [query, data] of baseline) {
    const qW = extractWords(query);

    let commonSpec = 0;
    for (const w of Array.from(pkW.specific)) { if (qW.specific.has(w)) commonSpec++; }

    let commonAll = 0;
    for (const w of Array.from(pkW.all)) { if (qW.all.has(w)) commonAll++; }

    const pkOverlap = pkW.all.size > 0 ? commonAll / pkW.all.size : 0;
    const qOverlap = qW.all.size > 0 ? commonAll / qW.all.size : 0;

    // 精确匹配：至少2个特定词 + 双向≥40%
    if (commonSpec >= 2 && pkOverlap >= 0.4 && qOverlap >= 0.3) {
      const score = commonSpec * (pkOverlap + qOverlap) * data.impressions;
      if (!bestExact || score > bestExact.score) {
        bestExact = { query, data, score };
      }
    }
    // 方向匹配：至少1个特定词 + 至少2个总词重叠
    else if (commonSpec >= 1 && commonAll >= 2) {
      const score = commonAll * data.impressions;
      if (!bestDirection || score > bestDirection.score) {
        bestDirection = { query, data, score };
      }
    }
  }

  if (bestExact) return { query: bestExact.query, ...bestExact.data, matchType: 'exact' };
  if (bestDirection) return { query: bestDirection.query, ...bestDirection.data, matchType: 'direction' };
  return null;
}

/**
 * 计算PK与已有PK列表的最大词级重叠率
 */
function calcMaxPKOverlap(pk: string, existingPKs: string[]): number {
  const pkW = extractWords(pk);
  let maxOverlap = 0;

  for (const existing of existingPKs) {
    const exW = extractWords(existing);
    let commonSpec = 0;
    for (const w of pkW.specific) { if (exW.specific.has(w)) commonSpec++; }

    const overlap = pkW.specific.size > 0 ? commonSpec / pkW.specific.size : 0;
    if (overlap > maxOverlap) maxOverlap = overlap;
  }

  return maxOverlap;
}

/**
 * 判断选题属于哪个核心主题集群
 */
function resolveCluster(candidate: TopicCandidate): string {
  const text = `${candidate.primaryKeyword} ${candidate.title}`.toLowerCase();

  for (const [cluster, config] of Object.entries(CLUSTER_TARGETS)) {
    for (const kw of config.keywords) {
      if (text.includes(kw)) return cluster;
    }
  }

  return candidate.topicCluster; // 无法映射则保留原值
}

// ============================================================
// 评分函数
// ============================================================

export function scoreTopics(candidates: TopicCandidate[]): ScoredTopic[] {
  const clusterCounts = getClusterArticleCounts();
  const existingPKs = getExistingPKs();
  const queryBaseline = getQueryBaseline();
  const recentOutput = getRecentOutput();

  return candidates.map(candidate => {
    const cluster = resolveCluster(candidate);
    const reasons: string[] = [];

    // === 维度1: 主题集群覆盖需求 (0-30) ===
    let clusterNeed = 0;
    const clusterConfig = CLUSTER_TARGETS[cluster];
    if (clusterConfig) {
      const currentCount = clusterCounts.get(cluster) || 0;
      const gapRatio = 1 - (currentCount / clusterConfig.target);

      if (gapRatio > 0.5) {
        clusterNeed = 25 + Math.min(gapRatio * 10, 5); // 大缺口
        reasons.push(`${cluster}集群覆盖率${((1 - gapRatio) * 100).toFixed(0)}%，大缺口`);
      } else if (gapRatio > 0.2) {
        clusterNeed = 15 + gapRatio * 20;
        reasons.push(`${cluster}集群覆盖率${((1 - gapRatio) * 100).toFixed(0)}%，中等缺口`);
      } else if (gapRatio > 0) {
        clusterNeed = 5 + gapRatio * 50;
        reasons.push(`${cluster}集群接近目标`);
      } else {
        clusterNeed = 3; // 已达标，但持续产出仍有价值
        reasons.push(`${cluster}集群已达标`);
      }

      // 最近7天该集群产出过多则减分
      const recentCount = recentOutput.get(cluster) || 0;
      if (recentCount >= 3) {
        clusterNeed = Math.max(0, clusterNeed - 8);
        reasons.push(`近7天已产出${recentCount}篇，适度减分`);
      }
    } else {
      clusterNeed = 10; // 非核心集群，基础分
      reasons.push(`非核心集群，基础分`);
    }

    // === 维度2: 搜索需求验证 (0-25) ===
    let searchDemand = 0;
    let matchedQuery: string | undefined;

    const match = findBestGSCMatch(candidate.primaryKeyword, queryBaseline);
    if (match) {
      matchedQuery = match.query;

      // 基础分：按展示量
      let baseDemand = 0;
      if (match.matchType === 'exact') {
        if (match.impressions >= 10) {
          baseDemand = 18 + Math.min(match.impressions / 5, 3);
          reasons.push(`GSC精确匹配"${match.query}"(${match.impressions}次展示)`);
        } else if (match.impressions >= 5) {
          baseDemand = 12 + match.impressions;
          reasons.push(`GSC精确匹配"${match.query}"(${match.impressions}次展示)`);
        } else {
          baseDemand = 8 + match.impressions * 2;
          reasons.push(`GSC精确匹配"${match.query}"(${match.impressions}次展示)，弱信号`);
        }
      } else {
        if (match.impressions >= 5) {
          baseDemand = 10 + Math.min(match.impressions, 5);
          reasons.push(`GSC方向相关"${match.query}"(${match.impressions}次展示)`);
        } else {
          baseDemand = 7 + match.impressions;
          reasons.push(`GSC方向相关"${match.query}"(${match.impressions}次展示)，微弱信号`);
        }
      }

      // 点击加成：有点击说明用户真的有兴趣，比纯展示更有价值
      if (match.clicks > 0) {
        baseDemand += Math.min(match.clicks * 3, 6);
        reasons.push(`有${match.clicks}次点击(用户验证的需求)`);
      } else if (match.impressions >= 10) {
        // 高展示0点击 — 说明展示多但不吸引人，可能需要优化标题而非新文章
        reasons.push(`高展示0点击(标题可能需优化)`);
      }

      searchDemand = baseDemand;
    } else if (candidate.source === 'gsc-trend' || candidate.source === 'gsc-gap') {
      searchDemand = 12;
      reasons.push(`来自GSC分析，有间接信号`);
    } else if (candidate.source === 'weekly-refresh') {
      searchDemand = 8;
      reasons.push(`来自周度分析推荐`);
    } else {
      searchDemand = 4;
      reasons.push(`无搜索数据支撑`);
    }

    // === 维度3: 内容差异化 (0-25) ===
    let differentiation = 0;
    const maxOverlap = calcMaxPKOverlap(candidate.primaryKeyword, existingPKs);

    if (maxOverlap <= 0.3) {
      differentiation = 22 + Math.round((1 - maxOverlap) * 3);
      reasons.push(`与已有文章高度差异化(重叠${(maxOverlap * 100).toFixed(0)}%)`);
    } else if (maxOverlap <= 0.5) {
      differentiation = 15 + Math.round((1 - maxOverlap) * 10);
      reasons.push(`与已有文章有差异(重叠${(maxOverlap * 100).toFixed(0)}%)`);
    } else if (maxOverlap <= 0.7) {
      differentiation = 8;
      reasons.push(`与已有文章有一定重叠(${(maxOverlap * 100).toFixed(0)}%)，可能cannibalize`);
    } else {
      differentiation = 2;
      reasons.push(`与已有文章高度重叠(${(maxOverlap * 100).toFixed(0)}%)，风险高`);
    }

    // === 维度4: 时效性+趋势 (0-20) ===
    let timeliness = 6; // 常青内容默认
    if (match && match.trend === 'up') {
      timeliness = 16;
      reasons.push(`搜索趋势上升中`);
    } else if (match && match.trend === 'down') {
      timeliness = 2;
      reasons.push(`搜索趋势下降`);
    }
    if (candidate.source === 'gsc-trend') {
      timeliness = 19;
      reasons.push(`突发趋势选题，时效性最高`);
    }

    const score = Math.max(0, Math.min(100, clusterNeed + searchDemand + differentiation + timeliness));

    return {
      ...candidate,
      topicCluster: cluster,
      score,
      breakdown: {
        clusterNeed: Math.round(clusterNeed * 10) / 10,
        searchDemand: Math.round(searchDemand * 10) / 10,
        differentiation: Math.round(differentiation * 10) / 10,
        timeliness: Math.round(timeliness * 10) / 10,
      },
      matchedQuery,
      reasoning: reasons.join(' | '),
    };
  }).sort((a, b) => b.score - a.score);
}
