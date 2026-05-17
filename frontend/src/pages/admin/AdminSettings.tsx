import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin'
import { CommissionSettings, RankSettings } from '../../types'

export default function AdminSettings() {
  const [commissionSettings, setCommissionSettings] = useState<CommissionSettings | null>(null)
  const [rankSettings, setRankSettings] = useState<RankSettings[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const [comm, ranks] = await Promise.all([
        adminService.getCommissionSettings(),
        adminService.getRankSettings(),
      ])
      setCommissionSettings(comm)
      setRankSettings(ranks)
    } catch (error) {
      console.error(error)
    }
  }

  const saveCommission = async () => {
    if (!commissionSettings) return
    try {
      await adminService.updateCommissionSettings(commissionSettings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error(error)
    }
  }

  if (!commissionSettings) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Commission Percentages</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Direct Referral (%)</label>
            <input
              type="number"
              value={commissionSettings.direct_referral_percent}
              onChange={(e) => setCommissionSettings({ ...commissionSettings, direct_referral_percent: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Level 1 (%)</label>
            <input
              type="number"
              value={commissionSettings.level_1_percent}
              onChange={(e) => setCommissionSettings({ ...commissionSettings, level_1_percent: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Level 2 (%)</label>
            <input
              type="number"
              value={commissionSettings.level_2_percent}
              onChange={(e) => setCommissionSettings({ ...commissionSettings, level_2_percent: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Level 3 (%)</label>
            <input
              type="number"
              value={commissionSettings.level_3_percent}
              onChange={(e) => setCommissionSettings({ ...commissionSettings, level_3_percent: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Level 4 (%)</label>
            <input
              type="number"
              value={commissionSettings.level_4_percent}
              onChange={(e) => setCommissionSettings({ ...commissionSettings, level_4_percent: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
        <button onClick={saveCommission} className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          Save Commission Settings
        </button>
        {saved && <p className="text-green-600 text-sm mt-2">Settings saved!</p>}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Rank Settings</h2>
        <div className="space-y-4">
          {rankSettings.map((rank) => (
            <div key={rank.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <span className="font-semibold w-24">{rank.rank_name}</span>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Required PV</label>
                  <input type="number" defaultValue={rank.required_pv} className="w-full px-3 py-1 border rounded" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Direct Referrals</label>
                  <input type="number" defaultValue={rank.required_direct_referrals} className="w-full px-3 py-1 border rounded" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Multiplier</label>
                  <input type="number" step="0.1" defaultValue={rank.commission_multiplier} className="w-full px-3 py-1 border rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
