'use client';

/**
 * AI Topic Extractor Component
 * Extract topics from natural language using Claude AI
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Plus, Wand2 } from 'lucide-react';

interface GenerationProgress {
  topic: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  generated?: number;
  error?: string;
}

export function AITopicExtractor() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedTopics, setExtractedTopics] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress[]>([]);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    setIsExtracting(true);
    setExtractedTopics([]);

    try {
      const response = await fetch('/api/admin/topics/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract topics');
      }

      setExtractedTopics(data.topics);
    } catch (error) {
      console.error('Extract error:', error);
      alert(error instanceof Error ? error.message : 'Failed to extract topics. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddAll = async () => {
    if (extractedTopics.length === 0) {
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch('/api/admin/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topics: extractedTopics }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add topics');
      }

      // Reset form and refresh
      setInput('');
      setExtractedTopics([]);
      router.refresh();

      alert(`Successfully added ${data.added} topic(s)!`);
    } catch (error) {
      console.error('Add error:', error);
      alert(error instanceof Error ? error.message : 'Failed to add topics. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleGenerateTitles = async () => {
    if (extractedTopics.length === 0) {
      return;
    }

    if (!confirm(`Generate titles for ${extractedTopics.length} topic(s)? This may take several minutes.`)) {
      return;
    }

    setIsGenerating(true);

    // Initialize progress
    const progress: GenerationProgress[] = extractedTopics.map(topic => ({
      topic,
      status: 'pending' as const,
    }));
    setGenerationProgress(progress);

    try {
      // First, add all topics to topics.json
      const addResponse = await fetch('/api/admin/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topics: extractedTopics }),
      });

      if (!addResponse.ok) {
        throw new Error('Failed to add topics');
      }

      // Then generate titles for each topic
      for (let i = 0; i < extractedTopics.length; i++) {
        const topic = extractedTopics[i];

        // Update status to generating
        setGenerationProgress(prev =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: 'generating' as const } : item
          )
        );

        try {
          const response = await fetch('/api/admin/topics/generate-titles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topicName: topic, targetCount: 20 }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to generate titles');
          }

          // Update status to completed
          setGenerationProgress(prev =>
            prev.map((item, idx) =>
              idx === i
                ? { ...item, status: 'completed' as const, generated: data.saved }
                : item
            )
          );
        } catch (error) {
          // Update status to error
          setGenerationProgress(prev =>
            prev.map((item, idx) =>
              idx === i
                ? {
                    ...item,
                    status: 'error' as const,
                    error: error instanceof Error ? error.message : 'Unknown error',
                  }
                : item
            )
          );
        }
      }

      // Success - reset form and refresh
      setTimeout(() => {
        setInput('');
        setExtractedTopics([]);
        setGenerationProgress([]);
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('Generation error:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate titles. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const removeExtractedTopic = (index: number) => {
    setExtractedTopics(topics => topics.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 shadow">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-purple-900">
          AI Topic Extraction
        </h2>
      </div>

      <p className="mb-4 text-sm text-purple-800">
        Describe the topics you want in natural language, and AI will extract specific topic names for you.
      </p>

      <form onSubmit={handleExtract} className="space-y-4">
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Example: I want articles about managing stress, the effects of coffee on blood pressure, and how to exercise safely with hypertension..."
            rows={4}
            className="w-full rounded-lg border border-purple-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            disabled={isExtracting}
          />
        </div>

        <button
          type="submit"
          disabled={isExtracting || !input.trim()}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {isExtracting ? 'Extracting...' : 'Extract Topics'}
        </button>
      </form>

      {/* Extracted Topics */}
      {extractedTopics.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-purple-900">
              Extracted Topics ({extractedTopics.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleAddAll}
                disabled={isAdding || isGenerating}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                {isAdding ? 'Adding...' : 'Add to Queue'}
              </button>
              <button
                onClick={handleGenerateTitles}
                disabled={isGenerating || isAdding}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                <Wand2 className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate Titles'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {extractedTopics.map((topic, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-2 shadow-sm"
              >
                <span className="text-sm font-medium text-gray-900">{topic}</span>
                <button
                  onClick={() => removeExtractedTopic(index)}
                  disabled={isGenerating}
                  className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Title Generation Progress */}
      {generationProgress.length > 0 && (
        <div className="mt-6 space-y-2 rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-gray-900">Title Generation Progress</h3>
          <div className="space-y-2">
            {generationProgress.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div>
                    {item.status === 'pending' && (
                      <div className="h-2 w-2 rounded-full bg-gray-400" />
                    )}
                    {item.status === 'generating' && (
                      <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                    )}
                    {item.status === 'completed' && (
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    )}
                    {item.status === 'error' && (
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.topic}</span>
                </div>
                <div className="text-sm">
                  {item.status === 'pending' && (
                    <span className="text-gray-500">Waiting...</span>
                  )}
                  {item.status === 'generating' && (
                    <span className="text-blue-600">Generating...</span>
                  )}
                  {item.status === 'completed' && (
                    <span className="text-green-600">
                      {item.generated} titles generated
                    </span>
                  )}
                  {item.status === 'error' && (
                    <span className="text-red-600">{item.error}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
