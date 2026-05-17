import api from '../lib/api'
import { Order, OrderItem, Address } from '../types'

export const orderService = {
  createOrder: async (payload: { shipping_address_id: string; items: { product_id: string; variant_id?: string; quantity: number }[] }) => {
    const { data } = await api.post('/orders/', payload)
    return data
  },

  getOrders: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders/')
    return data
  },

  getOrder: async (id: string): Promise<{ order: Order; items: OrderItem[] }> => {
    const { data } = await api.get(`/orders/${id}`)
    return data
  },

  cancelOrder: async (id: string) => {
    const { data } = await api.post(`/orders/${id}/cancel`)
    return data
  },

  getAddresses: async (): Promise<Address[]> => {
    const { data } = await api.get('/orders/addresses')
    return data
  },

  createAddress: async (payload: Omit<Address, 'id'>) => {
    const { data } = await api.post('/orders/addresses', payload)
    return data
  },

  updateAddress: async (id: string, payload: Partial<Address>) => {
    const { data } = await api.put(`/orders/addresses/${id}`, payload)
    return data
  },

  deleteAddress: async (id: string) => {
    const { data } = await api.delete(`/orders/addresses/${id}`)
    return data
  },
}
