import api from '../lib/api'
import { CommissionSettings, RankSettings, User, Order, Withdrawal } from '../types'

export const adminService = {
  getDashboard: async () => {
    const { data } = await api.get('/admin/dashboard')
    return data
  },

  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/admin/users')
    return data
  },

  updateUser: async (userId: string, payload: { role?: string; status?: string }) => {
    const { data } = await api.put(`/admin/users/${userId}`, payload)
    return data
  },

  getCommissionSettings: async (): Promise<CommissionSettings> => {
    const { data } = await api.get('/admin/settings/commissions')
    return data
  },

  updateCommissionSettings: async (payload: CommissionSettings) => {
    const { data } = await api.put('/admin/settings/commissions', payload)
    return data
  },

  getRankSettings: async (): Promise<RankSettings[]> => {
    const { data } = await api.get('/admin/settings/ranks')
    return data
  },

  createRank: async (payload: { rank_name: string; required_pv: number; required_direct_referrals: number; commission_multiplier: number }) => {
    const { data } = await api.post('/admin/settings/ranks', payload)
    return data
  },

  updateRank: async (rankId: string, payload: Partial<RankSettings>) => {
    const { data } = await api.put(`/admin/settings/ranks/${rankId}`, payload)
    return data
  },

  getOrders: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders/admin')
    return data
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const { data } = await api.put(`/orders/${orderId}/status`, { status })
    return data
  },

  getWithdrawals: async (): Promise<Withdrawal[]> => {
    const { data } = await api.get('/wallet/withdrawals/admin')
    return data
  },

  approveWithdrawal: async (withdrawalId: string) => {
    const { data } = await api.put(`/wallet/withdrawals/${withdrawalId}/approve`)
    return data
  },

  rejectWithdrawal: async (withdrawalId: string, notes?: string) => {
    const { data } = await api.put(`/wallet/withdrawals/${withdrawalId}/reject`, { notes })
    return data
  },

  getSalesReport: async () => {
    const { data } = await api.get('/admin/reports/sales')
    return data
  },

  getCommissionReport: async () => {
    const { data } = await api.get('/admin/reports/commissions')
    return data
  },
}
