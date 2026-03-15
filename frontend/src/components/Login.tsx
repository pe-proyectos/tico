import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'passenger' | 'driver' | 'admin') => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const handleNext = () => {
    if (step === 'phone' && phone.length >= 9) {
      setStep('code');
    } else if (step === 'code' && code.length >= 4) {
      let role: 'passenger' | 'driver' | 'admin' = 'passenger';
      if (code === '1111') role = 'driver';
      if (code === '0000') role = 'admin';
      
      // Save auth state
      localStorage.setItem('tico_auth', JSON.stringify({ role, phone }));
      onLogin(role);
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

            <div className="mt-auto">
              <button
                onClick={handleNext}
                disabled={phone.length < 9}
                className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Continuar <ArrowRight className="w-5 h-5" />
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
              onClick={() => setStep('phone')}
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
                    
                    // Auto-focus next input
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

            <div className="mt-auto">
              <button
                onClick={handleNext}
                disabled={code.length < 4}
                className="w-full bg-tico-black text-white font-bold text-lg py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Verificar y Entrar <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
