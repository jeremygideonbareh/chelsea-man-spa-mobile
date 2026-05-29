import { useState } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { useStylists } from '@/hooks/useServices';
import type { Profile } from '@/types';

interface StylistSelectionProps {
  onSelect: (stylist: Profile) => void;
}

export default function StylistSelection({ onSelect }: StylistSelectionProps) {
  const { stylists, loading } = useStylists();
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stylist-item {
          opacity: 0;
          animation: slideInLeft 0.4s ease both;
        }
      `}</style>

      <p className="text-slate-500 text-xs">
        Choose your preferred specialist
      </p>

      <div className="space-y-3">
        {stylists.map((stylist, index) => {
          const isSelected = selectedId === stylist.id;
          return (
            <button
              key={stylist.id}
              className={`w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-all stylist-item active:scale-[0.98] ${
                isSelected
                  ? 'amber-card-selected'
                  : 'amber-card'
              }`}
              style={{ animationDelay: `${index * 0.08}s` }}
              onClick={() => setSelectedId(stylist.id)}
            >
              <div className={`w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 transition-all ${
                isSelected ? 'ring-amber-500' : 'ring-slate-200'
              }`}>
                <img
                  src={stylist.avatar_url}
                  alt={stylist.full_name || 'Stylist'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-slate-900 text-sm font-semibold">{stylist.full_name}</h3>
                <p className="text-slate-500 text-xs mt-0.5 capitalize">{stylist.role}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < 4 ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`}
                    />
                  ))}
                  <span className="text-slate-400 text-[10px] ml-1">4.8</span>
                </div>
              </div>

              <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-colors ${
                isSelected ? 'text-amber-500' : 'text-slate-300'
              }`} />
            </button>
          );
        })}
      </div>

      <div
        className="pt-4 transition-all"
        style={{
          opacity: selectedId ? 1 : 0,
          transform: selectedId ? 'translateY(0)' : 'translateY(12px)',
          pointerEvents: selectedId ? 'auto' : 'none',
        }}
      >
        <button
          className="amber-btn w-full h-14 rounded-2xl text-sm font-semibold"
          onClick={() => {
            const stylist = stylists.find(s => s.id === selectedId);
            if (stylist) {
              onSelect({
                id: stylist.id,
                full_name: stylist.full_name,
                role: stylist.role,
              } as Profile);
            }
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
