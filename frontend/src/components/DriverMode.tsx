import { motion } from 'motion/react';
import { ArrowLeft, CarFront, CheckCircle2 } from 'lucide-react';

export default function DriverMode({ onBack }: { onBack: () => void }) {
  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-tico-yellow z-50 overflow-y-auto flex flex-col"
    >
      <div className="pt-12 pb-4 px-6 sticky top-0 z-10 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-tico-black/10 flex items-center justify-center">
          <ArrowLeft className="w-6 h-6 text-tico-black" />
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-8">
          <CarFront className="w-16 h-16 text-tico-black" />
        </div>
        
        <h1 className="text-4xl font-bold text-tico-black mb-4 tracking-tight">
          Conduce con Tico
        </h1>
        <p className="text-tico-black/80 font-medium text-lg mb-8 max-w-xs">
          Genera ingresos extra manejando en tu tiempo libre. Tú decides cuándo y dónde.
        </p>

        <div className="bg-white/50 rounded-3xl p-6 w-full text-left space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-tico-black" />
            <span className="font-semibold text-tico-black">Cero comisiones el primer mes</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-tico-black" />
            <span className="font-semibold text-tico-black">Pagos diarios a tu cuenta</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-tico-black" />
            <span className="font-semibold text-tico-black">Soporte 24/7 para conductores</span>
          </div>
        </div>

        <button className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform mt-auto">
          Comenzar registro
        </button>
      </div>
    </motion.div>
  );
}
