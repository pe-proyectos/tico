import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import PassengerApp from './views/passenger/PassengerApp';
import DriverLayout from './views/driver/DriverLayout';
import DriverDashboard from './views/driver/DriverDashboard';
import DriverTrip from './views/driver/DriverTrip';
import DriverHistory from './views/driver/DriverHistory';
import DriverPlans from './views/driver/DriverPlans';
import AdminLayout from './views/admin/AdminLayout';
import AdminDashboard from './views/admin/AdminDashboard';
import AdminDrivers from './views/admin/AdminDrivers';
import AdminTrips from './views/admin/AdminTrips';
import AdminPlans from './views/admin/AdminPlans';
import DevNav from './components/DevNav';

function AuthGuard({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) {
  const authStr = localStorage.getItem('tico_auth');
  if (!authStr) return <Navigate to="/login" replace />;
  
  try {
    const auth = JSON.parse(authStr);
    if (auth.role !== allowedRole) {
      if (auth.role === 'admin') return <Navigate to="/admin" replace />;
      if (auth.role === 'driver') return <Navigate to="/driver" replace />;
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function LoginWrapper() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const authStr = localStorage.getItem('tico_auth');
    if (authStr) {
      try {
        const auth = JSON.parse(authStr);
        if (auth.role === 'admin') navigate('/admin');
        else if (auth.role === 'driver') navigate('/driver');
        else navigate('/');
      } catch (e) {}
    }
  }, [navigate]);

  return (
    <Login onLogin={(role) => {
      if (role === 'admin') navigate('/admin');
      else if (role === 'driver') navigate('/driver');
      else navigate('/');
    }} />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DevNav />
      <Routes>
        <Route path="/login" element={<LoginWrapper />} />
        
        {/* Passenger Routes */}
        <Route 
          path="/" 
          element={
            <AuthGuard allowedRole="passenger">
              <PassengerApp />
            </AuthGuard>
          } 
        />

        {/* Driver Routes */}
        <Route 
          path="/driver" 
          element={
            <AuthGuard allowedRole="driver">
              <DriverLayout />
            </AuthGuard>
          }
        >
          <Route index element={<DriverDashboard />} />
          <Route path="trip" element={<DriverTrip />} />
          <Route path="history" element={<DriverHistory />} />
          <Route path="plans" element={<DriverPlans />} />
        </Route>

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AuthGuard allowedRole="admin">
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="trips" element={<AdminTrips />} />
          <Route path="plans" element={<AdminPlans />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
