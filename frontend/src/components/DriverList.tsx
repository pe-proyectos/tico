import { motion } from 'motion/react';
import { Star, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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

interface DriverListProps {
  proposedPrice: number;
  onCancel: () => void;
  onSelectDriver: (driver: Driver) => void;
}

export default function DriverList({ proposedPrice, onCancel, onSelectDriver }: DriverListProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    // Simulate incoming drivers
    const mockDrivers: Driver[] = [
      { id: '1', name: 'Carlos M.', photo: 'https://picsum.photos/seed/carlos/100/100', car: 'Chevrolet Spark Amarillo', rating: 4.9, price: proposedPrice + 1, time: '2 min', plate: 'ABC-123' },
      { id: '2', name: 'Luis R.', photo: 'https://picsum.photos/seed/luis/100/100', car: 'Kia Picanto Gris', rating: 4.7, price: proposedPrice, time: '4 min', plate: 'XYZ-987' },
      { id: '3', name: 'Ana V.', photo: 'https://picsum.photos/seed/ana/100/100', car: 'Hyundai i10 Blanco', rating: 5.0, price: proposedPrice + 2, time: '1 min', plate: 'LMN-456' },
    ];

    let timeoutIds: NodeJS.Timeout[] = [];
    
    mockDrivers.forEach((driver, index) => {
      const id = setTimeout(() => {
        setDrivers(prev => [...prev, driver]);
      }, index * 1500 + 500);
      timeoutIds.push(id);
    });

    return () => timeoutIds.forEach(clearTimeout);
  }, [proposedPrice]);

  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute bottom-0 left-0 right-0 z-30 p-4 pb-8 h-[75vh] flex flex-col"
    >
      <div className="glass-panel rounded-3xl p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-tico-black">Negociando...</h2>
            <p className="text-sm text-gray-500">Tu oferta: <span className="font-semibold text-tico-black">S/ {proposedPrice}</span></p>
          </div>
          <button 
            onClick={onCancel}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
          {drivers.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-12 h-12 border-4 border-tico-yellow border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-medium">Buscando conductores cercanos...</p>
            </div>
          ) : (
            drivers.map((driver) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={driver.id}
                onClick={() => onSelectDriver(driver)}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 active:scale-95 transition-transform cursor-pointer"
              >
                <div className="relative">
                  <img src={driver.photo} alt={driver.name} className="w-14 h-14 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-tico-black text-sm">{driver.name}</h3>
                    <div className="text-right">
                      <span className="font-bold text-lg text-tico-black block leading-none">S/ {driver.price}</span>
                      <span className="text-xs text-gray-500 font-medium">{driver.time}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{driver.car}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3.5 h-3.5 fill-tico-yellow text-tico-yellow" />
                    <span className="text-xs font-bold text-tico-black">{driver.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
