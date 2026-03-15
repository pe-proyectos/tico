import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import MapContainer from '../../components/MapContainer';

type TripPhase = 'picking_up' | 'waiting' | 'en_route' | 'completed';

export default function DriverTrip() {
  const [phase, setPhase] = useState<TripPhase>('picking_up');

  const handleNextPhase = () => {
    if (phase === 'picking_up') setPhase('waiting');
    else if (phase === 'waiting') setPhase('en_route');
    else if (phase === 'en_route') setPhase('completed');
  };

  if (phase === 'completed') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-tico-yellow text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-tico-black mb-2">Viaje Completado</h1>
        <p className="text-xl font-bold text-tico-black/80 mb-8">Has ganado S/ 15.00</p>
        
        <button 
          onClick={() => window.location.href = '/driver'}
          className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gray-100">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapContainer />
      </div>

      {/* Top Banner */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="bg-tico-black text-white rounded-2xl p-4 shadow-lg text-center">
          <h2 className="font-bold text-lg">
            {phase === 'picking_up' && 'Recogiendo a Juan Pérez'}
            {phase === 'waiting' && 'Esperando al pasajero'}
            {phase === 'en_route' && 'En camino al destino'}
          </h2>
          <p className="text-gray-400 text-sm">
            {phase === 'picking_up' && 'A 2 min de distancia'}
            {phase === 'waiting' && 'Tiempo de espera: 01:23'}
            {phase === 'en_route' && 'Llegada estimada: 14:45'}
          </p>
        </div>
      </div>

      {/* Bottom Panel */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="absolute bottom-20 left-0 right-0 z-10 p-4"
      >
        <div className="bg-white rounded-[32px] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img src="https://picsum.photos/seed/juan/100/100" alt="Pasajero" className="w-14 h-14 rounded-full object-cover" referrerPolicy="no-referrer" />
              <div>
                <h3 className="font-bold text-tico-black text-lg">Juan Pérez</h3>
                <p className="text-gray-500 font-medium text-sm">★ 4.9 • Pago en efectivo</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform">
                <MessageSquare className="w-5 h-5 text-tico-black" />
              </button>
              <button className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center active:scale-95 transition-transform">
                <Phone className="w-5 h-5 text-green-600" />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-tico-yellow/20 flex items-center justify-center shrink-0">
              {phase === 'en_route' ? <Navigation className="w-5 h-5 text-yellow-700" /> : <MapPin className="w-5 h-5 text-yellow-700" />}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">
                {phase === 'en_route' ? 'Destino' : 'Punto de recogida'}
              </p>
              <p className="font-bold text-tico-black truncate">
                {phase === 'en_route' ? 'USAT' : 'Real Plaza Chiclayo'}
              </p>
            </div>
          </div>

          <button 
            onClick={handleNextPhase}
            className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-transform shadow-lg"
          >
            {phase === 'picking_up' && 'Llegué al punto'}
            {phase === 'waiting' && 'Iniciar Viaje'}
            {phase === 'en_route' && 'Completar Viaje'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}