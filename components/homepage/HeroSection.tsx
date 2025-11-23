import Image from 'next/image';
import CTAButton from '../CTAButton';

export default function HeroSection() {
  return (
    <section className="relative gradient-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-5 sm:space-y-8 animate-fade-in-up">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm border border-gray-100">
              <span className="star-rating text-lg">★★★★★</span>
              <span className="text-gray-700 font-medium">4.8 on App Store</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Say Goodbye to{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Blood Pressure Anxiety
              </span>
            </h1>

            <p className="text-base sm:text-xl lg:text-2xl text-gray-700 leading-relaxed">
              See the trends, not just the numbers. BPCare AI helps you understand your blood pressure patterns,
              track your heart health, and feel more confident about your cardiovascular wellness.
            </p>

            {/* Key Benefits */}
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-lg text-gray-700">
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

                {/* Professional BP Trend Chart - Modern Design */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-3 sm:p-5 mb-4 shadow-sm border border-gray-100">
                  {/* Chart Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <h4 className="font-semibold text-gray-800">Blood Pressure</h4>
                      </div>
                      <p className="text-xs text-gray-400">7-day trend analysis</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">118<span className="text-gray-400 font-normal">/</span>76</div>
                      <div className="flex items-center justify-end gap-1 text-green-600">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="text-xs font-medium">Improving</span>
                      </div>
                    </div>
                  </div>

                  {/* Modern Area Chart */}
                  <div className="relative h-32 mb-3">
                    <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                      {/* Grid */}
                      <defs>
                        <linearGradient id="systolicGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.05"/>
                        </linearGradient>
                        <linearGradient id="diastolicGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05"/>
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Horizontal grid lines */}
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#fee2e2" strokeWidth="1" strokeDasharray="4,4"/>
                      <line x1="0" y1="40" x2="300" y2="40" stroke="#f3f4f6" strokeWidth="1"/>
                      <line x1="0" y1="60" x2="300" y2="60" stroke="#f3f4f6" strokeWidth="1"/>
                      <line x1="0" y1="80" x2="300" y2="80" stroke="#f3f4f6" strokeWidth="1"/>

                      {/* Normal range band */}
                      <rect x="0" y="25" width="300" height="35" fill="#dcfce7" opacity="0.5"/>

                      {/* Systolic Area */}
                      <path
                        d="M 20,35 Q 45,28 70,32 T 120,25 T 170,38 T 220,30 T 280,33 L 280,100 L 20,100 Z"
                        fill="url(#systolicGradient)"
                      />
                      {/* Systolic Line */}
                      <path
                        d="M 20,35 Q 45,28 70,32 T 120,25 T 170,38 T 220,30 T 280,33"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        filter="url(#glow)"
                      />

                      {/* Diastolic Area */}
                      <path
                        d="M 20,72 Q 45,68 70,70 T 120,65 T 170,73 T 220,68 T 280,70 L 280,100 L 20,100 Z"
                        fill="url(#diastolicGradient)"
                      />
                      {/* Diastolic Line */}
                      <path
                        d="M 20,72 Q 45,68 70,70 T 120,65 T 170,73 T 220,68 T 280,70"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        filter="url(#glow)"
                      />

                      {/* Data points - Systolic */}
                      <circle cx="20" cy="35" r="4" fill="#EF4444" stroke="white" strokeWidth="2"/>
                      <circle cx="70" cy="32" r="4" fill="#EF4444" stroke="white" strokeWidth="2"/>
                      <circle cx="120" cy="25" r="4" fill="#EF4444" stroke="white" strokeWidth="2"/>
                      <circle cx="170" cy="38" r="4" fill="#EF4444" stroke="white" strokeWidth="2"/>
                      <circle cx="220" cy="30" r="4" fill="#EF4444" stroke="white" strokeWidth="2"/>
                      <circle cx="280" cy="33" r="5" fill="#EF4444" stroke="white" strokeWidth="2" filter="url(#glow)"/>

                      {/* Data points - Diastolic */}
                      <circle cx="20" cy="72" r="4" fill="#3B82F6" stroke="white" strokeWidth="2"/>
                      <circle cx="70" cy="70" r="4" fill="#3B82F6" stroke="white" strokeWidth="2"/>
                      <circle cx="120" cy="65" r="4" fill="#3B82F6" stroke="white" strokeWidth="2"/>
                      <circle cx="170" cy="73" r="4" fill="#3B82F6" stroke="white" strokeWidth="2"/>
                      <circle cx="220" cy="68" r="4" fill="#3B82F6" stroke="white" strokeWidth="2"/>
                      <circle cx="280" cy="70" r="5" fill="#3B82F6" stroke="white" strokeWidth="2" filter="url(#glow)"/>

                      {/* Today indicator line */}
                      <line x1="280" y1="0" x2="280" y2="100" stroke="#6366f1" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>
                    </svg>

                    {/* Y-Axis Labels */}
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-gray-400 -ml-1">
                      <span>140</span>
                      <span>120</span>
                      <span>100</span>
                      <span>80</span>
                    </div>

                    {/* Today's value tooltip */}
                    <div className="absolute right-1 sm:right-0 top-2 sm:top-4 bg-gray-900 text-white text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-1 rounded shadow-lg">
                      <div className="font-medium">Today</div>
                      <div className="text-red-300">120 sys</div>
                      <div className="text-blue-300">78 dia</div>
                    </div>
                  </div>

                  {/* X-Axis */}
                  <div className="flex justify-between text-[10px] text-gray-400 px-4 mb-4">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span className="text-indigo-600 font-semibold">Today</span>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-xs text-gray-500">Systolic</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-700">118 avg</div>
                    </div>
                    <div className="text-center border-x border-gray-100">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-xs text-gray-500">Diastolic</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-700">76 avg</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-xs text-gray-500">Status</span>
                      </div>
                      <div className="text-sm font-semibold text-green-600">Normal</div>
                    </div>
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

            {/* Floating Badge - Hidden on mobile to avoid overlap */}
            <div className="hidden sm:block absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float">
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
