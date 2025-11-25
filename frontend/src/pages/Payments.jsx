"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { motion } from "framer-motion"
import { FaMoneyCheckAlt, FaCreditCard, FaExchangeAlt } from "react-icons/fa"

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [recordOpen, setRecordOpen] = useState(false)
  const [form, setForm] = useState({ invoice_id: "", method: "UPI", provider: "Razorpay", txn_id: "", amount: "" })
  const [error, setError] = useState("")

  const load = async () => {
    try {
      const res = await apiClient.get("/payments")
      setPayments(res.data || [])
    } catch (e) {
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const recordPayment = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const payload = {
        invoice_id: Number(form.invoice_id),
        method: form.method,
        provider: form.provider,
        txn_id: form.txn_id || undefined,
        status: "success",
        amount: Number.parseFloat(form.amount),
      }
      await apiClient.post("/payments", payload)
      setForm({ invoice_id: "", method: "UPI", provider: "Razorpay", txn_id: "", amount: "" })
      setRecordOpen(false)
      load()
    } catch (e) {
      setError(e.response?.data?.error || e.message)
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
              <FaMoneyCheckAlt className="text-[#FBF9E3]" size={32} />
            </div>
            Payments
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setRecordOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F0D637] to-[#e6c82f] text-[#122C4F] font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <FaExchangeAlt size={18} /> Record Payment
          </motion.button>
        </div>

        {recordOpen && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={recordPayment}
            className="bg-[#FBF9E3] p-8 rounded-2xl border-2 border-[#5B88B2]/20 shadow-lg space-y-6"
          >
            <h3 className="text-lg font-bold text-[#122C4F] mb-4 flex items-center gap-2">
              <FaCreditCard className="text-[#5B88B2]" size={20} />
              Record New Payment
            </h3>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl flex items-center gap-2"
              >
                <span className="text-lg">⚠️</span>
                {error}
              </motion.div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <label className="block text-sm font-semibold text-[#122C4F] mb-2">Invoice ID *</label>
                <input
                  type="number"
                  value={form.invoice_id}
                  onChange={(e) => setForm({ ...form, invoice_id: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                  placeholder="Invoice ID"
                  required
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-sm font-semibold text-[#122C4F] mb-2">Payment Method</label>
                <select
                  value={form.method}
                  onChange={(e) => setForm({ ...form, method: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                >
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                  <option>Wallet</option>
                  <option>Card</option>
                </select>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label className="block text-sm font-semibold text-[#122C4F] mb-2">Payment Provider</label>
                <select
                  value={form.provider}
                  onChange={(e) => setForm({ ...form, provider: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                >
                  <option>Razorpay</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Paytm</option>
                  <option>Google Pay</option>
                </select>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label className="block text-sm font-semibold text-[#122C4F] mb-2">Amount (₹) *</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                  placeholder="0.00"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="md:col-span-2"
              >
                <label className="block text-sm font-semibold text-[#122C4F] mb-2">Transaction ID / Reference</label>
                <input
                  type="text"
                  value={form.txn_id}
                  onChange={(e) => setForm({ ...form, txn_id: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                  placeholder="Optional transaction ID"
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
                Record Payment
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setRecordOpen(false)}
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
                    <th className="px-4 py-4 text-left font-semibold">Invoice #</th>
                    <th className="px-4 py-4 text-left font-semibold">Customer</th>
                    <th className="px-4 py-4 text-left font-semibold">Amount</th>
                    <th className="px-4 py-4 text-left font-semibold">Due Date</th>
                    <th className="px-4 py-4 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, idx) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-t border-gray-200 hover:bg-[#F0D637]/10 transition-colors"
                    >
                      <td className="px-4 py-4 font-mono font-semibold text-[#122C4F]">{p.invoice_number}</td>
                      <td className="px-4 py-4 text-gray-700">{p.customer_name || "-"}</td>
                      <td className="px-4 py-4 font-bold text-[#5B88B2]">₹{(Number(p.amount) || 0).toFixed(2)}</td>
                      <td className="px-4 py-4 text-gray-700">
                        {p.due_date ? new Date(p.due_date).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-lg font-semibold text-xs ${
                            p.display_status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : p.display_status === "Partial"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {p.display_status || p.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No payments recorded yet
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
