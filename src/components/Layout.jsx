import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Bell, ChefHat, ChevronDown, CircleHelp, LayoutDashboard, Menu, MoreHorizontal, Package, PanelLeft, Settings, ShoppingBag, Store, Table2, Users, WalletCards, X } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard }, { label: 'Tables', path: '/tables', icon: Table2 }, { label: 'New Order', path: '/new-order', icon: ShoppingBag }, { label: 'Orders', path: '/orders', icon: Package }, { label: 'Menu', path: '/menu', icon: ChefHat }, { label: 'Customers', path: '/customers', icon: Users }, { label: 'Billing', path: '/billing', icon: WalletCards }, { label: 'Reports', path: '/reports', icon: PanelLeft }, { label: 'Settings', path: '/settings', icon: Settings },
]
export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const current = navigation.find((item) => item.path === location.pathname)?.label || 'Dashboard'
  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><ChefHat size={21} /></div><div><strong>table<span>wise</span></strong><small>Restaurant OS</small></div><button className="icon-button sidebar-close" onClick={() => setOpen(false)}><X size={18} /></button></div>
      <div className="location-chip"><Store size={16} /><span>Olive & Thyme</span><ChevronDown size={14} /></div>
      <p className="nav-label">Workspace</p><nav>{navigation.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Icon size={18} /><span>{label}</span>{label === 'Orders' && <b className="nav-count">4</b>}</NavLink>)}</nav>
      <div className="sidebar-footer"><div className="help-box"><CircleHelp size={18} /><div><strong>Need help?</strong><span>Visit support center</span></div></div><div className="user-row"><div className="avatar">AS</div><div><strong>Ayush Singh</strong><span>Manager</span></div><MoreHorizontal size={18} /></div></div>
    </aside>
    {open && <div className="overlay" onClick={() => setOpen(false)} />}
    <main className="main-area"><header className="topbar"><button className="icon-button mobile-menu" onClick={() => setOpen(true)}><Menu size={20} /></button><div><p className="eyebrow">Monday, 16 September 2024</p><h1>{current}</h1></div><div className="top-actions"><button className="icon-button notification"><Bell size={19} /><i /></button><div className="top-user"><div className="avatar">AS</div><div><strong>Ayush Singh</strong><span>Manager</span></div><ChevronDown size={16} /></div></div></header><div className="content"><Outlet /></div></main>
  </div>
}
