import CTAButton from '../CTAButton';

export default function WhoItsForSection() {
  const personas = [
    {
      icon: '🩺',
      title: 'Managing Hypertension',
      description: 'Already diagnosed with high blood pressure? BPCare AI helps you track readings, spot trends, and stay on top of your condition.',
      scenario: '"I need to monitor my BP daily for my doctor"',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: '😰',
      title: 'Worried About Readings',
      description: 'Do you check your blood pressure often and worry about every high number? See patterns over time and reduce anxiety about single readings.',
      scenario: '"Every high reading makes me anxious"',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      icon: '❤️',
      title: 'Heart Health Conscious',
      description: 'Over 40 and want to stay proactive about cardiovascular health? Track important metrics and catch changes before they become problems.',
      scenario: '"I want to take care of my heart health"',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      icon: '👨‍⚕️',
      title: 'Preparing for Doctor Visits',
      description: 'Need organized data to share with your healthcare provider? Export clear reports that show your blood pressure history at a glance.',
      scenario: '"I want to show my doctor my BP trends"',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
  ];

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 text-red-600 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            Is This You?
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            BPCare AI Is Made For{' '}
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              People Like You
            </span>
          </h2>
          <p className="text-base sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            If any of these sound familiar, you're in the right place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {personas.map((persona, index) => (
            <div
              key={index}
              className={`relative ${persona.bgColor} rounded-2xl p-8 border-2 ${persona.borderColor} card-hover group`}
            >
              {/* Checkmark */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-green-500 font-bold">✓</span>
              </div>

              <div className="text-5xl mb-5">{persona.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{persona.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                {persona.description}
              </p>

              {/* User Scenario Quote */}
              <div className="bg-white/80 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-700 italic text-base">
                  {persona.scenario}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-10">
          <p className="text-2xl font-semibold text-gray-900 mb-2">
            Sound like you?
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Join thousands who've found peace of mind with BPCare AI
          </p>
          <CTAButton
            href="https://apps.apple.com/us/app/bpcare-ai-heart-rate-monitor/id6748299186"
            external
            variant="accent"
            size="large"
          >
            <span className="mr-2"></span>
            Try It Free
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
