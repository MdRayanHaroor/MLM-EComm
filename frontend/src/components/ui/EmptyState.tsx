import { type LucideIcon, Package } from 'lucide-react'
import { Link } from 'react-router-dom'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    to?: string
    onClick?: () => void
  }
}

export default function EmptyState({ icon: Icon = Package, title, description, action }: EmptyStateProps) {
  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      textAlign: 'center',
    }}>
      <div style={{
        width: '80px', height: '80px',
        background: 'var(--gray-100)',
        borderRadius: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1.25rem',
      }}>
        <Icon style={{ width: '36px', height: '36px', color: 'var(--gray-400)' }} />
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', maxWidth: '340px', lineHeight: 1.6, marginBottom: action ? '1.5rem' : 0 }}>
          {description}
        </p>
      )}
      {action && (
        action.to ? (
          <Link to={action.to} className="btn btn-primary btn-sm" style={{ marginTop: description ? 0 : '1.5rem' }}>
            {action.label}
          </Link>
        ) : (
          <button onClick={action.onClick} className="btn btn-primary btn-sm" style={{ marginTop: description ? 0 : '1.5rem' }}>
            {action.label}
          </button>
        )
      )}
    </div>
  )
}
