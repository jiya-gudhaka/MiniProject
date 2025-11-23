"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Layout({ children }) {
  const { logout, user, effectiveRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const role = effectiveRole || user?.role || "accountant"
  const baseItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/customers", label: "Customers" },
    { path: "/products", label: "Products" },
    { path: "/invoices", label: "Invoices" },
  ]
  const accountantExtras = [{ path: "/payments", label: "Payments" }, { path: "/expenses", label: "Expenses" }, { path: "/tax", label: "Tax" }, { path: "/reports", label: "Reports" }, { path: "/profile", label: "Profile" }]
  const adminExtras = [{ path: "/payments", label: "Payments" }, { path: "/expenses", label: "Expenses" }, { path: "/tax", label: "Tax" }, { path: "/reports", label: "Reports" }, { path: "/settings/backup", label: "Settings" }, { path: "/setup", label: "Organization Setup" }, { path: "/profile", label: "Profile" }]
  const salesExtras = [{ path: "/payments", label: "Payments" }, { path: "/customers", label: "Customers" }, { path: "/profile", label: "Profile" }]
  const menuItems = role === "admin" ? [...baseItems, ...adminExtras] : role === "sales" ? [...baseItems, ...salesExtras] : [...baseItems, ...accountantExtras]

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blueZodiac text-white shadow-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">INVOSMART</h1>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                  location.pathname === item.path ? "bg-goldenDream text-blueZodiac" : "hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-2 rounded-2xl bg-goldenDream text-blueZodiac text-sm font-semibold hover:bg-[#e6c82f] flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </nav>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-4 pb-3">
            <div className="rounded-2xl bg-blueZodiac/90 border border-white/10 overflow-hidden">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 text-sm ${
                    location.pathname === item.path ? "bg-goldenDream text-blueZodiac" : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm bg-goldenDream text-blueZodiac font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>
    </div>
  )
}
