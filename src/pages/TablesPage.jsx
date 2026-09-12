import { useState } from 'react'
import { Plus, Users, Utensils, Clock, AlertCircle } from 'lucide-react'
import { useRestaurant } from '../useRestaurant'
import { money } from '../utils'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import TableModal from '../components/TableModal'

const sections = ['All', 'Main Hall', 'AC Section', 'Rooftop', 'VIP Lounge']

export default function TablesPage() {
  const { tables, updateTableStatus, addTable, setSelectedTable, setOrderType } = useRestaurant()
  const [selectedSection, setSelectedSection] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [tableModalOpen, setTableModalOpen] = useState(false)
  const navigate = useNavigate()

  const filteredTables = tables.filter((t) => {
    const sectionMatches = selectedSection === 'All' || t.section === selectedSection
    const statusMatches = statusFilter === 'All' || t.status === statusFilter
    return sectionMatches && statusMatches
  })

  const availableCount = tables.filter((t) => t.status === 'Available').length
  const occupiedCount = tables.filter((t) => t.status === 'Occupied').length
  const reservedCount = tables.filter((t) => t.status === 'Reserved').length
  const billingCount = tables.filter((t) => t.status === 'Billing').length

  const handleStartOrder = (tableName) => {
    setSelectedTable(tableName)
    setOrderType('Dine In')
    navigate('/new-order')
    toast.info(`Creating order for table ${tableName}`)
  }

  const handleStatusChange = (table, newStatus) => {
    updateTableStatus(table.id, newStatus)
    toast.success(`Table ${table.name} set to ${newStatus}`)
  }

  return (
    <div className="page tables-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow accent">Floor Plan & Seating</p>
          <h2>Table Management</h2>
        </div>
        <button className="primary-button" onClick={() => setTableModalOpen(true)}>
          <Plus size={16} /> Add Table
        </button>
      </div>

      {/* Filter Strip & Section Tabs */}
      <div className="table-controls-bar">
        <div className="section-tabs">
          {sections.map((sec) => (
            <button
              key={sec}
              className={`section-tab ${selectedSection === sec ? 'active' : ''}`}
              onClick={() => setSelectedSection(sec)}
            >
              {sec}
            </button>
          ))}
        </div>

        <div className="status-legend-bar">
          <button
            className={`legend-chip ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => setStatusFilter('All')}
          >
            All <b>{tables.length}</b>
          </button>
          <button
            className={`legend-chip ${statusFilter === 'Available' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Available')}
          >
            <i className="key-dot available" /> Available <b>{availableCount}</b>
          </button>
          <button
            className={`legend-chip ${statusFilter === 'Occupied' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Occupied')}
          >
            <i className="key-dot occupied" /> Occupied <b>{occupiedCount}</b>
          </button>
          <button
            className={`legend-chip ${statusFilter === 'Reserved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Reserved')}
          >
            <i className="key-dot reserved" /> Reserved <b>{reservedCount}</b>
          </button>
          <button
            className={`legend-chip ${statusFilter === 'Billing' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Billing')}
          >
            <i className="key-dot billing" /> Billing <b>{billingCount}</b>
          </button>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="table-grid">
        {filteredTables.map((table) => (
          <div
            className={`restaurant-table-card ${table.status.toLowerCase()}`}
            key={table.id}
          >
            <div className="table-card-header">
              <div>
                <span className="table-identifier">{table.name}</span>
                <span className="table-section-label">{table.section}</span>
              </div>
              <span className={`status ${table.status.toLowerCase()}`}>{table.status}</span>
            </div>

            <div className="table-card-body">
              <div className="table-capacity">
                <Users size={16} />
                <span>{table.capacity} Seats</span>
              </div>
              {table.server && <small className="server-name">Waiter: {table.server}</small>}
              {table.amount > 0 && <div className="table-bill-amount">{money(table.amount)}</div>}
            </div>

            <div className="table-card-actions">
              {table.status === 'Available' && (
                <>
                  <button
                    className="primary-button compact-btn"
                    onClick={() => handleStartOrder(table.name)}
                  >
                    <Utensils size={14} /> Start Order
                  </button>
                  <button
                    className="secondary-button compact-btn"
                    onClick={() => handleStatusChange(table, 'Reserved')}
                  >
                    Reserve
                  </button>
                </>
              )}

              {table.status === 'Occupied' && (
                <>
                  <button
                    className="secondary-button compact-btn"
                    onClick={() => handleStartOrder(table.name)}
                  >
                    Add Items
                  </button>
                  <button
                    className="secondary-button compact-btn"
                    onClick={() => handleStatusChange(table, 'Billing')}
                  >
                    Bill Table
                  </button>
                </>
              )}

              {table.status === 'Reserved' && (
                <>
                  <button
                    className="primary-button compact-btn"
                    onClick={() => handleStatusChange(table, 'Occupied')}
                  >
                    Occupy
                  </button>
                  <button
                    className="secondary-button compact-btn"
                    onClick={() => handleStatusChange(table, 'Available')}
                  >
                    Cancel
                  </button>
                </>
              )}

              {table.status === 'Billing' && (
                <button
                  className="primary-button compact-btn"
                  onClick={() => handleStatusChange(table, 'Available')}
                >
                  Clear & Release Table
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {tableModalOpen && (
        <TableModal
          onClose={() => setTableModalOpen(false)}
          onSave={(data) => {
            addTable(data)
            setTableModalOpen(false)
            toast.success(`Table ${data.name || 'new'} added successfully`)
          }}
        />
      )}
    </div>
  )
}
