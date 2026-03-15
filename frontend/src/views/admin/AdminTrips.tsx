import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../lib/api';

interface TripRecord {
  id: string;
  createdAt: string;
  originAddress: string;
  destAddress: string;
  estimatedPrice: number;
  finalPrice: number | null;
  status: string;
  passenger: { name: string; phone: string };
  driver: { name: string; phone: string } | null;
}

export default function AdminTrips() {
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get<{ ok: boolean; trips: TripRecord[] }>('/admin/trips')
      .then(res => setTrips(res.trips || []))
      .catch(() => {});
  }, []);

  const statusMap: Record<string, { label: string; color: string }> = {
    COMPLETED: { label: 'Completado', color: 'bg-green-100 text-green-700' },
    IN_PROGRESS: { label: 'En curso', color: 'bg-blue-100 text-blue-700' },
    SEARCHING: { label: 'Buscando', color: 'bg-yellow-100 text-yellow-700' },
    ACCEPTED: { label: 'Aceptado', color: 'bg-blue-100 text-blue-700' },
    CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
    DRIVER_ARRIVING: { label: 'En camino', color: 'bg-purple-100 text-purple-700' },
  };

  const formatDate = (d: string) => new Date(d).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const filteredTrips = trips.filter(t => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const statusLabel = statusMap[t.status]?.label?.toLowerCase() || t.status.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.passenger?.name?.toLowerCase().includes(q) ||
      t.driver?.name?.toLowerCase().includes(q) ||
      statusLabel.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-tico-black">Historial de Viajes</h2>
        <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Buscar viaje..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none bg-transparent px-2 py-1"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600">Fecha/Hora</th>
              <th className="p-4 font-semibold text-gray-600">Pasajero</th>
              <th className="p-4 font-semibold text-gray-600">Conductor</th>
              <th className="p-4 font-semibold text-gray-600">Ruta</th>
              <th className="p-4 font-semibold text-gray-600">Precio</th>
              <th className="p-4 font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">No hay viajes registrados</td></tr>
            ) : filteredTrips.map((trip) => {
              const st = statusMap[trip.status] || { label: trip.status, color: 'bg-gray-100 text-gray-600' };
              return (
                <tr key={trip.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-600">{formatDate(trip.createdAt)}</td>
                  <td className="p-4 font-bold text-tico-black">{trip.passenger?.name || 'Pasajero'}</td>
                  <td className="p-4 text-gray-600">{trip.driver?.name || '-'}</td>
                  <td className="p-4 text-sm text-gray-600 truncate max-w-[200px]">{trip.originAddress} → {trip.destAddress}</td>
                  <td className="p-4 font-bold text-tico-black">S/ {(trip.finalPrice || trip.estimatedPrice).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${st.color}`}>{st.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
