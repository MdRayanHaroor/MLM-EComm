import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '../services/orders'
import { Order } from '../types'
import { ShoppingCart, ChevronRight, Package } from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import PageHeader from '../components/ui/PageHeader'

const tabs = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => { loadOrders() }, [])

  const loadOrders = async () => {
    try { setOrders(await orderService.getOrders()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const filtered = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab.toLowerCase())

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Orders" subtitle="View and track all your orders" />

      {/* Tab filter */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '0.4rem 0.875rem', borderRadius: '999px', border: 'none',
            background: activeTab === tab ? 'var(--navy-800)' : 'var(--gray-100)',
            color: activeTab === tab ? '#fff' : 'var(--color-text-secondary)',
            fontSize: '0.8125rem', fontWeight: activeTab === tab ? 700 : 500,
            cursor: 'pointer', flexShrink: 0, transition: 'all var(--transition-fast)',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="table-wrapper">
          <table className="data-table">
            <tbody><SkeletonLoader type="table-row" count={5} /></tbody>
          </table>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={Package} title={activeTab === 'All' ? 'No orders yet' : `No ${activeTab.toLowerCase()} orders`}
            description="When you place an order it will appear here."
            action={{ label: 'Shop Now', to: '/products' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {filtered.map(order => (
            <div key={order.id} className="card" style={{ padding: '1.125rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ width: '44px', height: '44px', background: 'var(--gray-100)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShoppingCart style={{ width: '20px', height: '20px', color: 'var(--gray-400)' }} />
              </div>
              <div style={{ flex: 1, minWidth: '160px' }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-800)', marginBottom: '0.2rem' }}>#{order.order_number}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <StatusBadge status={order.status} />
              <StatusBadge status={order.payment_status} />
              <p style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--navy-800)', minWidth: '80px', textAlign: 'right' }}>
                ₹{order.total_amount?.toLocaleString('en-IN')}
              </p>
              <Link to={`/dashboard/orders/${order.id}`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', flexShrink: 0 }}>
                <ChevronRight style={{ width: '18px', height: '18px' }} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
