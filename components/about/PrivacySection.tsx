/**
 * Privacy & Security Section
 * Simplified, focused on core commitments
 */
import Link from 'next/link';
import { Shield, Lock, Eye, Download } from 'lucide-react';

export function PrivacySection() {
  const commitments = [
    {
      icon: Shield,
      title: 'Your Data is Yours',
      description: 'We never sell or share your health information. Period.',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Lock,
      title: 'Bank-Level Encryption',
      description: 'Your data is protected with the same encryption used by financial institutions.',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Eye,
      title: 'Transparent Use',
      description: 'We only use your data to provide app features—no hidden purposes, no data mining.',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Download,
      title: 'Full Control',
      description: "Export, delete, or transfer your data anytime. It's your information.",
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <section className="bg-white px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Your Privacy,{' '}
            <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              Protected
            </span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Health data is deeply personal. We take that responsibility seriously.
          </p>
        </div>

        {/* Commitments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {commitments.map((commitment, index) => {
            const Icon = commitment.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 ${commitment.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${commitment.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {commitment.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{commitment.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* HIPAA Compliance Badge */}
        <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6 text-center mb-8">
          <p className="text-lg font-semibold text-blue-900">
            ✓ HIPAA-Compliant Practices Guide Our Data Handling Standards
          </p>
        </div>

        {/* Learn More Link */}
        <div className="text-center">
          <p className="text-gray-700 mb-3">
            Learn more about how we protect your information:
          </p>
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold underline transition-colors"
          >
            Read Our Privacy Policy →
          </Link>
        </div>
      </div>
    </section>
  );
}
