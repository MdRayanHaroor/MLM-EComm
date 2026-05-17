import { useState, useEffect } from 'react'
import { productService } from '../../services/products'
import { Product, Category } from '../../types'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
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

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium">Name</th>
              <th className="text-left p-4 text-sm font-medium">Category</th>
              <th className="text-left p-4 text-sm font-medium">Price</th>
              <th className="text-left p-4 text-sm font-medium">MRP</th>
              <th className="text-left p-4 text-sm font-medium">PV</th>
              <th className="text-left p-4 text-sm font-medium">Variants</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const category = categories.find((c) => c.id === product.category_id)
              return (
                <tr key={product.id} className="border-t">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-sm">{category?.name || 'N/A'}</td>
                  <td className="p-4">₹{product.base_price}</td>
                  <td className="p-4 text-gray-500">₹{product.base_mrp}</td>
                  <td className="p-4">{product.base_pv}</td>
                  <td className="p-4">
                    {product.has_variants ? (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {product.variants?.length || 0} variants
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">No variants</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
