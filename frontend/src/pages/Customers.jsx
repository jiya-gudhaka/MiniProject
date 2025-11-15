"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { Plus, Trash2 } from 'lucide-react'

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
      setFormData({ name: "", email: "", phone: "", gstin: "", state_code: "", address: "" })
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
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} /> Add Customer
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="GSTIN"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="State Code"
                value={formData.state_code}
                onChange={(e) => setFormData({ ...formData, state_code: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
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
          </form>
        )}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
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
                  <tr key={customer.id} className="border-t hover:bg-gray-50">
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
          </div>
        )}
      </div>
    </Layout>
  )
}
