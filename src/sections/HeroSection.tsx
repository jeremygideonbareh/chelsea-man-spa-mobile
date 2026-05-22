import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';

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
  const artOfY = -scrollProgress * 120;
  const groomingY = scrollProgress * 120;
  const theOpacity = 1 - scrollProgress * 3;

  return (
    <section
      ref={containerRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-[#0A0A0A]"
      style={{ opacity: Math.max(0, opacity) }}
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/70 via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]/60" />
      </div>

      {/* Hero Typography */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <span
          className="text-[#A3A3A3] text-xs tracking-[0.35em] uppercase mb-4 font-medium"
          style={{
            opacity: Math.max(0, theOpacity),
            transform: `translateY(${(1 - theOpacity) * 20}px)`,
            transition: 'opacity 0.3s ease',
          }}
        >
          The
        </span>

        <h1
          className="font-display italic text-5xl sm:text-6xl md:text-7xl font-bold gold-gradient-text leading-tight"
          style={{
            transform: `translateY(${artOfY}px)`,
            transition: 'transform 0.1s linear',
          }}
        >
          Art of
        </h1>

        <h1
          className="font-display italic text-5xl sm:text-6xl md:text-7xl font-bold gold-gradient-text leading-tight mt-1"
          style={{
            transform: `translateY(${groomingY}px)`,
            transition: 'transform 0.1s linear',
          }}
        >
          Grooming
        </h1>

        <p
          className="text-[#A3A3A3] text-sm mt-6 max-w-md text-center leading-relaxed hero-fade-in"
          style={{ animationDelay: '1s' }}
        >
          London-style sophistication meets Dubai luxury.
          Experience the finest in men's grooming and wellness.
        </p>

        <button
          onClick={() => navigate('/login')}
          className="gold-btn mt-10 px-8 py-4 rounded-full text-sm flex items-center gap-2 hero-fade-in hover:scale-105 active:scale-95 transition-transform"
          style={{ animationDelay: '1.2s' }}
        >
          Book Experience
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 hero-fade-in"
        style={{ animationDelay: '1.5s' }}
      >
        <span className="text-[#A3A3A3] text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-[#D4AF37]/40 flex justify-center pt-1.5 animate-bounce">
          <div className="w-1 h-2 bg-[#D4AF37] rounded-full" />
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
