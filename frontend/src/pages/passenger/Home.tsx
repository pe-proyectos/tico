import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from '../../hooks/useTrip'

export default function Home() {
  const [destination, setDestination] = useState('')
  const [showPanel, setShowPanel] = useState(false)
  const { searchTrip, trip, loading } = useTrip()
  const nav = useNavigate()

  const handleSearch = async () => {
    if (!destination) return
    const t = await searchTrip('Mi ubicación', destination)
    setShowPanel(true)
  }

  const handleRequest = () => {
    if (trip) nav(`/trip/${trip.id}/waiting`)
  }

  return (
    <div style={{ height: '100dvh', position: 'relative' }}>
      {/* Map */}
      <div className="map-placeholder" style={{ height: '100%' }}>
        <span style={{ zIndex: 1 }}>📍 Mapa de Chiclayo</span>
      </div>

      {/* Search bar */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10,
      }}>
        <div style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)', padding: 16,
          border: '2px solid rgba(255,193,7,0.2)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              flexShrink: 0, boxShadow: '0 2px 8px rgba(255,193,7,0.3)',
            }}>🚕</div>
            <span style={{ fontWeight: 700, fontSize: 20, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: 1 }}>Tico</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)',
              fontSize: 14, color: 'var(--gray-500)',
            }}>
              <span style={{ color: 'var(--success)', fontSize: 10 }}>●</span>
              Mi ubicación actual
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="input"
                placeholder="¿A dónde vas?"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                style={{ fontSize: 15 }}
              />
              <button
                className="btn btn-primary"
                style={{ width: 'auto', padding: '12px 20px' }}
                onClick={handleSearch}
                disabled={!destination || loading}
              >
                Ir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick destinations */}
      {!showPanel && (
        <div style={{
          position: 'absolute', bottom: 24, left: 16, right: 16, zIndex: 10,
        }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {['Real Plaza', 'Open Plaza', 'Terminal', 'Hospital', 'USAT'].map(place => (
              <button key={place} onClick={() => { setDestination(place); handleSearch() }} style={{
                background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-xl)',
                padding: '10px 16px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                boxShadow: '0 3px 10px rgba(255,193,7,0.4)', color: 'var(--secondary)',
                fontFamily: 'var(--font-display)', textTransform: 'uppercase',
              }}>
                📍 {place}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price panel */}
      {showPanel && trip && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
          background: 'var(--white)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          boxShadow: 'var(--shadow-lg)', padding: 24,
          animation: 'slideUp 0.3s ease',
          borderTop: '3px solid var(--primary)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ color: 'var(--gray-500)', fontSize: 13, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Destino</p>
              <p style={{ fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-display)' }}>{destination}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--gray-500)', fontSize: 13, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Precio estimado</p>
              <p style={{ fontWeight: 700, fontSize: 28, color: 'var(--primary-dark)', fontFamily: 'var(--font-display)' }}>S/ {trip.price.toFixed(2)}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Distancia</p>
              <p style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 16 }}>{trip.distance || 2.3} km</p>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Tiempo est.</p>
              <p style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 16 }}>{trip.duration || 8} min</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleRequest} style={{ fontSize: 18 }}>
            🚕 Buscar Taxista
          </button>
          <button className="btn btn-outline" onClick={() => setShowPanel(false)} style={{ marginTop: 8 }}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
