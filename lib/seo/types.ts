/**
 * SEO 数据类型定义
 * 用于 Google Search Console API 和本地数据存储
 */

/**
 * GSC API 查询参数
 */
export interface GSCQuery {
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;
  dimensions?: ('page' | 'query' | 'date')[];
  rowLimit?: number;
  startRow?: number;
}

/**
 * GSC API 返回的单行数据
 */
export interface GSCRow {
  keys?: string[]; // [page_url, query, date] 根据 dimensions
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/**
 * GSC API 响应
 */
export interface GSCResponse {
  rows?: GSCRow[];
  responseAggregationType?: string;
}

/**
 * 每日指标数据
 */
export interface DailyMetrics {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/**
 * 网站级 SEO 指标（本地存储格式）
 */
export interface SEOMetricsData {
  lastUpdated: string;
  dateRange: {
    start: string;
    end: string;
  };
  daily: DailyMetrics[];
  summary?: {
    last7Days: {
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    };
    last30Days: {
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    };
    last90Days: {
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    };
  };
}

/**
 * 文章级 SEO 指标
 */
export interface ArticleSEOMetrics {
  slug: string;
  url: string;
  topicCluster?: string;
  metrics: {
    last7Days: PeriodMetrics;
    last30Days: PeriodMetrics;
    trend: 'up' | 'down' | 'stable';
  };
  keywordCount: number;
  topKeywordPosition: number;
}

/**
 * 时间段指标
 */
export interface PeriodMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topKeywords?: KeywordMetric[];
}

/**
 * 关键词指标
 */
export interface KeywordMetric {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/**
 * 文章 SEO 数据集合（本地存储格式）
 */
export interface ArticlesSEOData {
  lastUpdated: string;
  articles: ArticleSEOMetrics[];
}

/**
 * Topic Cluster SEO 指标
 */
export interface TopicSEOMetrics {
  topicCluster: string;
  articleCount: number;
  metrics: {
    last30Days: {
      clicks: number;
      impressions: number;
      ctr: number;
      avgPosition: number;
    };
  };
  topArticles: {
    slug: string;
    clicks: number;
  }[];
  performance: 'excellent' | 'good' | 'average' | 'poor';
  opportunity: 'high' | 'medium' | 'low';
}

/**
 * Topics SEO 数据集合（本地存储格式）
 */
export interface TopicsSEOData {
  lastUpdated: string;
  topics: TopicSEOMetrics[];
}
