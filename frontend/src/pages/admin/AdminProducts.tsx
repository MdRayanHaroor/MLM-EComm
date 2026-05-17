import { useState, useEffect } from 'react'
import { productService } from '../../services/products'
import { Product, Category } from '../../types'
import { Search, Package, Tag } from 'lucide-react'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import EmptyState from '../../components/ui/EmptyState'
import PageHeader from '../../components/ui/PageHeader'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [p, c] = await Promise.all([productService.getProducts(), productService.getCategories()])
      setProducts(p.products || [])
      setCategories(c)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="animate-fade-in">
      <PageHeader title="Products" subtitle={`${products.length} products in catalog`} />

      {/* Search bar */}
      <div style={{ marginBottom: '1.25rem', position: 'relative', maxWidth: '400px' }}>
        <Search style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="form-input" style={{ paddingLeft: '2.5rem' }} />
      </div>

      <div className="table-wrapper">
        {loading ? (
          <table className="data-table"><tbody><SkeletonLoader type="table-row" count={6} /></tbody></table>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Package} title="No products found" description="No products match your search." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>MRP</th>
                <th>PV</th>
                <th>Variants</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => {
                const category = categories.find(c => c.id === product.category_id)
                const disc = product.base_mrp > product.base_price
                  ? Math.round(((product.base_mrp - product.base_price) / product.base_mrp) * 100) : 0
                return (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: 'var(--gray-100)', flexShrink: 0 }}>
                          {product.images?.[0]
                            ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package style={{ width: '18px', height: '18px', color: 'var(--gray-300)' }} /></div>
                          }
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
                      </div>
                    </td>
                    <td>
                      {category ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#2563eb', background: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>
                          <Tag style={{ width: '10px', height: '10px' }} />{category.name}
                        </span>
                      ) : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>N/A</span>}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--navy-800)' }}>₹{product.base_price?.toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--color-text-muted)', textDecoration: 'line-through', fontSize: '0.8rem' }}>₹{product.base_mrp?.toLocaleString('en-IN')}</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber-600)', background: 'var(--amber-100)', padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                        {product.base_pv} PV
                      </span>
                    </td>
                    <td>
                      {product.has_variants
                        ? <span className="badge badge-info">{product.variants?.length ?? 0} variants</span>
                        : <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Simple</span>
                      }
                    </td>
                    <td>
                      <span className={`badge ${product.is_active !== false ? 'badge-success' : 'badge-neutral'}`}>
                        {product.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
