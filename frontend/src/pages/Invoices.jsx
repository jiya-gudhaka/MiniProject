"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { Plus, Eye } from "lucide-react"

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    customer_id: "",
    invoice_type: "GST",
    issue_date: new Date().toISOString().split("T")[0],
    payment_status: "pending",
    items: [],
  })
  const [currentItem, setCurrentItem] = useState({
    product_id: "",
    description: "",
    qty: 1,
    price: 0,
    applied_gst_rate: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inv, cust, prod] = await Promise.all([
          apiClient.get("/invoices"),
          apiClient.get("/customers"),
          apiClient.get("/products"),
        ])
        setInvoices(inv.data)
        setCustomers(cust.data)
        setProducts(prod.data)
      } catch (err) {
        console.error("Failed to fetch data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAddItem = () => {
    if (currentItem.description && currentItem.qty > 0 && currentItem.price > 0) {
      setFormData({
        ...formData,
        items: [...formData.items, { ...currentItem, product_id: Number.parseInt(currentItem.product_id) || null }],
      })
      setCurrentItem({ product_id: "", description: "", qty: 1, price: 0, applied_gst_rate: 0 })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.customer_id || formData.items.length === 0) {
      alert("Please select customer and add items")
      return
    }
    try {
      await apiClient.post("/invoices", {
        ...formData,
        customer_id: Number.parseInt(formData.customer_id),
        items: formData.items.map((item) => ({
          ...item,
          applied_gst_rate: Number.parseFloat(item.applied_gst_rate),
          qty: Number.parseFloat(item.qty),
          price: Number.parseFloat(item.price),
        })),
      })
      setFormData({
        customer_id: "",
        invoice_type: "GST",
        issue_date: new Date().toISOString().split("T")[0],
        payment_status: "pending",
        items: [],
      })
      setShowForm(false)
      const res = await apiClient.get("/invoices")
      setInvoices(res.data)
    } catch (err) {
      console.error("Failed to create invoice", err)
      alert("Failed to create invoice: " + (err.response?.data?.error || err.message))
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} /> Create Invoice
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer</label>
                <select
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.invoice_type}
                  onChange={(e) => setFormData({ ...formData, invoice_type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>GST</option>
                  <option>Non-GST</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Add Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3">
                <select
                  value={currentItem.product_id}
                  onChange={(e) => setCurrentItem({ ...currentItem, product_id: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={currentItem.qty}
                  onChange={(e) => setCurrentItem({ ...currentItem, qty: Number.parseFloat(e.target.value) })}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={currentItem.price}
                  onChange={(e) => setCurrentItem({ ...currentItem, price: Number.parseFloat(e.target.value) })}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="GST %"
                  value={currentItem.applied_gst_rate}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, applied_gst_rate: Number.parseFloat(e.target.value) })
                  }
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  Add
                </button>
              </div>

              {formData.items.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm max-h-48 overflow-y-auto">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1">
                      <span>{item.description || "Item"}</span>
                      <span>₹{(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Create Invoice
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
                  <th className="px-6 py-3 text-left font-semibold">Invoice</th>
                  <th className="px-6 py-3 text-left font-semibold">Customer</th>
                  <th className="px-6 py-3 text-left font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-sm">{inv.invoice_number}</td>
                    <td className="px-6 py-3">{inv.customer_name}</td>
                    <td className="px-6 py-3 font-semibold">₹{inv.net_amount?.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          inv.payment_status === "paid"
                            ? "bg-green-100 text-green-800"
                            : inv.payment_status === "partial"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {inv.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-3">{new Date(inv.issue_date).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={18} />
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
