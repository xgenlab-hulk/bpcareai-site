'use client';

/**
 * Task Card Component
 * Displays task information, configuration, and quick actions
 */
import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  History,
} from 'lucide-react';

interface TaskCardProps {
  title: string;
  description: string;
  taskType: 'article-generation' | 'internal-linking';
  enabled: boolean;
  schedule: string;
  lastRun: string | null;
  lastStatus: boolean | null;
  totalRuns: number;
  workflowFile: string;
  config?: {
    minSimilarity?: number;
    topK?: number;
    preserveExisting?: boolean;
  };
}

export function TaskCard({
  title,
  description,
  taskType,
  enabled,
  schedule,
  lastRun,
  lastStatus,
  totalRuns,
  workflowFile,
  config,
}: TaskCardProps) {
  const [showConfig, setShowConfig] = useState(false);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div>
          {enabled ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Enabled
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              Disabled
            </span>
          )}
        </div>
      </div>

      {/* Schedule Info */}
      <div className="mb-4 rounded-lg bg-gray-50 p-3">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-700">Schedule:</span>
          <span className="text-gray-600">{schedule}</span>
        </div>
      </div>

      {/* Status Grid */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-gray-200 p-3">
          <div className="text-xs text-gray-500">Last Run</div>
          <div className="mt-1 text-sm font-medium text-gray-900">
            {lastRun ? formatDate(lastRun) : 'Never'}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 p-3">
          <div className="text-xs text-gray-500">Status</div>
          <div className="mt-1 flex items-center gap-1">
            {lastStatus === null ? (
              <span className="text-sm text-gray-400">-</span>
            ) : lastStatus ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">Success</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-600">Failed</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Configuration (if provided) */}
      {config && (
        <div className="mb-4">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Configuration</span>
            </div>
            <span className="text-xs text-gray-500">
              {showConfig ? 'Hide' : 'Show'}
            </span>
          </button>

          {showConfig && (
            <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <dl className="space-y-2 text-sm">
                {config.minSimilarity !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Min Similarity:</dt>
                    <dd className="font-medium text-gray-900">{config.minSimilarity}</dd>
                  </div>
                )}
                {config.topK !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Top K Links:</dt>
                    <dd className="font-medium text-gray-900">{config.topK}</dd>
                  </div>
                )}
                {config.preserveExisting !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Preserve Existing:</dt>
                    <dd className="font-medium text-gray-900">
                      {config.preserveExisting ? 'Yes' : 'No'}
                    </dd>
                  </div>
                )}
              </dl>
              <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="text-xs text-gray-500">
                  To modify these values, edit{' '}
                  <code className="rounded bg-white px-1 py-0.5">
                    data/task-config.json
                  </code>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/admin/tasks/history?type=${taskType}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <History className="h-4 w-4" />
          View History
        </Link>
      </div>

      {/* Stats Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
        <span className="text-xs text-gray-500">Total runs: {totalRuns}</span>
        <span className="text-xs text-gray-400">via GitHub Actions</span>
      </div>
    </div>
  );
}
