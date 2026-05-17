import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { productService } from '../services/products'
import { cartService } from '../services/cart'
import { Product } from '../types'
import { useCartStore } from '../store/cartStore'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProduct()
  }, [slug])

  const loadProduct = async () => {
    try {
      const data = await productService.getProduct(slug!)
      setProduct(data)
      if (data.variants?.[0]) {
        setSelectedVariant(data.variants[0].id)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    await cartService.addToCart({
      product_id: product.id,
      variant_id: selectedVariant || undefined,
      quantity,
    })
    useCartStore.getState().setItems(await cartService.getCart())
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-8">Product not found</div>

  const activePrice = selectedVariant
    ? product.variants?.find((v) => v.id === selectedVariant)?.price || product.base_price
    : product.base_price

  const activeMrp = selectedVariant
    ? product.variants?.find((v) => v.id === selectedVariant)?.mrp || product.base_mrp
    : product.base_mrp

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.images?.[0] && (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-indigo-600">₹{activePrice}</span>
            <span className="text-xl text-gray-400 line-through">₹{activeMrp}</span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
              {Math.round(((activeMrp - activePrice) / activeMrp) * 100)}% OFF
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-4">PV: {selectedVariant ? product.variants?.find((v) => v.id === selectedVariant)?.pv : product.base_pv}</p>

          {product.has_variants && product.variants && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Select Variant</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`px-4 py-2 border rounded-lg text-sm ${
                      selectedVariant === variant.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {variant.size && `${variant.size}`}
                    {variant.size && variant.color && ' / '}
                    {variant.color && `${variant.color}`}
                    {!variant.size && !variant.color && variant.sku}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <label className="font-semibold">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-3 py-2 border rounded-lg"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
