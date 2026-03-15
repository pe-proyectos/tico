import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Car, Save, Check } from 'lucide-react';
import { api } from '../../lib/api';

export default function DriverVehicle() {
  const [form, setForm] = useState({ licensePlate: '', vehicleBrand: '', vehicleModel: '', vehicleColor: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<{ ok: boolean; driver: any }>('/driver/profile')
      .then(res => {
        const d = res.driver;
        if (d) setForm({
          licensePlate: d.licensePlate || '',
          vehicleBrand: d.vehicleBrand || '',
          vehicleModel: d.vehicleModel || '',
          vehicleColor: d.vehicleColor || '',
        });
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await api.patch('/driver/vehicle', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'licensePlate', label: 'Placa', placeholder: 'ABC-123' },
    { key: 'vehicleBrand', label: 'Marca', placeholder: 'Toyota' },
    { key: 'vehicleModel', label: 'Modelo', placeholder: 'Corolla' },
    { key: 'vehicleColor', label: 'Color', placeholder: 'Blanco' },
  ] as const;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-tico-yellow/20 flex items-center justify-center">
          <Car className="w-6 h-6 text-yellow-700" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-tico-black">Mi Vehículo</h1>
          <p className="text-gray-500 text-sm">Edita la información de tu vehículo</p>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map(({ key, label, placeholder }) => (
          <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">{label}</label>
            <input
              type="text"
              value={form[key]}
              onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-tico-black font-medium focus:outline-none focus:ring-2 focus:ring-tico-yellow/50 focus:border-tico-yellow transition-all"
            />
          </motion.div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 ${
          saved ? 'bg-green-500 text-white' : 'bg-tico-yellow text-tico-black'
        }`}
      >
        {saved ? <><Check className="w-5 h-5" /> Guardado</> : saving ? 'Guardando...' : <><Save className="w-5 h-5" /> Guardar cambios</>}
      </button>
    </div>
  );
}
