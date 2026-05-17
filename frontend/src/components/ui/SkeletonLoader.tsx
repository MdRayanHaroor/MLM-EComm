interface SkeletonLoaderProps {
  type?: 'product-card' | 'table-row' | 'stat-card' | 'list-item' | 'text'
  count?: number
}

function ProductCardSkeleton() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: '200px', borderRadius: 0 }} />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton" style={{ height: '14px', width: '70%', borderRadius: '4px' }} />
        <div className="skeleton" style={{ height: '14px', width: '45%', borderRadius: '4px' }} />
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
          <div className="skeleton" style={{ height: '20px', width: '60px', borderRadius: '4px' }} />
          <div className="skeleton" style={{ height: '20px', width: '40px', borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton" style={{ height: '5px', width: '100%', borderRadius: 0 }} />
      <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <div className="skeleton" style={{ height: '10px', width: '60%', borderRadius: '4px' }} />
          <div className="skeleton" style={{ height: '32px', width: '50%', borderRadius: '6px' }} />
          <div className="skeleton" style={{ height: '10px', width: '40%', borderRadius: '4px' }} />
        </div>
        <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0 }} />
      </div>
    </div>
  )
}

function TableRowSkeleton() {
  return (
    <tr>
      {[100, 60, 80, 50, 70].map((w, i) => (
        <td key={i} style={{ padding: '0.875rem 1rem' }}>
          <div className="skeleton" style={{ height: '14px', width: `${w}%`, borderRadius: '4px' }} />
        </td>
      ))}
    </tr>
  )
}

function ListItemSkeleton() {
  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '1rem', alignItems: 'center' }}>
      <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '8px', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: '4px' }} />
        <div className="skeleton" style={{ height: '12px', width: '40%', borderRadius: '4px' }} />
      </div>
      <div className="skeleton" style={{ height: '20px', width: '60px', borderRadius: '4px' }} />
    </div>
  )
}

export default function SkeletonLoader({ type = 'product-card', count = 4 }: SkeletonLoaderProps) {
  const items = Array.from({ length: count })

  if (type === 'product-card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {items.map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    )
  }

  if (type === 'stat-card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {items.map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    )
  }

  if (type === 'table-row') {
    return (
      <>
        {items.map((_, i) => <TableRowSkeleton key={i} />)}
      </>
    )
  }

  if (type === 'list-item') {
    return (
      <div className="card" style={{ overflow: 'hidden' }}>
        {items.map((_, i) => (
          <div key={i} style={{ borderBottom: i < count - 1 ? '1px solid var(--color-border)' : 'none' }}>
            <ListItemSkeleton />
          </div>
        ))}
      </div>
    )
  }

  return null
}
