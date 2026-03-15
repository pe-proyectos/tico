import { motion } from 'motion/react';
import { ArrowLeft, Banknote, Wallet } from 'lucide-react';

export default function PaymentMethods({ onBack }: { onBack: () => void }) {
  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto"
    >
      <div className="bg-white pt-12 pb-4 px-6 shadow-sm sticky top-0 z-10 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft className="w-6 h-6 text-tico-black" />
        </button>
        <h1 className="text-2xl font-bold text-tico-black">Métodos de pago</h1>
      </div>

      <div className="p-6 space-y-4">
        <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-tico-yellow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Banknote className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-tico-black">Efectivo</h3>
              <p className="text-sm text-gray-500">Pago directo al conductor</p>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full border-4 border-tico-yellow bg-white"></div>
        </div>

        <div className="bg-gray-50 rounded-3xl p-6 text-center mt-8">
          <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Próximamente</p>
          <p className="text-gray-300 text-sm mt-1">Yape y tarjetas de crédito</p>
        </div>
      </div>
    </motion.div>
  );
}
