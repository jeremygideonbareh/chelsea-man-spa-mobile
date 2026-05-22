import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/types';

interface StylistWithAvatar {
  id: string;
  full_name: string | null;
  role: string | null;
  avatar_url: string;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'svc-1',
    name: 'Classic Haircut',
    price: 95,
    duration_minutes: 45,
    category: 'Hair',
    image_url: 'images/service-haircut.jpg',
    description: 'Premium haircut tailored to your style.'
  },
  {
    id: 'svc-2',
    name: 'Beard Grooming & Trim',
    price: 65,
    duration_minutes: 30,
    category: 'Beard',
    image_url: 'images/service-beard.jpg',
    description: 'Beard shaping, line-up, and beard oil treatment.'
  },
  {
    id: 'svc-3',
    name: 'Signature Facial Spa',
    price: 150,
    duration_minutes: 60,
    category: 'Spa',
    image_url: 'images/service-facial.jpg',
    description: 'Deep cleansing and skin rejuvenation facial.'
  },
  {
    id: 'svc-4',
    name: 'Royal Hot Stone Massage',
    price: 220,
    duration_minutes: 90,
    category: 'Spa',
    image_url: 'images/service-massage.jpg',
    description: 'Ultimate relaxation massage using heated volcanic stones.'
  },
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
  if (n.includes('beard') || n.includes('shave') || n.includes('mustache') || n.includes('trim')) {
    return 'Beard';
  }
  if (n.includes('spa') || n.includes('facial') || n.includes('massage') || n.includes('scrub') || n.includes('towel') || n.includes('stone') || n.includes('wash')) {
    return 'Spa';
  }
  return 'Hair';
}

function getServiceImageUrl(name: string, category: string): string {
  const cat = category.toLowerCase();
  if (cat === 'beard') {
    return 'images/service-beard.jpg';
  }
  if (cat === 'spa') {
    if (name.toLowerCase().includes('massage')) {
      return 'images/service-massage.jpg';
    }
    return 'images/service-facial.jpg';
  }
  return 'images/service-haircut.jpg';
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
