export default function WhyItMattersSection() {
  const insights = [
    {
      icon: '📉',
      title: 'One reading doesn\'t tell the whole story',
      description: 'Blood pressure naturally varies throughout the day. Stress, coffee, even the time you measure can affect your numbers. What matters most is the pattern over time.',
    },
    {
      icon: '🔍',
      title: 'Context is everything',
      description: 'By tracking multiple readings with notes about your lifestyle, activity, and stress, you can see what actually affects your blood pressure — and what you can do about it.',
    },
    {
      icon: '🧠',
      title: 'Knowledge reduces anxiety',
      description: 'When you understand your patterns, you can stop worrying about each individual reading and focus on the bigger picture. BPCare AI helps you feel more in control, not more worried.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-semibold mb-4 shadow-sm">
            Understanding Blood Pressure
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why{' '}
            <span className="bg-gradient-to-r from-brand-blue-dark to-brand-purple bg-clip-text text-transparent">
              Trends Matter
            </span>{' '}
            More Than Numbers
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100">
          {/* Opening Statement */}
          <div className="text-center mb-10">
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">
              A single high blood pressure reading can be worrying.{' '}
              <span className="font-semibold text-gray-900">But here's what many people don't realize:</span>
            </p>
          </div>

          {/* Insights */}
          <div className="space-y-8 mb-10">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-5 p-6 bg-gray-50 rounded-2xl card-hover"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-3xl">{insight.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {insight.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quote Box */}
          <div className="bg-gradient-to-r from-brand-blue-light/50 to-brand-purple-light/50 rounded-2xl p-6 border-l-4 border-brand-blue">
            <p className="text-lg text-gray-800 italic leading-relaxed">
              "The goal isn't to obsess over every number — it's to understand your unique patterns
              and work with your healthcare provider to make informed decisions about your health."
            </p>
          </div>

          {/* Research Note */}
          <div className="mt-8 flex items-center justify-center gap-3 text-gray-500">
            <span className="text-lg">📚</span>
            <span className="text-sm">
              Based on guidance from the American Heart Association on home blood pressure monitoring
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
