/**
 * 文章级 SEO 分析页面
 * 显示每篇文章的 SEO 表现数据
 */
import { AlertCircle, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import type { ArticlesSEOData, ArticleSEOMetrics } from '@/lib/seo/types';

export const metadata: Metadata = {
  title: 'Article SEO Analytics',
};

/**
 * 读取文章 SEO 数据
 */
async function getArticlesSEO(): Promise<ArticlesSEOData | null> {
  const dataPath = path.join(process.cwd(), 'data', 'articles-seo.json');

  if (!fs.existsSync(dataPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read articles SEO data:', error);
    return null;
  }
}

/**
 * 趋势图标组件
 */
function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') {
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  } else if (trend === 'down') {
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  }
  return <Minus className="h-4 w-4 text-gray-400" />;
}

/**
 * 文章行组件
 */
function ArticleRow({ article }: { article: ArticleSEOMetrics }) {
  const { slug, metrics, topicCluster, keywordCount, topKeywordPosition } = article;
  const { last30Days, trend } = metrics;

  // 提取文章标题（从 slug）
  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      {/* 文章标题 */}
      <td className="py-4 pl-4 pr-3">
        <div className="flex items-start gap-2">
          <TrendIcon trend={trend} />
          <div className="flex-1">
            <Link
              href={`/${slug}`}
              target="_blank"
              className="group flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              <span className="line-clamp-2">{title}</span>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            </Link>
            {topicCluster && (
              <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                {topicCluster}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* 点击数 */}
      <td className="px-3 py-4 text-center">
        <div className="text-sm font-semibold text-gray-900">
          {last30Days.clicks.toLocaleString()}
        </div>
      </td>

      {/* 展示数 */}
      <td className="px-3 py-4 text-center">
        <div className="text-sm text-gray-600">
          {last30Days.impressions.toLocaleString()}
        </div>
      </td>

      {/* CTR */}
      <td className="px-3 py-4 text-center">
        <div
          className={`text-sm font-medium ${
            last30Days.ctr > 0.03
              ? 'text-green-600'
              : last30Days.ctr > 0.02
                ? 'text-yellow-600'
                : 'text-gray-600'
          }`}
        >
          {(last30Days.ctr * 100).toFixed(2)}%
        </div>
      </td>

      {/* 平均排名 */}
      <td className="px-3 py-4 text-center">
        <div
          className={`text-sm ${
            last30Days.position < 10
              ? 'font-semibold text-green-600'
              : last30Days.position < 20
                ? 'text-yellow-600'
                : 'text-gray-600'
          }`}
        >
          {last30Days.position.toFixed(1)}
        </div>
      </td>

      {/* 关键词数 */}
      <td className="px-3 py-4 text-center">
        <div className="text-sm text-gray-600">{keywordCount}</div>
      </td>

      {/* Top 关键词排名 */}
      <td className="px-3 py-4 text-center">
        {topKeywordPosition > 0 ? (
          <div
            className={`text-sm ${
              topKeywordPosition < 10
                ? 'font-semibold text-green-600'
                : topKeywordPosition < 20
                  ? 'text-yellow-600'
                  : 'text-gray-600'
            }`}
          >
            {topKeywordPosition.toFixed(1)}
          </div>
        ) : (
          <div className="text-sm text-gray-400">-</div>
        )}
      </td>
    </tr>
  );
}

export default async function ArticlesSEOPage() {
  const data = await getArticlesSEO();

  if (!data || !data.articles || data.articles.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Article SEO Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">文章级 SEO 表现分析</p>
        </div>

        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">暂无数据</h3>
          <p className="mt-2 text-sm text-gray-500">
            文章级 SEO 数据尚未同步，请运行同步命令
          </p>
          <div className="mt-4 rounded bg-gray-100 px-4 py-2 font-mono text-sm text-gray-700">
            npm run sync:articles-seo
          </div>
        </div>
      </div>
    );
  }

  const { articles, lastUpdated } = data;

  // 统计数据
  const totalClicks = articles.reduce((sum, a) => sum + a.metrics.last30Days.clicks, 0);
  const totalImpressions = articles.reduce(
    (sum, a) => sum + a.metrics.last30Days.impressions,
    0
  );
  const avgCTR = totalClicks / totalImpressions || 0;

  const trendingUp = articles.filter((a) => a.metrics.trend === 'up');
  const trendingDown = articles.filter((a) => a.metrics.trend === 'down');

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Article SEO Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">文章级 SEO 表现分析（最近 30 天）</p>
        <div className="mt-2 text-xs text-gray-400">
          最后更新: {new Date(lastUpdated).toLocaleString('zh-CN')}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-600">有流量文章</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{articles.length}</div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-600">总点击数</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {totalClicks.toLocaleString()}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-600">平均 CTR</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {(avgCTR * 100).toFixed(2)}%
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>趋势分布</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="font-medium text-green-600">{trendingUp.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <Minus className="h-3 w-3 text-gray-400" />
              <span className="font-medium text-gray-600">
                {articles.length - trendingUp.length - trendingDown.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-red-600" />
              <span className="font-medium text-red-600">{trendingDown.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  文章标题
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                  点击数
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                  展示数
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                  CTR
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                  平均排名
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                  关键词数
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                  Top 词排名
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {articles.map((article) => (
                <ArticleRow key={article.slug} article={article} />
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页占位符 */}
        {articles.length > 50 && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-500">
            显示 {articles.length} 篇文章
          </div>
        )}
      </div>
    </div>
  );
}
