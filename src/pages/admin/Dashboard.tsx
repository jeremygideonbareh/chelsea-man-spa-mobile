import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '@/lib/supabase';
import { Scissors, Users, CalendarCheck, ArrowRight, DollarSign, Star } from 'lucide-react';

interface Metrics {
  totalBookings: number;
  activeServices: number;
  activeStylists: number;
  totalRevenue: number;
  popularService: string;
}

interface TodayBooking {
  id: string;
  customer_name: string;
  booking_time: string;
  service_name: string;
  stylist_name: string;
}

const iconColors: Record<string, string> = {
  'Total Bookings': 'text-blue-600 bg-blue-50',
  'Active Services': 'text-emerald-600 bg-emerald-50',
  'Active Stylists': 'text-purple-600 bg-purple-50',
  'Total Revenue': 'text-gray-900 bg-gray-100',
  'Most Popular': 'text-amber-600 bg-amber-50',
};

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalBookings: 0,
    activeServices: 0,
    activeStylists: 0,
    totalRevenue: 0,
    popularService: '—',
  });
  const [todayBookings, setTodayBookings] = useState<TodayBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      let dbBookings: any[] = [];
      try {
        const fetchPromise = supabase
          .from('bookings')
          .select('id, service_id, booking_time, status, customer_id, services(name), customers(full_name)');

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Bookings fetch timed out')), 2500)
        );

        const raceResult = await Promise.race([fetchPromise, timeoutPromise]);
        if (raceResult?.data) {
          dbBookings = raceResult.data;
        }
      } catch (e) {
        console.warn('Dashboard bookings load failed/timed out:', e);
      }

      const localBookings = JSON.parse(localStorage.getItem('chelsea_local_bookings') || '[]');
      const combinedBookings = [...dbBookings.map((b: any) => ({
        id: b.id,
        service_id: b.service_id,
        booking_time: b.booking_time || new Date().toISOString(),
        customer_name: b.customers?.full_name || 'Gentleman Customer',
        service_name: b.services?.name || 'Unknown Service',
        stylist_name: 'Any Stylist',
        status: b.status || 'confirmed'
      }))];

      localBookings.forEach((localBk: any) => {
        if (!combinedBookings.some(b => b.id === localBk.id)) {
          combinedBookings.push({
            id: localBk.id,
            service_id: localBk.service_id || 'svc-1',
            booking_time: localBk.booking_time,
            customer_name: localBk.customer_name || 'Gentleman Customer',
            service_name: localBk.service_name || 'Unknown Service',
            stylist_name: localBk.stylist_name || 'Any Stylist',
            status: localBk.status || 'confirmed'
          });
        }
      });

      let dbServices: any[] = [];
      try {
        const fetchPromise = supabase
          .from('services')
          .select('id, name, price');

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Services fetch timed out')), 2500)
        );

        const raceResult = await Promise.race([fetchPromise, timeoutPromise]);
        if (raceResult?.data) {
          dbServices = raceResult.data;
        }
      } catch (e) {
        console.warn('Dashboard services load failed/timed out:', e);
      }

      const localServices = JSON.parse(localStorage.getItem('chelsea_local_services') || '[]');
      const combinedServices = [...dbServices];
      localServices.forEach((localSvc: any) => {
        if (!combinedServices.some(s => s.id === localSvc.id)) {
          combinedServices.push(localSvc);
        }
      });

      let dbStylists: any[] = [];
      try {
        const fetchPromise = supabase
          .from('stylists')
          .select('id, name, is_active')
          .eq('is_active', true);

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Stylists fetch timed out')), 2500)
        );

        const raceResult = await Promise.race([fetchPromise, timeoutPromise]);
        if (raceResult?.data) {
          dbStylists = raceResult.data;
        }
      } catch (e) {
        console.warn('Dashboard stylists load failed/timed out:', e);
      }

      const localStylists = JSON.parse(localStorage.getItem('chelsea_local_stylists') || '[]');
      const combinedStylists = [...dbStylists];
      localStylists.forEach((localSty: any) => {
        if (localSty.is_active && !combinedStylists.some(s => s.id === localSty.id)) {
          combinedStylists.push(localSty);
        }
      });

      const totalBookings = combinedBookings.length;
      const activeServices = combinedServices.length;
      const activeStylists = combinedStylists.length;

      let totalRevenue = 0;
      const svcMap: Record<string, { name: string; price: number }> = {};
      combinedServices.forEach((s: any) => {
        svcMap[s.id] = { name: s.name, price: Number(s.price) || 0 };
      });

      const svcCounts: Record<string, number> = {};
      combinedBookings.forEach((b: any) => {
        svcCounts[b.service_id] = (svcCounts[b.service_id] || 0) + 1;
        const svc = svcMap[b.service_id];
        if (svc) {
          totalRevenue += svc.price;
        }
      });

      let popularService = '—';
      let maxCount = 0;
      for (const sid in svcCounts) {
        if (svcCounts[sid] > maxCount) {
          maxCount = svcCounts[sid];
          popularService = svcMap[sid] ? svcMap[sid].name : '—';
        }
      }

      setMetrics({ totalBookings, activeServices, activeStylists, totalRevenue, popularService });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayList = combinedBookings.filter((b: any) => {
        const time = new Date(b.booking_time);
        return time >= today && time < tomorrow;
      });

      todayList.sort((a, b) => new Date(a.booking_time).getTime() - new Date(b.booking_time).getTime());

      setTodayBookings(todayList);
      setLoading(false);
    }

    load();
  }, []);

  const metricCards = [
    { label: 'Total Bookings', value: metrics.totalBookings, icon: CalendarCheck },
    { label: 'Active Services', value: metrics.activeServices, icon: Scissors },
    { label: 'Active Stylists', value: metrics.activeStylists, icon: Users },
    { label: 'Total Revenue', value: `AED ${metrics.totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: 'Most Popular', value: metrics.popularService, icon: Star },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {metricCards.map((card) => {
          const colors = iconColors[card.label] || 'text-gray-600 bg-gray-100';
          const [textColor, bgColor] = colors.split(' ');
          return (
            <div
              key={card.label}
              className="white-card rounded-xl p-4"
            >
              <div className={`w-9 h-9 rounded-lg ${bgColor} flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${textColor}`} />
              </div>
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Today's Bookings */}
      <div className="white-card rounded-xl p-4 lg:p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bookings Today</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium text-xs uppercase tracking-wider">Customer</th>
                <th className="pb-3 font-medium text-xs uppercase tracking-wider">Service</th>
                <th className="pb-3 font-medium text-xs uppercase tracking-wider">Stylist</th>
                <th className="pb-3 font-medium text-xs uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody>
              {todayBookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="pt-6 pb-6 text-center text-gray-400 italic">
                    No bookings today.
                  </td>
                </tr>
              ) : (
                todayBookings.map((b) => {
                  const time = new Date(b.booking_time);
                  const formatted = time.toLocaleString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <tr key={b.id} className="border-b border-gray-50">
                      <td className="py-3 text-gray-900 font-medium">{b.customer_name}</td>
                      <td className="py-3 text-gray-500">{b.service_name}</td>
                      <td className="py-3 text-gray-500">{b.stylist_name}</td>
                      <td className="py-3 text-gray-500">{formatted}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage Services', desc: 'Add, edit or remove services', to: '/admin/services', icon: Scissors },
          { label: 'Manage Roster', desc: 'Manage stylist availability', to: '/admin/roster', icon: Users },
          { label: 'Manage Bookings', desc: 'View and manage bookings', to: '/admin/bookings', icon: CalendarCheck },
        ].map((action) => (
          <button
            key={action.to}
            onClick={() => navigate(action.to)}
            className="text-left white-card rounded-xl p-5 hover:shadow-md transition-all group"
          >
            <action.icon className="w-5 h-5 text-gray-700 mb-3" />
            <p className="text-gray-900 font-medium text-sm mb-1">{action.label}</p>
            <p className="text-gray-500 text-xs">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
