import { useState, useEffect, useRef, useCallback } from 'react';
import { Minus, Plus, Loader2, Settings, X, Check } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { api } from '../lib/api';
import { fetchOSRMRoute } from '../lib/osrm';
import Toast, { useToast } from './Toast';

interface RouteData {
  origin: [number, number];
  destination: [number, number];
  routeCoords: [number, number][];
}

interface OrderPanelProps {
  onTripCreated: (trip: any) => void;
  onRouteUpdate?: (route: RouteData | null) => void;
  isMapMoving?: boolean;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface RecentDest {
  name: string;
  lat: number;
  lng: number;
}

const categories = [
  { id: 'basico', label: 'Básico', emoji: '🚗', mult: 1.0 },
  { id: 'confort', label: 'Confort', emoji: '⚡', mult: 1.3 },
  { id: 'carga', label: 'Carga', emoji: '🚛', mult: 1.5 },
];

export default function OrderPanel({ onTripCreated, onRouteUpdate, isMapMoving }: OrderPanelProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCategory, setSelectedCategory] = useState('basico');
  const [destination, setDestination] = useState('');
  const [destCoords, setDestCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [autoAccept, setAutoAccept] = useState(false);
  const [recentDests, setRecentDests] = useState<RecentDest[]>([]);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'yape'>('efectivo');
  const [tripOptions, setTripOptions] = useState({ extraPassengers: false, childSeat: false, petWithMe: false, comments: '' });
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const originRef = useRef<{ lat: number; lng: number } | null>(null);
  const { toast, show: showToast, hide: hideToast } = useToast();

  // Hide bar state with 500ms debounce
  const [barVisible, setBarVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isMapMoving) {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      setBarVisible(false);
    } else {
      hideTimerRef.current = setTimeout(() => setBarVisible(true), 500);
    }
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, [isMapMoving]);

  // Fetch recent destinations
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{ ok: boolean; trips: any[] }>('/trips');
        if (res.trips?.length) {
          const seen = new Set<string>();
          const recents: RecentDest[] = [];
          for (const t of res.trips) {
            if (t.destAddress && t.destLat && t.destLng) {
              if (!seen.has(t.destAddress)) {
                seen.add(t.destAddress);
                recents.push({ name: t.destAddress, lat: t.destLat, lng: t.destLng });
              }
              if (recents.length >= 5) break;
            }
          }
          setRecentDests(recents);
        }
      } catch {}
    })();
  }, []);

  const searchNominatim = useCallback(async (query: string) => {
    if (query.length < 3) { setSearchResults([]); return; }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=-79.9,-6.7,-79.75,-6.85&bounded=1&limit=5`);
      const data: NominatimResult[] = await res.json();
      setSearchResults(data);
    } catch { setSearchResults([]); }
  }, []);

  const handleInputChange = (value: string) => {
    setDestination(value);
    setDestCoords(null);
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
        const cat = categories.find(c => c.id === selectedCategory);
        setPrice(Math.round(res.price * (cat?.mult || 1) * 100) / 100);
      }
      const origin: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      const dest: [number, number] = [coords.lat, coords.lng];
      try {
        const routeCoords = await fetchOSRMRoute(origin, dest);
        onRouteUpdate?.({ origin, destination: dest, routeCoords });
      } catch {}
      setStep(3);
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
    setSearchResults([]);
    await fetchEstimate({ lat, lng });
  };

  const selectRecentDest = async (dest: RecentDest) => {
    setDestination(dest.name);
    setDestCoords({ lat: dest.lat, lng: dest.lng });
    await fetchEstimate({ lat: dest.lat, lng: dest.lng });
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (basePrice) {
      const cat = categories.find(c => c.id === catId);
      setPrice(Math.round(basePrice * (cat?.mult || 1) * 100) / 100);
    }
  };

  const getRecommendedPrice = () => {
    if (!basePrice) return null;
    const cat = categories.find(c => c.id === selectedCategory);
    return Math.round(basePrice * (cat?.mult || 1) * 100) / 100;
  };

  const handleRequest = async () => {
    if (!destCoords) { showToast('Selecciona un destino válido', 'error'); return; }
    setLoading(true);
    try {
      const pos = await getPosition();
      const res = await api.post<{ ok: boolean; trip: any }>('/trips', {
        originLat: pos.coords.latitude,
        originLng: pos.coords.longitude,
        originAddress: 'Tu ubicación actual',
        destLat: destCoords.lat,
        destLng: destCoords.lng,
        destAddress: destination,
      });
      if (res.trip) {
        onTripCreated({ ...res.trip, offeredPrice: price, autoAccept, tripOptions, selectedCategory });
      }
    } catch (err: any) {
      showToast(err.message || 'Error al solicitar viaje', 'error');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  // Modal drag handling for step 2/3
  const modalY = useMotionValue(0);
  const windowH = typeof window !== 'undefined' ? window.innerHeight : 800;

  const handleModalDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 200) {
      // Dismiss
      if (step === 3) {
        setStep(2);
      } else {
        setStep(1);
        setSearchResults([]);
        onRouteUpdate?.(null);
      }
    }
    modalY.set(0);
  };

  return (
    <>
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} type={toast.type} />

      {/* STEP 1 — Bottom bar */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: barVisible ? 0 : 200 }}
            exit={{ y: 200 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-6"
          >
            <div className="bg-white rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4">
              {/* Vehicle type pills */}
              <div className="flex gap-2 mb-3">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>

              {/* Tappable card */}
              <button
                onClick={() => setStep(2)}
                className="w-full bg-gray-50 rounded-xl px-4 py-3.5 text-left active:scale-[0.98] transition-transform border border-gray-100"
              >
                <p className="text-gray-500 font-medium text-sm">¿A dónde vas? · ¿Por cuánto?</p>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 2 — Search modal */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: -windowH * 0.1, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleModalDragEnd}
            style={{ y: modalY }}
            className="absolute bottom-0 left-0 right-0 z-20"
            // 80% of screen
          >
            <div className="bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] overflow-hidden" style={{ height: '80vh' }}>
              {/* Handle */}
              <div className="pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />
              </div>

              <div className="px-5 pb-8 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 40px)' }}>
                {/* Origin/Destination inputs */}
                <div className="flex gap-3 mb-5">
                  {/* Dots + line */}
                  <div className="flex flex-col items-center pt-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                    <div className="w-0.5 flex-1 bg-gray-300 my-1" style={{ minHeight: 24 }} />
                    <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                  </div>
                  <div className="flex-1 space-y-2">
                    {/* Desde */}
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Desde</p>
                      <div className="bg-gray-50 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-900 border border-gray-100">
                        Tu ubicación actual
                      </div>
                    </div>
                    {/* ¿A dónde? */}
                    <div>
                      <p className="text-xs text-gray-400 font-medium">¿A dónde?</p>
                      <input
                        type="text"
                        autoFocus
                        placeholder="Buscar destino..."
                        value={destination}
                        onChange={e => handleInputChange(e.target.value)}
                        className="w-full bg-white rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-900 placeholder:text-gray-400 border border-gray-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Search results */}
                {searchResults.length > 0 && (
                  <div className="mb-4">
                    {searchResults.map(result => (
                      <button
                        key={result.place_id}
                        onClick={() => selectSearchResult(result)}
                        className="w-full flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all border-b border-gray-50 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {result.display_name.split(',').slice(0, 2).join(',')}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{result.display_name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Recent destinations */}
                {searchResults.length === 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-3">Destinos recientes</p>
                    {recentDests.length === 0 ? (
                      <p className="text-sm text-gray-400 py-4">Aún no tienes viajes recientes</p>
                    ) : (
                      <div className="space-y-1">
                        {recentDests.map((dest, i) => (
                          <button
                            key={`${dest.name}-${i}`}
                            onClick={() => selectRecentDest(dest)}
                            className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all"
                          >
                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            </div>
                            <span className="text-sm font-semibold text-gray-900 truncate">{dest.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 3 — Price configuration */}
      <AnimatePresence>
        {step === 3 && price !== null && (
          <motion.div
            key="step3"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: -windowH * 0.1, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleModalDragEnd}
            style={{ y: modalY }}
            className="absolute bottom-0 left-0 right-0 z-20"
          >
            <div className="bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] overflow-hidden" style={{ maxHeight: '80vh' }}>
              {/* Handle */}
              <div className="pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />
              </div>

              <div className="px-5 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 40px)' }}>
                {/* Back button */}
                <button
                  onClick={() => { setStep(2); onRouteUpdate?.(null); }}
                  className="text-sm text-emerald-600 font-medium mb-4 flex items-center gap-1"
                >
                  ← Cambiar destino
                </button>

                {/* Route summary */}
                <div className="flex items-center gap-2 mb-5 text-sm text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate flex-1">Tu ubicación</span>
                  <span className="text-gray-300">→</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span className="truncate flex-1 text-right font-medium text-gray-700">{destination}</span>
                </div>

                {/* Vehicle pills (also in step 3) */}
                <div className="flex gap-2 mb-5">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>

                {/* Big price */}
                <div className="mb-5 text-center">
                  <div className="flex items-center justify-center gap-5">
                    <button
                      onClick={() => setPrice(p => Math.max(1, (p || 0) - 0.5))}
                      className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Minus className="w-5 h-5 text-gray-600" />
                    </button>
                    <p className="text-4xl font-bold text-gray-900">S/ {price.toFixed(2)}</p>
                    <button
                      onClick={() => setPrice(p => (p || 0) + 0.5)}
                      className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Plus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  {getRecommendedPrice() && (
                    <p className="text-xs text-gray-400 mt-1">Precio recomendado: S/ {getRecommendedPrice()!.toFixed(2)}</p>
                  )}
                </div>

                {/* Auto-accept toggle */}
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-2xl mb-5">
                  <p className="text-sm text-gray-700 flex-1 pr-2">Aceptar automáticamente</p>
                  <button
                    onClick={() => setAutoAccept(!autoAccept)}
                    className={`w-12 h-7 rounded-full transition-colors shrink-0 ${autoAccept ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${autoAccept ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Bottom action bar: Payment | CTA | Settings */}
                <div className="flex items-center gap-2">
                  {/* Payment */}
                  <button
                    onClick={() => setShowPaymentSheet(true)}
                    className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl active:scale-90 transition-transform"
                  >
                    💵
                  </button>

                  {/* CTA */}
                  <button
                    onClick={handleRequest}
                    disabled={loading || !destCoords}
                    className="flex-1 bg-emerald-500 text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buscar ofertas'}
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => setShowSettingsSheet(true)}
                    className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl active:scale-90 transition-transform"
                  >
                    ⚙️
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment bottom sheet */}
      <AnimatePresence>
        {showPaymentSheet && (
          <motion.div
            key="payment-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-black/30"
            onClick={() => setShowPaymentSheet(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-4">Método de pago</h3>

              <button
                onClick={() => { setPaymentMethod('efectivo'); setShowPaymentSheet(false); }}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl mb-2 border-2 transition-all ${
                  paymentMethod === 'efectivo' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100'
                }`}
              >
                <span className="text-2xl">💵</span>
                <span className="font-semibold text-gray-900">Efectivo</span>
                {paymentMethod === 'efectivo' && <Check className="w-5 h-5 text-emerald-500 ml-auto" />}
              </button>

              <button
                disabled
                className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-100 opacity-50"
              >
                <span className="text-2xl">📱</span>
                <span className="font-semibold text-gray-400">Yape</span>
                <span className="text-xs text-gray-400 ml-auto">Próximamente</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings bottom sheet */}
      <AnimatePresence>
        {showSettingsSheet && (
          <motion.div
            key="settings-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-black/30"
            onClick={() => setShowSettingsSheet(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-4">Opciones del viaje</h3>

              <label className="flex items-center gap-3 py-3 border-b border-gray-50">
                <input
                  type="checkbox"
                  checked={tripOptions.extraPassengers}
                  onChange={e => setTripOptions(o => ({ ...o, extraPassengers: e.target.checked }))}
                  className="w-5 h-5 rounded accent-emerald-500"
                />
                <span className="text-sm font-medium text-gray-900">+4 pasajeros</span>
              </label>

              <label className="flex items-center gap-3 py-3 border-b border-gray-50">
                <input
                  type="checkbox"
                  checked={tripOptions.childSeat}
                  onChange={e => setTripOptions(o => ({ ...o, childSeat: e.target.checked }))}
                  className="w-5 h-5 rounded accent-emerald-500"
                />
                <span className="text-sm font-medium text-gray-900">Silla de niño</span>
              </label>

              <label className="flex items-center gap-3 py-3 border-b border-gray-50">
                <input
                  type="checkbox"
                  checked={tripOptions.petWithMe}
                  onChange={e => setTripOptions(o => ({ ...o, petWithMe: e.target.checked }))}
                  className="w-5 h-5 rounded accent-emerald-500"
                />
                <span className="text-sm font-medium text-gray-900">Mascota conmigo</span>
              </label>

              <textarea
                placeholder="Comentarios..."
                value={tripOptions.comments}
                onChange={e => setTripOptions(o => ({ ...o, comments: e.target.value }))}
                className="w-full mt-3 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 border border-gray-200 outline-none focus:border-emerald-500 resize-none"
                rows={3}
              />

              <button
                onClick={() => setShowSettingsSheet(false)}
                className="w-full mt-4 bg-emerald-500 text-white font-bold py-3 rounded-2xl active:scale-[0.98] transition-transform"
              >
                Listo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
