import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  gradient: 'blue' | 'green' | 'amber' | 'purple' | 'teal' | 'rose'
  trend?: { value: string; positive: boolean }
}

const gradients = {
  blue:   'stat-gradient-blue',
  green:  'stat-gradient-green',
  amber:  'stat-gradient-amber',
  purple: 'stat-gradient-purple',
  teal:   'stat-gradient-teal',
  rose:   'stat-gradient-rose',
}

export default function StatCard({ title, value, subtitle, icon: Icon, gradient, trend }: StatCardProps) {
  return (
    <div className="card animate-fade-in" style={{ overflow: 'hidden' }}>
      <div className={gradients[gradient]} style={{
        height: '5px',
        width: '100%',
      }} />
      <div className="card-body" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
              {title}
            </p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {value}
            </p>
            {subtitle && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{subtitle}</p>
            )}
            {trend && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginTop: '0.5rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                background: trend.positive ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: trend.positive ? 'var(--color-success)' : 'var(--color-danger)',
              }}>
                {trend.positive ? '↑' : '↓'} {trend.value}
              </div>
            )}
          </div>
          <div className={gradients[gradient]} style={{
            width: '48px', height: '48px',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            opacity: 0.9,
          }}>
            <Icon style={{ width: '22px', height: '22px', color: '#fff' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
