import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllArticlesMeta } from '@/lib/articles';
import { CATEGORIES, getCategoryBySlug, getCategoryForCluster } from '@/lib/article-categories';
import ArticleSearch from '@/components/ArticleSearch';
import { ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Health Articles',
  description:
    'Learn about blood pressure, heart health, HRV, and cardiovascular wellness through evidence-based articles.',
};

const ARTICLES_PER_PAGE = 20;
const MAX_VISIBLE_PAGES = 5;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const categorySlug =
    typeof resolvedParams.category === 'string' ? resolvedParams.category : '';
  const searchQuery =
    typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const pageParam =
    typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const allArticles = getAllArticlesMeta();

  // --- Count articles per category (before any filtering) ---
  const categoryCounts: Record<string, number> = {};
  CATEGORIES.forEach((cat) => {
    categoryCounts[cat.slug] = 0;
  });
  allArticles.forEach((article) => {
    const cat = getCategoryForCluster(article.topicCluster);
    if (cat) {
      categoryCounts[cat.slug] = (categoryCounts[cat.slug] || 0) + 1;
    }
  });

  // --- Filter by category ---
  const selectedCategory = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
  let filtered = allArticles;
  if (selectedCategory) {
    const clusterSet = new Set(selectedCategory.clusters);
    filtered = filtered.filter(
      (a) => a.topicCluster && clusterSet.has(a.topicCluster)
    );
  }

  // --- Filter by search query ---
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.primaryKeyword && a.primaryKeyword.toLowerCase().includes(q))
    );
  }

  // --- Pagination ---
  const totalArticles = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / ARTICLES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = filtered.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  // --- Build pagination page numbers ---
  let startPage = Math.max(1, safePage - Math.floor(MAX_VISIBLE_PAGES / 2));
  const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);
  if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
    startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
  }
  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // --- Helper: build URL with params ---
  function buildUrl(params: { category?: string; page?: number; q?: string }) {
    const parts: string[] = [];
    const cat = params.category !== undefined ? params.category : categorySlug;
    const query = params.q !== undefined ? params.q : searchQuery;
    const pg = params.page !== undefined ? params.page : safePage;
    if (cat) parts.push(`category=${encodeURIComponent(cat)}`);
    if (query) parts.push(`q=${encodeURIComponent(query)}`);
    if (pg > 1) parts.push(`page=${pg}`);
    return `/articles${parts.length > 0 ? '?' + parts.join('&') : ''}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Health Articles
          </h1>
        </div>

        {/* Editorial Standards */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 border border-blue-100/60 rounded-full shadow-sm">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Evidence-Based
              </span>
              <span className="text-xs text-gray-600">
                • Reviewed by medical guidelines • Updated regularly
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <Suspense fallback={null}>
          <ArticleSearch />
        </Suspense>

        {/* Category Tabs */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          <Link
            href={buildUrl({ category: '', page: 1 })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !categorySlug
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={buildUrl({ category: cat.slug, page: 1 })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categorySlug === cat.slug
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Articles List */}
        {paginatedArticles.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-lg text-gray-600">
              {searchQuery
                ? 'No articles match your search. Try different keywords.'
                : 'Articles coming soon. We\'re preparing comprehensive guides on blood pressure and heart health.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedArticles.map((article) => {
              const articleCategory = getCategoryForCluster(article.topicCluster);
              return (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="flex flex-col glass-card p-6 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {articleCategory && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {articleCategory.label}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(article.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-gray-900 mb-4 group-hover:text-brand-blue-dark transition-colors leading-snug line-clamp-3 h-[4.2rem]">
                    {article.title}
                  </h2>

                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-5 flex-1">
                    {article.description}
                  </p>

                  <span className="mt-4 text-sm text-brand-blue-dark font-semibold group-hover:underline">
                    Read article →
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Results count + Pagination */}
        <div className="mt-8 text-center text-sm text-gray-400">
          {totalArticles} article{totalArticles !== 1 ? 's' : ''}
          {selectedCategory ? ` in ${selectedCategory.label}` : ''}
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </div>
        {totalPages > 1 && (
          <nav className="mt-12 flex justify-center items-center gap-2" aria-label="Pagination">
            {/* Previous */}
            {safePage > 1 ? (
              <Link
                href={buildUrl({ page: safePage - 1 })}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                Previous
              </Link>
            ) : (
              <span className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100 cursor-not-allowed">
                Previous
              </span>
            )}

            {/* Page numbers */}
            {pageNumbers.map((num) => (
              <Link
                key={num}
                href={buildUrl({ page: num })}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  num === safePage
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {num}
              </Link>
            ))}

            {/* Next */}
            {safePage < totalPages ? (
              <Link
                href={buildUrl({ page: safePage + 1 })}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                Next
              </Link>
            ) : (
              <span className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100 cursor-not-allowed">
                Next
              </span>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
