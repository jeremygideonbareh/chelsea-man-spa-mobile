import { Award, Clock, MapPin } from 'lucide-react';
import { FadeIn } from '@/components/Animate';

const stats = [
  { value: '12+', label: 'Years Experience' },
  { value: '50K+', label: 'Happy Clients' },
  { value: '4.9', label: 'Rating' },
];

const features = [
  {
    icon: Award,
    title: 'Master Barbers',
    description: 'Our team includes award-winning barbers with international training.',
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    description: 'Open 7 days a week with early morning and late evening appointments.',
  },
  {
    icon: MapPin,
    title: 'Prime Location',
    description: 'Located in the heart of Dubai Marina with valet parking available.',
  },
];

export default function AboutSection() {
  return (
    <section className="relative bg-[#0A0A0A] py-20 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      {/* Stats */}
      <FadeIn className="flex justify-center gap-10 mb-16">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <span className="font-display text-2xl md:text-3xl font-bold gold-gradient-text">
              {stat.value}
            </span>
            <p className="text-[#A3A3A3] text-[10px] mt-1 tracking-wide uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </FadeIn>

      {/* About Content */}
      <FadeIn className="text-center mb-14" delay={0.2}>
        <span className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-medium">
          About Us
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-3">
          Why Chelsea?
        </h2>
        <p className="text-[#A3A3A3] mt-4 max-w-md mx-auto text-sm leading-relaxed">
          Founded on the belief that every gentleman deserves an exceptional grooming experience,
          Chelsea Man Spa brings London's finest barbering traditions to Dubai's most discerning clientele.
        </p>
      </FadeIn>

      {/* Feature Cards */}
      <div className="space-y-4 max-w-md mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <FadeIn key={feature.title} delay={0.3 + index * 0.15} direction="left">
              <div className="glass-card rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold">{feature.title}</h3>
                  <p className="text-[#A3A3A3] text-xs mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn className="text-center mt-12" delay={0.8}>
        <p className="text-[#A3A3A3] text-xs">
          Ready to experience the difference?
        </p>
      </FadeIn>
    </section>
  );
}
