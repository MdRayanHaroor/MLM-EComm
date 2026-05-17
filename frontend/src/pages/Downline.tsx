import { useState, useEffect } from 'react'
import { userService } from '../services/wallet'
import { MatrixNode } from '../types'
import { Users, Award, TrendingUp, ChevronRight } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'

function getInitials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase()
}

const levelColors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#e11d48']
const levelBg    = ['#eff6ff', '#f5f3ff', '#f0fdf4', '#fffbeb', '#fff1f2']

function DownlineNode({ node, depth = 0 }: { node: MatrixNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth === 0)
  const hasChildren = (node.children?.length ?? 0) > 0
  const color = levelColors[depth] ?? '#64748b'
  const bg = levelBg[depth] ?? '#f8fafc'

  return (
    <div style={{ marginLeft: depth > 0 ? '1.5rem' : 0 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.875rem',
        padding: '0.875rem 1rem',
        background: '#fff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        marginBottom: '0.5rem',
        boxShadow: 'var(--shadow-xs)',
        transition: 'box-shadow var(--transition-fast)',
      }}>
        {/* Avatar */}
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: node.full_name ? bg : 'var(--gray-100)',
          border: `2px solid ${node.full_name ? color : 'var(--gray-200)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontWeight: 700, fontSize: '0.8rem', color,
        }}>
          {node.full_name ? getInitials(node.full_name) : '?'}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--navy-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {node.full_name || 'Empty Slot'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              <Award style={{ width: '10px', height: '10px', display: 'inline', marginRight: '2px' }} />
              {node.current_rank || 'Starter'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              <TrendingUp style={{ width: '10px', height: '10px', display: 'inline', marginRight: '2px' }} />
              {node.pv_balance ?? 0} PV
            </span>
          </div>
        </div>

        {/* Level badge */}
        <span style={{
          padding: '0.2rem 0.5rem', borderRadius: '999px',
          background: bg, color, fontSize: '0.68rem', fontWeight: 700,
          flexShrink: 0,
        }}>
          L{node.level}
        </span>

        {/* Active badge */}
        <span style={{
          padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 600,
          background: node.status === 'active' ? 'var(--color-success-bg)' : 'var(--gray-100)',
          color: node.status === 'active' ? 'var(--color-success)' : 'var(--gray-400)',
          flexShrink: 0,
        }}>
          {node.status || 'active'}
        </span>

        {/* Expand toggle */}
        {hasChildren && (
          <button onClick={() => setExpanded(v => !v)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--gray-400)', padding: '0.25rem', flexShrink: 0,
            transition: 'transform var(--transition-fast)',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          }}>
            <ChevronRight style={{ width: '16px', height: '16px' }} />
          </button>
        )}
      </div>

      {expanded && hasChildren && (
        <div style={{ marginBottom: '0.25rem' }}>
          {node.children!.map(child => (
            <DownlineNode key={child.user_id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Downline() {
  const [tree, setTree] = useState<MatrixNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadDownline() }, [])

  const loadDownline = async () => {
    try { setTree(await userService.getDownline()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const totalMembers = (nodes: MatrixNode[]): number =>
    nodes.reduce((acc, n) => acc + 1 + totalMembers(n.children ?? []), 0)

  const count = totalMembers(tree)

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Downline"
        subtitle={count > 0 ? `${count} member${count > 1 ? 's' : ''} in your network` : 'Grow your network by sharing your referral code'}
      />

      {/* Level legend */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {['L1', 'L2', 'L3', 'L4'].map((l, i) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: levelColors[i + 1] }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{l}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '58px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : tree.length === 0 ? (
        <div className="card">
          <EmptyState icon={Users} title="No downline yet"
            description="Share your referral code with friends and family to build your network and start earning commissions." />
        </div>
      ) : (
        <div>
          {tree.map(node => <DownlineNode key={node.user_id} node={node} depth={0} />)}
        </div>
      )}
    </div>
  )
}
