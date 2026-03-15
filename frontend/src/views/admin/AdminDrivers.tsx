import { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminDrivers() {
  const [filter, setFilter] = useState('todos');

  const drivers = [
    { id: 'D001', name: 'Carlos Mendoza', phone: '+51 987654321', status: 'aprobado', rating: 4.8, plan: 'PRO' },
    { id: 'D002', name: 'Ana Torres', phone: '+51 912345678', status: 'pendiente', rating: 0, plan: 'FREE' },
    { id: 'D003', name: 'Luis Rojas', phone: '+51 998877665', status: 'rechazado', rating: 0, plan: 'FREE' },
    { id: 'D004', name: 'María Silva', phone: '+51 945612378', status: 'aprobado', rating: 4.9, plan: 'BUSINESS' },
  ];

  const filteredDrivers = drivers.filter(d => filter === 'todos' || d.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-tico-black">Gestión de Conductores</h2>
        <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <input type="text" placeholder="Buscar conductor..." className="outline-none bg-transparent px-2 py-1" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['todos', 'pendientes', 'aprobados', 'rechazados'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f.replace('s', ''))}
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
              (filter === f || filter === f.replace('s', ''))
                ? 'bg-tico-black text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">Nombre</th>
              <th className="p-4 font-semibold text-gray-600">Teléfono</th>
              <th className="p-4 font-semibold text-gray-600">Plan</th>
              <th className="p-4 font-semibold text-gray-600">Estado</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver) => (
              <tr key={driver.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-mono text-sm text-gray-500">{driver.id}</td>
                <td className="p-4 font-bold text-tico-black">{driver.name}</td>
                <td className="p-4 text-gray-600">{driver.phone}</td>
                <td className="p-4">
                  <span className="bg-gray-100 text-tico-black text-xs font-bold px-2 py-1 rounded-md">
                    {driver.plan}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full w-max ${
                    driver.status === 'aprobado' ? 'bg-green-100 text-green-700' :
                    driver.status === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {driver.status === 'aprobado' && <CheckCircle className="w-3 h-3" />}
                    {driver.status === 'pendiente' && <Clock className="w-3 h-3" />}
                    {driver.status === 'rechazado' && <XCircle className="w-3 h-3" />}
                    <span className="capitalize">{driver.status}</span>
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {driver.status === 'pendiente' && (
                    <>
                      <button className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600">Aprobar</button>
                      <button className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600">Rechazar</button>
                    </>
                  )}
                  {driver.status !== 'pendiente' && (
                    <button className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-200">Ver Perfil</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}