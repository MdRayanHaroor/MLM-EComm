import { useState, useEffect } from 'react'
import { walletService } from '../services/wallet'
import { WalletTransaction, Withdrawal } from '../types'
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, X } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import { DollarSign, TrendingDown } from 'lucide-react'

export default function WalletPage() {
  const [balance, setBalance] = useState<Record<string, number> | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [showWithdrawForm, setShowWithdrawForm] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState<'bank_transfer' | 'upi'>('upi')
  const [upiId, setUpiId] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [b, t, w] = await Promise.all([walletService.getBalance(), walletService.getTransactions(), walletService.getWithdrawals()])
      setBalance(b); setTransactions(t); setWithdrawals(w)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await walletService.requestWithdrawal({ amount: parseFloat(withdrawAmount), method: withdrawMethod, upi_id: withdrawMethod === 'upi' ? upiId : undefined })
      setShowWithdrawForm(false); setWithdrawAmount(''); loadData()
    } catch (e) { console.error(e) }
    finally { setSubmitting(false) }
  }

  const txnIcon = (type: string) => type.includes('credit') || type === 'commission_credit' || type === 'bonus'
    ? <ArrowDownLeft style={{ width: '16px', height: '16px', color: 'var(--color-success)' }} />
    : <ArrowUpRight style={{ width: '16px', height: '16px', color: 'var(--color-danger)' }} />

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Wallet" subtitle="Manage your earnings and withdrawals"
        action={
          <button onClick={() => setShowWithdrawForm(true)} className="btn btn-primary">
            <ArrowUpRight style={{ width: '16px', height: '16px' }} /> Withdraw Funds
          </button>
        }
      />

      {/* Stat Cards */}
      {loading ? <SkeletonLoader type="stat-card" count={3} /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          <StatCard title="Available Balance" value={`₹${(balance?.wallet_balance ?? 0).toLocaleString('en-IN')}`} icon={Wallet} gradient="green" />
          <StatCard title="Total Earnings" value={`₹${(balance?.total_earnings ?? 0).toLocaleString('en-IN')}`} icon={DollarSign} gradient="blue" />
          <StatCard title="Pending Withdrawals" value={`₹${(balance?.pending_withdrawals ?? 0).toLocaleString('en-IN')}`} icon={TrendingDown} gradient="amber" />
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawForm && (
        <>
          <div className="overlay" onClick={() => setShowWithdrawForm(false)} />
          <div className="animate-scale-in" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 60, width: '100%', maxWidth: '420px', padding: '0 1rem' }}>
            <div className="card">
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy-800)' }}>Withdraw Funds</h2>
                <button onClick={() => setShowWithdrawForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0.25rem' }}>
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
              <form onSubmit={handleWithdraw} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'var(--color-success-bg)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 500 }}>
                  Available: ₹{(balance?.wallet_balance ?? 0).toLocaleString('en-IN')}
                </div>
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} className="form-input" placeholder="Enter amount" required min="1" max={balance?.wallet_balance} />
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select value={withdrawMethod} onChange={e => setWithdrawMethod(e.target.value as 'bank_transfer' | 'upi')} className="form-select">
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
                {withdrawMethod === 'upi' && (
                  <div className="form-group">
                    <label className="form-label">UPI ID</label>
                    <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} className="form-input" placeholder="yourname@upi" required />
                  </div>
                )}
                <button type="submit" disabled={submitting} className="btn btn-primary btn-full">
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Transactions */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy-800)' }}>Recent Transactions</h2>
        </div>
        {loading ? (
          <div style={{ padding: '1rem' }}><SkeletonLoader type="list-item" count={4} /></div>
        ) : transactions.length === 0 ? (
          <EmptyState icon={Wallet} title="No transactions yet" description="Your commission credits and withdrawals will appear here." />
        ) : (
          transactions.map((txn, i) => (
            <div key={txn.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1.25rem', borderBottom: i < transactions.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ width: '36px', height: '36px', background: txn.amount >= 0 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {txnIcon(txn.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>{txn.type.replace(/_/g, ' ')}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(txn.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: txn.amount >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {txn.amount >= 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Withdrawal History */}
      {withdrawals.length > 0 && (
        <div className="card">
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy-800)' }}>Withdrawal Requests</h2>
          </div>
          {withdrawals.map((w, i) => (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1.25rem', borderBottom: i < withdrawals.length - 1 ? '1px solid var(--color-border)' : 'none', flexWrap: 'wrap' }}>
              <div style={{ width: '36px', height: '36px', background: 'var(--gray-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock style={{ width: '16px', height: '16px', color: 'var(--gray-400)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>₹{w.amount?.toLocaleString('en-IN')} via {w.method?.replace('_', ' ')}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(w.requested_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
              </div>
              <StatusBadge status={w.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
