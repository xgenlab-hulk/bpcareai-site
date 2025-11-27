'use client';

/**
 * Topic Accordion Component
 * Displays planned titles grouped by topic with batch delete functionality
 */
import { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import type { TopicGroup } from '@/lib/admin/planned-topics';

interface TopicAccordionProps {
  groups: TopicGroup[];
  onDelete: (topic: string, indices: number[]) => Promise<void>;
}

export function TopicAccordion({ groups, onDelete }: TopicAccordionProps) {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [selectedTitles, setSelectedTitles] = useState<Map<string, Set<number>>>(new Map());
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const toggleTopic = (topic: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topic)) {
      newExpanded.delete(topic);
    } else {
      newExpanded.add(topic);
    }
    setExpandedTopics(newExpanded);
  };

  const toggleTitle = (topic: string, index: number) => {
    const newSelected = new Map(selectedTitles);
    const topicSet = newSelected.get(topic) || new Set<number>();

    if (topicSet.has(index)) {
      topicSet.delete(index);
    } else {
      topicSet.add(index);
    }

    if (topicSet.size === 0) {
      newSelected.delete(topic);
    } else {
      newSelected.set(topic, topicSet);
    }

    setSelectedTitles(newSelected);
  };

  const selectAllInTopic = (topic: string, count: number) => {
    const newSelected = new Map(selectedTitles);
    const topicSet = newSelected.get(topic) || new Set<number>();

    // If all are selected, deselect all. Otherwise, select all
    if (topicSet.size === count) {
      newSelected.delete(topic);
    } else {
      newSelected.set(topic, new Set(Array.from({ length: count }, (_, i) => i)));
    }

    setSelectedTitles(newSelected);
  };

  const handleDelete = async (topic: string) => {
    const indices = selectedTitles.get(topic);
    if (!indices || indices.size === 0) {
      return;
    }

    if (!confirm(`Delete ${indices.size} title(s) from "${topic}"?`)) {
      return;
    }

    setIsDeleting(topic);
    try {
      await onDelete(topic, Array.from(indices));
      // Clear selection for this topic
      const newSelected = new Map(selectedTitles);
      newSelected.delete(topic);
      setSelectedTitles(newSelected);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete titles. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow">
        <p className="text-sm text-gray-500">No planned titles found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const isExpanded = expandedTopics.has(group.topic);
        const selected = selectedTitles.get(group.topic) || new Set();
        const hasSelection = selected.size > 0;

        return (
          <div
            key={group.topic}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow"
          >
            {/* Topic Header */}
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4">
              <button
                onClick={() => toggleTopic(group.topic)}
                className="flex flex-1 items-center gap-2 text-left hover:text-blue-600"
              >
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <span className="font-semibold text-gray-900">{group.topic}</span>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {group.count}
                </span>
              </button>

              <div className="flex items-center gap-2">
                {isExpanded && (
                  <button
                    onClick={() => selectAllInTopic(group.topic, group.count)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selected.size === group.count ? 'Deselect All' : 'Select All'}
                  </button>
                )}
                {hasSelection && (
                  <button
                    onClick={() => handleDelete(group.topic)}
                    disabled={isDeleting === group.topic}
                    className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting === group.topic ? 'Deleting...' : `Delete (${selected.size})`}
                  </button>
                )}
              </div>
            </div>

            {/* Topic Content */}
            {isExpanded && (
              <div className="divide-y divide-gray-200">
                {group.titles.map((title, index) => {
                  const isSelected = selected.has(index);

                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-3 px-6 py-3 hover:bg-gray-50 ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTitle(group.topic, index)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{title.title}</p>
                        {title.primaryKeyword && (
                          <p className="mt-1 text-xs text-gray-500">
                            Keyword: {title.primaryKeyword}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
