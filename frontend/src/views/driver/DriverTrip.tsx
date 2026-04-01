import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import MapContainer from '../../components/MapContainer';
import { api } from '../../lib/api';
import Toast, { useToast } from '../../components/Toast';

type TripPhase = 'picking_up' | 'waiting' | 'en_route' | 'completed';

export default function DriverTrip() {
  const [phase, setPhase] = useState<TripPhase>('picking_up');
  const [earnings, setEarnings] = useState(0);
  const [tripData, setTripData] = useState<any>(null);
  const location = useLocation();
  const tripId = (location.state as any)?.tripId;
  const { toast, show: showToast, hide: hideToast } = useToast();

  useEffect(() => {
    if (!tripId) return;
    api.get<{ ok: boolean; trip: any }>(`/trips/${tripId}`)
      .then(res => {
        setTripData(res.trip);
        const statusPhaseMap: Record<string, TripPhase> = {
          ACCEPTED: 'picking_up', DRIVER_ARRIVING: 'waiting', IN_PROGRESS: 'en_route', COMPLETED: 'completed',
        };
        if (res.trip?.status && statusPhaseMap[res.trip.status]) {
          setPhase(statusPhaseMap[res.trip.status]);
        }
      })
      .catch(() => {});
  }, [tripId]);

  const passengerPhone = tripData?.passenger?.phone || '';

  const handleCall = () => {
    if (passengerPhone) {
      window.location.href = `tel:${passengerPhone}`;
    } else {
      showToast('Teléfono no disponible', 'info');
    }
  };

  const handleMessage = () => {
    if (passengerPhone) {
      const cleanPhone = passengerPhone.replace(/\+/g, '');
      window.open(`https://wa.me/${cleanPhone}`, '_blank');
    } else {
      showToast('Teléfono no disponible', 'info');
    }
  };

  const handleNextPhase = async () => {
    try {
      if (phase === 'picking_up') {
        if (tripId) await api.post(`/trips/${tripId}/arrive`);
        setPhase('waiting');
      } else if (phase === 'waiting') {
        if (tripId) await api.post(`/trips/${tripId}/start`);
        setPhase('en_route');
      } else if (phase === 'en_route') {
        if (tripId) {
          const res = await api.post<{ ok: boolean; trip: any }>(`/trips/${tripId}/complete`);
          setEarnings(res.trip?.finalPrice || res.trip?.estimatedPrice || 0);
        }
        setPhase('completed');
      }
    } catch (err: any) {
      showToast(err.message || 'Error', 'error');
    }
  };

  if (phase === 'completed') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-tico-green text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-tico-black mb-2">Viaje Completado</h1>
        <p className="text-xl font-bold text-tico-black/80 mb-8">Has ganado S/ {earnings.toFixed(2)}</p>
        
        <button 
          onClick={() => window.location.href = '/driver'}
          className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gray-100">
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} type={toast.type} />
      <div className="absolute inset-0 z-0">
        <MapContainer />
      </div>

      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="bg-tico-black text-white rounded-2xl p-4 shadow-lg text-center">
          <h2 className="font-bold text-lg">
            {phase === 'picking_up' && 'Recogiendo pasajero'}
            {phase === 'waiting' && 'Esperando al pasajero'}
            {phase === 'en_route' && 'En camino al destino'}
          </h2>
          <p className="text-gray-400 text-sm">
            {phase === 'picking_up' && 'Dirígete al punto de recogida'}
            {phase === 'waiting' && 'El pasajero fue notificado'}
            {phase === 'en_route' && 'Viaje en progreso'}
          </p>
        </div>
      </div>

      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="absolute bottom-20 left-0 right-0 z-10 p-4"
      >
        <div className="bg-white rounded-[32px] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
                {(tripData?.passenger?.name || 'P').charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-tico-black text-lg">{tripData?.passenger?.name || 'Pasajero'}</h3>
                <p className="text-gray-500 font-medium text-sm">Pago en efectivo</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleMessage} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform">
                <MessageSquare className="w-5 h-5 text-tico-black" />
              </button>
              <button onClick={handleCall} className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center active:scale-95 transition-transform">
                <Phone className="w-5 h-5 text-green-600" />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-tico-green/20 flex items-center justify-center shrink-0">
              {phase === 'en_route' ? <Navigation className="w-5 h-5 text-emerald-700" /> : <MapPin className="w-5 h-5 text-emerald-700" />}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">
                {phase === 'en_route' ? 'Destino' : 'Punto de recogida'}
              </p>
              <p className="font-bold text-tico-black truncate">
                {phase === 'en_route' ? (tripData?.destAddress || 'Destino') : (tripData?.originAddress || 'Punto de recogida')}
              </p>
            </div>
          </div>

          <button 
            onClick={handleNextPhase}
            className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-transform shadow-lg"
          >
            {phase === 'picking_up' && 'Llegué al punto'}
            {phase === 'waiting' && 'Iniciar Viaje'}
            {phase === 'en_route' && 'Completar Viaje'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
