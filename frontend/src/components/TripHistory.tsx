import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

interface TripRecord {
  id: string;
  createdAt: string;
  estimatedPrice: number;
  finalPrice: number | null;
  originAddress: string;
  destAddress: string;
  status: string;
}

export default function TripHistory({ onBack }: { onBack: () => void }) {
  const [trips, setTrips] = useState<TripRecord[]>([]);

  useEffect(() => {
    api.get<{ ok: boolean; trips: TripRecord[] }>('/users/me/trips')
      .then(res => setTrips(res.trips || []))
      .catch(() => {});
  }, []);

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) return `Hoy, ${date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
    if (diff < 172800000) return `Ayer, ${date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto"
    >
      <div className="bg-white pt-12 pb-4 px-6 shadow-sm sticky top-0 z-10 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft className="w-6 h-6 text-tico-black" />
        </button>
        <h1 className="text-2xl font-bold text-tico-black">Mis Viajes</h1>
      </div>

      <div className="p-6 space-y-4">
        {trips.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-medium">No hay viajes registrados</div>
        ) : trips.map(trip => (
          <div key={trip.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-500">{formatDate(trip.createdAt)}</span>
              <span className="font-bold text-tico-black text-lg">S/ {(trip.finalPrice || trip.estimatedPrice).toFixed(2)}</span>
            </div>
            
            <div className="space-y-3 relative">
              <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-gray-200 z-0"></div>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <p className="text-sm font-medium text-tico-black">{trip.originAddress}</p>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-5 h-5 rounded-full bg-tico-green/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                </div>
                <p className="text-sm font-medium text-tico-black">{trip.destAddress}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${trip.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {trip.status === 'COMPLETED' ? 'Completado' : trip.status === 'CANCELLED' ? 'Cancelado' : trip.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
