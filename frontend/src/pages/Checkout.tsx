import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderService } from '../services/orders'
import { cartService } from '../services/cart'
import { Address, CartItem } from '../types'
import { ArrowLeft, MapPin, CreditCard, CheckCircle } from 'lucide-react'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function Checkout() {
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'review' | 'payment' | 'success'>('review')
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [addrData, cartData] = await Promise.all([
        orderService.getAddresses(),
        cartService.getCart(),
      ])
      setAddresses(addrData)
      setCartItems(cartData)
      if (addrData.length > 0 && !selectedAddress) {
        const def = addrData.find((a: Address) => a.is_default)
        setSelectedAddress(def?.id || addrData[0].id)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const subtotal = cartItems.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)
  const gst = Math.round(subtotal * 0.18 * 100) / 100
  const shipping = 50
  const total = subtotal + gst + shipping

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return
    setLoading(true)
    try {
      const order = await orderService.createOrder({
        shipping_address_id: selectedAddress,
        items: cartItems.map((i) => ({
          product_id: i.product_id,
          variant_id: i.variant_id || undefined,
          quantity: i.quantity,
        })),
      })

      setOrderId(order.order_id)

      const rzpData = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ order_id: order.order_id, amount: order.total_amount }),
      }).then((r) => r.json())

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(order.total_amount * 100),
        currency: 'INR',
        name: 'MLM Store',
        description: `Order ${order.order_number}`,
        order_id: rzpData.razorpay_order_id,
        handler: async (response: any) => {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/payments/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
          setStep('success')
        },
        prefill: {
          name: addresses.find((a) => a.id === selectedAddress)?.full_name,
          contact: addresses.find((a) => a.id === selectedAddress)?.phone,
        },
        theme: { color: '#f59e0b' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <CheckCircle style={{ width: '64px', height: '64px', color: 'var(--color-success)', margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-800)', marginBottom: '0.5rem' }}>Order Placed Successfully!</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Your order has been confirmed and will be shipped soon.</p>
        <button onClick={() => navigate('/dashboard/orders')} className="btn btn-primary">View Orders</button>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="animate-fade-in">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ gap: '0.375rem', marginBottom: '1rem' }}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Cart
        </button>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ gap: '0.375rem', marginBottom: '1.5rem' }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Cart
      </button>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-800)', marginBottom: '1.5rem' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left - Address */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin style={{ width: '18px', height: '18px', color: 'var(--amber-500)' }} /> Delivery Address
          </h2>

          {addresses.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>No addresses saved</p>
              <button onClick={() => navigate('/dashboard/addresses')} className="btn btn-primary btn-sm">Add Address</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    border: selectedAddress === addr.id ? '2px solid var(--amber-500)' : '1px solid var(--color-border)',
                    background: selectedAddress === addr.id ? 'var(--amber-50)' : '#fff',
                  }}
                >
                  <div style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{addr.full_name}</p>
                      {addr.is_default && <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Default</span>}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                      {addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}
                      <br />{addr.city}, {addr.state} – {addr.pincode}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{addr.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right - Order Summary */}
        <div className="card" style={{ position: 'sticky', top: '80px' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Order Summary</h2>
          </div>
          <div style={{ padding: '1.25rem' }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{item.product_name} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>₹{((item.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <span>GST (18%)</span><span>₹{gst.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <span>Shipping</span><span>₹{shipping.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 800, color: 'var(--navy-800)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <span>Total</span><span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: '1.25rem', gap: '0.5rem' }}
            >
              <CreditCard style={{ width: '18px', height: '18px' }} />
              {loading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
