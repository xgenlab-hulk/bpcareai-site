import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticleBySlug, getAllArticleSlugs, getAllArticlesMeta } from '@/lib/articles';
import CTAButton from '@/components/CTAButton';
import { JsonLd, generateArticleJsonLd } from '@/components/JsonLd';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 生成静态参数
export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// 生成元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/articles/${resolvedParams.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  // 获取最新的3篇文章作为相关推荐
  const allArticles = getAllArticlesMeta();
  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  // 生成 JSON-LD 数据
  const articleJsonLd = generateArticleJsonLd({
    title: article.title,
    description: article.description,
    date: article.date,
    updated: article.updated,
    slug: article.slug,
    image: article.image,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Article JSON-LD */}
      <JsonLd data={articleJsonLd} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Link */}
        <Link
          href="/articles"
          className="inline-flex items-center text-brand-blue-dark hover:text-brand-blue mb-8 font-medium"
        >
          ← Back to Articles
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center text-gray-600 mb-4">
            <span>📅</span>
            <span className="ml-2">
              {new Date(article.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {article.title}
          </h1>

          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            {article.description}
          </p>

          {article.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-brand-blue-light text-brand-blue-dark rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none markdown-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Medical Disclaimer */}
        <div className="mt-12 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <p className="text-sm text-gray-700 italic">
            <strong>Medical Disclaimer:</strong> This article is for informational purposes only and
            should not be considered medical advice. Always consult with a qualified healthcare
            professional before making any changes to your health routine or treatment plan.
          </p>
        </div>

        {/* CTA Section */}
        <div className="mt-16 glass-card p-8 lg:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Track Your Blood Pressure with BPCare AI
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Put these insights into practice. Download BPCare AI to track your blood pressure
            trends, understand your heart health, and feel more confident.
          </p>
          <CTAButton href="https://apps.apple.com/us/app/bpcare-ai-heart-rate-monitor/id6748299186" external>
            Download on App Store
          </CTAButton>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.slug}
                  href={`/articles/${relatedArticle.slug}`}
                  className="glass-card p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue-dark transition-colors">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {relatedArticle.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
