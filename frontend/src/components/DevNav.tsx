import { useNavigate } from 'react-router-dom';
import { User, Car, ShieldAlert } from 'lucide-react';

export default function DevNav() {
  const navigate = useNavigate();

  if (!import.meta.env.DEV) return null;

  const switchRole = (role: 'passenger' | 'driver' | 'admin') => {
    localStorage.setItem('tico_auth', JSON.stringify({ role, phone: '999999999' }));
    if (role === 'admin') navigate('/admin');
    else if (role === 'driver') navigate('/driver');
    else navigate('/');
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-gray-200">
      <button 
        onClick={() => switchRole('passenger')}
        className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 flex items-center gap-2"
        title="Vista Pasajero"
      >
        <User className="w-4 h-4" />
        <span className="text-xs font-bold hidden sm:inline">Pasajero</span>
      </button>
      <button 
        onClick={() => switchRole('driver')}
        className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 flex items-center gap-2"
        title="Vista Conductor"
      >
        <Car className="w-4 h-4" />
        <span className="text-xs font-bold hidden sm:inline">Conductor</span>
      </button>
      <button 
        onClick={() => switchRole('admin')}
        className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 flex items-center gap-2"
        title="Vista Admin"
      >
        <ShieldAlert className="w-4 h-4" />
        <span className="text-xs font-bold hidden sm:inline">Admin</span>
      </button>
    </div>
  );
}
