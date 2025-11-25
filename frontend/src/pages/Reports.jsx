"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { motion } from "framer-motion"
import { FaChartBar, FaChartLine, FaUsers, FaDownload, FaEye, FaTimes } from "react-icons/fa"

export default function Reports() {
  const [reports, setReports] = useState({
    sales: {},
    tax: {},
    topCustomers: [],
    expenses: [],
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ start: "", end: "", branch: "" })
  const [preview, setPreview] = useState({ type: "", headers: [], rows: [], visible: false })

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [sales, tax, customers, expenses] = await Promise.all([
          apiClient.get("/reports/sales/summary"),
          apiClient.get("/reports/tax/liability"),
          apiClient.get("/reports/customers/top"),
          apiClient.get("/reports/expenses/summary"),
        ])

        setReports({
          sales: sales.data,
          tax: tax.data,
          topCustomers: customers.data,
          expenses: expenses.data,
        })
      } catch (err) {
        console.error("Failed to fetch reports", err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const exportCSV = async (type) => {
    const params = new URLSearchParams()
    if (filters.start) params.append("start", filters.start)
    if (filters.end) params.append("end", filters.end)
    if (filters.branch) params.append("branch", filters.branch)
    const url = `/reports/export/${type}?${params.toString()}`
    const resp = await apiClient.get(url, { responseType: "blob" })
    const text = await resp.data.text()
    const lines = text.split(/\r?\n/).filter(Boolean)
    const headers = lines[0]?.split(",") || []
    const rows = lines.slice(1).map((l) => l.split(","))
    setPreview({ type, headers, rows, visible: true })
  }

  const downloadCSV = async () => {
    if (!preview.type) return
    const params = new URLSearchParams()
    if (filters.start) params.append("start", filters.start)
    if (filters.end) params.append("end", filters.end)
    if (filters.branch) params.append("branch", filters.branch)
    const url = `/reports/export/${preview.type}?${params.toString()}`
    const resp = await apiClient.get(url, { responseType: "blob" })
    const blobUrl = window.URL.createObjectURL(new Blob([resp.data]))
    const a = document.createElement("a")
    a.href = blobUrl
    a.download =
      preview.type === "sales-register"
        ? "Sales_Register_2025.csv"
        : preview.type === "gstr1"
          ? "GSTR1_Data.csv"
          : preview.type === "payment-register"
            ? "Payment_Register.csv"
            : preview.type === "customer-master"
              ? "Customer_Master.csv"
              : "Expense_Register.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(blobUrl)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#122C4F] to-[#5B88B2] rounded-2xl">
            <FaChartBar className="text-[#F0D637]" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-[#122C4F]">Reports & Analytics</h1>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#FBF9E3] p-8 rounded-2xl shadow-lg border border-[#F0D637]/20 flex items-center justify-center h-40"
          >
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#5B88B2] border-t-[#F0D637]"></div>
              <p className="mt-4 text-[#122C4F] font-medium">Loading reports...</p>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FBF9E3] p-6 rounded-2xl shadow-md border border-slate-200"
            >
              <h2 className="text-lg font-semibold text-[#122C4F] mb-4">Report Filters</h2>
              <div className="flex gap-2 mb-6 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => exportCSV("sales-register")}
                  className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-full font-medium hover:bg-[#e6c82f] transition-all flex items-center gap-2 shadow-sm"
                >
                  <FaEye size={16} /> Sales Register
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => exportCSV("gstr1")}
                  className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-full font-medium hover:bg-[#e6c82f] transition-all flex items-center gap-2 shadow-sm"
                >
                  <FaEye size={16} /> GSTR-1
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => exportCSV("payment-register")}
                  className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-full font-medium hover:bg-[#e6c82f] transition-all flex items-center gap-2 shadow-sm"
                >
                  <FaEye size={16} /> Payments
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => exportCSV("customer-master")}
                  className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-full font-medium hover:bg-[#e6c82f] transition-all flex items-center gap-2 shadow-sm"
                >
                  <FaEye size={16} /> Customers
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => exportCSV("expense-register")}
                  className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-full font-medium hover:bg-[#e6c82f] transition-all flex items-center gap-2 shadow-sm"
                >
                  <FaEye size={16} /> Expenses
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#122C4F] mb-2 block">Start Date</label>
                  <input
                    type="date"
                    value={filters.start}
                    onChange={(e) => setFilters({ ...filters, start: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B88B2] outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#122C4F] mb-2 block">End Date</label>
                  <input
                    type="date"
                    value={filters.end}
                    onChange={(e) => setFilters({ ...filters, end: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B88B2] outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#122C4F] mb-2 block">Branch ID</label>
                  <input
                    type="number"
                    value={filters.branch}
                    onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B88B2] outline-none bg-white"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </motion.div>

            {preview.visible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#FBF9E3] p-6 rounded-2xl shadow-lg border border-slate-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#122C4F] capitalize">{preview.type.replace("-", " ")}</h2>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={downloadCSV}
                      className="px-4 py-2 bg-[#5B88B2] text-white rounded-full font-medium hover:bg-[#4f79a0] transition-all flex items-center gap-2 shadow-sm"
                    >
                      <FaDownload size={16} /> Download
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPreview({ type: "", headers: [], rows: [], visible: false })}
                      className="px-4 py-2 bg-slate-300 text-[#122C4F] rounded-full font-medium hover:bg-slate-400 transition-all flex items-center gap-2"
                    >
                      <FaTimes size={16} />
                    </motion.button>
                  </div>
                </div>
                <div className="overflow-auto max-h-96 rounded-xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-[#122C4F] to-[#5B88B2] sticky top-0">
                      <tr>
                        {preview.headers.map((h, i) => (
                          <th key={i} className="whitespace-nowrap px-4 py-3 text-left text-white font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.slice(0, 50).map((row, ri) => (
                        <motion.tr
                          key={ri}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-t hover:bg-[#F7F5D6] transition-colors"
                        >
                          {row.map((cell, ci) => (
                            <td key={ci} className="whitespace-nowrap px-4 py-3 text-slate-700">
                              {cell}
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 mt-3">Showing first 50 rows of {preview.rows.length}</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FBF9E3] p-6 rounded-2xl shadow-md border border-slate-200"
            >
              <h2 className="text-lg font-semibold text-[#122C4F] mb-4 flex items-center gap-2">
                <FaChartBar className="text-[#5B88B2]" /> Sales Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Invoices</p>
                      <p className="text-3xl font-bold text-[#122C4F] mt-2">{reports.sales.total_invoices || 0}</p>
                    </div>
                    <div className="p-2 bg-[#F0D637]/20 rounded-lg">
                      <FaChartBar className="text-[#F0D637]" size={20} />
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Sales</p>
                      <p className="text-3xl font-bold text-[#122C4F] mt-2">
                        ₹{(Number(reports.sales.total_sales) || 0).toFixed(0)}
                      </p>
                    </div>
                    <div className="p-2 bg-[#F0D637]/20 rounded-lg">
                      <FaChartLine className="text-[#F0D637]" size={20} />
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avg Invoice</p>
                      <p className="text-3xl font-bold text-[#122C4F] mt-2">
                        ₹{(Number(reports.sales.avg_invoice_value) || 0).toFixed(0)}
                      </p>
                    </div>
                    <div className="p-2 bg-[#5B88B2]/20 rounded-lg">
                      <FaChartBar className="text-[#5B88B2]" size={20} />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FBF9E3] p-6 rounded-2xl shadow-md border border-slate-200"
            >
              <h2 className="text-lg font-semibold text-[#122C4F] mb-4 flex items-center gap-2">
                <FaChartLine className="text-[#5B88B2]" /> Tax Liability
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase">CGST</p>
                      <p className="text-2xl font-bold text-[#122C4F] mt-2">
                        ₹{(Number(reports.tax.total_cgst) || 0).toFixed(0)}
                      </p>
                    </div>
                    <div className="w-1 h-12 bg-blue-400 rounded-full"></div>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase">SGST</p>
                      <p className="text-2xl font-bold text-[#122C4F] mt-2">
                        ₹{(Number(reports.tax.total_sgst) || 0).toFixed(0)}
                      </p>
                    </div>
                    <div className="w-1 h-12 bg-green-400 rounded-full"></div>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase">IGST</p>
                      <p className="text-2xl font-bold text-[#122C4F] mt-2">
                        ₹{(Number(reports.tax.total_igst) || 0).toFixed(0)}
                      </p>
                    </div>
                    <div className="w-1 h-12 bg-purple-400 rounded-full"></div>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-br from-[#F0D637] to-[#e6c82f] p-5 rounded-xl border border-[#F0D637] shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-[#122C4F] uppercase">Total Tax</p>
                      <p className="text-2xl font-bold text-[#122C4F] mt-2">
                        ₹{(Number(reports.tax.total_tax) || 0).toFixed(0)}
                      </p>
                    </div>
                    <div className="w-1 h-12 bg-[#122C4F] rounded-full"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {reports.topCustomers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FBF9E3] p-6 rounded-2xl shadow-md border border-slate-200"
              >
                <h2 className="text-lg font-semibold text-[#122C4F] mb-4 flex items-center gap-2">
                  <FaUsers className="text-[#5B88B2]" /> Top Customers
                </h2>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#122C4F] to-[#5B88B2]">
                      <tr>
                        <th className="px-4 py-3 text-left text-white font-semibold">Customer Name</th>
                        <th className="px-4 py-3 text-left text-white font-semibold">Invoices</th>
                        <th className="px-4 py-3 text-left text-white font-semibold">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.topCustomers.map((customer, idx) => (
                        <motion.tr
                          key={customer.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`border-t transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#F7F5D6]`}
                        >
                          <td className="px-4 py-3 font-medium text-slate-800">{customer.name}</td>
                          <td className="px-4 py-3 text-slate-700">{customer.invoice_count}</td>
                          <td className="px-4 py-3 font-bold text-[#122C4F]">
                            ₹{(Number(customer.total_spent) || 0).toFixed(0)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {reports.expenses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FBF9E3] p-6 rounded-2xl shadow-md border border-slate-200"
              >
                <h2 className="text-lg font-semibold text-[#122C4F] mb-4 flex items-center gap-2">
                  <FaChartBar className="text-[#5B88B2]" /> Expenses by Category
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reports.expenses.map((expense, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -4 }}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-[#122C4F]">{expense.category}</p>
                        <span className="text-xs bg-[#5B88B2]/10 text-[#5B88B2] px-2 py-1 rounded-full font-medium">
                          {expense.count}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-[#F0D637]">
                        ₹{(Number(expense.total_amount) || 0).toFixed(0)}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">{expense.count} entries</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
