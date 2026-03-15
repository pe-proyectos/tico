import { useState, useEffect } from 'react'
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
    if (val.length > 1) {
      const digits = val.replace(/\D/g, '').slice(0, 6)
      setCode(digits)
      if (digits.length >= 4) {
        const last = document.getElementById(`otp-${Math.min(digits.length - 1, 5)}`)
        last?.focus()
      } else {
        const next = document.getElementById(`otp-${Math.min(digits.length, 5)}`)
        next?.focus()
      }
      return
    }
    const newCode = code.split('')
    newCode[index] = val
    const joined = newCode.join('').slice(0, 6)
    setCode(joined)
    if (val && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`)
      next?.focus()
    }
  }

  // Auto-submit when 4 digits filled (backend accepts 4-digit codes)
  useEffect(() => {
    if (code.length >= 4 && step === 'otp' && !loading) {
      handleVerify()
    }
  }, [code])

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Blue gradient header */}
      <div style={{
        background: 'linear-gradient(135deg, #1A365D 0%, #2C5282 100%)',
        padding: '60px 24px 80px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative',
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44, marginBottom: 20,
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}>🚕</div>
        <h1 style={{
          fontSize: 36, fontWeight: 800, color: '#FFFFFF',
          letterSpacing: -0.5,
        }}>Tico</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 6, fontSize: 15 }}>
          Tu taxi en Chiclayo
        </p>
      </div>

      {/* White form area */}
      <div style={{
        flex: 1, background: '#FFFFFF',
        borderRadius: '24px 24px 0 0',
        marginTop: -24,
        padding: '32px 24px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          width: '100%', maxWidth: 360,
          animation: 'slideUp 0.4s ease',
        }}>
          {step === 'phone' ? (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: 'var(--gray-700)' }}>
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
                {loading ? <LoadingSpinner size={20} color="#FFFFFF" /> : 'Enviar código por WhatsApp'}
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
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: 'var(--gray-700)' }}>
                Código de verificación
              </h2>
              <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 28 }}>
                Enviado al +51 {phone}
              </p>
              {/* 6-digit OTP boxes */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={code[i] || ''}
                    onChange={e => handleOtpInput(e.target.value.replace(/\D/g, ''), i)}
                    onPaste={e => {
                      e.preventDefault()
                      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
                      if (pasted) handleOtpInput(pasted, 0)
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !code[i] && i > 0) {
                        const prev = document.getElementById(`otp-${i - 1}`)
                        prev?.focus()
                      }
                    }}
                    autoFocus={i === 0}
                    style={{
                      width: 48, height: 56, textAlign: 'center',
                      fontSize: 24, fontWeight: 700, borderRadius: 'var(--radius-md)',
                      border: `2px solid ${code[i] ? 'var(--primary-blue)' : 'var(--gray-200)'}`,
                      background: code[i] ? 'rgba(26,54,93,0.03)' : 'var(--white)',
                      transition: 'all 0.2s',
                      color: 'var(--gray-700)',
                    }}
                  />
                ))}
              </div>
              <button className="btn btn-primary" onClick={handleVerify} disabled={code.length < 4 || loading}>
                {loading ? <LoadingSpinner size={20} color="#FFFFFF" /> : 'Verificar'}
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
    </div>
  )
}
