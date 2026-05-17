import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin'
import { Users, ShoppingCart, DollarSign, TrendingUp, Package, Wallet } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import PageHeader from '../../components/ui/PageHeader'

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    try { setStats(await adminService.getDashboard()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const statCards = [
    { title: 'Total Users',           key: 'total_users',             icon: Users,        gradient: 'blue'   as const },
    { title: 'Active Distributors',   key: 'active_distributors',     icon: TrendingUp,   gradient: 'green'  as const },
    { title: 'Total Orders',          key: 'total_orders',            icon: ShoppingCart, gradient: 'purple' as const },
    { title: 'Total Revenue',         key: 'total_revenue',           icon: DollarSign,   gradient: 'amber'  as const, prefix: '₹' },
    { title: 'Pending Withdrawals',   key: 'pending_withdrawals',     icon: Wallet,       gradient: 'rose'   as const, prefix: '₹' },
    { title: 'Commissions Paid',      key: 'total_commissions_paid',  icon: Package,      gradient: 'teal'   as const, prefix: '₹' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Admin Dashboard" subtitle="Platform overview and key metrics" />

      {loading ? (
        <SkeletonLoader type="stat-card" count={6} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {statCards.map(card => (
            <StatCard
              key={card.key}
              title={card.title}
              value={`${card.prefix ?? ''}${(stats?.[card.key] ?? 0).toLocaleString('en-IN')}`}
              icon={card.icon}
              gradient={card.gradient}
            />
          ))}
        </div>
      )}

      {/* Quick navigation tiles */}
      <div className="card">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy-800)' }}>Quick Management</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
          {[
            { to: '/admin/products',    icon: Package,      label: 'Products',    color: '#7c3aed', bg: '#f5f3ff' },
            { to: '/admin/orders',      icon: ShoppingCart, label: 'Orders',      color: '#2563eb', bg: '#eff6ff' },
            { to: '/admin/users',       icon: Users,        label: 'Users',       color: '#059669', bg: '#f0fdf4' },
            { to: '/admin/withdrawals', icon: Wallet,       label: 'Withdrawals', color: '#d97706', bg: '#fffbeb' },
          ].map((item, i) => {
            const handleClick = () => window.location.href = item.to
            return (
              <button key={i} onClick={handleClick} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.625rem',
                padding: '1.5rem 1rem',
                background: 'transparent', border: 'none', cursor: 'pointer',
                borderRight: i < 3 ? '1px solid var(--color-border)' : 'none',
                transition: 'background var(--transition-fast)',
              }}
                onMouseOver={e => (e.currentTarget.style.background = item.bg)}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ width: '46px', height: '46px', background: item.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon style={{ width: '22px', height: '22px', color: item.color }} />
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
