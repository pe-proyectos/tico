import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Car, Truck, Zap, Search, Loader2, Minus, Plus, SlidersHorizontal, Banknote } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import { api } from '../lib/api';
import { fetchOSRMRoute } from '../lib/osrm';
import Toast, { useToast } from './Toast';
import TripOptions from './TripOptions';

interface RouteData {
  origin: [number, number];
  destination: [number, number];
  routeCoords: [number, number][];
}

interface OrderPanelProps {
  onTripCreated: (trip: any) => void;
  onRouteUpdate?: (route: RouteData | null) => void;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const categories = [
  { id: 'basico', name: 'Tico Básico', icon: Car, emoji: '🚗', desc: '4 pasajeros', sub: 'Viaje a tu precio', mult: 1.0 },
  { id: 'confort', name: 'Tico Confort', icon: Zap, emoji: '⚡', desc: '4 pasajeros', sub: 'Viaje premium', mult: 1.3 },
  { id: 'carga', name: 'Tico Carga', icon: Truck, emoji: '🚛', desc: '', sub: 'Envíos y mudanzas', mult: 1.5 },
];

const quickDestinations = [
  { name: 'Real Plaza', icon: '🛍️', lat: -6.7650, lng: -79.8380 },
  { name: 'Open Plaza', icon: '🛒', lat: -6.7630, lng: -79.8410 },
  { name: 'Terminal', icon: '🚌', lat: -6.7800, lng: -79.8430 },
  { name: 'Hospital', icon: '🏥', lat: -6.7740, lng: -79.8350 },
  { name: 'USAT', icon: '🎓', lat: -6.7560, lng: -79.8440 },
];

export default function OrderPanel({ onTripCreated, onRouteUpdate }: OrderPanelProps) {
  // Step: 'destination' or 'configure'
  const [step, setStep] = useState<'destination' | 'configure'>('destination');
  const [price, setPrice] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('basico');
  const [destination, setDestination] = useState('');
  const [destCoords, setDestCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [tripOptions, setTripOptions] = useState({ extraPassengers: false, petWithMe: false, comments: '' });
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const { toast, show: showToast, hide: hideToast } = useToast();
  const originRef = useRef<{ lat: number; lng: number } | null>(null);

  // Drag
  const dragY = useMotionValue(0);
  const windowH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const defaultY = windowH * 0.4; // panel at 60% height
  const minY = windowH * 0.1; // expanded 90%
  const maxY = windowH * 0.7; // collapsed 30%

  const searchNominatim = useCallback(async (query: string) => {
    if (query.length < 3) { setSearchResults([]); setShowResults(false); return; }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=-79.9,-6.7,-79.75,-6.85&bounded=1&limit=5`);
      const data: NominatimResult[] = await res.json();
      setSearchResults(data);
      setShowResults(data.length > 0);
    } catch {
      setSearchResults([]);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setDestination(value);
    setDestCoords(null);
    setBasePrice(null);
    setPrice(null);
    setStep('destination');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchNominatim(value), 500);
  };

  const getPosition = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 }));

  const fetchEstimate = async (coords: { lat: number; lng: number }) => {
    try {
      const pos = await getPosition();
      originRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const res = await api.get<{ ok: boolean; price: number }>(`/trips/estimate?originLat=${pos.coords.latitude}&originLng=${pos.coords.longitude}&destLat=${coords.lat}&destLng=${coords.lng}`);
      if (res.price) {
        setBasePrice(res.price);
        setPrice(res.price);
      }
      const origin: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      const dest: [number, number] = [coords.lat, coords.lng];
      try {
        const routeCoords = await fetchOSRMRoute(origin, dest);
        onRouteUpdate?.({ origin, destination: dest, routeCoords });
      } catch {}
      setStep('configure');
    } catch {
      onRouteUpdate?.(null);
    }
  };

  const selectSearchResult = async (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const shortName = result.display_name.split(',').slice(0, 2).join(',').trim();
    setDestination(shortName);
    setDestCoords({ lat, lng });
    setShowResults(false);
    setSearchResults([]);
    await fetchEstimate({ lat, lng });
  };

  const handleSelectDest = async (dest: typeof quickDestinations[0]) => {
    setDestination(dest.name);
    setDestCoords({ lat: dest.lat, lng: dest.lng });
    setShowResults(false);
    await fetchEstimate({ lat: dest.lat, lng: dest.lng });
  };

  // When category changes, recalculate price
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (basePrice) {
      const cat = categories.find(c => c.id === catId);
      const newPrice = Math.round(basePrice * (cat?.mult || 1) * 100) / 100;
      setPrice(newPrice);
    }
  };

  const getCategoryPrice = (catId: string) => {
    if (!basePrice) return null;
    const cat = categories.find(c => c.id === catId);
    return Math.round(basePrice * (cat?.mult || 1) * 100) / 100;
  };

  const getRecommendedPrice = () => {
    if (!basePrice) return null;
    const cat = categories.find(c => c.id === selectedCategory);
    return Math.round(basePrice * (cat?.mult || 1) * 100) / 100;
  };

  const handleRequest = async () => {
    if (!destCoords) {
      showToast('Selecciona un destino válido', 'error');
      return;
    }
    setLoading(true);
    try {
      const pos = await getPosition();
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
        onTripCreated({ ...res.trip, offeredPrice: price, autoAccept, tripOptions, selectedCategory });
      }
    } catch (err: any) {
      showToast(err.message || 'Error al solicitar viaje', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  return (
    <>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: -(windowH * 0.3), bottom: windowH * 0.3 }}
        dragElastic={0.1}
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{ maxHeight: '90vh' }}
      >
        <Toast message={toast.message} visible={toast.visible} onClose={hideToast} type={toast.type} />
        <div className="bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
          {/* Handle */}
          <div className="pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />
          </div>

          <div className="px-5 pb-8 overflow-y-auto" style={{ maxHeight: '80vh' }}>
            {step === 'destination' && (
              <>
                {/* Quick Destinations */}
                <div className="flex gap-2.5 overflow-x-auto pb-3 mb-3 scrollbar-hide">
                  {quickDestinations.map((dest) => (
                    <button
                      key={dest.name}
                      onClick={() => handleSelectDest(dest)}
                      className="flex items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-xl whitespace-nowrap active:scale-95 transition-transform border border-gray-100 hover:bg-gray-100"
                    >
                      <span>{dest.icon}</span>
                      <span className="font-semibold text-sm text-gray-900">{dest.name}</span>
                    </button>
                  ))}
                </div>

                {/* Origin / Destination */}
                <div className="space-y-3 relative">
                  <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200 z-0" />

                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Origen</p>
                      <p className="text-sm font-semibold text-gray-900">Tu ubicación actual</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                    </div>
                    <div className="relative flex-1">
                      <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/30 transition-all flex items-center gap-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="¿A dónde vas?"
                          value={destination}
                          onChange={(e) => handleInputChange(e.target.value)}
                          onFocus={() => searchResults.length > 0 && setShowResults(true)}
                          className="w-full bg-transparent outline-none text-sm font-semibold text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50 max-h-48 overflow-y-auto">
                          {searchResults.map((result) => (
                            <button
                              key={result.place_id}
                              onClick={() => selectSearchResult(result)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                            >
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {result.display_name.split(',').slice(0, 2).join(',')}
                              </p>
                              <p className="text-xs text-gray-400 truncate">{result.display_name}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 'configure' && price !== null && (
              <>
                {/* Back to destination */}
                <button
                  onClick={() => setStep('destination')}
                  className="text-sm text-emerald-600 font-medium mb-3 flex items-center gap-1"
                >
                  ← Cambiar destino
                </button>

                {/* Route summary */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="truncate flex-1">Tu ubicación</span>
                  <span className="text-gray-300">→</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="truncate flex-1 text-right font-medium text-gray-700">{destination}</span>
                </div>

                {/* Category cards */}
                <div className="space-y-2 mb-5">
                  {categories.map((cat) => {
                    const catPrice = getCategoryPrice(cat.id);
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all border-2 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-2xl">{cat.emoji}</span>
                        <div className="flex-1 text-left">
                          <p className={`font-bold text-sm ${isSelected ? 'text-emerald-700' : 'text-gray-900'}`}>{cat.name}</p>
                          <p className="text-xs text-gray-500">
                            {cat.desc ? `${cat.desc} · ` : ''}{cat.sub}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${isSelected ? 'text-emerald-700' : 'text-gray-900'}`}>
                            S/ {catPrice?.toFixed(2)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Price adjuster */}
                <div className="mb-5">
                  <p className="text-sm text-gray-500 font-medium text-center mb-2">Ofrece tu tarifa</p>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setPrice(p => Math.max(1, (p || 0) - 0.5))}
                      className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Minus className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-gray-900">S/ {price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => setPrice(p => (p || 0) + 0.5)}
                      className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Plus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  {getRecommendedPrice() && (
                    <p className="text-xs text-gray-400 text-center mt-1">
                      Precio recomendado: S/ {getRecommendedPrice()!.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Auto-accept toggle */}
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-2xl mb-3">
                  <p className="text-sm text-gray-700 flex-1 pr-2">
                    Aceptar automáticamente al conductor más cercano por S/ {price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => setAutoAccept(!autoAccept)}
                    className={`w-12 h-7 rounded-full transition-colors shrink-0 ${autoAccept ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${autoAccept ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Payment + Options row */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-900">S/ {price.toFixed(2)} Efectivo</span>
                  </div>
                  <button
                    onClick={() => setShowOptions(true)}
                    className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <SlidersHorizontal className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Submit */}
                <button
                  onClick={handleRequest}
                  disabled={loading || !destCoords}
                  className="w-full bg-emerald-500 text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buscar ofertas'}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showOptions && (
          <TripOptions
            key="trip-options"
            extraPassengers={tripOptions.extraPassengers}
            petWithMe={tripOptions.petWithMe}
            comments={tripOptions.comments}
            onUpdate={setTripOptions}
            onClose={() => setShowOptions(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
