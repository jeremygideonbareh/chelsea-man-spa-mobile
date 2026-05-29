import { useState, useMemo } from 'react';
import { Scissors, Palette, Sparkles, Heart, Sun, Wind, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import type { Service } from '@/types';

const CATEGORY_IMAGES: Record<string, string> = {
  'Haircut & Styling': 'images/hero-bg.jpg',
  'Hair Color & Treatments': 'images/image1.jpg',
  'Shaving & Beard Care': 'images/beardsculpting.jpg',
  'Nail Care & Grooming': 'images/image2.jpg',
  'Skincare & Massages': 'images/stonemassage.jpg',
  'Waxing & Hair Removal': 'images/service-massage.jpg',
};

const CATEGORY_ICONS: Record<string, any> = {
  'Haircut & Styling': Scissors,
  'Hair Color & Treatments': Palette,
  'Shaving & Beard Care': Sparkles,
  'Nail Care & Grooming': Heart,
  'Skincare & Massages': Sun,
  'Waxing & Hair Removal': Wind,
};

const CATEGORY_ORDER = [
  'Haircut & Styling',
  'Hair Color & Treatments',
  'Shaving & Beard Care',
  'Nail Care & Grooming',
  'Skincare & Massages',
  'Waxing & Hair Removal',
];

interface ServiceSelectionProps {
  onSelect: (service: Service) => void;
}

export default function ServiceSelection({ onSelect }: ServiceSelectionProps) {
  const { services, loading } = useServices();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, Service[]> = {};
    services.forEach((s) => {
      const cat = s.category || 'Haircut & Styling';
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    });
    return map;
  }, [services]);

  function toggle(name: string) {
    setOpenCategory(openCategory === name ? null : name);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stagger-item {
          opacity: 0;
          animation: fadeInUp 0.4s ease both;
        }
      `}</style>

      <div className="space-y-4">
        {CATEGORY_ORDER.map((catName, catIndex) => {
          const catServices = grouped[catName];
          if (!catServices || catServices.length === 0) return null;
          const Icon = CATEGORY_ICONS[catName] || Scissors;
          const isOpen = openCategory === catName;

          return (
            <div
              key={catName}
              className={`white-card rounded-2xl overflow-hidden border transition-all duration-300 stagger-item ${
                isOpen
                  ? 'border-amber-500/30 shadow-lg shadow-amber-500/5'
                  : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
              }`}
              style={{ animationDelay: `${catIndex * 0.08}s` }}
            >
              <button
                onClick={() => toggle(catName)}
                className="relative w-full h-36 overflow-hidden group"
              >
                <img
                  src={CATEGORY_IMAGES[catName] || 'images/hero-bg.jpg'}
                  alt={catName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-slate-900/10" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white text-sm font-semibold leading-tight">{catName}</h3>
                      <span className="text-white/60 text-[10px]">{catServices.length} services</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronDown className="w-3.5 h-3.5 text-white" />
                </div>
              </button>

              <div
                className={`transition-all duration-400 ease-in-out ${
                  isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="divide-y divide-slate-50">
                  {catServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => onSelect(service)}
                      className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-amber-50/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-slate-900 text-sm font-medium group-hover:text-slate-900 transition-colors block truncate">
                          {service.name}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                          <Clock className="w-3 h-3" />
                          {service.duration_minutes} min
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-amber-600 text-sm font-semibold whitespace-nowrap">
                          AED {service.price}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
