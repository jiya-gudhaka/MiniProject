"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { FaUsers, FaPlus, FaEnvelope, FaPhone } from "react-icons/fa"

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gstin: "",
    state_code: "",
    address: "",
    shipping_address: "",
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      console.log("[v0] Fetching customers from API")
      const res = await apiClient.get("/customers")
      console.log("[v0] Customers fetched:", res.data)
      setCustomers(res.data || [])
    } catch (err) {
      console.error("[v0] Failed to fetch customers:", err.response?.status, err.message)
      alert("Failed to load customers. Make sure backend is running at http://localhost:5000")
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post("/customers", formData)
      setFormData({ name: "", email: "", phone: "", gstin: "", state_code: "", address: "", shipping_address: "" })
      setShowForm(false)
      fetchCustomers()
    } catch (err) {
      console.error("Failed to create customer", err)
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Delete this customer?")) {
      try {
        console.log("[v0] Deleting customer:", id)
        await apiClient.delete(`/customers/${id}`)
        console.log("[v0] Customer deleted successfully")
        fetchCustomers()
      } catch (err) {
        console.error("[v0] Failed to delete customer:", err.response?.status, err.message)
        alert("Failed to delete customer: " + (err.response?.data?.error || err.message))
      }
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-[#122C4F] flex items-center gap-3"
          >
            <div className="p-2 bg-gradient-to-br from-[#5B88B2] to-[#122C4F] rounded-xl">
              <FaUsers className="text-[#FBF9E3]" size={32} />
            </div>
            Customers
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F0D637] to-[#e6c82f] text-[#122C4F] font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <FaPlus size={18} /> Add Customer
          </motion.button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-[#FBF9E3] p-8 rounded-2xl border-2 border-[#5B88B2]/20 shadow-lg space-y-6"
          >
            <h3 className="text-lg font-bold text-[#122C4F] mb-4">Add New Customer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <label htmlFor="customer-name" className="block text-sm font-semibold text-[#122C4F] mb-2">
                  Full Name *
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                  placeholder="John Doe"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label htmlFor="customer-email" className="block text-sm font-semibold text-[#122C4F] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-[#5B88B2] text-sm" />
                  <input
                    id="customer-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label htmlFor="customer-phone" className="block text-sm font-semibold text-[#122C4F] mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3 text-[#5B88B2] text-sm" />
                  <input
                    id="customer-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label htmlFor="customer-gstin" className="block text-sm font-semibold text-[#122C4F] mb-2">
                  GSTIN
                </label>
                <input
                  id="customer-gstin"
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                  placeholder="27AAFCT5055K1Z0"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <label htmlFor="customer-state-code" className="block text-sm font-semibold text-[#122C4F] mb-2">
                  State Code
                </label>
                <input
                  id="customer-state-code"
                  type="text"
                  value={formData.state_code}
                  onChange={(e) => setFormData({ ...formData, state_code: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                  placeholder="27"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="md:col-span-2"
              >
                <label htmlFor="customer-address" className="block text-sm font-semibold text-[#122C4F] mb-2">
                  Billing Address
                </label>
                <textarea
                  id="customer-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                  placeholder="Enter complete address"
                  rows="2"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="md:col-span-2"
              >
                <label htmlFor="customer-shipping-address" className="block text-sm font-semibold text-[#122C4F] mb-2">
                  Shipping Address
                </label>
                <textarea
                  id="customer-shipping-address"
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                  placeholder="Enter shipping address (if different from billing)"
                  rows="2"
                />
              </motion.div>
            </div>
            <div className="flex gap-3 pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#F0D637] to-[#e6c82f] text-[#122C4F] font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Save Customer
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowForm(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-400 transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </motion.form>
        )}

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-4 border-[#5B88B2]/20 border-t-[#5B88B2] rounded-full"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FBF9E3] rounded-2xl border-2 border-[#5B88B2]/10 shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#122C4F] to-[#5B88B2] text-white">
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Phone</th>
                    <th className="px-6 py-4 text-left font-semibold">GSTIN</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, idx) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-t border-gray-200 hover:bg-[#F0D637]/10 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-[#122C4F]">{customer.name}</td>
                      <td className="px-6 py-4 text-gray-700">{customer.email}</td>
                      <td className="px-6 py-4 text-gray-700">{customer.phone}</td>
                      <td className="px-6 py-4 font-mono text-sm text-[#5B88B2]">{customer.gstin || "-"}</td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(customer.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No customers yet. Add one to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
