import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  const initial = (user.name?.[0] || user.phone?.[0] || 'U').toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: 34, height: 34, borderRadius: '50%',
        background: 'var(--blue-gradient)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700, color: '#FFFFFF',
        border: 'none', cursor: 'pointer', transition: 'transform 0.15s',
        transform: open ? 'scale(0.95)' : 'scale(1)',
        boxShadow: '0 2px 8px rgba(26,54,93,0.25)',
      }}>
        {initial}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 42, right: 0, zIndex: 9999,
          background: 'var(--white)', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)', padding: '12px 0',
          minWidth: 200, animation: 'scaleIn 0.15s ease',
          border: '1px solid var(--gray-100)',
        }}>
          <div style={{ padding: '8px 16px 12px', borderBottom: '1px solid var(--gray-100)' }}>
            <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--gray-700)' }}>{user.name}</p>
            <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>+51 {user.phone}</p>
          </div>
          <button onClick={() => { setOpen(false); logout() }} style={{
            width: '100%', padding: '10px 16px', background: 'none',
            textAlign: 'left', fontSize: 14, color: 'var(--danger)',
            fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8,
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-50)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
