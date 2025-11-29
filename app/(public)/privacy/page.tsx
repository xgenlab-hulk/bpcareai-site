import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'BPCare AI Privacy Policy - Learn how we protect your health data with 100% local storage and zero data sharing.',
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-500">
            BPCare AI · Effective Date: December 22, 2024
          </p>
        </header>

        {/* Key Privacy Promise */}
        <div className="rounded-2xl p-8 lg:p-10 mb-16 bg-gradient-to-br from-brand-blue-light/60 to-brand-purple-light/60 border border-white/50">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🔒</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your Data Stays on Your Device
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed">
                BPCare AI ensures <strong>100% local data storage</strong>. Your health information never leaves your device.
                We never upload, share, or access your personal data. You have complete control.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-16">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              1. Data Controller
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong className="text-gray-900">BPCare AI Team</strong><br />
                <span className="text-gray-600">Contact Email:</span>{' '}
                <a href="mailto:mariememe0624@gmail.com" className="text-brand-blue-dark hover:underline">
                  mariememe0624@gmail.com
                </a><br />
                <span className="text-gray-600">Scope:</span> This policy applies to all users of the BPCare AI mobile application worldwide.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              2. Information We Collect
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2.1 Health Data</h3>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  When you use BPCare AI, the following information is collected and processed <strong>locally on your device</strong>:
                </p>
                <ul className="space-y-3">
                  {[
                    { label: 'Heart Rate Measurements', desc: 'Pulse rate data captured through your device\'s camera' },
                    { label: 'Heart Rate Variability (HRV)', desc: 'Analysis of heart rhythm patterns and variations' },
                    { label: 'Blood Pressure Readings', desc: 'Manually entered systolic and diastolic pressure values' },
                    { label: 'Blood Sugar Levels', desc: 'Manually entered glucose measurements' },
                    { label: 'Blood Oxygen Estimates', desc: 'Calculated values based on heart rate analysis' },
                    { label: 'Measurement Timestamps', desc: 'Date and time of each health measurement' },
                    { label: 'Health Trends', desc: 'Calculated averages, patterns, and insights based on your data' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg">
                      <span className="text-brand-blue mt-1">•</span>
                      <span className="text-gray-700">
                        <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2.2 Technical Information</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Device Information', desc: 'Device model and iOS version (for app compatibility)' },
                    { label: 'App Usage Data', desc: 'Features used and measurement frequency (stored locally)' },
                    { label: 'Settings Preferences', desc: 'Your chosen units, notification settings, and app configurations' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg">
                      <span className="text-brand-blue mt-1">•</span>
                      <span className="text-gray-700">
                        <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2.3 Information We Do NOT Collect</h3>
                <div className="bg-green-50 rounded-xl p-6">
                  <ul className="space-y-2">
                    {[
                      'Personal identification information (name, address, phone number)',
                      'Location data',
                      'Contacts or other device data unrelated to app functionality',
                      'Third-party app data',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-lg text-gray-700">
                        <span className="text-green-600">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              3. How We Use Your Information
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3.1 Primary Purposes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: '📊', label: 'Health Analysis', desc: 'Generate personalized health insights and trend analysis' },
                    { icon: '⚙️', label: 'App Functionality', desc: 'Enable core features like data visualization and recommendations' },
                    { icon: '✨', label: 'User Experience', desc: 'Provide a personalized and improved app experience' },
                    { icon: '📚', label: 'Educational Content', desc: 'Deliver relevant health information and tips' },
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
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3.2 Legal Basis (GDPR Compliance)</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Legitimate Interest', desc: 'Processing necessary for app functionality and user experience' },
                    { label: 'User Consent', desc: 'Implied through voluntary use of health monitoring features' },
                    { label: 'Vital Interests', desc: 'Health monitoring for user\'s own well-being' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg">
                      <span className="text-brand-blue mt-1">•</span>
                      <span className="text-gray-700">
                        <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              4. Data Storage and Security
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">4.1 100% Local Storage Policy</h3>
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                  <p className="font-bold text-green-800 text-xl text-center">
                    🔐 YOUR DATA NEVER LEAVES YOUR DEVICE
                  </p>
                </div>
                <ul className="space-y-3">
                  {[
                    { label: 'Local Database', desc: 'All data is stored using Core Data framework on your device' },
                    { label: 'No Cloud Sync', desc: 'We do not upload, backup, or synchronize your data to external servers' },
                    { label: 'No Network Transmission', desc: 'Your health data is never transmitted over the internet' },
                    { label: 'Device Encryption', desc: 'Data benefits from your device\'s built-in security features' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-gray-700">
                        <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">4.2 Security Measures</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'App Sandbox', desc: 'Data is isolated within the app\'s secure container' },
                    { label: 'iOS Security', desc: 'Protected by Apple\'s iOS security architecture' },
                    { label: 'No External Access', desc: 'No third parties can access your data through our app' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg">
                      <span className="text-brand-blue mt-1">•</span>
                      <span className="text-gray-700">
                        <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              5. Data Sharing and Disclosure
            </h2>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <p className="font-bold text-blue-800 text-xl text-center">
                🚫 WE DO NOT SHARE YOUR DATA WITH ANYONE
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5.1 No Data Sharing</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Zero Third-Party Sharing', desc: 'We never share, sell, rent, or transfer your personal health data' },
                    { label: 'No Analytics Services', desc: 'We do not use third-party analytics or tracking services' },
                    { label: 'No Advertising Networks', desc: 'We do not share data with advertising companies' },
                    { label: 'No Research Partners', desc: 'We do not provide data to research institutions' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg">
                      <span className="text-red-500 mt-1">✗</span>
                      <span className="text-gray-700">
                        <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5.2 Legal Exceptions</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We do not have access to your data to share, even if legally required, because all data remains on your device.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              6. Your Privacy Rights
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">6.1 GDPR Rights (EU Users)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Right of Access', desc: 'View all your data within the app' },
                    { label: 'Right to Rectification', desc: 'Edit or correct your health records' },
                    { label: 'Right to Erasure', desc: 'Delete individual records or all data' },
                    { label: 'Right to Data Portability', desc: 'Export your data using the app' },
                    { label: 'Right to Object', desc: 'Stop using the app at any time' },
                    { label: 'Right to Withdraw Consent', desc: 'Uninstall to cease all processing' },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4">
                      <p className="font-semibold text-gray-900 mb-1">{item.label}</p>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">6.2 CCPA Rights (California Users)</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Right to Know', desc: 'This policy describes all data we collect' },
                    { label: 'Right to Delete', desc: 'Delete your data through the app or by uninstalling' },
                    { label: 'Right to Opt-Out', desc: 'Not applicable as we don\'t sell personal information' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg">
                      <span className="text-brand-blue mt-1">•</span>
                      <span className="text-gray-700">
                        <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">6.3 Exercising Your Rights</h3>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  Since all data is stored locally on your device:
                </p>
                <div className="bg-gray-50 rounded-xl p-6">
                  <ul className="space-y-3">
                    {[
                      { label: 'Access Data', desc: 'Use the app\'s history and trends features' },
                      { label: 'Delete Data', desc: 'Use in-app delete functions or uninstall the app' },
                      { label: 'Export Data', desc: 'Use the app\'s export functionality' },
                      { label: 'Questions', desc: 'Contact us at mariememe0624@gmail.com' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-lg">
                        <span className="text-brand-blue mt-1">→</span>
                        <span className="text-gray-700">
                          <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              7. Data Retention
            </h2>
            <ul className="space-y-3">
              {[
                { label: 'Local Retention', desc: 'Data remains on your device until you delete it' },
                { label: 'User Control', desc: 'You can delete individual records or all data at any time' },
                { label: 'App Removal', desc: 'Uninstalling the app permanently removes all associated data' },
                { label: 'No External Copies', desc: 'We maintain no copies of your data on our systems' },
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

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              8. Children's Privacy
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">8.1 Age Restrictions</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Minimum Age', desc: 'BPCare AI is intended for users 13 years of age and older' },
                    { label: 'COPPA Compliance', desc: 'We do not knowingly collect information from children under 13' },
                    { label: 'Parental Guidance', desc: 'Users under 18 should use the app with parental supervision' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg">
                      <span className="text-brand-blue mt-1">•</span>
                      <span className="text-gray-700">
                        <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">8.2 Child Data Protection</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  If we become aware that a child under 13 has used the app, we recommend parents assist in removing any recorded data through the app's delete functions.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              9. International Users
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🇪🇺 European Union</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• GDPR Compliance</li>
                  <li>• Full data subject rights</li>
                  <li>• Supervisory authority access</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🇺🇸 United States</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• CCPA Compliance</li>
                  <li>• State law adherence</li>
                  <li>• FTC guidelines followed</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🌍 Other Countries</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Local law awareness</li>
                  <li>• Universal protection</li>
                  <li>• Strong global privacy</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              10. Medical Privacy Notice
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">10.1 Health Data Sensitivity</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Special Category Data', desc: 'Health data requires special protection under privacy laws' },
                    { label: 'Medical Disclaimer', desc: 'This app is not a medical device and data should not be used for medical diagnosis' },
                    { label: 'Healthcare Provider Sharing', desc: 'Only share app data with healthcare providers at your discretion' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg">
                      <span className="text-brand-blue mt-1">•</span>
                      <span className="text-gray-700">
                        <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">10.2 Emergency Situations</h3>
                <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-5">
                  <p className="text-lg text-red-800">
                    In medical emergencies, prioritize professional medical help over app data.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              11. Privacy Policy Updates
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">11.1 Notification of Changes</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Material Changes', desc: 'Significant changes will be announced through app updates' },
                    { label: 'Continued Use', desc: 'Using the app after changes indicates acceptance of new terms' },
                    { label: 'Version History', desc: 'Updated versions will be clearly marked with effective dates' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg">
                      <span className="text-brand-blue mt-1">•</span>
                      <span className="text-gray-700">
                        <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">11.2 User Response to Changes</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Review Regularly', desc: 'We recommend reviewing this policy periodically' },
                    { label: 'Contact Us', desc: 'Questions about changes can be directed to our contact email' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg">
                      <span className="text-brand-blue mt-1">•</span>
                      <span className="text-gray-700">
                        <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              12. Third-Party Services
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">12.1 No Third-Party Integration</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  BPCare AI operates independently without integration of third-party services that access your data.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">12.2 Device Features</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  The app uses standard iOS features (camera, storage) but does not share data with other apps or services.
                </p>
              </div>
            </div>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              13. Contact Information
            </h2>

            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy Questions</h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                For any privacy-related questions or concerns:
              </p>
              <a
                href="mailto:mariememe0624@gmail.com"
                className="inline-flex items-center gap-2 text-xl font-semibold text-brand-blue-dark hover:text-brand-blue transition-colors"
              >
                📧 mariememe0624@gmail.com
              </a>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Data Protection Authorities</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>EU Users:</strong> Contact your local data protection authority</li>
                  <li>• <strong>US Users:</strong> Contact the FTC or your state's attorney general</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-20 pt-8 border-t-2 border-gray-200">
          <p className="text-lg text-gray-600 text-center leading-relaxed">
            By using BPCare AI, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
