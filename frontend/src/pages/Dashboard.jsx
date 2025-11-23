"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import apiClient from "../components/ApiClient"
import { BarChart3, Users, Package, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { user, effectiveRole } = useAuth()
  const [stats, setStats] = useState({
    invoices: 0,
    customers: 0,
    products: 0,
    sales: 0,
  })
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [paymentStatus, setPaymentStatus] = useState({ paid: 0, partial: 0, pending: 0 })
  const [topCustomers, setTopCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const invoices = await apiClient.get("/invoices").catch(() => ({ data: [] }))
        const customers = await apiClient.get("/customers").catch(() => ({ data: [] }))
        const products = await apiClient.get("/products").catch(() => ({ data: [] }))
        const sales = await apiClient.get("/reports/sales/summary").catch(() => ({ data: { total_sales: 0 } }))
        const topCust = await apiClient.get("/reports/customers/top").catch(() => ({ data: [] }))

        setStats({
          invoices: invoices.data.length,
          customers: customers.data.length,
          products: products.data.length,
          sales: parseFloat(sales.data.total_sales) || 0,
        })

        const byMonth = {}
        invoices.data.forEach((inv) => {
          const d = new Date(inv.issue_date)
          const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
          const amt = Number(inv.net_amount) || 0
          byMonth[key] = (byMonth[key] || 0) + amt
        })
        const keys = Object.keys(byMonth).sort()
        const last6 = keys.slice(-6)
        setMonthlyRevenue(last6.map((k) => {
          const [y,m] = k.split("-")
          return { label: `${new Date(`${y}-${m}-01`).toLocaleString(undefined,{ month:'short'})} ${y.slice(-2)}`, total: byMonth[k] }
        }))

        const statusCounts = { paid: 0, partial: 0, pending: 0 }
        invoices.data.forEach((inv) => {
          const s = (inv.payment_status || 'pending').toLowerCase()
          if (s === 'paid') statusCounts.paid++
          else if (s === 'partial') statusCounts.partial++
          else statusCounts.pending++
        })
        setPaymentStatus(statusCounts)

        setTopCustomers((topCust.data || []).slice(0,5))
      } catch (err) {
        console.error("[v0] Failed to fetch stats", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const StatCard = ({ icon: Icon, label, value, trend }) => (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm text-slate-600">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-semibold text-blueZodiac">{value}</p>
          {typeof trend === 'number' && (
            <span className={trend >= 0 ? 'stat-badge-up' : 'stat-badge-down'}>
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="space-y-6">
        <motion.h1 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-semibold text-blueZodiac">Hello, {user?.name || 'User'}</motion.h1>

        {loading ? (
          <div className="text-center py-12">Loading stats...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={FileText} label="Total Invoices" value={stats.invoices} trend={4} />
            <StatCard icon={Users} label="Customers" value={stats.customers} trend={2} />
            <StatCard icon={Package} label="Products" value={stats.products} trend={1} />
            <StatCard icon={BarChart3} label="Total Sales" value={`₹${Number(stats.sales).toFixed(2)}`} trend={8} />
          </div>
        )}

        <div className="card card-top card-top-hippieBlue p-6">
          <h2 className="card-title">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="/invoices" className="p-3 rounded-2xl bg-goldenDream text-blueZodiac text-center font-semibold hover:bg-[#e6c82f]">Create Invoice</a>
            {(effectiveRole || user?.role) !== "sales" && (
              <a href="/customers" className="p-3 rounded-2xl bg-goldenDream text-blueZodiac text-center font-semibold hover:bg-[#e6c82f]">Add Customer</a>
            )}
            {(effectiveRole || user?.role) !== "sales" && (
              <a href="/products" className="p-3 rounded-2xl bg-goldenDream text-blueZodiac text-center font-semibold hover:bg-[#e6c82f]">Add Product</a>
            )}
            {(effectiveRole || user?.role) !== "sales" && (
              <a href="/reports" className="p-3 rounded-2xl bg-goldenDream text-blueZodiac text-center font-semibold hover:bg-[#e6c82f]">View Reports</a>
            )}
            {(effectiveRole || user?.role) === "admin" && (
              <a href="/setup" className="p-3 rounded-2xl bg-goldenDream text-blueZodiac text-center font-semibold hover:bg-[#e6c82f]">Organization Setup</a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card card-top card-top-hippieBlue p-6">
            <h2 className="card-title">Monthly Revenue</h2>
            <div className="chart-bars">
              {monthlyRevenue.map((m, idx) => {
                const max = Math.max(...monthlyRevenue.map(v => v.total), 1)
                const h = Math.round((m.total / max) * 100)
                return (
                  <motion.div key={idx} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} whileHover={{ scaleY: 1.05 }} className="chart-bar hover-group" style={{ height: `${h}%` }}>
                    <div className="tooltip">{m.label} · ₹{Number(m.total).toFixed(0)}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
          <div className="card card-top card-top-hippieBlue p-6">
            <h2 className="card-title">Payment Status</h2>
            <div className="flex items-center gap-6">
              <svg width="180" height="180" viewBox="0 0 36 36">
                {(() => {
                  const total = paymentStatus.paid + paymentStatus.partial + paymentStatus.pending || 1
                  const seg = [
                    { val: paymentStatus.paid, color: '#5B88B2', label: 'Paid' },
                    { val: paymentStatus.partial, color: '#F0D637', label: 'Partial' },
                    { val: paymentStatus.pending, color: '#122C4F', label: 'Pending' },
                  ]
                  let start = 0
                  return seg.map((s, i) => {
                    const pct = (s.val / total) * 100
                    const dash = `${pct} ${100 - pct}`
                    const el = (
                      <motion.circle key={i} cx="18" cy="18" r="16" fill="none" stroke={s.color} strokeWidth="4" strokeDasharray={dash} strokeDashoffset={100 - start}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.03 }} />
                    )
                    start += pct
                    return el
                  })
                })()}
              </svg>
              <div className="legend">
                <div className="legend-item"><span className="legend-swatch" style={{ backgroundColor: '#5B88B2' }}></span> Paid ({paymentStatus.paid})</div>
                <div className="legend-item"><span className="legend-swatch" style={{ backgroundColor: '#F0D637' }}></span> Partial ({paymentStatus.partial})</div>
                <div className="legend-item"><span className="legend-swatch" style={{ backgroundColor: '#122C4F' }}></span> Pending ({paymentStatus.pending})</div>
              </div>
            </div>
          </div>
          <div className="card card-top card-top-hippieBlue p-6">
            <h2 className="card-title">Top Customers</h2>
            <div className="space-y-2">
              {topCustomers.map((c, idx) => {
                const max = Math.max(...topCustomers.map(v => Number(v.total_spent)||0), 1)
                const w = Math.round(((Number(c.total_spent)||0) / max) * 100)
                return (
                  <div key={c.id || idx} className="w-full">
                    <div className="flex justify-between text-sm mb-1"><span>{c.name}</span><span>₹{(Number(c.total_spent)||0).toFixed(0)}</span></div>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${w}%` }} whileHover={{ scaleY: 1.03 }} className="h-3 bg-hippieBlue rounded-full"></motion.div>
                  </div>
                )
              })}
              {topCustomers.length === 0 && (
                <div className="text-sm text-slate-600">No data</div>
              )}
            </div>
          </div>
        </div>

        
      </div>
    </Layout>
  )
}
