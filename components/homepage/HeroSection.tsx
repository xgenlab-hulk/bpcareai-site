import Image from 'next/image';
import CTAButton from '../CTAButton';

export default function HeroSection() {
  return (
    <section className="relative gradient-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm border border-gray-100">
              <span className="star-rating text-lg">★★★★★</span>
              <span className="text-gray-700 font-medium">4.8 on App Store</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Say Goodbye to{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Blood Pressure Anxiety
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">
              See the trends, not just the numbers. BPCare AI helps you understand your blood pressure patterns,
              track your heart health, and feel more confident about your cardiovascular wellness.
            </p>

            {/* Key Benefits */}
            <ul className="space-y-4 text-lg text-gray-700">
              <li className="flex items-start">
                <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-green-600 text-lg">✓</span>
                </span>
                <span><strong>Track trends over time</strong> — one reading doesn't tell the whole story</span>
              </li>
              <li className="flex items-start">
                <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-green-600 text-lg">✓</span>
                </span>
                <span><strong>Monitor HRV & stress</strong> — understand what affects your heart</span>
              </li>
              <li className="flex items-start">
                <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-green-600 text-lg">✓</span>
                </span>
                <span><strong>100% private</strong> — your data never leaves your phone</span>
              </li>
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <CTAButton
                href="https://apps.apple.com/us/app/bpcare-ai-heart-rate-monitor/id6748299186"
                external
                size="large"
                animated
              >
                <span className="mr-2"></span>
                Download Free
              </CTAButton>
              <CTAButton href="#how-it-works" variant="secondary">
                See How It Works
              </CTAButton>
            </div>

            {/* Trust Line */}
            <p className="text-gray-500 text-base flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="text-green-500">✓</span> Free Forever
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-500">✓</span> No Account Needed
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-500">✓</span> Privacy First
              </span>
            </p>
          </div>

          {/* Right: App Showcase */}
          <div className="relative animate-fade-in-up animate-delay-200">
            <div className="relative">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl transform rotate-3 scale-105 opacity-50" />

              {/* Main Card */}
              <div className="glass-card p-6 lg:p-8 relative">
                {/* App Icon */}
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src="/AppIcon.png"
                    alt="BPCare AI"
                    width={64}
                    height={64}
                    className="rounded-2xl shadow-lg animate-heartbeat"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">BPCare AI</h3>
                    <div className="flex items-center gap-2">
                      <span className="star-rating text-sm">★★★★★</span>
                      <span className="text-gray-500 text-sm">4.8 (1.2K reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Mock Trend Chart */}
                <div className="bg-white rounded-xl p-5 mb-4 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800">Your BP Trend</h4>
                    <span className="text-sm text-green-600 font-medium">↓ Improving</span>
                  </div>
                  <div className="h-32 flex items-end justify-around gap-2">
                    {[65, 85, 75, 90, 70, 80, 72].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-brand-blue to-brand-purple rounded-t transition-all duration-300 hover:opacity-80"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>

                {/* Mock Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Heart Rate</p>
                    <p className="text-2xl font-bold text-gray-900">72 <span className="text-base font-normal text-gray-500">bpm</span></p>
                    <span className="text-xs text-green-600 font-medium">Normal range</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Blood Pressure</p>
                    <p className="text-2xl font-bold text-gray-900">118/76</p>
                    <span className="text-xs text-green-600 font-medium">Healthy</span>
                  </div>
                </div>

                {/* Insight Banner */}
                <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">💡 Insight:</span> Your blood pressure has been stable this week. Keep up the good work!
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">100% Private</p>
                  <p className="text-xs text-gray-500">Data stays on device</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
