import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [showDev, setShowDev] = useState(false)
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

  const handleOtpInput = (val: string, index: number) => {
    const newCode = code.split('')
    newCode[index] = val
    const joined = newCode.join('').slice(0, 4)
    setCode(joined)
    if (val && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`)
      next?.focus()
    }
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      background: 'var(--white)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle gradient accent at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 300,
        background: 'linear-gradient(180deg, rgba(255,193,7,0.08) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        textAlign: 'center', marginBottom: 48, position: 'relative',
        animation: 'fadeIn 0.5s ease',
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: 'var(--primary-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44, margin: '0 auto 20px',
          boxShadow: '0 8px 32px rgba(255,143,0,0.25)',
        }}>🚕</div>
        <h1 style={{
          fontSize: 36, fontWeight: 800, color: 'var(--secondary)',
          letterSpacing: -0.5,
        }}>Tico</h1>
        <p style={{ color: 'var(--gray-500)', marginTop: 6, fontSize: 15 }}>
          Tu taxi en Chiclayo
        </p>
      </div>

      <div style={{
        width: '100%', maxWidth: 360, position: 'relative',
        animation: 'slideUp 0.4s ease',
      }}>
        {step === 'phone' ? (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              Ingresa tu número
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 24 }}>
              Te enviaremos un código de verificación
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <div style={{
                padding: '14px 12px', background: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 16,
                border: '1.5px solid var(--gray-200)', color: 'var(--gray-600)',
                display: 'flex', alignItems: 'center',
              }}>+51</div>
              <input
                className="input"
                type="tel"
                placeholder="999 999 999"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                autoFocus
                style={{ fontSize: 18, fontWeight: 500 }}
              />
            </div>
            <button className="btn btn-primary" onClick={handleRequestOtp} disabled={phone.length < 9 || loading}>
              {loading ? <LoadingSpinner size={20} color="var(--secondary-deep)" /> : 'Continuar'}
            </button>
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <button onClick={() => setShowDev(!showDev)} style={{
                background: 'none', fontSize: 12, color: 'var(--gray-400)',
                padding: '4px 8px',
              }}>
                {showDev ? '▾ Modo dev' : '▸ Modo dev'}
              </button>
              {showDev && (
                <p style={{ color: 'var(--gray-400)', fontSize: 12, marginTop: 8 }}>
                  1234 = pasajero · 1111 = conductor · 0000 = admin
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              Código de verificación
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 28 }}>
              Enviado al +51 {phone}
            </p>
            {/* Segmented OTP boxes */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
              {[0, 1, 2, 3].map(i => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={code[i] || ''}
                  onChange={e => handleOtpInput(e.target.value.replace(/\D/g, ''), i)}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' && !code[i] && i > 0) {
                      const prev = document.getElementById(`otp-${i - 1}`)
                      prev?.focus()
                    }
                  }}
                  autoFocus={i === 0}
                  style={{
                    width: 56, height: 64, textAlign: 'center',
                    fontSize: 28, fontWeight: 700, borderRadius: 'var(--radius-md)',
                    border: `2px solid ${code[i] ? 'var(--primary)' : 'var(--gray-200)'}`,
                    background: code[i] ? 'rgba(255,193,7,0.05)' : 'var(--white)',
                    transition: 'all 0.2s',
                    color: 'var(--secondary)',
                  }}
                />
              ))}
            </div>
            <button className="btn btn-primary" onClick={handleVerify} disabled={code.length < 4 || loading}>
              {loading ? <LoadingSpinner size={20} color="var(--secondary-deep)" /> : 'Verificar'}
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
