import { Users, Car, MapPin, DollarSign, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Viajes Activos', value: '24', icon: MapPin, color: 'bg-blue-100 text-blue-600' },
    { label: 'Conductores Online', value: '156', icon: Car, color: 'bg-green-100 text-green-600' },
    { label: 'Viajes Hoy', value: '1,245', icon: Activity, color: 'bg-purple-100 text-purple-600' },
    { label: 'Ingresos Hoy', value: 'S/ 4,520', icon: DollarSign, color: 'bg-yellow-100 text-yellow-700' },
  ];

  const recentActivity = [
    { id: 1, type: 'trip', msg: 'Viaje completado: Real Plaza → USAT', time: 'Hace 2 min' },
    { id: 2, type: 'driver', msg: 'Nuevo conductor registrado: Carlos M.', time: 'Hace 15 min' },
    { id: 3, type: 'payment', msg: 'Pago de plan PRO recibido', time: 'Hace 1 hora' },
    { id: 4, type: 'alert', msg: 'Alta demanda en Terminal Terrestre', time: 'Hace 2 horas' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-tico-black">Dashboard General</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-tico-black">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-tico-black mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {recentActivity.map((act) => (
            <div key={act.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-tico-yellow"></div>
                <p className="font-medium text-tico-black">{act.msg}</p>
              </div>
              <span className="text-sm text-gray-500">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}