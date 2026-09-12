import { useEffect, useMemo, useState } from 'react'
import { initialCustomers, initialOrders, initialSettings, initialTables, initialTransactions, menuItems } from '../data'
import { generateOrderId, generateTxnId } from '../utils'
import { RestaurantContext } from './restaurantContext'

const read = (key, fallback) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

const readMenu = () => {
  try {
    const item = localStorage.getItem('menu')
    if (!item) return menuItems.map((i) => ({ ...i, inStock: i.inStock !== false }))
    const parsed = JSON.parse(item)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return menuItems.map((i) => ({ ...i, inStock: i.inStock !== false }))
    }

    const allOut = parsed.every((i) => i.inStock === false)
    const updatedParsed = parsed.map((i) => ({
      ...i,
      inStock: allOut ? true : i.inStock !== false
    }))

    const existingIds = new Set(parsed.map((i) => i.id))
    const missingItems = menuItems
      .filter((i) => !existingIds.has(i.id))
      .map((i) => ({ ...i, inStock: i.inStock !== false }))

    return [...updatedParsed, ...missingItems]
  } catch {
    return menuItems.map((i) => ({ ...i, inStock: i.inStock !== false }))
  }
}

export function RestaurantProvider({ children }) {
  const [menu, setMenuState] = useState(() => readMenu())
  const [tables, setTables] = useState(() => read('tables', initialTables))
  const [orders, setOrders] = useState(() => read('orders', initialOrders))
  const [customers, setCustomers] = useState(() => read('customers', initialCustomers))
  const [transactions, setTransactions] = useState(() => read('transactions', initialTransactions))
  const [settings, setSettings] = useState(() => read('settings', initialSettings))

  const [cart, setCart] = useState([])
  const [selectedTable, setSelectedTable] = useState('T-01')
  const [orderType, setOrderType] = useState('Dine In')
  const [customerName, setCustomerName] = useState('Walk-in Guest')
  const [customerPhone, setCustomerPhone] = useState('')
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState('amount') // 'amount' | 'percent'

  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null)
  const [activeKOTOrder, setActiveKOTOrder] = useState(null)

  // Save changes to LocalStorage
  useEffect(() => localStorage.setItem('tables', JSON.stringify(tables)), [tables])
  useEffect(() => localStorage.setItem('menu', JSON.stringify(menu)), [menu])
  useEffect(() => localStorage.setItem('orders', JSON.stringify(orders)), [orders])
  useEffect(() => localStorage.setItem('customers', JSON.stringify(customers)), [customers])
  useEffect(() => localStorage.setItem('transactions', JSON.stringify(transactions)), [transactions])
  useEffect(() => localStorage.setItem('settings', JSON.stringify(settings)), [settings])

  // Cart operations
  const addToCart = (item, customNotes = '') => {
    setCart((current) => {
      const existing = current.find((i) => i.id === item.id)
      if (existing) {
        return current.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1, notes: customNotes || i.notes } : i
        )
      }
      return [...current, { ...item, quantity: 1, notes: customNotes }]
    })
  }

  const updateQuantity = (id, change) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + change } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  const updateItemNotes = (id, notes) => {
    setCart((current) => current.map((item) => (item.id === id ? { ...item, notes } : item)))
  }

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
    setDiscount(0)
  }

  // Totals calculations
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    
    let discountAmount = 0
    if (discountType === 'percent') {
      discountAmount = (subtotal * Math.min(100, Math.max(0, discount))) / 100
    } else {
      discountAmount = Math.min(subtotal, Math.max(0, discount))
    }

    const taxable = Math.max(0, subtotal - discountAmount)
    const cgst = taxable * (Number(settings.cgstRate || 0) / 100)
    const sgst = taxable * (Number(settings.sgstRate || 0) / 100)
    const service = settings.enableServiceCharge ? taxable * (Number(settings.serviceChargeRate || 0) / 100) : 0
    const total = taxable + cgst + sgst + service

    return {
      subtotal,
      discount: Math.round(discountAmount),
      taxable,
      cgst,
      sgst,
      tax: cgst + sgst,
      service,
      total: Math.round(total)
    }
  }, [cart, discount, discountType, settings])

  // Payment completion
  const completePayment = (method = 'Cash', isPaid = true) => {
    const orderId = generateOrderId(orders.length)
    const newOrder = {
      id: orderId,
      table: orderType === 'Dine In' ? selectedTable : '—',
      customer: customerName || 'Walk-in Guest',
      customerPhone: customerPhone || '—',
      type: orderType,
      amount: totals.total,
      subtotal: totals.subtotal,
      discount: totals.discount,
      cgst: totals.cgst,
      sgst: totals.sgst,
      service: totals.service,
      tax: totals.tax,
      payment: isPaid ? 'Paid' : 'Unpaid',
      method: isPaid ? method : 'Pending',
      status: isPaid ? 'Completed' : 'Pending',
      date: 'Just now',
      items: cart.map((item) => `${item.name} x${item.quantity}`),
      detailItems: cart.map((item) => ({ ...item }))
    }

    setOrders((current) => [newOrder, ...current])

    if (isPaid) {
      setTransactions((current) => [
        {
          id: generateTxnId(current.length),
          orderId: newOrder.id,
          amount: newOrder.amount,
          method,
          date: 'Just now'
        },
        ...current
      ])
    }

    // Update table status if Dine In
    if (orderType === 'Dine In' && selectedTable) {
      setTables((current) =>
        current.map((tbl) =>
          tbl.name === selectedTable
            ? { ...tbl, status: isPaid ? 'Available' : 'Occupied', amount: isPaid ? 0 : totals.total, orderId: isPaid ? null : orderId }
            : tbl
        )
      )
    }

    // Update customer spending stats if known customer
    if (customerName && customerName !== 'Walk-in Guest') {
      setCustomers((current) =>
        current.map((cust) =>
          cust.name.toLowerCase() === customerName.toLowerCase()
            ? { ...cust, orders: cust.orders + 1, spending: cust.spending + totals.total, lastOrder: 'Just now' }
            : cust
        )
      )
    }

    clearCart()
    setActiveInvoiceOrder(newOrder)
    return newOrder
  }

  // Update order status (Pending -> Cooking -> Served -> Completed)
  const updateOrderStatus = (orderId, newStatus, newPaymentStatus, newMethod) => {
    setOrders((current) =>
      current.map((ord) => {
        if (ord.id === orderId) {
          const updated = {
            ...ord,
            status: newStatus || ord.status,
            payment: newPaymentStatus || ord.payment,
            method: newMethod || ord.method
          }
          if (newPaymentStatus === 'Paid' && ord.payment !== 'Paid') {
            setTransactions((txns) => [
              {
                id: generateTxnId(txns.length),
                orderId: ord.id,
                amount: ord.amount,
                method: newMethod || 'Cash',
                date: 'Just now'
              },
              ...txns
            ])
            // Free table if dine-in
            if (ord.table && ord.table !== '—') {
              setTables((tbls) =>
                tbls.map((t) => (t.name === ord.table ? { ...t, status: 'Available', amount: 0, orderId: null } : t))
              )
            }
          }
          return updated
        }
        return ord
      })
    )
  }

  // Table operations
  const updateTableStatus = (tableId, status) => {
    setTables((current) =>
      current.map((t) => (t.id === tableId ? { ...t, status, amount: status === 'Available' ? 0 : t.amount } : t))
    )
  }

  const addTable = (tableData) => {
    setTables((current) => [
      ...current,
      {
        id: Date.now(),
        name: tableData.name || `T-${String(current.length + 1).padStart(2, '0')}`,
        capacity: Number(tableData.capacity) || 4,
        section: tableData.section || 'Main Hall',
        status: 'Available',
        amount: 0,
        server: tableData.server || 'Staff'
      }
    ])
  }

  const editTable = (id, changes) => {
    setTables((current) => current.map((t) => (t.id === id ? { ...t, ...changes } : t)))
  }

  // Menu operations
  const addMenuItem = (item) => {
    setMenuState((current) => [
      ...current,
      {
        ...item,
        id: Date.now(),
        price: Number(item.price),
        inStock: item.inStock !== false
      }
    ])
  }

  const updateMenuItem = (id, changes) => {
    setMenuState((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)))
  }

  const deleteMenuItem = (id) => {
    setMenuState((current) => current.filter((item) => item.id !== id))
  }

  const toggleItemStock = (id) => {
    setMenuState((current) => current.map((item) => (item.id === id ? { ...item, inStock: !item.inStock } : item)))
  }

  const setAllItemsStock = (inStockStatus = true) => {
    setMenuState((current) => current.map((item) => ({ ...item, inStock: inStockStatus })))
  }

  const resetMenuToDefault = () => {
    setMenuState(menuItems.map((item) => ({ ...item, inStock: true })))
  }

  // Customer operations
  const addCustomer = (cust) => {
    setCustomers((current) => [
      ...current,
      {
        ...cust,
        id: Date.now(),
        orders: 0,
        spending: 0,
        lastOrder: 'Never'
      }
    ])
  }

  const updateCustomer = (id, changes) => {
    setCustomers((current) => current.map((c) => (c.id === id ? { ...c, ...changes } : c)))
  }

  const deleteCustomer = (id) => {
    setCustomers((current) => current.filter((c) => c.id !== id))
  }

  // Reset to default data
  const resetDemoData = () => {
    setMenuState(menuItems)
    setTables(initialTables)
    setOrders(initialOrders)
    setCustomers(initialCustomers)
    setTransactions(initialTransactions)
    setSettings(initialSettings)
    localStorage.clear()
  }

  const value = {
    menuItems: menu,
    tables,
    orders,
    customers,
    transactions,
    settings,
    setSettings,

    // Cart state
    cart,
    addToCart,
    updateQuantity,
    updateItemNotes,
    removeFromCart,
    clearCart,
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

    totals,
    completePayment,
    updateOrderStatus,

    // Table actions
    updateTableStatus,
    addTable,
    editTable,

    // Menu CRUD
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemStock,
    setAllItemsStock,
    resetMenuToDefault,

    // Customer CRUD
    addCustomer,
    updateCustomer,
    deleteCustomer,

    // Active modals/previews
    activeInvoiceOrder,
    setActiveInvoiceOrder,
    activeKOTOrder,
    setActiveKOTOrder,

    resetDemoData
  }

  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>
}
