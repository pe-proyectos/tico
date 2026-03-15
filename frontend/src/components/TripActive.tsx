import { motion } from 'motion/react';
import { Star, ShieldCheck, Phone, MessageSquare, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { wsManager } from '../lib/websocket';
import Toast, { useToast } from './Toast';

interface TripActiveProps {
  tripId: string;
  driver: any;
  onCancel: () => void;
  onCompleted: () => void;
}

export default function TripActive({ tripId, driver, onCancel, onCompleted }: TripActiveProps) {
  const [tripData, setTripData] = useState<any>(null);
  const [cancelling, setCancelling] = useState(false);
  const [driverLocation, setDriverLocation] = useState<[number, number] | null>(null);
  const { toast, show: showToast, hide: hideToast } = useToast();

  const driverUser = tripData?.driver || driver;
  const driverProfile = driverUser?.driver || driverUser;

  useEffect(() => {
    const poll = setInterval(() => {
      api.get<{ ok: boolean; trip: any }>(`/trips/${tripId}`)
        .then(res => {
          setTripData(res.trip);
          if (res.trip?.status === 'COMPLETED') {
            onCompleted();
          } else if (res.trip?.status === 'CANCELLED') {
            onCancel();
          }
        })
        .catch(() => {});
    }, 5000);
    // WebSocket listener
    wsManager.connect();
    const unsub = wsManager.onTripUpdate((data: any) => {
      if (data.tripId === tripId || data.trip?.id === tripId) {
        const status = data.status || data.trip?.status;
        if (data.trip) setTripData(data.trip);
        if (status === 'COMPLETED') onCompleted();
        else if (status === 'CANCELLED') onCancel();
        if (data.driverLocation) setDriverLocation([data.driverLocation.lat, data.driverLocation.lng]);
      }
    });

    return () => { clearInterval(poll); unsub(); };
  }, [tripId]);

  // Poll driver location
  useEffect(() => {
    const pollLoc = setInterval(() => {
      api.get<{ ok: boolean; lat: number; lng: number }>(`/trips/${tripId}/driver-location`)
        .then(res => { if (res.lat && res.lng) setDriverLocation([res.lat, res.lng]); })
        .catch(() => {});
    }, 5000);
    return () => clearInterval(pollLoc);
  }, [tripId]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.post(`/trips/${tripId}/cancel`);
      onCancel();
    } catch (err: any) {
      showToast(err.message || 'Error al cancelar', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const driverName = driverUser?.name || 'Conductor';
  const driverRating = driverUser?.rating || 0;
  const driverPhone = driverUser?.phone || driverProfile?.phone || '';
  const vehicleInfo = driverProfile ? `${driverProfile.vehicleBrand || ''} ${driverProfile.vehicleModel || ''} ${driverProfile.vehicleColor || ''}`.trim() : 'Vehículo';
  const plate = driverProfile?.licensePlate || '';
  const statusText = tripData?.status === 'IN_PROGRESS' ? 'En camino al destino' : tripData?.status === 'DRIVER_ARRIVING' ? 'Conductor llegando' : 'Conductor en camino';

  const eta = tripData?.estimatedDuration
    ? `~${Math.ceil(tripData.estimatedDuration)} min`
    : tripData?.distance
      ? `~${Math.max(1, Math.ceil(tripData.distance / 500))} min`
      : 'Calculando...';

  const handleCall = () => {
    if (driverPhone) {
      window.location.href = `tel:${driverPhone}`;
    } else {
      showToast('Teléfono no disponible', 'info');
    }
  };

  const handleMessage = () => {
    if (driverPhone) {
      const cleanPhone = driverPhone.replace(/\+/g, '');
      window.open(`https://wa.me/${cleanPhone}`, '_blank');
    } else {
      showToast('Teléfono no disponible', 'info');
    }
  };

  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute bottom-0 left-0 right-0 z-30 p-4 pb-8"
    >
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} type={toast.type} />
      <div className="glass-panel rounded-3xl p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5"></div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-tico-black">{statusText}</h2>
          <div className="bg-tico-black text-white px-3 py-1 rounded-full text-sm font-bold">
            {eta}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-2xl">{driverName.charAt(0)}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-green-500" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-tico-black text-lg">{driverName}</h3>
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-4 h-4 fill-tico-yellow text-tico-yellow" />
              <span className="text-sm font-bold text-tico-black">{driverRating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-500">{vehicleInfo}</p>
          </div>

          {plate && (
            <div className="bg-gray-100 px-3 py-2 rounded-xl text-center border border-gray-200">
              <span className="block text-xs text-gray-500 font-medium mb-0.5">Placa</span>
              <span className="block font-bold text-tico-black">{plate}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={handleCall} className="flex-1 bg-gray-100 hover:bg-gray-200 text-tico-black font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors">
            <Phone className="w-5 h-5" /> Llamar
          </button>
          <button onClick={handleMessage} className="flex-1 bg-gray-100 hover:bg-gray-200 text-tico-black font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors">
            <MessageSquare className="w-5 h-5" /> Mensaje
          </button>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleCancel}
            disabled={cancelling}
            className="flex-[2] bg-red-50 text-red-600 font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {cancelling ? 'Cancelando...' : 'Cancelar viaje'}
          </button>
          <button 
            onClick={() => { window.location.href = 'tel:105'; }}
            className="flex-1 bg-red-600 text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            🆘 105
          </button>
        </div>
      </div>
    </motion.div>
  );
}
