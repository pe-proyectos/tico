import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export default function EditProfile({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<any>('/users/me').then(user => {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/users/me', { name, email });
      onBack();
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

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
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Nombre completo</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full font-semibold text-tico-black outline-none bg-transparent" />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Número de celular</label>
            <input type="tel" value={phone} disabled className="w-full font-semibold text-gray-400 outline-none bg-transparent" />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full font-semibold text-tico-black outline-none bg-transparent placeholder:text-gray-300" />
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform mt-8 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar cambios'}
        </button>
      </div>
    </motion.div>
  );
}
