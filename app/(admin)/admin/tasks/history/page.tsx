/**
 * Task History Page
 * View execution history for all automated tasks
 */
import { TaskHistoryList } from '@/components/admin/TaskHistoryList';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Task History',
};

/**
 * Task history record (union type)
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

/**
 * Get task history with optional filtering
 */
async function getTaskHistory(type?: string) {
  const historyPath = path.join(process.cwd(), 'data', 'task-history.json');

  if (!fs.existsSync(historyPath)) {
    return [];
  }

  const content = fs.readFileSync(historyPath, 'utf8');
  const tasks: TaskHistoryRecord[] = JSON.parse(content);

  // Filter by type if specified
  if (type === 'article-generation' || type === 'internal-linking') {
    return tasks.filter((t) => t.taskType === type).slice(0, 50);
  }

  return tasks.slice(0, 50);
}

interface PageProps {
  searchParams: { type?: string };
}

export default async function TaskHistoryPage({ searchParams }: PageProps) {
  const tasks = await getTaskHistory(searchParams.type);
  const filterType = searchParams.type;

  const getFilterLabel = () => {
    if (filterType === 'article-generation') return 'Article Generation';
    if (filterType === 'internal-linking') return 'Internal Linking';
    return 'All Tasks';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/tasks"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Task History</h1>
        <p className="mt-1 text-sm text-gray-500">
          Viewing: <span className="font-medium">{getFilterLabel()}</span>
        </p>
      </div>

      {/* Filter Pills */}
      <div className="mb-6 flex gap-2">
        <Link
          href="/admin/tasks/history"
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            !filterType
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Tasks
        </Link>
        <Link
          href="/admin/tasks/history?type=article-generation"
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            filterType === 'article-generation'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Article Generation
        </Link>
        <Link
          href="/admin/tasks/history?type=internal-linking"
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            filterType === 'internal-linking'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Internal Linking
        </Link>
      </div>

      {/* Task History List */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Recent Executions ({tasks.length})
        </h2>

        {tasks.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No task history</h3>
            <p className="mt-1 text-sm text-gray-500">
              No execution records found for this filter.
            </p>
          </div>
        ) : (
          <TaskHistoryList tasks={tasks} />
        )}
      </div>
    </div>
  );
}
