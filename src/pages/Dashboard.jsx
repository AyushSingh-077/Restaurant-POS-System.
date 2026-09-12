import { ArrowUpRight, Clock, Download, Plus, ShoppingBag, Sparkles, TrendingUp, Users, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { useRestaurant } from '../useRestaurant'
import { money, initials } from '../utils'
import { toast } from 'sonner'

const salesTrendData = [
  { day: 'Mon', sales: 34200, orders: 48 },
  { day: 'Tue', sales: 41800, orders: 56 },
  { day: 'Wed', sales: 38900, orders: 52 },
  { day: 'Thu', sales: 49500, orders: 68 },
  { day: 'Fri', sales: 58200, orders: 79 },
  { day: 'Sat', sales: 67400, orders: 94 },
  { day: 'Sun', sales: 72100, orders: 102 }
]

const COLORS = ['#147d65', '#249477', '#f1c58c', '#e37d69', '#6080d4']

export default function Dashboard() {
  const { orders, tables, menuItems } = useRestaurant()
  const navigate = useNavigate()

  // Dynamic summary metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment === 'Paid' ? o.amount : 0), 0)
  const todayOrdersCount = orders.length
  const avgOrderValue = todayOrdersCount > 0 ? Math.round(totalRevenue / todayOrdersCount) : 0
  const activeTablesCount = tables.filter((t) => t.status === 'Occupied' || t.status === 'Billing').length
  const totalTablesCount = tables.length

  const availableTables = tables.filter((t) => t.status === 'Available').length
  const occupiedTables = tables.filter((t) => t.status === 'Occupied').length
  const reservedTables = tables.filter((t) => t.status === 'Reserved').length
  const billingTables = tables.filter((t) => t.status === 'Billing').length

  const donutData = [
    { name: 'Available', value: availableTables, color: '#147d65' },
    { name: 'Occupied', value: occupiedTables, color: '#c98b37' },
    { name: 'Reserved', value: '#6080d4' ? 2 : reservedTables, color: '#6080d4' },
    { name: 'Billing', value: billingTables, color: '#cf7169' }
  ]

  return (
    <div className="page dashboard-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow accent">
            Welcome back, Ayush <Sparkles size={14} />
          </p>
          <h2>Dashboard Overview</h2>
        </div>
        <div className="quick-action-group">
          <button className="secondary-button" onClick={() => navigate('/tables')}>
            <Users size={16} /> View Tables
          </button>
          <button className="primary-button" onClick={() => navigate('/new-order')}>
            <Plus size={16} /> New Order (POS)
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon mint">
            <TrendingUp size={20} />
          </div>
          <p>Total Revenue</p>
          <div className="stat-value">{money(totalRevenue)}</div>
          <div className="stat-change up">
            <ArrowUpRight size={14} /> +14.2% <span>vs last week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <ShoppingBag size={20} />
          </div>
          <p>Total Orders</p>
          <div className="stat-value">{todayOrdersCount}</div>
          <div className="stat-change up">
            <ArrowUpRight size={14} /> +8.5% <span>vs last week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Wallet size={20} />
          </div>
          <p>Avg Order Value</p>
          <div className="stat-value">{money(avgOrderValue)}</div>
          <div className="stat-change up">
            <ArrowUpRight size={14} /> +3.8% <span>vs last week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rose">
            <Clock size={20} />
          </div>
          <p>Occupied Tables</p>
          <div className="stat-value">
            {activeTablesCount} / {totalTablesCount}
          </div>
          <div className="stat-change neutral">
            <span>{availableTables} tables currently free</span>
          </div>
        </div>
      </div>

      {/* Charts & Tables Grid */}
      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <div className="section-title">
            <div>
              <h2>Weekly Sales Trend</h2>
              <span className="subtitle">Daily revenue in INR (₹)</span>
            </div>
            <button className="ghost-button" onClick={() => navigate('/reports')}>
              View Full Reports <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="chart-wrapper" style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#147d65" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#147d65" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#81909a' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#81909a' }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(value) => [money(value), 'Revenue']} contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #e6ece9' }} />
                <Area type="monotone" dataKey="sales" stroke="#147d65" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel table-status">
          <div className="section-title">
            <h2>Floor Plan Status</h2>
            <button className="ghost-button" onClick={() => navigate('/tables')}>
              Manage <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="table-donut-container">
            <div style={{ width: 140, height: 140, position: 'relative' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={donutData} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center-text">
                <strong>{totalTablesCount}</strong>
                <span>Tables</span>
              </div>
            </div>
            <div className="table-key-legend">
              <span>
                <i className="key-dot available" /> Available <b>{availableTables}</b>
              </span>
              <span>
                <i className="key-dot occupied" /> Occupied <b>{occupiedTables}</b>
              </span>
              <span>
                <i className="key-dot reserved" /> Reserved <b>{reservedTables}</b>
              </span>
              <span>
                <i className="key-dot billing" /> Billing <b>{billingTables}</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Popular Dishes Grid */}
      <div className="dashboard-grid lower">
        <div className="panel">
          <div className="section-title">
            <h2>Recent Orders</h2>
            <button className="ghost-button" onClick={() => navigate('/orders')}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="order-list">
            {orders.slice(0, 5).map((order) => (
              <div className="order-row" key={order.id}>
                <div className="order-id">
                  <span className="order-avatar">{initials(order.customer)}</span>
                  <div>
                    <strong>{order.id}</strong>
                    <span>{order.customer}</span>
                  </div>
                </div>
                <div className="order-type">
                  {order.type} {order.table !== '—' && `(${order.table})`}
                  <span>{order.date}</span>
                </div>
                <b>{money(order.amount)}</b>
                <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel popular">
          <div className="section-title">
            <h2>Top Selling Items</h2>
          </div>
          {menuItems.slice(0, 5).map((item, index) => (
            <div className="popular-row" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <span>{item.category} · {[148, 126, 98, 84, 76][index]} orders</span>
              </div>
              <b>{money(item.price)}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
