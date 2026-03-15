import { motion } from 'motion/react';
import { Star, ShieldCheck, Phone, MessageSquare, X } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  photo: string;
  car: string;
  rating: number;
  price: number;
  time: string;
  plate: string;
}

interface TripActiveProps {
  driver: Driver;
  onCancel: () => void;
}

export default function TripActive({ driver, onCancel }: TripActiveProps) {
  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute bottom-0 left-0 right-0 z-30 p-4 pb-8"
    >
      <div className="glass-panel rounded-3xl p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5"></div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-tico-black">Conductor en camino</h2>
          <div className="bg-tico-black text-white px-3 py-1 rounded-full text-sm font-bold">
            {driver.time}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img src={driver.photo} alt={driver.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-green-500" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-tico-black text-lg">{driver.name}</h3>
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-4 h-4 fill-tico-yellow text-tico-yellow" />
              <span className="text-sm font-bold text-tico-black">{driver.rating}</span>
            </div>
            <p className="text-sm text-gray-500">{driver.car}</p>
          </div>

          <div className="bg-gray-100 px-3 py-2 rounded-xl text-center border border-gray-200">
            <span className="block text-xs text-gray-500 font-medium mb-0.5">Placa</span>
            <span className="block font-bold text-tico-black">{driver.plate}</span>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-tico-black font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors">
            <Phone className="w-5 h-5" /> Llamar
          </button>
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-tico-black font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors">
            <MessageSquare className="w-5 h-5" /> Mensaje
          </button>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-[2] bg-red-50 text-red-600 font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-transform"
          >
            Cancelar viaje
          </button>
          <button 
            onClick={() => alert('Llamando a emergencias (105)...')}
            className="flex-1 bg-red-600 text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            🆘 105
          </button>
        </div>
      </div>
    </motion.div>
  );
}
