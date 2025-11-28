'use client';

/**
 * Task History List Component
 * Display task execution history for both Article Generation and Internal Linking
 */
import { useState } from 'react';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, FileText, Link2 } from 'lucide-react';

/**
 * Union type for task history records
 */
type TaskHistoryRecord =
  | {
      id: string;
      taskType: 'article-generation';
      timestamp: string;
      durationMinutes: number;
      daysSinceStart: number;
      stage: string;
      targetArticles: number;
      articlesGenerated: number;
      articlesFailed: number;
      topicsInventoryBefore: number;
      topicsInventoryAfter: number;
      topicsReplenished: number;
      success: boolean;
    }
  | {
      id: string;
      taskType: 'internal-linking';
      timestamp: string;
      durationMinutes: number;
      articlesProcessed: number;
      linksUpdated: number;
      success: boolean;
    };

interface TaskHistoryListProps {
  tasks: TaskHistoryRecord[];
}

export function TaskHistoryList({ tasks }: TaskHistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 1) {
      return `${Math.round(minutes * 60)}s`;
    }
    return `${minutes.toFixed(1)}m`;
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
        >
          {/* Summary Row */}
          <div
            className="flex cursor-pointer items-center justify-between p-4"
            onClick={() => toggleExpand(task.id)}
          >
            <div className="flex flex-1 items-center gap-4">
              {/* Status Icon */}
              <div>
                {task.success ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
              </div>

              {/* Task Type Badge */}
              <div className="min-w-[140px]">
                {task.taskType === 'article-generation' ? (
                  <div className="flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                    <FileText className="h-3 w-3" />
                    Article Gen
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
                    <Link2 className="h-3 w-3" />
                    Internal Links
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <div className="min-w-[180px]">
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(task.timestamp)}
                </div>
                {task.taskType === 'article-generation' && (
                  <div className="text-xs text-gray-500">Day {task.daysSinceStart}</div>
                )}
              </div>

              {/* Task-specific metrics */}
              {task.taskType === 'article-generation' ? (
                <>
                  {/* Stage */}
                  <div className="min-w-[150px]">
                    <div className="text-xs text-gray-500">Stage</div>
                    <div className="text-sm font-medium text-gray-700">{task.stage}</div>
                  </div>

                  {/* Articles */}
                  <div className="min-w-[120px]">
                    <div className="text-xs text-gray-500">Articles</div>
                    <div className="text-sm font-medium text-gray-900">
                      {task.articlesGenerated}/{task.targetArticles}
                      {task.articlesFailed > 0 && (
                        <span className="ml-1 text-red-600">({task.articlesFailed} failed)</span>
                      )}
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="min-w-[120px]">
                    <div className="text-xs text-gray-500">Topics</div>
                    <div className="text-sm font-medium text-gray-700">
                      {task.topicsInventoryBefore} → {task.topicsInventoryAfter}
                      {task.topicsReplenished > 0 && (
                        <span className="ml-1 text-green-600">(+{task.topicsReplenished})</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Articles Processed */}
                  <div className="min-w-[120px]">
                    <div className="text-xs text-gray-500">Processed</div>
                    <div className="text-sm font-medium text-gray-900">
                      {task.articlesProcessed} articles
                    </div>
                  </div>

                  {/* Links Updated */}
                  <div className="min-w-[120px]">
                    <div className="text-xs text-gray-500">Links Updated</div>
                    <div className="text-sm font-medium text-purple-600">
                      {task.linksUpdated}
                    </div>
                  </div>

                  {/* Spacer for layout */}
                  <div className="min-w-[120px]"></div>
                </>
              )}

              {/* Duration */}
              <div className="min-w-[80px]">
                <div className="text-xs text-gray-500">Duration</div>
                <div className="text-sm font-medium text-gray-700">
                  {formatDuration(task.durationMinutes)}
                </div>
              </div>
            </div>

            {/* Expand Icon */}
            <div className="ml-4">
              {expandedId === task.id ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>

          {/* Expanded Details */}
          {expandedId === task.id && (
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              {task.taskType === 'article-generation' ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="mb-3 font-semibold text-gray-900">Execution Details</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Task ID:</dt>
                        <dd className="font-mono text-xs text-gray-900">{task.id}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Days Since Start:</dt>
                        <dd className="font-medium text-gray-900">{task.daysSinceStart}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Stage:</dt>
                        <dd className="font-medium text-gray-900">{task.stage}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Duration:</dt>
                        <dd className="font-medium text-gray-900">
                          {task.durationMinutes.toFixed(2)} minutes
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Status:</dt>
                        <dd className={task.success ? 'font-medium text-green-600' : 'font-medium text-red-600'}>
                          {task.success ? 'Success ✓' : 'Failed ✗'}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-gray-900">Article Generation</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Target Articles:</dt>
                        <dd className="font-medium text-gray-900">{task.targetArticles}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Generated:</dt>
                        <dd className="font-medium text-green-600">{task.articlesGenerated}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Failed:</dt>
                        <dd className="font-medium text-red-600">{task.articlesFailed}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Success Rate:</dt>
                        <dd className="font-medium text-gray-900">
                          {task.targetArticles > 0
                            ? `${((task.articlesGenerated / task.targetArticles) * 100).toFixed(1)}%`
                            : 'N/A'}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="col-span-2 mt-2">
                    <h3 className="mb-3 font-semibold text-gray-900">Topic Inventory</h3>
                    <dl className="grid grid-cols-3 gap-4">
                      <div>
                        <dt className="text-xs text-gray-500">Before Execution</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {task.topicsInventoryBefore}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">After Execution</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {task.topicsInventoryAfter}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Topics Replenished</dt>
                        <dd className="text-lg font-semibold text-green-600">
                          +{task.topicsReplenished}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="mb-3 font-semibold text-gray-900">Execution Details</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Task ID:</dt>
                        <dd className="font-mono text-xs text-gray-900">{task.id}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Duration:</dt>
                        <dd className="font-medium text-gray-900">
                          {task.durationMinutes.toFixed(2)} minutes
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Status:</dt>
                        <dd className={task.success ? 'font-medium text-green-600' : 'font-medium text-red-600'}>
                          {task.success ? 'Success ✓' : 'Failed ✗'}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-gray-900">Internal Linking Stats</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Articles Processed:</dt>
                        <dd className="font-medium text-gray-900">{task.articlesProcessed}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Links Updated:</dt>
                        <dd className="font-medium text-purple-600">{task.linksUpdated}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Avg Links/Article:</dt>
                        <dd className="font-medium text-gray-900">
                          {task.articlesProcessed > 0
                            ? (task.linksUpdated / task.articlesProcessed).toFixed(1)
                            : 'N/A'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
