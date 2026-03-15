import { CheckCircle2, Star, MessageCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../lib/api';

export default function DriverPlans() {
  const [showBanner, setShowBanner] = useState(false);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleUpgrade = async (planName: string) => {
    setUpgrading(planName);
    setError('');
    try {
      await api.post('/driver/upgrade-plan', { plan: planName });
      setSuccessPlan(planName);
      setTimeout(() => setSuccessPlan(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al cambiar plan');
      setShowBanner(true);
    } finally {
      setUpgrading(null);
    }
  };

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
    <div className="p-6 space-y-6 pb-32">
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
              onClick={() => handleUpgrade(plan.name)}
              disabled={upgrading === plan.name}
              className={`w-full py-4 rounded-2xl font-bold text-lg active:scale-[0.98] transition-transform disabled:opacity-70 ${
                successPlan === plan.name ? 'bg-green-500 text-white' : plan.buttonColor
              }`}
            >
              {upgrading === plan.name ? (
                <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</span>
              ) : successPlan === plan.name ? (
                <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" /> ¡Plan activado!</span>
              ) : 'Seleccionar Plan'}
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-green-600 text-white p-5 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-6 h-6 shrink-0" />
              <p className="font-bold">Para cambiar de plan, contáctanos por WhatsApp</p>
            </div>
            <div className="flex gap-3">
              <a
                href="https://wa.me/51987654321?text=Quiero%20cambiar%20mi%20plan%20Tico"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white text-green-600 font-bold py-3 rounded-2xl text-center active:scale-[0.98] transition-transform"
              >
                Abrir WhatsApp
              </a>
              <button
                onClick={() => setShowBanner(false)}
                className="px-4 py-3 rounded-2xl border-2 border-white/30 font-bold active:scale-[0.98] transition-transform"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
