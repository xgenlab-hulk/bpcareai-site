/**
 * 选题优先级评分系统
 *
 * 每个候选选题得到 0-100 的综合分数：
 * - 搜索需求信号 (0-40): GSC数据中是否有真实搜索需求
 * - 竞争机会 (0-25): 我们是否有排名上升的空间
 * - 时效性 (0-20): 这个方向是否正在上升
 * - 多样性调节 (-15~+15): 防止选题集中在同一方向
 */

import fs from 'fs';
import path from 'path';
import type { DailyRawData, QueryRecord } from './data-store';
import { loadRawDataRange, getStoredDates } from './data-store';

/**
 * 选题候选（来自选题库或临时生成）
 */
export interface TopicCandidate {
  title: string;
  primaryKeyword: string;
  description: string;
  topicCluster: string;
  source: 'topic-library' | 'gsc-trend' | 'gsc-gap' | 'manual';
}

/**
 * 带评分的选题
 */
export interface ScoredTopic extends TopicCandidate {
  score: number;
  breakdown: {
    searchDemand: number;      // 0-40
    competitionOpportunity: number; // 0-25
    timeliness: number;        // 0-20
    diversityAdjust: number;   // -15 to +15
  };
  matchedQuery?: string;        // 匹配到的GSC搜索词
  matchedPosition?: number;     // 该搜索词的当前排名
}

/**
 * 从GSC数据中提取搜索词汇总（最近28天）
 */
function getQueryBaseline(): Map<string, {
  impressions: number;
  clicks: number;
  position: number;
  trend: 'up' | 'down' | 'stable';
}> {
  const dates = getStoredDates();
  if (dates.length === 0) return new Map();

  // 取最近28天
  const last28 = dates.slice(-28);
  const allData = last28.map(d => {
    try {
      return JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'data', 'seo', 'raw', `${d}.json`), 'utf8')
      ) as DailyRawData;
    } catch { return null; }
  }).filter(Boolean) as DailyRawData[];

  if (allData.length === 0) return new Map();

  // 汇总
  const queryMap = new Map<string, {
    impressions: number;
    clicks: number;
    positionWeightedSum: number;
    positionWeight: number;
    recentImpressions: number; // 最近3天
  }>();

  const recentCutoff = allData.length >= 3 ? allData.length - 3 : 0;

  allData.forEach((day, idx) => {
    for (const q of day.queries) {
      const existing = queryMap.get(q.query) || {
        impressions: 0, clicks: 0,
        positionWeightedSum: 0, positionWeight: 0,
        recentImpressions: 0,
      };
      existing.impressions += q.impressions;
      existing.clicks += q.clicks;
      existing.positionWeightedSum += q.position * q.impressions;
      existing.positionWeight += q.impressions;
      if (idx >= recentCutoff) {
        existing.recentImpressions += q.impressions;
      }
      queryMap.set(q.query, existing);
    }
  });

  // 计算趋势
  const result = new Map<string, {
    impressions: number;
    clicks: number;
    position: number;
    trend: 'up' | 'down' | 'stable';
  }>();

  const totalDays = allData.length;
  const recentDays = Math.min(3, totalDays);

  for (const [query, data] of queryMap) {
    const avgPosition = data.positionWeight > 0
      ? data.positionWeightedSum / data.positionWeight
      : 100;

    const baselineDailyAvg = data.impressions / totalDays;
    const recentDailyAvg = data.recentImpressions / recentDays;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (baselineDailyAvg > 0) {
      const ratio = recentDailyAvg / baselineDailyAvg;
      if (ratio >= 1.5) trend = 'up';
      else if (ratio <= 0.5) trend = 'down';
    }

    result.set(query, {
      impressions: data.impressions,
      clicks: data.clicks,
      position: avgPosition,
      trend,
    });
  }

  return result;
}

/**
 * 获取最近7天各cluster的产出数量（用于多样性调节）
 */
function getRecentClusterOutput(): Map<string, number> {
  const articlesDir = path.join(process.cwd(), 'content', 'articles');
  const clusterCount = new Map<string, number>();

  if (!fs.existsSync(articlesDir)) return clusterCount;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const cutoffStr = sevenDaysAgo.toISOString().split('T')[0];

  // 读articles-index获取最近7天的文章
  const indexPath = path.join(process.cwd(), 'data', 'articles-index.json');
  if (!fs.existsSync(indexPath)) return clusterCount;

  try {
    const articles = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    for (const article of articles) {
      if (article.date >= cutoffStr) {
        const cluster = article.topicCluster || 'unknown';
        clusterCount.set(cluster, (clusterCount.get(cluster) || 0) + 1);
      }
    }
  } catch {
    // ignore
  }

  return clusterCount;
}

/**
 * 检查候选选题的PK是否匹配某个GSC搜索词
 *
 * 匹配逻辑：双向匹配，核心实词（去掉停用词和通用词后）双方都要有≥60%重叠
 * 通用词（blood, pressure, heart等）单独匹配不算，必须有更具体的词重叠
 */
function findMatchingQuery(
  pk: string,
  queryBaseline: Map<string, { impressions: number; clicks: number; position: number; trend: string }>
): { query: string; data: { impressions: number; clicks: number; position: number; trend: string } } | null {
  const stopWords = new Set([
    'a', 'an', 'the', 'of', 'for', 'in', 'at', 'to', 'and', 'or', 'is', 'vs',
    'after', 'when', 'how', 'does', 'can', 'what', 'that', 'with', 'your', 'my',
    'do', 'are', 'you', 'should', 'not', 'from', 'this', 'than', 'more', 'will',
  ]);
  // 通用健康领域词——单独匹配这些不算精确匹配
  const genericWords = new Set([
    'blood', 'pressure', 'heart', 'health', 'diabetes', 'sugar', 'seniors',
    'adults', 'over', 'age', 'high', 'low', 'normal',
  ]);

  const extractCoreWords = (text: string): { allWords: Set<string>; specificWords: Set<string> } => {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
    const allWords = new Set(words);
    const specificWords = new Set(words.filter(w => !genericWords.has(w)));
    return { allWords, specificWords };
  };

  const pkParts = extractCoreWords(pk);

  let bestMatch: { query: string; data: any; score: number } | null = null;

  for (const [query, data] of queryBaseline) {
    const queryParts = extractCoreWords(query);

    // 计算全词重叠
    let commonAll = 0;
    for (const word of pkParts.allWords) {
      if (queryParts.allWords.has(word)) commonAll++;
    }

    // 计算特定词重叠（不含通用词）
    let commonSpecific = 0;
    for (const word of pkParts.specificWords) {
      if (queryParts.specificWords.has(word)) commonSpecific++;
    }

    // 双向重叠率
    const pkOverlap = pkParts.allWords.size > 0 ? commonAll / pkParts.allWords.size : 0;
    const queryOverlap = queryParts.allWords.size > 0 ? commonAll / queryParts.allWords.size : 0;

    // 必须双方都有≥50%全词重叠，且至少有1个特定词重叠
    if (pkOverlap >= 0.5 && queryOverlap >= 0.3 && commonSpecific >= 1) {
      const score = (pkOverlap + queryOverlap) / 2 * commonSpecific * data.impressions;

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { query, data, score };
      }
    }
  }

  return bestMatch ? { query: bestMatch.query, data: bestMatch.data } : null;
}

/**
 * 为一批候选选题计算优先级分数
 */
export function scoreTopics(candidates: TopicCandidate[]): ScoredTopic[] {
  const queryBaseline = getQueryBaseline();
  const recentClusterOutput = getRecentClusterOutput();

  // 计算展示量的百分位（用于搜索需求评分）
  const allImpressions = Array.from(queryBaseline.values()).map(v => v.impressions).sort((a, b) => a - b);
  const p90Impressions = allImpressions.length > 0
    ? allImpressions[Math.floor(allImpressions.length * 0.9)]
    : 0;
  const p50Impressions = allImpressions.length > 0
    ? allImpressions[Math.floor(allImpressions.length * 0.5)]
    : 0;

  const scored: ScoredTopic[] = candidates.map(candidate => {
    // === 维度1: 搜索需求信号 (0-40) ===
    let searchDemand = 0;
    let matchedQuery: string | undefined;
    let matchedPosition: number | undefined;

    const match = findMatchingQuery(candidate.primaryKeyword, queryBaseline);
    if (match) {
      matchedQuery = match.query;
      matchedPosition = match.data.position;

      if (match.data.impressions >= p90Impressions && p90Impressions > 0) {
        searchDemand = 35 + Math.min((match.data.impressions / p90Impressions - 1) * 5, 5);
      } else if (match.data.impressions >= p50Impressions && p50Impressions > 0) {
        searchDemand = 20 + (match.data.impressions / p90Impressions) * 15;
      } else {
        searchDemand = 10 + (match.data.impressions / Math.max(p50Impressions, 1)) * 10;
      }
    } else if (candidate.source === 'gsc-trend' || candidate.source === 'gsc-gap') {
      searchDemand = 12; // GSC信号推断，但没有精确匹配
    } else {
      searchDemand = 5; // 纯LLM生成，无数据支撑
    }
    searchDemand = Math.min(Math.max(searchDemand, 0), 40);

    // === 维度2: 竞争机会 (0-25) ===
    let competitionOpportunity = 0;
    if (matchedPosition) {
      if (matchedPosition >= 11 && matchedPosition <= 20) {
        competitionOpportunity = 20 + Math.min((20 - matchedPosition) / 10 * 5, 5); // 近达机会
      } else if (matchedPosition >= 21 && matchedPosition <= 50) {
        competitionOpportunity = 10 + (50 - matchedPosition) / 30 * 10;
      } else if (matchedPosition > 50) {
        competitionOpportunity = 5 + Math.min(5, (100 - matchedPosition) / 50 * 5);
      } else if (matchedPosition <= 10) {
        competitionOpportunity = 3; // 已经排名不错，不急
      }
    } else {
      // 没有匹配到GSC数据 = 内容缺口
      competitionOpportunity = 17; // 中等分数，新机会
    }
    competitionOpportunity = Math.min(Math.max(competitionOpportunity, 0), 25);

    // === 维度3: 时效性 (0-20) ===
    let timeliness = 6; // 默认：常青内容
    if (match) {
      if (match.data.trend === 'up') {
        timeliness = 15;
      } else if (match.data.trend === 'down') {
        timeliness = 2;
      } else {
        timeliness = 7;
      }
    }
    if (candidate.source === 'gsc-trend') {
      timeliness = Math.max(timeliness, 18); // 趋势来源加分
    }
    timeliness = Math.min(Math.max(timeliness, 0), 20);

    // === 维度4: 多样性调节 (-15 ~ +15) ===
    let diversityAdjust = 0;
    const clusterOutput = recentClusterOutput.get(candidate.topicCluster) || 0;
    if (clusterOutput === 0) {
      diversityAdjust = 12; // 最近没有产出，鼓励
    } else if (clusterOutput === 1) {
      diversityAdjust = 0;  // 正常
    } else if (clusterOutput === 2) {
      diversityAdjust = -8;
    } else {
      diversityAdjust = -13; // 过度集中，惩罚
    }

    const score = searchDemand + competitionOpportunity + timeliness + diversityAdjust;

    return {
      ...candidate,
      score: Math.max(0, Math.min(100, score)),
      breakdown: {
        searchDemand: Math.round(searchDemand * 10) / 10,
        competitionOpportunity: Math.round(competitionOpportunity * 10) / 10,
        timeliness: Math.round(timeliness * 10) / 10,
        diversityAdjust,
      },
      matchedQuery,
      matchedPosition,
    };
  });

  // 按分数排序
  scored.sort((a, b) => b.score - a.score);

  return scored;
}
