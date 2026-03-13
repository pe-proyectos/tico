import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  back?: boolean
  right?: React.ReactNode
}

export default function TopBar({ title, back, right }: Props) {
  const nav = useNavigate()
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: 'var(--secondary)',
        position: 'sticky', top: 0, zIndex: 50, color: 'var(--primary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {back && (
            <button onClick={() => nav(-1)} style={{
              background: 'none', fontSize: 20, padding: 4, color: 'var(--primary)',
            }}>←</button>
          )}
          <h1 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: 1 }}>
            🚕 {title}
          </h1>
        </div>
        {right && <div>{right}</div>}
      </div>
      <div style={{
        height: 6,
        background: 'repeating-conic-gradient(var(--secondary) 0% 25%, var(--primary) 0% 50%) 0 0 / 12px 12px',
      }} />
    </div>
  )
}
