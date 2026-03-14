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
  { path: '/admin/drivers', label: 'Conductores', icon: '🚗' },
  { path: '/admin/trips', label: 'Viajes', icon: '📋' },
  { path: '/admin/plans', label: 'Planes', icon: '💎' },
]

export default function BottomNav({ role }: { role: 'PASSENGER' | 'DRIVER' | 'ADMIN' }) {
  const loc = useLocation()
  const nav = useNavigate()
  const items = role === 'ADMIN' ? adminNav : role === 'DRIVER' ? driverNav : passengerNav

  if (items.length <= 1) return null

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'var(--white)',
      boxShadow: '0 -1px 12px rgba(0,0,0,0.06)',
      display: 'flex', justifyContent: 'space-around',
      padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
    }}>
      {items.map(item => {
        const active = loc.pathname === item.path
        return (
          <button key={item.path} onClick={() => nav(item.path)} style={{
            background: 'none',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 4, padding: '6px 20px',
            color: active ? 'var(--primary-dark)' : 'var(--gray-400)',
            fontSize: 11, fontWeight: active ? 600 : 400,
            transition: 'all 0.2s',
            position: 'relative',
          }}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</span>
            <span>{item.label}</span>
            {active && (
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 20, height: 3, borderRadius: 2,
                background: 'var(--primary-gradient)',
              }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}
