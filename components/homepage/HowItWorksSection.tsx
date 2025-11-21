export default function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Record Your Readings',
      description: 'Easily log your blood pressure, or measure heart rate using your phone\'s camera. Quick and simple.',
      icon: '📝',
    },
    {
      number: '2',
      title: 'See Clear Trends',
      description: 'BPCare AI organizes your data into easy-to-understand charts and insights, showing you patterns over time.',
      icon: '📊',
    },
    {
      number: '3',
      title: 'Understand What to Do',
      description: 'Get simple, caring guidance on what your readings mean and when you might want to talk to your doctor.',
      icon: '💡',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How BPCare AI Works
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Three simple steps to better understand your heart health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-1 bg-gradient-to-r from-brand-blue to-brand-purple opacity-30" />
              )}

              <div className="text-center relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-blue to-brand-purple rounded-full text-white text-3xl font-bold mb-6 shadow-lg">
                  {step.number}
                </div>

                <div className="text-6xl mb-6">{step.icon}</div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>

                <p className="text-lg text-gray-700 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
