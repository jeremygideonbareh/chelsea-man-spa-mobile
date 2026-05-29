import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Menu, X, User } from 'lucide-react';

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => setMenuOpen(true)}
            className={`w-10 h-10 flex items-center justify-center ${scrolled ? 'text-slate-800' : 'text-white'}`}
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display italic text-xl font-bold text-amber-500"
          >
            Chelsea
          </button>

          <button
            onClick={() => navigate('/login')}
            className={`w-10 h-10 flex items-center justify-center ${scrolled ? 'text-slate-800' : 'text-white'}`}
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-white/98 backdrop-blur-xl"
          style={{ animation: 'fadeIn 0.3s ease' }}
        >
          <div className="h-full flex flex-col px-6 py-6">
            <div className="flex justify-end">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col items-center justify-center gap-8">
              {['Services', 'About', 'Contact'].map((item, index) => (
                <button
                  key={item}
                  onClick={() => {
                    setMenuOpen(false);
                    const el = document.getElementById(item.toLowerCase());
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="font-display text-3xl text-slate-800 hover:text-amber-500 transition-colors"
                  style={{ animation: `slideUp 0.4s ease ${index * 0.1}s both` }}
                >
                  {item}
                </button>
              ))}
            </nav>

            <button
              onClick={() => {
                setMenuOpen(false);
                navigate('/login');
              }}
              className="amber-btn w-full py-4 rounded-full text-sm font-semibold"
              style={{ animation: 'slideUp 0.4s ease 0.4s both' }}
            >
              Book Now
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
