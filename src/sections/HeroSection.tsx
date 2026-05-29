import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Search, MapPin } from 'lucide-react';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = 1 - scrollProgress * 1.2;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90dvh] w-full overflow-hidden bg-slate-900"
      style={{ opacity: Math.max(0, opacity) }}
    >
      {/* Full background image with dark overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('images/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <div className="text-center max-w-3xl mx-auto">
          <span
            className="text-amber-400 text-xs tracking-[0.35em] uppercase mb-4 font-medium block hero-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            The
          </span>

          <h1
            className="font-display italic text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight hero-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            Art of
          </h1>

          <h1
            className="font-display italic text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mt-1 hero-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            Grooming
          </h1>

          <p
            className="text-slate-300 text-sm sm:text-base mt-6 max-w-md mx-auto leading-relaxed hero-fade-in"
            style={{ animationDelay: '0.8s' }}
          >
            London-style sophistication meets Dubai luxury.
            Experience the finest in men's grooming and wellness.
          </p>
        </div>

        {/* Book Button */}
        <div
          className="mt-10 hero-fade-in"
          style={{ animationDelay: '1s' }}
        >
          <button
            onClick={() => navigate('/login')}
            className="amber-btn px-8 py-4 rounded-full text-sm font-semibold flex items-center gap-2 mx-auto"
          >
            Book Your Appointment <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-slate-400 text-xs mt-4 text-center">
            <MapPin className="w-3 h-3 inline mr-1" />
            Dubai Marina &middot; Open daily 9AM - 10PM
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 hero-fade-in"
        style={{ animationDelay: '1.5s' }}
      >
        <span className="text-slate-400 text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-slate-500/60 flex justify-center pt-1.5 animate-bounce">
          <div className="w-1 h-2 bg-slate-400 rounded-full" />
        </div>
      </div>

      <style>{`
        .hero-fade-in {
          opacity: 0;
          animation: heroFadeIn 0.8s ease forwards;
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
