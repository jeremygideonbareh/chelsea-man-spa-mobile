import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/types';

interface StylistWithAvatar {
  id: string;
  full_name: string | null;
  role: string | null;
  avatar_url: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  'Haircut & Styling': 'images/service-haircut.jpg',
  'Hair Color & Treatments': 'images/service-haircut.jpg',
  'Shaving & Beard Care': 'images/service-beard.jpg',
  'Nail Care & Grooming': 'images/service-facial.jpg',
  'Skincare & Massages': 'images/service-facial.jpg',
  'Waxing & Hair Removal': 'images/service-massage.jpg',
};

const DEFAULT_SERVICES: Service[] = [
  { id: 'svc-hc1', name: 'Hair Cut & Beard', price: 190, duration_minutes: 60, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Complete haircut with beard trim and shaping.' },
  { id: 'svc-hc2', name: "Men's Hair Cut", price: 130, duration_minutes: 30, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Precision haircut tailored to your style.' },
  { id: 'svc-hc3', name: 'Skin Fade (Perfect Skin Fade Hair Cut)', price: 160, duration_minutes: 30, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Perfect skin fade haircut for a clean look.' },
  { id: 'svc-hc4', name: 'Buzz Cut', price: 110, duration_minutes: 20, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Quick and clean buzz cut.' },
  { id: 'svc-hc5', name: 'Kids Hair Cut (Juniors)', price: 110, duration_minutes: 30, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Haircut for juniors in a comfortable setting.' },
  { id: 'svc-hc6', name: 'Line Up & Clean The Neck (From the back)', price: 55, duration_minutes: 15, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Neat line up and neck clean-up.' },
  { id: 'svc-hc7', name: 'Hair Wash and Blow Dry', price: 80, duration_minutes: 15, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Refreshing hair wash with blow dry finish.' },
  { id: 'svc-col1', name: 'Shades of Colors (Zero Ammonia)', price: 160, duration_minutes: 15, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Ammonia-free color shades for a natural look.' },
  { id: 'svc-col2', name: 'Hair Color for Men', price: 160, duration_minutes: 40, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Professional hair color application for men.' },
  { id: 'svc-col3', name: 'Silver Hair Color', price: 600, duration_minutes: 60, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Premium silver hair color treatment.' },
  { id: 'svc-col4', name: 'Highlights (Short Hair)', price: 360, duration_minutes: 60, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Professional highlights for short hair.' },
  { id: 'svc-col5', name: 'Highlights (Long Hair)', price: 485, duration_minutes: 60, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Professional highlights for long hair.' },
  { id: 'svc-col6', name: 'Beard Color / Dye', price: 80, duration_minutes: 15, category: 'Hair Color & Treatments', image_url: 'images/service-beard.jpg', description: 'Beard color and dye application.' },
  { id: 'svc-col7', name: 'Mask Hair Treatment (Deep conditioning)', price: 150, duration_minutes: 15, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Deep conditioning mask treatment for healthy hair.' },
  { id: 'svc-col8', name: 'Keratin Treatment', price: 550, duration_minutes: 60, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Smoothing keratin treatment for frizz-free hair.' },
  { id: 'svc-col9', name: 'Collagen Hair Treatment', price: 600, duration_minutes: 60, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Collagen hair restoration treatment.' },
  { id: 'svc-sv1', name: 'Beard Style (Trim/Shaping)', price: 80, duration_minutes: 30, category: 'Shaving & Beard Care', image_url: 'images/service-beard.jpg', description: 'Beard trim and shaping for a sharp look.' },
  { id: 'svc-sv2', name: 'Royal Shave Spa', price: 160, duration_minutes: 30, category: 'Shaving & Beard Care', image_url: 'images/service-beard.jpg', description: 'Luxurious straight razor shave with hot towels.' },
  { id: 'svc-sv3', name: 'Shave (Razor / Straight Razor)', price: 65, duration_minutes: 15, category: 'Shaving & Beard Care', image_url: 'images/service-beard.jpg', description: 'Clean shave with razor or straight razor.' },
  { id: 'svc-sv4', name: 'Express Shave Machine', price: 60, duration_minutes: 15, category: 'Shaving & Beard Care', image_url: 'images/service-beard.jpg', description: 'Quick and precise machine shave.' },
  { id: 'svc-nl1', name: 'Manicure', price: 90, duration_minutes: 30, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Professional manicure for well-groomed hands.' },
  { id: 'svc-nl2', name: 'Pedicure', price: 120, duration_minutes: 45, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Professional pedicure for refreshed feet.' },
  { id: 'svc-nl3', name: 'Manicure & Pedicure', price: 190, duration_minutes: 60, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Complete hand and foot grooming package.' },
  { id: 'svc-nl4', name: 'Spa Manicure', price: 150, duration_minutes: 60, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Luxury spa manicure experience.' },
  { id: 'svc-nl5', name: 'Spa Pedicure', price: 180, duration_minutes: 60, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Luxury spa pedicure experience.' },
  { id: 'svc-nl6', name: 'Nails Cut & Shape', price: 60, duration_minutes: 60, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Nail cutting and shaping service.' },
  { id: 'svc-nl7', name: 'Paraffin Wax Treatments (Feet and Hands)', price: 200, duration_minutes: 60, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Paraffin wax treatment for soft hands and feet.' },
  { id: 'svc-sk1', name: 'Soothing Facial', price: 250, duration_minutes: 60, category: 'Skincare & Massages', image_url: 'images/service-facial.jpg', description: 'Relaxing and rejuvenating facial treatment.' },
  { id: 'svc-sk2', name: 'Facial Deep Cleansing Skin', price: 400, duration_minutes: 60, category: 'Skincare & Massages', image_url: 'images/service-facial.jpg', description: 'Deep cleansing facial for clear, healthy skin.' },
  { id: 'svc-sk3', name: 'Facial for Sensitive Skin', price: 350, duration_minutes: 60, category: 'Skincare & Massages', image_url: 'images/service-facial.jpg', description: 'Gentle facial treatment for sensitive skin.' },
  { id: 'svc-sk4', name: 'Face Massage', price: 50, duration_minutes: 15, category: 'Skincare & Massages', image_url: 'images/service-facial.jpg', description: 'Quick face massage for relaxation.' },
  { id: 'svc-wx1', name: 'Underarms Waxing', price: 60, duration_minutes: 60, category: 'Waxing & Hair Removal', image_url: 'images/service-massage.jpg', description: 'Underarm waxing for smooth skin.' },
  { id: 'svc-wx2', name: 'Full Arms/Legs Wax Hair Removal', price: 150, duration_minutes: 60, category: 'Waxing & Hair Removal', image_url: 'images/service-massage.jpg', description: 'Full arm or leg waxing service.' },
  { id: 'svc-wx3', name: 'Full Chest Wax Hair Removal', price: 100, duration_minutes: 60, category: 'Waxing & Hair Removal', image_url: 'images/service-massage.jpg', description: 'Full chest waxing for a smooth look.' },
  { id: 'svc-wx4', name: 'Full Back Wax Hair Removal', price: 150, duration_minutes: 60, category: 'Waxing & Hair Removal', image_url: 'images/service-massage.jpg', description: 'Full back waxing service.' },
];

const DEFAULT_STYLISTS = [
  { id: 'st-1', name: 'Alex', role: 'Barber', is_active: true },
  { id: 'st-2', name: 'Marco', role: 'Barber', is_active: true },
  { id: 'st-3', name: 'Giovanni', role: 'Stylist', is_active: true },
  { id: 'st-4', name: 'Ricardo', role: 'Massage Therapist', is_active: true },
];

function getLocalStorageArray<T>(key: string, defaultVal: T[]): T[] {
  try {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  } catch (e) {
    console.warn(`Failed to parse localStorage key "${key}":`, e);
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
}

function getServiceCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('beard') || n.includes('shave') || n.includes('shaver') || n.includes('razor')) {
    return 'Shaving & Beard Care';
  }
  if (n.includes('color') || n.includes('dye') || n.includes('highlight') || n.includes('keratin') || n.includes('collagen') || n.includes('treatment') || n.includes('mask')) {
    return 'Hair Color & Treatments';
  }
  if (n.includes('manicure') || n.includes('pedicure') || n.includes('nail') || n.includes('paraffin') || n.includes('wax')) {
    return 'Nail Care & Grooming';
  }
  if (n.includes('facial') || n.includes('massage') || n.includes('skincare')) {
    return 'Skincare & Massages';
  }
  if (n.includes('waxing') || n.includes('hair removal')) {
    return 'Waxing & Hair Removal';
  }
  return 'Haircut & Styling';
}

function getServiceImageUrl(name: string, category: string): string {
  return CATEGORY_IMAGES[category] || 'images/service-haircut.jpg';
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const servicesPromise = supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Services fetch timed out')), 2500)
      );

      const raceResult = await Promise.race([servicesPromise, timeoutPromise]);
      const data = raceResult?.data;
      const dbError = raceResult?.error;
      if (dbError) throw dbError;

      const dbServices = data || [];
      const mappedDbServices = dbServices.map((svc: any) => {
        const category = svc.category || getServiceCategory(svc.name || '');
        const image_url = svc.image_url || getServiceImageUrl(svc.name || '', category);
        return {
          ...svc,
          category,
          image_url
        };
      });

      const localCustom = getLocalStorageArray('chelsea_local_services', DEFAULT_SERVICES);
      const mappedLocalCustom = localCustom.map((svc: any) => {
        const category = svc.category || getServiceCategory(svc.name || '');
        const image_url = svc.image_url || getServiceImageUrl(svc.name || '', category);
        return {
          ...svc,
          category,
          image_url
        };
      });

      // Merge: local customized versions take precedence (override database categories/descriptions/etc.)
      const combined = mappedDbServices.map((dbSvc) => {
        const localVersion = mappedLocalCustom.find((s: any) => s.id === dbSvc.id);
        if (localVersion) {
          return {
            ...dbSvc,
            ...localVersion,
          };
        }
        return dbSvc;
      });

      mappedLocalCustom.forEach((customSvc: any) => {
        if (!combined.some(s => s.id === customSvc.id)) {
          combined.push(customSvc);
        }
      });

      setServices(combined);
    } catch (err) {
      console.warn('Failed to fetch services from DB, using localStorage:', err);
      const localServices = getLocalStorageArray('chelsea_local_services', DEFAULT_SERVICES);
      const mappedLocal = localServices.map((svc: any) => {
        const category = svc.category || getServiceCategory(svc.name || '');
        const image_url = svc.image_url || getServiceImageUrl(svc.name || '', category);
        return {
          ...svc,
          category,
          image_url
        };
      });
      setServices(mappedLocal);
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, refetch: fetchServices };
}

export function useStylists() {
  const [stylists, setStylists] = useState<StylistWithAvatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStylists = useCallback(async () => {
    try {
      setLoading(true);
      const fetchPromise = supabase
        .from('stylists')
        .select('id, name, role, is_active')
        .order('name', { ascending: true });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Stylists fetch timed out')), 2500)
      );

      const raceResult = await Promise.race([fetchPromise, timeoutPromise]);
      const data = raceResult?.data;
      const supabaseError = raceResult?.error;

      if (supabaseError) throw supabaseError;

      const results = (data as Array<{ id: string; name: string | null; role: string | null; is_active: boolean }> | null) || [];
      
      const localCustom = getLocalStorageArray('chelsea_local_stylists', DEFAULT_STYLISTS);

      // Merge: DB active state and name/role. Local custom edits override.
      const combined = results.map(r => {
        const localVersion = localCustom.find((c: any) => c.id === r.id);
        const baseSty = {
          id: r.id,
          name: r.name || 'Staff',
          role: r.role || 'Stylist',
          is_active: r.is_active !== false,
        };
        if (localVersion) {
          return {
            ...baseSty,
            ...localVersion,
          };
        }
        return baseSty;
      });

      localCustom.forEach((c: any) => {
        if (!combined.some(s => s.id === c.id)) {
          combined.push({
            id: c.id,
            name: c.name || 'Staff',
            role: c.role || 'Stylist',
            is_active: c.is_active !== false,
          });
        }
      });

      const activeStylists = combined.filter(s => s.is_active !== false);
      const stylistsWithAvatars: StylistWithAvatar[] = activeStylists.map((stylist, index) => ({
        id: stylist.id,
        full_name: stylist.name,
        role: stylist.role,
        avatar_url: `images/stylist-${(index % 4) + 1}.jpg`,
      }));

      setStylists(stylistsWithAvatars);
    } catch (err) {
      console.warn('Failed to fetch stylists from DB, using localStorage:', err);
      const localStylists = getLocalStorageArray('chelsea_local_stylists', DEFAULT_STYLISTS);

      const activeStylists = localStylists.filter((s: any) => s.is_active !== false);
      const stylistsWithAvatars: StylistWithAvatar[] = activeStylists.map((stylist: any, index: number) => ({
        id: stylist.id,
        full_name: stylist.name,
        role: stylist.role || 'Barber',
        avatar_url: `images/stylist-${(index % 4) + 1}.jpg`,
      }));

      setStylists(stylistsWithAvatars);
      setError(err instanceof Error ? err.message : 'Failed to fetch stylists');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStylists();
  }, [fetchStylists]);

  return { stylists, loading, error, refetch: fetchStylists };
}

export function useCustomer(userId: string | undefined) {
  const [customer, setCustomer] = useState<{ full_name: string | null; email: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchCustomer = async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('full_name, email')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setCustomer(data as { full_name: string | null; email: string | null } | null);
      } catch {
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [userId]);

  return { customer, loading };
}

interface BookingRow {
  id: string;
  service_name: string | null;
  stylist_name: string | null;
  booking_time: string | null;
  status: string | null;
}

export function useBookings(userId: string | undefined) {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchPromise = supabase
        .from('bookings')
        .select('id, booking_time, status, customer_id, service_id')
        .eq('customer_id', userId)
        .order('booking_time', { ascending: true });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Bookings fetch timed out')), 2500)
      );

      const raceResult = await Promise.race([fetchPromise, timeoutPromise]);
      const data = raceResult?.data;
      const error = raceResult?.error;

      if (error) throw error;

      const bookingsData = (data as Array<{ id: string; booking_time: string | null; status: string | null; customer_id: string | null; service_id: string | null }> | null) || [];
      const serviceIds = bookingsData.map(b => b.service_id).filter((id): id is string => !!id);
      
      let serviceMap: Record<string, string> = {};
      if (serviceIds.length > 0) {
        const { data: servicesData } = await supabase
          .from('services')
          .select('id, name')
          .in('id', serviceIds);
        
        const servicesArr = (servicesData as Array<{ id: string; name: string | null }> | null) || [];
        servicesArr.forEach((s) => {
          serviceMap[s.id] = s.name || 'Unknown Service';
        });
      }

      const formatted: BookingRow[] = bookingsData.map((b) => ({
        id: b.id,
        service_name: b.service_id ? serviceMap[b.service_id] || 'Unknown Service' : 'Unknown Service',
        stylist_name: 'Any Stylist',
        booking_time: b.booking_time,
        status: b.status,
      }));

      // Merge with localStorage bookings for this user
      const localCustom = getLocalStorageArray('chelsea_local_bookings', []);
      const userLocalBookings = localCustom
        .filter((b: any) => b.customer_id === userId || !b.customer_id)
        .map((b: any) => ({
          id: b.id,
          service_name: b.service_name || 'Unknown Service',
          stylist_name: b.stylist_name || 'Any Stylist',
          booking_time: b.booking_time,
          status: b.status || 'confirmed',
        }));

      const combined = [...formatted];
      userLocalBookings.forEach((userBk: any) => {
        if (!combined.some(b => b.id === userBk.id)) {
          combined.push(userBk);
        }
      });

      setBookings(combined);
    } catch (err) {
      console.warn('Failed to fetch bookings from DB, using localStorage fallback:', err);
      const localCustom = getLocalStorageArray('chelsea_local_bookings', []);
      const userLocalBookings = localCustom
        .filter((b: any) => b.customer_id === userId || !b.customer_id)
        .map((b: any) => ({
          id: b.id,
          service_name: b.service_name || 'Unknown Service',
          stylist_name: b.stylist_name || 'Any Stylist',
          booking_time: b.booking_time,
          status: b.status || 'confirmed',
        }));
      setBookings(userLocalBookings);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, refetch: fetchBookings };
}
