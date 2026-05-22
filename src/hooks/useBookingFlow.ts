import { useState, useCallback } from 'react';
import type { Service, Profile } from '@/types';
import { ADDONS, VAT_RATE } from '@/types';

export interface BookingFlowState {
  step: number;
  selectedService: Service | null;
  selectedStylist: Profile | null;
  bookingTime: string | null;
  addons: {
    scalpMassage: boolean;
    luxuryTreatment: boolean;
  };
}

const initialState: BookingFlowState = {
  step: 1,
  selectedService: null,
  selectedStylist: null,
  bookingTime: null,
  addons: {
    scalpMassage: false,
    luxuryTreatment: false,
  },
};

export function useBookingFlow() {
  const [state, setState] = useState<BookingFlowState>(initialState);

  const selectService = useCallback((service: Service) => {
    setState(prev => ({ ...prev, selectedService: service, step: 2 }));
  }, []);

  const selectStylist = useCallback((stylist: Profile) => {
    setState(prev => ({ ...prev, selectedStylist: stylist, step: 3 }));
  }, []);

  const selectDateTime = useCallback((isoTime: string) => {
    setState(prev => ({ ...prev, bookingTime: isoTime, step: 4 }));
  }, []);

  const toggleAddon = useCallback((addonKey: 'scalpMassage' | 'luxuryTreatment') => {
    setState(prev => ({
      ...prev,
      addons: {
        ...prev.addons,
        [addonKey]: !prev.addons[addonKey],
      },
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }, []);

  const resetFlow = useCallback(() => {
    setState(initialState);
  }, []);

  const confirmBooking = useCallback(() => {
    setState(prev => ({ ...prev, step: 5 }));
  }, []);

  // Calculations
  const calculateTotals = useCallback(() => {
    const servicePrice = state.selectedService?.price || 0;
    const addonTotal = ADDONS.reduce((sum, addon) => {
      if (addon.id === 'scalp-massage' && state.addons.scalpMassage) return sum + addon.price;
      if (addon.id === 'luxury-treatment' && state.addons.luxuryTreatment) return sum + addon.price;
      return sum;
    }, 0);
    const subtotal = servicePrice + addonTotal;
    const vat = subtotal * VAT_RATE;
    const grandTotal = subtotal + vat;

    return { subtotal, vat, grandTotal, addonTotal };
  }, [state.selectedService, state.addons]);

  return {
    ...state,
    selectService,
    selectStylist,
    selectDateTime,
    toggleAddon,
    goToStep,
    goBack,
    resetFlow,
    confirmBooking,
    calculateTotals,
  };
}
