"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { motion } from "framer-motion"
import { FaFileInvoice, FaEdit, FaCheck, FaTimes } from "react-icons/fa"

export default function InvoicePreview() {
  const { id } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ issue_date: "", due_date: "" })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get(`/invoices/${id}`)
        setInvoice(res.data)
        setEditForm({
          issue_date: res.data?.issue_date ? new Date(res.data.issue_date).toISOString().split("T")[0] : "",
          due_date: res.data?.due_date ? new Date(res.data.due_date).toISOString().split("T")[0] : "",
        })
      } catch (e) {
        setInvoice(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const saveDates = async () => {
    try {
      const res = await apiClient.put(`/invoices/${id}/dates`, {
        issue_date: editForm.issue_date || null,
        due_date: editForm.due_date || null,
      })
      setInvoice(res.data)
      setEditing(false)
    } catch (e) {
      alert(e.response?.data?.error || e.message)
    }
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
            <FaFileInvoice className="text-[#FBF9E3]" size={32} />
          </div>
          Invoice Preview
        </motion.h1>

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
        ) : invoice ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FBF9E3] p-8 rounded-2xl border-2 border-[#5B88B2]/10 shadow-lg space-y-6"
          >
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-6 p-6 bg-gradient-to-r from-[#122C4F]/5 to-[#5B88B2]/5 rounded-xl">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <label className="text-sm font-semibold text-gray-600">Invoice Number</label>
                <p className="text-lg font-bold text-[#122C4F]">{invoice.invoice_number}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label className="text-sm font-semibold text-gray-600">Date</label>
                <p className="text-lg font-bold text-[#5B88B2]">{new Date(invoice.issue_date).toLocaleDateString()}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label className="text-sm font-semibold text-gray-600">Customer</label>
                <p className="text-lg font-bold text-[#122C4F]">{invoice.customer_name || "N/A"}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label className="text-sm font-semibold text-gray-600">Status</label>
                <span
                  className={`inline-block px-3 py-1 rounded-lg font-semibold text-sm ${
                    invoice.payment_status === "paid"
                      ? "bg-green-100 text-green-700"
                      : invoice.payment_status === "partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {invoice.payment_status}
                </span>
              </motion.div>
            </div>

            {/* Edit Dates Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-[#F0D637]/10 border-2 border-[#F0D637]/30 rounded-xl"
            >
              {!editing ? (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Issue Date:{" "}
                      <span className="font-bold text-[#122C4F]">
                        {new Date(invoice.issue_date).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Due Date:{" "}
                      <span className="font-bold text-[#122C4F]">
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F0D637] to-[#e6c82f] text-[#122C4F] font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    <FaEdit size={16} /> Edit Dates
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-[#122C4F] mb-1">Issue Date</label>
                      <input
                        type="date"
                        value={editForm.issue_date}
                        onChange={(e) => setEditForm({ ...editForm, issue_date: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#122C4F] mb-1">Due Date</label>
                      <input
                        type="date"
                        value={editForm.due_date}
                        onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={saveDates}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all"
                    >
                      <FaCheck size={16} /> Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition-all"
                    >
                      <FaTimes size={16} /> Cancel
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Items Table */}
            {invoice.items && invoice.items.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <h3 className="text-lg font-bold text-[#122C4F] mb-3">Items</h3>
                <div className="border-2 border-[#5B88B2]/20 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#122C4F] to-[#5B88B2] text-white">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Description</th>
                        <th className="px-4 py-3 text-right font-semibold">Qty</th>
                        <th className="px-4 py-3 text-right font-semibold">Price</th>
                        <th className="px-4 py-3 text-right font-semibold">GST %</th>
                        <th className="px-4 py-3 text-right font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, idx) => (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + idx * 0.05 }}
                          className="border-t border-[#5B88B2]/10 hover:bg-[#F0D637]/10 transition-colors"
                        >
                          <td className="px-4 py-3 font-semibold text-[#122C4F]">{item.description || "Item"}</td>
                          <td className="px-4 py-3 text-right text-gray-700">
                            {Number(item.qty ?? item.quantity ?? 1)}
                          </td>
                          <td className="px-4 py-3 text-right text-[#5B88B2] font-semibold">
                            ₹{Number(item.price ?? item.unit_price ?? 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-700">
                            {Number(item.applied_gst_rate ?? item.gst_rate ?? 0)}%
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-[#122C4F]">
                            ₹
                            {(
                              Number(item.qty ?? item.quantity ?? 1) * Number(item.price ?? item.unit_price ?? 0)
                            ).toFixed(2)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-end"
            >
              <div className="w-80 space-y-2 p-4 bg-gradient-to-br from-[#F0D637]/10 to-[#5B88B2]/10 rounded-xl border-2 border-[#5B88B2]/20">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-semibold">Taxable Value:</span>
                  <span className="font-bold text-[#122C4F]">₹{(Number(invoice.taxable_value) || 0).toFixed(2)}</span>
                </div>
                {invoice.cgst_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">CGST:</span>
                    <span className="text-[#5B88B2] font-semibold">
                      ₹{(Number(invoice.cgst_amount) || 0).toFixed(2)}
                    </span>
                  </div>
                )}
                {invoice.sgst_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">SGST:</span>
                    <span className="text-[#5B88B2] font-semibold">
                      ₹{(Number(invoice.sgst_amount) || 0).toFixed(2)}
                    </span>
                  </div>
                )}
                {invoice.igst_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">IGST:</span>
                    <span className="text-[#5B88B2] font-semibold">
                      ₹{(Number(invoice.igst_amount) || 0).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t-2 border-[#5B88B2]/20 pt-3">
                  <span className="text-[#122C4F]">Total:</span>
                  <span className="text-transparent bg-gradient-to-r from-[#F0D637] to-[#122C4F] bg-clip-text">
                    ₹{(Number(invoice.net_amount) || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl text-center font-semibold"
          >
            Invoice not found
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
