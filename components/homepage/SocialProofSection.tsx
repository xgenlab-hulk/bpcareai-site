export default function SocialProofSection() {
  const stats = [
    {
      number: '10,000+',
      label: 'Users Trust Us',
      labelCn: '用户信赖',
      icon: '👥',
    },
    {
      number: '4.8',
      label: 'App Store Rating',
      labelCn: 'App Store 评分',
      icon: '⭐',
      suffix: '/ 5',
    },
    {
      number: '100%',
      label: 'Local Storage',
      labelCn: '本地存储',
      icon: '🔒',
    },
    {
      number: '3',
      label: 'Steps to Start',
      labelCn: '步即刻上手',
      icon: '🚀',
      prefix: '',
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{stat.icon}</div>
              <div className="flex items-baseline justify-center gap-1">
                {stat.prefix && (
                  <span className="text-xl sm:text-2xl text-gray-500">{stat.prefix}</span>
                )}
                <span className="stat-number text-2xl sm:text-3xl lg:text-4xl">{stat.number}</span>
                {stat.suffix && (
                  <span className="text-base sm:text-xl text-gray-500 ml-1">{stat.suffix}</span>
                )}
              </div>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-lg font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-100">
          <div className="trust-badge">
            <span>🛡️</span>
            <span>Privacy First</span>
          </div>
          <div className="trust-badge">
            <span>📱</span>
            <span>No Account Required</span>
          </div>
          <div className="trust-badge">
            <span>💰</span>
            <span>Free to Use</span>
          </div>
          <div className="trust-badge">
            <span>🔐</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
}
