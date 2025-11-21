import FeatureCard from '../FeatureCard';

export default function FeaturesSection() {
  const features = [
    {
      icon: '📈',
      title: 'Track Your Trends',
      description: 'One high reading doesn\'t tell the whole story. See how your blood pressure and heart rate change over time to understand what\'s really happening.',
    },
    {
      icon: '💓',
      title: 'Beyond Blood Pressure',
      description: 'Monitor heart rate variability (HRV), stress levels, and other cardiovascular indicators that give you a complete picture of your heart health.',
    },
    {
      icon: '🫂',
      title: 'Made for Peace of Mind',
      description: 'If you worry about blood pressure, BPCare AI helps you see patterns clearly and reduces anxiety by showing you the bigger picture.',
    },
    {
      icon: '🔒',
      title: '100% Private & Secure',
      description: 'All your health data stays on your device. No cloud uploads, no data sharing. Your information is yours alone.',
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why BPCare AI?
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We understand that managing blood pressure can be stressful. BPCare AI is designed to
            help you feel more confident and informed about your heart health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
