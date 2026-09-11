import { Save } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRestaurant } from '../useRestaurant'

export default function SettingsPage() {
    const { settings, setSettings } = useRestaurant()
    const [form, setForm] = useState(settings)
    const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
    const save = () => { setSettings({ ...form, cgstRate: Number(form.cgstRate), sgstRate: Number(form.sgstRate), serviceChargeRate: Number(form.serviceChargeRate) }); toast.success('Settings saved to this device') }
    return <div className="page"><div className="page-heading"><div><p className="eyebrow accent">Workspace preferences</p><h2>Settings</h2></div><button className="primary-button" onClick={save}><Save size={16} /> Save settings</button></div><div className="settings-grid"><div className="panel setting-form"><h3>Restaurant information</h3><div className="settings-fields">{[['restaurantName', 'Restaurant name'], ['address', 'Address'], ['phone', 'Phone'], ['email', 'Email'], ['gstNumber', 'GST number']].map(([key, label]) => <label key={key}>{label}<input value={form[key]} onChange={(event) => update(key, event.target.value)} /></label>)}</div></div><div className="panel setting-form"><h3>Tax and billing settings</h3><div className="settings-fields"><label>CGST rate (%)<input type="number" value={form.cgstRate} onChange={(event) => update('cgstRate', event.target.value)} /></label><label>SGST rate (%)<input type="number" value={form.sgstRate} onChange={(event) => update('sgstRate', event.target.value)} /></label><label>Service charge (%)<input type="number" value={form.serviceChargeRate} onChange={(event) => update('serviceChargeRate', event.target.value)} /></label></div></div></div></div>
}
