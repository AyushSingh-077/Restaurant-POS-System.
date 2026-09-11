import { useEffect, useMemo, useState } from 'react'
import { initialCustomers, initialOrders, initialSettings, initialTables, initialTransactions, menuItems } from '../data'
import { RestaurantContext } from './restaurantContext'
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback }
}

export function RestaurantProvider({ children }) {
  const [menu, setMenuState] = useState(() => {
    const saved = read('menu', [])
    if (!saved.length) return menuItems
    const savedById = new Map(saved.map((item) => [item.id, item]))
    return [...menuItems.map((item) => {
      const savedItem = savedById.get(item.id)
      const savedImageIsBroken = item.id === 5 && savedItem?.image?.includes('1563379091339')
      return savedItem && !savedImageIsBroken ? savedItem : item
    }), ...saved.filter((item) => !menuItems.some((defaultItem) => defaultItem.id === item.id))]
  })
  const [tables, setTables] = useState(() => read('tables', initialTables))
  const [orders, setOrders] = useState(() => read('orders', initialOrders))
  const [customers, setCustomers] = useState(() => read('customers', initialCustomers))
  const [transactions, setTransactions] = useState(() => read('transactions', initialTransactions))
  const [settings, setSettings] = useState(() => read('settings', initialSettings))
  const [cart, setCart] = useState([])
  const [selectedTable, setSelectedTable] = useState('T-03')
  const [orderType, setOrderType] = useState('Dine In')
  const [discount, setDiscount] = useState(0)

  useEffect(() => localStorage.setItem('tables', JSON.stringify(tables)), [tables])
  useEffect(() => localStorage.setItem('menu', JSON.stringify(menu)), [menu])
  useEffect(() => localStorage.setItem('orders', JSON.stringify(orders)), [orders])
  useEffect(() => localStorage.setItem('customers', JSON.stringify(customers)), [customers])
  useEffect(() => localStorage.setItem('transactions', JSON.stringify(transactions)), [transactions])
  useEffect(() => localStorage.setItem('settings', JSON.stringify(settings)), [settings])

  const addToCart = (item) => setCart((current) => {
    const found = current.find((entry) => entry.id === item.id)
    return found ? current.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, { ...item, quantity: 1 }]
  })
  const updateQuantity = (id, change) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0))
  const clearCart = () => setCart([])
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discountAmount = Math.min(discount, subtotal)
    const taxable = subtotal - discountAmount
    const cgst = taxable * (Number(settings.cgstRate) / 100)
    const sgst = taxable * (Number(settings.sgstRate) / 100)
    const service = taxable * (Number(settings.serviceChargeRate) / 100)
    return { subtotal, discount: discountAmount, taxable, cgst, sgst, tax: cgst + sgst, service, total: taxable + cgst + sgst + service }
  }, [cart, discount, settings])
  const completePayment = (method = 'Cash') => {
    const order = { id: `ORD-${1050 + orders.length}`, table: orderType === 'Dine In' ? selectedTable : '—', customer: 'Walk-in Guest', type: orderType, amount: Math.round(totals.total), payment: 'Paid', status: 'Completed', date: 'Just now', items: cart.map((item) => `${item.name} x${item.quantity}`), method, detailItems: cart.map((item) => ({ ...item })) }
    setOrders((current) => [order, ...current])
    setTransactions((current) => [{ id: `TXN-${2042 + current.length}`, orderId: order.id, amount: order.amount, method, date: 'Just now' }, ...current])
    if (orderType === 'Dine In') setTables((current) => current.map((table) => table.name === selectedTable ? { ...table, status: 'Available', amount: 0 } : table))
    clearCart()
    return order
  }
  const addMenuItem = (item) => setMenuState((current) => [...current, { ...item, id: Date.now() }])
  const value = { menuItems: menu, tables, setTables, orders, setOrders, customers, setCustomers, transactions, settings, setSettings, cart, addToCart, updateQuantity, removeFromCart: (id) => setCart((current) => current.filter((item) => item.id !== id)), increaseQuantity: (id) => updateQuantity(id, 1), decreaseQuantity: (id) => updateQuantity(id, -1), clearCart, selectedTable, setSelectedTable, orderType, setOrderType, discount, setDiscount, totals, completePayment, addMenuItem, updateMenuItem: (id, changes) => setMenuState((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item)), deleteMenuItem: (id) => setMenuState((current) => current.filter((item) => item.id !== id)), addCustomer: (customer) => setCustomers((current) => [...current, { ...customer, id: Date.now(), orders: 0, spending: 0, lastOrder: 'Never' }]), updateCustomer: (id, changes) => setCustomers((current) => current.map((customer) => customer.id === id ? { ...customer, ...changes } : customer)), deleteCustomer: (id) => setCustomers((current) => current.filter((customer) => customer.id !== id)) }
  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>
}
