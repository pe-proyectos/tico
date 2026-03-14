import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Map, { originIcon, destIcon } from '../../components/Map'
import { CHICLAYO_CENTER, DEMO_LOCATIONS } from '../../lib/routing'

export default function DriverRequest() {
  const [countdown, setCountdown] = useState(15)
  const nav = useNavigate()

  useEffect(() => {
    if (countdown <= 0) { nav('/driver'); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const pickupPos = CHICLAYO_CENTER
  const destPos = DEMO_LOCATIONS['Real Plaza']
  const pct = ((15 - countdown) / 15) * 100

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)',
    }}>
      {/* Map preview */}
      <div style={{ height: 200, position: 'relative' }}>
        <Map
          center={pickupPos}
          zoom={15}
          markers={[
            { position: pickupPos, icon: originIcon },
            { position: destPos, icon: destIcon },
          ]}
          route={[pickupPos, destPos]}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          padding: 24, width: '100%', maxWidth: 380,
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideUp 0.3s ease',
        }}>
          {/* Circular countdown */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              position: 'relative', margin: '0 auto 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="72" height="72" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                <circle cx="36" cy="36" r="32" fill="none" stroke="var(--gray-100)" strokeWidth="4" />
                <circle cx="36" cy="36" r="32" fill="none"
                  stroke={countdown <= 5 ? 'var(--danger)' : 'var(--primary)'}
                  strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (pct / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
                />
              </svg>
              <span style={{
                fontSize: 24, fontWeight: 800,
                color: countdown <= 5 ? 'var(--danger)' : 'var(--secondary)',
              }}>{countdown}</span>
            </div>
            <h2 style={{ fontWeight: 700, fontSize: 20 }}>
              ¡Nueva solicitud!
            </h2>
          </div>

          {/* Trip info */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 2 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)' }} />
                <div style={{ width: 2, height: 30, background: 'var(--gray-200)' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--danger)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 18 }}>
                  <p style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Origen</p>
                  <p style={{ fontWeight: 600 }}>Parque Principal, Chiclayo</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Destino</p>
                  <p style={{ fontWeight: 600 }}>Real Plaza, Chiclayo</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{
                textAlign: 'center', flex: 1, padding: '12px',
                background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)',
              }}>
                <p style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Precio</p>
                <p style={{ fontWeight: 800, fontSize: 22, color: 'var(--success)' }}>S/ 8.50</p>
              </div>
              <div style={{
                textAlign: 'center', flex: 1, padding: '12px',
                background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)',
              }}>
                <p style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Distancia</p>
                <p style={{ fontWeight: 800, fontSize: 22 }}>2.3 km</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => nav('/driver')}>
              Rechazar
            </button>
            <button className="btn btn-success" style={{ flex: 1 }} onClick={() => nav('/driver/trip/trip-001')}>
              ✓ Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
