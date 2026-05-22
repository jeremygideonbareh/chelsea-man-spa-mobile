import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Booking {
  id: string;
  customer_name: string;
  service_name: string;
  stylist_name: string;
  booking_time: string;
  status: string;
}

interface Option {
  id: string;
  name: string;
}

interface FormData {
  service_id: string;
  stylist_id: string;
  customer_name: string;
  start_time: string;
}

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'mock-bk-1',
    customer_name: 'John Smith',
    service_name: 'Classic Haircut',
    stylist_name: 'Any Stylist',
    booking_time: new Date().toISOString(),
    status: 'confirmed',
  },
  {
    id: 'mock-bk-2',
    customer_name: 'Robert Davis',
    service_name: 'Beard Grooming & Trim',
    stylist_name: 'Any Stylist',
    booking_time: new Date(Date.now() + 86400000).toISOString(),
    status: 'pending',
  },
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Option[]>([]);
  const [stylists, setStylists] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>({
    service_id: '',
    stylist_id: '',
    customer_name: '',
    start_time: '',
  });

  const loadServices = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('services')
        .select('id, name')
        .order('name', { ascending: true });
      if (data) {
        setServices(data);
      } else {
        const localSvcs = JSON.parse(localStorage.getItem('chelsea_local_services') || '[]');
        if (localSvcs.length > 0) {
          setServices(localSvcs);
        } else {
          setServices([
            { id: 'svc-1', name: 'Classic Haircut' },
            { id: 'svc-2', name: 'Beard Grooming & Trim' },
            { id: 'svc-3', name: 'Signature Facial Spa' },
            { id: 'svc-4', name: 'Royal Hot Stone Massage' },
          ]);
        }
      }
    } catch {
      // Fallback
      setServices([
        { id: 'svc-1', name: 'Classic Haircut' },
        { id: 'svc-2', name: 'Beard Grooming & Trim' },
      ]);
    }
  }, []);

  const loadStylists = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('stylists')
        .select('id, name')
        .eq('is_active', true)
        .order('name', { ascending: true });
      if (data) {
        setStylists(data);
      } else {
        setStylists([
          { id: 'st-1', name: 'Alex' },
          { id: 'st-2', name: 'Marco' },
        ]);
      }
    } catch {
      setStylists([
        { id: 'st-1', name: 'Alex' },
        { id: 'st-2', name: 'Marco' },
      ]);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    try {
      const bookingsPromise = supabase
        .from('bookings')
        .select('id, booking_time, status, customer_id, service_id, services(name), customers(full_name)')
        .order('booking_time', { ascending: false });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Bookings fetch timed out')), 2500)
      );

      const raceResult = await Promise.race([bookingsPromise, timeoutPromise]);
      const data = raceResult?.data;
      const dbError = raceResult?.error;
      if (dbError) throw dbError;

      const dbBookings = (data || []).map((b: any) => ({
        id: b.id,
        customer_name: b.customers?.full_name || 'Gentleman Customer',
        service_name: b.services?.name || 'Unknown Service',
        stylist_name: 'Any Stylist',
        booking_time: b.booking_time || new Date().toISOString(),
        status: b.status || 'confirmed',
      }));

      // Merge with localStorage custom bookings
      const localCustom = JSON.parse(localStorage.getItem('chelsea_local_bookings') || '[]');
      const combined = [...dbBookings];
      localCustom.forEach((customBk: any) => {
        if (!combined.some(b => b.id === customBk.id)) {
          combined.push(customBk);
        }
      });

      setBookings(combined);
    } catch (e) {
      console.warn('Failed to load bookings from DB, using localStorage:', e);
      const localBookings = JSON.parse(localStorage.getItem('chelsea_local_bookings') || '[]');
      if (localBookings.length === 0) {
        localStorage.setItem('chelsea_local_bookings', JSON.stringify(DEFAULT_BOOKINGS));
        setBookings(DEFAULT_BOOKINGS);
      } else {
        setBookings(localBookings);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const defaultTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setForm((f) => ({ ...f, start_time: defaultTime }));

    Promise.all([loadServices(), loadStylists(), loadBookings()]);
  }, [loadServices, loadStylists, loadBookings]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.service_id || !form.customer_name.trim() || !form.start_time) return;

    const selectedService = services.find(s => s.id === form.service_id);
    const serviceName = selectedService ? selectedService.name : 'Unknown Service';

    const localBooking: Booking = {
      id: `mock-bk-${Date.now()}`,
      customer_name: form.customer_name.trim(),
      service_name: serviceName,
      stylist_name: 'Any Stylist',
      booking_time: new Date(form.start_time).toISOString(),
      status: 'confirmed',
    };

    try {
      // 1. Try to find customer by name
      const { data: customerData } = await supabase
        .from('customers')
        .select('id')
        .eq('full_name', form.customer_name.trim())
        .limit(1);

      let customerId = customerData?.[0]?.id;

      if (!customerId) {
        // Try creating customer profile
        const { data: newCust, error: custErr } = await supabase
          .from('customers')
          .insert([{ 
            full_name: form.customer_name.trim(), 
            email: `${form.customer_name.toLowerCase().replace(/\s+/g, '.')}@example.com` 
          }])
          .select();
        
        if (custErr) throw custErr;
        customerId = newCust?.[0]?.id;
      }

      if (!customerId) throw new Error('Could not resolve customer ID');

      // 2. Try inserting booking in Supabase
      const { error } = await supabase.from('bookings').insert([
        {
          service_id: form.service_id,
          customer_id: customerId,
          booking_time: new Date(form.start_time).toISOString(),
          status: 'confirmed',
        },
      ]);

      if (error) throw error;
    } catch (err) {
      console.warn('Supabase booking write failed, falling back to localStorage:', err);
      const localBookings = JSON.parse(localStorage.getItem('chelsea_local_bookings') || '[]');
      localBookings.push(localBooking);
      localStorage.setItem('chelsea_local_bookings', JSON.stringify(localBookings));
    }

    setForm((f) => ({ ...f, service_id: '', stylist_id: '', customer_name: '' }));
    await loadBookings();
  }

  async function handleDelete(id: string) {
    try {
      if (id.startsWith('mock-bk-')) {
        throw new Error('Local mock booking delete');
      }
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase booking delete failed, falling back to localStorage:', err);
    }

    const localBookings = JSON.parse(localStorage.getItem('chelsea_local_bookings') || '[]');
    const filtered = localBookings.filter((b: any) => b.id !== id);
    localStorage.setItem('chelsea_local_bookings', JSON.stringify(filtered));

    await loadBookings();
  }

  function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Bookings Manager</h1>

      {/* Create Booking Form */}
      <div className="bg-[#0F0F0F] border border-white/5 rounded-xl p-4 lg:p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Create Booking</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-[#A3A3A3] mb-1.5">Service</label>
            <select
              value={form.service_id}
              onChange={(e) => setForm({ ...form, service_id: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#A3A3A3] mb-1.5">Stylist</label>
            <select
              value={form.stylist_id}
              onChange={(e) => setForm({ ...form, stylist_id: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            >
              <option value="any">Any Stylist</option>
              {stylists.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#A3A3A3] mb-1.5">Customer Name</label>
            <input
              value={form.customer_name}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#A3A3A3] mb-1.5">Appointment Time</label>
            <input
              type="datetime-local"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors [color-scheme:dark]"
              required
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:opacity-85 transition-opacity"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#0F0F0F] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#D4AF37] border-b border-white/5 bg-[#1A1814]">
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Customer</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Service</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Stylist</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Time</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#6B655A] italic">No bookings found.</td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="border-b border-white/5">
                    <td className="p-4 text-white">{b.customer_name}</td>
                    <td className="p-4 text-[#A3A3A3]">{b.service_name}</td>
                    <td className="p-4 text-[#A3A3A3]">{b.stylist_name}</td>
                    <td className="p-4 text-[#A3A3A3]">{formatDateTime(b.booking_time)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#3D1A1A] text-[#E87A7A] text-xs font-semibold hover:bg-red-500/20 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
