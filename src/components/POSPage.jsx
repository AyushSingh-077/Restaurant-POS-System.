import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  Edit3,
  Plus,
  Printer,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
  ShoppingBag,
  UserCheck
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useRestaurant } from '../useRestaurant'
import { money } from '../utils'
import PaymentModal from './PaymentModal'

const categories = [
  'All',
  'Starters',
  'Main Course',
  'Biryani',
  'Breads',
  'Chinese',
  'South Indian',
  'Beverages',
  'Desserts'
]

export default function POSPage() {
  const {
    menuItems,
    cart,
    addToCart,
    updateQuantity,
    updateItemNotes,
    removeFromCart,
    clearCart,
    totals,
    selectedTable,
    setSelectedTable,
    orderType,
    setOrderType,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    discount,
    setDiscount,
    discountType,
    setDiscountType,
    tables,
    customers,
    completePayment,
    setActiveKOTOrder,
    settings
  } = useRestaurant()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [dietFilter, setDietFilter] = useState('All') // 'All' | 'Veg' | 'Non-Veg'
  const [payOpen, setPayOpen] = useState(false)
  const [noteItem, setNoteItem] = useState(null)
  const [customNote, setCustomNote] = useState('')
  const navigate = useNavigate()

  const filteredMenuItems = menuItems.filter((item) => {
    const categoryMatches = category === 'All' || item.category === category
    const dietMatches = dietFilter === 'All' || item.type === dietFilter
    const queryMatches =
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    return categoryMatches && dietMatches && queryMatches
  })

  const handlePayConfirm = (method) => {
    const completedOrder = completePayment(method, true)
    setPayOpen(false)
    toast.success(`Payment of ${money(completedOrder.amount)} received via ${method}`)
    navigate('/billing')
  }

  const handlePrintKOT = () => {
    if (!cart.length) return
    const kotData = {
      id: `KOT-${Math.floor(1000 + Math.random() * 9000)}`,
      type: orderType,
      table: selectedTable,
      date: new Date().toLocaleString(),
      detailItems: cart.map((i) => ({ ...i }))
    }
    setActiveKOTOrder(kotData)
    toast.success('KOT generated for kitchen')
  }

  const saveItemNote = () => {
    if (noteItem) {
      updateItemNotes(noteItem.id, customNote)
      setNoteItem(null)
      setCustomNote('')
      toast.success('Special instructions saved')
    }
  }

  return (
    <div className="page order-page pos-terminal">
      <div className="page-heading compact">
        <div>
          <p className="eyebrow accent">Point of Sale Terminal</p>
          <h2>New Order & Billing</h2>
        </div>
        <div className="order-meta">
          <span className="live-dot" /> Service Terminal Active
        </div>
      </div>

      <div className="pos-layout">
        {/* Left Column: Menu Catalog Browser */}
        <section className="menu-browser">
          <div className="search-line">
            <div className="search-box">
              <Search size={17} />
              <input
                placeholder="Search menu items by name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button className="icon-button" onClick={() => setQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Veg / Non-Veg Diet Toggle Buttons */}
            <div className="diet-toggle-group">
              <button
                className={`diet-btn ${dietFilter === 'All' ? 'active' : ''}`}
                onClick={() => setDietFilter('All')}
              >
                All
              </button>
              <button
                className={`diet-btn veg ${dietFilter === 'Veg' ? 'active' : ''}`}
                onClick={() => setDietFilter('Veg')}
              >
                <span className="dot veg-dot" /> Veg
              </button>
              <button
                className={`diet-btn nonveg ${dietFilter === 'Non-Veg' ? 'active' : ''}`}
                onClick={() => setDietFilter('Non-Veg')}
              >
                <span className="dot nonveg-dot" /> Non-Veg
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={category === cat ? 'selected' : ''}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Cards Grid */}
          <div className="menu-grid">
            {filteredMenuItems.map((item) => {
              const inCart = cart.find((i) => i.id === item.id)
              return (
                <article
                  className={`menu-card ${!item.inStock ? 'out-of-stock' : ''}`}
                  key={item.id}
                >
                  <div className="food-image">
                    <img src={item.image} alt={item.name} />
                    <span className={item.type === 'Veg' ? 'veg' : 'nonveg'} />
                    {!item.inStock && <div className="stock-overlay">Out of Stock</div>}
                  </div>
                  <div className="menu-card-body">
                    <div>
                      <h3>{item.name}</h3>
                      <span>
                        {item.category} · {item.type}
                      </span>
                    </div>
                    <p>{item.description}</p>
                    <div className="menu-card-bottom">
                      <strong>{money(item.price)}</strong>

                      {inCart ? (
                        <div className="card-qty-controls">
                          <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                          <b>{inCart.quantity}</b>
                          <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                      ) : (
                        <button
                          className="add-button"
                          disabled={!item.inStock}
                          onClick={() => {
                            addToCart(item)
                            toast.success(`${item.name} added to cart`)
                          }}
                        >
                          <Plus size={14} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* Right Column: Cart Panel */}
        <aside className="cart-panel">
          <div className="cart-header">
            <div>
              <p className="eyebrow">Current Cart</p>
              <h3>Selected Items</h3>
            </div>
            {cart.length > 0 && (
              <button className="icon-button danger" onClick={clearCart} title="Clear Cart">
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Order Details & Customer Header */}
          <div className="order-options">
            <div className="option-row">
              <label>
                <span>Order Type</span>
                <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                  <option value="Dine In">Dine In</option>
                  <option value="Takeaway">Takeaway</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </label>

              {orderType === 'Dine In' && (
                <label>
                  <span>Select Table</span>
                  <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                    {tables.map((table) => (
                      <option key={table.id} value={table.name}>
                        {table.name} ({table.section} - {table.capacity}s)
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            <div className="option-row">
              <label className="col-span-2">
                <span>Customer Name</span>
                <input
                  type="text"
                  placeholder="Walk-in Guest"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={36} />
                <strong>Cart is empty</strong>
                <span>Click "+ Add" on menu items to begin building order</span>
              </div>
            ) : (
              cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-main">
                    <strong>{item.name}</strong>
                    <span className="unit-price">{money(item.price)} each</span>
                    {item.notes && <p className="item-note">Note: {item.notes}</p>}

                    <div className="quantity">
                      <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                      <b>{item.quantity}</b>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      <button
                        className="note-btn"
                        title="Add instruction"
                        onClick={() => {
                          setNoteItem(item)
                          setCustomNote(item.notes || '')
                        }}
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        className="icon-button remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                  <b>{money(item.price * item.quantity)}</b>
                </div>
              ))
            )}
          </div>

          {/* Cart Totals Breakdown */}
          <div className="cart-summary">
            <div>
              <span>Subtotal</span>
              <b>{money(totals.subtotal)}</b>
            </div>

            <div className="discount-input-row">
              <span>Discount</span>
              <div className="discount-controls">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="disc-type-select"
                >
                  <option value="amount">₹</option>
                  <option value="percent">%</option>
                </select>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <span>CGST ({settings.cgstRate}%)</span>
              <b>{money(totals.cgst)}</b>
            </div>
            <div>
              <span>SGST ({settings.sgstRate}%)</span>
              <b>{money(totals.sgst)}</b>
            </div>
            {settings.enableServiceCharge && (
              <div>
                <span>Service Charge ({settings.serviceChargeRate}%)</span>
                <b>{money(totals.service)}</b>
              </div>
            )}

            <div className="grand-total">
              <span>Grand Total</span>
              <strong>{money(totals.total)}</strong>
            </div>
          </div>

          {/* Actions */}
          <div className="cart-actions">
            <button
              className="secondary-button"
              disabled={!cart.length}
              onClick={handlePrintKOT}
            >
              <Printer size={15} /> KOT Ticket
            </button>
            <button
              className="primary-button pay-button"
              disabled={!cart.length}
              onClick={() => setPayOpen(true)}
            >
              Pay Now <ArrowUpRight size={16} />
            </button>
          </div>
        </aside>
      </div>

      {/* Item Note Modal */}
      {noteItem && (
        <div className="modal-backdrop">
          <div className="modal note-modal">
            <div className="modal-head">
              <h3>Special Instructions for {noteItem.name}</h3>
              <button className="icon-button" onClick={() => setNoteItem(null)}>
                <X size={16} />
              </button>
            </div>
            <label className="modal-field">
              <span>Note (e.g., Less spicy, No onion, Extra cheese)</span>
              <input
                type="text"
                autoFocus
                placeholder="Type cooking instructions..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
              />
            </label>
            <div className="modal-actions">
              <button className="secondary-button" onClick={() => setNoteItem(null)}>
                Cancel
              </button>
              <button className="primary-button" onClick={saveItemNote}>
                Save Instruction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Payment Dialog */}
      {payOpen && (
        <PaymentModal
          total={totals.total}
          settings={settings}
          onClose={() => setPayOpen(false)}
          onPay={handlePayConfirm}
        />
      )}
    </div>
  )
}
