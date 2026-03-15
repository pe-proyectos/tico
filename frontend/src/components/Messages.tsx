import { motion } from 'motion/react';
import { ArrowLeft, MessageSquare } from 'lucide-react';

export default function Messages({ onBack }: { onBack: () => void }) {
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
        <h1 className="text-2xl font-bold text-tico-black">Mensajes</h1>
      </div>

      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-10 h-10 text-gray-300" />
        </div>
        <p className="text-gray-400 font-medium text-lg">No hay mensajes</p>
        <p className="text-gray-300 text-sm mt-1">Tus conversaciones aparecerán aquí</p>
      </div>
    </motion.div>
  );
}
