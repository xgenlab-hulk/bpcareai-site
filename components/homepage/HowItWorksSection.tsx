import CTAButton from '../CTAButton';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Auto Measure & Track',
      description: 'Measure heart rate with your phone camera or log BP in seconds. AI automatically organizes and validates your readings.',
      icon: '🤖',
      detail: 'Camera measurement + AI validation',
    },
    {
      number: '2',
      title: 'AI Trend Analysis',
      description: 'Advanced algorithms detect patterns across days, weeks, and months. Spot concerning trends before they become problems.',
      icon: '📈',
      detail: 'Predictive trend monitoring',
    },
    {
      number: '3',
      title: 'AI Risk Assessment',
      description: 'Medical-grade AI evaluates your cardiovascular risk, identifies warning signs, and provides actionable health insights.',
      icon: '🧠',
      detail: 'Deep health intelligence',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-20 lg:py-28 gradient-bg relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 text-gray-700 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            Simple & Easy
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Three Steps to{' '}
            <span className="bg-gradient-to-r from-brand-blue-dark to-brand-purple bg-clip-text text-transparent">
              Better Understanding
            </span>
          </h2>
          <p className="text-base lg:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Getting started is easy. Track your health in just a few taps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-brand-blue/40 to-brand-purple/40" />
              )}

              <div className="text-center relative z-10 bg-white/60 backdrop-blur-sm rounded-2xl p-8 card-hover">
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-purple rounded-full text-white text-2xl font-bold mb-6 shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-4">{step.icon}</div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Detail Tag */}
                <span className="inline-block px-3 py-1 bg-brand-blue-light/50 text-brand-blue-dark rounded-full text-sm font-medium">
                  {step.detail}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            Ready to understand your blood pressure better?
          </p>
          <CTAButton
            href="https://apps.apple.com/us/app/bpcare-ai-heart-rate-monitor/id6748299186"
            external
            size="large"
          >
            <span className="mr-2"></span>
            Start Tracking Now
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
