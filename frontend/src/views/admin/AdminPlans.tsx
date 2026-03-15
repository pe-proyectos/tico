import { Users, DollarSign } from 'lucide-react';

export default function AdminPlans() {
  const plans = [
    { name: 'FREE', price: 'S/ 0', drivers: 850, revenue: 'S/ 0', color: 'bg-gray-100 text-gray-800' },
    { name: 'PRO', price: 'S/ 49/mes', drivers: 320, revenue: 'S/ 15,680', color: 'bg-blue-100 text-blue-800' },
    { name: 'BUSINESS', price: 'S/ 99/mes', drivers: 145, revenue: 'S/ 14,355', color: 'bg-tico-yellow text-tico-black' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-tico-black">Planes y Suscripciones</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${plan.color}`}>
                PLAN {plan.name}
              </span>
              <span className="text-2xl font-black text-tico-black">{plan.price}</span>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="font-medium text-gray-600">Conductores</span>
                </div>
                <span className="text-xl font-bold text-tico-black">{plan.drivers}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-600">Ingresos (Mes)</span>
                </div>
                <span className="text-xl font-bold text-green-600">{plan.revenue}</span>
              </div>
            </div>

            <button className="w-full mt-6 py-3 border-2 border-gray-100 rounded-xl font-bold text-tico-black hover:bg-gray-50 transition-colors">
              Ver Detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}