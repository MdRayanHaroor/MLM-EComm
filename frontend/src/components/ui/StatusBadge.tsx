type Status =
  | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  | 'paid' | 'failed' | 'refunded'
  | 'active' | 'suspended'
  | 'approved' | 'rejected' | 'completed'
  | 'credited' | 'reversed'
  | 'distributor' | 'customer' | 'admin' | 'super_admin'
  | string

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:      { label: 'Pending',     className: 'badge badge-warning' },
  confirmed:    { label: 'Confirmed',   className: 'badge badge-info' },
  processing:   { label: 'Processing',  className: 'badge badge-info' },
  shipped:      { label: 'Shipped',     className: 'badge badge-amber' },
  delivered:    { label: 'Delivered',   className: 'badge badge-success' },
  cancelled:    { label: 'Cancelled',   className: 'badge badge-danger' },
  returned:     { label: 'Returned',    className: 'badge badge-neutral' },
  paid:         { label: 'Paid',        className: 'badge badge-success' },
  failed:       { label: 'Failed',      className: 'badge badge-danger' },
  refunded:     { label: 'Refunded',    className: 'badge badge-neutral' },
  active:       { label: 'Active',      className: 'badge badge-success' },
  suspended:    { label: 'Suspended',   className: 'badge badge-danger' },
  approved:     { label: 'Approved',    className: 'badge badge-success' },
  rejected:     { label: 'Rejected',    className: 'badge badge-danger' },
  completed:    { label: 'Completed',   className: 'badge badge-success' },
  credited:     { label: 'Credited',    className: 'badge badge-success' },
  reversed:     { label: 'Reversed',    className: 'badge badge-danger' },
  distributor:  { label: 'Distributor', className: 'badge badge-navy' },
  customer:     { label: 'Customer',    className: 'badge badge-info' },
  admin:        { label: 'Admin',       className: 'badge badge-amber' },
  super_admin:  { label: 'Super Admin', className: 'badge badge-amber' },
}

interface StatusBadgeProps {
  status: Status
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: 'badge badge-neutral' }
  return (
    <span className={`${config.className} ${className ?? ''}`}>
      {config.label}
    </span>
  )
}
