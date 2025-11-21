import Link from 'next/link';
import CTAButton from '../CTAButton';

// This will be replaced with actual article data later
const placeholderArticles = [
  {
    slug: 'understanding-blood-pressure-numbers',
    title: 'Understanding Your Blood Pressure Numbers',
    description: 'What do systolic and diastolic mean? A simple guide to reading your blood pressure.',
    date: '2024-11-15',
  },
  {
    slug: 'heart-rate-variability-explained',
    title: 'Heart Rate Variability: What It Tells You',
    description: 'Learn how HRV reflects your stress levels and overall cardiovascular health.',
    date: '2024-11-10',
  },
  {
    slug: 'when-to-worry-about-high-readings',
    title: 'When Should You Worry About a High Reading?',
    description: 'Understanding the difference between a temporary spike and a concerning pattern.',
    date: '2024-11-05',
  },
];

export default function ArticlesPreviewSection() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Learn More About Heart Health
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Evidence-based articles to help you understand blood pressure, heart rate, and cardiovascular wellness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {placeholderArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="glass-card p-8 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span>📅</span>
                <span className="ml-2">{new Date(article.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-blue-dark transition-colors">
                {article.title}
              </h3>

              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {article.description}
              </p>

              <span className="text-brand-blue-dark font-semibold group-hover:underline">
                Read more →
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <CTAButton href="/articles" variant="secondary">
            View All Articles
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
