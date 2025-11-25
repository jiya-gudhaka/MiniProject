"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Users,
  Package,
  FileText,
  CreditCard,
  TrendingDown,
  Calculator,
  BarChart3,
  User,
  Settings,
  Building2,
} from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Layout({ children }) {
  const { logout, user, effectiveRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const role = effectiveRole || user?.role || "accountant"

  const allNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/customers", label: "Customers", icon: Users },
    { path: "/products", label: "Products", icon: Package },
    { path: "/invoices", label: "Invoices", icon: FileText },
    { path: "/payments", label: "Payments", icon: CreditCard },
    { path: "/expenses", label: "Expenses", icon: TrendingDown },
    { path: "/tax", label: "Tax Returns", icon: Calculator },
    { path: "/reports", label: "Reports", icon: BarChart3 },
  ]

  const iconItems = [
    { path: "/profile", label: "Profile", icon: User },
    ...(role === "admin"
      ? [
          { path: "/settings/backup", label: "Settings", icon: Settings },
          { path: "/setup", label: "Organization", icon: Building2 },
        ]
      : []),
  ]

  // Filter items based on role
  const getFilteredNavItems = () => {
    return allNavItems.filter((item) => {
      if (role === "sales" && ["/tax", "/expenses", "/reports"].includes(item.path)) {
        return false
      }
      return true
    })
  }

  const filteredNavItems = getFilteredNavItems()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ffffffff" }}>
      <header
        className="sticky top-0 z-50 border-b border-gray-200/50"
        style={{ backgroundColor: "#122C4F", boxShadow: "0 4px 12px rgba(18, 44, 79, 0.08)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src=".\logo.png" alt="InvoSmart" className="w-12" />
              <h1 className="text-lg font-bold text-white tracking-tight hidden sm:block">InvoSmart</h1>
            </motion.div>

            {/* Desktop Navigation - Centered with Vertical Icons */}
            <nav className="hidden lg:flex items-center justify-center gap-0.5 flex-1">
              {filteredNavItems.map((item, index) => {
                const Icon = item.icon
                const active = isActive(item.path)

                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(item.path)}
                      className={`flex flex-col items-center justify-center px-2 py-2 rounded-xl transition-all gap-1 ${
                        active ? "text-gray-800" : "text-white/70 hover:text-white"
                      }`}
                      style={active ? { backgroundColor: "#F0D637" } : {}}
                    >
                      <Icon size={20} />
                      <span className="text-xs font-medium leading-tight">{item.label}</span>
                    </motion.button>
                  </motion.div>
                )
              })}
            </nav>

            {/* Right Side Icons */}
            <div className="hidden lg:flex items-center gap-1">
              {iconItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)

                return (
                  <motion.button
                    key={item.path}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(item.path)}
                    className={`p-2 rounded-lg transition-all ${
                      active ? "text-gray-800" : "text-white hover:bg-white/10"
                    }`}
                    style={active ? { backgroundColor: "#F0D637" } : {}}
                    title={item.label}
                  >
                    <Icon size={20} />
                  </motion.button>
                )
              })}

              <div className="w-px h-6 bg-white/20 mx-1" />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all"
                style={{ backgroundColor: "#F0D637", color: "#122C4F" }}
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden px-4 pb-4"
            >
              <div
                className="rounded-2xl p-3 border border-white/10 space-y-2"
                style={{ backgroundColor: "rgba(18, 44, 79, 0.95)" }}
              >
                {/* Main Navigation Items */}
                {filteredNavItems.map((item, index) => {
                  const Icon = item.icon
                  const active = isActive(item.path)

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          active ? "text-gray-800" : "text-white/80 hover:text-white hover:bg-white/5"
                        }`}
                        style={active ? { backgroundColor: "#F0D637" } : {}}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  )
                })}

                {/* Icon Items Section */}
                <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                  {iconItems.map((item, index) => {
                    const Icon = item.icon
                    const active = isActive(item.path)

                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: (filteredNavItems.length + index) * 0.05 }}
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            active ? "text-gray-800" : "text-white/80 hover:text-white hover:bg-white/5"
                          }`}
                          style={active ? { backgroundColor: "#F0D637" } : {}}
                          onClick={() => setMenuOpen(false)}
                        >
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Logout Button */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: (filteredNavItems.length + iconItems.length) * 0.05 }}
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mt-2"
                  style={{ backgroundColor: "#F0D637", color: "#122C4F" }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">{children}</main>
    </div>
  )
}
