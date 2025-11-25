"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import apiClient from "../components/ApiClient"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FaEnvelope, FaLock, FaUser, FaShieldAlt } from "react-icons/fa"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, setRole, effectiveRole } = useAuth()
  const [selectedRole, setSelectedRole] = useState("accountant")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await apiClient.post("/auth/login", { email, password })
      login(res.data.user, res.data.token)
      setRole(selectedRole)
      if (selectedRole === "admin") navigate("/setup")
      else navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.error || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    { value: "admin", label: "Admin", icon: FaShieldAlt },
    { value: "accountant", label: "Accountant", icon: FaUser },
    { value: "sales", label: "Sales", icon: FaUser },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#122C4F] via-white to-[#FBF9E3] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#FBF9E3] p-10 rounded-3xl shadow-2xl border border-[#5B88B2]/10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-[#122C4F] to-[#5B88B2] rounded-2xl">
                <FaUser className="text-white" size={32} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#122C4F] mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-600">Sign in to your account</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-2 text-sm"
            >
              <span className="text-lg">⚠️</span>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-semibold text-[#122C4F] mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5B88B2] text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-sm font-semibold text-[#122C4F] mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5B88B2] text-sm" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            {/* Role Selection */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <label className="block text-sm font-semibold text-[#122C4F] mb-3">Login As</label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map(({ value, label, icon: Icon }) => (
                  <label
                    key={value}
                    className={`relative flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRole === value
                        ? "border-[#F0D637] bg-[#F0D637]/10"
                        : "border-gray-200 hover:border-[#5B88B2]/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="login-role"
                      value={value}
                      checked={selectedRole === value}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="hidden"
                    />
                    <Icon className={selectedRole === value ? "text-[#122C4F]" : "text-gray-400"} size={16} />
                    <span
                      className={`text-xs font-semibold ${selectedRole === value ? "text-[#122C4F]" : "text-gray-600"}`}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#F0D637] to-[#e6c82f] text-[#122C4F] font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-[#5B88B2] hover:text-[#122C4F] transition-colors">
              Sign Up
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
