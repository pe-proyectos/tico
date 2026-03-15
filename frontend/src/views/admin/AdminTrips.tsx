import { Search } from 'lucide-react';

export default function AdminTrips() {
  const trips = [
    { id: 'T1042', date: '15 Mar, 14:30', passenger: 'Juan Pérez', driver: 'Carlos M.', route: 'Real Plaza → USAT', price: 'S/ 12.00', status: 'En curso' },
    { id: 'T1041', date: '15 Mar, 14:15', passenger: 'María S.', driver: 'Ana T.', route: 'Terminal → Centro', price: 'S/ 8.00', status: 'Completado' },
    { id: 'T1040', date: '15 Mar, 13:50', passenger: 'Luis R.', driver: '-', route: 'Hospital → Open Plaza', price: 'S/ 15.00', status: 'Cancelado' },
    { id: 'T1039', date: '15 Mar, 13:20', passenger: 'Elena G.', driver: 'Pedro L.', route: 'Aeropuerto → Pimentel', price: 'S/ 25.00', status: 'Completado' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-tico-black">Historial de Viajes</h2>
        <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <input type="text" placeholder="Buscar viaje..." className="outline-none bg-transparent px-2 py-1" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600">ID Viaje</th>
              <th className="p-4 font-semibold text-gray-600">Fecha/Hora</th>
              <th className="p-4 font-semibold text-gray-600">Pasajero</th>
              <th className="p-4 font-semibold text-gray-600">Conductor</th>
              <th className="p-4 font-semibold text-gray-600">Ruta</th>
              <th className="p-4 font-semibold text-gray-600">Precio</th>
              <th className="p-4 font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-mono text-sm text-gray-500">{trip.id}</td>
                <td className="p-4 text-sm text-gray-600">{trip.date}</td>
                <td className="p-4 font-bold text-tico-black">{trip.passenger}</td>
                <td className="p-4 text-gray-600">{trip.driver}</td>
                <td className="p-4 text-sm text-gray-600 truncate max-w-[200px]">{trip.route}</td>
                <td className="p-4 font-bold text-tico-black">{trip.price}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    trip.status === 'Completado' ? 'bg-green-100 text-green-700' :
                    trip.status === 'En curso' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {trip.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}