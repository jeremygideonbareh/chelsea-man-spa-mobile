import { Instagram, Phone, Mail, MapPin } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="relative bg-white pt-12 pb-8 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="font-display italic text-2xl font-bold text-amber-500">
            Chelsea
          </h3>
          <p className="text-slate-400 text-[10px] tracking-[0.3em] uppercase mt-1">
            Man Spa
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>Dubai Marina, UAE</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Phone className="w-3.5 h-3.5 text-amber-500" />
            <span>+971 4 123 4567</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Mail className="w-3.5 h-3.5 text-amber-500" />
            <span>bookings@chelseamanspa.ae</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center transition-all hover:border-amber-300 hover:bg-amber-50 hover:scale-110"
          >
            <Instagram className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        <div className="text-center mb-8">
          <p className="text-slate-400 text-[10px] tracking-wide uppercase mb-2">Opening Hours</p>
          <p className="text-slate-700 text-xs">Mon - Sun: 9:00 AM - 10:00 PM</p>
        </div>

        <div className="text-center pt-6 border-t border-slate-100">
          <p className="text-slate-300 text-[10px]">
            &copy; 2025 Chelsea Man Spa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
