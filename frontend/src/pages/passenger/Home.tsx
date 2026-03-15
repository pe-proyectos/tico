import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from '../../hooks/useTrip'
import Map, { originIcon, destIcon, userIcon } from '../../components/Map'
import { CHICLAYO_CENTER, DEMO_LOCATIONS, getRoute } from '../../lib/routing'
import UserMenu from '../../components/UserMenu'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function Home() {
  const [destination, setDestination] = useState('')
  const [showPanel, setShowPanel] = useState(false)
  const [userPos, setUserPos] = useState<[number, number]>(CHICLAYO_CENTER)
  const [route, setRoute] = useState<[number, number][] | undefined>()
  const { searchTrip, trip, loading } = useTrip()
  const nav = useNavigate()

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      p => setUserPos([p.coords.latitude, p.coords.longitude]),
      () => {},
      { timeout: 5000 }
    )
  }, [])

  const destPos = useMemo(() => {
    for (const [name, pos] of Object.entries(DEMO_LOCATIONS)) {
      if (destination.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(destination.toLowerCase())) {
        return pos
      }
    }
    return null
  }, [destination])

  const handleSearch = async () => {
    if (!destination) return
    await searchTrip('Mi ubicación', destination)
    setShowPanel(true)
    if (destPos) {
      const r = await getRoute(userPos, destPos)
      setRoute(r?.coordinates || [userPos, destPos])
    }
  }

  const handleRequest = () => {
    if (trip) nav(`/trip/${trip.id}/waiting`)
  }

  const markers = useMemo(() => {
    const m = [{ position: userPos, icon: userIcon }]
    if (showPanel && destPos) {
      m.push({ position: userPos, icon: originIcon })
      m.push({ position: destPos, icon: destIcon })
    }
    return m
  }, [userPos, destPos, showPanel])

  return (
    <div style={{ height: '100dvh', position: 'relative' }}>
      <Map
        center={userPos}
        zoom={14}
        markers={markers}
        route={showPanel ? route : undefined}
        style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}
      />

      {/* Floating search card - opaque white */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16, zIndex: 1000,
      }}>
        <div style={{
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          padding: 16,
          background: '#FFFFFF',
          border: '1px solid var(--gray-100)',
        }}>
          {/* Header with branding and user menu */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🚕</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--secondary)' }}>Tico</span>
            </div>
            <UserMenu />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)',
              fontSize: 14, color: 'var(--gray-500)',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
              Mi ubicación actual
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--primary-blue)', fontSize: 16, pointerEvents: 'none',
                }}>🔍</span>
                <input
                  className="input"
                  placeholder="¿A dónde vas?"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  style={{ paddingLeft: 38 }}
                />
              </div>
              <button
                className="btn btn-primary"
                style={{ width: 'auto', padding: '12px 20px', minHeight: 'auto' }}
                onClick={handleSearch}
                disabled={!destination || loading}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick destination chips */}
      {!showPanel && (
        <div style={{
          position: 'absolute', bottom: 24, left: 0, right: 0, zIndex: 1000,
          padding: '0 16px',
        }}>
          <div style={{
            display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
            scrollbarWidth: 'none',
          }}>
            {['Real Plaza', 'Open Plaza', 'Terminal', 'Hospital', 'USAT'].map(place => (
              <button key={place} onClick={() => setDestination(place)} style={{
                background: 'var(--white)', border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '10px 16px', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)', color: 'var(--gray-600)',
                transition: 'all 0.2s',
              }}>
                📍 {place}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price bottom sheet */}
      {showPanel && trip && (
        <div className="bottom-sheet">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <p style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 2 }}>Destino</p>
              <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--gray-700)' }}>{destination}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 2 }}>Precio estimado</p>
              <p style={{ fontWeight: 800, fontSize: 30, color: 'var(--secondary)' }}>S/ {trip.price.toFixed(2)}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div style={{
              textAlign: 'center', flex: 1, padding: '10px',
              background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)',
            }}>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 2 }}>Distancia</p>
              <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--gray-700)' }}>{trip.distance || 2.3} km</p>
            </div>
            <div style={{
              textAlign: 'center', flex: 1, padding: '10px',
              background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)',
            }}>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 2 }}>Tiempo est.</p>
              <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--gray-700)' }}>{trip.duration || 8} min</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleRequest} disabled={loading} style={{ fontSize: 16, fontWeight: 700 }}>
            {loading ? <LoadingSpinner size={20} color="#FFFFFF" /> : 'Buscar Taxista'}
          </button>
          <button className="btn btn-outline" onClick={() => { setShowPanel(false); setRoute(undefined) }} style={{ marginTop: 8 }}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
