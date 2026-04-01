import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, X } from 'lucide-react';

interface DriverRequestProps {
  trip?: any;
  onAccept: () => void;
  onReject: () => void;
}

export default function DriverRequest({ trip, onAccept, onReject }: DriverRequestProps) {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (timeLeft === 0) {
      onReject();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onReject]);

  const progress = (timeLeft / 15) * 100;
  const price = trip?.estimatedPrice || 15;
  const origin = trip?.originAddress || 'Punto de recogida';
  const dest = trip?.destAddress || 'Destino';
  const passengerName = trip?.passenger?.name || 'Pasajero';

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 pb-24"
      >
        <div className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
          {/* Progress Bar Background */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gray-100">
            <motion.div 
              className="h-full bg-tico-green"
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>

          <div className="flex justify-between items-start mt-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-tico-black">S/ {price.toFixed(2)}</h2>
              <p className="text-gray-500 font-medium">Pago en efectivo • {passengerName}</p>
            </div>
            
            {/* Circular Countdown */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
                <circle 
                  cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                  strokeDasharray="175.93" 
                  strokeDashoffset={175.93 - (175.93 * progress) / 100}
                  className="text-tico-green transition-all duration-1000 ease-linear" 
                />
              </svg>
              <span className="absolute text-xl font-bold text-tico-black">{timeLeft}</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Recoger en</p>
                <p className="font-bold text-tico-black">{origin}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-tico-green/20 flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Dejar en</p>
                <p className="font-bold text-tico-black">{dest}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onReject}
              className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center active:scale-95 transition-transform shrink-0"
            >
              <X className="w-8 h-8 text-gray-500" />
            </button>
            <button 
              onClick={onAccept}
              className="flex-1 bg-tico-black text-white font-bold text-xl rounded-2xl active:scale-95 transition-transform shadow-lg"
            >
              Aceptar Viaje
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
