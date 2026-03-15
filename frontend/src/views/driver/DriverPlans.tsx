import { CheckCircle2, Star } from 'lucide-react';

export default function DriverPlans() {
  const plans = [
    {
      name: 'FREE',
      price: 'S/ 0',
      period: 'por siempre',
      features: ['20 viajes/día', 'Sin comisión', 'Soporte estándar'],
      color: 'bg-gray-100',
      textColor: 'text-gray-800',
      buttonColor: 'bg-gray-200 text-gray-600',
    },
    {
      name: 'PRO',
      price: 'S/ 350',
      period: '/mes',
      features: ['100 viajes/día', 'Sin comisión', 'Soporte prioritario', 'Insignia PRO'],
      color: 'bg-tico-black',
      textColor: 'text-white',
      buttonColor: 'bg-tico-yellow text-tico-black',
      popular: true,
    },
    {
      name: 'BUSINESS',
      price: 'S/ 500',
      period: '/mes',
      features: ['Viajes ilimitados', 'Sin comisión', 'Soporte 24/7', 'Viajes corporativos'],
      color: 'bg-blue-600',
      textColor: 'text-white',
      buttonColor: 'bg-white text-blue-600',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-black text-tico-black">Planes de Conductor</h1>
      <p className="text-gray-500 font-medium">Elige el plan que mejor se adapte a tus necesidades. Tú te quedas con el 100% de cada viaje.</p>

      <div className="space-y-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`${plan.color} rounded-3xl p-6 shadow-lg relative overflow-hidden`}>
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-tico-yellow text-tico-black text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                <Star className="w-3 h-3" /> MÁS POPULAR
              </div>
            )}
            
            <h2 className={`text-xl font-black ${plan.textColor} mb-2`}>{plan.name}</h2>
            <div className="flex items-baseline gap-1 mb-6">
              <span className={`text-4xl font-black ${plan.textColor}`}>{plan.price}</span>
              <span className={`text-sm font-medium ${plan.textColor} opacity-80`}>{plan.period}</span>
            </div>

            <div className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className={`w-5 h-5 ${plan.textColor} opacity-80`} />
                  <span className={`font-medium ${plan.textColor}`}>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => alert('Contacta a soporte para cambiar de plan')}
              className={`w-full py-4 rounded-2xl font-bold text-lg active:scale-[0.98] transition-transform ${plan.buttonColor}`}
            >
              Seleccionar Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
