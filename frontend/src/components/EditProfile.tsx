import { motion } from 'motion/react';
import { ArrowLeft, Camera } from 'lucide-react';

export default function EditProfile({ onBack }: { onBack: () => void }) {
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
        <h1 className="text-2xl font-bold text-tico-black">Editar Perfil</h1>
      </div>

      <div className="p-6">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img 
              src="https://picsum.photos/seed/user-profile/200/200" 
              alt="Profile" 
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              referrerPolicy="no-referrer"
            />
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-tico-yellow rounded-full border-4 border-white flex items-center justify-center shadow-sm active:scale-95 transition-transform">
              <Camera className="w-5 h-5 text-tico-black" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Nombre completo</label>
            <input type="text" defaultValue="Juan Pérez" className="w-full font-semibold text-tico-black outline-none bg-transparent" />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Número de celular</label>
            <input type="tel" defaultValue="+51 987 654 321" className="w-full font-semibold text-tico-black outline-none bg-transparent" />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Correo electrónico</label>
            <input type="email" defaultValue="juan.perez@email.com" className="w-full font-semibold text-tico-black outline-none bg-transparent" />
          </div>
        </div>

        <button 
          onClick={onBack}
          className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform mt-8"
        >
          Guardar cambios
        </button>
      </div>
    </motion.div>
  );
}
