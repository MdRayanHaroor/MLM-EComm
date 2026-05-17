import { useState, useEffect } from 'react'
import { orderService } from '../services/orders'
import { Address } from '../types'

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false,
  })

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    try {
      const data = await orderService.getAddresses()
      setAddresses(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await orderService.createAddress(formData)
      setShowForm(false)
      setFormData({ full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '', is_default: false })
      loadAddresses()
    } catch (error) {
      console.error(error)
    }
  }

  const setDefault = async (id: string) => {
    try {
      await orderService.updateAddress(id, { is_default: true })
      loadAddresses()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteAddress = async (id: string) => {
    try {
      await orderService.deleteAddress(id)
      loadAddresses()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Addresses</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          {showForm ? 'Cancel' : 'Add Address'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="px-4 py-2 border rounded-lg" required />
            <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="px-4 py-2 border rounded-lg" required />
          </div>
          <input type="text" placeholder="Address Line 1" value={formData.address_line1} onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
          <input type="text" placeholder="Address Line 2 (Optional)" value={formData.address_line2} onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="px-4 py-2 border rounded-lg" required />
            <input type="text" placeholder="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="px-4 py-2 border rounded-lg" required />
            <input type="text" placeholder="Pincode" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} className="px-4 py-2 border rounded-lg" required />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.is_default} onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })} />
            <span className="text-sm">Set as default</span>
          </label>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Save Address</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{addr.full_name}</p>
                <p className="text-sm text-gray-600">{addr.phone}</p>
                <p className="text-sm text-gray-600">{addr.address_line1}</p>
                {addr.address_line2 && <p className="text-sm text-gray-600">{addr.address_line2}</p>}
                <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
              </div>
              <div className="flex gap-2">
                {!addr.is_default && (
                  <button onClick={() => setDefault(addr.id)} className="text-xs text-indigo-600 hover:underline">Set Default</button>
                )}
                <button onClick={() => deleteAddress(addr.id)} className="text-xs text-red-600 hover:underline">Delete</button>
              </div>
            </div>
            {addr.is_default && <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Default</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
