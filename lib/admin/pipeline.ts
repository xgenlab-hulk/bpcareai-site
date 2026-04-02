/**
 * Pipeline 数据读取层
 * 从文件系统读取 GSC 分析、Perplexity 情报、选题库等数据
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SEO_DIR = path.join(DATA_DIR, 'seo');
const RAW_DIR = path.join(SEO_DIR, 'raw');
const ANALYSIS_DIR = path.join(SEO_DIR, 'analysis');

// ============================================================
// 类型定义
// ============================================================

export interface DailyGSCSummary {
  date: string;
  totalQueries: number;
  totalImpressions: number;
  totalClicks: number;
  avgPosition: number;
  topQueries: Array<{
    query: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  }>;
  topPages: Array<{
    page: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  }>;
}

export interface TrendAlert {
  type: 'SURGE' | 'NEW_QUERY' | 'RANK_JUMP';
  query: string;
  reason: string;
  score: number;
  recentImpressions: number;
  baselineImpressions: number;
  recentPosition?: number;
  baselinePosition?: number;
}

export interface DailyAnalysis {
  date: string;
  period: string;
  impressionsChange: number;
  clicksChange: number;
  newQueries: string[];
  risingQueries: Array<{
    query: string;
    recentImpressions: number;
    baselineImpressions: number;
    changeRatio: number;
  }>;
  alerts: TrendAlert[];
}

export interface UrgentTopic {
  title: string;
  primaryKeyword: string;
  description: string;
  topicCluster: string;
  reasoning: string;
  query: string;
  type: string;
  score: number;
  perplexityQuestions: string[];
  createdAt: string;
  expiresAt: string;
}

export interface PlannedTopicInfo {
  title: string;
  description: string;
  primaryKeyword: string;
  topicCluster: string;
  coreKeyword: string;
  score?: number;
  scheduledWeek?: string;
  perplexityQuestions?: string[];
  competitorCoverage?: string;
}

export interface TopicInventoryItem {
  category: string;
  count: number;
  topics: PlannedTopicInfo[];
}

export interface WeeklyReport {
  week: string;
  generatedAt: string;
  config?: { weeklyTarget: number; dailyTarget: number };
  previousWeek?: { remaining: number; kept: number };
  newGenerated?: number;
  totalWritten?: number;
  gscData?: {
    daysAnalyzed: number;
    totalSearchTerms: number;
    totalImpressions?: number;
    topOpportunities?: Array<{ query: string; impressions: number; position: number }>;
  };
  llmAnalysis?: {
    searchIntentAnalysis?: string;
    ctrAnomalies?: string;
    hiddenOpportunities?: string;
    topicPriorities?: any;
    articleOptimizations?: number | Array<any>;
  };
  perplexityInsights?: Record<string, {
    questionsFound: number;
    topQuestions: string[];
    competitorCoverage: string;
    whyItMatters: string;
  }>;
  topTopics?: Array<{
    title: string;
    pk: string;
    score: number;
    breakdown?: { clusterNeed: number; searchDemand: number; differentiation: number; timeliness: number };
    reasoning?: string;
  }>;
  // 旧格式兼容
  candidates?: Array<any>;
  topicsAdded?: number;
  libraryStatus?: Array<any>;
}

export interface ArticleRecord {
  title: string;
  slug: string;
  description: string;
  primaryKeyword: string;
  topicCluster: string;
  date: string;
}

export interface MonthlyGrowth {
  month: string;
  impressions: number;
  clicks: number;
  queries: number;
  pages: number;
}

export interface PipelineOverview {
  gscDataDays: number;
  latestGSCDate: string | null;
  topicInventory: TopicInventoryItem[];
  topicTotal: number;
  urgentTopics: UrgentTopic[];
  recentArticles: ArticleRecord[];
  latestDailyAnalysis: DailyAnalysis | null;
  latestWeeklyReport: WeeklyReport | null;
  availableDailyDates: string[];
  availableWeeks: string[];
  monthlyGrowth: MonthlyGrowth[];
}

// ============================================================
// 数据读取函数
// ============================================================

/**
 * 获取所有存储的 GSC 日期
 */
export function getAvailableDates(): string[] {
  if (!fs.existsSync(RAW_DIR)) return [];
  return fs.readdirSync(RAW_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
    .sort();
}

/**
 * 获取所有每日分析的日期
 */
export function getAvailableDailyAnalysisDates(): string[] {
  if (!fs.existsSync(ANALYSIS_DIR)) return [];
  return fs.readdirSync(ANALYSIS_DIR)
    .filter(f => f.startsWith('daily-') && f.endsWith('.json'))
    .map(f => f.replace('daily-', '').replace('.json', ''))
    .sort()
    .reverse();
}

/**
 * 获取所有周报的周次
 */
export function getAvailableWeeks(): string[] {
  if (!fs.existsSync(ANALYSIS_DIR)) return [];
  return fs.readdirSync(ANALYSIS_DIR)
    .filter(f => f.startsWith('weekly-') && f.endsWith('.json'))
    .map(f => f.replace('weekly-', '').replace('.json', ''))
    .sort()
    .reverse();
}

/**
 * 读取某一天的 GSC 原始数据
 */
export function getDailyGSCData(date: string): DailyGSCSummary | null {
  const filePath = path.join(RAW_DIR, `${date}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return {
      date: data.date,
      totalQueries: data.summary?.totalQueries || 0,
      totalImpressions: data.summary?.totalImpressions || 0,
      totalClicks: data.summary?.totalClicks || 0,
      avgPosition: data.summary?.avgPosition || 0,
      topQueries: (data.queries || [])
        .sort((a: any, b: any) => b.impressions - a.impressions)
        .slice(0, 20)
        .map((q: any) => ({
          query: q.query,
          impressions: q.impressions,
          clicks: q.clicks,
          ctr: q.impressions > 0 ? +(q.clicks / q.impressions * 100).toFixed(1) : 0,
          position: +q.position.toFixed(1),
        })),
      topPages: (data.pages || [])
        .sort((a: any, b: any) => b.impressions - a.impressions)
        .slice(0, 10)
        .map((p: any) => ({
          page: p.page,
          impressions: p.impressions,
          clicks: p.clicks,
          ctr: p.impressions > 0 ? +(p.clicks / p.impressions * 100).toFixed(1) : 0,
          position: +p.position.toFixed(1),
        })),
    };
  } catch { return null; }
}

/**
 * 读取某一天的趋势分析
 */
export function getDailyAnalysis(date: string): DailyAnalysis | null {
  const filePath = path.join(ANALYSIS_DIR, `daily-${date}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch { return null; }
}

/**
 * 读取紧急选题
 */
export function getUrgentTopics(): UrgentTopic[] {
  const filePath = path.join(SEO_DIR, 'urgent-topics.json');
  if (!fs.existsSync(filePath)) return [];

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const now = new Date().toISOString();
    return data.filter((t: any) => t.expiresAt > now);
  } catch { return []; }
}

/**
 * 读取选题库存
 */
export function getTopicInventory(): TopicInventoryItem[] {
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.startsWith('planned-topics-') && f.endsWith('.json'));

  return files.map(f => {
    const category = f.replace('planned-topics-', '').replace('.json', '').replace(/-/g, ' ');
    try {
      const topics = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
      return { category, count: topics.length, topics };
    } catch {
      return { category, count: 0, topics: [] };
    }
  }).sort((a, b) => b.count - a.count);
}

/**
 * 读取周报
 */
export function getWeeklyReport(week: string): WeeklyReport | null {
  const filePath = path.join(ANALYSIS_DIR, `weekly-${week}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch { return null; }
}

/**
 * 获取最近 N 天生成的文章
 */
export function getRecentArticles(days: number = 7): ArticleRecord[] {
  const indexPath = path.join(DATA_DIR, 'articles-index.json');
  if (!fs.existsSync(indexPath)) return [];

  try {
    const articles = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    return articles
      .filter((a: any) => a.date >= cutoffStr)
      .sort((a: any, b: any) => b.date.localeCompare(a.date))
      .map((a: any) => ({
        title: a.title,
        slug: a.slug,
        description: a.description || '',
        primaryKeyword: a.primaryKeyword || '',
        topicCluster: a.topicCluster || '',
        date: a.date,
      }));
  } catch { return []; }
}

/**
 * 获取指定日期生成的文章
 */
export function getArticlesByDate(date: string): ArticleRecord[] {
  const indexPath = path.join(DATA_DIR, 'articles-index.json');
  if (!fs.existsSync(indexPath)) return [];

  try {
    const articles = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    return articles
      .filter((a: any) => a.date === date)
      .map((a: any) => ({
        title: a.title,
        slug: a.slug,
        description: a.description || '',
        primaryKeyword: a.primaryKeyword || '',
        topicCluster: a.topicCluster || '',
        date: a.date,
      }));
  } catch { return []; }
}

/**
 * 文章优化建议
 */
export interface ArticleOptimizationSuggestion {
  slug: string;
  currentTitle: string;
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedPK: string;
  reason: string;
}

/**
 * 90天基线报告
 */
export interface BaselineReport {
  reportDate: string;
  dataRange: string;
  overallGrowth: Record<string, {
    impressions: number;
    clicks: number;
    queries: number;
    pages: number;
  }>;
}

/**
 * 读取文章优化建议
 */
export function getArticleOptimizations(): { generatedAt: string; optimizations: ArticleOptimizationSuggestion[] } | null {
  const filePath = path.join(ANALYSIS_DIR, 'article-optimizations-pending.json');
  if (!fs.existsSync(filePath)) return null;

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch { return null; }
}

/**
 * 读取90天基线报告
 */
export function getBaselineReport(): BaselineReport | null {
  const filePath = path.join(ANALYSIS_DIR, 'baseline-90day-report.json');
  if (!fs.existsSync(filePath)) return null;

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch { return null; }
}

/**
 * 读取LLM深度分析完整版（markdown）
 */
export function getLLMDeepAnalysis(): string | null {
  const filePath = path.join(ANALYSIS_DIR, 'llm-deep-analysis.md');
  if (!fs.existsSync(filePath)) return null;

  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch { return null; }
}

/**
 * 从 data/seo/raw/ 动态计算月度增长数据
 */
export function getMonthlyGrowth(): MonthlyGrowth[] {
  if (!fs.existsSync(RAW_DIR)) return [];

  const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.json'));
  // month -> { impressions, clicks, querySet, pageSet }
  const monthMap: Record<string, { impressions: number; clicks: number; querySet: Set<string>; pageSet: Set<string> }> = {};

  files.forEach(f => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(RAW_DIR, f), 'utf8'));
      const date: string = data.date || f.replace('.json', '');
      const month = date.substring(0, 7); // "2025-12"

      if (!monthMap[month]) {
        monthMap[month] = { impressions: 0, clicks: 0, querySet: new Set(), pageSet: new Set() };
      }
      const entry = monthMap[month];
      entry.impressions += data.summary?.totalImpressions || 0;
      entry.clicks += data.summary?.totalClicks || 0;

      const queries: any[] = data.queries || [];
      queries.forEach((q: any) => { if (q.query) entry.querySet.add(q.query); });

      const pages: any[] = data.pages || [];
      pages.forEach((p: any) => { if (p.page) entry.pageSet.add(p.page); });
    } catch { /* skip bad files */ }
  });

  const months = Object.keys(monthMap).sort();
  return months.map(month => ({
    month,
    impressions: monthMap[month].impressions,
    clicks: monthMap[month].clicks,
    queries: monthMap[month].querySet.size,
    pages: monthMap[month].pageSet.size,
  }));
}

/**
 * 获取 Pipeline 总览数据
 */
export function getPipelineOverview(): PipelineOverview {
  const availableDates = getAvailableDates();
  const availableDailyDates = getAvailableDailyAnalysisDates();
  const availableWeeks = getAvailableWeeks();
  const topicInventory = getTopicInventory();

  // 最新的每日分析
  let latestDailyAnalysis: DailyAnalysis | null = null;
  if (availableDailyDates.length > 0) {
    latestDailyAnalysis = getDailyAnalysis(availableDailyDates[0]);
  }

  // 最新的周报
  let latestWeeklyReport: WeeklyReport | null = null;
  if (availableWeeks.length > 0) {
    latestWeeklyReport = getWeeklyReport(availableWeeks[0]);
  }

  return {
    gscDataDays: availableDates.length,
    latestGSCDate: availableDates.length > 0 ? availableDates[availableDates.length - 1] : null,
    topicInventory,
    topicTotal: topicInventory.reduce((sum, item) => sum + item.count, 0),
    urgentTopics: getUrgentTopics(),
    recentArticles: getRecentArticles(7),
    latestDailyAnalysis,
    latestWeeklyReport,
    availableDailyDates,
    availableWeeks,
    monthlyGrowth: getMonthlyGrowth(),
  };
}
