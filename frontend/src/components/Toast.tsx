import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  type?: 'error' | 'info' | 'success';
}

export default function Toast({ message, visible, onClose, type = 'info' }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [visible, onClose]);

  const colors = {
    error: 'bg-red-600',
    info: 'bg-tico-black',
    success: 'bg-green-600',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          className={`fixed top-4 left-4 right-4 z-[9999] ${colors[type]} text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between gap-2`}
        >
          <span className="font-semibold text-sm">{message}</span>
          <button onClick={onClose} className="shrink-0">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for easy toast usage
import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ message: '', visible: false, type: 'info' as 'error' | 'info' | 'success' });
  
  const show = useCallback((message: string, type: 'error' | 'info' | 'success' = 'info') => {
    setToast({ message, visible: true, type });
  }, []);
  
  const hide = useCallback(() => {
    setToast(t => ({ ...t, visible: false }));
  }, []);

  return { toast, show, hide };
}
