import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Clock, MessageSquare, HelpCircle, Settings, CarFront } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileClick: () => void;
  onPaymentClick: () => void;
  onHistoryClick: () => void;
  onMessagesClick: () => void;
  onSupportClick: () => void;
  onSettingsClick: () => void;
  onDriverModeClick: () => void;
}

function getUserName(): string {
  try {
    const auth = JSON.parse(localStorage.getItem('tico_auth') || '{}');
    return auth?.user?.name || 'Usuario';
  } catch {
    return 'Usuario';
  }
}

function getUserInitial(): string {
  const name = getUserName();
  return name.charAt(0).toUpperCase();
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  onProfileClick,
  onPaymentClick,
  onHistoryClick,
  onMessagesClick,
  onSupportClick,
  onSettingsClick,
  onDriverModeClick
}: SidebarProps) {
  const [userName, setUserName] = useState('Usuario');
  const [userInitial, setUserInitial] = useState('U');

  useEffect(() => {
    if (isOpen) {
      setUserName(getUserName());
      setUserInitial(getUserInitial());
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-tico-yellow p-6 pt-12 pb-8 rounded-br-[40px] relative">
              <button 
                onClick={onClose}
                className="absolute top-12 right-6 w-10 h-10 rounded-full bg-tico-black/10 flex items-center justify-center"
              >
                <X className="w-6 h-6 text-tico-black" />
              </button>
              
              <div 
                className="flex items-center gap-4 mt-4 cursor-pointer active:scale-95 transition-transform"
                onClick={() => {
                  onClose();
                  onProfileClick();
                }}
              >
                <div className="w-16 h-16 rounded-full border-2 border-white bg-tico-black flex items-center justify-center shadow-sm">
                  <span className="text-2xl font-bold text-white">{userInitial}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-tico-black leading-tight">{userName}</h2>
                  <p className="text-tico-black/70 font-medium text-sm">Ver perfil</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              <MenuItem icon={CreditCard} title="Métodos de pago" onClick={() => { onClose(); onPaymentClick(); }} />
              <MenuItem icon={Clock} title="Historial de viajes" onClick={() => { onClose(); onHistoryClick(); }} />
              <MenuItem icon={MessageSquare} title="Mensajes" onClick={() => { onClose(); onMessagesClick(); }} />
              <MenuItem icon={HelpCircle} title="Soporte" onClick={() => { onClose(); onSupportClick(); }} />
              <MenuItem icon={Settings} title="Configuración" onClick={() => { onClose(); onSettingsClick(); }} />
              
              <div className="my-6 border-t border-gray-100"></div>
              
              <button 
                onClick={() => { onClose(); onDriverModeClick(); }}
                className="w-full bg-gray-50 hover:bg-gray-100 text-tico-black p-4 rounded-2xl flex items-center gap-4 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-tico-yellow/20 flex items-center justify-center">
                  <CarFront className="w-5 h-5 text-yellow-700" />
                </div>
                <div className="text-left flex-1">
                  <span className="block font-bold text-tico-black">Modo Conductor</span>
                  <span className="block text-xs text-gray-500 font-medium">Gana dinero manejando</span>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MenuItem({ icon: Icon, title, badge, onClick }: { icon: any, title: string, badge?: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors active:bg-gray-100"
    >
      <div className="flex items-center gap-4">
        <Icon className="w-6 h-6 text-gray-400" />
        <span className="font-semibold text-tico-black text-lg">{title}</span>
      </div>
      {badge && (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}
