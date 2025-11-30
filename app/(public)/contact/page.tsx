import type { Metadata } from 'next';
import { Mail, Clock, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch',
  description: 'Have questions about BPCare AI? Contact our team for support, feedback, or topic suggestions. We typically respond within 2-3 business days.',
  openGraph: {
    title: 'Contact Us - BPCare AI',
    description: 'Get in touch with the BPCare AI team for support and feedback.',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Schema.org ContactPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact BPCare AI',
            description: 'Contact page for BPCare AI support and inquiries',
            mainEntity: {
              '@type': 'Organization',
              name: 'BPCare AI',
              email: 'support@bpcareai.com',
            },
          }),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Contact Us
            </h1>
          </div>
          <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
            Thank you for visiting BPCare AI. We'd love to hear from you about content questions,
            topic suggestions, or feedback about your experience.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Email Card */}
          <div className="group glass-card p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Email Address</h2>
                <a
                  href="mailto:support@bpcareai.com"
                  className="text-base text-brand-blue-dark hover:text-brand-blue font-medium inline-flex items-center gap-2 group/link break-all"
                >
                  support@bpcareai.com
                  <span className="opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Response Time Card */}
          <div className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-11 h-11 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Response Time</h2>
                <p className="text-base text-gray-700">
                  Typically within <strong className="text-gray-900">2-3 business days</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 border border-blue-100 rounded-2xl p-8 lg:p-10">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Our Mission
              </h3>
              <p className="text-base text-gray-700 leading-relaxed">
                We're leveraging technology to make cardiovascular health insights accessible to everyone.
                Through evidence-based education and intuitive tools, we empower individuals to understand
                their heart health with clarity and confidence—bridging the gap between complex medical data
                and everyday wellness.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Looking for something else?
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-brand-blue-dark hover:text-brand-blue-dark transition-all duration-200 shadow-sm text-sm"
            >
              Browse Articles
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-brand-blue-dark hover:text-brand-blue-dark transition-all duration-200 shadow-sm text-sm"
            >
              About Us
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-brand-blue-dark hover:text-brand-blue-dark transition-all duration-200 shadow-sm text-sm"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
