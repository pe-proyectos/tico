import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StarRating from '../../components/StarRating'

export default function Complete() {
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const nav = useNavigate()

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => nav('/'), 2000)
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      background: 'var(--bg)',
    }}>
      {!submitted ? (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: 340 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: 'var(--success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, color: 'white', margin: '0 auto 20px',
            boxShadow: '0 4px 16px rgba(56,142,60,0.3)',
          }}>✓</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
            ¡Llegaste!
          </h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: 24 }}>
            ¿Cómo estuvo tu viaje con Pedro?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <StarRating value={rating} onChange={setRating} size={44} />
          </div>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!rating}>
            Calificar
          </button>
          <button className="btn btn-outline" onClick={() => nav('/')} style={{ marginTop: 8 }}>
            Omitir
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🚕</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
            ¡Gracias por tu viaje!
          </h2>
          <p style={{ color: 'var(--gray-500)' }}>Redirigiendo al inicio...</p>
        </div>
      )}
    </div>
  )
}
