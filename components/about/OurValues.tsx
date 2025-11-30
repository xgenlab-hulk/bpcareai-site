/**
 * Our Values Section
 * Core values that guide BPCare AI
 */
import { Target, Shield, Heart, BookOpen } from 'lucide-react';

export function OurValues() {
  const values = [
    {
      icon: Target,
      title: 'Clarity Over Complexity',
      description:
        "Your health data should be easy to understand. We turn confusing numbers into clear insights you can actually use.",
      iconBg: 'from-blue-400 to-blue-600',
      cardBg: 'bg-blue-50',
    },
    {
      icon: Shield,
      title: 'Privacy as a Right',
      description:
        'Your health information belongs to you—period. We never sell data, never share without permission, and build with security first.',
      iconBg: 'from-green-400 to-green-600',
      cardBg: 'bg-green-50',
    },
    {
      icon: Heart,
      title: 'Respect & Dignity',
      description:
        "You're not a number in a database. You're an intelligent adult who deserves tools designed with care, empathy, and respect for your experience.",
      iconBg: 'from-pink-400 to-pink-600',
      cardBg: 'bg-pink-50',
    },
    {
      icon: BookOpen,
      title: 'Evidence-Based Truth',
      description:
        'We source our health information from trusted medical institutions—no clickbait, no fear-mongering, just honest, vetted guidance from organizations like the AHA and NIH.',
      iconBg: 'from-purple-400 to-purple-600',
      cardBg: 'bg-purple-50',
    },
  ];

  return (
    <section className="bg-gray-50 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What{' '}
            <span className="bg-gradient-to-r from-brand-blue-dark to-brand-purple bg-clip-text text-transparent">
              Guides Us
            </span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Our core values shape everything we build
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div
                    className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${value.iconBg} items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="relative text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="relative text-gray-700 text-base leading-relaxed">{value.description}</p>

                {/* Bottom Accent */}
                <div className={`mt-6 h-1 w-20 rounded-full bg-gradient-to-r ${value.iconBg}`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
