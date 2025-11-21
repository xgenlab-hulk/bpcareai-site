export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Robert M.',
      age: 62,
      comment: 'After my diagnosis, I was checking my blood pressure five times a day and panicking over every reading. BPCare AI helped me see the trends instead of obsessing over individual numbers. I feel much calmer now.',
    },
    {
      name: 'Linda S.',
      age: 58,
      comment: 'My doctor wanted me to track my readings for a month. BPCare AI made it so easy, and the charts I could share with her were incredibly helpful. She could see my patterns at a glance.',
    },
    {
      name: 'James K.',
      age: 55,
      comment: 'I love that all my data stays on my phone. The app doesn\'t make me feel anxious — it actually helps me understand what\'s normal for me and when I should be concerned.',
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Users Say
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Hear from people who've found peace of mind with BPCare AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass-card p-8">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-purple rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900 text-lg">{testimonial.name}</p>
                  <p className="text-gray-600">Age {testimonial.age}</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed italic">
                "{testimonial.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
