import { useDriver } from '../../hooks/useDriver'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

const plans = [
  { name: 'FREE', price: 0, features: ['5 viajes/día', 'Soporte básico', 'Comisión 15%'], color: 'var(--gray-400)' },
  { name: 'PRO', price: 29.90, features: ['Viajes ilimitados', 'Soporte prioritario', 'Comisión 10%', 'Estadísticas avanzadas'], color: 'var(--primary)' },
  { name: 'BUSINESS', price: 59.90, features: ['Todo de PRO', 'Comisión 5%', 'Prioridad en solicitudes', 'Reportes mensuales', 'Soporte 24/7'], color: 'var(--success)' },
]

export default function DriverPlan() {
  const { stats } = useDriver()

  return (
    <div className="page">
      <TopBar title="Mi Plan" back />
      <div className="page-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {plans.map(plan => {
            const active = plan.name === stats.plan
            return (
              <div key={plan.name} className="card" style={{
                border: active ? `3px solid ${plan.color}` : '2px solid rgba(255,193,7,0.15)',
                position: 'relative',
              }}>
                {active && (
                  <span className="badge badge-success" style={{
                    position: 'absolute', top: -10, right: 16,
                  }}>Plan actual</span>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                    {plan.name === 'PRO' ? '⭐ ' : plan.name === 'BUSINESS' ? '💎 ' : ''}{plan.name}
                  </h3>
                  <div style={{ textAlign: 'right' }}>
                    {plan.price > 0 ? (
                      <>
                        <span style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)' }}>S/ {plan.price.toFixed(2)}</span>
                        <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>/mes</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-400)', fontFamily: 'var(--font-display)' }}>Gratis</span>
                    )}
                  </div>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: plan.color, fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                {!active && plan.price > 0 && (
                  <button className="btn btn-primary">
                    Contactar para upgrade
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <BottomNav role="DRIVER" />
    </div>
  )
}
