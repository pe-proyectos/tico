import { useLocation, useNavigate } from 'react-router-dom'

interface NavItem { path: string; label: string; icon: string }

const passengerNav: NavItem[] = [
  { path: '/', label: 'Inicio', icon: '🏠' },
]

const driverNav: NavItem[] = [
  { path: '/driver', label: 'Inicio', icon: '🏠' },
  { path: '/driver/history', label: 'Historial', icon: '📋' },
  { path: '/driver/plan', label: 'Plan', icon: '⭐' },
]

const adminNav: NavItem[] = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/drivers', label: 'Conductores', icon: '🚕' },
  { path: '/admin/trips', label: 'Viajes', icon: '📋' },
  { path: '/admin/plans', label: 'Planes', icon: '💎' },
]

export default function BottomNav({ role }: { role: 'PASSENGER' | 'DRIVER' | 'ADMIN' }) {
  const loc = useLocation()
  const nav = useNavigate()
  const items = role === 'ADMIN' ? adminNav : role === 'DRIVER' ? driverNav : passengerNav

  if (items.length <= 1) return null

  return (
    <>
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      }}>
        <div style={{
          height: 4,
          background: 'repeating-conic-gradient(var(--secondary) 0% 25%, var(--primary) 0% 50%) 0 0 / 8px 8px',
        }} />
        <nav style={{
          background: 'var(--secondary)',
          display: 'flex', justifyContent: 'space-around',
          padding: '6px 0 max(6px, env(safe-area-inset-bottom))',
        }}>
          {items.map(item => {
            const active = loc.pathname === item.path
            return (
              <button key={item.path} onClick={() => nav(item.path)} style={{
                background: active ? 'var(--primary)' : 'none',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 2, padding: '6px 16px',
                borderRadius: 'var(--radius-sm)',
                color: active ? 'var(--secondary)' : 'var(--gray-300)',
                fontSize: 10, fontWeight: active ? 700 : 400,
                fontFamily: 'var(--font-display)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}
