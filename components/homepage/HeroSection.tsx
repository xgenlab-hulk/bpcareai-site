'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CTAButton from '../CTAButton';

export default function HeroSection() {
  const rotatingTexts = [
    'Blood Pressure Anxiety',
    'Missed Warning Signs',
    'White Coat Hypertension',
    'Hidden HA/Stroke Risks',
    'Arrhythmia Uncertainty',
    'Confusing Numbers',
    'Scattered Health Records',
    'Tracking Frustration',
    'Heart Risk Uncertainty',
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
        setIsVisible(true);
      }, 500);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative gradient-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="animate-fade-in-up">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm border border-gray-100 mb-6 sm:mb-8">
              <span className="star-rating text-lg">★★★★★</span>
              <span className="text-gray-700 font-medium">4.8 on App Store</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-gray-900 mb-6 sm:mb-8">
              <span className="block leading-[1.2]">Say Goodbye to</span>
              <span
                className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent inline-block transition-opacity duration-500 leading-[1.0]"
                style={{
                  opacity: isVisible ? 1 : 0,
                  display: 'inline-block',
                  minHeight: '2.0em'
                }}
              >
                {rotatingTexts[currentTextIndex]}
              </span>
            </h1>

            <p className="text-base lg:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
              See the trends, not just the numbers. BPCare AI helps you understand your blood pressure patterns,
              track your heart health, and feel more confident about your cardiovascular wellness.
            </p>

            {/* Key Benefits */}
            <ul className="space-y-3 sm:space-y-4 text-sm lg:text-base text-gray-700 mb-4 sm:mb-6">
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
            <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
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
                      <div className="text-2xl font-bold text-gray-900">115<span className="text-gray-400 font-normal">/</span>72</div>
                      <div className="flex items-center justify-end gap-1.5 text-green-600">
                        <span className="text-xs font-semibold bg-green-100 px-1.5 py-0.5 rounded">↓9</span>
                        <span className="text-[10px] text-gray-500">vs last week</span>
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

                      {/* Last Week Comparison Lines (dashed, lighter) - different wave pattern */}
                      {/* Last Week Systolic - overall higher, different shape */}
                      <path
                        d="M 20,22 Q 45,26 70,28 T 120,20 T 170,26 T 220,30 T 280,28"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray="4,4"
                        opacity="0.4"
                      />
                      {/* Last Week Diastolic - overall higher, different shape */}
                      <path
                        d="M 20,58 Q 45,62 70,64 T 120,56 T 170,62 T 220,66 T 280,64"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray="4,4"
                        opacity="0.4"
                      />

                      {/* Systolic Area - This Week: trending downward */}
                      <path
                        d="M 20,30 Q 45,34 70,36 T 120,32 T 170,38 T 220,40 T 280,45 L 280,100 L 20,100 Z"
                        fill="url(#systolicGradient)"
                      />
                      {/* Systolic Line - This Week */}
                      <path
                        d="M 20,30 Q 45,34 70,36 T 120,32 T 170,38 T 220,40 T 280,45"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        filter="url(#glow)"
                      />

                      {/* Diastolic Area - This Week: trending downward */}
                      <path
                        d="M 20,66 Q 45,70 70,72 T 120,68 T 170,74 T 220,76 T 280,80 L 280,100 L 20,100 Z"
                        fill="url(#diastolicGradient)"
                      />
                      {/* Diastolic Line - This Week */}
                      <path
                        d="M 20,66 Q 45,70 70,72 T 120,68 T 170,74 T 220,76 T 280,80"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        filter="url(#glow)"
                      />

                      {/* Data points - Systolic (matching new curve) */}
                      <circle cx="20" cy="30" r="4" fill="#EF4444" stroke="white" strokeWidth="2"/>
                      <circle cx="70" cy="36" r="4" fill="#EF4444" stroke="white" strokeWidth="2"/>
                      <circle cx="120" cy="32" r="4" fill="#EF4444" stroke="white" strokeWidth="2"/>
                      <circle cx="170" cy="38" r="4" fill="#EF4444" stroke="white" strokeWidth="2"/>
                      <circle cx="220" cy="40" r="4" fill="#EF4444" stroke="white" strokeWidth="2"/>
                      <circle cx="280" cy="45" r="5" fill="#EF4444" stroke="white" strokeWidth="2" filter="url(#glow)"/>

                      {/* Data points - Diastolic (matching new curve) */}
                      <circle cx="20" cy="66" r="4" fill="#3B82F6" stroke="white" strokeWidth="2"/>
                      <circle cx="70" cy="72" r="4" fill="#3B82F6" stroke="white" strokeWidth="2"/>
                      <circle cx="120" cy="68" r="4" fill="#3B82F6" stroke="white" strokeWidth="2"/>
                      <circle cx="170" cy="74" r="4" fill="#3B82F6" stroke="white" strokeWidth="2"/>
                      <circle cx="220" cy="76" r="4" fill="#3B82F6" stroke="white" strokeWidth="2"/>
                      <circle cx="280" cy="80" r="5" fill="#3B82F6" stroke="white" strokeWidth="2" filter="url(#glow)"/>

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
                    <div className="absolute right-1 sm:right-0 top-2 sm:top-4 bg-gray-900 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 rounded shadow-lg">
                      <div className="font-medium">Today</div>
                      <div className="text-red-300">115 sys</div>
                      <div className="text-blue-300">72 dia</div>
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

                  {/* Legend Row */}
                  <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-100 mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-0.5 bg-red-400 rounded" />
                      <span className="text-[10px] text-gray-500">This Week</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-0.5 bg-red-400/40 rounded" style={{backgroundImage: 'repeating-linear-gradient(90deg, #f87171, #f87171 2px, transparent 2px, transparent 4px)'}} />
                      <span className="text-[10px] text-gray-500">Last Week</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-xs text-gray-500">Systolic</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-700">120 avg</div>
                    </div>
                    <div className="text-center border-x border-gray-100">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-xs text-gray-500">Diastolic</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-700">74 avg</div>
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
                    <p className="text-2xl font-bold text-gray-900">115/72</p>
                    <span className="text-xs text-green-600 font-medium">Optimal</span>
                  </div>
                </div>

                {/* Insight Banner */}
                <div className="mt-4 bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">📈 Progress:</span> Your average is down 9 mmHg from last week — great improvement!
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
