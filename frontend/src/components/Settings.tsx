import { motion } from 'motion/react';
import { ArrowLeft, Bell, Shield, Globe, Moon, ChevronRight } from 'lucide-react';

export default function Settings({ onBack }: { onBack: () => void }) {
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
        <h1 className="text-2xl font-bold text-tico-black">Configuración</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <SettingItem icon={Bell} title="Notificaciones" />
          <SettingItem icon={Shield} title="Privacidad y Seguridad" />
          <SettingItem icon={Globe} title="Idioma" value="Español" />
          <SettingItem icon={Moon} title="Modo Oscuro" value="Desactivado" />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <button className="w-full text-left p-4 font-semibold text-tico-black hover:bg-gray-50 border-b border-gray-50">Términos y Condiciones</button>
          <button className="w-full text-left p-4 font-semibold text-tico-black hover:bg-gray-50 border-b border-gray-50">Política de Privacidad</button>
          <button className="w-full text-left p-4 font-semibold text-red-500 hover:bg-red-50">Eliminar cuenta</button>
        </div>
      </div>
    </motion.div>
  );
}

function SettingItem({ icon: Icon, title, value }: { icon: any, title: string, value?: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors active:bg-gray-100">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-tico-black" />
        </div>
        <span className="font-semibold text-tico-black">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-gray-500 font-medium">{value}</span>}
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );
}
