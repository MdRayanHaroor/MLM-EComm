import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { orderService } from '../services/orders'
import { Order, OrderItem } from '../types'
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'

const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  returned: XCircle,
}

const statusColors: Record<string, string> = {
  pending: 'var(--gray-500)',
  confirmed: 'var(--color-info)',
  processing: 'var(--amber-500)',
  shipped: 'var(--color-info)',
  delivered: 'var(--color-success)',
  cancelled: 'var(--color-danger)',
  returned: 'var(--color-danger)',
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) loadOrder()
  }, [id])

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrder(id!)
      setOrder(data.order)
      setItems(data.items)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>
  if (!order) return <div style={{ padding: '2rem' }}>Order not found</div>

  const StatusIcon = statusIcons[order.status] || Clock

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ gap: '0.375rem', marginBottom: '1.5rem' }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Orders
      </button>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-800)' }}>{order.order_number}</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StatusIcon style={{ width: '18px', height: '18px', color: statusColors[order.status] }} />
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: statusColors[order.status],
            textTransform: 'capitalize',
          }}>
            {order.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Items */}
        <div className="card">
          <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Order Items</h2>
          </div>
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--gray-100)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Package style={{ width: '24px', height: '24px', color: 'var(--gray-400)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--navy-800)' }}>Product #{item.product_id.slice(0, 8)}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Qty: {item.quantity} × ₹{item.unit_price}</p>
                  {item.variant_details && (
                    <p style={{ fontSize: '0.7rem', color: 'var(--amber-600)', marginTop: '0.125rem' }}>
                      {Object.values(item.variant_details).filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>₹{item.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="card">
          <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Payment Summary</h2>
          </div>
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <span>GST</span><span>₹{order.gst_amount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <span>Shipping</span><span>₹{order.shipping_amount.toFixed(2)}</span>
            </div>
            <div style={{ height: '1px', background: 'var(--color-border)', margin: '0.5rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 800, color: 'var(--navy-800)' }}>
              <span>Total Paid</span><span>₹{order.total_amount.toFixed(2)}</span>
            </div>
            <div style={{ marginTop: '0.5rem', padding: '0.625rem', background: order.payment_status === 'paid' ? 'var(--color-success-bg)' : 'var(--amber-100)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, color: order.payment_status === 'paid' ? 'var(--color-success)' : 'var(--amber-700)', textTransform: 'capitalize' }}>
              Payment: {order.payment_status}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
