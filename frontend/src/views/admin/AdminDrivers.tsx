import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { api } from '../../lib/api';

interface DriverRecord {
  id: string;
  licensePlate: string;
  status: string;
  planType: string;
  user: { id: string; name: string; phone: string; rating: number };
}

export default function AdminDrivers() {
  const [filter, setFilter] = useState('todos');
  const [drivers, setDrivers] = useState<DriverRecord[]>([]);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-tico-black">Gestión de Conductores</h2>
        <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <input type="text" placeholder="Buscar conductor..." className="outline-none bg-transparent px-2 py-1" />
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
            {drivers.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">No hay conductores</td></tr>
            ) : drivers.map((driver) => {
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
                      <button className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-200">Ver Perfil</button>
                    )}
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
