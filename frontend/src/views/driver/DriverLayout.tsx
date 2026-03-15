import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Map as MapIcon, Clock, CreditCard } from 'lucide-react';

export default function DriverLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/driver', icon: Home, label: 'Inicio' },
    { path: '/driver/trip', icon: MapIcon, label: 'Viaje' },
    { path: '/driver/history', icon: Clock, label: 'Historial' },
    { path: '/driver/plans', icon: CreditCard, label: 'Planes' },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-100 overflow-hidden relative">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                isActive ? 'text-tico-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`w-12 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-tico-yellow/20' : 'bg-transparent'}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'text-yellow-700' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-tico-black' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}