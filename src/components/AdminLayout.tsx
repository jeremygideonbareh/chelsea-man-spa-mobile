import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Scissors, Users, CalendarCheck, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/services', label: 'Services', icon: Scissors },
  { to: '/admin/roster', label: 'Roster', icon: Users },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { role, loading, isAuthenticated, signOut } = useAuth();

  const handleLogout = async () => {
    navigate('/', { replace: true });
    setTimeout(async () => {
      await signOut();
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'admin' && role !== 'staff') {
    return <Navigate to="/dashboard" replace />;
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-amber-50 text-amber-600'
        : 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
    }`;

  const navContent = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={linkClass}
          onClick={() => setSidebarOpen(false)}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 p-6 flex flex-col transition-transform lg:translate-x-0 lg:static lg:z-auto shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <span className="text-slate-900 font-semibold text-sm">Admin Panel</span>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-slate-900"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {navContent}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar (mobile) */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-200 px-4 py-3 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-3">
            <button
              className="text-slate-500 hover:text-slate-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-slate-900 font-semibold text-sm">Admin Panel</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-500 text-sm font-medium"
          >
            Sign Out
          </button>
        </div>

        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
