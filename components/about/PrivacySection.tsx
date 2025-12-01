/**
 * Privacy & Security Section
 * Simplified, focused on core commitments
 */
import Link from 'next/link';
import { Shield, Lock, Eye, Download, CheckCircle2, ArrowRight } from 'lucide-react';

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

        {/* Commitments Grid - 1 row, 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {commitments.map((commitment, index) => {
            const Icon = commitment.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-12 h-12 ${commitment.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${commitment.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {commitment.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{commitment.description}</p>
              </div>
            );
          })}
        </div>

        {/* HIPAA & Privacy Policy - Side by Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* HIPAA Compliance Card */}
          <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:border-blue-200 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-blue-900 mb-1">HIPAA-Compliant Standards</h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Our data handling practices follow HIPAA-compliant guidelines to ensure the highest level of privacy protection.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Policy Card */}
          <Link
            href="/privacy"
            className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:border-green-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-green-900 mb-1">Privacy Policy</h3>
                  <p className="text-sm text-green-700 leading-relaxed">
                    Learn more about how we protect your information
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
