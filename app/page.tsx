import HeroSection from '@/components/homepage/HeroSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import HowItWorksSection from '@/components/homepage/HowItWorksSection';
import WhoItsForSection from '@/components/homepage/WhoItsForSection';
import WhyItMattersSection from '@/components/homepage/WhyItMattersSection';
import ArticlesPreviewSection from '@/components/homepage/ArticlesPreviewSection';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';
import FinalCTASection from '@/components/homepage/FinalCTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhoItsForSection />
      <WhyItMattersSection />
      <ArticlesPreviewSection />
      <TestimonialsSection />
      <FinalCTASection />
    </>
  );
}
