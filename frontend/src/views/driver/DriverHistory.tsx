import { useState, useEffect, useMemo } from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { api } from '../../lib/api';

interface TripRecord {
  id: string;
  createdAt: string;
  estimatedPrice: number;
  finalPrice: number | null;
  originAddress: string;
  destAddress: string;
  status: string;
}

const filterMap: Record<string, string> = { hoy: 'today', semana: 'week', mes: 'month' };

export default function DriverHistory() {
  const [filter, setFilter] = useState('hoy');
  const [allTrips, setAllTrips] = useState<TripRecord[]>([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    api.get<{ ok: boolean; trips: TripRecord[]; earnings: number }>(`/driver/history?filter=${filterMap[filter] || 'today'}`)
      .then(res => {
        setAllTrips(res.trips || []);
        setEarnings(res.earnings || 0);
      })
      .catch(() => {});
  }, [filter]);

  // Client-side date filtering as fallback
  const trips = useMemo(() => {
    const now = new Date();
    return allTrips.filter(t => {
      const d = new Date(t.createdAt);
      if (filter === 'hoy') {
        return d.toDateString() === now.toDateString();
      } else if (filter === 'semana') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
      }
      // mes - last 30 days
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return d >= monthAgo;
    });
  }, [allTrips, filter]);

  const filteredEarnings = useMemo(() => {
    return trips
      .filter(t => t.status === 'COMPLETED')
      .reduce((sum, t) => sum + (t.finalPrice || t.estimatedPrice || 0), 0);
  }, [trips]);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  };

  const statusMap: Record<string, string> = {
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
    SEARCHING: 'Buscando',
    ACCEPTED: 'Aceptado',
    IN_PROGRESS: 'En curso',
    DRIVER_ARRIVING: 'En camino',
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-black text-tico-black">Historial de Viajes</h1>

      <div className="flex gap-2">
        {['hoy', 'semana', 'mes'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
              filter === f
                ? 'bg-tico-black text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-tico-green rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-tico-black/70 font-bold uppercase text-xs mb-1">Ganancias ({filter})</p>
          <h2 className="text-4xl font-black text-tico-black">S/ {(earnings || filteredEarnings).toFixed(2)}</h2>
        </div>
        <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
          <DollarSign className="w-8 h-8 text-tico-black" />
        </div>
      </div>

      <div className="space-y-4">
        {trips.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-medium">No hay viajes registrados</div>
        ) : (
          trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-500">{formatTime(trip.createdAt)}</span>
                </div>
                <span className="font-black text-tico-black text-lg">S/ {(trip.finalPrice || trip.estimatedPrice).toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                  <p className="text-sm font-medium text-tico-black truncate">{trip.originAddress}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-tico-green shrink-0"></div>
                  <p className="text-sm font-medium text-tico-black truncate">{trip.destAddress}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                  trip.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {statusMap[trip.status] || trip.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
