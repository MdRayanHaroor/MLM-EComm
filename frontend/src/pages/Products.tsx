import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/products'
import { Product, Category } from '../types'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

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

  const filteredProducts = products.filter((p) => {
    if (selectedCategory && p.category_id !== selectedCategory) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Link key={product.id} to={`/products/${product.slug}`} className="bg-white rounded-lg shadow hover:shadow-lg transition">
            <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
              {product.images?.[0] && (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate">{product.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-indigo-600">₹{product.base_price}</span>
                <span className="text-sm text-gray-400 line-through">₹{product.base_mrp}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">PV: {product.base_pv}</p>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 py-8">No products found</p>
      )}
    </div>
  )
}
