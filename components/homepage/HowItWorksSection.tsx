import CTAButton from '../CTAButton';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Record Your Readings',
      description: 'Easily log your blood pressure readings, or measure heart rate using your phone\'s camera. Quick and simple — takes just seconds.',
      icon: '📝',
      detail: 'Manual entry or camera measurement',
    },
    {
      number: '2',
      title: 'See Clear Trends',
      description: 'BPCare AI organizes your data into easy-to-understand charts. See patterns over days, weeks, and months at a glance.',
      icon: '📊',
      detail: 'Visual charts & insights',
    },
    {
      number: '3',
      title: 'Get Personalized Insights',
      description: 'Receive gentle guidance on what your readings mean. Know when things look good and when you might want to consult your doctor.',
      icon: '💡',
      detail: 'Simple, caring guidance',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 gradient-bg relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-white/80 text-gray-700 rounded-full text-sm font-semibold mb-4">
            Simple & Easy
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Three Steps to{' '}
            <span className="bg-gradient-to-r from-brand-blue-dark to-brand-purple bg-clip-text text-transparent">
              Better Understanding
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
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
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
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
          <p className="text-xl text-gray-700 mb-6">
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
