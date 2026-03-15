import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bell, Shield, Globe, Moon, ChevronRight, X } from 'lucide-react';
import Toast, { useToast } from './Toast';

export default function Settings({ onBack }: { onBack: () => void }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const { toast, show: showToast, hide: hideToast } = useToast();

  const handleProximamente = () => showToast('Próximamente', 'info');

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
        <h1 className="text-2xl font-bold text-tico-black">Configuración</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <SettingItem icon={Bell} title="Notificaciones" onClick={handleProximamente} />
          <SettingItem icon={Shield} title="Privacidad y Seguridad" onClick={handleProximamente} />
          <SettingItem icon={Globe} title="Idioma" value="Español" onClick={handleProximamente} />
          <SettingItem icon={Moon} title="Modo Oscuro" value="Desactivado" onClick={handleProximamente} />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <button onClick={() => setShowModal('terms')} className="w-full text-left p-4 font-semibold text-tico-black hover:bg-gray-50 border-b border-gray-50">Términos y Condiciones</button>
          <button onClick={() => setShowModal('privacy')} className="w-full text-left p-4 font-semibold text-tico-black hover:bg-gray-50 border-b border-gray-50">Política de Privacidad</button>
          <button onClick={() => setShowDeleteConfirm(true)} className="w-full text-left p-4 font-semibold text-red-500 hover:bg-red-50">Eliminar cuenta</button>
        </div>
      </div>

      {/* Delete Account Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-6"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl"
            >
              <h3 className="text-xl font-bold text-tico-black mb-3">¿Eliminar cuenta?</h3>
              <p className="text-gray-600 mb-2">Para eliminar tu cuenta, contacta a nuestro equipo de soporte por WhatsApp.</p>
              <p className="text-sm text-gray-400 mb-6">Esta acción es irreversible.</p>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/51987654321?text=Quiero%20eliminar%20mi%20cuenta%20Tico"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-red-500 text-white font-bold py-3 rounded-2xl text-center"
                >
                  Contactar soporte
                </a>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proximamente Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-6"
            onClick={() => setShowModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl text-center"
            >
              <h3 className="text-xl font-bold text-tico-black mb-3">
                {showModal === 'terms' ? 'Términos y Condiciones' : 'Política de Privacidad'}
              </h3>
              <p className="text-gray-500 mb-6">Próximamente</p>
              <button
                onClick={() => setShowModal(null)}
                className="w-full bg-tico-black text-white font-bold py-3 rounded-2xl"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SettingItem({ icon: Icon, title, value, onClick }: { icon: any, title: string, value?: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors active:bg-gray-100">
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
