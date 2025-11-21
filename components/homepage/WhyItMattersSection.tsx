export default function WhyItMattersSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-brand-blue-light/30 to-brand-purple-light/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Understanding Trends Matters
          </h2>
        </div>

        <div className="glass-card p-8 lg:p-12 space-y-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-800 leading-relaxed mb-6">
              A single high blood pressure reading can be worrying. But here's what many people don't realize:
            </p>

            <div className="space-y-6 text-lg text-gray-700">
              <div className="flex items-start">
                <span className="text-3xl mr-4">📉</span>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">One reading doesn't tell the whole story</p>
                  <p className="leading-relaxed">
                    Blood pressure naturally varies throughout the day. Stress, coffee, even the time you measure can affect your numbers.
                    What matters most is the pattern over time.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-3xl mr-4">🔍</span>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Context is everything</p>
                  <p className="leading-relaxed">
                    By tracking multiple readings with notes about your lifestyle, activity, and stress, you can see
                    what actually affects your blood pressure — and what you can do about it.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-3xl mr-4">🧠</span>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Knowledge reduces anxiety</p>
                  <p className="leading-relaxed">
                    When you understand your patterns, you can stop worrying about each individual reading and focus
                    on the bigger picture of your health. BPCare AI helps you feel more in control, not more worried.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-brand-blue-light/50 rounded-xl border-l-4 border-brand-blue">
              <p className="text-lg text-gray-800 italic">
                "The goal isn't to obsess over every number — it's to understand your unique patterns and work with your
                healthcare provider to make informed decisions."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
