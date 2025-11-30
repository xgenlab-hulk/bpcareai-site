import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllArticlesMeta } from '@/lib/articles';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Health Articles',
  description: 'Learn about blood pressure, heart health, HRV, and cardiovascular wellness through evidence-based articles.',
};

export default function ArticlesPage() {
  const articles = getAllArticlesMeta();

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
        <div className="mb-10 flex justify-center">
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

        {/* Articles List */}
        {articles.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-lg text-gray-600">
              Articles coming soon. We're preparing comprehensive guides on blood pressure and heart health.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="block glass-card p-8 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2 sm:mb-0">
                    <span>📅</span>
                    <span className="ml-2">
                      {new Date(article.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {article.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-brand-blue-light text-brand-blue-dark text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-blue-dark transition-colors">
                  {article.title}
                </h2>

                <p className="text-gray-700 text-base leading-relaxed mb-4">
                  {article.description}
                </p>

                <span className="text-brand-blue-dark font-semibold group-hover:underline">
                  Read article →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
