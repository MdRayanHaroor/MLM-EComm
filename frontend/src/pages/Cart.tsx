import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cartService } from '../services/cart'
import { CartItem } from '../types'
import { useCartStore } from '../store/cartStore'
import { Minus, Plus, Trash2 } from 'lucide-react'

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const data = await cartService.getCart()
      setItems(data)
      useCartStore.getState().setItems(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const updateQty = async (id: string, qty: number) => {
    await cartService.updateCartItem(id, qty)
    loadCart()
  }

  const remove = async (id: string) => {
    await cartService.removeFromCart(id)
    loadCart()
  }

  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/products" className="text-indigo-600 hover:underline">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded">
              {item.image && <img src={item.image || ''} alt={item.product_name || ''} className="w-full h-full object-cover rounded" />}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{item.product_name}</h3>
              <p className="text-indigo-600 font-bold">₹{item.price}</p>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-1 border rounded" disabled={item.quantity <= 1}>
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-1 border rounded">
                  <Plus className="w-4 h-4" />
                </button>
                <button onClick={() => remove(item.id)} className="ml-auto text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <Link
          to="/dashboard/orders"
          className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg font-semibold mt-4 hover:bg-indigo-700"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
