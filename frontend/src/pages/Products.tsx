import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { productService } from '../services/products'
import { Product, Category } from '../types'
import { Search, SlidersHorizontal, Star, ShoppingCart, X } from 'lucide-react'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ])
      setProducts(productsRes.products || [])
      setCategories(categoriesRes)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // React to URL category changes
  useEffect(() => {
    const catParam = searchParams.get('category')
    const q = searchParams.get('search')
    if (q) setSearch(q)
    if (catParam && categories.length > 0) {
      const matched = categories.find(
        (c) => c.name.toLowerCase() === catParam.toLowerCase() || c.name.toLowerCase().includes(catParam.toLowerCase())
      )
      if (matched) setSelectedCategory(matched.id)
      else setSelectedCategory('')
    } else if (!catParam) {
      setSelectedCategory('')
    }
  }, [searchParams, categories])

  const filteredProducts = products
    .filter((p) => {
      if (selectedCategory && p.category_id !== selectedCategory) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.base_price || 0) - (b.base_price || 0)
      if (sortBy === 'price-desc') return (b.base_price || 0) - (a.base_price || 0)
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  const discountPct = (mrp: number, price: number) =>
    mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setSortBy('default')
  }

  const hasFilters = search || selectedCategory || sortBy !== 'default'

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* ── HEADER BAR ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--color-border)', padding: '1rem 0' }}>
        <div className="page-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Search style={{
                position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                width: '16px', height: '16px', color: 'var(--gray-400)', pointerEvents: 'none',
              }} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '160px' }}
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
            </select>

            {/* Mobile filter toggle */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setFiltersOpen(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <SlidersHorizontal style={{ width: '15px', height: '15px' }} />
              Filters
            </button>

            {hasFilters && (
              <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ gap: '0.25rem', color: 'var(--color-danger)' }}>
                <X style={{ width: '14px', height: '14px' }} /> Clear
              </button>
            )}
          </div>

          {/* Results count */}
          {!loading && (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.625rem' }}>
              Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
              {selectedCategory && ` in "${categories.find(c => c.id === selectedCategory)?.name ?? selectedCategory}"`}
            </p>
          )}
        </div>
      </div>

      <div className="page-container" style={{ padding: '1.5rem 1rem 3rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

          {/* ── SIDEBAR FILTERS ── */}
          <aside style={{
            width: '220px',
            flexShrink: 0,
            display: filtersOpen ? 'block' : undefined,
          }} className="filter-sidebar">
            <div className="card" style={{ position: 'sticky', top: '80px' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-800)' }}>Categories</h3>
              </div>
              <div style={{ padding: '0.75rem' }}>
                <button
                  onClick={() => setSelectedCategory('')}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '0.5rem 0.75rem', borderRadius: '6px',
                    background: !selectedCategory ? 'var(--amber-100)' : 'transparent',
                    color: !selectedCategory ? 'var(--amber-600)' : 'var(--color-text-secondary)',
                    border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: !selectedCategory ? 600 : 400,
                    transition: 'background var(--transition-fast)',
                    marginBottom: '0.125rem',
                  }}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '0.5rem 0.75rem', borderRadius: '6px',
                      background: selectedCategory === cat.id ? 'var(--amber-100)' : 'transparent',
                      color: selectedCategory === cat.id ? 'var(--amber-600)' : 'var(--color-text-secondary)',
                      border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: selectedCategory === cat.id ? 600 : 400,
                      transition: 'background var(--transition-fast)',
                      marginBottom: '0.125rem',
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── PRODUCT GRID ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <SkeletonLoader type="product-card" count={8} />
            ) : filteredProducts.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon={Search}
                  title="No products found"
                  description="Try adjusting your search or filter to find what you're looking for."
                  action={{ label: 'Clear Filters', onClick: clearFilters }}
                />
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: '1.25rem',
              }}>
                {filteredProducts.map((product) => {
                  const disc = discountPct(product.base_mrp, product.base_price)
                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      className="card card-hover"
                      style={{ textDecoration: 'none', display: 'block', overflow: 'hidden' }}
                    >
                      {/* Image */}
                      <div className="product-img-wrap" style={{ aspectRatio: '1', background: 'var(--gray-50)', position: 'relative' }}>
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingCart style={{ width: '40px', height: '40px', color: 'var(--gray-300)' }} />
                          </div>
                        )}
                        {disc > 0 && (
                          <span style={{
                            position: 'absolute', top: '8px', left: '8px',
                            background: 'var(--color-danger)',
                            color: '#fff',
                            fontSize: '0.65rem', fontWeight: 700,
                            padding: '0.2rem 0.45rem',
                            borderRadius: '4px',
                          }}>
                            -{disc}%
                          </span>
                        )}
                        {product.base_pv > 0 && (
                          <span className="badge badge-amber" style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '0.65rem' }}>
                            {product.base_pv} PV
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: '0.875rem' }}>
                        <h3 style={{
                          fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)',
                          marginBottom: '0.25rem',
                          overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          lineHeight: 1.4,
                        }}>
                          {product.name}
                        </h3>

                        {/* Stars placeholder */}
                        <div style={{ display: 'flex', gap: '1px', marginBottom: '0.5rem' }}>
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} style={{ width: '11px', height: '11px', color: '#f59e0b', fill: s <= 4 ? '#f59e0b' : 'none' }} />
                          ))}
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: '0.25rem' }}>(4.2)</span>
                        </div>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--navy-800)' }}>
                            ₹{product.base_price?.toLocaleString('en-IN')}
                          </span>
                          {product.base_mrp > product.base_price && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                              ₹{product.base_mrp?.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .filter-sidebar { display: none; width: 100% !important; }
          .filter-sidebar.open { display: block !important; }
        }
        @media (min-width: 769px) {
          .filter-sidebar { display: block !important; }
        }
      `}</style>
    </div>
  )
}
