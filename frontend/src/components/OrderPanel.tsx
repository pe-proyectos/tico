import { useState } from 'react';
import { MapPin, Navigation, Car, Truck, Zap, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderPanelProps {
  onRequest: (price: number) => void;
}

const categories = [
  { id: 'basico', name: 'Tico Básico', icon: Car },
  { id: 'confort', name: 'Tico Confort', icon: Zap },
  { id: 'carga', name: 'Tico Carga', icon: Truck },
];

const quickDestinations = [
  { name: 'Real Plaza', icon: '🛍️' },
  { name: 'Open Plaza', icon: '🛒' },
  { name: 'Terminal', icon: '🚌' },
  { name: 'Hospital', icon: '🏥' },
  { name: 'USAT', icon: '🎓' },
];

export default function OrderPanel({ onRequest }: OrderPanelProps) {
  const [price, setPrice] = useState<number>(12);
  const [selectedCategory, setSelectedCategory] = useState('basico');
  const [destination, setDestination] = useState('');

  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-8"
    >
      <div className="glass-panel rounded-3xl p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5"></div>

        {/* Quick Destinations */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-2 scrollbar-hide -mx-2 px-2">
          {quickDestinations.map((dest) => (
            <button 
              key={dest.name}
              onClick={() => setDestination(dest.name)}
              className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl whitespace-nowrap active:scale-95 transition-transform border border-gray-100 hover:bg-gray-100"
            >
              <span>{dest.icon}</span>
              <span className="font-semibold text-sm text-tico-black">{dest.name}</span>
            </button>
          ))}
        </div>

        {/* Locations */}
        <div className="space-y-3 mb-6 relative">
          <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200 z-0"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-0.5">Origen</p>
              <p className="text-sm font-semibold text-tico-black">Tu ubicación actual</p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-tico-yellow/20 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1 bg-white rounded-2xl px-4 py-3 border border-gray-200 shadow-sm focus-within:border-tico-yellow focus-within:ring-2 focus-within:ring-tico-yellow/20 transition-all flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="¿A dónde vas?" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent outline-none text-sm font-semibold text-tico-black placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-4 scrollbar-hide -mx-2 px-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center min-w-[90px] p-3 rounded-2xl transition-all ${
                  isSelected 
                    ? 'bg-tico-black text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-tico-yellow' : 'text-gray-500'}`} />
                <span className="text-xs font-semibold whitespace-nowrap">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-semibold text-gray-500">Ofrece tu tarifa</span>
            <div className="flex items-center text-3xl font-bold text-tico-black tracking-tight">
              <span className="mr-1">S/</span>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(Math.max(1, Number(e.target.value)))}
                className="w-20 bg-transparent outline-none text-right"
              />
            </div>
          </div>
          <div className="text-xs text-gray-400 text-right mb-3 font-medium">Precio sugerido: S/ 12</div>
          
          <div className="flex gap-2 mb-4">
            <button onClick={() => setPrice(p => Math.max(1, p - 1))} className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl font-medium text-gray-600 active:scale-95 transition-transform">-</button>
            <div className="flex-1 flex gap-2">
              {[1, 2, 5].map(amount => (
                <button 
                  key={amount}
                  onClick={() => setPrice(p => p + amount)}
                  className="flex-1 h-12 rounded-2xl bg-tico-yellow/10 text-yellow-700 font-semibold text-sm active:scale-95 transition-transform border border-tico-yellow/20"
                >
                  +S/ {amount}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button 
          onClick={() => onRequest(price)}
          className="w-full bg-tico-yellow text-tico-black font-bold text-lg py-4 rounded-2xl shadow-[0_4px_14px_rgba(255,204,0,0.4)] active:scale-[0.98] transition-transform"
        >
          Solicitar Tico
        </button>
      </div>
    </motion.div>
  );
}
