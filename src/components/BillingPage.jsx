import { useState } from 'react'
import { Download, Plus, Printer, ChefHat, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useRestaurant } from '../useRestaurant'
import { money } from '../utils'

export default function BillingPage() {
  const { orders, settings, activeInvoiceOrder, setActiveInvoiceOrder } = useRestaurant()
  const navigate = useNavigate()

  // Selected order to preview/print (defaults to active invoice or latest order)
  const [selectedOrderId, setSelectedOrderId] = useState(
    activeInvoiceOrder?.id || orders[0]?.id || ''
  )

  const order = orders.find((o) => o.id === selectedOrderId) || activeInvoiceOrder || orders[0]

  const items =
    order?.detailItems ||
    order?.items?.map((name) => ({
      name,
      quantity: 1,
      price: Math.round((order.amount || 0) / (order.items?.length || 1))
    })) ||
    []

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    if (!order) return
    const textContent = `
================================================
TAX INVOICE - ${settings.restaurantName}
================================================
Address: ${settings.address}
Phone: ${settings.phone}
GSTIN: ${settings.gstNumber}
FSSAI: ${settings.fssaiNumber || '11521008000342'}
------------------------------------------------
Invoice No: INV-${order.id.replace('ORD-', '')}
Date: ${order.date}
Customer: ${order.customer || 'Walk-in Guest'} (${order.customerPhone || 'N/A'})
Order Type: ${order.type} | Table: ${order.table || 'N/A'}
------------------------------------------------
ITEMS:
${items.map((i, idx) => `${idx + 1}. ${i.name} x${i.quantity} @ ₹${i.price} = ₹${i.price * i.quantity}`).join('\n')}
------------------------------------------------
Subtotal: ₹${order.subtotal || order.amount}
Discount: ₹${order.discount || 0}
CGST (${settings.cgstRate}%): ₹${order.cgst || Math.round((order.amount * 0.025))}
SGST (${settings.sgstRate}%): ₹${order.sgst || Math.round((order.amount * 0.025))}
Service Charge: ₹${order.service || 0}
================================================
GRAND TOTAL: ₹${order.amount}
Payment Status: ${order.payment} (${order.method || 'Cash'})
================================================
${settings.receiptFooter || 'Thank you for dining with us!'}
    `

    const blob = new Blob([textContent], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Invoice_${order.id}.txt`
    link.click()
    URL.revokeObjectURL(link.href)
    toast.success(`Downloaded Invoice ${order.id}`)
  }

  return (
    <div className="page billing-page">
      <div className="page-heading no-print">
        <div>
          <p className="eyebrow accent">Financial Desk</p>
          <h2>Billing & Tax Invoices</h2>
        </div>

        <div className="billing-top-actions">
          {/* Order Selector Dropdown */}
          <select
            className="order-select-dropdown"
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id} - {o.customer} ({money(o.amount)})
              </option>
            ))}
          </select>

          <button className="primary-button" onClick={handlePrint}>
            <Printer size={16} /> Print Bill
          </button>
          <button className="secondary-button" onClick={handleDownload}>
            <Download size={16} /> Download Text
          </button>
          <button className="secondary-button" onClick={() => navigate('/new-order')}>
            <Plus size={16} /> New Order
          </button>
        </div>
      </div>

      {!order ? (
        <div className="empty-state">No order available to generate invoice</div>
      ) : (
        <div className="billing-layout">
          {/* Invoice Paper Card */}
          <div className="panel invoice-preview" id="printable-invoice">
            <div className="invoice-brand">
              <div className="brand-mark">
                <ChefHat size={24} />
              </div>
              <div>
                <strong>
                  table<span>wise</span>
                </strong>
                <h3 className="restaurant-title">{settings.restaurantName}</h3>
              </div>
              <span className={`paid-stamp ${order.payment === 'Paid' ? 'paid' : 'unpaid'}`}>
                {order.payment === 'Paid' ? 'PAID' : 'UNPAID'}
              </span>
            </div>

            <div className="restaurant-tax-meta">
              <p>{settings.address}</p>
              <p>
                Phone: {settings.phone} | Email: {settings.email}
              </p>
              <p className="gst-line">
                <strong>GSTIN:</strong> {settings.gstNumber} | <strong>FSSAI:</strong> {settings.fssaiNumber || '11521008000342'}
              </p>
            </div>

            <hr className="invoice-hr" />

            <div className="invoice-meta-grid">
              <div>
                <span>Billed To</span>
                <strong>{order.customer || 'Walk-in Guest'}</strong>
                <p>
                  Table {order.table || '—'} · {order.type}
                </p>
                {order.customerPhone && <p>Phone: {order.customerPhone}</p>}
              </div>

              <div className="text-right">
                <span>Invoice No.</span>
                <strong>INV-{order.id.replace('ORD-', '')}</strong>
                <p>Date: {order.date}</p>
                <p>Payment Mode: {order.method || 'Cash'}</p>
              </div>
            </div>

            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Item Description</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Rate</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{item.name}</strong>
                      {item.notes && <span className="item-note-sub">Instruction: {item.notes}</span>}
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">{money(item.price || 0)}</td>
                    <td className="text-right">{money((item.price || 0) * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-calculation-section">
              <div className="calc-item">
                <span>Subtotal</span>
                <b>{money(order.subtotal || order.amount)}</b>
              </div>

              {order.discount > 0 && (
                <div className="calc-item text-green">
                  <span>Discount</span>
                  <b>-{money(order.discount)}</b>
                </div>
              )}

              <div className="calc-item">
                <span>CGST ({settings.cgstRate}%)</span>
                <b>{money(order.cgst || Math.round(order.amount * 0.025))}</b>
              </div>

              <div className="calc-item">
                <span>SGST ({settings.sgstRate}%)</span>
                <b>{money(order.sgst || Math.round(order.amount * 0.025))}</b>
              </div>

              {order.service > 0 && (
                <div className="calc-item">
                  <span>Service Charge ({settings.serviceChargeRate}%)</span>
                  <b>{money(order.service)}</b>
                </div>
              )}

              <div className="calc-item grand-total-row">
                <span>Grand Total (INR)</span>
                <strong>{money(order.amount)}</strong>
              </div>
            </div>

            <div className="invoice-footer-note">
              <p>{settings.receiptFooter || 'Thank you for dining with us! Please visit again.'}</p>
              <small>This is a computer-generated tax invoice.</small>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
