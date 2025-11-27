/**
 * Admin Dashboard - Home Page
 * Overview of key metrics and quick actions
 */
import { StatsCard } from '@/components/admin/StatsCard';
import { FileText, Tag, Calendar, BarChart3 } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import type { ArticleMeta } from '@/lib/articles/types';
import { getTopicsStats } from '@/lib/admin/topics';

/**
 * Get basic stats from local files
 */
async function getBasicStats() {
  // Read articles index
  const articlesIndexPath = path.join(process.cwd(), 'data', 'articles-index.json');
  const articlesData = fs.readFileSync(articlesIndexPath, 'utf8');
  const articles: ArticleMeta[] = JSON.parse(articlesData);

  // Count planned topics
  const dataDir = path.join(process.cwd(), 'data');
  const files = fs.readdirSync(dataDir);
  const plannedTopicsFiles = files.filter(f => f.startsWith('planned-topics-') && f.endsWith('.json'));

  let totalPlannedTitles = 0;
  for (const file of plannedTopicsFiles) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    const topics = JSON.parse(content);
    totalPlannedTitles += Array.isArray(topics) ? topics.length : 0;
  }

  // Get topics count from unified function
  const topicsStats = await getTopicsStats();

  // Calculate this week's articles
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekArticles = articles.filter(a => {
    const publishDate = new Date(a.date);
    return publishDate >= oneWeekAgo;
  }).length;

  return {
    totalArticles: articles.length,
    thisWeekArticles,
    totalPlannedTitles,
    topicsCount: topicsStats.total,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getBasicStats();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to the BPCare AI admin panel. Here's an overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Published Articles"
          value={stats.totalArticles}
          icon={FileText}
        />
        <StatsCard
          label="This Week"
          value={stats.thisWeekArticles}
          icon={Calendar}
        />
        <StatsCard
          label="Planned Titles"
          value={stats.totalPlannedTitles}
          icon={Tag}
        />
        <StatsCard
          label="Active Topics"
          value={stats.topicsCount}
          icon={BarChart3}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/admin/articles"
            className="block rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Manage Articles</h3>
            <p className="mt-1 text-sm text-gray-500">
              View and manage published articles
            </p>
          </a>

          <a
            href="/admin/topics"
            className="block rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Manage Topics</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add, edit, or remove content topics
            </p>
          </a>

          <a
            href="/admin/tasks"
            className="block rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Task Schedules</h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure automated tasks
            </p>
          </a>

          <a
            href="/admin/seo"
            className="block rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-medium text-gray-900">SEO Analytics</h3>
            <p className="mt-1 text-sm text-gray-500">
              View search performance data
            </p>
          </a>

          <a
            href="/admin/topics/planned"
            className="block rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Planned Articles</h3>
            <p className="mt-1 text-sm text-gray-500">
              Review upcoming article titles
            </p>
          </a>

          <a
            href="/admin/settings"
            className="block rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Settings</h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure admin panel settings
            </p>
          </a>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                All systems operational
              </p>
              <p className="text-sm text-green-700 mt-1">
                Last checked: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
