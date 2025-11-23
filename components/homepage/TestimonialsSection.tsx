export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Robert M.',
      age: 62,
      location: 'California',
      duration: 'Using for 6 months',
      rating: 5,
      comment: 'After my diagnosis, I was checking my blood pressure five times a day and panicking over every reading. BPCare AI helped me see the trends instead of obsessing over individual numbers. I feel much calmer now.',
      highlight: 'Reduced my anxiety significantly',
    },
    {
      name: 'Linda S.',
      age: 58,
      location: 'Texas',
      duration: 'Using for 3 months',
      rating: 5,
      comment: 'My doctor wanted me to track my readings for a month. BPCare AI made it so easy, and the charts I could share with her were incredibly helpful. She could see my patterns at a glance.',
      highlight: 'Perfect for doctor visits',
    },
    {
      name: 'James K.',
      age: 55,
      location: 'Florida',
      duration: 'Using for 4 months',
      rating: 5,
      comment: 'I love that all my data stays on my phone. No accounts, no cloud uploads. The app doesn\'t make me feel anxious — it actually helps me understand what\'s normal for me.',
      highlight: 'Privacy I can trust',
    },
    {
      name: 'Margaret H.',
      age: 67,
      location: 'New York',
      duration: 'Using for 8 months',
      rating: 5,
      comment: 'At my age, keeping track of health numbers can be overwhelming. This app is so simple to use — big buttons, clear charts, easy to understand. My daughter recommended it and I\'m so glad she did.',
      highlight: 'Easy for seniors to use',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold mb-4">
            Real Stories
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Loved by{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Hear from people who've found peace of mind with BPCare AI
          </p>

          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="star-rating text-2xl">★★★★★</div>
            <span className="text-xl font-semibold text-gray-900">4.8</span>
            <span className="text-gray-500">from 1,200+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 card-hover"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  {/* Avatar */}
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-purple rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">
                      Age {testimonial.age} · {testimonial.location}
                    </p>
                  </div>
                </div>

                {/* Verified Badge */}
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                  <span className="text-green-500 text-xs">✓</span>
                  <span className="text-green-700 text-xs font-medium">Verified</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="star-rating text-lg">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <span className="text-gray-400 text-sm">{testimonial.duration}</span>
              </div>

              {/* Quote */}
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                "{testimonial.comment}"
              </p>

              {/* Highlight */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-blue-light/50 rounded-full">
                <span className="text-brand-blue-dark text-sm">💬</span>
                <span className="text-brand-blue-dark text-sm font-medium">{testimonial.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
