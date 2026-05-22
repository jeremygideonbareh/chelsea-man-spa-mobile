import { Instagram, Phone, Mail, MapPin } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="relative bg-[#0A0A0A] pt-12 pb-8 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

      <div className="text-center mb-8">
        <h3 className="font-display italic text-2xl font-bold gold-gradient-text">
          Chelsea
        </h3>
        <p className="text-[#A3A3A3] text-[10px] tracking-[0.3em] uppercase mt-1">
          Man Spa
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="flex items-center gap-2 text-[#A3A3A3] text-xs">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Dubai Marina, UAE</span>
        </div>
        <div className="flex items-center gap-2 text-[#A3A3A3] text-xs">
          <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>+971 4 123 4567</span>
        </div>
        <div className="flex items-center gap-2 text-[#A3A3A3] text-xs">
          <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>bookings@chelseamanspa.ae</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <a
          href="#"
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center transition-all hover:border-[#D4AF37]/50 hover:scale-110"
        >
          <Instagram className="w-4 h-4 text-[#A3A3A3]" />
        </a>
      </div>

      <div className="text-center mb-8">
        <p className="text-[#A3A3A3] text-[10px] tracking-wide uppercase mb-2">Opening Hours</p>
        <p className="text-white text-xs">Mon - Sun: 9:00 AM - 10:00 PM</p>
      </div>

      <div className="text-center pt-6 border-t border-white/5">
        <p className="text-[#A3A3A3]/50 text-[10px]">
          &copy; 2025 Chelsea Man Spa. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
