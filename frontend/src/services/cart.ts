import api from '../lib/api'
import { CartItem } from '../types'

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    const { data } = await api.get('/cart/')
    return data
  },

  addToCart: async (payload: { product_id: string; variant_id?: string; quantity: number }) => {
    const { data } = await api.post('/cart/items', payload)
    return data
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    const { data } = await api.put(`/cart/items/${itemId}`, { quantity })
    return data
  },

  removeFromCart: async (itemId: string) => {
    const { data } = await api.delete(`/cart/items/${itemId}`)
    return data
  },

  clearCart: async () => {
    const { data } = await api.delete('/cart/')
    return data
  },
}
