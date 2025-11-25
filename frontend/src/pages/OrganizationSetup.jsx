"use client"

import { useEffect, useRef, useState } from "react"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import { FaBuilding, FaMapMarkerAlt, FaUsers, FaImage } from "react-icons/fa"

export default function OrganizationSetup() {
  const { user, login } = useAuth()
  const [orgData, setOrgData] = useState({
    name: "",
    gst_number: "",
    address: "",
    locale: "en-IN",
  })
  const [branchData, setBranchData] = useState({
    name: "",
    address: "",
    gst_number: "",
  })
  const [multiBranch, setMultiBranch] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [branches, setBranches] = useState([])
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "accountant",
    password: "",
    branchId: "",
  })
  const userSetupRef = useRef(null)

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const res = await apiClient.get("/branches")
        setBranches(res.data || [])
      } catch (e) {
        // silently ignore
      }
    }
    loadBranches()
  }, [])

  const handleRegisterOrg = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await apiClient.post("/organizations", orgData)
      if (res.status !== 201) throw new Error("Failed to create organization")
      const org = res.data
      try {
        const linkRes = await apiClient.put("/auth/me/organization", { organizationId: org.id, branchId: null })
        if (linkRes?.data?.token && linkRes?.data?.user) {
          login(linkRes.data.user, linkRes.data.token)
        }
      } catch (e) {
        // non-blocking; user can still proceed to add users
      }
      alert("Organization created and linked to your account. Now add your users.")
      setTimeout(() => {
        userSetupRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 200)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    setError("")
    if (!user?.organization_id) {
      setError("Missing organization context. Please login again.")
      return
    }
    try {
      const payload = {
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
        organizationId: user.organization_id,
        branchId: userForm.branchId || null,
        phone: userForm.phone,
        locale: "en-IN",
      }
      const res = await apiClient.post("/auth/register", payload)
      if (res.status !== 201) throw new Error("Failed to create user")
      alert(`User created: ${res.data.user?.email}`)
      setUserForm({ name: "", email: "", phone: "", role: "accountant", password: "", branchId: "" })
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    }
  }

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
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-[#122C4F] flex items-center gap-3"
        >
          <div className="p-2 bg-gradient-to-br from-[#5B88B2] to-[#122C4F] rounded-xl">
            <FaBuilding className="text-[#FBF9E3]" size={32} />
          </div>
          Organization Setup
        </motion.h1>

        {user?.role === "admin" ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {error && (
              <motion.div
                variants={itemVariants}
                className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl flex items-center gap-2"
              >
                <span className="text-lg">⚠️</span>
                {error}
              </motion.div>
            )}

            {!user?.organization_id && (
              <motion.div
                variants={itemVariants}
                className="bg-[#FBF9E3] p-8 rounded-2xl border-2 border-[#5B88B2]/10 shadow-lg space-y-6"
              >
                <h2 className="text-lg font-bold text-[#122C4F] flex items-center gap-2">
                  <FaBuilding className="text-[#5B88B2]" size={20} />
                  Create Business Account
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label htmlFor="org-name" className="block text-sm font-semibold text-[#122C4F] mb-2">
                      Business Name *
                    </label>
                    <input
                      id="org-name"
                      type="text"
                      value={orgData.name}
                      onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                      placeholder="Your Company Name"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label htmlFor="org-gst" className="block text-sm font-semibold text-[#122C4F] mb-2">
                      GSTIN
                    </label>
                    <input
                      id="org-gst"
                      type="text"
                      value={orgData.gst_number}
                      onChange={(e) => setOrgData({ ...orgData, gst_number: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                      placeholder="27AAFCT5055K1Z0"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-2"
                  >
                    <label htmlFor="org-address" className="block text-sm font-semibold text-[#122C4F] mb-2">
                      Business Address
                    </label>
                    <textarea
                      id="org-address"
                      value={orgData.address}
                      onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                      placeholder="Enter complete business address"
                      rows="2"
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Primary Branch */}
            <motion.div
              variants={itemVariants}
              className="bg-[#FBF9E3] p-8 rounded-2xl border-2 border-[#5B88B2]/10 shadow-lg space-y-6"
            >
              <h2 className="text-lg font-bold text-[#122C4F] flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#5B88B2]" size={20} />
                Primary Branch
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <label htmlFor="branch-name" className="block text-sm font-semibold text-[#122C4F] mb-2">
                    Branch Name
                  </label>
                  <input
                    id="branch-name"
                    type="text"
                    value={branchData.name}
                    onChange={(e) => setBranchData({ ...branchData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                    placeholder="Main Branch"
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <label htmlFor="branch-gst" className="block text-sm font-semibold text-[#122C4F] mb-2">
                    Branch GSTIN
                  </label>
                  <input
                    id="branch-gst"
                    type="text"
                    value={branchData.gst_number}
                    onChange={(e) => setBranchData({ ...branchData, gst_number: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                    placeholder="27AAFCT5055K1Z0"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="md:col-span-2"
                >
                  <label htmlFor="branch-address" className="block text-sm font-semibold text-[#122C4F] mb-2">
                    Branch Address
                  </label>
                  <textarea
                    id="branch-address"
                    value={branchData.address}
                    onChange={(e) => setBranchData({ ...branchData, address: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                    placeholder="Enter branch address"
                    rows="2"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Branding & Settings */}
            <motion.div
              variants={itemVariants}
              className="bg-[#FBF9E3] p-8 rounded-2xl border-2 border-[#5B88B2]/10 shadow-lg space-y-6"
            >
              <h2 className="text-lg font-bold text-[#122C4F] flex items-center gap-2">
                <FaImage className="text-[#5B88B2]" size={20} />
                Branding & Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <label htmlFor="org-logo" className="block text-sm font-semibold text-[#122C4F] mb-2">
                    Upload Logo (optional)
                  </label>
                  <input
                    id="org-logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                  />
                  {logoFile && <p className="mt-2 text-xs text-gray-600 font-semibold">✓ Selected: {logoFile.name}</p>}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-end"
                >
                  <label className="inline-flex items-center gap-3 p-3 bg-gradient-to-r from-[#F0D637]/20 to-[#5B88B2]/20 rounded-xl border-2 border-[#5B88B2]/20 cursor-pointer hover:border-[#5B88B2]/50 transition-all">
                    <input
                      type="checkbox"
                      checked={multiBranch}
                      onChange={(e) => setMultiBranch(e.target.checked)}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-[#122C4F]">Enable Multi-Branch Support</span>
                  </label>
                </motion.div>
              </div>
            </motion.div>

            {/* Complete Setup Button */}
            <motion.div variants={itemVariants} className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRegisterOrg}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-[#F0D637] to-[#e6c82f] text-[#122C4F] font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Complete Setup"}
              </motion.button>
            </motion.div>

            {/* User Setup Section */}
            <motion.div
              ref={userSetupRef}
              variants={itemVariants}
              className="bg-[#FBF9E3] p-8 rounded-2xl border-2 border-[#5B88B2]/10 shadow-lg space-y-6 pt-8 border-t-4 border-t-[#F0D637]"
            >
              <h2 className="text-lg font-bold text-[#122C4F] flex items-center gap-2">
                <FaUsers className="text-[#5B88B2]" size={20} />
                User Setup
              </h2>
              <p className="text-sm text-gray-600">
                Add accountants or sales staff. This option is always available here.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <label htmlFor="user-name" className="block text-sm font-semibold text-[#122C4F] mb-2">
                    Full Name
                  </label>
                  <input
                    id="user-name"
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                    placeholder="John Doe"
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <label htmlFor="user-email" className="block text-sm font-semibold text-[#122C4F] mb-2">
                    Email Address
                  </label>
                  <input
                    id="user-email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <label htmlFor="user-phone" className="block text-sm font-semibold text-[#122C4F] mb-2">
                    Phone Number
                  </label>
                  <input
                    id="user-phone"
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <label htmlFor="user-role" className="block text-sm font-semibold text-[#122C4F] mb-2">
                    Role
                  </label>
                  <select
                    id="user-role"
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                  >
                    <option value="accountant">Accountant</option>
                    <option value="sales">Sales Staff</option>
                  </select>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <label htmlFor="user-branch" className="block text-sm font-semibold text-[#122C4F] mb-2">
                    Branch (optional)
                  </label>
                  <select
                    id="user-branch"
                    value={userForm.branchId}
                    onChange={(e) => setUserForm({ ...userForm, branchId: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                  >
                    <option value="">Select Branch</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                  <label htmlFor="user-password" className="block text-sm font-semibold text-[#122C4F] mb-2">
                    Password
                  </label>
                  <input
                    id="user-password"
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                    placeholder="••••••••"
                  />
                </motion.div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateUser}
                className="px-8 py-3 bg-gradient-to-r from-[#5B88B2] to-[#122C4F] text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Add User
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-yellow-50 border-2 border-yellow-200 text-yellow-800 rounded-2xl font-semibold flex items-center gap-3"
          >
            <span className="text-2xl">🔒</span>
            Only admins can set up the organization.
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
