import CTAButton from '../CTAButton';

export default function FinalCTASection() {
  return (
    <section className="py-20 lg:py-32 gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          Start Understanding Your Blood Pressure Today
        </h2>
        <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-10">
          See the trends. Reduce the worry. Feel more confident about your heart health.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <CTAButton href="https://apps.apple.com/app/bpcareai" external>
            Download on App Store
          </CTAButton>
        </div>

        <p className="text-base text-gray-600">
          Free to download • Privacy-focused • No data sharing
        </p>

        <div className="mt-12 pt-12 border-t border-gray-300">
          <p className="text-sm text-gray-600 italic max-w-2xl mx-auto leading-relaxed">
            <strong>Important:</strong> BPCare AI is designed for informational and tracking purposes only.
            It is not a medical device and should not be used to diagnose, treat, or prevent any medical condition.
            Always consult with a qualified healthcare professional for medical advice and before making changes to your treatment.
          </p>
        </div>
      </div>
    </section>
  );
}
