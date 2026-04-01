import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Users, PawPrint, MessageSquare } from 'lucide-react';

interface TripOptionsProps {
  extraPassengers: boolean;
  petWithMe: boolean;
  comments: string;
  onUpdate: (opts: { extraPassengers: boolean; petWithMe: boolean; comments: string }) => void;
  onClose: () => void;
}

export default function TripOptions({ extraPassengers, petWithMe, comments, onUpdate, onClose }: TripOptionsProps) {
  const [local, setLocal] = useState({ extraPassengers, petWithMe, comments });

  const toggle = (key: 'extraPassengers' | 'petWithMe') => {
    setLocal(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClose = () => {
    onUpdate(local);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={handleClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white rounded-t-3xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Opciones del viaje</h3>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Extra passengers */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900">Más de 4 pasajeros</span>
          </div>
          <button
            onClick={() => toggle('extraPassengers')}
            className={`w-12 h-7 rounded-full transition-colors ${local.extraPassengers ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${local.extraPassengers ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Pet */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <PawPrint className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900">Mascota conmigo</span>
          </div>
          <button
            onClick={() => toggle('petWithMe')}
            className={`w-12 h-7 rounded-full transition-colors ${local.petWithMe ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${local.petWithMe ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Comments */}
        <div className="py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900">Comentarios</span>
          </div>
          <textarea
            value={local.comments}
            onChange={e => setLocal(prev => ({ ...prev, comments: e.target.value }))}
            placeholder="Instrucciones para el conductor..."
            className="w-full bg-gray-50 rounded-xl p-3 text-sm border border-gray-200 outline-none focus:border-emerald-500 resize-none h-20"
          />
        </div>

        <button
          onClick={handleClose}
          className="w-full mt-6 bg-emerald-500 text-white font-bold py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
        >
          Cerrar
        </button>
      </motion.div>
    </motion.div>
  );
}
