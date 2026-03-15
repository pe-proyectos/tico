import { useState, useEffect } from 'react';
import { Users, Car, MapPin, DollarSign, Activity } from 'lucide-react';
import { api } from '../../lib/api';

interface DashboardData {
  totalUsers: number;
  totalDrivers: number;
  totalTrips: number;
  completedTrips: number;
  activeTrips: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get<{ ok: boolean } & DashboardData>('/admin/dashboard').then(setData).catch(() => {});
  }, []);

  const stats = [
    { label: 'Viajes Activos', value: String(data?.activeTrips ?? 0), icon: MapPin, color: 'bg-blue-100 text-blue-600' },
    { label: 'Conductores', value: String(data?.totalDrivers ?? 0), icon: Car, color: 'bg-green-100 text-green-600' },
    { label: 'Total Viajes', value: String(data?.totalTrips ?? 0), icon: Activity, color: 'bg-purple-100 text-purple-600' },
    { label: 'Usuarios', value: String(data?.totalUsers ?? 0), icon: Users, color: 'bg-yellow-100 text-yellow-700' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-tico-black">Dashboard General</h2>
      
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-tico-black mb-4">Resumen</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <p className="font-medium text-tico-black">Viajes completados</p>
            <span className="text-lg font-bold text-green-600">{data?.completedTrips ?? 0}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <p className="font-medium text-tico-black">Viajes activos</p>
            <span className="text-lg font-bold text-blue-600">{data?.activeTrips ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
