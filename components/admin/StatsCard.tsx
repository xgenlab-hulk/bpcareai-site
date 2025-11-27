/**
 * Stats Card Component
 * Displays a metric with label, value, and optional trend indicator
 */
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div className={cn('rounded-lg bg-white p-6 shadow', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>

          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={cn(
                  'font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="ml-2 text-gray-500">vs last period</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
}
