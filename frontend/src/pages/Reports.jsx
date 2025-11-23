"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { motion } from 'framer-motion'
import { FaChartBar, FaChartLine, FaUsers } from 'react-icons/fa'

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
    a.download = (
      preview.type === "sales-register" ? "Sales_Register_2025.csv" :
      preview.type === "gstr1" ? "GSTR1_Data.csv" :
      preview.type === "payment-register" ? "Payment_Register.csv" :
      preview.type === "customer-master" ? "Customer_Master.csv" :
      "Expense_Register.csv"
    )
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(blobUrl)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-semibold text-blueZodiac flex items-center gap-2">
          <FaChartBar className="text-hippieBlue" size={28} /> Reports
        </motion.h1>

        {loading ? (
          <div>Loading reports...</div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card card-top card-top-hippieBlue p-6">
              <h2 className="card-title">Analytics Filters</h2>
              <div className="flex gap-2 mb-4 flex-wrap">
                <button onClick={() => exportCSV("sales-register")} className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]">Preview Sales Register</button>
                <button onClick={() => exportCSV("gstr1")} className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]">Preview GSTR-1</button>
                <button onClick={() => exportCSV("payment-register")} className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]">Preview Payments</button>
                <button onClick={() => exportCSV("customer-master")} className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]">Preview Customer Master</button>
                <button onClick={() => exportCSV("expense-register")} className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]">Preview Expenses</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <input type="date" value={filters.start} onChange={(e) => setFilters({ ...filters, start: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <input type="date" value={filters.end} onChange={(e) => setFilters({ ...filters, end: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium">Branch ID (optional)</label>
                  <input type="number" value={filters.branch} onChange={(e) => setFilters({ ...filters, branch: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none" />
                </div>
              </div>
            </motion.div>

            {preview.visible && (
              <div className="card card-top card-top-hippieBlue p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Preview: {preview.type}</h2>
                  <div className="flex gap-2">
                    <button onClick={downloadCSV} className="px-4 py-2 bg-[#5B88B2] text-white rounded-2xl hover:bg-[#4f79a0]">Download CSV</button>
                    <button onClick={() => setPreview({ type: "", headers: [], rows: [], visible: false })} className="px-4 py-2 bg-gray-300 rounded-2xl">Close</button>
                  </div>
                </div>
                <div className="overflow-auto">
                  <table className="data-table min-w-full">
                    <thead>
                      <tr>
                        {preview.headers.map((h, i) => (
                          <th key={i} className="whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.slice(0, 50).map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="whitespace-nowrap">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-2">Showing first 50 rows</p>
              </div>
            )}

            {/* Sales Summary */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card card-top card-top-hippieBlue p-6">
              <h2 className="text-xl font-semibold text-blueZodiac mb-4 flex items-center gap-2">
                <FaChartBar className="text-hippieBlue" /> Sales Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4">
                  <p className="text-gray-600 text-sm">Total Invoices</p>
                  <p className="text-2xl font-bold text-[#122C4F]">{reports.sales.total_invoices}</p>
                </div>
                <div className="card p-4">
                  <p className="text-gray-600 text-sm">Total Sales</p>
                  <p className="text-2xl font-bold text-[#122C4F]">₹{(Number(reports.sales.total_sales) || 0).toFixed(2)}</p>
                </div>
                <div className="card p-4">
                  <p className="text-gray-600 text_sm">Avg Invoice</p>
                  <p className="text-2xl font-bold text-[#122C4F]">₹{(Number(reports.sales.avg_invoice_value) || 0).toFixed(2)}</p>
                </div>
              </div>
            </motion.div>

            {/* Tax Liability */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card card-top card-top-hippieBlue p-6">
              <h2 className="text-xl font-semibold text-blueZodiac mb-4 flex items-center gap-2">
                <FaChartLine className="text-hippieBlue" /> Tax Liability
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-4">
                  <p className="text-gray-600 text-sm">Total CGST</p>
                  <p className="text-2xl font-bold text-[#122C4F]">₹{(Number(reports.tax.total_cgst) || 0).toFixed(2)}</p>
                </div>
                <div className="card p-4">
                  <p className="text-gray-600 text-sm">Total SGST</p>
                  <p className="text-2xl font-bold text-[#122C4F]">₹{(Number(reports.tax.total_sgst) || 0).toFixed(2)}</p>
                </div>
                <div className="card p-4">
                  <p className="text-gray-600 text-sm">Total IGST</p>
                  <p className="text-2xl font-bold text-[#122C4F]">₹{(Number(reports.tax.total_igst) || 0).toFixed(2)}</p>
                </div>
                <div className="card p-4">
                  <p className="text-gray-600 text-sm">Total Tax</p>
                  <p className="text-2xl font-bold text-[#122C4F]">₹{(Number(reports.tax.total_tax) || 0).toFixed(2)}</p>
                </div>
              </div>
            </motion.div>

            {/* Top Customers */}
            {reports.topCustomers.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card card-top card-top-hippieBlue p-6">
                <h2 className="text-xl font-semibold text-blueZodiac mb-4 flex items-center gap-2">
                  <FaUsers className="text-hippieBlue" /> Top Customers
                </h2>
                <div className="overflow-x-auto">
                  <table className="data-table w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left">Customer</th>
                        <th className="px-4 py-2 text-left">Invoices</th>
                        <th className="px-4 py-2 text-left">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.topCustomers.map((customer) => (
                        <tr key={customer.id}>
                          <td>{customer.name}</td>
                          <td>{customer.invoice_count}</td>
                          <td className="font-semibold">₹{(Number(customer.total_spent) || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Expenses Summary */}
            {reports.expenses.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card card-top card-top-hippieBlue p-6">
                <h2 className="text-xl font-bold mb-4">Expenses by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reports.expenses.map((expense, idx) => (
                    <div key={idx} className="card p-4">
                      <p className="text-gray-600 text-sm font-medium">{expense.category}</p>
                      <p className="text-xl font-bold">₹{(Number(expense.total_amount) || 0).toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-1">{expense.count} entries</p>
                    </div>
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
