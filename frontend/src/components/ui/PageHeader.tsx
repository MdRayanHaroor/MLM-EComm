import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              {i > 0 && <ChevronRight style={{ width: '13px', height: '13px', color: 'var(--gray-400)' }} />}
              {crumb.to ? (
                <Link to={crumb.to} style={{
                  fontSize: '0.8rem', color: 'var(--color-text-muted)',
                  textDecoration: 'none', fontWeight: 500,
                  transition: 'color var(--transition-fast)',
                }}
                  onMouseOver={e => (e.currentTarget.style.color = 'var(--navy-700)')}
                  onMouseOut={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
                  {crumb.label}
                </Link>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: subtitle ? '0.25rem' : 0 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{subtitle}</p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    </div>
  )
}
