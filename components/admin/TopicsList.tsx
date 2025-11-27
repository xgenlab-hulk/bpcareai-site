'use client';

/**
 * Topics List Component
 * Display and manage topics with add/delete functionality
 * Supports grouped display: topics with titles vs new topics
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, FileText, Clock } from 'lucide-react';
import type { TopicWithStatus } from '@/lib/admin/topics';

interface TopicsListProps {
  initialTopics: TopicWithStatus[];
}

export function TopicsList({ initialTopics }: TopicsListProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTopic, setNewTopic] = useState('');

  // Group topics by status
  const topicsWithTitles = initialTopics.filter(t => t.status === 'with-titles');
  const newTopics = initialTopics.filter(t => t.status === 'new');

  const handleDelete = async (slug: string, topicName: string, hasTitles: boolean) => {
    const confirmMessage = hasTitles
      ? `Delete topic "${topicName}" and all its ${topicName} planned titles? This action cannot be undone.`
      : `Delete topic "${topicName}"?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(slug);
    try {
      const response = await fetch(`/api/admin/topics/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete topic');
      }

      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete topic. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTopic.trim()) {
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch('/api/admin/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topics: [newTopic.trim()] }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add topic');
      }

      setNewTopic('');
      router.refresh();
    } catch (error) {
      console.error('Add error:', error);
      alert(error instanceof Error ? error.message : 'Failed to add topic. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Topic Form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Enter new topic name..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isAdding}
        />
        <button
          type="submit"
          disabled={isAdding || !newTopic.trim()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {isAdding ? 'Adding...' : 'Add Topic'}
        </button>
      </form>

      {/* Topics with Planned Titles */}
      {topicsWithTitles.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Topics with Planned Titles ({topicsWithTitles.length})
            </h3>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white shadow">
            <div className="divide-y divide-gray-200">
              {topicsWithTitles.map((topic) => (
                <div
                  key={topic.slug}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{topic.name}</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {topic.titlesCount} planned title{topic.titlesCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(topic.slug, topic.name, true)}
                    disabled={isDeleting === topic.slug}
                    className="ml-4 rounded-md p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    title="Delete topic and all its planned titles"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Topics */}
      {newTopics.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              New Topics ({newTopics.length})
            </h3>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white shadow">
            <div className="divide-y divide-gray-200">
              {newTopics.map((topic) => (
                <div
                  key={topic.slug}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{topic.name}</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      待生成标题 • Added {topic.addedAt ? new Date(topic.addedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }) : 'recently'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(topic.slug, topic.name, false)}
                    disabled={isDeleting === topic.slug}
                    className="ml-4 rounded-md p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    title="Delete topic"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {initialTopics.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center shadow">
          <p className="text-sm text-gray-500">No topics found. Add one above to get started.</p>
        </div>
      )}
    </div>
  );
}
