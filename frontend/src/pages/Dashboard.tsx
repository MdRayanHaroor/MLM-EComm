import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/auth'
import { walletService } from '../services/wallet'
import { Profile } from '../types'
import { useAuthStore } from '../store/authStore'
import { Wallet, ShoppingCart, Users, DollarSign, Copy, Check, TrendingUp, Award, ArrowRight } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import SkeletonLoader from '../components/ui/SkeletonLoader'

const rankOrder = ['Starter', 'Bronze', 'Silver', 'Gold', 'Diamond']
const rankPv = [0, 500, 2000, 5000, 15000]

function getRankProgress(pv: number, rank: string) {
  const idx = rankOrder.indexOf(rank)
  if (idx === rankOrder.length - 1) return 100
  const curr = rankPv[idx] ?? 0
  const next = rankPv[idx + 1] ?? 1
  return Math.min(100, Math.round(((pv - curr) / (next - curr)) * 100))
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [balance, setBalance] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [p, b] = await Promise.all([authService.getProfile(), walletService.getBalance()])
      setProfile(p); setBalance(b)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const copyReferral = () => {
    navigator.clipboard.writeText(user?.referral_code || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const rank = profile?.current_rank ?? 'Starter'
  const pv = profile?.pv_balance ?? 0
  const progress = getRankProgress(pv, rank)
  const rankIdx = rankOrder.indexOf(rank)
  const nextRank = rankOrder[rankIdx + 1]

  return (
    <div className="animate-fade-in">
      {/* Welcome */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-800)', letterSpacing: '-0.02em' }}>
          Welcome back, {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Here's an overview of your account</p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <SkeletonLoader type="stat-card" count={4} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          <StatCard title="PV Balance" value={pv.toFixed(0)} subtitle="Point Value earned" icon={TrendingUp} gradient="blue" />
          <StatCard title="Current Rank" value={rank} subtitle="MLM rank" icon={Award} gradient="amber" />
          <StatCard title="Wallet Balance" value={`₹${(balance?.wallet_balance ?? 0).toLocaleString('en-IN')}`} subtitle="Available to withdraw" icon={Wallet} gradient="green" />
          <StatCard title="Total Earnings" value={`₹${(balance?.total_earnings ?? 0).toLocaleString('en-IN')}`} subtitle="All time commissions" icon={DollarSign} gradient="purple" />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {/* Rank Progress */}
        <div className="card">
          <div style={{ padding: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy-800)', marginBottom: '1rem' }}>Rank Progress</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award style={{ width: '16px', height: '16px', color: 'var(--amber-500)' }} />
                <span style={{ fontWeight: 700, color: 'var(--navy-800)', fontSize: '0.9rem' }}>{rank}</span>
              </div>
              {nextRank && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Next: {nextRank}</span>}
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              <span>{pv.toFixed(0)} PV</span>
              {nextRank && <span>{rankPv[rankIdx + 1]?.toLocaleString()} PV to {nextRank}</span>}
              {!nextRank && <span style={{ color: 'var(--amber-600)', fontWeight: 600 }}>Max Rank! 🎉</span>}
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="card">
          <div style={{ padding: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy-800)', marginBottom: '0.75rem' }}>Your Referral Code</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
              <code style={{
                flex: 1, background: 'var(--gray-50)', border: '1.5px dashed var(--gray-300)',
                borderRadius: '8px', padding: '0.625rem 1rem',
                fontFamily: 'monospace', fontSize: '1.125rem', fontWeight: 700,
                letterSpacing: '0.1em', color: 'var(--navy-800)', textAlign: 'center',
              }}>
                {user?.referral_code}
              </code>
              <button onClick={copyReferral} className="btn btn-secondary" style={{ flexShrink: 0, padding: '0.625rem' }}>
                {copied ? <Check style={{ width: '16px', height: '16px', color: 'var(--color-success)' }} /> : <Copy style={{ width: '16px', height: '16px' }} />}
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Share this code to earn 10% commission on every referral's order
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy-800)' }}>Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0', padding: '0' }}>
          {[
            { to: '/dashboard/orders', icon: ShoppingCart, label: 'My Orders', color: '#2563eb', bg: '#eff6ff' },
            { to: '/dashboard/wallet', icon: Wallet, label: 'Wallet', color: '#059669', bg: '#f0fdf4' },
            { to: '/dashboard/downline', icon: Users, label: 'Downline', color: '#7c3aed', bg: '#f5f3ff' },
            { to: '/dashboard/commissions', icon: DollarSign, label: 'Commissions', color: '#d97706', bg: '#fffbeb' },
          ].map((item, i, arr) => (
            <Link key={item.to} to={item.to} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.625rem',
              padding: '1.25rem 1rem', textDecoration: 'none',
              borderRight: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none',
              transition: 'background var(--transition-fast)',
            }}
              onMouseOver={e => (e.currentTarget.style.background = item.bg)}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
              <div style={{ width: '42px', height: '42px', background: item.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon style={{ width: '20px', height: '20px', color: item.color }} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.label}</span>
              <ArrowRight style={{ width: '13px', height: '13px', color: 'var(--gray-400)' }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
