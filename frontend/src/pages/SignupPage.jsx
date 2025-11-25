"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import apiClient from "../components/ApiClient"
import { motion } from "framer-motion"
import { FaUser, FaArrowRight } from "react-icons/fa"

export default function SignupPage() {
  const [businessName, setBusinessName] = useState("")
  const [gstin, setGstin] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [locale, setLocale] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const res = await apiClient.post("/auth/register", {
        name: ownerName,
        email,
        password,
        role: "admin",
        organizationId: 1,
        branchId: 1,
        locale,
        phone,
        businessName,
        gstin,
      })
      login(res.data.user, res.data.token)
      navigate("/setup")
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#122C4F] via-white to-[#FBF9E3] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="bg-[#FBF9E3] p-8 rounded-3xl shadow-lg border border-slate-200">
          {/* Header */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              className="inline-block p-3 bg-gradient-to-br from-[#122C4F] to-[#5B88B2] rounded-2xl mb-4"
            >
              <FaUser className="text-[#F0D637]" size={24} />
            </motion.div>
            <h2 className="text-3xl font-bold text-[#122C4F] mb-2">Create Account</h2>
            <p className="text-sm text-slate-600">Start managing your business today</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-100 text-red-800 rounded-xl border border-red-300 text-sm font-medium"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business Name */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <label className="block text-sm font-semibold text-[#122C4F] mb-2">Business Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full pl-4 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B88B2] outline-none bg-white transition-all"
                  placeholder="Acme Pvt Ltd"
                />
              </div>
            </motion.div>

            {/* GSTIN */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <label className="block text-sm font-semibold text-[#122C4F] mb-2">GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B88B2] outline-none bg-white transition-all"
                placeholder="22AAAAA0000A1Z5"
              />
            </motion.div>

            {/* Owner Name and Phone */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-sm font-semibold text-[#122C4F] mb-2">Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B88B2] outline-none bg-white transition-all"
                  placeholder="John Doe"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <label className="block text-sm font-semibold text-[#122C4F] mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B88B2] outline-none bg-white transition-all"
                  placeholder="9876543210"
                />
              </motion.div>
            </div>

            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-semibold text-[#122C4F] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B88B2] outline-none bg-white transition-all"
                placeholder="your@email.com"
              />
            </motion.div>

            {/* Locale */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <label className="block text-sm font-semibold text-[#122C4F] mb-2">Locale</label>
              <input
                type="text"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B88B2] outline-none bg-white transition-all"
                placeholder="en-IN"
              />
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-sm font-semibold text-[#122C4F] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B88B2] outline-none bg-white transition-all"
                placeholder="••••••••"
              />
            </motion.div>

            {/* Confirm Password */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
              <label className="block text-sm font-semibold text-[#122C4F] mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B88B2] outline-none bg-white transition-all"
                placeholder="••••••••"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#F0D637] to-[#e6c82f] text-[#122C4F] font-bold rounded-full hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Sign Up <FaArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-sm text-slate-600"
          >
            Already have an account?{" "}
            <Link to="/login" className="text-[#5B88B2] hover:text-[#122C4F] font-bold transition-colors">
              Login
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
