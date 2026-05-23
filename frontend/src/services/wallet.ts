import api from '../lib/api'
import { WalletTransaction, Withdrawal, Commission, MatrixNode } from '../types'

export const walletService = {
  getBalance: async () => {
    const { data } = await api.get('/wallet/balance')
    return data
  },

  getTransactions: async (): Promise<WalletTransaction[]> => {
    const { data } = await api.get('/wallet/transactions')
    return data
  },

  requestWithdrawal: async (payload: {
    amount: number
    method: 'bank_transfer' | 'upi'
    bank_name?: string
    account_number?: string
    ifsc_code?: string
    upi_id?: string
  }) => {
    const { data } = await api.post('/wallet/withdraw', payload)
    return data
  },

  getWithdrawals: async (): Promise<Withdrawal[]> => {
    const { data } = await api.get('/wallet/withdrawals')
    return data
  },
}

export const commissionService = {
  getCommissions: async (): Promise<Commission[]> => {
    const { data } = await api.get('/commissions/')
    return data
  },
}

export const userService = {
  getReferrals: async () => {
    const { data } = await api.get('/users/referrals')
    return data
  },

  getDownline: async (): Promise<MatrixNode[]> => {
    const { data } = await api.get('/users/downline')
    return data
  },

  getUpline: async () => {
    const { data } = await api.get('/users/upline')
    return data
  },

  getMatrix: async () => {
    const { data } = await api.get('/users/matrix')
    return data
  },

  getReferrer: async (): Promise<{ id: string; full_name: string; referral_code: string } | null> => {
    const { data } = await api.get('/users/referrer')
    return data
  },
}
