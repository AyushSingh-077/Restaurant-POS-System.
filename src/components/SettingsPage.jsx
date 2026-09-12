import { useState } from 'react'
import { Save, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useRestaurant } from '../useRestaurant'

export default function SettingsPage() {
  const { settings, setSettings, resetDemoData } = useRestaurant()
  const [form, setForm] = useState(settings)

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSettings({
      ...form,
      cgstRate: Number(form.cgstRate) || 0,
      sgstRate: Number(form.sgstRate) || 0,
      serviceChargeRate: Number(form.serviceChargeRate) || 0
    })
    toast.success('Restaurant settings saved successfully!')
  }

  const handleReset = () => {
    if (window.confirm('Reset all menu, orders, tables, customers & settings to initial demo data?')) {
      resetDemoData()
      toast.success('System reset to default demo state.')
      window.location.reload()
    }
  }

  return (
    <div className="page settings-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow accent">System Preferences</p>
          <h2>Restaurant Settings</h2>
        </div>
        <button className="primary-button" onClick={handleSave}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      <form onSubmit={handleSave} className="settings-grid">
        {/* Restaurant Identity */}
        <div className="panel setting-card-panel">
          <h3>Restaurant Profile & Branding</h3>
          <div className="settings-fields">
            <label>
              <span>Restaurant Name</span>
              <input
                type="text"
                value={form.restaurantName}
                onChange={(e) => handleChange('restaurantName', e.target.value)}
              />
            </label>

            <label>
              <span>Tagline / Subtitle</span>
              <input
                type="text"
                value={form.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
              />
            </label>

            <label>
              <span>Full Address</span>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </label>

            <label>
              <span>Phone Numbers</span>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </label>

            <label>
              <span>Email Address</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* GST & Tax Settings */}
        <div className="panel setting-card-panel">
          <h3>Taxation & Legal Registration</h3>
          <div className="settings-fields">
            <label>
              <span>GSTIN Number</span>
              <input
                type="text"
                value={form.gstNumber}
                onChange={(e) => handleChange('gstNumber', e.target.value)}
              />
            </label>

            <label>
              <span>FSSAI License Number</span>
              <input
                type="text"
                value={form.fssaiNumber || ''}
                onChange={(e) => handleChange('fssaiNumber', e.target.value)}
              />
            </label>

            <div className="form-row-2">
              <label>
                <span>CGST Rate (%)</span>
                <input
                  type="number"
                  step="0.1"
                  value={form.cgstRate}
                  onChange={(e) => handleChange('cgstRate', e.target.value)}
                />
              </label>

              <label>
                <span>SGST Rate (%)</span>
                <input
                  type="number"
                  step="0.1"
                  value={form.sgstRate}
                  onChange={(e) => handleChange('sgstRate', e.target.value)}
                />
              </label>
            </div>

            <div className="service-charge-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.enableServiceCharge !== false}
                  onChange={(e) => handleChange('enableServiceCharge', e.target.checked)}
                />
                <span>Enable Service Charge</span>
              </label>

              {form.enableServiceCharge !== false && (
                <label style={{ flex: 1 }}>
                  <span>Service Charge Rate (%)</span>
                  <input
                    type="number"
                    step="0.5"
                    value={form.serviceChargeRate}
                    onChange={(e) => handleChange('serviceChargeRate', e.target.value)}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Receipt & Invoice Settings */}
        <div className="panel setting-card-panel col-span-2">
          <h3>Receipt & Invoice Customization</h3>
          <div className="settings-fields">
            <label>
              <span>Receipt Footer Message</span>
              <input
                type="text"
                value={form.receiptFooter || ''}
                onChange={(e) => handleChange('receiptFooter', e.target.value)}
                placeholder="Thank you for dining with us! Please visit again."
              />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="panel setting-card-panel danger-panel col-span-2">
          <div className="danger-content">
            <div>
              <h3><AlertTriangle size={18} /> Reset Demo Data</h3>
              <p>Wipe custom edits and restore original 25+ menu items, 12 tables, and sample orders.</p>
            </div>
            <button type="button" className="secondary-button danger-btn" onClick={handleReset}>
              <RefreshCw size={15} /> Reset Demo Data
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
