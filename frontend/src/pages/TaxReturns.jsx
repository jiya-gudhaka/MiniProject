"use client"

import { useState } from "react"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { motion } from 'framer-motion'
import { FaBalanceScale } from 'react-icons/fa'

export default function TaxReturns() {
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [gstr1, setGstr1] = useState(null)
  const [gstr3b, setGstr3b] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadGSTR1 = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await apiClient.get("/tax/gstr1", { params: { start, end } })
      setGstr1(res.data)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally { setLoading(false) }
  }

  const loadGSTR3B = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await apiClient.get("/tax/gstr3b", { params: { start, end } })
      setGstr3b(res.data)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally { setLoading(false) }
  }

  const exportFile = async (path, filename) => {
    const resp = await apiClient.get(path, { params: { start, end, format: path.includes("json") ? "json" : "csv" }, responseType: "blob" })
    const url = window.URL.createObjectURL(new Blob([resp.data]))
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-semibold text-blueZodiac flex items-center gap-2">
          <FaBalanceScale className="text-hippieBlue" size={28} /> GST Returns
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#FBF9E3] p-8 rounded-2xl shadow-subtle border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">Select Period</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={loadGSTR1} className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]">Generate GSTR-1</button>
              <button onClick={loadGSTR3B} className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]">Generate GSTR-3B</button>
            </div>
          </div>
          {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        </motion.div>

        {gstr1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#FBF9E3] p-8 rounded-2xl shadow-subtle border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">GSTR-1 Preview</h2>
              <div className="flex gap-2">
                <button onClick={() => exportFile("/tax/gstr1/export?format=json", "GSTR1_Data.json")} className="px-4 py-2 bg-[#5B88B2] text-white rounded-2xl hover:bg-[#4f79a0]">Download JSON</button>
                <button onClick={() => exportFile("/tax/gstr1/export?format=csv", "GSTR1_Data.csv")} className="px-4 py-2 bg-[#5B88B2] text-white rounded-2xl hover:bg-[#4f79a0]">Download Excel/CSV</button>
                <a href="https://www.gst.gov.in/" target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]">File on GST Portal</a>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left">Invoice No</th>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Value</th>
                    <th className="px-3 py-2 text-left">POS</th>
                    <th className="px-3 py-2 text-left">Taxable</th>
                    <th className="px-3 py-2 text-left">IGST</th>
                    <th className="px-3 py-2 text-left">CGST</th>
                    <th className="px-3 py-2 text-left">SGST</th>
                  </tr>
                </thead>
                <tbody>
                  {gstr1.data.map((r, idx) => (
                    <tr key={idx} className="border-t hover:bg-[#F7F5D6]">
                      <td className="px-3 py-2 font-mono">{r.invoiceNumber}</td>
                      <td className="px-3 py-2">{r.invoiceDate}</td>
                      <td className="px-3 py-2">₹{Number(r.invoiceValue || 0).toFixed(2)}</td>
                      <td className="px-3 py-2">{r.placeOfSupply}</td>
                      <td className="px-3 py-2">₹{Number(r.taxableValue || 0).toFixed(2)}</td>
                      <td className="px-3 py-2">₹{Number(r.igst || 0).toFixed(2)}</td>
                      <td className="px-3 py-2">₹{Number(r.cgst || 0).toFixed(2)}</td>
                      <td className="px-3 py-2">₹{Number(r.sgst || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {gstr3b && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#FBF9E3] p-8 rounded-2xl shadow-subtle border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">GSTR-3B Summary</h2>
              <div className="flex gap-2">
                <button onClick={() => exportFile("/tax/gstr3b/export?format=json", "GSTR3B_Summary.json")} className="px-4 py-2 bg-[#5B88B2] text-white rounded-2xl hover:bg-[#4f79a0]">Download JSON</button>
                <button onClick={() => exportFile("/tax/gstr3b/export?format=csv", "GSTR3B_Summary.csv")} className="px-4 py-2 bg-[#5B88B2] text-white rounded-2xl hover:bg-[#4f79a0]">Download Excel/CSV</button>
                <a href="https://www.gst.gov.in/" target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]">File on GST Portal</a>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="p-4 bg-[#FBF9E3] border rounded-2xl"><p className="text-sm text-gray-600">Taxable</p><p className="text-xl font-bold">₹{Number(gstr3b.summary.taxable || 0).toFixed(2)}</p></div>
              <div className="p-4 bg-[#FBF9E3] border rounded-2xl"><p className="text-sm text-gray-600">CGST</p><p className="text-xl font-bold">₹{Number(gstr3b.summary.cgst || 0).toFixed(2)}</p></div>
              <div className="p-4 bg-[#FBF9E3] border rounded-2xl"><p className="text-sm text-gray-600">SGST</p><p className="text-xl font-bold">₹{Number(gstr3b.summary.sgst || 0).toFixed(2)}</p></div>
              <div className="p-4 bg-[#FBF9E3] border rounded-2xl"><p className="text-sm text-gray-600">IGST</p><p className="text-xl font-bold">₹{Number(gstr3b.summary.igst || 0).toFixed(2)}</p></div>
              <div className="p-4 bg-[#FBF9E3] border rounded-2xl"><p className="text-sm text-gray-600">Cess</p><p className="text-xl font-bold">₹{Number(gstr3b.summary.cess || 0).toFixed(2)}</p></div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}