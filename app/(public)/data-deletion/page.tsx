import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Deletion',
  description: 'BPCare AI Data Deletion Instructions - Learn how to delete your data from our app.',
};

export default function DataDeletionPage() {
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
            Data Deletion Instructions
          </h1>
          <p className="text-xl text-gray-500">
            BPCare AI · How to Delete Your Data
          </p>
        </header>

        {/* Key Message */}
        <div className="rounded-2xl p-8 lg:p-10 mb-16 bg-gradient-to-br from-brand-blue-light/60 to-brand-purple-light/60 border border-white/50">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🔒</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your Data is Stored Locally on Your Device
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed">
                BPCare AI stores all your health data <strong>100% locally on your device</strong>.
                We never upload, store, or have access to your personal health information on our servers.
                This means you have complete control over your data deletion.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-16">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              1. How to Delete Your Data
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Option 1: Delete Data Within the App</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    You can delete your health data directly within the BPCare AI app:
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Open the BPCare AI app on your device',
                      'Navigate to your health records or history section',
                      'Select individual records to delete, or use the "Delete All" option if available',
                      'Confirm the deletion when prompted',
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-lg">
                        <span className="text-brand-blue font-semibold">{i + 1}.</span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Option 2: Uninstall the App</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    Uninstalling the BPCare AI app will permanently delete all locally stored data:
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Long press the BPCare AI app icon on your device',
                      'Select "Remove App" or "Delete App"',
                      'Confirm deletion',
                      'All your health data will be permanently removed from your device',
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-lg">
                        <span className="text-brand-blue font-semibold">{i + 1}.</span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                    <p className="text-yellow-800">
                      <strong>Warning:</strong> This action is permanent and cannot be undone.
                      Make sure to export any data you wish to keep before uninstalling.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              2. Data Deletion Request
            </h2>

            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Since all your data is stored locally on your device and we do not have access to it,
                there is no data for us to delete from our servers. However, if you have any concerns
                or need assistance with data deletion, please contact us:
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <p className="text-lg text-gray-700">
                  <strong className="text-gray-900">Email:</strong>{' '}
                  <a href="mailto:contact@bpcareai.com" className="text-brand-blue-dark hover:underline">
                    contact@bpcareai.com
                  </a>
                </p>
                <p className="text-lg text-gray-700">
                  <strong className="text-gray-900">Response Time:</strong> We typically respond within 48 hours
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">When Contacting Us, Please Include:</h4>
                <ul className="space-y-2">
                  {[
                    'Your concerns or questions about data deletion',
                    'Device information (iOS version, device model)',
                    'Any specific issues you encountered',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg">
                      <span className="text-brand-blue mt-1">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              3. What Data is Deleted?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Health Data</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Blood pressure readings</li>
                  <li>• Heart rate measurements</li>
                  <li>• Heart rate variability (HRV)</li>
                  <li>• Blood sugar levels</li>
                  <li>• Blood oxygen estimates</li>
                  <li>• Measurement timestamps</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">App Settings</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• User preferences</li>
                  <li>• Notification settings</li>
                  <li>• Unit preferences</li>
                  <li>• App configurations</li>
                  <li>• Display settings</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              4. Your Rights Under Privacy Laws
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">GDPR (European Union)</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-lg text-gray-700 mb-3 leading-relaxed">
                    Under the General Data Protection Regulation (GDPR), you have the right to:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Right to erasure ("right to be forgotten")',
                      'Right to data portability',
                      'Right to access your personal data',
                      'Right to rectification',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-lg">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">CCPA (California, USA)</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-lg text-gray-700 mb-3 leading-relaxed">
                    Under the California Consumer Privacy Act (CCPA), you have the right to:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Right to delete personal information',
                      'Right to know what data is collected',
                      'Right to opt-out of data sale (not applicable as we don\'t sell data)',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-lg">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              5. Important Notes
            </h2>

            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-400 rounded-r-xl p-5">
                <p className="text-lg text-gray-800">
                  <strong>✓ Immediate Deletion:</strong> When you delete data within the app or uninstall it,
                  the deletion is immediate and permanent.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-5">
                <p className="text-lg text-gray-800">
                  <strong>🔒 No Server-Side Data:</strong> We do not store your health data on our servers,
                  so there is no additional data to request deletion from us.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-5">
                <p className="text-lg text-gray-800">
                  <strong>⚠️ Backup Reminder:</strong> If you want to keep your data, make sure to export it
                  before deletion. Deleted data cannot be recovered.
                </p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-400 rounded-r-xl p-5">
                <p className="text-lg text-gray-800">
                  <strong>📱 Device Security:</strong> Your device's built-in security features
                  (encryption, passcode) protect your data while it's stored.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              6. Related Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/privacy" className="block group">
                <div className="bg-gradient-to-br from-brand-blue-light/40 to-brand-purple-light/40 rounded-xl p-6 border border-gray-200 hover:border-brand-blue transition-all">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-blue transition-colors">
                    📄 Privacy Policy
                  </h3>
                  <p className="text-gray-700">
                    Learn more about how we protect your privacy and handle your data.
                  </p>
                </div>
              </Link>

              <Link href="/terms" className="block group">
                <div className="bg-gradient-to-br from-brand-blue-light/40 to-brand-purple-light/40 rounded-xl p-6 border border-gray-200 hover:border-brand-blue transition-all">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-blue transition-colors">
                    📋 Terms of Service
                  </h3>
                  <p className="text-gray-700">
                    Review our terms of service and usage guidelines.
                  </p>
                </div>
              </Link>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-20 pt-8 border-t-2 border-gray-200">
          <p className="text-lg text-gray-600 text-center leading-relaxed">
            For any questions or concerns about data deletion, please contact us at{' '}
            <a href="mailto:contact@bpcareai.com" className="text-brand-blue-dark hover:underline font-medium">
              contact@bpcareai.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
