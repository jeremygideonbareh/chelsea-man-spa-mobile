import { CheckCircle2, Calendar, Clock, User, Scissors } from 'lucide-react';
import type { Service, Profile } from '@/types';

interface SuccessScreenProps {
  service: Service;
  stylist: Profile;
  bookingTime: string;
  bookingRef: string;
  onBookAnother: () => void;
}

export default function SuccessScreen({
  service,
  stylist,
  bookingTime,
  bookingRef,
  onBookAnother,
}: SuccessScreenProps) {
  const formattedDate = new Date(bookingTime).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = new Date(bookingTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-6">
      <style>{`
        @keyframes scaleInSpring {
          0% { opacity: 0; transform: scale(0) rotate(-180deg); }
          70% { transform: scale(1.1) rotate(10deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .success-scale {
          animation: scaleInSpring 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .success-fade {
          opacity: 0;
          animation: fadeInUp 0.5s ease both;
        }
      `}</style>

      {/* Gold Checkmark */}
      <div className="success-scale">
        <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14 text-[#D4AF37]" />
        </div>
      </div>

      <div className="text-center success-fade" style={{ animationDelay: '0.3s' }}>
        <h2 className="font-display text-2xl font-bold text-white">Booking Confirmed</h2>
        <p className="text-[#A3A3A3] text-xs mt-2">Your appointment has been scheduled</p>
      </div>

      <div className="glass-card-gold rounded-2xl p-4 text-center w-full success-fade" style={{ animationDelay: '0.5s' }}>
        <p className="text-[#A3A3A3] text-[10px] tracking-widest uppercase">Booking Reference</p>
        <p className="text-[#D4AF37] text-xl font-bold tracking-wider mt-1">{bookingRef}</p>
      </div>

      <div className="glass-card rounded-2xl p-4 w-full space-y-3 success-fade" style={{ animationDelay: '0.7s' }}>
        <h3 className="text-white text-sm font-semibold">Appointment Details</h3>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-[#A3A3A3] text-[10px]">Service</p>
              <p className="text-white text-xs font-medium">{service.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
              <User className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-[#A3A3A3] text-[10px]">Stylist</p>
              <p className="text-white text-xs font-medium">{stylist.full_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-[#A3A3A3] text-[10px]">Date</p>
              <p className="text-white text-xs font-medium">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-[#A3A3A3] text-[10px]">Time</p>
              <p className="text-white text-xs font-medium">{formattedTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 success-fade"
        style={{ animationDelay: '0.9s' }}
      >
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-green-400 text-xs font-medium">Confirmed</span>
      </div>

      <button
        className="w-full h-14 rounded-2xl border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-semibold hover:bg-[#D4AF37]/10 active:scale-[0.98] transition-all success-fade"
        onClick={onBookAnother}
        style={{ animationDelay: '1s' }}
      >
        Book Another
      </button>
    </div>
  );
}
