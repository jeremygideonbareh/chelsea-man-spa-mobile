import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Bell, LogOut, Settings, User,
  ChevronRight, Calendar, Clock, Scissors
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useServices, useBookings } from '@/hooks/useServices';
import BottomNav from '@/components/BottomNav';
import BookingSheet from '@/components/booking/BookingSheet';
import type { Service } from '@/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, role, loading, signOut, isAuthenticated } = useAuth();
  const { services } = useServices();
  const { bookings, refetch: refetchBookings } = useBookings(user?.id);
  const [activeTab, setActiveTab] = useState('home');
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleLogout = async () => {
    navigate('/', { replace: true });
    setTimeout(async () => {
      await signOut();
    }, 0);
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const showManagerIcon = role === 'admin' || role === 'staff';

  const openBooking = () => {
    setBookingOpen(true);
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 pb-28 relative grid-bg overflow-hidden">
      <style>{`
        @keyframes tabFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tab-content {
          animation: tabFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      <div className="tab-content relative z-10">
        {activeTab === 'home' && (
          <HomeView
            userName={user.user_metadata?.full_name || 'Gentleman'}
            services={services}
            bookings={bookings}
            onBook={openBooking}
            role={role}
          />
        )}
        {activeTab === 'appointments' && (
          <AppointmentsView
            bookings={bookings}
            onRefetch={refetchBookings}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            role={role}
            onSignOut={handleLogout}
          />
        )}
        {activeTab === 'manager' && showManagerIcon && (
          <ManagerView />
        )}
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showManagerIcon={showManagerIcon}
      />

      <BookingSheet
        isOpen={bookingOpen}
        onClose={() => {
          setBookingOpen(false);
          refetchBookings();
        }}
        userId={user.id}
        userName={user.user_metadata?.full_name || 'Gentleman'}
      />
    </div>
  );
}

/* ─── Home View ─── */
function HomeView({
  userName,
  services,
  bookings,
  onBook,
  role,
}: {
  userName: string;
  services: Service[];
  bookings: Array<{
    id: string;
    service_name: string | null;
    stylist_name: string | null;
    booking_time: string | null;
    status: string | null;
  }>;
  onBook: () => void;
  role: string | null;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 110,
        damping: 14
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="px-5 pt-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <div>
          <p className="text-slate-500 text-xs">Welcome back,</p>
          <h1 className="text-slate-900 text-xl font-bold mt-0.5">{userName}</h1>
        </div>
        <div className="flex items-center gap-2">
          {(role === 'admin' || role === 'staff') && (
            <div className="w-8 h-8 rounded-full bg-slate-900/5 flex items-center justify-center">
              <Settings className="w-4 h-4 text-slate-600" />
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center relative shadow-sm"
          >
            <Bell className="w-4 h-4 text-slate-500" />
            <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-slate-900 rounded-full" />
          </motion.button>
        </div>
      </motion.div>

      {bookings.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-slate-900 text-sm font-semibold mb-3">Upcoming Bookings</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {bookings.slice(0, 3).map((booking) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={booking.id}
                className="white-card rounded-xl p-3 min-w-[200px] border-l-2 border-l-amber-500"
              >
                <p className="text-slate-900 text-xs font-medium">{booking.service_name}</p>
                <div className="flex items-center gap-1 mt-1.5 text-slate-400 text-[10px]">
                  <Calendar className="w-3 h-3" />
                  {booking.booking_time
                    ? new Date(booking.booking_time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A'}
                  <Clock className="w-3 h-3 ml-1" />
                  {booking.booking_time
                    ? new Date(booking.booking_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })
                    : 'N/A'}
                </div>
                <span className={`inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full ${
                  booking.status === 'confirmed'
                    ? 'bg-green-50 text-green-700'
                    : booking.status === 'pending'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {booking.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full amber-btn h-14 rounded-2xl text-sm font-semibold mb-6 flex items-center justify-center gap-2"
          onClick={onBook}
        >
          <Scissors className="w-4 h-4" />
          Book New Appointment
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-slate-900 text-sm font-semibold mb-3">Our Services</h2>
        <div className="space-y-3">
          {services.map((service, index) => (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full white-card rounded-2xl overflow-hidden text-left block"
              onClick={onBook}
            >
              <div className="flex">
                <div className="w-24 h-24 flex-shrink-0 relative">
                  <img
                    src={service.image_url || 'images/service-haircut.jpg'}
                    alt={service.name || ''}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/60" />
                </div>
                <div className="flex-1 p-3.5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-slate-900 text-sm font-semibold">{service.name}</h3>
                    <p className="text-slate-500 text-[10px] mt-0.5 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-slate-400 text-[10px]">{service.duration_minutes} min</span>
                    <span className="text-slate-900 text-sm font-semibold">AED {service.price}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Appointments View ─── */
function AppointmentsView({
  bookings,
  onRefetch,
}: {
  bookings: Array<{
    id: string;
    service_name: string | null;
    stylist_name: string | null;
    booking_time: string | null;
    status: string | null;
  }>;
  onRefetch: () => void;
}) {
  useEffect(() => {
    onRefetch();
  }, [onRefetch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 110,
        damping: 14
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="px-5 pt-6"
    >
      <motion.h1 variants={itemVariants} className="text-slate-900 text-xl font-bold mb-6">My Bookings</motion.h1>

      {bookings.length === 0 ? (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-20">
          <Calendar className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 text-sm">No bookings yet</p>
          <p className="text-slate-400 text-xs mt-1">Book your first appointment</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="white-card rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-900 text-sm font-semibold">{booking.service_name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{booking.stylist_name}</p>
                </div>
                <span className={`text-[9px] px-2.5 py-1 rounded-full font-medium ${
                  booking.status === 'confirmed'
                    ? 'bg-green-50 text-green-700'
                    : booking.status === 'pending'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {booking.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-3 text-slate-400 text-xs">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {booking.booking_time
                    ? new Date(booking.booking_time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {booking.booking_time
                    ? new Date(booking.booking_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })
                    : 'N/A'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Profile View ─── */
function ProfileView({
  user,
  role,
  onSignOut,
}: {
  user: { email?: string; user_metadata?: { full_name?: string } };
  role: string | null;
  onSignOut: () => void;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 110,
        damping: 14
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="px-5 pt-6"
    >
      <motion.h1 variants={itemVariants} className="text-slate-900 text-xl font-bold mb-6">Profile</motion.h1>

      <motion.div variants={itemVariants} className="white-card rounded-2xl p-5 flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
          <span className="text-white text-xl font-bold">
            {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-slate-900 font-semibold">{user.user_metadata?.full_name || 'Guest'}</h2>
          <p className="text-slate-500 text-xs">{user.email}</p>
          {role && (
            <span className="inline-block mt-1.5 text-[9px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
              {role}
            </span>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <MenuItem icon={User} label="Edit Profile" />
        <MenuItem icon={Bell} label="Notifications" />
        <MenuItem icon={Settings} label="Settings" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <motion.button
          whileHover={{ scale: 1.01, backgroundColor: "rgba(239, 68, 68, 0.03)" }}
          whileTap={{ scale: 0.99 }}
          className="w-full mt-6 h-14 rounded-2xl border border-red-200 text-red-500 text-sm font-medium flex items-center justify-center gap-2 transition-all bg-white"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function MenuItem({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01, x: 2 }}
      whileTap={{ scale: 0.99 }}
      className="w-full white-card rounded-xl p-4 flex items-center justify-between text-left"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-slate-900 text-sm">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </motion.button>
  );
}

/* ─── Manager View ─── */
function ManagerView() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 110,
        damping: 14
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="px-5 pt-6"
    >
      <motion.h1 variants={itemVariants} className="text-slate-900 text-xl font-bold mb-6">Manager Dashboard</motion.h1>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
        <div className="white-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">142</p>
          <p className="text-slate-500 text-[10px] mt-1">Total Bookings</p>
        </div>
        <div className="white-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">28</p>
          <p className="text-slate-500 text-[10px] mt-1">Today</p>
        </div>
        <div className="white-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">AED 12.4K</p>
          <p className="text-slate-500 text-[10px] mt-1">Revenue</p>
        </div>
        <div className="white-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">4.9</p>
          <p className="text-slate-500 text-[10px] mt-1">Rating</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="white-card rounded-2xl p-4">
        <h3 className="text-slate-900 text-sm font-semibold mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/admin/bookings')}
            className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
          >
            View All Bookings
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/admin/services')}
            className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
          >
            Manage Services
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/admin/roster')}
            className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
          >
            Staff Schedule
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
