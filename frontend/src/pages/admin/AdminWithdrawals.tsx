import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin'
import { Withdrawal } from '../../types'
import { Wallet, CheckCircle, XCircle } from 'lucide-react'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import PageHeader from '../../components/ui/PageHeader'

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { loadWithdrawals() }, [])

  const loadWithdrawals = async () => {
    try { setWithdrawals(await adminService.getWithdrawals()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const approve = async (id: string) => { await adminService.approveWithdrawal(id); loadWithdrawals() }
  const reject  = async (id: string) => { await adminService.rejectWithdrawal(id); loadWithdrawals() }

  const pending = withdrawals.filter(w => w.status === 'pending').length
  const filtered = filterStatus === 'all' ? withdrawals : withdrawals.filter(w => w.status === filterStatus)

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Withdrawal Requests"
        subtitle={pending > 0 ? `${pending} pending approval` : 'All requests processed'}
      />

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
        {['all', 'pending', 'approved', 'rejected', 'completed'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{
            padding: '0.4rem 0.875rem', borderRadius: '999px', border: 'none',
            background: filterStatus === s ? 'var(--navy-800)' : 'var(--gray-100)',
            color: filterStatus === s ? '#fff' : 'var(--color-text-secondary)',
            fontSize: '0.8125rem', fontWeight: filterStatus === s ? 700 : 500,
            cursor: 'pointer', flexShrink: 0, transition: 'all var(--transition-fast)',
            textTransform: 'capitalize',
          }}>
            {s === 'all' ? 'All' : s}{s === 'pending' && pending > 0 ? ` (${pending})` : ''}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        {loading ? (
          <table className="data-table"><tbody><SkeletonLoader type="table-row" count={5} /></tbody></table>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Wallet} title="No withdrawal requests" description="Withdrawal requests will appear here." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Method</th>
                <th>UPI / Bank</th>
                <th>Requested</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id} style={{ background: w.status === 'pending' ? 'rgba(245,158,11,0.03)' : 'transparent' }}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {w.user_id?.slice(0, 12)}…
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--navy-800)', fontSize: '0.9375rem' }}>
                    ₹{w.amount?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>{w.method?.replace('_', ' ')}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {w.upi_id ?? w.account_number ?? '—'}
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    {new Date(w.requested_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td><StatusBadge status={w.status} /></td>
                  <td>
                    {w.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => approve(w.id)} className="btn btn-sm" style={{
                          background: 'var(--color-success-bg)', color: 'var(--color-success)',
                          border: '1px solid #bbf7d0', gap: '0.25rem',
                          display: 'flex', alignItems: 'center',
                        }}>
                          <CheckCircle style={{ width: '13px', height: '13px' }} /> Approve
                        </button>
                        <button onClick={() => reject(w.id)} className="btn btn-sm" style={{
                          background: 'var(--color-danger-bg)', color: 'var(--color-danger)',
                          border: '1px solid #fecaca', gap: '0.25rem',
                          display: 'flex', alignItems: 'center',
                        }}>
                          <XCircle style={{ width: '13px', height: '13px' }} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
