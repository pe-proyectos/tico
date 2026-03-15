import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import MapContainer from '../../components/MapContainer';
import OrderPanel from '../../components/OrderPanel';
import DriverList from '../../components/DriverList';
import Profile from '../../components/Profile';
import TripActive from '../../components/TripActive';
import Sidebar from '../../components/Sidebar';
import PaymentMethods from '../../components/PaymentMethods';
import TripHistory from '../../components/TripHistory';
import Messages from '../../components/Messages';
import Support from '../../components/Support';
import Settings from '../../components/Settings';
import DriverMode from '../../components/DriverMode';
import EditProfile from '../../components/EditProfile';
import TripComplete from './TripComplete';

type ViewState = 'home' | 'profile' | 'payment' | 'history' | 'messages' | 'support' | 'settings' | 'driverMode' | 'editProfile';

export default function PassengerApp() {
  const [view, setView] = useState<ViewState>('home');
  const [orderState, setOrderState] = useState<'idle' | 'negotiating' | 'accepted' | 'completed'>('idle');
  const [proposedPrice, setProposedPrice] = useState<number>(0);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [currentTrip, setCurrentTrip] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleTripCreated = (trip: any) => {
    setProposedPrice(trip.estimatedPrice || 0);
    setCurrentTripId(trip.id);
    setCurrentTrip(trip);
    setOrderState('negotiating');
  };

  const handleCancel = () => {
    setOrderState('idle');
    setSelectedDriver(null);
    setCurrentTripId(null);
    setCurrentTrip(null);
  };

  const handleDriverAccepted = (trip: any) => {
    setSelectedDriver(trip.driver);
    setCurrentTrip(trip);
    setOrderState('accepted');
  };

  const handleTripCompleted = () => {
    setOrderState('completed');
  };

  const handleLogout = () => {
    localStorage.removeItem('tico_auth');
    navigate('/login');
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gray-100">
      <Navbar 
        onProfileClick={() => setView('profile')} 
        onMenuClick={() => setIsSidebarOpen(true)} 
      />
      <MapContainer />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onProfileClick={() => setView('profile')}
        onPaymentClick={() => setView('payment')}
        onHistoryClick={() => setView('history')}
        onMessagesClick={() => setView('messages')}
        onSupportClick={() => setView('support')}
        onSettingsClick={() => setView('settings')}
        onDriverModeClick={() => setView('driverMode')}
      />

      <AnimatePresence>
        {view === 'profile' && (
          <Profile 
            key="profile" 
            onBack={() => setView('home')} 
            onLogout={handleLogout} 
            onEditProfile={() => setView('editProfile')}
            onHistoryClick={() => setView('history')}
            onSettingsClick={() => setView('settings')}
          />
        )}

        {view === 'payment' && <PaymentMethods key="payment" onBack={() => setView('home')} />}
        {view === 'history' && <TripHistory key="history" onBack={() => setView('home')} />}
        {view === 'messages' && <Messages key="messages" onBack={() => setView('home')} />}
        {view === 'support' && <Support key="support" onBack={() => setView('home')} />}
        {view === 'settings' && <Settings key="settings" onBack={() => setView('home')} />}
        {view === 'driverMode' && <DriverMode key="driverMode" onBack={() => setView('home')} />}
        {view === 'editProfile' && <EditProfile key="editProfile" onBack={() => setView('profile')} />}

        {view === 'home' && orderState === 'idle' && (
          <OrderPanel key="order-panel" onTripCreated={handleTripCreated} />
        )}
        
        {view === 'home' && orderState === 'negotiating' && currentTripId && (
          <DriverList key="driver-list" tripId={currentTripId} proposedPrice={proposedPrice} onCancel={handleCancel} onDriverAccepted={handleDriverAccepted} />
        )}

        {view === 'home' && orderState === 'accepted' && currentTripId && (
          <TripActive key="trip-active" tripId={currentTripId} driver={selectedDriver} onCancel={handleCancel} onCompleted={handleTripCompleted} />
        )}

        {view === 'home' && orderState === 'completed' && (
          <TripComplete key="trip-complete" tripId={currentTripId} trip={currentTrip} onDone={handleCancel} />
        )}
      </AnimatePresence>
    </div>
  );
}
