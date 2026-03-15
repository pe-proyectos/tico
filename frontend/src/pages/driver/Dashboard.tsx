import { useNavigate } from 'react-router-dom'
import { useDriver } from '../../hooks/useDriver'
import { useAuth } from '../../context/AuthContext'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

export default function DriverDashboard() {
  const { available, stats, toggleAvailable } = useDriver()
  const { logout } = useAuth()
  const nav = useNavigate()

  return (
    <div className="page">
      <TopBar title="Conductor" right={
        <button onClick={logout} style={{
          background: 'none', fontSize: 13, color: 'var(--gray-400)',
          padding: '6px 10px', borderRadius: 'var(--radius-sm)',
        }}>
          ⏻
        </button>
      } />

      <div className="page-content" style={{ paddingTop: 24 }}>
        {/* Modern toggle switch */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 16,
            padding: '16px 28px', borderRadius: 'var(--radius-lg)',
            background: available ? 'rgba(56,161,105,0.06)' : 'var(--gray-50)',
            border: `1.5px solid ${available ? 'rgba(56,161,105,0.2)' : 'var(--gray-200)'}`,
            transition: 'all 0.3s ease',
          }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: available ? 'var(--success)' : 'var(--gray-500)' }}>
              {available ? 'Disponible' : 'No disponible'}
            </span>
            <button
              onClick={toggleAvailable}
              style={{
                width: 56, height: 30, borderRadius: 15,
                background: available ? 'var(--success)' : 'var(--gray-300)',
                position: 'relative', transition: 'background 0.3s ease',
                padding: 0, border: 'none', cursor: 'pointer',
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 3,
                left: available ? 29 : 3,
                transition: 'left 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              }} />
            </button>
          </div>
          <p style={{ color: 'var(--gray-400)', fontSize: 13, marginTop: 10 }}>
            {available ? 'Esperando solicitudes...' : 'Activa para recibir viajes'}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Viajes hoy</p>
            <p style={{ fontSize: 30, fontWeight: 800, color: 'var(--gray-700)' }}>{stats.tripsToday}</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ganado hoy</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--success)' }}>S/ {stats.earningsToday.toFixed(2)}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 'var(--radius-sm)',
            background: 'rgba(246,199,68,0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>⭐</div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 20, color: 'var(--gray-700)' }}>{stats.rating}</p>
            <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>Tu calificación</p>
          </div>
        </div>

        {/* Plan badge */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <p style={{ fontWeight: 600, marginBottom: 4, color: 'var(--gray-700)' }}>Plan actual</p>
            <span className={`badge ${stats.plan === 'FREE' ? 'badge-neutral' : 'badge-success'}`}>
              {stats.plan}
            </span>
          </div>
          <button onClick={() => nav('/driver/plan')} className="btn btn-primary" style={{
            width: 'auto', padding: '10px 18px', fontSize: 13, minHeight: 'auto',
          }}>Ver planes</button>
        </div>

        {/* Simulate request */}
        {available && (
          <button className="btn btn-secondary" style={{ marginTop: 12 }}
            onClick={() => nav('/driver/request')}>
            🔔 Simular solicitud
          </button>
        )}
      </div>

      <BottomNav role="DRIVER" />
    </div>
  )
}
