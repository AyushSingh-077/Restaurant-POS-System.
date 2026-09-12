import { useState } from 'react'
import { X, Check } from 'lucide-react'

const sectionsList = ['Main Hall', 'AC Section', 'Rooftop', 'VIP Lounge']

export default function TableModal({ table, onClose, onSave }) {
  const [name, setName] = useState(table?.name || '')
  const [capacity, setCapacity] = useState(table?.capacity || 4)
  const [section, setSection] = useState(table?.section || 'Main Hall')
  const [server, setServer] = useState(table?.server || 'Staff')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ name, capacity: Number(capacity), section, server })
  }

  return (
    <div className="modal-backdrop">
      <div className="modal table-modal">
        <div className="modal-head">
          <div>
            <p className="eyebrow accent">{table ? 'Edit Table' : 'New Table'}</p>
            <h2>{table ? `Edit Table ${table.name}` : 'Add New Table'}</h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <label className="modal-field">
              <span>Table Identifier / Number</span>
              <input
                type="text"
                placeholder="e.g. T-13"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="modal-field">
              <span>Seating Capacity</span>
              <input
                type="number"
                min="1"
                max="20"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </label>

            <label className="modal-field">
              <span>Floor Section</span>
              <select value={section} onChange={(e) => setSection(e.target.value)}>
                {sectionsList.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </label>

            <label className="modal-field">
              <span>Assigned Waiter / Server</span>
              <input
                type="text"
                placeholder="Server name"
                value={server}
                onChange={(e) => setServer(e.target.value)}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              <Check size={16} /> Save Table
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
