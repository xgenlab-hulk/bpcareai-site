export default function WhoItsForSection() {
  const personas = [
    {
      icon: '🩺',
      title: 'Managing Hypertension',
      description: 'Already diagnosed with high blood pressure and need to monitor it regularly. BPCare AI helps you keep track and spot trends.',
    },
    {
      icon: '😰',
      title: 'Worried About Blood Pressure',
      description: 'Your readings are sometimes high, and you find yourself checking often. See patterns over time and worry less about single readings.',
    },
    {
      icon: '❤️‍🩹',
      title: 'Heart Health Conscious',
      description: 'Over 40 and want to stay on top of cardiovascular health. Track important metrics and catch changes early.',
    },
    {
      icon: '👨‍⚕️',
      title: 'Preparing for Doctor Visits',
      description: 'Need organized data to share with your healthcare provider. Export clear reports that show your blood pressure history.',
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Who Is BPCare AI For?
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            If any of these sound like you, BPCare AI can help
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {personas.map((persona, index) => (
            <div
              key={index}
              className="glass-card p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-5xl mb-6">{persona.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{persona.title}</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {persona.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
