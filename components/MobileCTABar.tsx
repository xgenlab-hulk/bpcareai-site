'use client';

import { useState, useEffect } from 'react';

export default function MobileCTABar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Gradient fade effect */}
      <div className="h-4 bg-gradient-to-t from-white to-transparent" />

      {/* CTA Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <a
          href="https://apps.apple.com/us/app/bpcare-ai-heart-rate-monitor/id6748299186"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-brand-blue to-brand-purple text-white py-3.5 rounded-full font-semibold text-base shadow-md active:scale-[0.98] transition-transform"
        >
          <span></span>
          <span>Download Free</span>
        </a>
        <p className="text-center text-xs text-gray-500 mt-2">
          Free Forever · No Account Needed
        </p>
      </div>
    </div>
  );
}
