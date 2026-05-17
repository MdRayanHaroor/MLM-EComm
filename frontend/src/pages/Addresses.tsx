import { useState, useEffect } from 'react'
import { orderService } from '../services/orders'
import { Address } from '../types'
import { MapPin, Plus, Trash2, Star, X, Check } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'

const emptyForm = { full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '', is_default: false }

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ ...emptyForm })
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadAddresses() }, [])

  const loadAddresses = async () => {
    try { setAddresses(await orderService.getAddresses()) }
    catch (e) { console.error(e) }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await orderService.createAddress(formData)
      setShowForm(false)
      setFormData({ ...emptyForm })
      loadAddresses()
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const setDefault = async (id: string) => {
    try { await orderService.updateAddress(id, { is_default: true }); loadAddresses() }
    catch (e) { console.error(e) }
  }

  const deleteAddress = async (id: string) => {
    try { await orderService.deleteAddress(id); loadAddresses() }
    catch (e) { console.error(e) }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Saved Addresses"
        subtitle="Manage your delivery addresses"
        action={
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm">
            <Plus style={{ width: '15px', height: '15px' }} /> Add Address
          </button>
        }
      />

      {/* Add Address Modal */}
      {showForm && (
        <>
          <div className="overlay" onClick={() => setShowForm(false)} />
          <div className="animate-scale-in" style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 60, width: '100%', maxWidth: '520px', padding: '0 1rem', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div className="card">
              <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy-800)' }}>Add New Address</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0.25rem' }}>
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" value={formData.full_name} onChange={set('full_name')} className="form-input" placeholder="Recipient name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="tel" value={formData.phone} onChange={set('phone')} className="form-input" placeholder="Mobile number" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address Line 1</label>
                  <input type="text" value={formData.address_line1} onChange={set('address_line1')} className="form-input" placeholder="House no., Street name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Address Line 2 <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(Optional)</span></label>
                  <input type="text" value={formData.address_line2} onChange={set('address_line2')} className="form-input" placeholder="Landmark, Area" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.875rem' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" value={formData.city} onChange={set('city')} className="form-input" placeholder="City" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input type="text" value={formData.state} onChange={set('state')} className="form-input" placeholder="State" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input type="text" value={formData.pincode} onChange={set('pincode')} className="form-input" placeholder="000000" required maxLength={6} />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.is_default} onChange={e => setFormData(p => ({ ...p, is_default: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: 'var(--amber-500)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Set as default delivery address</span>
                </label>
                <button type="submit" disabled={loading} className="btn btn-primary btn-full">
                  {loading ? 'Saving...' : 'Save Address'}
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Address Cards */}
      {addresses.length === 0 ? (
        <div className="card">
          <EmptyState icon={MapPin} title="No addresses saved"
            description="Add a delivery address to make checkout faster."
            action={{ label: 'Add Address', onClick: () => setShowForm(true) }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {addresses.map(addr => (
            <div key={addr.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              {addr.is_default && (
                <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--amber-500), var(--amber-600))' }} />
              )}
              <div style={{ padding: '1.125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--amber-100)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin style={{ width: '15px', height: '15px', color: 'var(--amber-600)' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy-800)' }}>{addr.full_name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{addr.phone}</p>
                    </div>
                  </div>
                  {addr.is_default && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.68rem', fontWeight: 700, color: 'var(--amber-600)', background: 'var(--amber-100)', padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                      <Star style={{ width: '10px', height: '10px', fill: 'currentColor' }} /> Default
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '0.875rem' }}>
                  <p>{addr.address_line1}</p>
                  {addr.address_line2 && <p>{addr.address_line2}</p>}
                  <p>{addr.city}, {addr.state} – {addr.pincode}</p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!addr.is_default && (
                    <button onClick={() => setDefault(addr.id)} className="btn btn-secondary btn-sm" style={{ gap: '0.25rem', flex: 1, justifyContent: 'center' }}>
                      <Check style={{ width: '13px', height: '13px' }} /> Set Default
                    </button>
                  )}
                  <button onClick={() => deleteAddress(addr.id)} className="btn btn-danger btn-sm" style={{ gap: '0.25rem' }}>
                    <Trash2 style={{ width: '13px', height: '13px' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
