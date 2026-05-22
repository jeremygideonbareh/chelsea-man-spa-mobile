import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import LoadingScreen from './components/ui/LoadingScreen';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/Services';
import AdminRoster from './pages/admin/Roster';
import AdminBookings from './pages/admin/Bookings';

export default function App() {
  const { loading: authLoading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);

  // Keep loader visible for at least 1.8s for premium experience
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!authLoading) {
        setShowLoader(false);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [authLoading]);

  // If auth finishes after 1.8s, hide loader when it completes
  useEffect(() => {
    if (!authLoading && showLoader) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 300); // Small grace period
      return () => clearTimeout(timer);
    }
  }, [authLoading, showLoader]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && <LoadingScreen key="loader" />}
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="roster" element={<AdminRoster />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
