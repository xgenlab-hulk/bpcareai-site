/**
 * About Page
 * Learn about BPCare AI, founder Hudson Syl, and our mission
 */
import type { Metadata } from 'next';
import { HeroSection } from '@/components/about/HeroSection';
import { FounderStory } from '@/components/about/FounderStory';
import { OurValues } from '@/components/about/OurValues';
import { PrivacySection } from '@/components/about/PrivacySection';
import { MedicalSources } from '@/components/about/MedicalSources';
import { ContactInfo } from '@/components/about/ContactInfo';

export const metadata: Metadata = {
  title: 'About BPCare AI - Your Personal Heart Health Companion',
  description: 'Meet Hudson Syl, founder of BPCare AI. Learn how personal experience with AFib and family heart disease inspired an app that helps seniors manage cardiovascular health with confidence and clarity.',
  keywords: [
    'heart health app',
    'blood pressure tracker',
    'senior health',
    'cardiovascular wellness',
    'Hudson Syl',
    'health monitoring app',
    'blood pressure management',
    'heart health for seniors',
  ],
  openGraph: {
    title: 'About BPCare AI - Your Personal Heart Health Companion',
    description: 'Meet Hudson Syl and learn how BPCare AI helps seniors manage cardiovascular health with confidence.',
    type: 'website',
    url: 'https://bpcareai.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About BPCare AI - Your Personal Heart Health Companion',
    description: 'Meet Hudson Syl and learn how BPCare AI helps seniors manage cardiovascular health with confidence.',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            mainEntity: {
              '@type': 'MobileApplication',
              name: 'BPCare AI',
              applicationCategory: 'HealthApplication',
              operatingSystem: 'iOS, Android',
              description: 'Blood pressure tracking and cardiovascular health management app for adults managing heart health',
              author: {
                '@type': 'Person',
                name: 'Hudson Syl',
                description: 'Founder of BPCare AI, diagnosed with AFib and sinus arrhythmia at age 17, motivated by family history of heart disease',
              },
              publisher: {
                '@type': 'Organization',
                name: 'BPCare AI',
                email: 'contact@bpcareai.com',
                areaServed: 'Worldwide',
                address: {
                  '@type': 'PostalAddress',
                  addressRegion: 'Asia-Pacific',
                },
              },
            },
            description: 'Learn about BPCare AI founder Hudson Syl personal health journey and how it inspired a heart health app designed for seniors',
          }),
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalOrganization',
            name: 'BPCare AI',
            url: 'https://bpcareai.com',
            logo: 'https://bpcareai.com/logo.png',
            description: 'Evidence-based cardiovascular health and longevity information for seniors, powered by trusted medical sources',
            foundingDate: '2024',
            specialty: 'Senior Health Education',
            email: 'contact@bpcareai.com',
            areaServed: 'Worldwide',
            address: {
              '@type': 'PostalAddress',
              addressRegion: 'Asia-Pacific',
            },
            knowsAbout: [
              'Blood Pressure Management',
              'Cardiovascular Health',
              'Senior Health',
              'Healthy Aging',
              'Longevity',
              'Heart Health',
              'Hypertension',
            ],
          }),
        }}
      />

      {/* Person Schema - Founder */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Hudson Syl',
            description: 'Founder of BPCare AI, diagnosed with atrial fibrillation and sinus arrhythmia at age 17. Motivated by family history of cardiovascular disease to create accessible heart health tools for seniors.',
            founderOf: {
              '@type': 'Organization',
              name: 'BPCare AI',
            },
            knowsAbout: [
              'Blood Pressure Management',
              'Cardiovascular Health',
              'Health Technology',
              'Senior Health',
            ],
          }),
        }}
      />

      {/* Page Content */}
      <HeroSection />
      <FounderStory />
      <OurValues />
      <PrivacySection />
      <MedicalSources />
      <ContactInfo />
    </div>
  );
}
