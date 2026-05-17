import api from '../lib/api'
import { Product, Category, ProductVariant } from '../types'

export const productService = {
  getProducts: async (params?: {
    category_id?: string
    search?: string
    min_price?: number
    max_price?: number
    page?: number
    limit?: number
  }) => {
    const { data } = await api.get('/products/', { params })
    return data
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const { data } = await api.get(`/products/slug/${slug}`)
    return data
  },

  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories/')
    return data
  },

  getVariants: async (productId: string): Promise<ProductVariant[]> => {
    const { data } = await api.get(`/products/${productId}/variants`)
    return data
  },
}
