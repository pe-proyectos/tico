import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, MessageCircle, PhoneCall, FileText } from 'lucide-react';
import Toast, { useToast } from './Toast';

export default function Support({ onBack }: { onBack: () => void }) {
  const { toast, show: showToast, hide: hideToast } = useToast();

  const handleChat = () => {
    window.open('https://wa.me/51987654321?text=Necesito%20ayuda%20con%20Tico', '_blank');
  };

  const handleEmergency = () => {
    window.location.href = 'tel:105';
  };

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto"
    >
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} type={toast.type} />
      <div className="bg-white pt-12 pb-4 px-6 shadow-sm sticky top-0 z-10 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft className="w-6 h-6 text-tico-black" />
        </button>
        <h1 className="text-2xl font-bold text-tico-black">Soporte</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-tico-green/20 rounded-3xl p-6 text-center">
          <h2 className="text-xl font-bold text-tico-black mb-2">¿En qué podemos ayudarte?</h2>
          <p className="text-sm text-gray-600 mb-4">Nuestro equipo está disponible 24/7</p>
          <button onClick={handleChat} className="bg-tico-black text-white font-bold py-3 px-6 rounded-2xl w-full flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" /> Iniciar Chat
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <SupportItem icon={PhoneCall} title="Llamar a emergencias" color="text-red-500" bg="bg-red-50" onClick={handleEmergency} />
          <SupportItem icon={FileText} title="Reportar un problema con un viaje" onClick={() => showToast('Próximamente', 'info')} />
          <SupportItem icon={FileText} title="Objetos perdidos" onClick={() => showToast('Próximamente', 'info')} />
          <SupportItem icon={FileText} title="Preguntas frecuentes" onClick={() => showToast('Próximamente', 'info')} />
        </div>
      </div>
    </motion.div>
  );
}

function SupportItem({ icon: Icon, title, color = "text-tico-black", bg = "bg-gray-100", onClick }: { icon: any, title: string, color?: string, bg?: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors active:bg-gray-100">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className={`font-semibold ${color}`}>{title}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
}
