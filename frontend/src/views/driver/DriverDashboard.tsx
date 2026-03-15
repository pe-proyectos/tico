import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Power, Activity, DollarSign, Star, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { wsManager } from '../../lib/websocket';
import DriverRequest from './DriverRequest';

interface DriverStats {
  ok: boolean;
  tripsToday: number;
  earnings: number;
  planType: string;
  limit: number;
}

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [pendingTrip, setPendingTrip] = useState<any>(null);
  const navigate = useNavigate();

  const auth = JSON.parse(localStorage.getItem('tico_auth') || '{}');
  const userName = auth.user?.name || 'Conductor';

  useEffect(() => {
    api.get<DriverStats>('/driver/stats').then(setStats).catch(() => {});
  }, []);

  // Poll for requests when online
  useEffect(() => {
    if (!isOnline) return;
    const poll = setInterval(() => {
      api.get<{ ok: boolean; trips: any[] }>('/driver/requests').then(res => {
        if (res.trips?.length > 0 && !showRequest) {
          setPendingTrip(res.trips[0]);
          setShowRequest(true);
        }
      }).catch(() => {});
    }, 5000);
    return () => clearInterval(poll);
  }, [isOnline, showRequest]);

  // WebSocket: listen for new trip requests
  useEffect(() => {
    if (!isOnline) return;
    wsManager.connect();
    const unsub = wsManager.onTripUpdate((data: any) => {
      if (data.type === 'NEW_REQUEST' && data.trip && !showRequest) {
        setPendingTrip(data.trip);
        setShowRequest(true);
      }
    });
    return () => { unsub(); };
  }, [isOnline, showRequest]);

  // Send driver location when online
  useEffect(() => {
    if (!isOnline) return;
    let watchId: number | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let lastLat = 0, lastLng = 0;

    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => { lastLat = pos.coords.latitude; lastLng = pos.coords.longitude; },
        () => {},
        { enableHighAccuracy: true }
      );
      intervalId = setInterval(() => {
        if (lastLat && lastLng) {
          api.post('/driver/location', { lat: lastLat, lng: lastLng }).catch(() => {});
        }
      }, 10000);
    }
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOnline]);

  const toggleOnline = async () => {
    try {
      const res = await api.patch<{ ok: boolean; isAvailable: boolean }>('/driver/availability', { available: !isOnline });
      setIsOnline(res.isAvailable);
    } catch (err: any) {
      alert(err.message || 'Error al cambiar disponibilidad');
    }
  };

  const handleAcceptRequest = async () => {
    if (pendingTrip) {
      try {
        await api.post(`/trips/${pendingTrip.id}/accept`);
        setShowRequest(false);
        navigate('/driver/trip', { state: { tripId: pendingTrip.id } });
      } catch (err: any) {
        alert(err.message || 'Error al aceptar viaje');
        setShowRequest(false);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-tico-black">Hola, {userName.split(' ')[0]}</h1>
          <p className="text-gray-500 font-medium">Plan <span className="text-tico-black font-bold bg-tico-yellow/20 px-2 py-0.5 rounded-md">{stats?.planType || 'FREE'}</span></p>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('tico_auth');
            navigate('/login');
          }}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Online Toggle */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <button
          onClick={toggleOnline}
          className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 mb-4 ${
            isOnline ? 'bg-green-500 shadow-green-500/30' : 'bg-gray-200 shadow-gray-200/50'
          }`}
        >
          <Power className={`w-10 h-10 ${isOnline ? 'text-white' : 'text-gray-400'}`} />
        </button>
        <h2 className={`text-xl font-bold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
          {isOnline ? 'Estás Conectado' : 'Estás Desconectado'}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          {isOnline ? 'Buscando pasajeros cercanos...' : 'Conéctate para recibir viajes'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-black text-tico-black">{stats?.tripsToday ?? 0}</p>
          <p className="text-xs font-bold text-gray-400 uppercase">Viajes Hoy</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-black text-tico-black">{stats?.earnings ?? 0}</p>
          <p className="text-xs font-bold text-gray-400 uppercase">Ganancias</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <Star className="w-6 h-6 text-tico-yellow mx-auto mb-2" />
          <p className="text-2xl font-black text-tico-black">{auth.user?.rating?.toFixed(1) || '0.0'}</p>
          <p className="text-xs font-bold text-gray-400 uppercase">Rating</p>
        </div>
      </div>

      {showRequest && pendingTrip && (
        <DriverRequest 
          trip={pendingTrip}
          onAccept={handleAcceptRequest} 
          onReject={() => { setShowRequest(false); setPendingTrip(null); }} 
        />
      )}
    </div>
  );
}
