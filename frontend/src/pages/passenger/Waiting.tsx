import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTrip } from '../../hooks/useTrip'
import Map, { originIcon, driverIcon } from '../../components/Map'
import { CHICLAYO_CENTER } from '../../lib/routing'

export default function Waiting() {
  const { id } = useParams()
  const nav = useNavigate()
  const { trip, getTrip } = useTrip()
  const [matched, setMatched] = useState(false)
  const [driverPos, setDriverPos] = useState<[number, number]>([-6.7750, -79.8450])

  useEffect(() => { if (id) getTrip(id) }, [id])
  useEffect(() => {
    const t = setTimeout(() => setMatched(true), 4000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!matched) return
    const target = CHICLAYO_CENTER
    const i = setInterval(() => {
      setDriverPos(p => [
        p[0] + (target[0] - p[0]) * 0.15,
        p[1] + (target[1] - p[1]) * 0.15,
      ])
    }, 1000)
    return () => clearInterval(i)
  }, [matched])

  const markers = [
    { position: CHICLAYO_CENTER, icon: originIcon },
    ...(matched ? [{ position: driverPos, icon: driverIcon }] : []),
  ]

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Map center={CHICLAYO_CENTER} zoom={15} markers={markers} style={{ height: '100%', width: '100%' }} />

        <div className="bottom-sheet">
          {!matched ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              {/* Pulsing search animation */}
              <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 20px' }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'rgba(26,54,93,0.1)',
                  animation: 'searchPulse 2s ease-in-out infinite',
                }} />
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'rgba(26,54,93,0.1)',
                  animation: 'searchPulse 2s ease-in-out infinite 0.5s',
                }} />
                <div style={{
                  position: 'relative', width: 72, height: 72, borderRadius: '50%',
                  background: 'var(--blue-gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32,
                }}>🚕</div>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: 'var(--gray-700)' }}>
                Buscando tu Tico...
              </h2>
              <p style={{ color: 'var(--gray-500)', marginBottom: 20, fontSize: 14 }}>
                Conectándote con el conductor más cercano
              </p>
              <button className="btn btn-outline" onClick={() => nav('/')} style={{ maxWidth: 200, margin: '0 auto' }}>
                Cancelar
              </button>
            </div>
          ) : (
            <div style={{ animation: 'slideUp 0.3s ease' }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #38A169, #2F855A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, color: 'white', margin: '0 auto 10px',
                  boxShadow: '0 4px 12px rgba(56,161,105,0.3)',
                }}>✓</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-700)' }}>
                  ¡Taxista encontrado!
                </h2>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
                padding: 14, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'var(--gray-200)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
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

              <button className="btn btn-primary" onClick={() => nav(`/trip/${id}/active`)}>
                Ver viaje en curso
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
