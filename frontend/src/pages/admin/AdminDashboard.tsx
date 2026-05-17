import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin'

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await adminService.getDashboard()
      setStats(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{stats?.total_users ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Active Distributors</p>
          <p className="text-2xl font-bold text-green-600">{stats?.active_distributors ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{stats?.total_orders ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-indigo-600">₹{stats?.total_revenue ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Pending Withdrawals</p>
          <p className="text-2xl font-bold text-orange-600">₹{stats?.pending_withdrawals ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Commissions Paid</p>
          <p className="text-2xl font-bold text-purple-600">₹{stats?.total_commissions_paid ?? 0}</p>
        </div>
      </div>
    </div>
  )
}
