'use client';

import { useState, useEffect } from 'react';
import DownloadButton from '@/components/DownloadButton';

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
        <DownloadButton
          position="mobile_bar"
          className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3.5 rounded-full font-semibold text-base shadow-md hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          <span></span>
          <span>Download Free</span>
        </DownloadButton>
        <p className="text-center text-xs text-gray-500 mt-2">
          Free Forever · No Account Needed
        </p>
      </div>
    </div>
  );
}
