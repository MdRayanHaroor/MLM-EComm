import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin'
import { User } from '../../types'

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers()
      setUsers(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (userId: string, role: string) => {
    await adminService.updateUser(userId, { role })
    loadUsers()
  }

  const updateStatus = async (userId: string, status: string) => {
    await adminService.updateUser(userId, { status })
    loadUsers()
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium">Name</th>
              <th className="text-left p-4 text-sm font-medium">Email</th>
              <th className="text-left p-4 text-sm font-medium">Role</th>
              <th className="text-left p-4 text-sm font-medium">Status</th>
              <th className="text-left p-4 text-sm font-medium">Referral Code</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-4">{user.full_name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="customer">Customer</option>
                    <option value="distributor">Distributor</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <select
                    value={user.status}
                    onChange={(e) => updateStatus(user.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>
                <td className="p-4 font-mono text-sm">{user.referral_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
