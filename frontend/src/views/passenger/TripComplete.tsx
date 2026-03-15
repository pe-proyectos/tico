import { motion } from 'motion/react';
import { Star, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function TripComplete({ onDone }: { onDone: () => void }) {
  const [rating, setRating] = useState(0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </div>

      <h1 className="text-3xl font-black text-tico-black mb-2">¡Llegaste a tu destino!</h1>
      <p className="text-gray-500 font-medium mb-8">Espero que hayas disfrutado tu viaje con Tico.</p>

      <div className="bg-gray-50 rounded-3xl p-6 w-full max-w-sm mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">Resumen del Viaje</h2>
        
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-gray-600">Tiempo</span>
          <span className="font-bold text-tico-black">15 min</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-gray-600">Distancia</span>
          <span className="font-bold text-tico-black">4.2 km</span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="font-medium text-gray-600">Total pagado</span>
          <span className="font-black text-2xl text-tico-black">S/ 12.00</span>
        </div>
      </div>

      <div className="w-full max-w-sm mb-8">
        <h2 className="text-lg font-bold text-tico-black mb-4">¿Cómo calificarías a Carlos?</h2>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star} 
              onClick={() => setRating(star)}
              className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-tico-yellow/20 transition-colors"
            >
              <Star className={`w-6 h-6 ${rating >= star ? 'fill-tico-yellow text-tico-yellow' : 'text-gray-400'}`} />
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={onDone}
        className="w-full max-w-sm bg-tico-black text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-transform shadow-lg mt-auto"
      >
        Finalizar
      </button>
    </motion.div>
  );
}