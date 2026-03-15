import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, Plus, Banknote } from 'lucide-react';

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
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Banknote className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-tico-black">Efectivo</h3>
              <p className="text-sm text-gray-500">Pago al conductor</p>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full border-4 border-tico-yellow bg-white"></div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-tico-black">•••• 4242</h3>
              <p className="text-sm text-gray-500">Expira 12/28</p>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-white"></div>
        </div>

        <button className="w-full bg-gray-100 text-tico-black font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2 mt-6">
          <Plus className="w-5 h-5" /> Agregar tarjeta
        </button>
      </div>
    </motion.div>
  );
}
