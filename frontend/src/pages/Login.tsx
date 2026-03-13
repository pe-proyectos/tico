import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const { requestOtp, verifyOtp } = useAuth()
  const nav = useNavigate()

  const handleRequestOtp = async () => {
    if (phone.length < 9) return
    setLoading(true)
    await requestOtp(phone)
    setLoading(false)
    setStep('otp')
  }

  const handleVerify = async () => {
    if (code.length < 4) return
    setLoading(true)
    const user = await verifyOtp(phone, code)
    setLoading(false)
    if (user.role === 'ADMIN') nav('/admin')
    else if (user.role === 'DRIVER') nav('/driver')
    else nav('/')
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      background: 'var(--primary)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Checkerboard decorative stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 8,
        background: 'repeating-conic-gradient(var(--secondary) 0% 25%, var(--primary) 0% 50%) 0 0 / 16px 16px',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 8,
        background: 'repeating-conic-gradient(var(--secondary) 0% 25%, var(--primary) 0% 50%) 0 0 / 16px 16px',
      }} />

      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'var(--secondary)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 52, margin: '0 auto 16px',
          boxShadow: '0 8px 32px rgba(26,26,46,0.3)',
          border: '4px solid var(--white)',
        }}>🚕</div>
        <h1 style={{
          fontSize: 48, fontWeight: 700, color: 'var(--secondary)',
          fontFamily: 'var(--font-display)', textTransform: 'uppercase',
          letterSpacing: 3, textShadow: '2px 2px 0 rgba(255,255,255,0.3)',
        }}>Tico</h1>
        <p style={{ color: 'var(--secondary)', marginTop: 4, opacity: 0.7, fontWeight: 600, fontSize: 15 }}>
          Tu taxi en Chiclayo
        </p>
      </div>

      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        padding: 24, width: '100%', maxWidth: 380,
        boxShadow: '0 12px 40px rgba(26,26,46,0.2)',
        border: '2px solid rgba(26,26,46,0.1)',
      }}>
        {step === 'phone' ? (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
              Ingresa tu número
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 20 }}>
              Te enviaremos un código de verificación
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <div style={{
                padding: '14px 12px', background: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: 16,
                border: '2px solid var(--gray-200)', fontFamily: 'var(--font-display)',
              }}>+51</div>
              <input
                className="input"
                type="tel"
                placeholder="999 999 999"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                autoFocus
              />
            </div>
            <button className="btn btn-primary" onClick={handleRequestOtp} disabled={phone.length < 9 || loading}>
              {loading ? <LoadingSpinner size={20} color="var(--secondary)" /> : '🚕 Continuar'}
            </button>
            <p style={{ color: 'var(--gray-400)', fontSize: 12, marginTop: 16, textAlign: 'center' }}>
              Código demo: 1234 = pasajero, 1111 = conductor, 0000 = admin
            </p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
              Código de verificación
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 20 }}>
              Enviado al +51 {phone}
            </p>
            <input
              className="input"
              type="text"
              inputMode="numeric"
              placeholder="0000"
              maxLength={4}
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              style={{ textAlign: 'center', fontSize: 28, letterSpacing: 8, marginBottom: 16, fontFamily: 'var(--font-display)', fontWeight: 700 }}
              autoFocus
            />
            <button className="btn btn-primary" onClick={handleVerify} disabled={code.length < 4 || loading}>
              {loading ? <LoadingSpinner size={20} color="var(--secondary)" /> : '✓ Verificar'}
            </button>
            <button
              className="btn btn-outline"
              style={{ marginTop: 8 }}
              onClick={() => { setStep('phone'); setCode('') }}
            >
              Cambiar número
            </button>
          </>
        )}
      </div>
    </div>
  )
}
