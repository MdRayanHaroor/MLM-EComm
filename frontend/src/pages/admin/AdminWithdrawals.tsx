import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin'
import { Withdrawal } from '../../types'

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWithdrawals()
  }, [])

  const loadWithdrawals = async () => {
    try {
      const data = await adminService.getWithdrawals()
      setWithdrawals(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const approve = async (id: string) => {
    await adminService.approveWithdrawal(id)
    loadWithdrawals()
  }

  const reject = async (id: string) => {
    await adminService.rejectWithdrawal(id)
    loadWithdrawals()
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Withdrawals</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium">User</th>
              <th className="text-left p-4 text-sm font-medium">Amount</th>
              <th className="text-left p-4 text-sm font-medium">Method</th>
              <th className="text-left p-4 text-sm font-medium">Status</th>
              <th className="text-left p-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w.id} className="border-t">
                <td className="p-4">{w.user_id.slice(0, 8)}...</td>
                <td className="p-4 font-bold">₹{w.amount}</td>
                <td className="p-4 capitalize">{w.method.replace('_', ' ')}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded ${
                    w.status === 'completed' ? 'bg-green-100 text-green-700' :
                    w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {w.status}
                  </span>
                </td>
                <td className="p-4">
                  {w.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => approve(w.id)} className="text-green-600 text-sm hover:underline">Approve</button>
                      <button onClick={() => reject(w.id)} className="text-red-600 text-sm hover:underline">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
