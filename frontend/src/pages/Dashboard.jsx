"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import apiClient from "../components/ApiClient"
import { BarChart3, Users, Package, FileText, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { motion } from "framer-motion"
import { FaChartLine, FaShoppingCart, FaCheckCircle } from "react-icons/fa"

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
          sales: Number.parseFloat(sales.data.total_sales) || 0,
        })

        const byMonth = {}
        invoices.data.forEach((inv) => {
          const d = new Date(inv.issue_date)
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
          const amt = Number(inv.net_amount) || 0
          byMonth[key] = (byMonth[key] || 0) + amt
        })
        const keys = Object.keys(byMonth).sort()
        const last6 = keys.slice(-6)
        setMonthlyRevenue(
          last6.map((k) => {
            const [y, m] = k.split("-")
            return {
              label: `${new Date(`${y}-${m}-01`).toLocaleString(undefined, { month: "short" })} ${y.slice(-2)}`,
              total: byMonth[k],
            }
          }),
        )

        const statusCounts = { paid: 0, partial: 0, pending: 0 }
        invoices.data.forEach((inv) => {
          const s = (inv.payment_status || "pending").toLowerCase()
          if (s === "paid") statusCounts.paid++
          else if (s === "partial") statusCounts.partial++
          else statusCounts.pending++
        })
        setPaymentStatus(statusCounts)

        setTopCustomers((topCust.data || []).slice(0, 5))
      } catch (err) {
        console.error("[v0] Failed to fetch stats", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const StatCard = ({ icon: Icon, label, value, trend, bgColor, iconColor }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -5 }}
      className="bg-[#FBF9E3] p-6 rounded-2xl border border-[#5B88B2]/10 shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`${iconColor}`} size={24} />
        </div>
        {typeof trend === "number" && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trend >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span className="text-xs font-bold">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#122C4F]">{value}</p>
    </motion.div>
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#122C4F] mb-2">
            Welcome back, <span className="text-[#F0D637]">{user?.name || "User"}</span>
          </h1>
          <p className="text-gray-600">Here's your business overview</p>
        </motion.div>

        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-12 h-12 border-4 border-[#5B88B2]/20 border-t-[#5B88B2] rounded-full"
              />
            </div>
          </motion.div>
        ) : (
          <>
            {/* Stat Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <motion.div variants={itemVariants}>
                <StatCard
                  icon={FileText}
                  label="Total Invoices"
                  value={stats.invoices}
                  trend={4}
                  bgColor="bg-blue-100"
                  iconColor="text-[#122C4F]"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard
                  icon={Users}
                  label="Customers"
                  value={stats.customers}
                  trend={2}
                  bgColor="bg-purple-100"
                  iconColor="text-[#5B88B2]"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard
                  icon={Package}
                  label="Products"
                  value={stats.products}
                  trend={1}
                  bgColor="bg-yellow-100"
                  iconColor="text-[#F0D637]"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard
                  icon={FaChartLine}
                  label="Total Sales"
                  value={`₹${Number(stats.sales).toFixed(0)}`}
                  trend={8}
                  bgColor="bg-green-100"
                  iconColor="text-green-600"
                />
              </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FBF9E3] p-8 rounded-2xl border border-[#5B88B2]/10 shadow-md"
            >
              <h2 className="text-lg font-bold text-[#122C4F] mb-4 flex items-center gap-2">
                <FaShoppingCart className="text-[#F0D637]" size={20} />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { href: "/invoices", label: "Create Invoice", icon: FileText },
                  {
                    href: "/customers",
                    label: "Add Customer",
                    icon: Users,
                    hide: (effectiveRole || user?.role) === "sales",
                  },
                  {
                    href: "/products",
                    label: "Add Product",
                    icon: Package,
                    hide: (effectiveRole || user?.role) === "sales",
                  },
                  {
                    href: "/reports",
                    label: "View Reports",
                    icon: BarChart3,
                    hide: (effectiveRole || user?.role) === "sales",
                  },
                ]
                  .filter((a) => !a.hide)
                  .map((action, i) => (
                    <motion.a
                      key={i}
                      href={action.href}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-[#F0D637] to-[#e6c82f] text-[#122C4F] text-center font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <action.icon size={18} />
                      {action.label}
                    </motion.a>
                  ))}
                {(effectiveRole || user?.role) === "admin" && (
                  <motion.a
                    href="/setup"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-xl bg-[#122C4F] text-white text-center font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>⚙️</span>
                    Setup
                  </motion.a>
                )}
              </div>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Revenue */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1 bg-[#FBF9E3] p-6 rounded-2xl border border-[#5B88B2]/10 shadow-md"
              >
                <h2 className="text-lg font-bold text-[#122C4F] mb-4 flex items-center gap-2">
                  <FaChartLine className="text-[#5B88B2]" size={18} />
                  Monthly Revenue
                </h2>
                <div className="flex items-end justify-end gap-2 h-48">
                  {monthlyRevenue.map((m, idx) => {
                    const max = Math.max(...monthlyRevenue.map((v) => v.total), 1)
                    const h = Math.round((m.total / max) * 100)
                    return (
                      <motion.div
                        key={idx}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        whileHover={{ scaleY: 1.05 }}
                        className="flex-1 relative group"
                      >
                        <div
                          className="w-full bg-gradient-to-t from-[#F0D637] to-[#5B88B2] rounded-t-lg cursor-pointer hover:shadow-lg transition-all"
                          style={{ height: `${h}%`, minHeight: "8px" }}
                        />
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-semibold">
                          {m.label.split(" ")[0]}
                        </div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#122C4F] text-white px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-opacity">
                          ₹{(m.total / 1000).toFixed(1)}K
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Payment Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FBF9E3] p-6 rounded-2xl border border-[#5B88B2]/10 shadow-md"
              >
                <h2 className="text-lg font-bold text-[#122C4F] mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-[#5B88B2]" size={18} />
                  Payment Status
                </h2>
                <div className="flex items-center gap-6">
                  <svg width="140" height="140" viewBox="0 0 36 36">
                    {(() => {
                      const total = paymentStatus.paid + paymentStatus.partial + paymentStatus.pending || 1
                      const seg = [
                        { val: paymentStatus.paid, color: "#5B88B2", label: "Paid" },
                        { val: paymentStatus.partial, color: "#F0D637", label: "Partial" },
                        { val: paymentStatus.pending, color: "#122C4F", label: "Pending" },
                      ]
                      let start = 0
                      return seg.map((s, i) => {
                        const pct = (s.val / total) * 100
                        const dash = `${pct} ${100 - pct}`
                        const el = (
                          <motion.circle
                            key={i}
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke={s.color}
                            strokeWidth="3"
                            strokeDasharray={dash}
                            strokeDashoffset={100 - start}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                          />
                        )
                        start += pct
                        return el
                      })
                    })()}
                  </svg>
                  <div className="space-y-2">
                    {[
                      { color: "#5B88B2", label: "Paid", count: paymentStatus.paid },
                      { color: "#F0D637", label: "Partial", count: paymentStatus.partial },
                      { color: "#122C4F", label: "Pending", count: paymentStatus.pending },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium text-gray-700">
                          {item.label} <span className="font-bold text-[#122C4F]">({item.count})</span>
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Top Customers */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#FBF9E3] p-6 rounded-2xl border border-[#5B88B2]/10 shadow-md"
              >
                <h2 className="text-lg font-bold text-[#122C4F] mb-4 flex items-center gap-2">
                  <Users className="text-[#5B88B2]" size={18} />
                  Top Customers
                </h2>
                <div className="space-y-3">
                  {topCustomers.map((c, idx) => {
                    const max = Math.max(...topCustomers.map((v) => Number(v.total_spent) || 0), 1)
                    const w = Math.round(((Number(c.total_spent) || 0) / max) * 100)
                    return (
                      <motion.div
                        key={c.id || idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold text-[#122C4F]">{c.name}</span>
                          <span className="text-xs font-bold text-[#5B88B2]">
                            ₹{(Number(c.total_spent) || 0).toFixed(0)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${w}%` }}
                            transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
                            className="h-full bg-gradient-to-r from-[#5B88B2] to-[#F0D637] rounded-full"
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                  {topCustomers.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No customer data yet</p>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
