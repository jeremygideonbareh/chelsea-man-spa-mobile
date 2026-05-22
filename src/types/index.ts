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

export interface AddonItem {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export const ADDONS: AddonItem[] = [
  { id: 'scalp-massage', name: 'Scalp Massage', price: 50, duration: 15 },
  { id: 'luxury-treatment', name: 'Luxury Treatment', price: 120, duration: 30 },
];

export const VAT_RATE = 0.05;

export type UserRole = 'admin' | 'staff' | 'customer';

export interface Service {
  id: string;
  name: string | null;
  description: string | null;
  price: number | null;
  duration_minutes: number | null;
  image_url: string | null;
  category: string | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: 'admin' | 'staff' | 'customer' | null;
}

export interface Customer {
  id: string;
  full_name: string | null;
  email: string | null;
}

export interface Booking {
  id: string;
  customer_id: string | null;
  service_id: string | null;
  booking_time: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | null;
  created_at: string | null;
}
