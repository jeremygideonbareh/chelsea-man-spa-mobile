import { useNavigate } from 'react-router';
import { Scissors, Sparkles, Droplets, Flame, ChevronRight, Clock } from 'lucide-react';
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
  const navigate = useNavigate();

  return (
    <section className="relative bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="text-amber-500 text-xs tracking-[0.3em] uppercase font-medium">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-800 mt-4 leading-tight">
            The Chelsea Experience
          </h2>
          <p className="text-slate-500 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Every service is performed with meticulous attention to detail
            using premium products and techniques.
          </p>
        </FadeIn>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <FadeIn key={service.id} delay={index * 0.1} direction="up">
                <button
                  onClick={() => navigate('/login')}
                  className="group w-full text-left amber-card rounded-2xl overflow-hidden hover:border-amber-500/30 hover:shadow-md transition-all duration-300 h-full"
                >
                  <div className="flex flex-col sm:flex-row h-full">
                    {/* Image */}
                    <div className="relative w-full sm:w-48 h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur border border-slate-200 flex items-center justify-center shadow-sm">
                        <Icon className="w-4 h-4 text-amber-500" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between min-h-[180px]">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-slate-800 text-lg font-semibold">{service.title}</h3>
                          <span className="text-amber-600 text-sm font-semibold whitespace-nowrap">{service.price}</span>
                        </div>
                        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                        <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration}
                        </span>
                        <span className="text-amber-500 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Book Now <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </FadeIn>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate('/login')}
            className="amber-btn-outline px-8 py-3 rounded-full text-sm font-semibold"
          >
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
}
