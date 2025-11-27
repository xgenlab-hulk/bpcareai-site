/**
 * Topics Management Page
 * Manage topics with manual input and AI extraction
 */
import { StatsCard } from '@/components/admin/StatsCard';
import { TopicsList } from '@/components/admin/TopicsList';
import { AITopicExtractor } from '@/components/admin/AITopicExtractor';
import { getAllTopicsWithStatus, getTopicsStats } from '@/lib/admin/topics';
import { Layers, FileText, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Topics Management',
};

export default async function TopicsPage() {
  const [topics, stats] = await Promise.all([
    getAllTopicsWithStatus(),
    getTopicsStats(),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Topics Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage topics for article generation
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total Topics"
          value={stats.total}
          icon={Layers}
        />
        <StatsCard
          label="With Planned Titles"
          value={stats.withTitles}
          icon={FileText}
        />
        <StatsCard
          label="New Topics"
          value={stats.new}
          icon={Clock}
        />
      </div>

      {/* Info Box */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h2 className="mb-2 text-sm font-semibold text-blue-900">
          About Topics
        </h2>
        <p className="text-sm text-blue-800">
          Topics are the core keywords used to generate article titles. Each topic can have multiple planned titles
          stored in <code className="rounded bg-blue-100 px-1 py-0.5">planned-topics-*.json</code> files.
          New topics are stored in <code className="rounded bg-blue-100 px-1 py-0.5">topics.json</code> until titles are generated.
        </p>
      </div>

      {/* AI Topic Extractor */}
      <div className="mb-6">
        <AITopicExtractor />
      </div>

      {/* Manual Topic Management */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          All Topics ({stats.total})
        </h2>
        <TopicsList initialTopics={topics} />
      </div>
    </div>
  );
}
