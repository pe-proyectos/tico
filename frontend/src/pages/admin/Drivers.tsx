import { useState } from 'react'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

type Status = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'

const mockDrivers = [
  { id: '1', name: 'Pedro Ruiz', phone: '999333444', plate: 'ABC-123', status: 'APPROVED' as const, plan: 'FREE', rating: 4.7 },
  { id: '2', name: 'Juan García', phone: '999444555', plate: 'DEF-456', status: 'PENDING' as const, plan: 'FREE', rating: 0 },
  { id: '3', name: 'Roberto Díaz', phone: '999555666', plate: 'GHI-789', status: 'APPROVED' as const, plan: 'PRO', rating: 4.9 },
  { id: '4', name: 'Luis Mendoza', phone: '999666777', plate: 'JKL-012', status: 'REJECTED' as const, plan: 'FREE', rating: 0 },
  { id: '5', name: 'Miguel Torres', phone: '999777888', plate: 'MNO-345', status: 'PENDING' as const, plan: 'FREE', rating: 0 },
]

const statusBadge: Record<string, string> = { APPROVED: 'badge-success', PENDING: 'badge-warning', REJECTED: 'badge-danger' }
const statusLabel: Record<string, string> = { APPROVED: 'Aprobado', PENDING: 'Pendiente', REJECTED: 'Rechazado' }

export default function AdminDrivers() {
  const [filter, setFilter] = useState<Status>('ALL')
  const [drivers, setDrivers] = useState(mockDrivers)

  const filtered = filter === 'ALL' ? drivers : drivers.filter(d => d.status === filter)

  const updateStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setDrivers(ds => ds.map(d => d.id === id ? { ...d, status } : d))
  }

  return (
    <div className="page">
      <TopBar title="Conductores" />
      <div className="page-content">
        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto' }}>
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '8px 14px', borderRadius: 'var(--radius-full)',
              background: filter === s ? 'var(--secondary)' : 'var(--white)',
              color: filter === s ? 'white' : 'var(--gray-600)',
              fontWeight: 500, fontSize: 13, border: filter === s ? 'none' : '1px solid var(--gray-200)',
              whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}>
              {s === 'ALL' ? 'Todos' : statusLabel[s]}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Conductor</th>
                <th>Placa</th>
                <th>Plan</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td>
                    <p style={{ fontWeight: 600 }}>{d.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>{d.phone}</p>
                  </td>
                  <td style={{ fontWeight: 600 }}>{d.plate}</td>
                  <td><span className="badge badge-neutral">{d.plan}</span></td>
                  <td><span className={`badge ${statusBadge[d.status]}`}>{statusLabel[d.status]}</span></td>
                  <td>
                    {d.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => updateStatus(d.id, 'APPROVED')} style={{
                          padding: '6px 10px', borderRadius: 6,
                          background: 'var(--success)', color: 'white',
                          fontSize: 12, fontWeight: 600, border: 'none',
                        }}>✓</button>
                        <button onClick={() => updateStatus(d.id, 'REJECTED')} style={{
                          padding: '6px 10px', borderRadius: 6,
                          background: 'var(--danger)', color: 'white',
                          fontSize: 12, fontWeight: 600, border: 'none',
                        }}>✗</button>
                      </div>
                    )}
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
