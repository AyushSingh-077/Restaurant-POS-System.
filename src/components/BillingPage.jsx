import { Download, Plus, Printer } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useRestaurant } from '../useRestaurant'
import { money } from '../utils'

export default function BillingPage() {
    const { orders, settings } = useRestaurant()
    const navigate = useNavigate()
    const order = orders[0]
    const items = order?.detailItems || order?.items?.map((name) => ({ name, quantity: 1, price: Math.round((order.amount || 0) / (order.items?.length || 1)) })) || []
    const download = () => { const blob = new Blob([`Invoice ${order?.id || 'INV-1048'}\n${settings.restaurantName}\nTotal: ${money(order?.amount || 0)}`], { type: 'text/plain' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${order?.id || 'invoice'}.txt`; link.click(); URL.revokeObjectURL(link.href); toast.success('Invoice downloaded') }
    return <div className="page"><div className="page-heading"><div><p className="eyebrow accent">Financial desk</p><h2>Billing & invoices</h2></div><div className="billing-actions"><button className="primary-button" onClick={() => window.print()}><Printer size={16} /> Print bill</button><button className="secondary-button" onClick={download}><Download size={16} /> Download invoice</button><button className="secondary-button" onClick={() => navigate('/new-order')}><Plus size={16} /> New order</button></div></div><div className="billing-layout"><div className="panel invoice-preview"><div className="invoice-brand"><div className="brand-mark">◈</div><div><strong>table<span>wise</span></strong><p>{settings.restaurantName}</p></div><span className="paid-stamp">{order?.payment === 'Paid' ? 'PAID' : 'UNPAID'}</span></div><div className="invoice-meta"><div><span>Bill to</span><strong>{order?.customer || 'Walk-in Guest'}</strong><p>Table {order?.table || '—'} · {order?.type || 'Dine In'}</p></div><div><span>Invoice no.</span><strong>INV-{order?.id?.replace('ORD-', '') || '1048'}</strong><p>{order?.date || new Date().toLocaleString()}</p></div></div><p className="invoice-note" style={{ textAlign: 'left', margin: '0 0 18px' }}>{settings.address} · {settings.phone}<br />GSTIN: {settings.gstNumber}</p><div className="invoice-items">{items.map((item, index) => <div key={`${item.name}-${index}`}><span>{item.name}</span><span>{item.quantity} ×</span><b>{money((item.price || 0) * item.quantity)}</b></div>)}</div><div className="invoice-total"><span>Subtotal</span><b>{money(order?.amount || 0)}</b><span>CGST + SGST</span><b>Included</b><span>Service charge</span><b>Included</b><strong>Grand total</strong><strong>{money(order?.amount || 0)}</strong></div><p className="invoice-note">Thank you for dining with us.</p></div></div></div>
}
