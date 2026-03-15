import { useState } from 'react';
import { motion } from 'motion/react';
import { Power, Activity, DollarSign, Star, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DriverRequest from './DriverRequest';

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const navigate = useNavigate();

  const handleSimulateRequest = () => {
    if (!isOnline) {
      alert("Debes estar conectado para recibir solicitudes.");
      return;
    }
    setShowRequest(true);
  };

  const handleAcceptRequest = () => {
    setShowRequest(false);
    navigate('/driver/trip');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-tico-black">Hola, Carlos</h1>
          <p className="text-gray-500 font-medium">Plan <span className="text-tico-black font-bold bg-tico-yellow/20 px-2 py-0.5 rounded-md">PRO</span></p>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('tico_auth');
            navigate('/login');
          }}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Online Toggle */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 mb-4 ${
            isOnline ? 'bg-green-500 shadow-green-500/30' : 'bg-gray-200 shadow-gray-200/50'
          }`}
        >
          <Power className={`w-10 h-10 ${isOnline ? 'text-white' : 'text-gray-400'}`} />
        </button>
        <h2 className={`text-xl font-bold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
          {isOnline ? 'Estás Conectado' : 'Estás Desconectado'}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          {isOnline ? 'Buscando pasajeros cercanos...' : 'Conéctate para recibir viajes'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-black text-tico-black">12</p>
          <p className="text-xs font-bold text-gray-400 uppercase">Viajes Hoy</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-black text-tico-black">145</p>
          <p className="text-xs font-bold text-gray-400 uppercase">Ganancias</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <Star className="w-6 h-6 text-tico-yellow mx-auto mb-2" />
          <p className="text-2xl font-black text-tico-black">4.9</p>
          <p className="text-xs font-bold text-gray-400 uppercase">Rating</p>
        </div>
      </div>

      {/* Simulate Request Button */}
      <button 
        onClick={handleSimulateRequest}
        className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-transform shadow-lg"
      >
        Simular Solicitud
      </button>

      {showRequest && (
        <DriverRequest 
          onAccept={handleAcceptRequest} 
          onReject={() => setShowRequest(false)} 
        />
      )}
    </div>
  );
}