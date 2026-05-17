import { useState, useEffect } from 'react'
import { commissionService } from '../services/wallet'
import { Commission } from '../types'
import { DollarSign, TrendingUp, Clock } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import PageHeader from '../components/ui/PageHeader'

const typeLabel: Record<string, string> = {
  direct_referral: 'Direct Referral',
  level_1: 'Level 1',
  level_2: 'Level 2',
  level_3: 'Level 3',
  level_4: 'Level 4',
}

const typeBadgeStyle: Record<string, React.CSSProperties> = {
  direct_referral: { background: '#fef3c7', color: '#92400e' },
  level_1: { background: '#eff6ff', color: '#1e40af' },
  level_2: { background: '#f5f3ff', color: '#5b21b6' },
  level_3: { background: '#f0fdf4', color: '#166534' },
  level_4: { background: '#fff1f2', color: '#9f1239' },
}

export default function Commissions() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadCommissions() }, [])

  const loadCommissions = async () => {
    try { setCommissions(await commissionService.getCommissions()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const total = commissions.reduce((s, c) => s + c.amount, 0)
  const credited = commissions.filter(c => c.status === 'credited').reduce((s, c) => s + c.amount, 0)
  const pending = commissions.filter(c => c.status === 'pending').reduce((s, c) => s + c.amount, 0)

  return (
    <div className="animate-fade-in">
      <PageHeader title="Commissions" subtitle="Your commission earnings from referrals and downline" />

      {loading ? <SkeletonLoader type="stat-card" count={3} /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          <StatCard title="Total Earned" value={`₹${total.toFixed(2)}`} icon={DollarSign} gradient="blue" />
          <StatCard title="Credited" value={`₹${credited.toFixed(2)}`} icon={TrendingUp} gradient="green" />
          <StatCard title="Pending" value={`₹${pending.toFixed(2)}`} icon={Clock} gradient="amber" />
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy-800)' }}>Commission History</h2>
        </div>
        {loading ? (
          <table className="data-table"><tbody><SkeletonLoader type="table-row" count={5} /></tbody></table>
        ) : commissions.length === 0 ? (
          <EmptyState icon={DollarSign} title="No commissions yet"
            description="Start referring people and earn commissions when they place orders." />
        ) : (
          <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>PV Earned</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map(comm => (
                  <tr key={comm.id}>
                    <td>
                      <span style={{
                        ...typeBadgeStyle[comm.type],
                        display: 'inline-block',
                        padding: '0.2rem 0.625rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                      }}>
                        {typeLabel[comm.type] ?? comm.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--color-success)' }}>+₹{comm.amount.toFixed(2)}</td>
                    <td style={{ color: 'var(--amber-600)', fontWeight: 600 }}>{comm.pv_earned ?? 0} PV</td>
                    <td><StatusBadge status={comm.status} /></td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                      {new Date(comm.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
