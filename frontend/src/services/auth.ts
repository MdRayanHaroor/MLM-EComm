import api from '../lib/api'
import { User, Profile } from '../types'

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    return data
  },

  register: async (payload: {
    email: string
    password: string
    full_name: string
    phone: string
    referral_code?: string
  }) => {
    const { data } = await api.post('/auth/register', payload)
    return data
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get('/auth/me')
    return data
  },

  getProfile: async (): Promise<Profile> => {
    const { data } = await api.get('/auth/profile')
    return data
  },

  updateProfile: async (payload: { full_name?: string; phone?: string }) => {
    const { data } = await api.put('/auth/profile', payload)
    return data
  },

  logout: async () => {
    await api.post('/auth/logout')
  },
}
