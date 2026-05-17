import { useState, useEffect } from 'react'
import { authService } from '../services/auth'
import { useAuthStore } from '../store/authStore'

export default function Profile() {
  const { user, setUser } = useAuthStore()
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await authService.updateProfile({ full_name: fullName, phone })
      setUser({ ...user!, full_name: fullName, phone })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <input type="text" value={user?.role || ''} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          Save Changes
        </button>
        {saved && <p className="text-green-600 text-sm">Profile updated successfully!</p>}
      </form>
    </div>
  )
}
