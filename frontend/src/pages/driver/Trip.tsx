import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Phase = 'pickup' | 'arrived' | 'in_progress' | 'completed'

const phaseConfig: Record<Phase, { label: string; color: string; button: string; next: Phase | null }> = {
  pickup: { label: 'Recogiendo pasajero', color: 'var(--info)', button: 'Llegué', next: 'arrived' },
  arrived: { label: 'Esperando pasajero', color: 'var(--primary)', button: 'Iniciar viaje', next: 'in_progress' },
  in_progress: { label: 'En camino al destino', color: 'var(--success)', button: 'Viaje completado', next: 'completed' },
  completed: { label: 'Viaje completado', color: 'var(--success)', button: '', next: null },
}

export default function DriverTrip() {
  const [phase, setPhase] = useState<Phase>('pickup')
  const nav = useNavigate()
  const config = phaseConfig[phase]

  const advance = () => {
    if (config.next === 'completed') { nav('/driver'); return }
    if (config.next) setPhase(config.next)
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Status bar */}
      <div style={{
        background: config.color, color: phase === 'arrived' ? 'var(--secondary)' : 'white',
        padding: '14px 16px', textAlign: 'center',
      }}>
        <p style={{ fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: 1 }}>
          🚕 {config.label}
        </p>
      </div>
      <div style={{
        height: 4,
        background: 'repeating-conic-gradient(var(--secondary) 0% 25%, var(--primary) 0% 50%) 0 0 / 8px 8px',
      }} />

      {/* Map */}
      <div className="map-placeholder" style={{ flex: 1 }}>
        <span style={{ zIndex: 1 }}>📍 Navegación en curso</span>
      </div>

      {/* Bottom panel */}
      <div style={{ background: 'var(--white)', padding: 16, boxShadow: 'var(--shadow-lg)' }}>
        {/* Passenger info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,193,7,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            border: '2px solid var(--primary)',
          }}>👤</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>Carlos López</p>
            <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Pasajero</p>
          </div>
          <a href="tel:999111222" style={{
            width: 44, height: 44, borderRadius: '50%', background: 'var(--success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            color: 'white', textDecoration: 'none', boxShadow: '0 3px 8px rgba(56,142,60,0.3)',
          }}>📞</a>
        </div>

        {/* Route info */}
        <div style={{
          display: 'flex', gap: 8, fontSize: 13, marginBottom: 16,
          padding: '12px 0', borderTop: '1px solid var(--gray-100)',
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--gray-400)', fontSize: 11, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Origen</p>
            <p style={{ fontWeight: 500 }}>Parque Principal</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--gray-400)', fontSize: 11, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Destino</p>
            <p style={{ fontWeight: 500 }}>Real Plaza</p>
          </div>
          <div>
            <p style={{ color: 'var(--gray-400)', fontSize: 11, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Precio</p>
            <p style={{ fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--font-display)', fontSize: 16 }}>S/ 8.50</p>
          </div>
        </div>

        {config.next && (
          <button className="btn btn-primary" onClick={advance} style={{ fontSize: 16 }}>
            {config.button}
          </button>
        )}
      </div>
    </div>
  )
}
