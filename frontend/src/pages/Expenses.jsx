"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { FaReceipt, FaPlus } from 'react-icons/fa'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [purchaseBills, setPurchaseBills] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    category: "",
    vendor_id: "",
    vendor: "",
    amount: "",
    gst_percent: "",
    expense_date: new Date().toISOString().split("T")[0],
    purchase_bill_id: "",
    notes: "",
  })

  useEffect(() => {
    fetchExpenses()
    fetchPurchaseBills()
  }, [])

  const fetchExpenses = async () => {
    try {
      const res = await apiClient.get("/expenses")
      setExpenses(res.data)
    } catch (err) {
      console.error("Failed to fetch expenses", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPurchaseBills = async () => {
    try {
      const res = await apiClient.get("/purchase-bills?limit=50")
      setPurchaseBills(res.data)
    } catch (err) {
      console.error("Failed to fetch purchase bills", err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post("/expenses", {
        ...formData,
        amount: Number.parseFloat(formData.amount),
        gst_percent: Number.parseFloat(formData.gst_percent),
      })
      setFormData({
        category: "",
        vendor_id: "",
        vendor: "",
        amount: "",
        gst_percent: "",
        expense_date: new Date().toISOString().split("T")[0],
        purchase_bill_id: "",
        notes: "",
      })
      setShowForm(false)
      fetchExpenses()
    } catch (err) {
      console.error("Failed to create expense", err)
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Delete this expense?")) {
      try {
        await apiClient.delete(`/expenses/${id}`)
        fetchExpenses()
      } catch (err) {
        console.error("Failed to delete expense", err)
      }
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-semibold text-blueZodiac flex items-center gap-2">
            <FaReceipt className="text-hippieBlue" size={28} /> Expenses
          </motion.h1>
          <div className="flex items-center gap-2">
            <a href="/expenses/purchase-bills" className="px-4 py-2 bg-[#5B88B2] text-white rounded-2xl hover:bg-[#4f79a0]">Purchase Bills OCR</a>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]"
            >
              <FaPlus size={16} /> Add Expense
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card card-top card-top-hippieBlue p-8">
          <h2 className="text-xl font-bold mb-4">Purchase Bills (OCR)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#FBF9E3]">
                <tr>
                  <th className="px-4 py-2 text-left">Bill #</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Vendor</th>
                  <th className="px-4 py-2 text-right">Subtotal</th>
                  <th className="px-4 py-2 text-right">Tax</th>
                  <th className="px-4 py-2 text-right">Total</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {purchaseBills.map((pb) => (
                  <tr key={pb.id} className="border-t hover:bg-[#F7F5D6]">
                    <td className="px-4 py-2">{pb.bill_number || pb.id}</td>
                    <td className="px-4 py-2">{pb.bill_date ? new Date(pb.bill_date).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-2">{pb.vendor_name || "-"}</td>
                    <td className="px-4 py-2 text-right">₹{(Number(pb.subtotal) || 0).toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">₹{(Number(pb.cgst_amount) + Number(pb.sgst_amount) + Number(pb.igst_amount)).toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">₹{(Number(pb.net_amount) || 0).toFixed(2)}</td>
                    <td className="px-4 py-2">{pb.status}</td>
                  </tr>
                ))}
                {purchaseBills.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No purchase bills found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {showForm && (
          <motion.form initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="card card-top card-top-hippieBlue p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="expense-category" className="block text-sm font-medium mb-1">Category</label>
                <input
                  id="expense-category"
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="expense-amount" className="block text-sm font-medium mb-1">Amount</label>
                <input
                  id="expense-amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="expense-gst" className="block text-sm font-medium mb-1">GST %</label>
                <input
                  id="expense-gst"
                  type="number"
                  value={formData.gst_percent}
                  onChange={(e) => setFormData({ ...formData, gst_percent: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="expense-date" className="block text-sm font-medium mb-1">Date</label>
                <input
                  id="expense-date"
                  type="date"
                  value={formData.expense_date}
                  onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="expense-vendor" className="block text-sm font-medium mb-1">Vendor</label>
                <input
                  id="expense-vendor"
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="expense-vendor-id" className="block text-sm font-medium mb-1">Vendor ID</label>
                <input
                  id="expense-vendor-id"
                  type="number"
                  value={formData.vendor_id}
                  onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="expense-purchase-bill-id" className="block text-sm font-medium mb-1">Purchase Bill ID</label>
                <input
                  id="expense-purchase-bill-id"
                  type="number"
                  value={formData.purchase_bill_id}
                  onChange={(e) => setFormData({ ...formData, purchase_bill_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="expense-notes" className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  id="expense-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  <th className="px-6 py-3 text-left font-semibold">Category</th>
                  <th className="px-6 py-3 text-left font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold">GST %</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Notes</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-t hover:bg-[#F7F5D6]">
                    <td className="px-6 py-3">{expense.category}</td>
                    <td className="px-6 py-3 font-semibold">₹{(Number(expense.amount) || 0).toFixed(2)}</td>
                    <td className="px-6 py-3">{expense.gst_percent}%</td>
                    <td className="px-6 py-3">{new Date(expense.expense_date).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{expense.notes}</td>
                    <td className="px-6 py-3">
                      <button onClick={() => handleDelete(expense.id)} className="text-red-600 hover:text-red-800">
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
