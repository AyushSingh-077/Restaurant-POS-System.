import { useState } from 'react'
import { X, Check } from 'lucide-react'

export default function CustomerModal({ customer, onClose, onSave }) {
  const [name, setName] = useState(customer?.name || '')
  const [phone, setPhone] = useState(customer?.phone || '')
  const [email, setEmail] = useState(customer?.email || '')
  const [address, setAddress] = useState(customer?.address || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !phone) return
    onSave({ name, phone, email, address })
  }

  return (
    <div className="modal-backdrop">
      <div className="modal customer-modal">
        <div className="modal-head">
          <div>
            <p className="eyebrow accent">{customer ? 'Edit Profile' : 'New Guest'}</p>
            <h2>{customer ? `Edit: ${customer.name}` : 'Add New Customer'}</h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <label className="modal-field col-span-2">
              <span>Full Name *</span>
              <input
                required
                type="text"
                placeholder="e.g. Ananya Shah"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="modal-field">
              <span>Phone Number *</span>
              <input
                required
                type="text"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>

            <label className="modal-field">
              <span>Email Address</span>
              <input
                type="email"
                placeholder="ananya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="modal-field col-span-2">
              <span>Delivery / Billing Address</span>
              <input
                type="text"
                placeholder="House/Flat No, Street, Landmark, City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              <Check size={16} /> Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
