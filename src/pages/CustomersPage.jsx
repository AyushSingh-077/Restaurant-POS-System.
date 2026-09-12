import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Phone, Mail, MapPin } from 'lucide-react'
import { useRestaurant } from '../useRestaurant'
import { money, initials } from '../utils'
import CustomerModal from '../components/CustomerModal'
import { toast } from 'sonner'

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useRestaurant()
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query) ||
      (c.email && c.email.toLowerCase().includes(query.toLowerCase()))
  )

  const handleSave = (data) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data)
      toast.success(`Updated customer: ${data.name}`)
    } else {
      addCustomer(data)
      toast.success(`Added customer: ${data.name}`)
    }
    setModalOpen(false)
    setEditingCustomer(null)
  }

  const handleDelete = (cust) => {
    if (window.confirm(`Delete customer profile for ${cust.name}?`)) {
      deleteCustomer(cust.id)
      toast.success(`Deleted ${cust.name}`)
    }
  }

  return (
    <div className="page customers-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow accent">Guest Directory</p>
          <h2>Customer Relationship Management</h2>
        </div>
        <button
          className="primary-button"
          onClick={() => {
            setEditingCustomer(null)
            setModalOpen(true)
          }}
        >
          <Plus size={16} /> Add Guest
        </button>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={17} />
            <input
              placeholder="Search by name, phone number, email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="data-table customer-table">
          <div className="data-row data-head">
            <span>Customer Name</span>
            <span>Contact Details</span>
            <span>Address</span>
            <span className="text-center">Total Orders</span>
            <span className="text-right">Total Spend</span>
            <span>Last Visit</span>
            <span className="text-right">Actions</span>
          </div>

          {filteredCustomers.map((cust) => (
            <div className="data-row" key={cust.id}>
              <div className="order-id">
                <span className="order-avatar">{initials(cust.name)}</span>
                <strong>{cust.name}</strong>
              </div>

              <div>
                <span className="d-flex align-center gap-4 text-muted">
                  <Phone size={12} /> {cust.phone}
                </span>
                {cust.email && (
                  <small className="d-flex align-center gap-4 text-muted">
                    <Mail size={12} /> {cust.email}
                  </small>
                )}
              </div>

              <span className="text-muted text-truncate" style={{ maxWidth: 220 }}>
                {cust.address || '—'}
              </span>

              <strong className="text-center">{cust.orders}</strong>
              <strong className="text-right amount-col">{money(cust.spending)}</strong>
              <span className="text-muted">{cust.lastOrder}</span>

              <div className="table-actions text-right">
                <button
                  className="icon-button"
                  title="Edit Customer"
                  onClick={() => {
                    setEditingCustomer(cust)
                    setModalOpen(true)
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="icon-button danger"
                  title="Delete Customer"
                  onClick={() => handleDelete(cust)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <CustomerModal
          customer={editingCustomer}
          onClose={() => {
            setModalOpen(false)
            setEditingCustomer(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
