import { useState } from 'react'
import { Check, CreditCard, Banknote, QrCode, X } from 'lucide-react'
import { money } from '../utils'

export default function PaymentModal({ total, onClose, onPay, settings }) {
  const [method, setMethod] = useState('Cash')
  const [received, setReceived] = useState(Math.ceil(total))
  const [txnRef, setTxnRef] = useState('')

  const changeToReturn = Math.max(0, received - total)

  const handleConfirm = () => {
    onPay(method)
  }

  return (
    <div className="modal-backdrop">
      <div className="modal payment-modal">
        <div className="modal-head">
          <div>
            <p className="eyebrow accent">Checkout & Payment</p>
            <h2>Collect Payment</h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="amount-due-banner">
          <span>Total Amount Payable</span>
          <strong>{money(total)}</strong>
        </div>

        <div className="payment-method-selector">
          <button
            className={`pay-tab ${method === 'Cash' ? 'active' : ''}`}
            onClick={() => setMethod('Cash')}
          >
            <Banknote size={18} /> Cash
          </button>
          <button
            className={`pay-tab ${method === 'UPI' ? 'active' : ''}`}
            onClick={() => setMethod('UPI')}
          >
            <QrCode size={18} /> UPI / QR
          </button>
          <button
            className={`pay-tab ${method === 'Card' ? 'active' : ''}`}
            onClick={() => setMethod('Card')}
          >
            <CreditCard size={18} /> Card
          </button>
        </div>

        <div className="payment-details-body">
          {method === 'Cash' && (
            <div className="cash-section">
              <label className="modal-field">
                <span>Amount Tendered / Received</span>
                <input
                  type="number"
                  min="0"
                  value={received}
                  onChange={(e) => setReceived(Number(e.target.value) || 0)}
                  placeholder="Enter cash amount"
                />
              </label>

              <div className="quick-amount-buttons">
                {[Math.ceil(total), Math.ceil(total / 100) * 100, Math.ceil(total / 500) * 500, Math.ceil(total / 1000) * 1000]
                  .filter((v, i, a) => a.indexOf(v) === i && v >= total)
                  .map((val) => (
                    <button
                      key={val}
                      type="button"
                      className="chip-btn"
                      onClick={() => setReceived(val)}
                    >
                      {money(val)}
                    </button>
                  ))}
              </div>

              <div className="change-return-box">
                <span>Change to Return to Customer</span>
                <strong className={changeToReturn > 0 ? 'highlight' : ''}>
                  {money(changeToReturn)}
                </strong>
              </div>
            </div>
          )}

          {method === 'UPI' && (
            <div className="upi-section">
              <div className="qr-container">
                <div className="qr-code-box">
                  {/* SVG generated QR representation */}
                  <svg viewBox="0 0 100 100" width="120" height="120">
                    <rect width="100" height="100" fill="#ffffff" />
                    <path d="M10 10 h30 v30 h-30 z M15 15 v20 h20 v-20 z M20 20 h10 v10 h-10 z" fill="#147d65" />
                    <path d="M60 10 h30 v30 h-30 z M65 15 v20 h20 v-20 z M70 20 h10 v10 h-10 z" fill="#147d65" />
                    <path d="M10 60 h30 v30 h-30 z M15 65 v20 h20 v-20 z M20 70 h10 v10 h-10 z" fill="#147d65" />
                    <path d="M45 15 h10 v10 h-10 z M50 30 h15 v10 h-15 z M45 50 h20 v10 h-20 z M75 55 h15 v15 h-15 z M45 70 h15 v20 h-15 z M70 75 h20 v15 h-20 z" fill="#27333d" />
                  </svg>
                </div>
                <div className="upi-info">
                  <p>Scan & Pay via Google Pay, PhonePe, Paytm</p>
                  <strong>{settings?.restaurantName ? `${settings.restaurantName.toLowerCase().replace(/[^a-z]/g, '')}@upi` : 'oliveandthyme@upi'}</strong>
                  <span className="pay-amount-badge">{money(total)}</span>
                </div>
              </div>
              <label className="modal-field">
                <span>UPI Reference / UTR Number (Optional)</span>
                <input
                  type="text"
                  placeholder="e.g. 325491823719"
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                />
              </label>
            </div>
          )}

          {method === 'Card' && (
            <div className="card-section">
              <div className="card-terminal-prompt">
                <CreditCard size={32} className="accent-icon" />
                <p>Swipe or Dip Card on POS Terminal Machine</p>
              </div>
              <label className="modal-field">
                <span>Approval / Auth Code (Optional)</span>
                <input
                  type="text"
                  placeholder="e.g. AUTH-884920"
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>

        <button
          className="primary-button full-button pay-confirm-btn"
          disabled={method === 'Cash' && received < total}
          onClick={handleConfirm}
        >
          <Check size={18} /> Confirm {method} Payment ({money(total)})
        </button>
      </div>
    </div>
  )
}
