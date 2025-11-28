/**
 * Tasks Management Page
 * Manage automated tasks: Article Generation & Internal Linking
 */
import { StatsCard } from '@/components/admin/StatsCard';
import { TaskCard } from '@/components/admin/TaskCard';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Task Management',
};

/**
 * Task history record (union type for both tasks)
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
 * Task configuration
 */
interface TaskConfig {
  articleGeneration: {
    enabled: boolean;
    description: string;
    schedule: {
      cron: string;
      timezone: string;
      description: string;
    };
  };
  internalLinking: {
    enabled: boolean;
    description: string;
    schedule: {
      cron: string;
      timezone: string;
      description: string;
    };
    config: {
      minSimilarity: number;
      topK: number;
      preserveExisting: boolean;
    };
  };
}

/**
 * Get task stats from history
 */
async function getTaskStats() {
  const historyPath = path.join(process.cwd(), 'data', 'task-history.json');

  if (!fs.existsSync(historyPath)) {
    return {
      total: 0,
      successful: 0,
      failed: 0,
      articleGeneration: { total: 0, lastRun: null, lastStatus: null },
      internalLinking: { total: 0, lastRun: null, lastStatus: null },
    };
  }

  const content = fs.readFileSync(historyPath, 'utf8');
  const tasks: TaskHistoryRecord[] = JSON.parse(content);

  const articleTasks = tasks.filter((t) => t.taskType === 'article-generation');
  const linkingTasks = tasks.filter((t) => t.taskType === 'internal-linking');

  return {
    total: tasks.length,
    successful: tasks.filter((t) => t.success).length,
    failed: tasks.filter((t) => !t.success).length,
    articleGeneration: {
      total: articleTasks.length,
      lastRun: articleTasks.length > 0 ? articleTasks[0].timestamp : null,
      lastStatus: articleTasks.length > 0 ? articleTasks[0].success : null,
    },
    internalLinking: {
      total: linkingTasks.length,
      lastRun: linkingTasks.length > 0 ? linkingTasks[0].timestamp : null,
      lastStatus: linkingTasks.length > 0 ? linkingTasks[0].success : null,
    },
  };
}

/**
 * Load task configuration
 */
async function getTaskConfig(): Promise<TaskConfig | null> {
  const configPath = path.join(process.cwd(), 'data', 'task-config.json');

  if (!fs.existsSync(configPath)) {
    return null;
  }

  const content = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(content);
}

export default async function TasksPage() {
  const [stats, config] = await Promise.all([getTaskStats(), getTaskConfig()]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage automated tasks and view execution history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Runs" value={stats.total} icon={Calendar} />
        <StatsCard
          label="Successful"
          value={stats.successful}
          icon={CheckCircle2}
        />
        <StatsCard label="Failed" value={stats.failed} icon={XCircle} />
        <StatsCard
          label="Last Run"
          value={
            stats.articleGeneration.lastRun
              ? new Date(stats.articleGeneration.lastRun).toLocaleDateString()
              : 'Never'
          }
          icon={Clock}
        />
      </div>

      {/* Info Box */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h2 className="mb-2 text-sm font-semibold text-blue-900">
          About Automated Tasks
        </h2>
        <p className="text-sm text-blue-800">
          Tasks are scheduled via GitHub Actions and run automatically. View task history,
          adjust configuration parameters, and monitor execution status below.
          To modify execution times, edit the GitHub Actions workflow files in{' '}
          <code className="rounded bg-blue-100 px-1 py-0.5">.github/workflows/</code>.
        </p>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Article Generation Task */}
        {config && (
          <TaskCard
            title="Daily Article Generation"
            description={config.articleGeneration.description}
            taskType="article-generation"
            enabled={config.articleGeneration.enabled}
            schedule={config.articleGeneration.schedule.description}
            lastRun={stats.articleGeneration.lastRun}
            lastStatus={stats.articleGeneration.lastStatus}
            totalRuns={stats.articleGeneration.total}
            workflowFile=".github/workflows/daily-article-generation.yml"
          />
        )}

        {/* Internal Linking Task */}
        {config && (
          <TaskCard
            title="Weekly Internal Linking"
            description={config.internalLinking.description}
            taskType="internal-linking"
            enabled={config.internalLinking.enabled}
            schedule={config.internalLinking.schedule.description}
            lastRun={stats.internalLinking.lastRun}
            lastStatus={stats.internalLinking.lastStatus}
            totalRuns={stats.internalLinking.total}
            workflowFile=".github/workflows/weekly-internal-linking.yml"
            config={config.internalLinking.config}
          />
        )}
      </div>
    </div>
  );
}
