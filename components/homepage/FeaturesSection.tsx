export default function FeaturesSection() {
  const features = [
    {
      icon: '📈',
      title: 'Track Your Trends',
      description: 'One high reading doesn\'t tell the whole story. See how your blood pressure changes over days, weeks, and months.',
      benefit: 'Understand patterns, reduce worry',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: '💓',
      title: 'Beyond Blood Pressure',
      description: 'Monitor heart rate variability (HRV), stress indicators, and other cardiovascular metrics for a complete picture.',
      benefit: 'Comprehensive heart health view',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: '🧘',
      title: 'Made for Peace of Mind',
      description: 'If you worry about blood pressure, BPCare AI helps you see patterns clearly and reduces anxiety about single readings.',
      benefit: 'Less stress, more confidence',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: '🔒',
      title: '100% Private & Secure',
      description: 'All your health data stays on your device. No cloud uploads, no data sharing, no account required.',
      benefit: 'Your data is yours alone',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-brand-blue-light/50 text-brand-blue-dark rounded-full text-sm font-semibold mb-4">
            Why Choose BPCare AI
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Features Designed for{' '}
            <span className="bg-gradient-to-r from-brand-blue-dark to-brand-purple bg-clip-text text-transparent">
              Your Health
            </span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We understand that managing blood pressure can be stressful. BPCare AI is designed to
            help you feel more confident and informed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 card-hover gradient-border overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-base leading-relaxed mb-4">{feature.description}</p>

              {/* Benefit Tag */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${feature.bgColor} rounded-full`}>
                <span className="text-green-600">✓</span>
                <span className="text-sm font-medium text-gray-700">{feature.benefit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
