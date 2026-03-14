import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

const stats = [
  { label: 'Viajes activos', value: '12', icon: '🚕', color: 'var(--primary-dark)' },
  { label: 'Conductores online', value: '28', icon: '🟢', color: 'var(--success)' },
  { label: 'Viajes hoy', value: '156', icon: '📋', color: 'var(--info)' },
  { label: 'Ingresos estimados', value: 'S/ 1,248', icon: '💰', color: 'var(--success)' },
]

export default function AdminDashboard() {
  return (
    <div className="page">
      <TopBar title="Admin" />
      <div className="page-content">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Dashboard</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-sm)',
                background: `${s.color}12`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
              }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Actividad reciente</h3>
          {['Carlos pidió viaje a Real Plaza', 'Pedro aceptó solicitud', 'María completó viaje', 'Nuevo conductor registrado'].map((a, i) => (
            <div key={i} style={{
              padding: '12px 0',
              borderBottom: i < 3 ? '1px solid var(--gray-100)' : 'none',
              fontSize: 14, color: 'var(--gray-600)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--primary)', flexShrink: 0,
              }} />
              {a}
            </div>
          ))}
        </div>
      </div>
      <BottomNav role="ADMIN" />
    </div>
  )
}
