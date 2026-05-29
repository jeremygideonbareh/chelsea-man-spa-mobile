import { useState } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import type { Service } from '@/types';

interface ServiceSelectionProps {
  onSelect: (service: Service) => void;
}

const categories = ['All', 'Hair', 'Beard', 'Spa'];

export default function ServiceSelection({ onSelect }: ServiceSelectionProps) {
  const { services, loading } = useServices();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredServices = activeCategory === 'All'
    ? services
    : services.filter(s =>
        s.category?.toLowerCase() === activeCategory.toLowerCase()
      );

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

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredServices.map((service, index) => (
          <button
            key={service.id}
            className="w-full white-card rounded-2xl overflow-hidden text-left transition-all hover:shadow-md active:scale-[0.98] stagger-item"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onSelect(service)}
          >
            <div className="flex">
              <div className="w-28 h-28 flex-shrink-0 relative">
                <img
                  src={service.image_url || 'images/service-haircut.jpg'}
                  alt={service.name || 'Service'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/60" />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-slate-900 text-sm font-semibold">{service.name}</h3>
                  <p className="text-slate-500 text-[10px] mt-1 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px]">{service.duration_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-900 text-sm font-semibold">
                      AED {service.price}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
