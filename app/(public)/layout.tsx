/**
 * Public Website Layout
 * Layout for public-facing pages (home, articles, privacy, terms)
 * Includes Header, Footer, and MobileCTABar
 */
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileCTABar from '@/components/MobileCTABar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}
