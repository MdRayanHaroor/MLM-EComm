import { Outlet, Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, User, Menu, X, Search, ChevronDown,
  MapPin, Package, Headphones, Shield, Truck, RotateCcw,
  Globe, MessageCircle, Share2, PlayCircle
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

const categories = [
  'Electronics', 'Clothes', 'Shoes & Footwear', 'Groceries',
  'Cleaning Products', 'Home Products',
]

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { itemCount } = useCartStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setAccountMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div style={{
        background: 'var(--navy-900)',
        color: '#94a3b8',
        textAlign: 'center',
        padding: '0.35rem 1rem',
        fontSize: '0.75rem',
        letterSpacing: '0.02em',
      }}>
        🚀 Free shipping on orders above ₹499 &nbsp;|&nbsp; Earn commissions up to 10% on referrals
      </div>

      {/* ── MAIN HEADER ── */}
      <header style={{
        background: 'linear-gradient(180deg, var(--navy-800) 0%, var(--navy-700) 100%)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}>
        <div className="page-container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            height: '68px',
          }}>

            {/* Logo */}
            <Link to="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, color: '#1a1a1a', fontSize: '1.1rem',
              }}>M</div>
              <div style={{ lineHeight: 1 }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>MLM</div>
                <div style={{ color: 'var(--amber-500)', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Store</div>
              </div>
            </Link>

            {/* Search Bar — hidden on mobile */}
            <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', maxWidth: '620px' }} className="hidden-mobile">
              <div style={{ display: 'flex', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--amber-500)' }}>
                <select style={{
                  padding: '0 0.75rem',
                  background: 'var(--gray-100)',
                  border: 'none',
                  borderRight: '1px solid var(--gray-200)',
                  fontSize: '0.75rem',
                  color: 'var(--gray-700)',
                  cursor: 'pointer',
                  outline: 'none',
                  flexShrink: 0,
                }}>
                  <option>All</option>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands and more..."
                  style={{
                    flex: 1,
                    padding: '0 1rem',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-primary)',
                    background: '#fff',
                  }}
                />
                <button type="submit" style={{
                  padding: '0 1.25rem',
                  background: 'var(--amber-500)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background var(--transition-fast)',
                }} onMouseOver={e => (e.currentTarget.style.background = 'var(--amber-600)') }
                   onMouseOut={e => (e.currentTarget.style.background = 'var(--amber-500)')}>
                  <Search style={{ width: '18px', height: '18px', color: '#1a1a1a' }} />
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>

              {/* Deliver To */}
              <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.75rem', color: '#e2e8f0', cursor: 'pointer', borderRadius: '6px', transition: 'background var(--transition-fast)' }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                <MapPin style={{ width: '14px', height: '14px', color: 'var(--amber-400)', flexShrink: 0 }} />
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>Deliver to</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>India</div>
                </div>
              </div>

              {/* Account */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setAccountMenuOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.5rem 0.75rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#e2e8f0',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: '32px', height: '32px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <User style={{ width: '16px', height: '16px' }} />
                  </div>
                  <div className="hidden-mobile" style={{ lineHeight: 1.2, textAlign: 'left' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>
                      {isAuthenticated ? `Hello, ${user?.full_name?.split(' ')[0]}` : 'Hello, Sign in'}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      Account <ChevronDown style={{ width: '12px', height: '12px' }} />
                    </div>
                  </div>
                </button>

                {accountMenuOpen && (
                  <>
                    <div className="overlay" style={{ zIndex: 49 }} onClick={() => setAccountMenuOpen(false)} />
                    <div className="animate-scale-in" style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: '#fff',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--color-border)',
                      minWidth: '200px',
                      zIndex: 51,
                      overflow: 'hidden',
                    }}>
                      {isAuthenticated ? (
                        <>
                          <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-border)', background: 'var(--gray-50)' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.full_name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{user?.role}</div>
                          </div>
                          {[
                            { label: 'My Dashboard', to: '/dashboard' },
                            { label: 'My Orders', to: '/dashboard/orders' },
                            { label: 'My Wallet', to: '/dashboard/wallet' },
                            { label: 'My Profile', to: '/dashboard/profile' },
                          ].map(item => (
                            <Link key={item.to} to={item.to} onClick={() => setAccountMenuOpen(false)} style={{
                              display: 'block',
                              padding: '0.625rem 1rem',
                              fontSize: '0.875rem',
                              color: 'var(--color-text-primary)',
                              textDecoration: 'none',
                              transition: 'background var(--transition-fast)',
                            }}
                              onMouseOver={e => (e.currentTarget.style.background = 'var(--gray-50)')}
                              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                              {item.label}
                            </Link>
                          ))}
                          <button onClick={handleLogout} style={{
                            display: 'block', width: '100%', textAlign: 'left',
                            padding: '0.625rem 1rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-danger)',
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            borderTop: '1px solid var(--color-border)',
                            transition: 'background var(--transition-fast)',
                          }}
                            onMouseOver={e => (e.currentTarget.style.background = 'var(--color-danger-bg)')}
                            onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <div style={{ padding: '1rem' }}>
                            <Link to="/login" className="btn btn-primary btn-full" onClick={() => setAccountMenuOpen(false)}>
                              Sign In
                            </Link>
                          </div>
                          <div style={{ padding: '0.625rem 1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            New customer?{' '}
                            <Link to="/register" onClick={() => setAccountMenuOpen(false)} style={{ color: 'var(--color-info)', textDecoration: 'none', fontWeight: 600 }}>
                              Register here
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                color: '#e2e8f0',
                textDecoration: 'none',
                borderRadius: '6px',
                position: 'relative',
                transition: 'background var(--transition-fast)',
              }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ position: 'relative' }}>
                  <ShoppingCart style={{ width: '24px', height: '24px' }} />
                  {itemCount() > 0 && (
                    <span style={{
                      position: 'absolute', top: '-8px', right: '-8px',
                      background: 'var(--amber-500)',
                      color: '#1a1a1a',
                      fontSize: '0.65rem', fontWeight: 700,
                      borderRadius: '999px',
                      minWidth: '18px', height: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0 4px',
                    }}>
                      {itemCount()}
                    </span>
                  )}
                </div>
                <span className="hidden-mobile" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Cart</span>
              </Link>

              {/* Mobile Hamburger */}
              <button
                className="visible-mobile"
                onClick={() => setMobileMenuOpen(v => !v)}
                style={{
                  background: 'transparent', border: 'none',
                  color: '#e2e8f0', cursor: 'pointer', padding: '0.5rem',
                  borderRadius: '6px',
                  display: 'none',
                }}>
                {mobileMenuOpen ? <X style={{ width: '22px', height: '22px' }} /> : <Menu style={{ width: '22px', height: '22px' }} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mobile-search-bar" style={{ paddingBottom: '0.75rem' }}>
            <form onSubmit={handleSearch}>
              <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--amber-500)' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  style={{
                    flex: 1, padding: '0.625rem 1rem',
                    border: 'none', outline: 'none',
                    fontSize: '0.875rem', background: '#fff',
                  }}
                />
                <button type="submit" style={{
                  padding: '0 1rem', background: 'var(--amber-500)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                }}>
                  <Search style={{ width: '18px', height: '18px', color: '#1a1a1a' }} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── CATEGORY NAV BAR ── */}
        <div style={{
          background: 'var(--navy-900)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div className="page-container">
            <nav style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              height: '40px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}>
              <Link to="/products" style={navLinkStyle}>
                🏷️ All Deals
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  style={navLinkStyle}
                >
                  {cat}
                </Link>
              ))}
              <Link to="/register" style={{ ...navLinkStyle, color: 'var(--amber-400)', fontWeight: 600 }}>
                ⭐ Earn & Refer
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {mobileMenuOpen && (
        <>
          <div className="overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="animate-slide-down" style={{
            position: 'fixed', top: 0, left: 0, right: 0,
            background: 'var(--navy-800)',
            zIndex: 60,
            boxShadow: 'var(--shadow-xl)',
            padding: '1.25rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ color: '#fff', fontWeight: 700 }}>Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer' }}>
                <X style={{ width: '22px', height: '22px' }} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { to: '/', label: '🏠 Home' },
                { to: '/products', label: '🛍️ Products' },
                { to: '/cart', label: '🛒 Cart' },
              ].map(item => (
                <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}
                  style={{ color: '#e2e8f0', textDecoration: 'none', padding: '0.625rem 0.5rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 500 }}>
                  {item.label}
                </Link>
              ))}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}
                    style={{ color: '#e2e8f0', textDecoration: 'none', padding: '0.625rem 0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                    👤 My Dashboard
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                    style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', textAlign: 'left', padding: '0.625rem 0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-full" style={{ marginTop: '0.25rem' }}>
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-full">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ── TRUST BADGES ── */}
      <div style={{ background: '#fff', borderTop: '1px solid var(--color-border)', padding: '1.5rem 0' }}>
        <div className="page-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹499' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '10-day return policy' },
              { icon: Shield, title: 'Secure Payments', desc: '100% safe transactions' },
              { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer care' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px', height: '42px',
                  background: 'var(--amber-100)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <item.icon style={{ width: '20px', height: '20px', color: 'var(--amber-600)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--navy-800)', color: '#94a3b8' }}>
        <div className="page-container" style={{ padding: '3rem 1rem 1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}>
            {/* Brand */}
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.75rem' }}>MLM Store</div>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                Shop quality products and build a thriving network. Earn commissions on every referral.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {[Globe, MessageCircle, Share2, PlayCircle].map((Icon, i) => (
                  <button key={i} style={{
                    width: '32px', height: '32px',
                    background: 'rgba(255,255,255,0.08)',
                    border: 'none', borderRadius: '6px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#94a3b8',
                    transition: 'background var(--transition-fast)',
                  }}
                    onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                    onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
                    <Icon style={{ width: '15px', height: '15px' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Links columns */}
            {[
              {
                title: 'Customer Service',
                links: ['Help Center', 'Track Order', 'Return Policy', 'Payment Options'],
              },
              {
                title: 'My Account',
                links: ['Sign In', 'Register', 'My Orders', 'My Wallet'],
              },
              {
                title: 'MLM Program',
                links: ['How It Works', 'Commission Structure', 'Rank Benefits', 'Join Now'],
              },
            ].map(col => (
              <div key={col.title}>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.875rem' }}>{col.title}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" style={{
                        color: '#94a3b8', textDecoration: 'none', fontSize: '0.8125rem',
                        transition: 'color var(--transition-fast)',
                      }}
                        onMouseOver={e => (e.currentTarget.style.color = 'var(--amber-400)')}
                        onMouseOut={e => (e.currentTarget.style.color = '#94a3b8')}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '0.5rem', alignItems: 'center' }}>
            <p style={{ fontSize: '0.75rem' }}>© 2026 MLM Ecommerce Platform. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
                <a key={link} href="#" style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'none' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#94a3b8')}
                  onMouseOut={e => (e.currentTarget.style.color = '#64748b')}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-search-bar { display: block !important; }
          .visible-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-search-bar { display: none !important; }
          .visible-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}

const navLinkStyle: React.CSSProperties = {
  color: '#cbd5e1',
  textDecoration: 'none',
  fontSize: '0.8125rem',
  fontWeight: 500,
  padding: '0.25rem 0.75rem',
  borderRadius: '4px',
  whiteSpace: 'nowrap',
  transition: 'color 150ms, background 150ms',
  flexShrink: 0,
}
