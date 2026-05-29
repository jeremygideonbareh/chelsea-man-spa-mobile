import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Scissors, Palette, Sparkles, Heart, Sun, Wind, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { FadeIn } from '@/components/Animate';

interface ServiceItem {
  name: string;
  duration: string;
  price: string;
}

interface CategoryGroup {
  name: string;
  icon: any;
  image: string;
  items: ServiceItem[];
}

const categories: CategoryGroup[] = [
  {
    name: 'Haircut & Styling',
    icon: Scissors,
    image: 'images/hero-bg.jpg',
    items: [
      { name: 'Hair Cut & Beard', duration: '1 hr', price: 'AED 190' },
      { name: "Men's Hair Cut", duration: '30 min', price: 'AED 130' },
      { name: 'Skin Fade (Perfect Skin Fade Hair Cut)', duration: '30 min', price: 'AED 160' },
      { name: 'Buzz Cut', duration: '20 min', price: 'AED 110' },
      { name: 'Kids Hair Cut (Juniors)', duration: '30 min', price: 'AED 110' },
      { name: 'Line Up & Clean The Neck (From the back)', duration: '15 min', price: 'AED 55' },
      { name: 'Hair Wash and Blow Dry', duration: '15 min', price: 'AED 80' },
    ],
  },
  {
    name: 'Hair Color & Treatments',
    icon: Palette,
    image: 'images/image1.jpg',
    items: [
      { name: 'Shades of Colors (Zero Ammonia)', duration: '15 min', price: 'AED 160' },
      { name: 'Hair Color for Men', duration: '40 min', price: 'AED 160' },
      { name: 'Silver Hair Color', duration: '1 hr', price: 'AED 600' },
      { name: 'Highlights (Short Hair)', duration: '1 hr', price: 'AED 360' },
      { name: 'Highlights (Long Hair)', duration: '1 hr', price: 'AED 485' },
      { name: 'Beard Color / Dye', duration: '15 min', price: 'AED 80' },
      { name: 'Mask Hair Treatment (Deep conditioning)', duration: '15 min', price: 'AED 150' },
      { name: 'Keratin Treatment', duration: '1 hr', price: 'AED 550' },
      { name: 'Collagen Hair Treatment', duration: '1 hr', price: 'AED 600' },
    ],
  },
  {
    name: 'Shaving & Beard Care',
    icon: Sparkles,
    image: 'images/beardsculpting.jpg',
    items: [
      { name: 'Beard Style (Trim/Shaping)', duration: '30 min', price: 'AED 80' },
      { name: 'Royal Shave Spa', duration: '30 min', price: 'AED 160' },
      { name: 'Shave (Razor / Straight Razor)', duration: '15 min', price: 'AED 65' },
      { name: 'Express Shave Machine', duration: '15 min', price: 'AED 60' },
    ],
  },
  {
    name: 'Nail Care & Grooming',
    icon: Heart,
    image: 'images/image2.jpg',
    items: [
      { name: 'Manicure', duration: '30 min', price: 'AED 90' },
      { name: 'Pedicure', duration: '45 min', price: 'AED 120' },
      { name: 'Manicure & Pedicure', duration: '1 hr', price: 'AED 190' },
      { name: 'Spa Manicure', duration: '1 hr', price: 'AED 150' },
      { name: 'Spa Pedicure', duration: '1 hr', price: 'AED 180' },
      { name: 'Nails Cut & Shape', duration: '1 hr', price: 'AED 60' },
      { name: 'Paraffin Wax Treatments (Feet and Hands)', duration: '1 hr', price: 'AED 200' },
    ],
  },
  {
    name: 'Skincare & Massages',
    icon: Sun,
    image: 'images/stonemassage.jpg',
    items: [
      { name: 'Soothing Facial', duration: '1 hr', price: 'AED 250' },
      { name: 'Facial Deep Cleansing Skin', duration: '1 hr', price: 'AED 400' },
      { name: 'Facial for Sensitive Skin', duration: '1 hr', price: 'AED 350' },
      { name: 'Face Massage', duration: '—', price: 'AED 50' },
    ],
  },
  {
    name: 'Waxing & Hair Removal',
    icon: Wind,
    image: 'images/service-massage.jpg',
    items: [
      { name: 'Underarms Waxing', duration: '1 hr', price: 'AED 60' },
      { name: 'Full Arms/Legs Wax Hair Removal', duration: '1 hr', price: 'AED 150' },
      { name: 'Full Chest Wax Hair Removal', duration: '1 hr', price: 'AED 100' },
      { name: 'Full Back Wax Hair Removal', duration: '1 hr', price: 'AED 150' },
    ],
  },
];

export default function ServicesSection() {
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  function toggle(name: string) {
    setOpenCategory(openCategory === name ? null : name);
  }

  return (
    <section className="relative bg-white py-24 px-6" id="services">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="text-amber-500 text-xs tracking-[0.3em] uppercase font-medium">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-800 mt-4 leading-tight">
            The Chelsea Menu
          </h2>
          <p className="text-slate-500 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Premium grooming and self-care services tailored for the modern gentleman.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isOpen = openCategory === cat.name;
            return (
              <FadeIn key={cat.name} delay={i * 0.08} direction="up">
                <div
                  className={`white-card rounded-2xl overflow-hidden border transition-all duration-300 h-full ${
                    isOpen
                      ? 'border-amber-500/30 shadow-lg shadow-amber-500/5'
                      : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                  }`}
                >
                  {/* Cinematic Image Header */}
                  <button
                    onClick={() => toggle(cat.name)}
                    className="relative w-full h-52 overflow-hidden group"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-slate-900/10" />

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-white text-base font-semibold leading-tight">{cat.name}</h3>
                          <span className="text-white/60 text-[11px]">{cat.items.length} services</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 text-white" />
                    </div>
                  </button>

                  {/* Expandable Service List */}
                  <div
                    className={`transition-all duration-400 ease-in-out ${
                      isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <div className="divide-y divide-slate-50">
                      {cat.items.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => navigate('/login')}
                          className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-amber-50/50 transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="text-slate-700 text-sm font-medium group-hover:text-slate-900 transition-colors block truncate">
                              {item.name}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                              <Clock className="w-3 h-3" />
                              {item.duration}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-amber-600 text-sm font-semibold whitespace-nowrap">
                              {item.price}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn className="flex justify-center mt-12" delay={0.3} direction="up">
          <button
            onClick={() => navigate('/login')}
            className="amber-btn px-10 py-3.5 rounded-full text-sm font-semibold shadow-lg shadow-amber-500/20"
          >
            Book Your Appointment
          </button>
        </FadeIn>
      </div>
    </section>
  );
}
