import { Printer, X, FileText, CheckCircle2, Clock } from 'lucide-react'
import { money } from '../utils'
import { useNavigate } from 'react-router-dom'

export default function OrderDetailsModal({ order, onClose, onPrintKOT, onUpdateStatus }) {
  const navigate = useNavigate()
  if (!order) return null

  const items =
    order.detailItems ||
    order.items?.map((itemStr) => ({
      name: itemStr,
      quantity: 1,
      price: Math.round((order.amount || 0) / (order.items?.length || 1))
    })) ||
    []

  return (
    <div className="modal-backdrop">
      <div className="modal order-details-modal">
        <div className="modal-head">
          <div>
            <p className="eyebrow accent">Order Information</p>
            <h2>{order.id}</h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="order-details-body">
          <div className="order-summary-header">
            <div className="summary-pill">
              <span>Customer</span>
              <strong>{order.customer || 'Walk-in Guest'}</strong>
              <small>{order.customerPhone || '—'}</small>
            </div>
            <div className="summary-pill">
              <span>Type & Table</span>
              <strong>{order.type}</strong>
              <small>Table: {order.table || '—'}</small>
            </div>
            <div className="summary-pill">
              <span>Order Status</span>
              <span className={`status ${order.status?.toLowerCase()}`}>{order.status}</span>
            </div>
            <div className="summary-pill">
              <span>Payment</span>
              <span className={`status ${order.payment?.toLowerCase()}`}>
                {order.payment} ({order.method})
              </span>
            </div>
          </div>

          <div className="order-items-list-container">
            <h4>Item Breakdown</h4>
            <div className="order-items-table">
              <div className="table-row head">
                <span>Item</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Price</span>
                <span className="text-right">Total</span>
              </div>
              {items.map((item, idx) => (
                <div className="table-row" key={idx}>
                  <div>
                    <strong>{item.name}</strong>
                    {item.notes && <span className="item-note">Note: {item.notes}</span>}
                  </div>
                  <span className="text-center">{item.quantity}</span>
                  <span className="text-right">{money(item.price || 0)}</span>
                  <span className="text-right">{money((item.price || 0) * (item.quantity || 1))}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-calc-breakdown">
            <div className="calc-row">
              <span>Subtotal</span>
              <b>{money(order.subtotal || order.amount)}</b>
            </div>
            {order.discount > 0 && (
              <div className="calc-row text-green">
                <span>Discount</span>
                <b>-{money(order.discount)}</b>
              </div>
            )}
            <div className="calc-row">
              <span>GST & Taxes</span>
              <b>{money(order.tax || 0)}</b>
            </div>
            <div className="calc-row grand">
              <span>Grand Total</span>
              <strong>{money(order.amount)}</strong>
            </div>
          </div>

          {/* Quick Status Action Controls */}
          {onUpdateStatus && order.status !== 'Completed' && (
            <div className="status-action-row">
              <span>Transition Status:</span>
              {order.status === 'Pending' && (
                <button
                  className="chip-action-btn cooking"
                  onClick={() => onUpdateStatus(order.id, 'Cooking')}
                >
                  <Clock size={14} /> Mark Cooking
                </button>
              )}
              {order.status === 'Cooking' && (
                <button
                  className="chip-action-btn served"
                  onClick={() => onUpdateStatus(order.id, 'Served')}
                >
                  <CheckCircle2 size={14} /> Mark Served
                </button>
              )}
              {(order.status === 'Served' || order.status === 'Cooking') && (
                <button
                  className="chip-action-btn complete"
                  onClick={() => onUpdateStatus(order.id, 'Completed', 'Paid', 'Cash')}
                >
                  <CheckCircle2 size={14} /> Complete & Pay
                </button>
              )}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="secondary-button" onClick={() => onPrintKOT(order)}>
            <Printer size={15} /> KOT Ticket
          </button>
          <button
            className="primary-button"
            onClick={() => {
              onClose()
              navigate('/billing')
            }}
          >
            <FileText size={15} /> View Tax Invoice
          </button>
        </div>
      </div>
    </div>
  )
}
