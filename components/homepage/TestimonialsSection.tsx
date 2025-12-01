'use client';

import { useState, useRef, useEffect } from 'react';

export default function TestimonialsSection() {
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isTouching, setIsTouching] = useState(false);

  const testimonials = [
    {
      name: 'Robert M.',
      age: 62,
      location: 'California, USA',
      rating: 5,
      comment: 'After my diagnosis, I was checking my blood pressure five times a day. BPCare AI helped me see the trends instead of obsessing over individual numbers.',
      highlight: 'Reduced my anxiety',
    },
    {
      name: 'Emma W.',
      age: 58,
      location: 'London, UK',
      rating: 5,
      comment: 'My GP wanted me to track my readings for a month. The charts I could share with her were incredibly helpful for adjusting my treatment plan.',
      highlight: 'Perfect for doctor visits',
    },
    {
      name: 'Mohammed A.',
      age: 55,
      location: 'Dubai, UAE',
      rating: 5,
      comment: 'I love that all my data stays on my phone. No accounts, no cloud uploads. The app actually helps me understand what\'s normal for me.',
      highlight: 'Privacy I can trust',
    },
    {
      name: 'Yuki T.',
      age: 67,
      location: 'Tokyo, Japan',
      rating: 5,
      comment: 'At my age, keeping track of health numbers can be overwhelming. This app is so simple — big buttons, clear charts, easy to understand.',
      highlight: 'Easy for seniors',
    },
    {
      name: 'David C.',
      age: 51,
      location: 'Toronto, Canada',
      rating: 5,
      comment: 'The AI trend analysis caught a concerning pattern before I noticed it. Showed my doctor and we adjusted my medication. Could have saved my life.',
      highlight: 'AI saved me',
    },
    {
      name: 'Sophie L.',
      age: 63,
      location: 'Paris, France',
      rating: 5,
      comment: 'I have AFib and need to monitor constantly. The camera heart rate feature is incredibly accurate and so much faster than my old manual monitor.',
      highlight: 'Accurate & fast',
    },
    {
      name: 'Abdullah K.',
      age: 59,
      location: 'Riyadh, Saudi Arabia',
      rating: 5,
      comment: 'The risk assessment feature is amazing. It explains everything in plain language and tells me exactly when I should be concerned.',
      highlight: 'Clear health insights',
    },
    {
      name: 'Michael B.',
      age: 71,
      location: 'Berlin, Germany',
      rating: 5,
      comment: 'My white coat hypertension was causing so much stress. Now I can show my doctor my at-home readings and we have much better conversations.',
      highlight: 'Better doctor communication',
    },
    {
      name: 'Ji-woo K.',
      age: 48,
      location: 'Seoul, South Korea',
      rating: 5,
      comment: 'The predictive algorithms spotted my morning blood pressure spikes. Changed my medication timing based on the data and my readings improved dramatically.',
      highlight: 'Data-driven results',
    },
    {
      name: 'Sarah M.',
      age: 65,
      location: 'New York, USA',
      rating: 5,
      comment: 'I was terrified of having a stroke like my father. BPCare AI gives me peace of mind by tracking warning signs I might have missed.',
      highlight: 'Peace of mind',
    },
    {
      name: 'Marco R.',
      age: 56,
      location: 'Rome, Italy',
      rating: 5,
      comment: 'The medical-grade AI is no joke. It picked up on irregular patterns that even my cardiologist was impressed by. Fantastic app.',
      highlight: 'Medical-grade accuracy',
    },
    {
      name: 'Lisa V.',
      age: 69,
      location: 'Vancouver, Canada',
      rating: 5,
      comment: 'After trying 5 different BP tracking apps, this is the only one that actually reduced my anxiety instead of making it worse. The AI explanations are so reassuring.',
      highlight: 'Finally found relief',
    },
  ];

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    if (scrollContainerRef.current) {
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (hoveredCard === null) {
      setIsPaused(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (hoveredCard === null) {
      setIsPaused(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollContainerRef.current) {
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleCardMouseEnter = (index: number) => {
    setHoveredCard(index);
    setIsPaused(true);
  };

  const handleCardMouseLeave = () => {
    setHoveredCard(null);
    if (!isDragging) {
      setIsPaused(false);
    }
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true);
    setIsPaused(true);
    if (scrollContainerRef.current) {
      setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouching) return;
    if (scrollContainerRef.current) {
      const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    if (hoveredCard === null) {
      setIsPaused(false);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold mb-4">
            Real Stories
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Loved by{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Hear from people who've found peace of mind with BPCare AI
          </p>

          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="star-rating text-xl">★★★★★</div>
            <span className="text-lg font-semibold text-gray-900">4.8</span>
            <span className="text-gray-500 text-sm">from 1,200+ reviews</span>
          </div>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <div
            className="overflow-x-hidden py-8"
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex gap-6 animate-scroll"
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                animationPlayState: isPaused ? 'paused' : 'running'
              }}
            >
              {/* Duplicate testimonials for seamless loop */}
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-[380px] bg-white rounded-xl p-6 shadow-md border border-gray-100 transition-all duration-300 ${
                    hoveredCard === index ? 'shadow-xl scale-105 cursor-pointer' : 'cursor-grab'
                  }`}
                  onMouseEnter={() => handleCardMouseEnter(index)}
                  onMouseLeave={handleCardMouseLeave}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-purple rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                        <p className="text-gray-500 text-xs">
                          Age {testimonial.age} · {testimonial.location}
                        </p>
                      </div>
                    </div>

                    {/* Verified Badge */}
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-full">
                      <span className="text-green-500 text-xs">✓</span>
                      <span className="text-green-700 text-xs font-medium">Verified</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="star-rating text-sm">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    "{testimonial.comment}"
                  </p>

                  {/* Highlight */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-blue-light/50 rounded-full">
                    <span className="text-brand-blue-dark text-xs">💬</span>
                    <span className="text-brand-blue-dark text-xs font-medium">{testimonial.highlight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-4848px);
          }
        }

        .animate-scroll {
          animation: scroll 210s linear infinite;
        }
      `}</style>
    </section>
  );
}
