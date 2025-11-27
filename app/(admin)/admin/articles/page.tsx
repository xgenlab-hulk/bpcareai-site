/**
 * Articles Management Page
 * View and manage all published articles
 */
import { StatsCard } from '@/components/admin/StatsCard';
import { ArticlesTable } from '@/components/admin/ArticlesTable';
import { getAllArticles, getArticlesStats, getTopicClusters } from '@/lib/admin/articles';
import { FileText, Calendar, Hash, Layers } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles Management',
};

export default async function ArticlesPage() {
  // Fetch data
  const [articles, stats, topics] = await Promise.all([
    getAllArticles(),
    getArticlesStats(),
    getTopicClusters(),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Articles Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all published articles
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total Articles"
          value={stats.total}
          icon={FileText}
        />
        <StatsCard
          label="This Week"
          value={stats.thisWeek}
          icon={Calendar}
        />
        <StatsCard
          label="Avg Words"
          value={stats.avgWords}
          icon={Hash}
        />
        <StatsCard
          label="Topic Clusters"
          value={topics.length}
          icon={Layers}
        />
      </div>

      {/* Topic Distribution */}
      {Object.keys(stats.byTopic).length > 0 && (
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Distribution by Topic
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Object.entries(stats.byTopic)
              .sort((a, b) => b[1] - a[1])
              .map(([topic, count]) => (
                <div key={topic} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{topic}</span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Articles Table */}
      <ArticlesTable articles={articles} topics={topics} />
    </div>
  );
}
