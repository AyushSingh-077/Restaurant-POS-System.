import { useState } from 'react'
import {
  TrendingUp,
  ShoppingBag,
  Wallet,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  CreditCard,
  Download
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts'
import { useRestaurant } from '../useRestaurant'
import { money } from '../utils'
import { toast } from 'sonner'

const dailyRevenueData = [
  { date: '10 Sep', revenue: 38400, orders: 46 },
  { date: '11 Sep', revenue: 42100, orders: 52 },
  { date: '12 Sep', revenue: 39800, orders: 49 },
  { date: '13 Sep', revenue: 51200, orders: 64 },
  { date: '14 Sep', revenue: 64900, orders: 82 },
  { date: '15 Sep', revenue: 71500, orders: 95 },
  { date: '16 Sep', revenue: 48290, orders: 68 }
]

const categorySalesData = [
  { name: 'Starters', value: 34500, color: '#147d65' },
  { name: 'Main Course', value: 58200, color: '#249477' },
  { name: 'Biryani', value: 42100, color: '#f1c58c' },
  { name: 'Chinese', value: 29800, color: '#6080d4' },
  { name: 'Beverages', value: 18400, color: '#cf7169' },
  { name: 'Desserts', value: 15200, color: '#9b51e0' }
]

const paymentMethodData = [
  { name: 'UPI / QR', value: 148500, color: '#147d65' },
  { name: 'Card', value: 89200, color: '#6080d4' },
  { name: 'Cash', value: 68400, color: '#f1c58c' }
]

const topDishesData = [
  { name: 'Dum Chicken Biryani', sales: 184 },
  { name: 'Paneer Butter Masala', sales: 162 },
  { name: 'Butter Chicken Special', sales: 145 },
  { name: 'Chicken Tikka', sales: 128 },
  { name: 'Butter Garlic Naan', sales: 290 },
  { name: 'Fresh Lime Soda', sales: 210 }
]

export default function ReportsPage() {
  const { orders, transactions } = useRestaurant()
  const [timeRange, setTimeRange] = useState('This Month')

  const totalRev = dailyRevenueData.reduce((s, d) => s + d.revenue, 0)
  const totalOrders = dailyRevenueData.reduce((s, d) => s + d.orders, 0)
  const avgOrder = Math.round(totalRev / totalOrders)
  const estimatedTax = Math.round(totalRev * 0.05)

  return (
    <div className="page reports-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow accent">Business Intelligence</p>
          <h2>Analytics & Sales Reports</h2>
        </div>

        <div className="report-controls">
          <select
            className="time-range-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="This Month">This Month</option>
          </select>

          <button
            className="secondary-button"
            onClick={() => toast.success('Financial report exported to CSV')}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon mint">
            <TrendingUp size={20} />
          </div>
          <p>Period Revenue</p>
          <div className="stat-value">{money(totalRev)}</div>
          <div className="stat-change up">+18.4% growth</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <ShoppingBag size={20} />
          </div>
          <p>Total Orders Executed</p>
          <div className="stat-value">{totalOrders}</div>
          <div className="stat-change up">+12.1% volume</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Wallet size={20} />
          </div>
          <p>Average Order Value</p>
          <div className="stat-value">{money(avgOrder)}</div>
          <div className="stat-change up">+4.2% basket size</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rose">
            <CreditCard size={20} />
          </div>
          <p>Estimated GST Collected</p>
          <div className="stat-value">{money(estimatedTax)}</div>
          <div className="stat-change neutral">5.0% tax slab</div>
        </div>
      </div>

      {/* Charts Grid 1: Revenue Trend & Category Breakdown */}
      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <div className="section-title">
            <div>
              <h2>Revenue Trend ({timeRange})</h2>
              <span className="subtitle">Daily sales comparison</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={dailyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#147d65" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#147d65" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#81909a' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#81909a' }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(val) => [money(val), 'Revenue']} contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #e6ece9' }} />
                <Area type="monotone" dataKey="revenue" stroke="#147d65" strokeWidth={3} fillOpacity={1} fill="url(#repGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel chart-panel">
          <div className="section-title">
            <h2>Category Sales Share</h2>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categorySalesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {categorySalesData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => money(val)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid 2: Payment Distribution & Top Dish Sales */}
      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <div className="section-title">
            <h2>Payment Method Distribution</h2>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => money(val)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel chart-panel">
          <div className="section-title">
            <h2>Top Selling Items Volume</h2>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={topDishesData} layout="vertical" margin={{ left: 40, right: 20, top: 10, bottom: 0 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#81909a' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#27333d' }} width={120} />
                <Tooltip formatter={(val) => [val, 'Units Sold']} />
                <Bar dataKey="sales" fill="#147d65" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
