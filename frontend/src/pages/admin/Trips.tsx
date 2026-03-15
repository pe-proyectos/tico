import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

const mockTrips = [
  { id: '1', date: '13/03 18:30', passenger: 'Carlos L.', driver: 'Pedro R.', origin: 'Parque Principal', destination: 'Real Plaza', price: 8.50, status: 'COMPLETED' },
  { id: '2', date: '13/03 17:15', passenger: 'María G.', driver: 'Roberto D.', origin: 'Hospital', destination: 'Open Plaza', price: 12.00, status: 'COMPLETED' },
  { id: '3', date: '13/03 16:40', passenger: 'Ana P.', driver: 'Pedro R.', origin: 'USAT', destination: 'Centro', price: 7.00, status: 'COMPLETED' },
  { id: '4', date: '13/03 15:20', passenger: 'Luis R.', driver: 'Juan G.', origin: 'Terminal', destination: 'Balta', price: 6.50, status: 'CANCELLED' },
  { id: '5', date: '13/03 14:00', passenger: 'Jorge T.', driver: 'Roberto D.', origin: 'Mercado', destination: 'Santa Victoria', price: 9.00, status: 'COMPLETED' },
]

export default function AdminTrips() {
  return (
    <div className="page">
      <TopBar title="Viajes" />
      <div className="page-content">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Pasajero</th>
                <th>Conductor</th>
                <th>Ruta</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockTrips.map(t => (
                <tr key={t.id}>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--gray-700)' }}>{t.date}</td>
                  <td style={{ color: 'var(--gray-700)' }}>{t.passenger}</td>
                  <td style={{ color: 'var(--gray-700)' }}>{t.driver}</td>
                  <td style={{ fontSize: 13, color: 'var(--gray-600)' }}>{t.origin} → {t.destination}</td>
                  <td style={{ fontWeight: 600, color: 'var(--gray-700)' }}>S/ {t.price.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${t.status === 'COMPLETED' ? 'badge-success' : 'badge-danger'}`}>
                      {t.status === 'COMPLETED' ? 'Completado' : 'Cancelado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <BottomNav role="ADMIN" />
    </div>
  )
}
