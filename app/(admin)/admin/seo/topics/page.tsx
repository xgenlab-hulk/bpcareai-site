/**
 * Topic Cluster SEO 策略分析页面
 * 按主题聚合 SEO 数据，识别高价值内容方向
 */
import {
  AlertCircle,
  Target,
  TrendingUp,
  FileText,
  Eye,
  Star,
  CheckCircle2,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import type { TopicsSEOData, TopicSEOMetrics } from '@/lib/seo/types';

export const metadata: Metadata = {
  title: 'Topic Cluster SEO Strategy',
};

/**
 * 读取 Topic SEO 数据
 */
async function getTopicsSEO(): Promise<TopicsSEOData | null> {
  const dataPath = path.join(process.cwd(), 'data', 'topics-seo.json');

  if (!fs.existsSync(dataPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read topics SEO data:', error);
    return null;
  }
}

/**
 * Performance 徽章组件
 */
function PerformanceBadge({
  performance,
}: {
  performance: 'excellent' | 'good' | 'average' | 'poor';
}) {
  const styles = {
    excellent: 'bg-green-100 text-green-800 border-green-200',
    good: 'bg-blue-100 text-blue-800 border-blue-200',
    average: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    poor: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const labels = {
    excellent: '🌟 优秀',
    good: '✅ 良好',
    average: '⚠️ 一般',
    poor: '➖ 较弱',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[performance]}`}
    >
      {labels[performance]}
    </span>
  );
}

/**
 * Opportunity 徽章组件
 */
function OpportunityBadge({ opportunity }: { opportunity: 'high' | 'medium' | 'low' }) {
  const styles = {
    high: 'bg-purple-100 text-purple-800 border-purple-200',
    medium: 'bg-orange-100 text-orange-800 border-orange-200',
    low: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const labels = {
    high: '🎯 高优先级',
    medium: '📊 中优先级',
    low: '➡️ 低优先级',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[opportunity]}`}
    >
      {labels[opportunity]}
    </span>
  );
}

/**
 * Topic 卡片组件
 */
function TopicCard({ topic }: { topic: TopicSEOMetrics }) {
  const { topicCluster, articleCount, metrics, topArticles, performance, opportunity } = topic;
  const { clicks, impressions, ctr, avgPosition } = metrics.last30Days;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{topicCluster}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <FileText className="h-4 w-4" />
            <span>{articleCount} 篇文章</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <PerformanceBadge performance={performance} />
          <OpportunityBadge opportunity={opportunity} />
        </div>
      </div>

      {/* 指标 */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-xs text-gray-600">点击数</div>
          <div className="mt-1 text-xl font-bold text-gray-900">
            {clicks.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-xs text-gray-600">展示数</div>
          <div className="mt-1 text-xl font-bold text-gray-900">
            {impressions.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-xs text-gray-600">CTR</div>
          <div
            className={`mt-1 text-lg font-semibold ${
              ctr > 0.03 ? 'text-green-600' : ctr > 0.02 ? 'text-yellow-600' : 'text-gray-900'
            }`}
          >
            {(ctr * 100).toFixed(2)}%
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-xs text-gray-600">平均排名</div>
          <div
            className={`mt-1 text-lg font-semibold ${
              avgPosition < 15
                ? 'text-green-600'
                : avgPosition < 25
                  ? 'text-yellow-600'
                  : 'text-gray-900'
            }`}
          >
            {avgPosition.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Top 文章 */}
      {topArticles.length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <div className="mb-2 text-xs font-medium text-gray-600">Top 文章:</div>
          <div className="space-y-1">
            {topArticles.map((article, index) => (
              <Link
                key={article.slug}
                href={`/${article.slug}`}
                target="_blank"
                className="flex items-center justify-between text-xs hover:text-blue-600"
              >
                <span className="truncate text-gray-700">
                  {index + 1}. {article.slug.substring(0, 40)}...
                </span>
                <span className="ml-2 font-medium text-gray-900">
                  {article.clicks}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function TopicsSEOPage() {
  const data = await getTopicsSEO();

  if (!data || !data.topics || data.topics.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Topic Cluster SEO Strategy</h1>
          <p className="mt-1 text-sm text-gray-500">主题聚类 SEO 策略分析</p>
        </div>

        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">暂无数据</h3>
          <p className="mt-2 text-sm text-gray-500">
            Topic Cluster 数据尚未生成，请先同步文章级数据
          </p>
          <div className="mt-4 space-y-2">
            <div className="rounded bg-gray-100 px-4 py-2 font-mono text-sm text-gray-700">
              npm run sync:articles-seo
            </div>
            <div className="rounded bg-gray-100 px-4 py-2 font-mono text-sm text-gray-700">
              npm run sync:topics-seo
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { topics, lastUpdated } = data;

  // 按类别分组
  const excellentTopics = topics.filter((t) => t.performance === 'excellent');
  const goodTopics = topics.filter((t) => t.performance === 'good');
  const highOpportunity = topics.filter((t) => t.opportunity === 'high');
  const mediumOpportunity = topics.filter((t) => t.opportunity === 'medium');

  // 统计数据
  const totalClicks = topics.reduce((sum, t) => sum + t.metrics.last30Days.clicks, 0);
  const totalImpressions = topics.reduce(
    (sum, t) => sum + t.metrics.last30Days.impressions,
    0
  );
  const totalArticles = topics.reduce((sum, t) => sum + t.articleCount, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Topic Cluster SEO Strategy</h1>
        <p className="mt-1 text-sm text-gray-500">
          主题聚类 SEO 策略分析 - 识别高价值内容方向
        </p>
        <div className="mt-2 text-xs text-gray-400">
          最后更新: {new Date(lastUpdated).toLocaleString('zh-CN')}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="h-4 w-4" />
            <span>主题总数</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{topics.length}</div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4" />
            <span>覆盖文章</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{totalArticles}</div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>总点击数</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {totalClicks.toLocaleString()}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Eye className="h-4 w-4" />
            <span>总展示数</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {totalImpressions.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 高优先级主题 */}
      {highOpportunity.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              🎯 高优先级优化主题 ({highOpportunity.length})
            </h2>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            这些主题有较高的展示量但点击率或排名需要优化，是快速提升流量的关键方向
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {highOpportunity.map((topic) => (
              <TopicCard key={topic.topicCluster} topic={topic} />
            ))}
          </div>
        </div>
      )}

      {/* 优秀表现主题 */}
      {excellentTopics.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              🌟 优秀表现主题 ({excellentTopics.length})
            </h2>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            这些主题表现出色，可作为内容创作的成功案例和扩展方向
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {excellentTopics.map((topic) => (
              <TopicCard key={topic.topicCluster} topic={topic} />
            ))}
          </div>
        </div>
      )}

      {/* 良好表现主题 */}
      {goodTopics.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              ✅ 良好表现主题 ({goodTopics.length})
            </h2>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            这些主题有稳定的流量，可以通过持续优化进一步提升
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goodTopics.map((topic) => (
              <TopicCard key={topic.topicCluster} topic={topic} />
            ))}
          </div>
        </div>
      )}

      {/* 中优先级主题 */}
      {mediumOpportunity.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              📊 中优先级主题 ({mediumOpportunity.length})
            </h2>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            这些主题有一定潜力，可在资源允许的情况下逐步优化
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mediumOpportunity.map((topic) => (
              <TopicCard key={topic.topicCluster} topic={topic} />
            ))}
          </div>
        </div>
      )}

      {/* 其他主题 */}
      {topics.filter(
        (t) =>
          t.performance !== 'excellent' &&
          t.performance !== 'good' &&
          t.opportunity !== 'high' &&
          t.opportunity !== 'medium'
      ).length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">其他主题</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topics
              .filter(
                (t) =>
                  t.performance !== 'excellent' &&
                  t.performance !== 'good' &&
                  t.opportunity !== 'high' &&
                  t.opportunity !== 'medium'
              )
              .map((topic) => (
                <TopicCard key={topic.topicCluster} topic={topic} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
