import { Link } from 'react-router-dom'
import {
  UserPlus, ShoppingCart, DollarSign, TrendingUp, Award,
  Users, Zap, CheckCircle, ArrowRight, Star, Shield,
} from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Register Free',
    desc: 'Create your account in seconds. Optionally enter a sponsor\'s referral code to join their network.',
    color: '#2563eb',
  },
  {
    icon: ShoppingCart,
    step: '02',
    title: 'Shop Products',
    desc: 'Browse electronics, clothes, groceries, and more. Every purchase earns you PV points.',
    color: '#7c3aed',
  },
  {
    icon: Users,
    step: '03',
    title: 'Refer & Build',
    desc: 'Share your referral code. Your referrals go into your 4×4 matrix tree automatically.',
    color: '#059669',
  },
  {
    icon: DollarSign,
    step: '04',
    title: 'Earn Commissions',
    desc: 'Get 10% direct referral + up to 5% from 4 levels deep. Commissions auto-credit to your wallet.',
    color: '#d97706',
  },
]

const commissions = [
  { level: 'Direct Referral', percent: '10%', desc: 'On every order by your direct referrals', color: '#f59e0b' },
  { level: 'Level 1', percent: '5%', desc: 'Orders by your referrals\' referrals', color: '#3b82f6' },
  { level: 'Level 2', percent: '3%', desc: '3rd level in your downline', color: '#8b5cf6' },
  { level: 'Level 3', percent: '2%', desc: '4th level in your downline', color: '#10b981' },
  { level: 'Level 4', percent: '1%', desc: '5th level in your downline', color: '#f43f5e' },
]

const ranks = [
  { name: 'Starter', pv: '0', refs: '0', mult: '1×', color: '#64748b', desc: 'Start earning base commissions' },
  { name: 'Bronze', pv: '500', refs: '3', mult: '1.1×', color: '#92400e', desc: '10% bonus on all commissions' },
  { name: 'Silver', pv: '2,000', refs: '5', mult: '1.25×', color: '#475569', desc: '25% bonus on all commissions' },
  { name: 'Gold', pv: '5,000', refs: '10', mult: '1.5×', color: '#d97706', desc: '50% bonus on all commissions' },
  { name: 'Diamond', pv: '15,000', refs: '15', mult: '2×', color: '#6366f1', desc: 'Double all commissions + pool bonus' },
]

const matrixInfo = [
  { label: 'Matrix Size', value: '4 × 4', icon: Users },
  { label: 'Max Depth', value: '4 Levels', icon: TrendingUp },
  { label: 'Placement', value: 'Auto-Fill', icon: Zap },
  { label: 'Spillover', value: 'Enabled', icon: ArrowRight },
]

export default function HowItWorks() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-700) 50%, #1e3a5f 100%)',
        padding: '4rem 0 3rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(245,158,11,0.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
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
              SIMPLE & TRANSPARENT
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
          }}>
            How MLM Store Works
          </h1>
          <p style={{ fontSize: '1.0625rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 2rem' }}>
            Shop quality products, refer friends, and earn commissions from your growing network. It's that simple.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started Free <ArrowRight style={{ width: '18px', height: '18px' }} />
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber-600)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              GETTING STARTED
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-800)', letterSpacing: '-0.02em' }}>
              4 Simple Steps
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}>
            {steps.map((item, i) => (
              <div key={i} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ height: '4px', background: item.color }} />
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

      {/* Matrix Info */}
      <section style={{ padding: '3rem 0', background: 'var(--color-bg)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-800)' }}>4×4 Matrix System</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Your referrals are placed automatically in a balanced tree structure
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            {matrixInfo.map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                <item.icon style={{ width: '24px', height: '24px', color: 'var(--amber-500)', margin: '0 auto 0.75rem' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{item.label}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-800)' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
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
              Earn on every purchase in your network — up to 4 levels deep
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
                <div style={{ height: '4px', background: item.color }} />
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

      {/* Rank System */}
      <section style={{ padding: '4rem 0', background: 'var(--color-bg)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber-600)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              RANK SYSTEM
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-800)', letterSpacing: '-0.02em' }}>
              Climb Your Way to Diamond
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Accumulate PV points from purchases to unlock higher commission multipliers
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {ranks.map((rank, i) => (
              <div key={i} className="card" style={{ overflow: 'hidden', textAlign: 'center' }}>
                <div style={{ height: '4px', background: rank.color }} />
                <div style={{ padding: '1.25rem 1rem' }}>
                  <div style={{
                    width: '44px', height: '44px',
                    background: `${rank.color}15`,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                  }}>
                    <Award style={{ width: '22px', height: '22px', color: rank.color }} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy-800)', marginBottom: '0.25rem' }}>{rank.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>{rank.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
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
                      {rank.mult} multiplier
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is PV */}
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div className="page-container" style={{ maxWidth: '700px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-800)' }}>What is PV?</h2>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--amber-100)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Star style={{ width: '20px', height: '20px', color: 'var(--amber-600)' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy-800)', marginBottom: '0.5rem' }}>Point Value (PV)</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  PV is a scoring system attached to every product. When you or your downline makes a purchase, PV points are accumulated toward your rank qualification. Higher rank = higher commission multiplier on all earnings.
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { title: 'Earn on Self Purchase', desc: 'PV from your own orders counts toward your rank' },
                { title: 'Earn on Downline', desc: 'PV from qualifying downline purchases also counts' },
                { title: 'Rank Qualification', desc: 'Reach PV thresholds to unlock higher ranks' },
                { title: 'Commission Boost', desc: 'Higher ranks get up to 2× commission multiplier' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: '8px' }}>
                  <CheckCircle style={{ width: '16px', height: '16px', color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy-800)' }}>{item.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy-800), var(--navy-600))',
        padding: '4rem 0',
      }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Ready to Start Earning?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
            Join thousands of distributors who earn commissions by shopping and referring friends.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/register" className="btn btn-primary btn-xl">
              Get Started Free <ArrowRight style={{ width: '18px', height: '18px' }} />
            </Link>
            <Link to="/products" className="btn btn-secondary btn-xl">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
