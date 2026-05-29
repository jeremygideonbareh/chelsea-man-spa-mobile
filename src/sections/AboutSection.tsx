import { Award, Clock, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
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
  const navigate = useNavigate();

  return (
    <section className="relative bg-white py-20 px-6">
      {/* Stats */}
      <FadeIn className="flex justify-center gap-10 mb-16">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <span className="font-display text-2xl md:text-3xl font-bold text-amber-500">
              {stat.value}
            </span>
            <p className="text-slate-400 text-[10px] mt-1 tracking-wide uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </FadeIn>

      {/* About Content */}
      <FadeIn className="text-center mb-14" delay={0.2}>
        <span className="text-amber-500 text-xs tracking-[0.3em] uppercase font-medium">
          About Us
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-800 mt-3">
          Why Chelsea?
        </h2>
        <p className="text-slate-500 mt-4 max-w-md mx-auto text-sm leading-relaxed">
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
              <div className="amber-card rounded-2xl p-5 flex items-start gap-4 hover:border-amber-200 transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/login')}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-800 text-sm font-semibold">{feature.title}</h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 self-center" />
              </div>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn className="text-center mt-12" delay={0.8}>
        <button
          onClick={() => navigate('/login')}
          className="amber-btn px-8 py-3 rounded-full text-sm font-semibold"
        >
          Book Your Experience
        </button>
      </FadeIn>
    </section>
  );
}
