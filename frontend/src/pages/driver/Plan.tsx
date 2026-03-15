import { useDriver } from '../../hooks/useDriver'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

const plans = [
  { name: 'FREE', price: 0, features: ['20 viajes/día', 'Sin comisión por viaje', 'Soporte básico'], color: 'var(--gray-400)' },
  { name: 'PRO', price: 350, features: ['100 viajes/día', 'Sin comisión por viaje', 'Soporte prioritario', 'Estadísticas avanzadas'], color: 'var(--primary-blue)', highlight: true },
  { name: 'BUSINESS', price: 500, features: ['Viajes ilimitados', 'Sin comisión por viaje', 'Prioridad en solicitudes', 'Reportes mensuales', 'Soporte 24/7'], color: 'var(--success)' },
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
            const isPro = (plan as any).highlight
            return (
              <div key={plan.name} className="card" style={{
                border: active ? `2px solid ${plan.color}` : isPro ? '2px solid var(--primary-blue)' : '1px solid var(--gray-100)',
                position: 'relative',
                background: isPro && !active ? 'rgba(26,54,93,0.02)' : 'var(--white)',
                boxShadow: isPro ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              }}>
                {active && (
                  <span className="badge badge-success" style={{
                    position: 'absolute', top: -10, right: 16,
                  }}>Plan actual</span>
                )}
                {isPro && !active && (
                  <span className="badge badge-info" style={{
                    position: 'absolute', top: -10, right: 16,
                  }}>Recomendado</span>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-700)' }}>
                    {plan.name === 'PRO' ? '⭐ ' : plan.name === 'BUSINESS' ? '💎 ' : ''}{plan.name}
                  </h3>
                  <div style={{ textAlign: 'right' }}>
                    {plan.price > 0 ? (
                      <div>
                        <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-700)' }}>S/ {plan.price}</span>
                        <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>/mes</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-400)' }}>Gratis</span>
                    )}
                  </div>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gray-600)' }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: isPro ? 'rgba(26,54,93,0.08)' : `${plan.color}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, color: plan.color, fontWeight: 700, flexShrink: 0,
                      }}>✓</span>
                      {f}
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
