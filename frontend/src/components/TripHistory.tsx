import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export default function TripHistory({ onBack }: { onBack: () => void }) {
  const trips = [
    { id: 1, date: 'Hoy, 14:30', price: 'S/ 15.00', origin: 'Av. Larco 123', dest: 'Jockey Plaza', status: 'Completado' },
    { id: 2, date: 'Ayer, 09:15', price: 'S/ 12.00', origin: 'Parque Kennedy', dest: 'Real Plaza Salaverry', status: 'Completado' },
    { id: 3, date: '12 Mar, 18:45', price: 'S/ 25.00', origin: 'Aeropuerto Jorge Chávez', dest: 'Miraflores', status: 'Cancelado' },
  ];

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
        {trips.map(trip => (
          <div key={trip.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-500">{trip.date}</span>
              <span className="font-bold text-tico-black text-lg">{trip.price}</span>
            </div>
            
            <div className="space-y-3 relative">
              <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-gray-200 z-0"></div>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <p className="text-sm font-medium text-tico-black">{trip.origin}</p>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-5 h-5 rounded-full bg-tico-yellow/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                </div>
                <p className="text-sm font-medium text-tico-black">{trip.dest}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${trip.status === 'Completado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {trip.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
