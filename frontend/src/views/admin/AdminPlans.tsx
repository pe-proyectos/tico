import { CheckCircle2 } from 'lucide-react';

export default function AdminPlans() {
  const plans = [
    {
      name: 'FREE',
      price: 'S/ 0',
      period: 'por siempre',
      features: ['20 viajes/día', 'Sin comisión', 'Soporte estándar'],
      color: 'bg-gray-100 text-gray-800',
    },
    {
      name: 'PRO',
      price: 'S/ 350',
      period: '/mes',
      features: ['100 viajes/día', 'Sin comisión', 'Soporte prioritario', 'Insignia PRO'],
      color: 'bg-blue-100 text-blue-800',
    },
    {
      name: 'BUSINESS',
      price: 'S/ 500',
      period: '/mes',
      features: ['Viajes ilimitados', 'Sin comisión', 'Soporte 24/7', 'Viajes corporativos'],
      color: 'bg-tico-green text-tico-black',
    },
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
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-black text-tico-black">{plan.price}</span>
              <span className="text-sm font-medium text-gray-500">{plan.period}</span>
            </div>

            <div className="space-y-3 flex-1">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="font-medium text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
