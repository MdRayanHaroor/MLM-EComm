import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin'
import { CommissionSettings, RankSettings } from '../../types'
import { Check, DollarSign, Award, Settings } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

type Tab = 'commissions' | 'ranks'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<Tab>('commissions')
  const [commissionSettings, setCommissionSettings] = useState<CommissionSettings | null>(null)
  const [rankSettings, setRankSettings] = useState<RankSettings[]>([])
  const [savedComm, setSavedComm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadSettings() }, [])

  const loadSettings = async () => {
    try {
      const [comm, ranks] = await Promise.all([adminService.getCommissionSettings(), adminService.getRankSettings()])
      setCommissionSettings(comm)
      setRankSettings(ranks)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const saveCommission = async () => {
    if (!commissionSettings) return
    setSaving(true)
    try {
      await adminService.updateCommissionSettings(commissionSettings)
      setSavedComm(true)
      setTimeout(() => setSavedComm(false), 2500)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const tabs: { id: Tab; label: string; icon: typeof DollarSign }[] = [
    { id: 'commissions', label: 'Commission Settings', icon: DollarSign },
    { id: 'ranks', label: 'Rank Settings', icon: Award },
  ]

  const commFields = [
    { key: 'direct_referral_percent', label: 'Direct Referral', desc: 'Commission % on direct referral orders' },
    { key: 'level_1_percent',         label: 'Level 1',         desc: "Commission % from sponsor's sponsor" },
    { key: 'level_2_percent',         label: 'Level 2',         desc: '3rd upline commission %' },
    { key: 'level_3_percent',         label: 'Level 3',         desc: '4th upline commission %' },
    { key: 'level_4_percent',         label: 'Level 4',         desc: '5th upline commission %' },
  ] as const

  return (
    <div className="animate-fade-in">
      <PageHeader title="Platform Settings" subtitle="Configure commission rates and rank requirements"
        action={<Settings style={{ width: '20px', height: '20px', color: 'var(--color-text-muted)' }} />}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1px' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.625rem 1rem',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: activeTab === tab.id ? 700 : 500,
            color: activeTab === tab.id ? 'var(--navy-800)' : 'var(--color-text-muted)',
            borderBottom: `2px solid ${activeTab === tab.id ? 'var(--amber-500)' : 'transparent'}`,
            transition: 'all var(--transition-fast)',
            marginBottom: '-1px',
          }}>
            <tab.icon style={{ width: '15px', height: '15px' }} />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : activeTab === 'commissions' && commissionSettings ? (
        <div className="card">
          <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy-800)' }}>Commission Percentages</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Set the commission % for each level in the MLM hierarchy</p>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {commFields.map(field => (
                <div key={field.key} className="card" style={{ padding: '1rem', border: '1.5px solid var(--gray-200)' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.5rem' }}>
                    {field.label}
                  </label>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.625rem' }}>{field.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <input
                      type="number" step="0.1" min="0" max="100"
                      value={(commissionSettings as any)[field.key] as number}
                      onChange={e => setCommissionSettings({ ...commissionSettings, [field.key]: parseFloat(e.target.value) })}
                      className="form-input"
                      style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>%</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={saveCommission} disabled={saving} className="btn btn-primary">
                {saving ? 'Saving...' : 'Save Commission Settings'}
              </button>
              {savedComm && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: 600 }}>
                  <Check style={{ width: '16px', height: '16px' }} /> Saved!
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'ranks' ? (
        <div className="card">
          <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy-800)' }}>Rank Requirements</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Configure PV, referral, and multiplier requirements for each rank</p>
          </div>
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {rankSettings.map(rank => (
              <div key={rank.id} style={{
                display: 'grid', gridTemplateColumns: 'minmax(100px, 1fr) repeat(3, minmax(120px, 1fr))',
                gap: '0.875rem', alignItems: 'center',
                padding: '1rem', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-md)',
                background: '#fff',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award style={{ width: '16px', height: '16px', color: 'var(--amber-500)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-800)' }}>{rank.rank_name}</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Required PV</label>
                  <input type="number" defaultValue={rank.required_pv} className="form-input" style={{ padding: '0.4rem 0.625rem' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Direct Referrals</label>
                  <input type="number" defaultValue={rank.required_direct_referrals} className="form-input" style={{ padding: '0.4rem 0.625rem' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Commission ×</label>
                  <input type="number" step="0.05" defaultValue={rank.commission_multiplier} className="form-input" style={{ padding: '0.4rem 0.625rem' }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: '0.5rem' }}>
              <button className="btn btn-primary">Save Rank Settings</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
