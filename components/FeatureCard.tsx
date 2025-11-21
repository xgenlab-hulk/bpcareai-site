interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="glass-card p-8 hover:shadow-xl transition-all duration-300">
      {icon && (
        <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-purple rounded-xl flex items-center justify-center mb-6">
          <span className="text-3xl">{icon}</span>
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-700 text-lg leading-relaxed">{description}</p>
    </div>
  );
}
