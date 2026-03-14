import { useState } from 'react'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

const mockPlans = [
  { id: '1', name: 'FREE', price: 0, maxTrips: 20, drivers: 45 },
  { id: '2', name: 'PRO', price: 350, maxTrips: 100, drivers: 12 },
  { id: '3', name: 'BUSINESS', price: 500, maxTrips: -1, drivers: 3 },
]

export default function AdminPlans() {
  const [plans] = useState(mockPlans)

  return (
    <div className="page">
      <TopBar title="Planes" />
      <div className="page-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {plans.map(p => (
            <div key={p.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{p.name}</h3>
                <span className="badge badge-info">{p.drivers} conductores</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 2 }}>Precio</p>
                  <p style={{ fontWeight: 700 }}>{p.price > 0 ? `S/ ${p.price}/mes` : 'Gratis'}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 2 }}>Viajes/día</p>
                  <p style={{ fontWeight: 700 }}>{p.maxTrips === -1 ? 'Ilimitados' : p.maxTrips}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 24, textAlign: 'center' }}>
          <h3 style={{ fontWeight: 600, marginBottom: 8, fontSize: 15 }}>Resumen de ingresos por planes</h3>
          <p style={{ fontSize: 30, fontWeight: 800, color: 'var(--success)' }}>
            S/ {(12 * 350 + 3 * 500).toLocaleString()}/mes
          </p>
          <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>60 conductores activos</p>
        </div>
      </div>
      <BottomNav role="ADMIN" />
    </div>
  )
}
