import { useState, useEffect } from 'react'
import { authService } from '../services/auth'
import { walletService } from '../services/wallet'
import { Profile } from '../types'
import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [balance, setBalance] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [profileData, balanceData] = await Promise.all([
        authService.getProfile(),
        walletService.getBalance(),
      ])
      setProfile(profileData)
      setBalance(balanceData)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.full_name}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">PV Balance</p>
          <p className="text-2xl font-bold text-indigo-600">{profile?.pv_balance ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Rank</p>
          <p className="text-2xl font-bold text-purple-600">{profile?.current_rank ?? 'Starter'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Wallet</p>
          <p className="text-2xl font-bold text-green-600">₹{balance?.wallet_balance ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <p className="text-2xl font-bold text-blue-600">₹{balance?.total_earnings ?? 0}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Your Referral Code</h2>
        <div className="flex items-center gap-2">
          <code className="bg-gray-100 px-4 py-2 rounded text-lg font-mono">{user?.referral_code}</code>
          <button
            onClick={() => navigator.clipboard.writeText(user?.referral_code || '')}
            className="text-indigo-600 text-sm hover:underline"
          >
            Copy
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Share this code to earn direct referral commissions</p>
      </div>
    </div>
  )
}
