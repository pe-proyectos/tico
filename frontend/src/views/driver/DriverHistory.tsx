import { useState } from 'react';
import { Calendar, DollarSign, MapPin } from 'lucide-react';

export default function DriverHistory() {
  const [filter, setFilter] = useState('hoy');

  const trips = [
    { id: 1, time: '14:30', price: 'S/ 15.00', origin: 'Real Plaza', dest: 'USAT', status: 'Completado' },
    { id: 2, time: '12:15', price: 'S/ 8.00', origin: 'Terminal', dest: 'Centro', status: 'Completado' },
    { id: 3, time: '10:50', price: 'S/ 12.00', origin: 'Hospital', dest: 'Open Plaza', status: 'Completado' },
    { id: 4, time: '09:20', price: 'S/ 25.00', origin: 'Aeropuerto', dest: 'Pimentel', status: 'Completado' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-black text-tico-black">Historial de Viajes</h1>

      {/* Filters */}
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

      {/* Summary Card */}
      <div className="bg-tico-yellow rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-tico-black/70 font-bold uppercase text-xs mb-1">Ganancias ({filter})</p>
          <h2 className="text-4xl font-black text-tico-black">S/ 60.00</h2>
        </div>
        <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
          <DollarSign className="w-8 h-8 text-tico-black" />
        </div>
      </div>

      {/* Trip List */}
      <div className="space-y-4">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-bold text-gray-500">{trip.time}</span>
              </div>
              <span className="font-black text-tico-black text-lg">{trip.price}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                <p className="text-sm font-medium text-tico-black truncate">{trip.origin}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-tico-yellow shrink-0"></div>
                <p className="text-sm font-medium text-tico-black truncate">{trip.dest}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}