import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin'
import { Order } from '../../types'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import PageHeader from '../../components/ui/PageHeader'
import { ShoppingCart } from 'lucide-react'

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { loadOrders() }, [])

  const loadOrders = async () => {
    try { setOrders(await adminService.getOrders()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const updateStatus = async (orderId: string, status: string) => {
    await adminService.updateOrderStatus(orderId, status)
    loadOrders()
  }

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus)

  return (
    <div className="animate-fade-in">
      <PageHeader title="Orders" subtitle={`${orders.length} total orders`} />

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {['all', ...statusOptions].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{
            padding: '0.4rem 0.875rem', borderRadius: '999px', border: 'none',
            background: filterStatus === s ? 'var(--navy-800)' : 'var(--gray-100)',
            color: filterStatus === s ? '#fff' : 'var(--color-text-secondary)',
            fontSize: '0.8125rem', fontWeight: filterStatus === s ? 700 : 500,
            cursor: 'pointer', flexShrink: 0, transition: 'all var(--transition-fast)',
            textTransform: 'capitalize',
          }}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        {loading ? (
          <table className="data-table"><tbody><SkeletonLoader type="table-row" count={7} /></tbody></table>
        ) : filtered.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="No orders found" />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--navy-800)' }}>
                      #{order.order_number}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--navy-800)' }}>₹{order.total_amount?.toLocaleString('en-IN')}</td>
                  <td><StatusBadge status={order.payment_status} /></td>
                  <td><StatusBadge status={order.status} /></td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className="form-select"
                      style={{ width: 'auto', minWidth: '130px', fontSize: '0.8rem', padding: '0.35rem 2rem 0.35rem 0.625rem' }}
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
