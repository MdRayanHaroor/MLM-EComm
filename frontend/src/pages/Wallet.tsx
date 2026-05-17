import { useState, useEffect } from 'react'
import { walletService } from '../services/wallet'
import { WalletTransaction, Withdrawal } from '../types'

export default function Wallet() {
  const [balance, setBalance] = useState<Record<string, number> | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [showWithdrawForm, setShowWithdrawForm] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState<'bank_transfer' | 'upi'>('upi')
  const [upiId, setUpiId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [balanceData, txns, withdraws] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions(),
        walletService.getWithdrawals(),
      ])
      setBalance(balanceData)
      setTransactions(txns)
      setWithdrawals(withdraws)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await walletService.requestWithdrawal({
        amount: parseFloat(withdrawAmount),
        method: withdrawMethod,
        upi_id: withdrawMethod === 'upi' ? upiId : undefined,
      })
      setShowWithdrawForm(false)
      setWithdrawAmount('')
      loadData()
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-80">Available Balance</p>
          <p className="text-3xl font-bold">₹{balance?.wallet_balance ?? 0}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-80">Total Earnings</p>
          <p className="text-3xl font-bold">₹{balance?.total_earnings ?? 0}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-80">Pending Withdrawals</p>
          <p className="text-3xl font-bold">₹{balance?.pending_withdrawals ?? 0}</p>
        </div>
      </div>

      <button
        onClick={() => setShowWithdrawForm(!showWithdrawForm)}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg mb-6 hover:bg-indigo-700"
      >
        {showWithdrawForm ? 'Cancel' : 'Withdraw Funds'}
      </button>

      {showWithdrawForm && (
        <form onSubmit={handleWithdraw} className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Method</label>
            <select
              value={withdrawMethod}
              onChange={(e) => setWithdrawMethod(e.target.value as 'bank_transfer' | 'upi')}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
          {withdrawMethod === 'upi' && (
            <div>
              <label className="block text-sm font-medium mb-1">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="yourname@upi"
                required
              />
            </div>
          )}
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Submit Withdrawal Request
          </button>
        </form>
      )}

      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {transactions.map((txn) => (
          <div key={txn.id} className="flex justify-between items-center p-4 border-b last:border-0">
            <div>
              <p className="font-medium">{txn.type.replace('_', ' ')}</p>
              <p className="text-sm text-gray-500">{new Date(txn.created_at).toLocaleDateString()}</p>
            </div>
            <span className={`font-bold ${txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {txn.amount >= 0 ? '+' : ''}₹{txn.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
