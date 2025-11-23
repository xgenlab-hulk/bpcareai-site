import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileCTABar from '@/components/MobileCTABar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'BPCare AI - Understanding Your Blood Pressure & Heart Health',
    template: '%s | BPCare AI',
  },
  description: 'Track your blood pressure trends, understand heart rate variability, and gain insights into your cardiovascular health. Designed for those managing hypertension with empathy and care.',
  keywords: [
    'blood pressure',
    'heart rate',
    'HRV',
    'hypertension',
    'cardiovascular health',
    'blood pressure tracker',
    'heart health',
    'health monitoring',
  ],
  authors: [{ name: 'BPCare AI Team' }],
  creator: 'BPCare AI',
  publisher: 'BPCare AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bpcareai.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bpcareai.com',
    title: 'BPCare AI - Understanding Your Blood Pressure & Heart Health',
    description: 'Track your blood pressure trends and understand your heart health with empathy and clarity.',
    siteName: 'BPCare AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BPCare AI - Blood Pressure & Heart Health Tracking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BPCare AI - Understanding Your Blood Pressure & Heart Health',
    description: 'Track your blood pressure trends and understand your heart health with empathy and clarity.',
    images: ['/og-image.png'],
    creator: '@bpcareai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileCTABar />
      </body>
    </html>
  );
}
