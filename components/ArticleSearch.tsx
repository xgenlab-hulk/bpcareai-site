'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export default function ArticleSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || '';

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams();
      if (currentCategory) {
        params.set('category', currentCategory);
      }
      if (value.trim()) {
        params.set('q', value.trim());
      }
      const qs = params.toString();
      startTransition(() => {
        router.push(`/articles${qs ? `?${qs}` : ''}`);
      });
    },
    [router, currentCategory, startTransition]
  );

  return (
    <div className="relative max-w-xl mx-auto mb-8">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isPending ? 'text-blue-500 animate-pulse' : 'text-gray-500'}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <input
        type="text"
        defaultValue={currentQuery}
        placeholder="Search articles by title, keyword, or topic..."
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 text-gray-900 placeholder:text-gray-400 transition-all"
      />
    </div>
  );
}
