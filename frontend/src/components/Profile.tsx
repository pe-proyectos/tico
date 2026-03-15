import { motion } from 'motion/react';
import { ArrowLeft, User, Star, Clock, Settings, LogOut, ChevronRight, MapPin } from 'lucide-react';

interface ProfileProps {
  onBack: () => void;
  onLogout: () => void;
  onEditProfile: () => void;
  onHistoryClick: () => void;
  onSettingsClick: () => void;
}

export default function Profile({ onBack, onLogout, onEditProfile, onHistoryClick, onSettingsClick }: ProfileProps) {
  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto"
    >
      <div className="bg-tico-yellow pt-12 pb-6 px-6 rounded-b-[40px] shadow-sm relative">
        <button 
          onClick={onBack}
          className="absolute top-12 left-6 w-10 h-10 rounded-full bg-tico-black/10 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-tico-black" />
        </button>
        
        <div className="flex flex-col items-center mt-8">
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md mb-4 relative">
            <img 
              src="https://picsum.photos/seed/user-profile/200/200" 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-tico-black rounded-full border-2 border-white flex items-center justify-center">
              <Star className="w-4 h-4 text-tico-yellow fill-tico-yellow" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-tico-black">Juan Pérez</h2>
          <p className="text-tico-black/70 font-medium">+51 987 654 321</p>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="flex gap-4">
          <div className="flex-1 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col items-center">
            <Star className="w-6 h-6 text-tico-yellow fill-tico-yellow mb-2" />
            <span className="text-2xl font-bold text-tico-black">4.9</span>
            <span className="text-xs text-gray-500 font-medium">Calificación</span>
          </div>
          <div className="flex-1 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col items-center">
            <MapPin className="w-6 h-6 text-blue-500 mb-2" />
            <span className="text-2xl font-bold text-tico-black">128</span>
            <span className="text-xs text-gray-500 font-medium">Viajes</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <MenuItem icon={User} title="Editar Perfil" onClick={onEditProfile} />
          <MenuItem icon={Clock} title="Mis Viajes" onClick={onHistoryClick} />
          <MenuItem icon={Settings} title="Configuración" onClick={onSettingsClick} />
        </div>

        <button 
          onClick={onLogout}
          className="w-full bg-red-50 text-red-600 font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" /> Cerrar Sesión
        </button>
      </div>
    </motion.div>
  );
}

function MenuItem({ icon: Icon, title, onClick }: { icon: any, title: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors active:bg-gray-100">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-tico-black" />
        </div>
        <span className="font-semibold text-tico-black">{title}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
}
