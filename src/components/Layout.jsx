import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Bell,
  ChefHat,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Package,
  PanelLeft,
  Settings,
  ShoppingBag,
  Store,
  Table2,
  Users,
  WalletCards,
  X
} from 'lucide-react'
import { useRestaurant } from '../useRestaurant'
import KOTModal from './KOTModal'

const navigation = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Tables', path: '/tables', icon: Table2 },
  { label: 'New Order', path: '/new-order', icon: ShoppingBag },
  { label: 'Orders', path: '/orders', icon: Package },
  { label: 'Menu', path: '/menu', icon: ChefHat },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Billing', path: '/billing', icon: WalletCards },
  { label: 'Reports', path: '/reports', icon: PanelLeft },
  { label: 'Settings', path: '/settings', icon: Settings }
]

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { orders, settings, activeKOTOrder, setActiveKOTOrder } = useRestaurant()

  const currentNav = navigation.find((item) => item.path === location.pathname)?.label || 'Dashboard'
  const activeOrdersCount = orders.filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled').length

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <ChefHat size={22} />
          </div>
          <div>
            <strong>
              table<span>wise</span>
            </strong>
            <small>Restaurant OS</small>
          </div>
          <button className="icon-button sidebar-close" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="location-chip">
          <Store size={16} />
          <span>{settings.restaurantName || 'Olive & Thyme'}</span>
          <ChevronDown size={14} />
        </div>

        <p className="nav-label">Workspace</p>
        <nav>
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === 'Orders' && activeOrdersCount > 0 && (
                <b className="nav-count">{activeOrdersCount}</b>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="help-box">
            <CircleHelp size={18} />
            <div>
              <strong>Need help?</strong>
              <span>Visit support center</span>
            </div>
          </div>
          <div className="user-row">
            <div className="avatar">AS</div>
            <div>
              <strong>Ayush Singh</strong>
              <span>Manager</span>
            </div>
            <MoreHorizontal size={18} />
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="overlay" onClick={() => setMobileOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>

          <div>
            <p className="eyebrow">{todayStr}</p>
            <h1>{currentNav}</h1>
          </div>

          <div className="top-actions">
            <button className="icon-button notification" title="Notifications">
              <Bell size={19} />
              {activeOrdersCount > 0 && <i />}
            </button>
            <div className="top-user">
              <div className="avatar">AS</div>
              <div>
                <strong>Ayush Singh</strong>
                <span>Manager</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </main>

      {/* Global KOT Modal rendering if triggered */}
      {activeKOTOrder && (
        <KOTModal order={activeKOTOrder} onClose={() => setActiveKOTOrder(null)} />
      )}
    </div>
  )
}
