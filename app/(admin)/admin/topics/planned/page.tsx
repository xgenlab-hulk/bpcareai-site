/**
 * Planned Articles Management Page
 * View and manage titles queued for generation
 */
import { StatsCard } from '@/components/admin/StatsCard';
import { PlannedArticlesClient } from '@/components/admin/PlannedArticlesClient';
import {
  getPlannedTitlesByTopic,
  getPlannedTitlesCount,
} from '@/lib/admin/planned-topics';
import { FileText, Layers } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planned Articles',
};

export default async function PlannedArticlesPage() {
  // Fetch data
  const [groups, totalCount] = await Promise.all([
    getPlannedTitlesByTopic(),
    getPlannedTitlesCount(),
  ]);

  const topicCount = groups.length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Planned Articles</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage titles queued for generation
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total Planned Titles"
          value={totalCount}
          icon={FileText}
        />
        <StatsCard
          label="Topic Clusters"
          value={topicCount}
          icon={Layers}
        />
      </div>

      {/* Info Box */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h2 className="mb-2 text-sm font-semibold text-blue-900">
          About Planned Articles
        </h2>
        <p className="text-sm text-blue-800">
          These titles are stored in <code className="rounded bg-blue-100 px-1 py-0.5">data/planned-topics-*.json</code> files.
          The daily article generation workflow randomly selects from these titles.
          You can delete titles that are no longer relevant or need revision.
        </p>
      </div>

      {/* Topics Accordion */}
      <PlannedArticlesClient initialGroups={groups} />
    </div>
  );
}
