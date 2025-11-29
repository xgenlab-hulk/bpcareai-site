import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'BPCare AI Terms of Service - Understanding your rights and responsibilities when using our health monitoring app.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-brand-blue-dark hover:text-brand-blue mb-10 font-medium text-lg transition-colors"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-500">
            BPCare AI · Effective Date: December 22, 2024
          </p>
        </header>

        {/* Content */}
        <div className="space-y-16">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                By downloading, installing, or using the BPCare AI mobile application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the App.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                These Terms apply to all users worldwide and are designed to comply with applicable laws including the European Union General Data Protection Regulation (GDPR) and United States privacy regulations.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              2. App Description
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              BPCare AI is a health monitoring application that provides:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { icon: '💓', label: 'Heart Rate Monitoring', desc: 'Using your device\'s camera and flash to detect pulse through PPG' },
                { icon: '📊', label: 'HRV Analysis', desc: 'Advanced algorithms analyze heart rhythm patterns' },
                { icon: '🩺', label: 'Blood Pressure Recording', desc: 'Manual entry and tracking of blood pressure measurements' },
                { icon: '🍬', label: 'Blood Sugar Monitoring', desc: 'Manual entry and tracking of blood glucose levels' },
                { icon: '📈', label: 'Health Trend Analysis', desc: 'Visual charts and insights based on your recorded data' },
                { icon: '💡', label: 'Personalized Insights', desc: 'Educational information and general wellness suggestions' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-semibold text-gray-900">{item.label}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              All analysis and data processing occurs locally on your device using built-in algorithms.
            </p>
          </section>

          {/* Section 3 - Medical Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              3. Medical Disclaimer
            </h2>
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">⚠️</span>
                <div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">
                    IMPORTANT: For Educational and Informational Purposes Only
                  </h3>
                  <p className="text-amber-800 leading-relaxed">
                    This app is not a substitute for professional medical advice, diagnosis, or treatment.
                  </p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  { label: 'Not a Medical Device', desc: 'BPCare AI is not FDA-approved and should not be used for medical diagnosis, treatment, or monitoring of serious health conditions.' },
                  { label: 'No Medical Advice', desc: 'The information provided does not constitute medical advice and should not replace consultation with qualified healthcare professionals.' },
                  { label: 'Accuracy Limitations', desc: 'Measurements may vary due to device limitations, user technique, environmental conditions, and individual physiological differences.' },
                  { label: 'Emergency Situations', desc: 'In case of chest pain, difficulty breathing, or other serious symptoms, immediately contact emergency medical services.' },
                  { label: 'Consult Professionals', desc: 'Always consult with qualified healthcare professionals before making any medical decisions based on app information.' },
                  { label: 'Not for Diagnosis', desc: 'This app cannot diagnose medical conditions or replace professional medical equipment and procedures.' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-amber-600 mt-1 font-bold">!</span>
                    <span className="text-amber-900">
                      <strong>{item.label}:</strong> {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              4. User Responsibilities
            </h2>
            <ul className="space-y-4">
              {[
                { label: 'Age Requirement', desc: 'You must be 13 years of age or older to use this App.' },
                { label: 'Proper Use', desc: 'Use the App according to provided instructions for optimal results.' },
                { label: 'Health Decisions', desc: 'You are solely responsible for any health-related decisions made based on app information.' },
                { label: 'Data Accuracy', desc: 'Ensure accurate input of manually entered health data.' },
                { label: 'Device Care', desc: 'Maintain your device properly for optimal app performance.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-lg">
                  <span className="text-brand-blue mt-1">•</span>
                  <span className="text-gray-700">
                    <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              5. Data Privacy and Security
            </h2>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <p className="font-bold text-green-800 text-lg text-center">
                🔐 All your health data is stored exclusively on your device
              </p>
            </div>
            <ul className="space-y-4">
              {[
                { label: 'Local Storage Only', desc: 'We do not upload, transmit, or store your personal health information on external servers.' },
                { label: 'User Control', desc: 'You have complete control over your data and can delete it at any time through the app.' },
                { label: 'No Data Sharing', desc: 'We do not share, sell, or transfer your personal health data to any third parties.' },
                { label: 'GDPR Compliance', desc: 'For EU users, your data processing rights are fully respected through local storage and user control mechanisms.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-lg">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">
                    <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-lg text-gray-700 mt-6 leading-relaxed">
              For complete details, please refer to our{' '}
              <Link href="/privacy" className="text-brand-blue-dark hover:underline font-medium">
                Privacy Policy
              </Link>.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              6. Intellectual Property
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              The BPCare AI app, including its design, code, algorithms, and content, is protected by intellectual property laws. You may not copy, modify, distribute, or reverse engineer the app without explicit permission.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              7. Disclaimers and Limitations
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <ul className="space-y-4">
                {[
                  { label: '"As Is" Basis', desc: 'The App is provided on an "as is" and "as available" basis without warranties of any kind.' },
                  { label: 'Technical Limitations', desc: 'We do not guarantee uninterrupted service or error-free operation.' },
                  { label: 'Measurement Variability', desc: 'Health measurements may vary due to technical and physiological factors.' },
                  { label: 'No Guarantee', desc: 'We make no guarantees about the accuracy, reliability, or completeness of health information provided.' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-gray-700">
                      <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              8. Service Modifications
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              We reserve the right to:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'Modify or discontinue the App or any features',
                'Update these Terms of Service',
                'Release new versions with enhanced functionality',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-lg">
                  <span className="text-brand-blue mt-1">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg text-gray-700 leading-relaxed">
              Continued use after changes constitutes acceptance of modified terms.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              9. Limitation of Liability
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, BPCare AI and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the App.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              10. Governing Law
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🇪🇺 EU Users</h3>
                <p className="text-gray-700 leading-relaxed">
                  Terms governed by applicable EU law and GDPR requirements.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🇺🇸 US Users</h3>
                <p className="text-gray-700 leading-relaxed">
                  Terms governed by US laws and applicable state regulations.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🌍 Other Regions</h3>
                <p className="text-gray-700 leading-relaxed">
                  Local consumer protection laws may apply.
                </p>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              11. Contact Information
            </h2>
            <div className="bg-gray-50 rounded-xl p-8">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                For questions about these Terms of Service:
              </p>
              <a
                href="mailto:mariememe0624@gmail.com"
                className="inline-flex items-center gap-2 text-xl font-semibold text-brand-blue-dark hover:text-brand-blue transition-colors"
              >
                📧 mariememe0624@gmail.com
              </a>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-20 pt-8 border-t-2 border-gray-200">
          <p className="text-lg text-gray-600 text-center leading-relaxed">
            By using BPCare AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our{' '}
            <Link href="/privacy" className="text-brand-blue-dark hover:underline font-medium">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
