import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../lib/api';

interface DriverRecord {
  id: string;
  licensePlate: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  status: string;
  planType: string;
  user: { id: string; name: string; phone: string; rating: number };
}

export default function AdminDrivers() {
  const [filter, setFilter] = useState('todos');
  const [drivers, setDrivers] = useState<DriverRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<DriverRecord | null>(null);

  const fetchDrivers = () => {
    const statusParam = filter === 'todos' ? '' : `?status=${filter.toUpperCase()}`;
    api.get<{ ok: boolean; drivers: DriverRecord[] }>(`/admin/drivers${statusParam}`)
      .then(res => setDrivers(res.drivers || []))
      .catch(() => {});
  };

  useEffect(() => { fetchDrivers(); }, [filter]);

  const handleAction = async (driverId: string, status: string) => {
    try {
      await api.patch(`/admin/drivers/${driverId}`, { status });
      fetchDrivers();
    } catch {}
  };

  const statusMap: Record<string, string> = {
    APPROVED: 'aprobado', PENDING: 'pendiente', REJECTED: 'rechazado', SUSPENDED: 'suspendido',
  };

  const filteredDrivers = drivers.filter(d => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return d.user.name?.toLowerCase().includes(q) || d.user.phone?.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-tico-black">Gestión de Conductores</h2>
        <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Buscar conductor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none bg-transparent px-2 py-1"
          />
        </div>
      </div>

      <div className="flex gap-2">
        {['todos', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
              filter === f
                ? 'bg-tico-black text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f === 'todos' ? 'Todos' : statusMap[f] || f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600">Nombre</th>
              <th className="p-4 font-semibold text-gray-600">Teléfono</th>
              <th className="p-4 font-semibold text-gray-600">Placa</th>
              <th className="p-4 font-semibold text-gray-600">Plan</th>
              <th className="p-4 font-semibold text-gray-600">Estado</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">No hay conductores</td></tr>
            ) : filteredDrivers.map((driver) => {
              const st = statusMap[driver.status] || driver.status;
              return (
                <tr key={driver.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-tico-black">{driver.user.name || 'Sin nombre'}</td>
                  <td className="p-4 text-gray-600">{driver.user.phone}</td>
                  <td className="p-4 font-mono text-sm text-gray-500">{driver.licensePlate}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-tico-black text-xs font-bold px-2 py-1 rounded-md">{driver.planType}</span>
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full w-max ${
                      st === 'aprobado' ? 'bg-green-100 text-green-700' :
                      st === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {st === 'aprobado' && <CheckCircle className="w-3 h-3" />}
                      {st === 'pendiente' && <Clock className="w-3 h-3" />}
                      {st === 'rechazado' && <XCircle className="w-3 h-3" />}
                      <span className="capitalize">{st}</span>
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {driver.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleAction(driver.id, 'APPROVED')} className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600">Aprobar</button>
                        <button onClick={() => handleAction(driver.id, 'REJECTED')} className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600">Rechazar</button>
                      </>
                    )}
                    {driver.status !== 'PENDING' && (
                      <button onClick={() => setSelectedDriver(driver)} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-200">Ver Perfil</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Driver Profile Modal */}
      <AnimatePresence>
        {selectedDriver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedDriver(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-tico-black">Perfil del Conductor</h3>
                <button onClick={() => setSelectedDriver(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                  {(selectedDriver.user.name || 'C').charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-tico-black">{selectedDriver.user.name || 'Sin nombre'}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-tico-yellow text-tico-yellow" />
                    <span className="text-sm font-bold">{selectedDriver.user.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <InfoRow label="Teléfono" value={selectedDriver.user.phone} />
                <InfoRow label="Placa" value={selectedDriver.licensePlate} />
                <InfoRow label="Vehículo" value={`${selectedDriver.vehicleBrand || ''} ${selectedDriver.vehicleModel || ''}`.trim() || '-'} />
                <InfoRow label="Color" value={selectedDriver.vehicleColor || '-'} />
                <InfoRow label="Plan" value={selectedDriver.planType} />
                <InfoRow label="Estado" value={statusMap[selectedDriver.status] || selectedDriver.status} />
              </div>

              <button
                onClick={() => setSelectedDriver(null)}
                className="w-full mt-6 bg-tico-black text-white font-bold py-3 rounded-2xl"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-sm font-bold text-tico-black">{value}</span>
    </div>
  );
}
