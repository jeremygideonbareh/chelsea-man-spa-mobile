import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import ServiceSelection from './ServiceSelection';
import StylistSelection from './StylistSelection';
import DateTimeSelection from './DateTimeSelection';
import CheckoutSummary from './CheckoutSummary';
import SuccessScreen from './SuccessScreen';

interface BookingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName?: string;
}

const stepTitles: Record<number, string> = {
  1: 'Select Service',
  2: 'Choose Stylist',
  3: 'Date & Time',
  4: 'Checkout',
  5: 'Confirmed',
};

export default function BookingSheet({ isOpen, onClose, userId, userName = 'Gentleman' }: BookingSheetProps) {
  const flow = useBookingFlow();
  const [bookingRef, setBookingRef] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    flow.resetFlow();
    setBookingRef('');
    setError(null);
    onClose();
  }, [flow, onClose]);

  const handleConfirmBooking = useCallback(async () => {
    setError(null);
    try {
      let realCustomerId = userId;

      // If it's a mock user, create/find a real customer record for foreign keys
      if (userId.startsWith('mock-')) {
        try {
          const { data: custData } = await (supabase as any)
            .from('customers')
            .select('id')
            .eq('full_name', userName)
            .limit(1);

          if (custData && custData[0]) {
            realCustomerId = custData[0].id;
          } else {
            const { data: newCust } = await (supabase as any)
              .from('customers')
              .insert([{
                full_name: userName,
                email: `${userName.toLowerCase().replace(/\s+/g, '.')}@example.com`
              }])
              .select('id')
              .single();
            if (newCust) realCustomerId = newCust.id;
          }
        } catch (e) {
          console.warn('Failed to resolve mock customer:', e);
        }
      }

      const payload = {
        customer_id: realCustomerId,
        service_id: flow.selectedService?.id,
        booking_time: flow.bookingTime,
        status: 'confirmed' as const,
      };

      const { data, error: insertError } = await (supabase as any)
        .from('bookings')
        .insert([payload])
        .select('id')
        .single();

      if (insertError) throw insertError;

      const result = data as { id: string } | null;
      if (!result) throw new Error('No data returned');

      const ref = `CHL-${result.id.slice(0, 8).toUpperCase()}`;
      setBookingRef(ref);
      flow.confirmBooking();
    } catch (err) {
      console.warn('Supabase booking write failed, falling back to localStorage:', err);
      const mockId = `mock-bk-${Date.now()}`;
      const ref = `CHL-MCK-${String(Date.now()).slice(-4)}`;

      const localBooking = {
        id: mockId,
        customer_id: userId,
        customer_name: userName,
        service_id: flow.selectedService?.id,
        service_name: flow.selectedService?.name || 'Unknown Service',
        stylist_name: flow.selectedStylist?.name || 'Any Stylist',
        booking_time: flow.bookingTime,
        status: 'confirmed' as const,
      };

      try {
        const localBookings = JSON.parse(localStorage.getItem('chelsea_local_bookings') || '[]');
        localBookings.push(localBooking);
        localStorage.setItem('chelsea_local_bookings', JSON.stringify(localBookings));

        setBookingRef(ref);
        flow.confirmBooking();
      } catch (storageErr) {
        setError(err instanceof Error ? err.message : 'Failed to create booking');
      }
    }
  }, [flow, userId]);

  const handleBookAnother = useCallback(() => {
    flow.resetFlow();
    setBookingRef('');
    setError(null);
  }, [flow]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes sheetSlideIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes stepSlide {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .sheet-slide-in {
          animation: sheetSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .backdrop-fade {
          animation: fadeIn 0.3s ease both;
        }
        .step-content {
          animation: stepSlide 0.3s ease both;
        }
      `}</style>

      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 backdrop-fade"
        onClick={handleClose}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[92dvh] flex flex-col sheet-slide-in shadow-2xl">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {flow.step < 5 && flow.step > 1 && (
              <button
                onClick={flow.goBack}
                className="w-8 h-8 flex items-center justify-center text-slate-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-slate-900 text-base font-semibold">
              {stepTitles[flow.step] || 'Booking'}
            </h2>
          </div>
          {flow.step < 5 && (
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {flow.step < 5 && (
          <div className="px-5 pb-3">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    s <= flow.step ? 'bg-amber-500' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 step-content">
              <p className="text-red-600 text-xs text-center">{error}</p>
            </div>
          )}

          {flow.step === 1 && (
            <div className="step-content">
              <ServiceSelection onSelect={flow.selectService} />
            </div>
          )}

          {flow.step === 2 && flow.selectedService && (
            <div className="step-content">
              <StylistSelection onSelect={flow.selectStylist} />
            </div>
          )}

          {flow.step === 3 && (
            <div className="step-content">
              <DateTimeSelection onSelect={flow.selectDateTime} />
            </div>
          )}

          {flow.step === 4 && flow.selectedService && flow.selectedStylist && flow.bookingTime && (
            <div className="step-content">
              <CheckoutSummary
                service={flow.selectedService}
                stylist={flow.selectedStylist}
                bookingTime={flow.bookingTime}
                addons={flow.addons}
                onToggleAddon={flow.toggleAddon}
                onConfirm={handleConfirmBooking}
                userId={userId}
              />
            </div>
          )}

          {flow.step === 5 && flow.selectedService && flow.selectedStylist && flow.bookingTime && (
            <div className="step-content">
              <SuccessScreen
                service={flow.selectedService}
                stylist={flow.selectedStylist}
                bookingTime={flow.bookingTime}
                bookingRef={bookingRef}
                onBookAnother={handleBookAnother}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
