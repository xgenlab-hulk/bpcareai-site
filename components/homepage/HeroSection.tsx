import CTAButton from '../CTAButton';

export default function HeroSection() {
  return (
    <section className="relative gradient-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Understanding Your Blood Pressure,{' '}
              <span className="bg-gradient-to-r from-brand-blue-dark to-brand-purple bg-clip-text text-transparent">
                One Reading at a Time
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">
              See the bigger picture, not just the numbers. BPCare AI helps you track blood pressure trends,
              understand your heart rate, and feel more confident about your cardiovascular health.
            </p>

            <ul className="space-y-4 text-lg text-gray-700">
              <li className="flex items-start">
                <span className="text-2xl mr-3">📊</span>
                <span>Track blood pressure and heart rate over time, not just single readings</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">❤️</span>
                <span>Monitor heart rate variability (HRV), stress levels, and cardiovascular indicators</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">🧘</span>
                <span>Designed for those with blood pressure concerns — clear insights, less worry</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <CTAButton href="https://apps.apple.com/app/bpcareai" external>
                Download on App Store
              </CTAButton>
              <CTAButton href="#how-it-works" variant="secondary">
                Learn How It Works
              </CTAButton>
            </div>
          </div>

          {/* Right: Visual/Mockup */}
          <div className="relative">
            <div className="glass-card p-8 lg:p-12 transform hover:scale-105 transition-transform duration-300">
              <div className="space-y-6">
                {/* Mock Trend Chart */}
                <div className="bg-white/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Blood Pressure Trend</h3>
                  <div className="h-48 bg-gradient-to-br from-brand-blue-light to-brand-purple-light rounded-lg flex items-end justify-around p-4 space-x-2">
                    <div className="w-12 bg-brand-blue rounded-t h-24"></div>
                    <div className="w-12 bg-brand-blue rounded-t h-32"></div>
                    <div className="w-12 bg-brand-blue rounded-t h-28"></div>
                    <div className="w-12 bg-brand-blue rounded-t h-36"></div>
                    <div className="w-12 bg-brand-blue rounded-t h-32"></div>
                  </div>
                </div>

                {/* Mock Metrics Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Heart Rate</p>
                    <p className="text-2xl font-bold text-gray-900">72 bpm</p>
                    <p className="text-xs text-green-600 mt-1">Normal</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">HRV Score</p>
                    <p className="text-2xl font-bold text-gray-900">65 ms</p>
                    <p className="text-xs text-green-600 mt-1">Good</p>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-600 italic">
                  Track trends, not just numbers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
