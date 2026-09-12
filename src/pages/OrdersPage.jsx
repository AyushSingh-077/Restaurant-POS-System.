import { useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Printer,
  FileText,
  Clock,
  CheckCircle,
  Eye,
  Plus
} from 'lucide-react'
import { useRestaurant } from '../useRestaurant'
import { money } from '../utils'
import OrderDetailsModal from '../components/OrderDetailsModal'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const statusOptions = ['All', 'Pending', 'Cooking', 'Served', 'Completed']
const typeOptions = ['All', 'Dine In', 'Takeaway', 'Delivery']

export default function OrdersPage() {
  const { orders, updateOrderStatus, setActiveKOTOrder, setActiveInvoiceOrder } = useRestaurant()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const navigate = useNavigate()

  const filteredOrders = orders.filter((ord) => {
    const statusMatches = statusFilter === 'All' || ord.status === statusFilter
    const typeMatches = typeFilter === 'All' || ord.type === typeFilter
    const queryMatches =
      ord.id.toLowerCase().includes(query.toLowerCase()) ||
      ord.customer.toLowerCase().includes(query.toLowerCase()) ||
      (ord.table && ord.table.toLowerCase().includes(query.toLowerCase()))
    return statusMatches && typeMatches && queryMatches
  })

  const handlePrintKOT = (ord) => {
    setActiveKOTOrder(ord)
    toast.info(`Generated KOT Ticket for ${ord.id}`)
  }

  const handleViewInvoice = (ord) => {
    setActiveInvoiceOrder(ord)
    navigate('/billing')
  }

  return (
    <div className="page orders-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow accent">Live Service Log</p>
          <h2>Orders Directory</h2>
        </div>
        <button className="primary-button" onClick={() => navigate('/new-order')}>
          <Plus size={16} /> New Order
        </button>
      </div>

      <div className="panel table-panel">
        {/* Toolbar */}
        <div className="table-toolbar flex-wrap">
          <div className="search-box">
            <Search size={17} />
            <input
              placeholder="Search by Order ID, Customer, Table..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-filter"
            >
              <option value="All">All Statuses</option>
              {statusOptions.slice(1).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="select-filter"
            >
              <option value="All">All Order Types</option>
              {typeOptions.slice(1).map((tp) => (
                <option key={tp} value={tp}>
                  {tp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="data-table orders-table">
          <div className="data-row data-head">
            <span>Order ID</span>
            <span>Date & Time</span>
            <span>Customer</span>
            <span>Type / Table</span>
            <span>Total Amount</span>
            <span>Payment</span>
            <span>Order Status</span>
            <span className="text-right">Actions</span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="empty-state">No orders found matching search criteria</div>
          ) : (
            filteredOrders.map((ord) => (
              <div className="data-row" key={ord.id}>
                <strong>{ord.id}</strong>
                <span className="text-muted">{ord.date}</span>
                <div>
                  <strong>{ord.customer}</strong>
                  {ord.customerPhone && <small className="d-block text-muted">{ord.customerPhone}</small>}
                </div>
                <span>
                  {ord.type} {ord.table !== '—' && `(${ord.table})`}
                </span>
                <strong className="amount-col">{money(ord.amount)}</strong>
                <span>
                  <span className={`status ${ord.payment.toLowerCase()}`}>
                    {ord.payment} ({ord.method})
                  </span>
                </span>

                {/* Status Updater Dropdown */}
                <div>
                  <select
                    className={`status-select ${ord.status.toLowerCase()}`}
                    value={ord.status}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Served">Served</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="table-actions text-right">
                  <button
                    className="icon-button"
                    title="View Order Details"
                    onClick={() => setSelectedOrder(ord)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="icon-button"
                    title="Print KOT"
                    onClick={() => handlePrintKOT(ord)}
                  >
                    <Printer size={16} />
                  </button>
                  <button
                    className="icon-button"
                    title="View Tax Invoice"
                    onClick={() => handleViewInvoice(ord)}
                  >
                    <FileText size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onPrintKOT={handlePrintKOT}
          onUpdateStatus={(id, st, paySt, meth) => {
            updateOrderStatus(id, st, paySt, meth)
            setSelectedOrder(null)
            toast.success(`Order ${id} updated to ${st}`)
          }}
        />
      )}
    </div>
  )
}
