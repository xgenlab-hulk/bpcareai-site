/**
 * About Hero Section
 * Mission-driven, minimalist design
 */
'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const rotatingWords = [
    { text: 'Family', gradient: 'from-rose-500 to-orange-500' },
    { text: 'Parents', gradient: 'from-blue-600 to-indigo-600' },
    { text: 'Partner', gradient: 'from-pink-500 to-purple-500' },
    { text: 'Children', gradient: 'from-emerald-500 to-teal-500' },
    { text: 'Grandchildren', gradient: 'from-amber-500 to-orange-500' },
    { text: 'Friends', gradient: 'from-violet-500 to-purple-600' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 400); // Fade out duration
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  const currentWord = rotatingWords[currentWordIndex];
  return (
    <section className="relative gradient-bg overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center space-y-12 animate-fade-in-up">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            <span className="text-gray-800">You've Spent Decades</span>
            <br />
            <span
              className={`inline-block mt-2 transition-opacity duration-400 ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <span className="bg-gradient-to-r from-brand-blue-dark to-brand-purple bg-clip-text text-transparent">
                Caring for{' '}
              </span>
              <span className={`bg-gradient-to-r ${currentWord.gradient} bg-clip-text text-transparent`}>
                {currentWord.text}
              </span>
            </span>
          </h1>

          {/* Mission Statement */}
          <div className="space-y-6">
            <p className="text-lg md:text-xl text-gray-900 font-semibold leading-relaxed max-w-3xl mx-auto">
              BPCare AI helps you care for your heart—so you can be there for all the moments that matter,
              with confidence and peace of mind.
            </p>

            <p className="text-base text-gray-600 leading-relaxed opacity-90 pl-4 border-l-2 border-blue-100 max-w-3xl mx-auto">
              We believe managing your health shouldn't mean living in fear of numbers.
              It means understanding your body, making informed choices, and enjoying
              quality time with the people you love.
            </p>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full">
              <span className="text-blue-500">●</span>
              <span className="font-medium">Founded 2025</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full">
              <span className="text-red-500">♥</span>
              <span className="font-medium">Built for Seniors</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full">
              <span className="text-green-500">✓</span>
              <span className="font-medium">Privacy-First</span>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-8 animate-bounce">
            <a
              href="#our-story"
              className="inline-block cursor-pointer hover:text-gray-600 transition-colors duration-300"
              aria-label="Scroll to Our Story section"
            >
              <ChevronDown className="h-8 w-8 text-gray-400 hover:text-gray-600 transition-colors duration-300" />
            </a>
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
