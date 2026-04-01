import { motion } from 'motion/react';
import { Star, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { api } from '../lib/api';
import { wsManager } from '../lib/websocket';

interface DriverListProps {
  tripId: string;
  proposedPrice: number;
  onCancel: () => void;
  onDriverAccepted: (trip: any) => void;
}

export default function DriverList({ tripId, proposedPrice, onCancel, onDriverAccepted }: DriverListProps) {
  const [searching, setSearching] = useState(true);
  const [noDrivers, setNoDrivers] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const poll = () => {
      api.get<{ ok: boolean; trip: any }>(`/trips/${tripId}`)
        .then(res => {
          if (res.trip?.status === 'ACCEPTED' || res.trip?.status === 'DRIVER_ARRIVING' || res.trip?.status === 'IN_PROGRESS') {
            setSearching(false);
            onDriverAccepted(res.trip);
          } else if (res.trip?.status === 'CANCELLED') {
            onCancel();
          } else if (Date.now() - startTime.current > 30000) {
            setSearching(false);
            setNoDrivers(true);
          }
        })
        .catch(() => {});
    };

    pollRef.current = setInterval(poll, 3000);

    // WebSocket listener (faster than polling)
    wsManager.connect();
    const unsub = wsManager.onTripUpdate((data: any) => {
      if (data.tripId === tripId || data.trip?.id === tripId) {
        const status = data.status || data.trip?.status;
        if (status === 'ACCEPTED' || status === 'DRIVER_ARRIVING' || status === 'IN_PROGRESS') {
          setSearching(false);
          onDriverAccepted(data.trip || data);
        } else if (status === 'CANCELLED') {
          onCancel();
        }
      }
    });

    return () => { if (pollRef.current) clearInterval(pollRef.current); unsub(); };
  }, [tripId]);

  const handleRetry = () => {
    setNoDrivers(false);
    setSearching(true);
    startTime.current = Date.now();
  };

  const handleCancel = async () => {
    try {
      await api.post(`/trips/${tripId}/cancel`);
    } catch {}
    onCancel();
  };

  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute bottom-0 left-0 right-0 z-30 p-4 pb-8 h-[75vh] flex flex-col"
    >
      <div className="glass-panel rounded-3xl p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-tico-black">Buscando conductor...</h2>
            <p className="text-sm text-gray-500">Tu oferta: <span className="font-semibold text-tico-black">S/ {proposedPrice}</span></p>
          </div>
          <button 
            onClick={handleCancel}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
          {searching && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-12 h-12 border-4 border-tico-green border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-medium">Buscando conductores cercanos...</p>
              <p className="text-sm mt-2">Esto puede tomar unos segundos</p>
            </div>
          )}

          {noDrivers && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p className="font-medium text-lg text-tico-black mb-2">No hay conductores disponibles</p>
              <p className="text-sm mb-6">Intenta de nuevo en unos minutos</p>
              <button 
                onClick={handleRetry}
                className="bg-tico-green text-tico-black font-bold px-8 py-3 rounded-2xl active:scale-95 transition-transform"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
