import type { Metadata } from 'next';
import HeroSection from '@/components/homepage/HeroSection';
import SocialProofSection from '@/components/homepage/SocialProofSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import HowItWorksSection from '@/components/homepage/HowItWorksSection';
import WhoItsForSection from '@/components/homepage/WhoItsForSection';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';
import WhyItMattersSection from '@/components/homepage/WhyItMattersSection';
import FinalCTASection from '@/components/homepage/FinalCTASection';
import FAQSection from '@/components/homepage/FAQSection';
import ArticlesPreviewSection from '@/components/homepage/ArticlesPreviewSection';
import { JsonLd, websiteJsonLd, organizationJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      {/* WebSite + Organization JSON-LD */}
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />

      {/* Hero - First impression with core value prop and primary CTA */}
      <HeroSection />

      {/* Social Proof - Build trust immediately with stats */}
      <SocialProofSection />

      {/* Features - Show key benefits */}
      <FeaturesSection />

      {/* How It Works - Simple 3-step process with mid-page CTA */}
      <HowItWorksSection />

      {/* Who It's For - Help users identify with personas + CTA */}
      <WhoItsForSection />

      {/* Testimonials - Social proof from real users */}
      <TestimonialsSection />

      {/* Why It Matters - Educational content for trust */}
      <WhyItMattersSection />

      {/* Final CTA - Strong conversion section */}
      <FinalCTASection />

      {/* FAQ - Answer common questions for SEO and conversions */}
      <FAQSection />

      {/* Articles - Additional value for SEO */}
      <ArticlesPreviewSection />
    </>
  );
}
