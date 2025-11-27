'use client';

/**
 * Planned Articles Client Component
 * Client-side wrapper for planned articles management
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopicAccordion } from './TopicAccordion';
import type { TopicGroup } from '@/lib/admin/planned-topics';

interface PlannedArticlesClientProps {
  initialGroups: TopicGroup[];
}

export function PlannedArticlesClient({ initialGroups }: PlannedArticlesClientProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDelete = async (topic: string, indices: number[]) => {
    try {
      const response = await fetch('/api/admin/planned-titles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, indices }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete titles');
      }

      // Refresh the page data
      setIsRefreshing(true);
      router.refresh();
      setTimeout(() => setIsRefreshing(false), 500);
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  if (isRefreshing) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm text-gray-600">Refreshing...</p>
        </div>
      </div>
    );
  }

  return <TopicAccordion groups={initialGroups} onDelete={handleDelete} />;
}
