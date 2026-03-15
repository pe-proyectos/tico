import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTrip } from '../../hooks/useTrip'
import Map, { originIcon, destIcon, driverIcon } from '../../components/Map'
import { CHICLAYO_CENTER, DEMO_LOCATIONS } from '../../lib/routing'

export default function ActiveTrip() {
  const { id } = useParams()
  const nav = useNavigate()
  const { trip, getTrip } = useTrip()

  const origin = CHICLAYO_CENTER
  const dest: [number, number] = DEMO_LOCATIONS['Real Plaza']
  const [driverPos, setDriverPos] = useState<[number, number]>(origin)
  const [progress, setProgress] = useState(0)

  useEffect(() => { if (id) getTrip(id) }, [id])

  useEffect(() => {
    const i = setInterval(() => {
      setProgress(p => {
        if (p >= 1) { clearInterval(i); return 1 }
        return p + 0.02
      })
    }, 500)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    setDriverPos([
      origin[0] + (dest[0] - origin[0]) * progress,
      origin[1] + (dest[1] - origin[1]) * progress,
    ])
  }, [progress])

  const markers = useMemo(() => [
    { position: origin, icon: originIcon },
    { position: dest, icon: destIcon },
    { position: driverPos, icon: driverIcon },
  ], [driverPos])

  const eta = Math.max(1, Math.round(8 * (1 - progress)))

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Map center={driverPos} zoom={15} markers={markers} route={[origin, dest]} style={{ height: '100%', width: '100%' }} />

        {/* ETA floating pill */}
        <div style={{
          position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, background: 'var(--secondary-deep)', color: 'var(--white)',
          padding: '8px 20px', borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 13, opacity: 0.7 }}>Llegada en</span>
          <span style={{ fontSize: 18, fontWeight: 800 }}>{eta} min</span>
        </div>

        {/* Status pill */}
        <div style={{
          position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, background: 'var(--blue-gradient)',
          padding: '6px 14px', borderRadius: 'var(--radius-full)',
          fontSize: 12, fontWeight: 600, color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(26,54,93,0.3)',
        }}>
          🚕 En camino
        </div>
      </div>

      {/* Driver card */}
      <div style={{
        background: 'var(--white)', padding: 20,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', background: 'var(--gray-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>👤</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-700)' }}>{trip?.driver?.name || 'Pedro Ruiz'}</p>
            <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
              {trip?.driver?.vehicle || 'Toyota Yaris Blanco'} · {trip?.driver?.plate || 'ABC-123'}
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            background: 'rgba(246,199,68,0.15)', padding: '4px 8px',
            borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600,
          }}>
            <span style={{ color: '#E5B63A' }}>★</span>
            <span>{trip?.driver?.rating || 4.7}</span>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 12, padding: '14px 0',
          borderTop: '1px solid var(--gray-100)', borderBottom: '1px solid var(--gray-100)',
          marginBottom: 16,
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Origen</p>
            <p style={{ fontWeight: 500, fontSize: 13, color: 'var(--gray-700)' }}>{trip?.origin?.address || 'Parque Principal'}</p>
          </div>
          <div style={{ width: 1, background: 'var(--gray-100)' }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Destino</p>
            <p style={{ fontWeight: 500, fontSize: 13, color: 'var(--gray-700)' }}>{trip?.destination?.address || 'Real Plaza'}</p>
          </div>
          <div style={{ width: 1, background: 'var(--gray-100)' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Precio</p>
            <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--secondary)' }}>S/ {trip?.price?.toFixed(2) || '8.50'}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <a href="tel:105" style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, padding: '14px', borderRadius: 'var(--radius-md)',
            background: 'rgba(229,62,62,0.06)', color: 'var(--danger)',
            fontSize: 13, fontWeight: 600, textDecoration: 'none',
            border: '1px solid rgba(229,62,62,0.15)',
          }}>
            🆘 Emergencia
          </a>
          <button className="btn btn-outline" style={{ flex: 1, minHeight: 'auto', padding: '14px' }}
            onClick={() => nav(`/trip/${id}/complete`)}>
            Simular llegada
          </button>
        </div>
      </div>
    </div>
  )
}
