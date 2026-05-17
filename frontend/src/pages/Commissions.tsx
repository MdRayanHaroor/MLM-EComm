import { useState, useEffect } from 'react'
import { commissionService } from '../services/wallet'
import { Commission } from '../types'

export default function Commissions() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCommissions()
  }, [])

  const loadCommissions = async () => {
    try {
      const data = await commissionService.getCommissions()
      setCommissions(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  const total = commissions.reduce((sum, c) => sum + c.amount, 0)
  const credited = commissions.filter((c) => c.status === 'credited').reduce((sum, c) => sum + c.amount, 0)
  const pending = commissions.filter((c) => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Commissions</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold">₹{total.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Credited</p>
          <p className="text-xl font-bold text-green-600">₹{credited.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-xl font-bold text-yellow-600">₹{pending.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {commissions.map((comm) => (
          <div key={comm.id} className="flex justify-between items-center p-4 border-b last:border-0">
            <div>
              <p className="font-medium capitalize">{comm.type.replace('_', ' ')}</p>
              <p className="text-sm text-gray-500">{new Date(comm.created_at).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">₹{comm.amount.toFixed(2)}</p>
              <span className={`text-xs px-2 py-1 rounded ${
                comm.status === 'credited' ? 'bg-green-100 text-green-700' :
                comm.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {comm.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
