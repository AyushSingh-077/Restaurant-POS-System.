import { Clock, ChefHat, Printer, X } from 'lucide-react'

export default function KOTModal({ order, onClose }) {
  if (!order) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal kot-modal">
        <div className="modal-head no-print">
          <div>
            <p className="eyebrow accent">Kitchen Order Ticket</p>
            <h2>KOT #{order.id}</h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div className="kot-ticket-content" id="printable-kot">
          <div className="kot-header">
            <div className="kot-badge">
              <ChefHat size={20} /> KITCHEN ORDER TICKET
            </div>
            <h3>KOT #{order.id}</h3>
            <p className="kot-meta">
              <span><strong>Type:</strong> {order.type}</span>
              <span><strong>Table:</strong> {order.table || 'N/A'}</span>
            </p>
            <p className="kot-time">
              <Clock size={12} /> {order.date || new Date().toLocaleString()}
            </p>
          </div>

          <hr className="kot-divider" />

          <table className="kot-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
              </tr>
            </thead>
            <tbody>
              {order.detailItems?.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{item.name}</strong>
                    {item.notes && <p className="kot-item-note">Note: {item.notes}</p>}
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                    {item.quantity}
                  </td>
                </tr>
              )) ||
                order.items?.map((itemStr, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{itemStr}</strong>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>1</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <hr className="kot-divider" />

          <div className="kot-footer">
            <p><strong>Instructions:</strong> Please prepare immediately with high priority.</p>
            <div className="kot-signatures">
              <span>Server: {order.server || 'Waitstaff'}</span>
              <span>Chef Sign: ________</span>
            </div>
          </div>
        </div>

        <div className="modal-actions no-print">
          <button className="secondary-button" onClick={onClose}>
            Close
          </button>
          <button className="primary-button" onClick={handlePrint}>
            <Printer size={16} /> Print KOT Ticket
          </button>
        </div>
      </div>
    </div>
  )
}
