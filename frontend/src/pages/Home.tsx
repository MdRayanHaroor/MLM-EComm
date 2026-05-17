import { Link } from 'react-router-dom'
import {
  ShoppingCart, Users, DollarSign, TrendingUp, ArrowRight,
  Star, Zap, Award, Gift,
  Smartphone, Shirt, Footprints, ShoppingBasket, Sparkles, Home as HomeIcon,
} from 'lucide-react'

const categories = [
  { icon: Smartphone, label: 'Electronics', color: '#2563eb', bg: '#eff6ff', link: '/products?category=Electronics' },
  { icon: Shirt,      label: 'Clothes',     color: '#7c3aed', bg: '#f5f3ff', link: '/products?category=Clothes' },
  { icon: Footprints, label: 'Footwear',    color: '#059669', bg: '#f0fdf4', link: '/products?category=Shoes' },
  { icon: ShoppingBasket, label: 'Groceries', color: '#d97706', bg: '#fffbeb', link: '/products?category=Groceries' },
  { icon: Sparkles,   label: 'Cleaning',    color: '#0891b2', bg: '#ecfeff', link: '/products?category=Cleaning' },
  { icon: HomeIcon,       label: 'Home',        color: '#e11d48', bg: '#fff1f2', link: '/products?category=Home' },
]

const commissions = [
  { level: 'Direct', percent: '10%', desc: 'On direct referral orders', color: '#f59e0b' },
  { level: 'Level 1', percent: '5%',  desc: 'Sponsor of referral',       color: '#3b82f6' },
  { level: 'Level 2', percent: '3%',  desc: '3rd upline earnings',       color: '#8b5cf6' },
  { level: 'Level 3', percent: '2%',  desc: '4th upline earnings',       color: '#10b981' },
  { level: 'Level 4', percent: '1%',  desc: '5th upline earnings',       color: '#f43f5e' },
]

const ranks = [
  { name: 'Starter',  pv: '0',    refs: '0',  multiplier: '1×',  color: '#64748b' },
  { name: 'Bronze',   pv: '500',  refs: '3',  multiplier: '1.1×', color: '#92400e' },
  { name: 'Silver',   pv: '2K',   refs: '5',  multiplier: '1.25×', color: '#475569' },
  { name: 'Gold',     pv: '5K',   refs: '10', multiplier: '1.5×', color: '#d97706' },
  { name: 'Diamond',  pv: '15K',  refs: '15', multiplier: '2×',  color: '#6366f1' },
]

export default function Home() {
  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-700) 50%, #1e3a5f 100%)',
        padding: '5rem 0 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decorations */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(245,158,11,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '10%', right: '5%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '680px', marginBottom: '1rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '999px',
              padding: '0.35rem 0.875rem',
              marginBottom: '1.5rem',
            }}>
              <Zap style={{ width: '13px', height: '13px', color: 'var(--amber-400)' }} />
              <span style={{ color: 'var(--amber-400)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                EARN WHILE YOU SHOP
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}>
              Shop. Refer. <br />
              <span style={{ color: 'var(--amber-400)' }}>Earn Unlimited</span>
            </h1>

            <p style={{ fontSize: '1.0625rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '500px' }}>
              Buy quality electronics, clothes, groceries and more — then build your network and earn commissions from every referral up to 4 levels deep.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
              <Link to="/products" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
                Shop Now <ArrowRight style={{ width: '18px', height: '18px' }} />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Start Earning Free
              </Link>
            </div>

            {/* Trust numbers */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2.5rem' }}>
              {[
                { label: 'Products', value: '500+' },
                { label: 'Distributors', value: '10K+' },
                { label: 'Commission Paid', value: '₹50L+' },
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY STRIP ── */}
      <section style={{ background: '#fff', padding: '2.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="page-container">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--navy-800)' }}>
            Shop by Category
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '1rem',
          }}>
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={cat.link}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '1.25rem 0.75rem',
                  borderRadius: 'var(--radius-lg)',
                  background: cat.bg,
                  border: `1px solid ${cat.color}18`,
                  textDecoration: 'none',
                  transition: 'all var(--transition-normal)',
                  cursor: 'pointer',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{
                  width: '50px', height: '50px',
                  background: '#fff',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <cat.icon style={{ width: '24px', height: '24px', color: cat.color }} />
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '4rem 0', background: 'var(--color-bg)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber-600)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              HOW IT WORKS
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-800)', letterSpacing: '-0.02em' }}>
              Simple. Rewarding. Scalable.
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}>
            {[
              { icon: ShoppingCart, step: '01', title: 'Shop Products', desc: 'Browse electronics, clothes, groceries and more at competitive prices', color: '#2563eb' },
              { icon: Users,        step: '02', title: 'Refer & Recruit', desc: 'Share your referral code with friends and family to grow your network', color: '#7c3aed' },
              { icon: DollarSign,   step: '03', title: 'Earn Commissions', desc: 'Get 10% direct + up to 5% from 4 levels of your downline network', color: '#059669' },
              { icon: TrendingUp,   step: '04', title: 'Climb the Ranks', desc: 'Accumulate PV points, unlock multipliers and hit Diamond rank', color: '#d97706' },
            ].map((item, i) => (
              <div key={i} className="card card-hover animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{
                      width: '48px', height: '48px',
                      background: `${item.color}15`,
                      borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <item.icon style={{ width: '22px', height: '22px', color: item.color }} />
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--gray-100)', lineHeight: 1 }}>{item.step}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--navy-800)' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMISSION STRUCTURE ── */}
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber-600)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              EARNINGS
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-800)', letterSpacing: '-0.02em' }}>
              Commission Structure
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Earn on every purchase in your network — 4 levels deep
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            {commissions.map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', overflow: 'hidden' }}>
                <div style={{
                  height: '4px',
                  background: item.color,
                }} />
                <div style={{ padding: '1.25rem 1rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {item.level}
                  </p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 900, color: item.color, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                    {item.percent}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RANK SYSTEM ── */}
      <section style={{ padding: '4rem 0', background: 'var(--color-bg)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber-600)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              RANK SYSTEM
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-800)', letterSpacing: '-0.02em' }}>
              Climb Your Way to Diamond
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {ranks.map((rank, i) => (
              <div key={i} className="card" style={{ overflow: 'hidden', textAlign: 'center' }}>
                <div style={{ height: '4px', background: rank.color }} />
                <div style={{ padding: '1.25rem 1rem' }}>
                  <div style={{
                    width: '44px', height: '44px',
                    background: `${rank.color}15`,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 0.875rem',
                  }}>
                    <Award style={{ width: '22px', height: '22px', color: rank.color }} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy-800)', marginBottom: '0.75rem' }}>{rank.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    <div>PV: <strong style={{ color: 'var(--color-text-primary)' }}>{rank.pv}</strong></div>
                    <div>Refs: <strong style={{ color: 'var(--color-text-primary)' }}>{rank.refs}</strong></div>
                    <div style={{
                      marginTop: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      background: `${rank.color}12`,
                      borderRadius: '999px',
                      fontWeight: 700,
                      color: rank.color,
                      fontSize: '0.8rem',
                    }}>
                      {rank.multiplier} multiplier
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy-800), var(--navy-600))',
        padding: '4rem 0',
      }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '999px',
            padding: '0.35rem 0.875rem',
            marginBottom: '1.5rem',
          }}>
            <Gift style={{ width: '13px', height: '13px', color: 'var(--amber-400)' }} />
            <span style={{ color: 'var(--amber-400)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              JOIN FOR FREE
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Ready to Start Earning?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
            Register today, start shopping, and build your network. Your first commission could be just one referral away.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/register" className="btn btn-primary btn-xl">
              Get Started Free <ArrowRight style={{ width: '18px', height: '18px' }} />
            </Link>
            <Link to="/products" className="btn btn-secondary btn-xl">
              Browse Products
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginTop: '1.5rem' }}>
            {[1,2,3,4,5].map(i => <Star key={i} style={{ width: '16px', height: '16px', color: 'var(--amber-400)', fill: 'currentColor' }} />)}
            <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: '0.5rem' }}>4.9/5 from 2,400+ members</span>
          </div>
        </div>
      </section>
    </div>
  )
}
