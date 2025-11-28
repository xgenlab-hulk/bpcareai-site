'use client';

/**
 * SEO Trend Chart Component
 * 展示 SEO 流量趋势图表
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { DailyMetrics } from '@/lib/seo/types';

interface SEOTrendChartProps {
  data: DailyMetrics[];
}

export function SEOTrendChart({ data }: SEOTrendChartProps) {
  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 格式化数值显示
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-2 text-xs font-medium text-gray-900">{data.date}</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600">点击数:</span>
              <span className="font-semibold text-blue-600">{data.clicks}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600">展示数:</span>
              <span className="font-semibold text-green-600">
                {data.impressions.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600">点击率:</span>
              <span className="font-semibold text-purple-600">
                {(data.ctr * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600">平均排名:</span>
              <span className="font-semibold text-orange-600">
                {data.position.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // 如果没有数据
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-gray-500">
        暂无趋势数据
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={formatNumber}
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          iconType="line"
          formatter={(value) => {
            const labels: Record<string, string> = {
              clicks: '点击数',
              impressions: '展示数',
              ctr: '点击率 (%)',
              position: '平均排名',
            };
            return labels[value] || value;
          }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="clicks"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="impressions"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="ctr"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          hide={true}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="position"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          hide={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
