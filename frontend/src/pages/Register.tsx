import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { useAuthStore } from '../store/authStore'
import { Eye, EyeOff, User, Mail, Phone, Gift, Lock, DollarSign, Users, TrendingUp } from 'lucide-react'

export default function Register() {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    referral_code: searchParams.get('ref') || '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirm_password) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      await authService.register({
        full_name: formData.full_name, email: formData.email,
        phone: formData.phone, password: formData.password,
        referral_code: formData.referral_code || undefined,
      })
      const loginData = await authService.login(formData.email, formData.password)
      setToken(loginData.access_token)
      localStorage.setItem('auth_token', loginData.access_token)
      setUser(await authService.getMe())
      navigate('/dashboard')
    } catch (err: unknown) {
      const e2 = err as { response?: { data?: { detail?: string } } }
      setError(e2.response?.data?.detail || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  const benefits = [
    { icon: DollarSign, text: '10% direct referral commission', color: '#059669' },
    { icon: Users, text: 'Earn from 4 levels of downline', color: '#2563eb' },
    { icon: TrendingUp, text: 'Rank up to 2× commission multiplier', color: '#d97706' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      {/* Left Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-700) 60%, #1e3a5f 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden' }} className="register-hero">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(245,158,11,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '999px', padding: '0.35rem 1rem', marginBottom: '1.5rem' }}>
            <Gift style={{ width: '13px', height: '13px', color: 'var(--amber-400)' }} />
            <span style={{ color: 'var(--amber-400)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em' }}>FREE TO JOIN</span>
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>Start Earning Today</h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.9375rem' }}>
            Join thousands of distributors who earn commissions by shopping and referring friends.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', textAlign: 'left' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
                <div style={{ width: '34px', height: '34px', background: `${b.color}20`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <b.icon style={{ width: '17px', height: '17px', color: b.color }} />
                </div>
                <span style={{ fontSize: '0.875rem', color: '#e2e8f0', fontWeight: 500 }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', background: 'var(--color-bg)' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div className="card">
            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-800)', marginBottom: '0.375rem' }}>Create Account</h1>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Fill in the details to join for free</p>
              </div>

              {error && (
                <div style={{ background: 'var(--color-danger-bg)', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-danger)' }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                    <input type="text" value={formData.full_name} onChange={set('full_name')} className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="Your full name" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                    <input type="email" value={formData.email} onChange={set('email')} className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="you@example.com" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                    <input type="tel" value={formData.phone} onChange={set('phone')} className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="+91 00000 00000" required />
                  </div>
                </div>

                {/* Referral code */}
                <div className="form-group">
                  <label className="form-label">Referral Code <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(Optional)</span></label>
                  <div style={{ position: 'relative' }}>
                    <Gift style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: formData.referral_code ? 'var(--amber-500)' : 'var(--gray-400)', pointerEvents: 'none' }} />
                    <input type="text" value={formData.referral_code} onChange={set('referral_code')} className="form-input" style={{ paddingLeft: '2.5rem', borderColor: formData.referral_code ? 'var(--amber-400)' : undefined, background: formData.referral_code ? 'var(--amber-100)' : '#fff' }} placeholder="Sponsor's referral code" />
                  </div>
                  {formData.referral_code && <p style={{ fontSize: '0.72rem', color: 'var(--amber-600)', marginTop: '0.25rem', fontWeight: 500 }}>✓ You'll be placed in your sponsor's network</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                    <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={set('password')} className="form-input" style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} placeholder="Min. 6 characters" required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: 0 }}>
                      {showPassword ? <EyeOff style={{ width: '15px', height: '15px' }} /> : <Eye style={{ width: '15px', height: '15px' }} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                    <input type="password" value={formData.confirm_password} onChange={set('confirm_password')} className="form-input"
                      style={{ paddingLeft: '2.5rem', borderColor: formData.confirm_password && formData.confirm_password !== formData.password ? 'var(--color-danger)' : undefined }}
                      placeholder="Re-enter password" required minLength={6} />
                  </div>
                  {formData.confirm_password && formData.confirm_password !== formData.password && (
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-danger)', marginTop: '0.25rem' }}>Passwords don't match</p>
                  )}
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ marginTop: '0.25rem' }}>
                  {loading ? 'Creating account...' : 'Create Free Account'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--color-info)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .register-hero { display: none !important; } }`}</style>
    </div>
  )
}
