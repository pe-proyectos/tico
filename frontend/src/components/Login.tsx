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
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: 'linear-gradient(180deg, #101010 0%, #064E3B 100%)' }}>
      <AnimatePresence mode="wait">
        {step === 'phone' ? (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            {/* Logo Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <span className="text-6xl mb-4">🚕</span>
              <h1 className="text-5xl font-bold text-white tracking-tight mb-2">Tico</h1>
              <p className="text-white/60 font-medium text-lg">Tu taxi en Chiclayo</p>
            </div>

            {/* White Card */}
            <div className="bg-white rounded-t-[32px] px-6 pt-8 pb-8">
              <h2 className="text-2xl font-bold text-tico-black mb-2">Ingresa tu número</h2>
              <p className="text-gray-500 font-medium mb-6">Te enviaremos un código para verificar tu cuenta.</p>

              <div className="flex items-center bg-gray-50 rounded-2xl p-4 border border-gray-200 focus-within:bg-white focus-within:border-tico-green transition-all">
                <span className="text-tico-black font-bold text-lg mr-3">+51</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder="999 999 999"
                  className="flex-1 bg-transparent outline-none text-xl font-bold text-tico-black placeholder:text-gray-300"
                  autoFocus
                />
              </div>

              {error && <p className="text-red-500 font-medium mt-3">{error}</p>}

              <button
                onClick={handleNext}
                disabled={phone.length < 9 || loading}
                className="w-full bg-tico-green text-white font-bold text-lg py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
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
            {/* Logo Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <span className="text-6xl mb-4">🚕</span>
              <h1 className="text-5xl font-bold text-white tracking-tight mb-2">Tico</h1>
              <p className="text-white/60 font-medium text-lg">Tu taxi en Chiclayo</p>
            </div>

            {/* White Card */}
            <div className="bg-white rounded-t-[32px] px-6 pt-8 pb-8">
              <button 
                onClick={() => { setStep('phone'); setError(''); }}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4"
              >
                <ArrowLeft className="w-6 h-6 text-tico-black" />
              </button>

              <h2 className="text-2xl font-bold text-tico-black mb-2">Código de verificación</h2>
              <p className="text-gray-500 font-medium mb-6">
                Ingresa el código de 4 dígitos enviado al +51 {phone}
              </p>

              <div className="flex gap-3 justify-center mb-6">
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
                    className="w-16 h-20 bg-gray-50 rounded-2xl border border-gray-200 text-center text-3xl font-bold text-tico-black focus:bg-white focus:border-tico-green outline-none transition-all"
                  />
                ))}
              </div>

              {error && <p className="text-red-500 font-medium text-center mb-4">{error}</p>}

              <button
                onClick={handleNext}
                disabled={code.length < 4 || loading}
                className="w-full bg-tico-green text-white font-bold text-lg py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verificar <ArrowRight className="w-5 h-5" /></>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
