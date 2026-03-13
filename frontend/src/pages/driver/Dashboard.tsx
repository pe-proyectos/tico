import { useNavigate } from 'react-router-dom'
import { useDriver } from '../../hooks/useDriver'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

export default function DriverDashboard() {
  const { available, stats, toggleAvailable } = useDriver()
  const nav = useNavigate()

  return (
    <div className="page">
      <TopBar title="Conductor" />

      <div className="page-content" style={{ paddingTop: 24 }}>
        {/* Toggle */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <button
            onClick={toggleAvailable}
            style={{
              width: 140, height: 140, borderRadius: '50%',
              background: available ? 'var(--success)' : 'var(--gray-200)',
              border: available ? '4px solid rgba(56,142,60,0.3)' : '4px solid var(--gray-300)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto',
              transition: 'all 0.3s',
              boxShadow: available ? '0 0 40px rgba(56,142,60,0.3)' : 'var(--shadow-md)',
            }}
          >
            <span style={{ fontSize: 40 }}>{available ? '🟢' : '⭕'}</span>
            <span style={{
              fontWeight: 700, fontSize: 14, marginTop: 8,
              color: available ? 'white' : 'var(--gray-500)',
              fontFamily: 'var(--font-display)', textTransform: 'uppercase',
            }}>
              {available ? 'Disponible' : 'No disponible'}
            </span>
          </button>
          <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 12 }}>
            {available ? 'Esperando solicitudes...' : 'Activa para recibir viajes'}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--gray-400)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Viajes hoy</p>
            <p style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{stats.tripsToday}</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--gray-400)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Ganado hoy</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--font-display)' }}>S/ {stats.earningsToday.toFixed(2)}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 36, color: 'var(--primary)' }}>★</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 22, fontFamily: 'var(--font-display)' }}>{stats.rating}</p>
            <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>Tu calificación</p>
          </div>
        </div>

        {/* Plan badge */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Plan actual</p>
            <span className={`badge ${stats.plan === 'FREE' ? 'badge-neutral' : 'badge-success'}`}>
              {stats.plan}
            </span>
          </div>
          <button onClick={() => nav('/driver/plan')} style={{
            background: 'var(--primary)', color: 'var(--secondary)',
            padding: '10px 18px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 13,
            fontFamily: 'var(--font-display)', textTransform: 'uppercase',
            boxShadow: '0 3px 8px rgba(255,193,7,0.3)',
          }}>Ver planes</button>
        </div>

        {/* Simulate request */}
        {available && (
          <button className="btn btn-secondary" style={{ marginTop: 20 }}
            onClick={() => nav('/driver/request')}>
            🔔 Simular solicitud
          </button>
        )}
      </div>

      <BottomNav role="DRIVER" />
    </div>
  )
}
