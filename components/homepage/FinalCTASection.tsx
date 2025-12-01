'use client';

import Image from 'next/image';
import CTAButton from '../CTAButton';

export default function FinalCTASection() {
  return (
    <section className="py-12 sm:py-20 lg:py-28 gradient-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* App Icon with Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-400/30 rounded-3xl blur-xl animate-pulse" />
            <Image
              src="/AppIcon.png"
              alt="BPCare AI"
              width={100}
              height={100}
              className="rounded-3xl shadow-2xl relative animate-heartbeat"
            />
          </div>
        </div>

        {/* Main Content */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
          <span className="block">Start Understanding Your</span>
          <span className="block">
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Blood Pressure
            </span>{' '}
            Today
          </span>
        </h2>

        <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto">
          Join thousands who've found peace of mind. See the trends, reduce the worry,
          and feel more confident about your heart health.
        </p>

        {/* Key Benefits */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-10">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✓</span>
            </span>
            <span>Free Forever</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✓</span>
            </span>
            <span>No Account Required</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✓</span>
            </span>
            <span>100% Private</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mb-8">
          <CTAButton
            href="https://apps.apple.com/us/app/bpcare-ai-heart-rate-monitor/id6748299186"
            external
            variant="accent"
            size="large"
            animated
            className="shadow-xl"
          >
            <span className="mr-2 text-xl"></span>
            Download Free
          </CTAButton>
        </div>

        {/* Social Sharing */}
        <div className="mb-12">
          <p className="text-gray-600 mb-3">Know someone who might benefit?</p>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'BPCare AI - Blood Pressure Tracking App',
                  text: 'Check out this helpful app for tracking blood pressure and understanding trends!',
                  url: 'https://bpcareai.com',
                });
              }
            }}
            className="inline-flex items-center gap-2 text-brand-blue-dark hover:text-brand-blue transition-colors font-medium"
          >
            <span>❤️</span>
            Share with family or friends
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full">
            <span className="star-rating">★★★★★</span>
            <span className="text-gray-700 text-sm font-medium">4.8 Rating</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full">
            <span>🔒</span>
            <span className="text-gray-700 text-sm font-medium">GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full">
            <span>📱</span>
            <span className="text-gray-700 text-sm font-medium">iOS 14+</span>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="pt-10 border-t border-gray-300/50">
          <p className="text-sm text-gray-600 italic max-w-2xl mx-auto leading-relaxed">
            <strong>Important:</strong> BPCare AI is designed for informational and tracking purposes only.
            It is not a medical device and should not be used to diagnose, treat, or prevent any medical condition.
            Always consult with a qualified healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </section>
  );
}
