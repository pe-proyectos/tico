import { useState } from 'react'
import { useDriver } from '../../hooks/useDriver'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

export default function DriverHistory() {
  const { stats, history } = useDriver()
  const [filter, setFilter] = useState<'today' | 'week'>('today')

  const filtered = filter === 'today' ? history.slice(0, 5) : history
  const total = filter === 'today' ? stats.earningsToday : stats.earningsWeek
  const count = filter === 'today' ? stats.tripsToday : stats.tripsWeek

  return (
    <div className="page">
      <TopBar title="Historial" />
      <div className="page-content">
        {/* Segmented control */}
        <div style={{
          display: 'flex', padding: 3, marginBottom: 16,
          background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)',
        }}>
          {(['today', 'week'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              flex: 1, padding: '10px',
              borderRadius: 6,
              background: filter === f ? 'var(--white)' : 'transparent',
              color: filter === f ? 'var(--secondary)' : 'var(--gray-500)',
              fontWeight: filter === f ? 600 : 400, fontSize: 14,
              boxShadow: filter === f ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s',
            }}>
              {f === 'today' ? 'Hoy' : 'Esta semana'}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-700)' }}>{count}</p>
            <p style={{ fontSize: 12, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Viajes</p>
          </div>
          <div style={{ width: 1, background: 'var(--gray-100)' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--success)' }}>S/ {total.toFixed(2)}</p>
            <p style={{ fontSize: 12, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ganancias</p>
          </div>
        </div>

        {/* Trip list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🚕</div>
              <p style={{ fontWeight: 600, fontSize: 16, color: 'var(--gray-700)', marginBottom: 4 }}>No tienes viajes aún</p>
              <p style={{ fontSize: 14, color: 'var(--gray-400)' }}>Tus viajes completados aparecerán aquí</p>
            </div>
          )}
          {filtered.map(t => (
            <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, color: 'var(--gray-700)' }}>{t.origin} → {t.destination}</p>
                <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                  {new Date(t.date).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} · {t.passengerName}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, color: 'var(--success)', fontSize: 15 }}>S/ {t.price.toFixed(2)}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end', fontSize: 12 }}>
                  <span style={{ color: '#E5B63A' }}>★</span>
                  <span style={{ color: 'var(--gray-400)' }}>{t.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav role="DRIVER" />
    </div>
  )
}
