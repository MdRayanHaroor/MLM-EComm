import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin'
import { User } from '../../types'
import { Search, Users } from 'lucide-react'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import PageHeader from '../../components/ui/PageHeader'

function getInitials(name?: string) {
  if (!name) return 'U'
  const p = name.trim().split(' ')
  return p.length >= 2 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : p[0][0].toUpperCase()
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    try { setUsers(await adminService.getUsers()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const updateRole = async (userId: string, role: string) => {
    await adminService.updateUser(userId, { role }); loadUsers()
  }

  const updateStatus = async (userId: string, status: string) => {
    await adminService.updateUser(userId, { status }); loadUsers()
  }

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      <PageHeader title="Users" subtitle={`${users.length} registered users`} />

      <div style={{ marginBottom: '1.25rem', position: 'relative', maxWidth: '400px' }}>
        <Search style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="form-input" style={{ paddingLeft: '2.5rem' }} />
      </div>

      <div className="table-wrapper">
        {loading ? (
          <table className="data-table"><tbody><SkeletonLoader type="table-row" count={7} /></tbody></table>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No users found" />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Referral Code</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--navy-600), var(--navy-800))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0,
                      }}>
                        {getInitials(user.full_name)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.full_name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{user.email}</td>
                  <td>
                    <code style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: 'var(--gray-100)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {user.referral_code}
                    </code>
                  </td>
                  <td><StatusBadge status={user.role ?? 'customer'} /></td>
                  <td><StatusBadge status={user.status ?? 'active'} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <select value={user.role} onChange={e => updateRole(user.id, e.target.value)}
                        className="form-select" style={{ width: 'auto', fontSize: '0.75rem', padding: '0.25rem 1.75rem 0.25rem 0.5rem' }}>
                        <option value="customer">Customer</option>
                        <option value="distributor">Distributor</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                      <select value={user.status} onChange={e => updateStatus(user.id, e.target.value)}
                        className="form-select" style={{ width: 'auto', fontSize: '0.75rem', padding: '0.25rem 1.75rem 0.25rem 0.5rem' }}>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
