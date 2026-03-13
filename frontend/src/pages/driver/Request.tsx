import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DriverRequest() {
  const [countdown, setCountdown] = useState(15)
  const nav = useNavigate()

  useEffect(() => {
    if (countdown <= 0) { nav('/driver'); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      background: 'var(--secondary)',
    }}>
      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        padding: 24, width: '100%', maxWidth: 380,
        animation: 'slideUp 0.3s ease',
        border: '3px solid var(--primary)',
      }}>
        {/* Timer */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', border: '4px solid var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 700, margin: '0 auto 8px',
            color: countdown <= 5 ? 'var(--danger)' : 'var(--secondary)',
            fontFamily: 'var(--font-display)',
            background: countdown <= 5 ? 'rgba(211,47,47,0.05)' : 'rgba(255,193,7,0.08)',
          }}>{countdown}s</div>
          <h2 style={{ fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 22 }}>
            🚕 ¡Nueva solicitud!
          </h2>
        </div>

        {/* Trip info */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ color: 'var(--success)', fontSize: 12 }}>●</span>
              <div style={{ width: 2, height: 30, background: 'var(--gray-200)' }} />
              <span style={{ color: 'var(--danger)', fontSize: 12 }}>●</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: 'var(--gray-400)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Origen</p>
                <p style={{ fontWeight: 600 }}>Parque Principal, Chiclayo</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--gray-400)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Destino</p>
                <p style={{ fontWeight: 600 }}>Real Plaza, Chiclayo</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <div className="card" style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: 11, color: 'var(--gray-400)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Precio</p>
              <p style={{ fontWeight: 700, fontSize: 22, color: 'var(--success)', fontFamily: 'var(--font-display)' }}>S/ 8.50</p>
            </div>
            <div className="card" style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: 11, color: 'var(--gray-400)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Distancia</p>
              <p style={{ fontWeight: 700, fontSize: 22, fontFamily: 'var(--font-display)' }}>2.3 km</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => nav('/driver')}>
            Rechazar
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => nav('/driver/trip/trip-001')}>
            ✓ Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
