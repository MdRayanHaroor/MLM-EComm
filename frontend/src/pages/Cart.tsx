import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cartService } from '../services/cart'
import { CartItem } from '../types'
import { useCartStore } from '../store/cartStore'
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Shield, Truck, Tag } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadCart() }, [])

  const loadCart = async () => {
    try {
      const data = await cartService.getCart()
      setItems(data)
      useCartStore.getState().setItems(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const updateQty = async (id: string, qty: number) => {
    await cartService.updateCartItem(id, qty)
    loadCart()
  }

  const remove = async (id: string) => {
    await cartService.removeFromCart(id)
    loadCart()
  }

  const subtotal = items.reduce((s, item) => s + (item.price || 0) * item.quantity, 0)
  const gstEstimate = subtotal * 0.18
  const shipping = subtotal >= 499 ? 0 : 49
  const total = subtotal + shipping

  if (loading) return (
    <div className="page-container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '8px', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '14px', width: '30%', borderRadius: '4px' }} />
            </div>
            <div className="skeleton" style={{ height: '20px', width: '80px', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '1.5rem 0 3rem' }}>
      <div className="page-container">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-800)', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          Shopping Cart
          {items.length > 0 && (
            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: '0.75rem' }}>
              ({items.length} {items.length === 1 ? 'item' : 'items'})
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={ShoppingCart}
              title="Your cart is empty"
              description="Looks like you haven't added anything yet. Browse our products and find something you love!"
              action={{ label: 'Continue Shopping', to: '/products' }}
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: '1.5rem', alignItems: 'start' }} className="cart-grid">

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {items.map((item) => (
                <div key={item.id} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: 'var(--gray-100)', flexShrink: 0 }}>
                    {item.image
                      ? <img src={item.image} alt={item.product_name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShoppingCart style={{ width: '28px', height: '28px', color: 'var(--gray-300)' }} />
                        </div>
                    }
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.product_name}
                    </h3>
                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-800)', marginBottom: '0.75rem' }}>
                      ₹{item.price?.toLocaleString('en-IN')}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--gray-200)', borderRadius: '7px', overflow: 'hidden' }}>
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                          style={{ padding: '0.375rem 0.625rem', background: 'var(--gray-50)', border: 'none', cursor: 'pointer', opacity: item.quantity <= 1 ? 0.4 : 1 }}>
                          <Minus style={{ width: '13px', height: '13px' }} />
                        </button>
                        <span style={{ padding: '0.375rem 0.875rem', fontSize: '0.875rem', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ padding: '0.375rem 0.625rem', background: 'var(--gray-50)', border: 'none', cursor: 'pointer' }}>
                          <Plus style={{ width: '13px', height: '13px' }} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-800)' }}>
                          ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px', opacity: 0.7, transition: 'opacity var(--transition-fast)' }}
                          onMouseOver={e => (e.currentTarget.style.opacity = '1')}
                          onMouseOut={e => (e.currentTarget.style.opacity = '0.7')}>
                          <Trash2 style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="card" style={{ position: 'sticky', top: '80px' }}>
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy-800)' }}>Order Summary</h2>
              </div>
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal ({items.length} items)</span>
                  <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>GST (est. 18%)</span>
                  <span style={{ fontWeight: 600 }}>₹{gstEstimate.toFixed(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Shipping</span>
                  <span style={{ fontWeight: 600, color: shipping === 0 ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'var(--amber-100)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                    <Tag style={{ width: '12px', height: '12px', color: 'var(--amber-600)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--amber-700)', fontWeight: 500 }}>
                      Add ₹{(499 - subtotal).toFixed(0)} more for free shipping!
                    </span>
                  </div>
                )}

                <div style={{ height: '1px', background: 'var(--color-border)', margin: '0.25rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--navy-800)' }}>₹{total.toLocaleString('en-IN')}</span>
                </div>

                <Link to="/dashboard/checkout" className="btn btn-primary btn-full" style={{ marginTop: '0.5rem', fontSize: '0.95rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.75rem' }}>
                  Proceed to Checkout <ArrowRight style={{ width: '17px', height: '17px' }} />
                </Link>
                <Link to="/products" style={{ display: 'block', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'none', marginTop: '0.25rem' }}>
                  ← Continue Shopping
                </Link>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '0.875rem', borderTop: '1px solid var(--color-border)' }}>
                  {[{ icon: Shield, text: 'Secure payment' }, { icon: Truck, text: 'Free delivery above ₹499' }].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <item.icon style={{ width: '13px', height: '13px', color: 'var(--color-success)' }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
