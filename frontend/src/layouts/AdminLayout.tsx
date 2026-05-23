import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Wallet,
  Settings, LogOut, Menu, X, ChevronRight, Shield, BarChart2, User,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/withdrawals', icon: Wallet, label: 'Withdrawals' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/users': 'Users',
  '/admin/withdrawals': 'Withdrawals',
  '/admin/settings': 'Settings',
}

export default function AdminLayout() {
  const { logout, user } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to
    return location.pathname === to
  }

  const currentTitle = pageTitles[location.pathname] ?? 'Admin Panel'


  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex' }}>

      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── ADMIN SIDEBAR ── */}
      <aside
        className="admin-sidebar"
        style={{
          position: 'fixed',
          insetBlock: 0,
          left: 0,
          zIndex: 50,
          width: '240px',
          background: 'var(--navy-900)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
          transition: 'transform var(--transition-normal)',
        }}>

        {/* Header */}
        <div style={{
          padding: '1.25rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '34px', height: '34px',
              background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield style={{ width: '18px', height: '18px', color: '#1a1a1a' }} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>Admin Panel</div>
              <div style={{ color: '#475569', fontSize: '0.65rem', fontWeight: 500 }}>Management Console</div>
            </div>
          </div>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'none' }}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 600, color: '#334155', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.625rem' }}>
            Management
          </p>
          {(() => {
            const items = [
              ...navItems,
              ...(user?.role === 'super_admin' ? [{ to: '/dashboard', icon: User, label: 'Member Dashboard', exact: false }] : [])
            ]
            return items.map((item) => {
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
                    color: active ? '#fff' : '#64748b',
                    background: active
                      ? 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.08))'
                      : 'transparent',
                    borderLeft: active ? '3px solid var(--amber-500)' : '3px solid transparent',
                    marginBottom: '0.125rem',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseOver={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                  onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
                  <item.icon style={{
                    width: '17px', height: '17px', flexShrink: 0,
                    color: active ? 'var(--amber-400)' : '#334155',
                  }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {active && <ChevronRight style={{ width: '14px', height: '14px', color: 'var(--amber-400)' }} />}
                </Link>
              )
            })
          })()}

          {/* Analytics placeholder */}
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 600, color: '#334155', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.625rem' }}>
              Analytics
            </p>
            <div style={{
              padding: '0.875rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <BarChart2 style={{ width: '15px', height: '15px', color: 'var(--amber-400)' }} />
                <span style={{ color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600 }}>Reports</span>
              </div>
              <p style={{ color: '#475569', fontSize: '0.7rem' }}>Sales & commission reports coming soon</p>
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem',
              padding: '0.625rem 0.75rem',
              background: 'rgba(220,38,38,0.08)',
              border: '1px solid rgba(220,38,38,0.15)',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5', cursor: 'pointer',
              fontSize: '0.8125rem', fontWeight: 500,
              transition: 'background var(--transition-fast)',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.15)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.08)')}>
            <LogOut style={{ width: '15px', height: '15px' }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── CONTENT AREA ── */}
      <div style={{ flex: 1 }} className="admin-main">

        {/* Top Bar */}
        <header style={{
          background: '#fff',
          borderBottom: '1px solid var(--color-border)',
          padding: '0 1.5rem',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          boxShadow: 'var(--shadow-xs)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="admin-menu-btn"
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'none' }}>
              <Menu style={{ width: '22px', height: '22px' }} />
            </button>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Admin</span>
              <ChevronRight style={{ width: '14px', height: '14px', color: 'var(--gray-300)' }} />
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{currentTitle}</span>
            </div>
          </div>

          {/* Back to store */}
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            fontSize: '0.8125rem', color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            padding: '0.375rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            transition: 'all var(--transition-fast)',
          }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.color = 'var(--navy-800)' }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}>
            ← View Store
          </Link>
        </header>

        <main style={{ padding: '1.5rem 1rem', minHeight: 'calc(100vh - 60px)' }} className="admin-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .admin-sidebar { transform: translateX(0) !important; }
          .admin-sidebar-close { display: none !important; }
          .admin-menu-btn { display: none !important; }
          .admin-main { margin-left: 240px; }
          .admin-content { padding: 2rem !important; }
        }
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar-close { display: flex !important; }
          .admin-menu-btn { display: flex !important; }
          .admin-main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  )
}
