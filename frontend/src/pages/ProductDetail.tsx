import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productService } from '../services/products'
import { cartService } from '../services/cart'
import { Product } from '../types'
import { useCartStore } from '../store/cartStore'
import { ShoppingCart, Star, Shield, Truck, RotateCcw, Package, Minus, Plus, CheckCircle, ChevronRight, Zap } from 'lucide-react'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => { loadProduct() }, [slug])

  const loadProduct = async () => {
    try {
      const data = await productService.getProductBySlug(slug!)
      setProduct(data)
      if (data.variants?.[0]) setSelectedVariant(data.variants[0].id)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleAddToCart = async () => {
    if (!product) return
    await cartService.addToCart({ product_id: product.id, variant_id: selectedVariant || undefined, quantity })
    useCartStore.getState().setItems(await cartService.getCart())
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  if (loading) return (
    <div className="page-container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[80, 60, 50, 70, 40].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: i === 0 ? '32px' : '16px', width: `${w}%`, borderRadius: '6px' }} />
          ))}
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="page-container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <Package style={{ width: '64px', height: '64px', color: 'var(--gray-300)', margin: '0 auto 1rem' }} />
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Product not found</h2>
      <Link to="/products" className="btn btn-primary">Browse Products</Link>
    </div>
  )

  const activeVariant = product.variants?.find(v => v.id === selectedVariant)
  const activePrice = activeVariant?.price ?? product.base_price
  const activeMrp = activeVariant?.mrp ?? product.base_mrp
  const activePv = activeVariant?.pv ?? product.base_pv
  const discount = activeMrp > activePrice ? Math.round(((activeMrp - activePrice) / activeMrp) * 100) : 0

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '1.5rem 0 3rem' }}>
      <div className="page-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight style={{ width: '13px', height: '13px' }} />
          <Link to="/products" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Products</Link>
          <ChevronRight style={{ width: '13px', height: '13px' }} />
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Image */}
          <div className="card" style={{ overflow: 'hidden', aspectRatio: '1', position: 'relative' }}>
            {product.images?.[0]
              ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
                  <Package style={{ width: '80px', height: '80px', color: 'var(--gray-300)' }} />
                </div>
            }
            {discount > 0 && (
              <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--color-danger)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: '6px' }}>
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Details */}
          <div className="card">
            <div style={{ padding: '1.5rem' }}>
              <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--navy-800)', lineHeight: 1.3, marginBottom: '0.75rem' }}>{product.name}</h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {[1,2,3,4,5].map(s => <Star key={s} style={{ width: '14px', height: '14px', color: '#f59e0b', fill: s <= 4 ? '#f59e0b' : 'none' }} />)}
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>4.2 (128 reviews)</span>
              </div>

              <div style={{ height: '1px', background: 'var(--color-border)', margin: '1rem 0' }} />

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--navy-800)', letterSpacing: '-0.03em' }}>₹{activePrice?.toLocaleString('en-IN')}</span>
                  {activeMrp > activePrice && <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>MRP ₹{activeMrp?.toLocaleString('en-IN')}</span>}
                  {discount > 0 && <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-success)' }}>{discount}% off</span>}
                </div>
                {activePv > 0 && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.625rem', padding: '0.3rem 0.75rem', background: 'var(--amber-100)', borderRadius: '999px' }}>
                    <Zap style={{ width: '13px', height: '13px', color: 'var(--amber-600)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber-600)' }}>Earn {activePv} PV</span>
                  </div>
                )}
              </div>

              {product.has_variants && product.variants && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Select Variant</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {product.variants.map(v => (
                      <button key={v.id} onClick={() => setSelectedVariant(v.id)} style={{
                        padding: '0.375rem 0.875rem', borderRadius: '6px',
                        border: `2px solid ${selectedVariant === v.id ? 'var(--amber-500)' : 'var(--gray-200)'}`,
                        background: selectedVariant === v.id ? 'var(--amber-100)' : '#fff',
                        color: selectedVariant === v.id ? 'var(--amber-700)' : 'var(--color-text-secondary)',
                        fontSize: '0.8125rem', fontWeight: selectedVariant === v.id ? 700 : 500,
                        cursor: 'pointer', transition: 'all var(--transition-fast)',
                      }}>
                        {[v.size, v.color].filter(Boolean).join(' / ') || v.sku}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quantity</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--gray-200)', borderRadius: '8px', overflow: 'hidden' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} style={{ padding: '0.5rem 0.875rem', background: 'var(--gray-50)', border: 'none', cursor: 'pointer' }}>
                    <Minus style={{ width: '14px', height: '14px' }} />
                  </button>
                  <span style={{ padding: '0.5rem 1.25rem', fontWeight: 700, fontSize: '0.9rem', minWidth: '50px', textAlign: 'center' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} style={{ padding: '0.5rem 0.875rem', background: 'var(--gray-50)', border: 'none', cursor: 'pointer' }}>
                    <Plus style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              </div>

              <button onClick={handleAddToCart} className="btn btn-full btn-xl"
                style={added ? { background: 'var(--color-success)', color: '#fff', width: '100%', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }
                  : { background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))', color: '#1a1a1a', width: '100%', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', padding: '0.875rem 1.75rem', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer' }}>
                {added ? <><CheckCircle style={{ width: '20px', height: '20px' }} /> Added!</> : <><ShoppingCart style={{ width: '20px', height: '20px' }} /> Add to Cart</>}
              </button>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                {[{ icon: Truck, text: 'Free delivery ₹499+' }, { icon: RotateCcw, text: '10-day returns' }, { icon: Shield, text: 'Secure payment' }].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: '1 0 120px' }}>
                    <item.icon style={{ width: '13px', height: '13px', color: 'var(--color-success)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {product.description && (
              <div style={{ padding: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
                <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.625rem', color: 'var(--navy-800)' }}>Description</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
