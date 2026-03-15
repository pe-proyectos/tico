import { useState } from 'react';
import { MapPin, Navigation, Car, Truck, Zap, Search, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../lib/api';
import { fetchOSRMRoute } from '../lib/osrm';

interface RouteData {
  origin: [number, number];
  destination: [number, number];
  routeCoords: [number, number][];
}

interface OrderPanelProps {
  onTripCreated: (trip: any) => void;
  onRouteUpdate?: (route: RouteData | null) => void;
}

const categories = [
  { id: 'basico', name: 'Tico Básico', icon: Car },
  { id: 'confort', name: 'Tico Confort', icon: Zap },
  { id: 'carga', name: 'Tico Carga', icon: Truck },
];

const quickDestinations = [
  { name: 'Real Plaza', icon: '🛍️', lat: -6.7650, lng: -79.8380 },
  { name: 'Open Plaza', icon: '🛒', lat: -6.7630, lng: -79.8410 },
  { name: 'Terminal', icon: '🚌', lat: -6.7800, lng: -79.8430 },
  { name: 'Hospital', icon: '🏥', lat: -6.7740, lng: -79.8350 },
  { name: 'USAT', icon: '🎓', lat: -6.7560, lng: -79.8440 },
];

export default function OrderPanel({ onTripCreated, onRouteUpdate }: OrderPanelProps) {
  const [price, setPrice] = useState<number>(12);
  const [selectedCategory, setSelectedCategory] = useState('basico');
  const [destination, setDestination] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const getDestCoords = () => {
    const found = quickDestinations.find(d => d.name === destination);
    return found ? { lat: found.lat, lng: found.lng } : null;
  };

  const handleSelectDest = async (dest: typeof quickDestinations[0]) => {
    setDestination(dest.name);
    // Try to get estimate
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      );
      const res = await api.get<{ ok: boolean; price: number }>(`/trips/estimate?originLat=${pos.coords.latitude}&originLng=${pos.coords.longitude}&destLat=${dest.lat}&destLng=${dest.lng}`);
      if (res.price) {
        setSuggestedPrice(res.price);
        setPrice(res.price);
      }
      // Fetch and show route preview
      const origin: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      const destination: [number, number] = [dest.lat, dest.lng];
      try {
        const routeCoords = await fetchOSRMRoute(origin, destination);
        onRouteUpdate?.({ origin, destination, routeCoords });
      } catch {}
    } catch {
      onRouteUpdate?.(null);
    }
  };

  const handleRequest = async () => {
    const destCoords = getDestCoords();
    if (!destCoords) {
      alert('Selecciona un destino válido');
      return;
    }
    setLoading(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      );
      const tripData = {
        originLat: pos.coords.latitude,
        originLng: pos.coords.longitude,
        originAddress: 'Tu ubicación actual',
        destLat: destCoords.lat,
        destLng: destCoords.lng,
        destAddress: destination,
      };
      const res = await api.post<{ ok: boolean; trip: any }>('/trips', tripData);
      if (res.trip) {
        onTripCreated(res.trip);
      }
    } catch (err: any) {
      alert(err.message || 'Error al solicitar viaje');
    } finally {
      setLoading(false);
    }
  };

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
              onClick={() => handleSelectDest(dest)}
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
          <div className="text-xs text-gray-400 text-right mb-3 font-medium">Precio sugerido: S/ {suggestedPrice ?? 12}</div>
          
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
          onClick={handleRequest}
          disabled={loading || !destination}
          className="w-full bg-tico-yellow text-tico-black font-bold text-lg py-4 rounded-2xl shadow-[0_4px_14px_rgba(255,204,0,0.4)] active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Solicitar Tico'}
        </button>
      </div>
    </motion.div>
  );
}
