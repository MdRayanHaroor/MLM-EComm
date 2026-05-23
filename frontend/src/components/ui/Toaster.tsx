import { useToastStore, Toast } from '../../store/toastStore'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const ICONS = {
  success: CheckCircle2,
  error:   AlertCircle,
  info:    Info,
  warning: AlertTriangle,
}

const COLORS: Record<Toast['type'], { bg: string; border: string; icon: string; title: string }> = {
  success: { bg: '#f0fdf4', border: '#86efac', icon: '#16a34a', title: '#15803d' },
  error:   { bg: '#fef2f2', border: '#fca5a5', icon: '#dc2626', title: '#b91c1c' },
  info:    { bg: '#eff6ff', border: '#93c5fd', icon: '#2563eb', title: '#1d4ed8' },
  warning: { bg: '#fffbeb', border: '#fcd34d', icon: '#d97706', title: '#b45309' },
}

function ToastItem({ toast }: { toast: Toast }) {
  const remove = useToastStore((s) => s.remove)
  const c = COLORS[toast.type]
  const Icon = ICONS[toast.type]

  return (
    <div
      className="animate-slide-in-right"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '10px',
        padding: '0.875rem 1rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        maxWidth: '360px',
        width: '100%',
        pointerEvents: 'all',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '4px', background: c.icon, borderRadius: '10px 0 0 10px',
      }} />

      <Icon style={{ width: '18px', height: '18px', color: c.icon, flexShrink: 0, marginTop: '1px' }} />

      <p style={{
        flex: 1, fontSize: '0.875rem', fontWeight: 500,
        color: c.title, lineHeight: 1.45, marginTop: '1px',
      }}>
        {toast.message}
      </p>

      <button
        onClick={() => remove(toast.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: c.icon, opacity: 0.6, padding: '1px', flexShrink: 0,
          display: 'flex', alignItems: 'center',
        }}
        aria-label="Dismiss"
      >
        <X style={{ width: '15px', height: '15px' }} />
      </button>
    </div>
  )
}

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  if (!toasts.length) return null

  return (
    <div
      style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: '0.625rem',
        pointerEvents: 'none',
      }}
      aria-live="assertive"
    >
      {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  )
}
