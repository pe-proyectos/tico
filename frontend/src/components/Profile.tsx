import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Star, Clock, Settings, LogOut, ChevronRight, MapPin } from 'lucide-react';
import { api } from '../lib/api';

interface ProfileProps {
  onBack: () => void;
  onLogout: () => void;
  onEditProfile: () => void;
  onHistoryClick: () => void;
  onSettingsClick: () => void;
}

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  rating: number;
  ratingCount: number;
  _count?: { tripsAsPassenger: number };
  tripCount?: number;
}

export default function Profile({ onBack, onLogout, onEditProfile, onHistoryClick, onSettingsClick }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const auth = JSON.parse(localStorage.getItem('tico_auth') || '{}');

  useEffect(() => {
    api.get<UserProfile>('/users/me').then(setProfile).catch(() => {});
  }, []);

  const name = profile?.name || auth.user?.name || 'Usuario';
  const phone = profile?.phone || auth.phone || '';
  const rating = profile?.rating || auth.user?.rating || 0;
  const tripCount = profile?.tripCount || profile?._count?.tripsAsPassenger || 0;

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto"
    >
      <div className="pt-12 pb-6 px-6 rounded-b-[40px] shadow-sm relative" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
        <button 
          onClick={onBack}
          className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex flex-col items-center mt-8">
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md mb-4 relative">
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">{name}</h2>
          <p className="text-white/70 font-medium">{phone}</p>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        <div className="flex gap-4">
          <div className="flex-1 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col items-center">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400 mb-2" />
            <span className="text-2xl font-bold text-tico-black">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 font-medium">Calificación</span>
          </div>
          <div className="flex-1 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col items-center">
            <MapPin className="w-6 h-6 text-blue-500 mb-2" />
            <span className="text-2xl font-bold text-tico-black">{tripCount}</span>
            <span className="text-xs text-gray-500 font-medium">Viajes</span>
          </div>
        </div>

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
