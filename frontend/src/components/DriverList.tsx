import { motion } from 'motion/react';
import { Minus, Plus, MapPin, Banknote, X, User } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { api } from '../lib/api';
import { wsManager } from '../lib/websocket';

interface DriverListProps {
  tripId: string;
  proposedPrice: number;
  originAddress?: string;
  destAddress?: string;
  autoAccept?: boolean;
  onCancel: () => void;
  onDriverAccepted: (trip: any) => void;
}

export default function DriverList({
  tripId,
  proposedPrice,
  originAddress = 'Tu ubicación actual',
  destAddress = 'Destino',
  autoAccept: initialAutoAccept = false,
  onCancel,
  onDriverAccepted,
}: DriverListProps) {
  const [price, setPrice] = useState(proposedPrice);
  const [autoAccept, setAutoAccept] = useState(initialAutoAccept);
  const [searching, setSearching] = useState(true);
  const [driversViewing, setDriversViewing] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 min countdown
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef(Date.now());

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Simulate drivers viewing (MVP - no real backend for this)
  useEffect(() => {
    const interval = setInterval(() => {
      setDriversViewing(Math.floor(Math.random() * 4) + 1);
    }, 5000);
    setDriversViewing(Math.floor(Math.random() * 3) + 1);
    return () => clearInterval(interval);
  }, []);

  // Poll + WS
  useEffect(() => {
    const poll = () => {
      api.get<{ ok: boolean; trip: any }>(`/trips/${tripId}`)
        .then(res => {
          if (['ACCEPTED', 'DRIVER_ARRIVING', 'IN_PROGRESS'].includes(res.trip?.status)) {
            setSearching(false);
            onDriverAccepted(res.trip);
          } else if (res.trip?.status === 'CANCELLED') {
            onCancel();
          }
        })
        .catch(() => {});
    };
    pollRef.current = setInterval(poll, 3000);

    wsManager.connect();
    const unsub = wsManager.onTripUpdate((data: any) => {
      if (data.tripId === tripId || data.trip?.id === tripId) {
        const status = data.status || data.trip?.status;
        if (['ACCEPTED', 'DRIVER_ARRIVING', 'IN_PROGRESS'].includes(status)) {
          setSearching(false);
          onDriverAccepted(data.trip || data);
        } else if (status === 'CANCELLED') {
          onCancel();
        }
      }
    });

    return () => { if (pollRef.current) clearInterval(pollRef.current); unsub(); };
  }, [tripId]);

  const handleCancel = async () => {
    try { await api.post(`/trips/${tripId}/cancel`); } catch {}
    onCancel();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      drag="y"
      dragConstraints={{ top: -(window.innerHeight * 0.3), bottom: window.innerHeight * 0.3 }}
      dragElastic={0.1}
      className="absolute bottom-0 left-0 right-0 z-30"
    >
      <div className="bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Handle */}
        <div className="pt-3 pb-2 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />
        </div>

        <div className="px-5 pb-8 overflow-y-auto" style={{ maxHeight: '80vh' }}>
          {/* Drivers viewing */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(driversViewing, 4) }).map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-gray-700">
              {driversViewing} conductor{driversViewing !== 1 ? 'es' : ''} viendo tu solicitud
            </p>
          </div>

          {/* Timer + status */}
          <div className="bg-emerald-50 rounded-2xl p-4 mb-5 text-center">
            <p className="text-sm text-emerald-700 font-medium mb-1">
              {timeLeft > 60 ? 'Buen precio. Tu solicitud tiene prioridad' : 'Sube tu tarifa para atraer conductores'}
            </p>
            <p className="text-3xl font-bold text-emerald-700">{formatTime(timeLeft)}</p>
          </div>

          {/* Price adjuster */}
          <div className="mb-5">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPrice(p => Math.max(1, p - 0.5))}
                className="flex items-center gap-1 px-4 py-2.5 bg-gray-100 rounded-xl active:scale-90 transition-transform"
              >
                <Minus className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-600">0.50</span>
              </button>
              <div className="text-center min-w-[120px]">
                <p className="text-4xl font-bold text-gray-900">S/ {price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => setPrice(p => p + 0.5)}
                className="flex items-center gap-1 px-4 py-2.5 bg-gray-100 rounded-xl active:scale-90 transition-transform"
              >
                <Plus className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-600">0.50</span>
              </button>
            </div>
            {timeLeft <= 60 && (
              <button
                onClick={() => setPrice(p => p + 1)}
                className="w-full mt-3 py-2.5 bg-emerald-100 text-emerald-700 font-bold rounded-xl active:scale-[0.98] transition-transform"
              >
                Subir tarifa
              </button>
            )}
          </div>

          {/* Auto-accept */}
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

          {/* Payment */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 mb-4">
            <Banknote className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-gray-900">S/ {price.toFixed(2)} Efectivo</span>
          </div>

          {/* Origin / Destination */}
          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <p className="text-sm text-gray-700 truncate">{originAddress}</p>
            </div>
            <div className="ml-1.5 w-0.5 h-4 bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
              <p className="text-sm text-gray-700 truncate font-medium">{destAddress}</p>
            </div>
          </div>

          {/* Cancel */}
          <button
            onClick={handleCancel}
            className="w-full py-3.5 border-2 border-gray-200 text-gray-500 font-bold rounded-2xl active:scale-[0.98] transition-transform"
          >
            Cancelar solicitud
          </button>
        </div>
      </div>
    </motion.div>
  );
}
