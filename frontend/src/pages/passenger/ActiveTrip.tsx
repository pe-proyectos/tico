import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTrip } from '../../hooks/useTrip'

export default function ActiveTrip() {
  const { id } = useParams()
  const nav = useNavigate()
  const { trip, getTrip } = useTrip()

  useEffect(() => { if (id) getTrip(id) }, [id])

  return (
    <div style={{ height: '100dvh', position: 'relative' }}>
      {/* Map */}
      <div className="map-placeholder" style={{ height: '55%' }}>
        <div style={{ zIndex: 1, textAlign: 'center' }}>
          <p>📍 Mapa en tiempo real</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Simulando ubicación del conductor</p>
        </div>
      </div>

      {/* ETA bar */}
      <div style={{
        background: 'var(--secondary)', color: 'var(--white)',
        padding: '12px 16px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <p style={{ fontSize: 12, opacity: 0.7, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Tiempo estimado</p>
          <p style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>8 min</p>
        </div>
        <div style={{
          background: 'var(--primary)', padding: '6px 14px',
          borderRadius: 'var(--radius-sm)', fontWeight: 700, color: 'var(--secondary)',
          fontFamily: 'var(--font-display)', textTransform: 'uppercase',
        }}>🚕 En camino</div>
      </div>
      <div style={{
        height: 4,
        background: 'repeating-conic-gradient(var(--secondary) 0% 25%, var(--primary) 0% 50%) 0 0 / 8px 8px',
      }} />

      {/* Driver card */}
      <div style={{ padding: 16, background: 'var(--white)', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,193,7,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            border: '2px solid var(--primary)',
          }}>👤</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>{trip?.driver?.name || 'Pedro Ruiz'}</p>
            <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
              {trip?.driver?.vehicle || 'Toyota Yaris Blanco'} · {trip?.driver?.plate || 'ABC-123'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)' }}>
            <span>★</span><span style={{ fontWeight: 600 }}>{trip?.driver?.rating || 4.7}</span>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 8, padding: '12px 0',
          borderTop: '1px solid var(--gray-100)', borderBottom: '1px solid var(--gray-100)',
          marginBottom: 16,
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: 'var(--gray-400)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Origen</p>
            <p style={{ fontWeight: 500, fontSize: 13 }}>{trip?.origin?.address || 'Parque Principal'}</p>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: 'var(--gray-400)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Destino</p>
            <p style={{ fontWeight: 500, fontSize: 13 }}>{trip?.destination?.address || 'Real Plaza'}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: 'var(--gray-400)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Precio</p>
            <p style={{ fontWeight: 700, color: 'var(--primary-dark)', fontFamily: 'var(--font-display)', fontSize: 16 }}>S/ {trip?.price?.toFixed(2) || '8.50'}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <a href="tel:105" className="btn btn-danger" style={{ flex: 1, textDecoration: 'none' }}>
            🚨 Emergencia 105
          </a>
          <button className="btn btn-outline" style={{ flex: 1 }}
            onClick={() => nav(`/trip/${id}/complete`)}>
            Simular llegada
          </button>
        </div>
      </div>
    </div>
  )
}
