import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

interface LoginProps {
  onLogin: (role: 'passenger' | 'driver' | 'admin') => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = async () => {
    setError('');
    if (step === 'phone' && phone.length >= 9) {
      setLoading(true);
      try {
        await api.post('/auth/request-otp', { phone: '+51' + phone });
        setStep('code');
      } catch (err: any) {
        setError(err.message || 'Error al enviar código');
      } finally {
        setLoading(false);
      }
    } else if (step === 'code' && code.length >= 4) {
      setLoading(true);
      try {
        const res = await api.post<{ token: string; user: { role: string; name?: string; id: string } }>('/auth/verify-otp', { phone: '+51' + phone, code });
        const role = res.user.role.toLowerCase() as 'passenger' | 'driver' | 'admin';
        localStorage.setItem('tico_auth', JSON.stringify({ role, phone, token: res.token, user: res.user }));
        onLogin(role);
      } catch (err: any) {
        setError(err.message || 'Código inválido');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-tico-yellow z-50 flex flex-col px-6 pt-20 pb-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'phone' ? (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <h1 className="text-4xl font-bold text-tico-black mb-2 tracking-tight">
              Ingresa tu<br />número
            </h1>
            <p className="text-tico-black/70 font-medium mb-8">
              Te enviaremos un código para verificar tu cuenta.
            </p>

            <div className="flex items-center bg-white/50 rounded-2xl p-4 border border-tico-black/10 focus-within:bg-white focus-within:border-tico-black transition-all">
              <span className="text-tico-black font-bold text-lg mr-3">+51</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                placeholder="999 999 999"
                className="flex-1 bg-transparent outline-none text-xl font-bold text-tico-black placeholder:text-tico-black/30"
                autoFocus
              />
            </div>

            {error && <p className="text-red-600 font-medium mt-3">{error}</p>}

            <div className="mt-auto">
              <button
                onClick={handleNext}
                disabled={phone.length < 9 || loading}
                className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continuar <ArrowRight className="w-5 h-5" /></>}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col"
          >
            <button 
              onClick={() => { setStep('phone'); setError(''); }}
              className="w-10 h-10 rounded-full bg-tico-black/5 flex items-center justify-center mb-6 -ml-2"
            >
              <ArrowLeft className="w-6 h-6 text-tico-black" />
            </button>

            <h1 className="text-4xl font-bold text-tico-black mb-2 tracking-tight">
              Código de<br />verificación
            </h1>
            <p className="text-tico-black/70 font-medium mb-8">
              Ingresa el código de 4 dígitos enviado al +51 {phone}
            </p>

            <div className="flex gap-3 justify-center mb-8">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={code[index] || ''}
                  onChange={(e) => {
                    const newCode = code.split('');
                    newCode[index] = e.target.value.replace(/\D/g, '');
                    setCode(newCode.join('').slice(0, 4));
                    
                    if (e.target.value && index < 3) {
                      const nextInput = document.getElementById(`code-${index + 1}`);
                      nextInput?.focus();
                    }
                  }}
                  id={`code-${index}`}
                  className="w-16 h-20 bg-white/50 rounded-2xl border border-tico-black/10 text-center text-3xl font-bold text-tico-black focus:bg-white focus:border-tico-black outline-none transition-all"
                />
              ))}
            </div>

            {error && <p className="text-red-600 font-medium text-center mb-4">{error}</p>}

            <div className="mt-auto">
              <button
                onClick={handleNext}
                disabled={code.length < 4 || loading}
                className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verificar y Entrar <ArrowRight className="w-5 h-5" /></>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
