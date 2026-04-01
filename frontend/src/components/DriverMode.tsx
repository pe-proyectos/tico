import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CarFront, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import Toast, { useToast } from './Toast';

export default function DriverMode({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'info' | 'form'>('info');
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast, show: showToast, hide: hideToast } = useToast();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await api.post('/driver/register', { licensePlate, vehicleBrand, vehicleModel, vehicleColor });
      setSuccess(true);
      // Update local auth
      const auth = JSON.parse(localStorage.getItem('tico_auth') || '{}');
      auth.role = 'driver';
      localStorage.setItem('tico_auth', JSON.stringify(auth));
      setTimeout(() => { window.location.href = '/driver'; }, 1500);
    } catch (err: any) {
      showToast(err.message || 'Error al registrar', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} className="fixed inset-0 bg-tico-green z-50 flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 className="w-20 h-20 text-green-600 mb-4" />
        <h1 className="text-3xl font-bold text-tico-black">¡Registro exitoso!</h1>
        <p className="text-tico-black/70 mt-2">Redirigiendo al panel de conductor...</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-tico-green z-50 overflow-y-auto flex flex-col"
    >
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} type={toast.type} />
      <div className="pt-12 pb-4 px-6 sticky top-0 z-10 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-tico-black/10 flex items-center justify-center">
          <ArrowLeft className="w-6 h-6 text-tico-black" />
        </button>
      </div>

      {step === 'info' ? (
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-8">
            <CarFront className="w-16 h-16 text-tico-black" />
          </div>
          
          <h1 className="text-4xl font-bold text-tico-black mb-4 tracking-tight">Conduce con Tico</h1>
          <p className="text-tico-black/80 font-medium text-lg mb-8 max-w-xs">
            Genera ingresos extra manejando en tu tiempo libre. Tú decides cuándo y dónde.
          </p>

          <div className="bg-white/50 rounded-3xl p-6 w-full text-left space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-tico-black" />
              <span className="font-semibold text-tico-black">Sin comisiones - 100% de cada viaje</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-tico-black" />
              <span className="font-semibold text-tico-black">Plan gratuito para empezar</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-tico-black" />
              <span className="font-semibold text-tico-black">Soporte para conductores</span>
            </div>
          </div>

          <button 
            onClick={() => setStep('form')}
            className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform mt-auto"
          >
            Comenzar registro
          </button>
        </div>
      ) : (
        <div className="p-6 flex-1 flex flex-col">
          <h1 className="text-2xl font-bold text-tico-black mb-6">Datos del vehículo</h1>
          
          <div className="space-y-4 flex-1">
            <div className="bg-white/50 rounded-2xl p-4 border border-tico-black/10">
              <label className="block text-xs font-bold text-tico-black/60 mb-1 uppercase">Placa</label>
              <input type="text" value={licensePlate} onChange={e => setLicensePlate(e.target.value.toUpperCase())} placeholder="ABC-123" className="w-full bg-transparent outline-none font-bold text-tico-black placeholder:text-tico-black/30" />
            </div>
            <div className="bg-white/50 rounded-2xl p-4 border border-tico-black/10">
              <label className="block text-xs font-bold text-tico-black/60 mb-1 uppercase">Marca</label>
              <input type="text" value={vehicleBrand} onChange={e => setVehicleBrand(e.target.value)} placeholder="Chevrolet" className="w-full bg-transparent outline-none font-bold text-tico-black placeholder:text-tico-black/30" />
            </div>
            <div className="bg-white/50 rounded-2xl p-4 border border-tico-black/10">
              <label className="block text-xs font-bold text-tico-black/60 mb-1 uppercase">Modelo</label>
              <input type="text" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} placeholder="Spark" className="w-full bg-transparent outline-none font-bold text-tico-black placeholder:text-tico-black/30" />
            </div>
            <div className="bg-white/50 rounded-2xl p-4 border border-tico-black/10">
              <label className="block text-xs font-bold text-tico-black/60 mb-1 uppercase">Color</label>
              <input type="text" value={vehicleColor} onChange={e => setVehicleColor(e.target.value)} placeholder="Amarillo" className="w-full bg-transparent outline-none font-bold text-tico-black placeholder:text-tico-black/30" />
            </div>
          </div>

          <button 
            onClick={handleRegister}
            disabled={!licensePlate || !vehicleBrand || !vehicleModel || !vehicleColor || loading}
            className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform mt-6 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registrarme como conductor'}
          </button>
        </div>
      )}
    </motion.div>
  );
}
