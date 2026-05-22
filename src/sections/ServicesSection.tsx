import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { Scissors, Sparkles, Droplets, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { FadeIn } from '@/components/Animate';

const services = [
  {
    id: 1,
    title: 'Signature Cut',
    description: 'Precision haircut tailored to your face shape and personal style.',
    image: 'images/signaturecut.jpg',
    icon: Scissors,
    duration: '45 min',
    price: 'AED 150',
  },
  {
    id: 2,
    title: 'Beard Sculpting',
    description: 'Masterful beard shaping with straight razor finish.',
    image: 'images/beardsculpting.jpg',
    icon: Sparkles,
    duration: '30 min',
    price: 'AED 100',
  },
  {
    id: 3,
    title: "Gentleman's Facial",
    description: 'Rejuvenating facial treatment designed specifically for men.',
    image: 'images/facial.jpg',
    icon: Droplets,
    duration: '60 min',
    price: 'AED 250',
  },
  {
    id: 4,
    title: 'Hot Stone Massage',
    description: 'Deep relaxation with heated basalt stones and aromatherapy.',
    image: 'images/stonemassage.jpg',
    icon: Flame,
    duration: '75 min',
    price: 'AED 300',
  },
];

export default function ServicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 380;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative bg-[#0A0A0A] py-24 px-6 overflow-hidden">
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

      <FadeIn className="text-center mb-16">
        <span className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-medium">
          Our Services
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-4 leading-tight">
          The Chelsea Experience
        </h2>
        <p className="text-[#A3A3A3] mt-4 max-w-lg mx-auto text-sm leading-relaxed">
          Every service is performed with meticulous attention to detail
          using premium products and techniques.
        </p>
      </FadeIn>

      {/* Scroll Navigation */}
      <div className="max-w-6xl mx-auto relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-[#0F0F0F]/80 border border-white/10 flex items-center justify-center text-[#A3A3A3] hover:text-white hover:border-[#D4AF37]/40 transition-all hidden md:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-[#0F0F0F]/80 border border-white/10 flex items-center justify-center text-[#A3A3A3] hover:text-white hover:border-[#D4AF37]/40 transition-all hidden md:flex"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => navigate('/login')}
                className="group relative flex-shrink-0 w-[300px] sm:w-[340px] snap-start rounded-2xl overflow-hidden bg-[#0F0F0F] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 text-left"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/20 to-transparent" />

                  {/* Icon badge */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>

                  {/* Price tag */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                    <span className="text-[#D4AF37] text-xs font-semibold">{service.price}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-white text-lg font-semibold">{service.title}</h3>
                  <p className="text-[#A3A3A3] text-sm mt-2 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <span className="text-[#6B655A] text-xs">{service.duration}</span>
                    <span className="text-[#D4AF37] text-sm font-semibold">{service.price}</span>
                  </div>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ring-1 ring-[#D4AF37]/0 group-hover:ring-[#D4AF37]/20" />
              </button>
            );
          })}

          {/* End spacer for last card snap */}
          <div className="flex-shrink-0 w-4" />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 rounded-full border border-white/10 text-[#A3A3A3] text-sm hover:text-white hover:border-[#D4AF37]/40 transition-all"
        >
          View All Services
        </button>
      </div>
    </section>
  );
}
