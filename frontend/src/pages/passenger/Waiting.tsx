import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTrip } from '../../hooks/useTrip'

export default function Waiting() {
  const { id } = useParams()
  const nav = useNavigate()
  const { trip, getTrip } = useTrip()
  const [matched, setMatched] = useState(false)
  const [dots, setDots] = useState('')

  useEffect(() => { if (id) getTrip(id) }, [id])

  // Animate dots
  useEffect(() => {
    const i = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500)
    return () => clearInterval(i)
  }, [])

  // Simulate match after 4s
  useEffect(() => {
    const t = setTimeout(() => setMatched(true), 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      background: 'var(--bg)',
    }}>
      {!matched ? (
        <>
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: 'var(--primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 56, animation: 'pulse 1.5s ease infinite',
            marginBottom: 24, boxShadow: '0 8px 32px rgba(255,193,7,0.4)',
            border: '4px solid var(--secondary)',
          }}>🚕</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
            Buscando taxista{dots}
          </h2>
          <p style={{ color: 'var(--gray-500)', textAlign: 'center', marginBottom: 32 }}>
            Estamos conectándote con el conductor más cercano
          </p>
          <button className="btn btn-outline" onClick={() => nav('/')} style={{ maxWidth: 200 }}>
            Cancelar
          </button>
        </>
      ) : (
        <div style={{ width: '100%', maxWidth: 380, animation: 'slideUp 0.3s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', background: 'var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, color: 'white', margin: '0 auto 12px',
              boxShadow: '0 4px 16px rgba(56,142,60,0.3)',
            }}>✓</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
              ¡Taxista encontrado!
            </h2>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,193,7,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                border: '2px solid var(--primary)',
              }}>👤</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 18, fontFamily: 'var(--font-display)' }}>{trip?.driver?.name || 'Pedro Ruiz'}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)' }}>
                  <span>★</span>
                  <span style={{ fontWeight: 600 }}>{trip?.driver?.rating || 4.7}</span>
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex', gap: 12, padding: '12px 0',
              borderTop: '1px solid var(--gray-100)',
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: 'var(--gray-400)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Vehículo</p>
                <p style={{ fontWeight: 600, fontSize: 13 }}>{trip?.driver?.vehicle || 'Toyota Yaris Blanco'}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--gray-400)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Placa</p>
                <p style={{
                  fontWeight: 700, fontSize: 15, background: 'var(--primary)',
                  padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-display)',
                }}>{trip?.driver?.plate || 'ABC-123'}</p>
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => nav(`/trip/${id}/active`)}>
            🚕 Ver viaje en curso
          </button>
        </div>
      )}
    </div>
  )
}
