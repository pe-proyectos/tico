import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Map, { originIcon, destIcon, driverIcon } from '../../components/Map'
import { CHICLAYO_CENTER, DEMO_LOCATIONS } from '../../lib/routing'

type Phase = 'pickup' | 'arrived' | 'in_progress' | 'completed'

const phaseConfig: Record<Phase, { label: string; color: string; bg: string; button: string; next: Phase | null }> = {
  pickup: { label: 'Recogiendo pasajero', color: 'var(--white)', bg: 'var(--info)', button: 'Llegué', next: 'arrived' },
  arrived: { label: 'Esperando pasajero', color: 'var(--secondary)', bg: 'var(--primary)', button: 'Iniciar viaje', next: 'in_progress' },
  in_progress: { label: 'En camino al destino', color: 'var(--white)', bg: 'var(--success)', button: 'Viaje completado', next: 'completed' },
  completed: { label: 'Viaje completado', color: 'var(--white)', bg: 'var(--success)', button: '', next: null },
}

export default function DriverTrip() {
  const [phase, setPhase] = useState<Phase>('pickup')
  const [progress, setProgress] = useState(0)
  const nav = useNavigate()
  const config = phaseConfig[phase]

  const origin = CHICLAYO_CENTER
  const dest: [number, number] = DEMO_LOCATIONS['Real Plaza']

  useEffect(() => {
    if (phase !== 'pickup' && phase !== 'in_progress') return
    setProgress(0)
    const i = setInterval(() => {
      setProgress(p => {
        if (p >= 1) { clearInterval(i); return 1 }
        return p + 0.03
      })
    }, 500)
    return () => clearInterval(i)
  }, [phase])

  const driverPos: [number, number] = useMemo(() => {
    const start = phase === 'pickup' ? [-6.7750, -79.8450] as [number, number] : origin
    const target = phase === 'pickup' ? origin : dest
    return [
      start[0] + (target[0] - start[0]) * progress,
      start[1] + (target[1] - start[1]) * progress,
    ]
  }, [phase, progress])

  const markers = useMemo(() => [
    { position: origin, icon: originIcon },
    { position: dest, icon: destIcon },
    { position: driverPos, icon: driverIcon },
  ], [driverPos])

  const advance = () => {
    if (config.next === 'completed') { nav('/driver'); return }
    if (config.next) setPhase(config.next)
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Status pill at top */}
      <div style={{
        background: config.bg, color: config.color,
        padding: '12px 16px', textAlign: 'center',
        fontWeight: 600, fontSize: 14,
      }}>
        🚕 {config.label}
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <Map center={driverPos} zoom={15} markers={markers} route={[origin, dest]} style={{ height: '100%' }} />
      </div>

      {/* Bottom panel */}
      <div style={{
        background: 'var(--white)', padding: 20,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', background: 'var(--gray-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>👤</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700 }}>Carlos López</p>
            <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Pasajero</p>
          </div>
          <a href="tel:999111222" style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            color: 'white', textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
          }}>📞</a>
        </div>

        <div style={{
          display: 'flex', gap: 12, fontSize: 13, marginBottom: 16,
          padding: '14px 0', borderTop: '1px solid var(--gray-100)',
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--gray-400)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Origen</p>
            <p style={{ fontWeight: 500 }}>Parque Principal</p>
          </div>
          <div style={{ width: 1, background: 'var(--gray-100)' }} />
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--gray-400)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Destino</p>
            <p style={{ fontWeight: 500 }}>Real Plaza</p>
          </div>
          <div style={{ width: 1, background: 'var(--gray-100)' }} />
          <div>
            <p style={{ color: 'var(--gray-400)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Precio</p>
            <p style={{ fontWeight: 700, color: 'var(--success)', fontSize: 16 }}>S/ 8.50</p>
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
