/**
 * Trusted Medical Sources Section
 * Logo wall design with placeholders
 */
import { CheckCircle, Award } from 'lucide-react';

export function MedicalSources() {
  const sources = [
    { name: 'American Heart Association (AHA)', abbr: 'AHA' },
    { name: 'National Institutes of Health (NIH)', abbr: 'NIH' },
    { name: 'National Heart, Lung, and Blood Institute (NHLBI)', abbr: 'NHLBI' },
    { name: 'Centers for Disease Control and Prevention (CDC)', abbr: 'CDC' },
    { name: 'Mayo Clinic', abbr: 'Mayo' },
    { name: 'Cleveland Clinic', abbr: 'Cleveland' },
    { name: 'American College of Cardiology (ACC)', abbr: 'ACC' },
    { name: 'PubMed (peer-reviewed medical research database)', abbr: 'PubMed' },
  ];

  return (
    <section className="bg-gray-50 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Built on{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trusted Medical Knowledge
            </span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            BPCare AI's educational content and health insights are grounded in evidence-based
            medical research. We reference guidelines and data from:
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {sources.map((source, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {/* Logo Placeholder */}
              <div className="aspect-square flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-blue-50 group-hover:to-purple-50 transition-colors duration-300">
                  <span className="text-2xl font-bold text-gray-400 group-hover:text-blue-600 transition-colors duration-300">
                    {source.abbr.charAt(0)}
                  </span>
                </div>
                <p className="text-xs text-center text-gray-600 font-medium leading-tight">
                  {source.abbr}
                </p>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Editorial Independence */}
        <div className="mb-10 rounded-2xl bg-blue-50 border border-blue-100 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-2">Editorial Independence</p>
              <p className="text-gray-700">
                We do not accept paid placements, sponsored content, or advertising that influences
                our educational material.
              </p>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="rounded-2xl border-l-4 border-yellow-500 bg-yellow-50 p-6">
          <p className="font-semibold text-gray-900 mb-2">Important Medical Disclaimer:</p>
          <p className="text-gray-700 leading-relaxed">
            BPCare AI provides <span className="font-semibold">educational information, not medical advice</span>.
            Always consult your healthcare provider for personalized diagnosis and treatment
            recommendations. The information in our app is not intended to replace professional
            medical care.
          </p>
        </div>
      </div>
    </section>
  );
}
