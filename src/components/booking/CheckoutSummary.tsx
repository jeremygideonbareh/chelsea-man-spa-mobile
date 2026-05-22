import { useState } from 'react';
import { Check, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Service, Profile } from '@/types';
import { ADDONS, VAT_RATE } from '@/types';
import { useCustomer } from '@/hooks/useServices';

interface CheckoutSummaryProps {
  service: Service;
  stylist: Profile;
  bookingTime: string;
  addons: { scalpMassage: boolean; luxuryTreatment: boolean };
  onToggleAddon: (key: 'scalpMassage' | 'luxuryTreatment') => void;
  onConfirm: () => void;
  userId: string;
}

export default function CheckoutSummary({
  service,
  stylist,
  bookingTime,
  addons,
  onToggleAddon,
  onConfirm,
  userId,
}: CheckoutSummaryProps) {
  const { customer } = useCustomer(userId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const servicePrice = service.price || 0;
  const addonTotal = ADDONS.reduce((sum, addon) => {
    if (addon.id === 'scalp-massage' && addons.scalpMassage) return sum + addon.price;
    if (addon.id === 'luxury-treatment' && addons.luxuryTreatment) return sum + addon.price;
    return sum;
  }, 0);
  const subtotal = servicePrice + addonTotal;
  const vat = subtotal * VAT_RATE;
  const grandTotal = subtotal + vat;

  const formattedDate = new Date(bookingTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = new Date(bookingTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirm();
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-5">
      {/* Booking Summary Card */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <h3 className="text-white text-sm font-semibold">Booking Summary</h3>

        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-[#A3A3A3] text-xs">Service</span>
            <span className="text-white text-xs font-medium">{service.name}</span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex justify-between items-center">
            <span className="text-[#A3A3A3] text-xs">Stylist</span>
            <span className="text-white text-xs font-medium">{stylist.full_name}</span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex justify-between items-center">
            <span className="text-[#A3A3A3] text-xs">Date & Time</span>
            <span className="text-white text-xs font-medium">{formattedDate}, {formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      {customer && (
        <div className="glass-card rounded-2xl p-4 space-y-2">
          <h3 className="text-white text-sm font-semibold">Your Details</h3>
          <div className="flex justify-between items-center">
            <span className="text-[#A3A3A3] text-xs">Name</span>
            <span className="text-white text-xs font-medium">{customer.full_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#A3A3A3] text-xs">Email</span>
            <span className="text-white text-xs font-medium">{customer.email}</span>
          </div>
        </div>
      )}

      {/* Add-ons */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <h3 className="text-white text-sm font-semibold">Enhance Your Visit</h3>
        <p className="text-[#A3A3A3] text-[10px]">Optional add-ons to elevate your experience</p>

        {ADDONS.map((addon) => {
          const isActive = addon.id === 'scalp-massage' ? addons.scalpMassage : addons.luxuryTreatment;
          const toggleKey = addon.id === 'scalp-massage' ? 'scalpMassage' : 'luxuryTreatment';
          return (
            <button
              key={addon.id}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all active:scale-[0.98] ${
                isActive ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30' : 'bg-[#171717] border border-white/5'
              }`}
              onClick={() => onToggleAddon(toggleKey as 'scalpMassage' | 'luxuryTreatment')}
            >
              <div className="text-left">
                <span className={`text-xs font-medium ${isActive ? 'text-[#D4AF37]' : 'text-white'}`}>
                  {addon.name}
                </span>
                <p className="text-[#A3A3A3] text-[10px]">+{addon.duration} min</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${isActive ? 'text-[#D4AF37]' : 'text-white'}`}>
                  +AED {addon.price}
                </span>
                {isActive ? (
                  <ToggleRight className="w-5 h-5 text-[#D4AF37]" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-[#525252]" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Price Breakdown */}
      <div className="glass-card rounded-2xl p-4 space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-[#A3A3A3] text-xs">Service</span>
          <span className="text-white text-xs">AED {servicePrice.toFixed(2)}</span>
        </div>
        {addonTotal > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-[#A3A3A3] text-xs">Add-ons</span>
            <span className="text-[#D4AF37] text-xs">AED {addonTotal.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-[#A3A3A3] text-xs">Subtotal</span>
          <span className="text-white text-xs">AED {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#A3A3A3] text-xs">VAT (5%)</span>
          <span className="text-white text-xs">AED {vat.toFixed(2)}</span>
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex justify-between items-center">
          <span className="text-white text-sm font-semibold">Grand Total</span>
          <span className="text-[#D4AF37] text-lg font-bold">AED {grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        className="gold-btn w-full h-14 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        onClick={handleConfirm}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            Confirm Booking
          </>
        )}
      </button>
    </div>
  );
}
