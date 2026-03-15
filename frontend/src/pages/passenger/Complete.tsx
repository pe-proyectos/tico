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
      background: 'var(--white)',
    }}>
      {!submitted ? (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: 340, animation: 'scaleIn 0.4s ease' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #38A169, #2F855A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, color: 'white', margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(56,161,105,0.3)',
          }}>✓</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: 'var(--gray-700)' }}>
            ¡Llegaste!
          </h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: 32, fontSize: 15 }}>
            ¿Cómo estuvo tu viaje con Pedro?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
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
        <div style={{ textAlign: 'center', animation: 'scaleIn 0.3s ease' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--blue-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(26,54,93,0.25)',
          }}>🚕</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--gray-700)' }}>
            ¡Gracias por tu viaje!
          </h2>
          <p style={{ color: 'var(--gray-500)' }}>Redirigiendo al inicio...</p>
        </div>
      )}
    </div>
  )
}
