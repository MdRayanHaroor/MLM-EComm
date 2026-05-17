import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, Wallet, Users, DollarSign,
  User, MapPin, LogOut, Menu, X, ChevronRight, Store,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { to: '/dashboard/orders', icon: ShoppingCart, label: 'My Orders' },
  { to: '/dashboard/wallet', icon: Wallet, label: 'Wallet' },
  { to: '/dashboard/downline', icon: Users, label: 'Downline' },
  { to: '/dashboard/commissions', icon: DollarSign, label: 'Commissions' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
  { to: '/dashboard/addresses', icon: MapPin, label: 'Addresses' },
]

function getInitials(name?: string) {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase()
}

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to
    return location.pathname.startsWith(to) && to !== '/dashboard'
      ? true
      : location.pathname === to
  }

  const currentPage = navItems.find(item =>
    item.exact ? location.pathname === item.to : location.pathname === item.to
  )?.label ?? 'Dashboard'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex' }}>

      {/* ── OVERLAY ── */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} style={{ display: 'block' }} />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        position: 'fixed',
        insetBlock: 0,
        left: 0,
        zIndex: 50,
        width: '256px',
        background: 'linear-gradient(180deg, var(--navy-800) 0%, var(--navy-900) 100%)',
        display: 'flex',
        flexDirection: 'column',
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform var(--transition-normal)',
        boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
      }} className="sidebar-default">

        {/* Sidebar Header */}
        <div style={{
          padding: '1.25rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))',
              borderRadius: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, color: '#1a1a1a', fontSize: '0.9rem',
            }}>M</div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>MLM Store</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem', display: 'none' }}
            className="sidebar-close-btn">
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '0.75rem 0.75rem', overflowY: 'auto' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 600, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
              Navigation
            </p>
            {navItems.map((item) => {
              const active = isActive(item.to, item.exact)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: active ? 600 : 500,
                    color: active ? '#fff' : '#94a3b8',
                    background: active
                      ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.08))'
                      : 'transparent',
                    borderLeft: active ? '3px solid var(--amber-500)' : '3px solid transparent',
                    marginBottom: '0.125rem',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <item.icon style={{ width: '17px', height: '17px', flexShrink: 0, color: active ? 'var(--amber-400)' : '#64748b' }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {active && <ChevronRight style={{ width: '14px', height: '14px', color: 'var(--amber-400)' }} />}
                </Link>
              )
            })}
          </div>

          {/* Back to Store */}
          <div style={{ marginTop: '1rem', padding: '0 0.25rem' }}>
            <Link to="/products" onClick={() => setSidebarOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontSize: '0.8125rem', fontWeight: 500,
              color: '#64748b',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'all var(--transition-fast)',
            }}>
              <Store style={{ width: '16px', height: '16px' }} />
              Back to Store
            </Link>
          </div>
        </nav>

        {/* User Profile Footer */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '38px', height: '38px',
              background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1a1a1a', fontWeight: 700, fontSize: '0.875rem',
              flexShrink: 0,
            }}>
              {getInitials(user?.full_name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#e2e8f0', fontSize: '0.8125rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.full_name || 'User'}
              </p>
              <p style={{ color: '#64748b', fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)',
              background: 'rgba(220,38,38,0.08)',
              border: '1px solid rgba(220,38,38,0.15)',
              color: '#fca5a5', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500,
              transition: 'background var(--transition-fast)',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.15)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.08)')}>
            <LogOut style={{ width: '15px', height: '15px' }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="dashboard-main">

        {/* Mobile Top Bar */}
        <header style={{
          background: '#fff',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xs)',
          padding: '0.875rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }} className="mobile-header">
          <button onClick={() => setSidebarOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0.375rem', borderRadius: '6px',
            color: 'var(--color-text-secondary)',
          }}>
            <Menu style={{ width: '22px', height: '22px' }} />
          </button>
          <span style={{ fontWeight: 700, color: 'var(--navy-800)', fontSize: '1rem' }}>{currentPage}</span>
          <Link to="/cart" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
            <ShoppingCart style={{ width: '22px', height: '22px' }} />
          </Link>
        </header>

        <main style={{ flex: 1, padding: '1.5rem 1rem' }} className="dashboard-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .sidebar-default { transform: translateX(0) !important; }
          .sidebar-close-btn { display: none !important; }
          .mobile-header { display: none !important; }
          .dashboard-main { margin-left: 256px; }
          .dashboard-content { padding: 2rem !important; }
        }
        @media (max-width: 768px) {
          .sidebar-default { transform: translateX(-100%); }
          .sidebar-close-btn { display: flex !important; }
          .mobile-header { display: flex !important; }
          .dashboard-main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  )
}
