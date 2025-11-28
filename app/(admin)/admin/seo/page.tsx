/**
 * SEO Analytics Dashboard
 * 展示 Google Search Console 数据和关键指标
 */
import { StatsCard } from '@/components/admin/StatsCard';
import { SEOTrendChart } from '@/components/admin/SEOTrendChart';
import {
  TrendingUp,
  Eye,
  MousePointer,
  BarChart3,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Target,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import type { SEOMetricsData } from '@/lib/seo/types';

export const metadata: Metadata = {
  title: 'SEO Analytics',
};

/**
 * 读取 SEO 数据
 */
async function getSEOMetrics(): Promise<SEOMetricsData | null> {
  const dataPath = path.join(process.cwd(), 'data', 'seo-metrics.json');

  if (!fs.existsSync(dataPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read SEO metrics:', error);
    return null;
  }
}

/**
 * 格式化数字
 */
function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

/**
 * 计算增长率
 */
function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export default async function SEOPage() {
  const data = await getSEOMetrics();

  if (!data || !data.summary) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">SEO Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Google Search Console 数据分析
          </p>
        </div>

        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">暂无数据</h3>
          <p className="mt-2 text-sm text-gray-500">
            GSC 数据尚未同步，请稍后刷新页面或手动触发同步
          </p>
          <p className="mt-1 text-xs text-gray-400">
            数据每天自动同步一次（北京时间 11:00）
          </p>
        </div>
      </div>
    );
  }

  const { summary, daily, lastUpdated, dateRange } = data;
  const { last7Days, last30Days, last90Days } = summary;

  // 计算趋势（30天对比90天）
  const clicksTrend = calculateGrowth(last30Days.clicks, last90Days.clicks / 3);
  const impressionsTrend = calculateGrowth(
    last30Days.impressions,
    last90Days.impressions / 3
  );
  const ctrTrend = calculateGrowth(last30Days.ctr, last90Days.ctr);
  const positionTrend = -calculateGrowth(last30Days.position, last90Days.position); // 负数因为排名越小越好

  // 计算健康度指标
  const avgClicksPerDay = last30Days.clicks / 30;
  const hasTraffic = last30Days.clicks > 0;
  const goodPosition = last30Days.position < 20;
  const goodCTR = last30Days.ctr > 0.02; // 2%

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">SEO Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Google Search Console 数据分析
        </p>
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
          <span>
            数据范围: {dateRange.start} 至 {dateRange.end}
          </span>
          <span>
            最后更新: {new Date(lastUpdated).toLocaleString('zh-CN')}
          </span>
        </div>

        {/* 快速导航 */}
        <div className="mt-4 flex gap-3">
          <Link
            href="/admin/seo/articles"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
          >
            <FileText className="h-4 w-4" />
            文章级分析
          </Link>
          <Link
            href="/admin/seo/topics"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
          >
            <Target className="h-4 w-4" />
            Topic Cluster 策略
          </Link>
        </div>
      </div>

      {/* 关键指标卡片 */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="总点击数"
          value={formatNumber(last30Days.clicks)}
          icon={MousePointer}
          trend={
            clicksTrend !== 0
              ? {
                  value: Math.abs(clicksTrend),
                  direction: clicksTrend > 0 ? 'up' : 'down',
                }
              : undefined
          }
          description="最近 30 天"
        />
        <StatsCard
          label="总展示数"
          value={formatNumber(last30Days.impressions)}
          icon={Eye}
          trend={
            impressionsTrend !== 0
              ? {
                  value: Math.abs(impressionsTrend),
                  direction: impressionsTrend > 0 ? 'up' : 'down',
                }
              : undefined
          }
          description="最近 30 天"
        />
        <StatsCard
          label="平均点击率"
          value={(last30Days.ctr * 100).toFixed(2) + '%'}
          icon={TrendingUp}
          trend={
            ctrTrend !== 0
              ? {
                  value: Math.abs(ctrTrend),
                  direction: ctrTrend > 0 ? 'up' : 'down',
                }
              : undefined
          }
          description="最近 30 天"
        />
        <StatsCard
          label="平均排名"
          value={last30Days.position.toFixed(1)}
          icon={BarChart3}
          trend={
            positionTrend !== 0
              ? {
                  value: Math.abs(positionTrend),
                  direction: positionTrend > 0 ? 'up' : 'down',
                }
              : undefined
          }
          description="越小越好"
        />
      </div>

      {/* 健康度指标 */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">SEO 健康度</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3">
            {hasTraffic ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">流量状态</div>
              <div className="text-xs text-gray-500">
                {hasTraffic
                  ? `平均每天 ${avgClicksPerDay.toFixed(1)} 次点击`
                  : '暂无自然流量'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            {goodPosition ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">排名表现</div>
              <div className="text-xs text-gray-500">
                {goodPosition
                  ? `平均排名 ${last30Days.position.toFixed(1)}（前2页）`
                  : `平均排名 ${last30Days.position.toFixed(1)}（需优化）`}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            {goodCTR ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">点击率</div>
              <div className="text-xs text-gray-500">
                {goodCTR
                  ? `${(last30Days.ctr * 100).toFixed(2)}%（良好）`
                  : `${(last30Days.ctr * 100).toFixed(2)}%（可优化标题/描述）`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 趋势图表 */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">流量趋势</h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>最近 90 天</span>
          </div>
        </div>
        <SEOTrendChart data={daily} />
      </div>

      {/* 数据对比 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 7 天 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">最近 7 天</h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500">点击数</div>
              <div className="text-2xl font-bold text-gray-900">
                {last7Days.clicks.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">展示数</div>
              <div className="text-lg font-semibold text-gray-700">
                {last7Days.impressions.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-gray-500">CTR</div>
                <div className="font-medium">{(last7Days.ctr * 100).toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-gray-500">排名</div>
                <div className="font-medium">{last7Days.position.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 30 天 */}
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-blue-900">最近 30 天</h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-blue-600">点击数</div>
              <div className="text-2xl font-bold text-blue-900">
                {last30Days.clicks.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-blue-600">展示数</div>
              <div className="text-lg font-semibold text-blue-800">
                {last30Days.impressions.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-blue-600">CTR</div>
                <div className="font-medium text-blue-900">
                  {(last30Days.ctr * 100).toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-blue-600">排名</div>
                <div className="font-medium text-blue-900">
                  {last30Days.position.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 90 天 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">最近 90 天</h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500">点击数</div>
              <div className="text-2xl font-bold text-gray-900">
                {last90Days.clicks.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">展示数</div>
              <div className="text-lg font-semibold text-gray-700">
                {last90Days.impressions.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-gray-500">CTR</div>
                <div className="font-medium">{(last90Days.ctr * 100).toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-gray-500">排名</div>
                <div className="font-medium">{last90Days.position.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
