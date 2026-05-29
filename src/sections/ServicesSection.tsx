import { useNavigate } from 'react-router';
import { Scissors, Palette, Sparkles, Heart, Sun, Wind, Clock, ChevronRight } from 'lucide-react';
import { FadeIn } from '@/components/Animate';

interface ServiceItem {
  name: string;
  duration: string;
  price: string;
}

interface CategoryGroup {
  name: string;
  icon: any;
  items: ServiceItem[];
}

const categories: CategoryGroup[] = [
  {
    name: 'Haircut & Styling',
    icon: Scissors,
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

  return (
    <section className="relative bg-white py-24 px-6" id="services">
      <div className="max-w-4xl mx-auto">
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

        <div className="space-y-10">
          {categories.map((cat, catIndex) => {
            const Icon = cat.icon;
            return (
              <FadeIn key={cat.name} delay={catIndex * 0.08} direction="up">
                <div className="white-card rounded-2xl overflow-hidden border border-slate-100">
                  <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-amber-600" />
                    </div>
                    <h3 className="text-slate-800 text-base font-semibold tracking-wide">
                      {cat.name}
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {cat.items.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => navigate('/login')}
                        className="w-full text-left px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-amber-50/50 transition-colors group"
                      >
                        <span className="text-slate-700 text-sm font-medium group-hover:text-slate-900 transition-colors">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="flex items-center gap-1 text-slate-400 text-xs whitespace-nowrap">
                            <Clock className="w-3 h-3" />
                            {item.duration}
                          </span>
                          <span className="text-amber-600 text-sm font-semibold whitespace-nowrap min-w-[5rem] text-right">
                            {item.price}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    ))}
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
