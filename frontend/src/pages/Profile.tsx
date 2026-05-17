import { useState } from 'react'
import { authService } from '../services/auth'
import { useAuthStore } from '../store/authStore'
import { User, Mail, Phone, Shield, Check, Edit3 } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'

function getInitials(name?: string) {
  if (!name) return 'U'
  const p = name.trim().split(' ')
  return p.length >= 2 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : p[0][0].toUpperCase()
}

export default function Profile() {
  const { user, setUser } = useAuthStore()
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.updateProfile({ full_name: fullName, phone })
      setUser({ ...user!, full_name: fullName, phone })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Profile" subtitle="Manage your personal information" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>

        {/* Profile Summary Card */}
        <div className="card">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px',
              background: 'linear-gradient(135deg, var(--navy-600), var(--navy-800))',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.75rem', fontWeight: 800, color: '#fff',
            }}>
              {getInitials(user?.full_name)}
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--navy-800)', marginBottom: '0.375rem' }}>
              {user?.full_name || 'User'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <StatusBadge status={user?.role ?? 'customer'} />
              <StatusBadge status={user?.status ?? 'active'} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)' }}>
            {[
              { icon: Mail, label: 'Email', value: user?.email },
              { icon: Phone, label: 'Phone', value: user?.phone || 'Not set' },
              { icon: Shield, label: 'Role', value: user?.role },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none' }}>
                <div style={{ width: '34px', height: '34px', background: 'var(--gray-100)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon style={{ width: '15px', height: '15px', color: 'var(--gray-500)' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <div className="card">
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />
            <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy-800)' }}>Edit Information</h2>
          </div>
          <form onSubmit={handleSave} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="Your full name" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(read-only)</span></label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                <input type="email" value={user?.email || ''} disabled className="form-input" style={{ paddingLeft: '2.5rem', background: 'var(--gray-50)', color: 'var(--gray-400)', cursor: 'not-allowed' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="+91 00000 00000" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(read-only)</span></label>
              <input type="text" value={user?.role || ''} disabled className="form-input" style={{ background: 'var(--gray-50)', color: 'var(--gray-400)', cursor: 'not-allowed', textTransform: 'capitalize' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              {saved && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: 600 }}>
                  <Check style={{ width: '16px', height: '16px' }} /> Saved!
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
