'use client';

import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
    // 核心功能与AI能力
    {
      category: 'Core Features',
      question: 'What can BPCare AI do? What are the core features?',
      answer: 'BPCare AI is a comprehensive cardiovascular health tracking app that combines blood pressure and heart rate measurement recording with advanced AI-powered analysis. The core features include: automated health data recording, AI trend analysis to identify patterns over time, medical AI model-based risk prediction and assessment, and comprehensive health evaluation reports with in-depth interpretations. The app helps you understand your cardiovascular health beyond just numbers.',
    },
    {
      category: 'Core Features',
      question: 'How accurate is BPCare AI\'s analysis? What is the accuracy rate?',
      answer: 'Based on large-scale user testing and feedback, BPCare AI achieves over 95% accuracy in its health assessments. Our AI models are trained on extensive medical datasets and continuously improved based on real-world usage. However, it\'s important to note that while our AI provides highly accurate insights, it should complement—not replace—professional medical advice.',
    },
    {
      category: 'Core Features',
      question: 'Can BPCare AI detect atrial fibrillation (AFib)?',
      answer: 'Yes, BPCare AI includes AFib Risk Assessment capabilities. The app can detect irregular heart rhythms, analyze premature beat frequency, and identify rhythm irregularities that may indicate AFib. When combined with regular heart rate measurements, our AI can spot abnormal patterns that warrant medical attention. However, this is a screening tool and cannot provide a definitive medical diagnosis—always consult your doctor if AFib is suspected.',
    },
    {
      category: 'Core Features',
      question: 'What health metrics can BPCare AI track?',
      answer: 'BPCare AI tracks a comprehensive range of cardiovascular health metrics including: Heart Rate (with Bradycardia and Tachycardia detection), Heart Rate Variability (HRV), Heart Attack & Stroke Risk Assessment, Stress levels, Energy levels, Oximeter readings, Respiratory Rate, Blood Vessel Condition, Artery Flexibility, Vessel Elasticity, Nervous System Behavior, AFib Risk Assessment, Premature Beat Frequency, and Rhythm Irregularity. This multi-dimensional approach provides a complete picture of your cardiovascular health.',
    },

    // 适用人群与病症
    {
      category: 'Who Can Use It',
      question: 'Can people with hypertension use BPCare AI? How does it help manage high blood pressure?',
      answer: 'BPCare AI is excellent for hypertension management. The app allows you to record daily blood pressure readings, track medication effectiveness, and use AI to analyze trends over time. Our algorithms can identify triggers (stress, diet, exercise) that affect your blood pressure and help you understand patterns. You can generate detailed reports to share with your doctor, making it easier to adjust treatment plans. Many users find that consistent tracking reduces anxiety and improves blood pressure control.',
    },
    {
      category: 'Who Can Use It',
      question: 'Can people with arrhythmia use BPCare AI? What types of heart rhythm issues can it detect?',
      answer: 'Yes, BPCare AI is valuable for people with arrhythmia. The app can detect multiple types of heart rhythm issues including Bradycardia (slow heart rate), Tachycardia (fast heart rate), Rhythm Irregularity, Premature Beats, and AFib risk. If you need long-term heart rhythm monitoring, BPCare AI provides continuous tracking and AI-powered pattern recognition to help identify concerning changes that should be discussed with your cardiologist.',
    },
    {
      category: 'Who Can Use It',
      question: 'Should people with a family history of heart disease use BPCare AI?',
      answer: 'Absolutely. If you have a family history of heart disease, early monitoring is crucial. BPCare AI\'s Heart Attack & Stroke Risk Assessment feature can help detect abnormal indicators early, allowing you to take preventive action. By building a long-term health profile with comprehensive cardiovascular metrics, you and your doctor can identify risk factors before they become serious problems. Prevention is always better than treatment.',
    },
    {
      category: 'Who Can Use It',
      question: 'How can people with white coat hypertension use BPCare AI?',
      answer: 'BPCare AI is perfect for white coat hypertension. By measuring blood pressure in the comfort of your home, you can establish your true baseline away from the stress of medical settings. The app helps you compare hospital readings vs. home readings, and our AI can distinguish between genuine hypertension and white coat effect. You can export detailed reports showing your home measurements to your doctor, providing a more accurate picture of your actual blood pressure.',
    },
    {
      category: 'Who Can Use It',
      question: 'Can elderly people use BPCare AI? Is it easy to operate?',
      answer: 'Yes, BPCare AI is designed for all age groups, including seniors. The interface features large buttons, clear charts, and intuitive navigation. The app is particularly suitable for elderly users who need long-term cardiovascular health monitoring. Many older adults find it easier to track their health with BPCare AI than with paper logs, and the visual trends help them communicate more effectively with their healthcare providers.',
    },

    // 医疗价值与临床应用
    {
      category: 'Medical Value',
      question: 'Can BPCare AI help prevent heart attacks and strokes? How does it work?',
      answer: 'BPCare AI\'s Heart Attack & Stroke Risk Assessment feature combines multiple data points—blood pressure, heart rate, HRV, vascular elasticity, and more—to predict risk levels using advanced AI models. By analyzing trends and detecting early warning signs, the app can alert you to concerning patterns that warrant medical attention. While we cannot guarantee 100% prevention, early detection of risk factors significantly improves outcomes. Always work with your doctor on prevention strategies.',
    },
    {
      category: 'Medical Value',
      question: 'Can BPCare AI help reduce stress and anxiety?',
      answer: 'Yes. BPCare AI includes Stress and Energy level tracking, along with HRV analysis that reflects your stress state. More importantly, our AI trend analysis helps users see the bigger picture instead of fixating on individual readings. This reduces "white coat anxiety" and the worry that comes from obsessing over every number. Many users report feeling more in control and less anxious once they understand their patterns and see that occasional high readings are normal.',
    },
    {
      category: 'Medical Value',
      question: 'Do doctors recommend BPCare AI? Can it replace hospital checkups?',
      answer: 'Many healthcare providers recommend home monitoring tools like BPCare AI as they provide valuable data between appointments. The detailed reports and trend charts our app generates facilitate better doctor-patient communication. However, BPCare AI cannot and should not replace professional medical examinations and diagnoses. Think of it as a complementary tool that enhances your healthcare, not a replacement for your doctor.',
    },
    {
      category: 'Medical Value',
      question: 'Can BPCare AI assess vascular health?',
      answer: 'Yes, BPCare AI evaluates Blood Vessel Condition, Artery Flexibility, and Vessel Elasticity. These metrics reflect vascular aging and cardiovascular risk. Reduced arterial flexibility and vessel elasticity are early indicators of cardiovascular disease. By tracking these measurements over time, you can monitor your vascular health and take action to improve it through lifestyle changes and medical treatment.',
    },

    // 隐私、价格与技术
    {
      category: 'Privacy & Pricing',
      question: 'Is BPCare AI free? Are there subscription plans?',
      answer: 'BPCare AI offers a free version that includes core tracking and analysis features. We also offer a Premium subscription that unlocks advanced AI analysis, unlimited history, detailed health reports, and priority features. You can choose the plan that fits your needs. Many users find the free version sufficient for basic monitoring, while those wanting comprehensive health insights prefer the Premium features.',
    },
    {
      category: 'Privacy & Pricing',
      question: 'Is my health data private and secure? Do you share my data?',
      answer: 'You have complete control over your data privacy. You choose what information to share with the app and what to keep private. Your health data is primarily stored locally on your device. We comply with GDPR and other privacy regulations, and we will never share your data without your explicit permission. Your health information is yours alone.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Group FAQs by category
  const categories = [
    { name: 'Core Features', icon: '🧠', color: 'blue' },
    { name: 'Who Can Use It', icon: '👥', color: 'green' },
    { name: 'Medical Value', icon: '🩺', color: 'red' },
    { name: 'Privacy & Pricing', icon: '🔒', color: 'purple' },
  ];

  return (
    <section id="faqs" className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-brand-blue-dark to-brand-purple bg-clip-text text-transparent">
              FAQs
            </span>
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const category = categories.find(c => c.name === faq.category);
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 flex items-start justify-between gap-4 group"
                >
                  {/* Question */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-blue-dark transition-colors">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Toggle Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-200 ${isOpen ? 'rotate-180 bg-brand-blue-light' : ''}`}>
                      <svg
                        className={`w-4 h-4 ${isOpen ? 'text-brand-blue-dark' : 'text-gray-600'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-[500px] sm:max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-gray-700 text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-4">
            Download the app and explore all features, or contact our support team
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://apps.apple.com/us/app/bpcare-ai-heart-rate-monitor/id6748299186"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <span className="mr-2"></span>
              Try BPCare AI Free
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-brand-blue-dark border-2 border-brand-blue rounded-full font-semibold hover:bg-brand-blue/5 transition-all duration-200"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
