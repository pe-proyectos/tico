import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  title: string
  back?: boolean
  right?: React.ReactNode
  transparent?: boolean
}

export default function TopBar({ title, back, right, transparent }: Props) {
  const nav = useNavigate()
  const { logout } = useAuth()

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px',
      background: transparent ? 'transparent' : 'var(--white)',
      borderBottom: transparent ? 'none' : '1px solid var(--gray-100)',
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: transparent ? 'blur(20px)' : undefined,
      WebkitBackdropFilter: transparent ? 'blur(20px)' : undefined,
      minHeight: 56,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        {back && (
          <button onClick={() => nav(-1)} style={{
            background: 'var(--gray-50)', width: 36, height: 36,
            borderRadius: 'var(--radius-sm)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: 'var(--secondary)',
            transition: 'background 0.2s',
          }}>←</button>
        )}
      </div>
      <h1 style={{
        fontSize: 17, fontWeight: 700, color: 'var(--secondary)',
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
      }}>
        {title}
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
        {right}
        {!right && (
          <button onClick={logout} style={{
            background: 'none', fontSize: 13, color: 'var(--gray-400)',
            padding: '6px 10px', borderRadius: 'var(--radius-sm)',
            transition: 'color 0.2s',
          }} title="Cerrar sesión">
            ⏻
          </button>
        )}
      </div>
    </div>
  )
}
