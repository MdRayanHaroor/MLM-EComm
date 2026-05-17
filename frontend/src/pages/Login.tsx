import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { useAuthStore } from '../store/authStore'
import { Eye, EyeOff, Lock, Mail, Zap, Star } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authService.login(email, password)
      setToken(data.access_token)
      localStorage.setItem('auth_token', data.access_token)
      const user = await authService.getMe()
      setUser(user)
      navigate('/dashboard')
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detail?: string } } }
      setError(axiosError.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      {/* Left Hero Panel */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-700) 60%, #1e3a5f 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden',
      }} className="login-hero">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(245,158,11,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap style={{ width: '30px', height: '30px', color: '#1a1a1a' }} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
            Welcome Back to MLM Store
          </h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.9375rem' }}>
            Sign in to access your dashboard, track orders, manage your downline and check your earnings.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              'Track your commissions in real-time',
              'View your downline network tree',
              'Manage wallet and withdrawals',
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: '20px', height: '20px', background: 'rgba(245,158,11,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'var(--amber-400)', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>
                </div>
                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginTop: '2.5rem' }}>
            {[1,2,3,4,5].map(i => <Star key={i} style={{ width: '14px', height: '14px', color: 'var(--amber-400)', fill: 'currentColor' }} />)}
            <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '0.5rem' }}>10,000+ happy members</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', background: 'var(--color-bg)' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div className="card">
            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.75rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-800)', marginBottom: '0.375rem' }}>Sign In</h1>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Enter your credentials to continue</p>
              </div>

              {error && (
                <div style={{ background: 'var(--color-danger-bg)', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock style={{ width: '15px', height: '15px', color: 'var(--color-danger)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-danger)' }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="you@example.com" required />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Password</label>
                    <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--color-info)', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="form-input" style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} placeholder="Your password" required />
                    <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: 0 }}>
                      {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ marginTop: '0.25rem' }}>
                  {loading ? <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#1a1a1a', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Signing in...</> : 'Sign In'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'var(--color-info)', fontWeight: 600, textDecoration: 'none' }}>Create one free</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .login-hero { display: none !important; } }
      `}</style>
    </div>
  )
}
