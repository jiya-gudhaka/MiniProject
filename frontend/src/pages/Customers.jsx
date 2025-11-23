"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { FaUsers, FaPlus } from 'react-icons/fa'

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
        <div className="flex justify-between items-center">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-semibold text-blueZodiac flex items-center gap-2">
            <FaUsers className="text-hippieBlue" size={28} /> Customers
          </motion.h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]"
          >
            <FaPlus size={16} /> Add Customer
          </button>
        </div>

        {showForm && (
          <motion.form initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="card card-top card-top-hippieBlue p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customer-name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  id="customer-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="customer-email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  id="customer-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="customer-phone" className="block text-sm font-medium mb-1">Phone</label>
                <input
                  id="customer-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="customer-gstin" className="block text-sm font-medium mb-1">GSTIN</label>
                <input
                  id="customer-gstin"
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="customer-state-code" className="block text-sm font-medium mb-1">State Code</label>
                <input
                  id="customer-state-code"
                  type="text"
                  value={formData.state_code}
                  onChange={(e) => setFormData({ ...formData, state_code: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="customer-address" className="block text-sm font-medium mb-1">Billing Address</label>
                <input
                  id="customer-address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="customer-shipping-address" className="block text-sm font-medium mb-1">Shipping Address</label>
                <input
                  id="customer-shipping-address"
                  type="text"
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]">
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card card-top card-top-hippieBlue overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Email</th>
                  <th className="px-6 py-3 text-left font-semibold">Phone</th>
                  <th className="px-6 py-3 text-left font-semibold">GSTIN</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-t hover:bg-[#F7F5D6]">
                    <td className="px-6 py-3">{customer.name}</td>
                    <td className="px-6 py-3">{customer.email}</td>
                    <td className="px-6 py-3">{customer.phone}</td>
                    <td className="px-6 py-3">{customer.gstin}</td>
                    <td className="px-6 py-3">
                      <button onClick={() => handleDelete(customer.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
