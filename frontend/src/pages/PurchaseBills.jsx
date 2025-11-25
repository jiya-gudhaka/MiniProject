"use client"

import { useState } from "react"
import Layout from "../components/Layout"
import InvoiceUploader from "../components/InvoiceUploader"
import apiClient from "../components/ApiClient"
import { motion } from "framer-motion"
import { FaFileInvoice, FaSave, FaCheckCircle } from "react-icons/fa"

export default function PurchaseBills() {
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [savedEntry, setSavedEntry] = useState(null)
  const [error, setError] = useState("")

  const handleUploadSuccess = (result) => {
    if (result && result.purchase_bill_id) {
      setDraft(result.journal_entry_draft)
      setSavedEntry(null)
      setError("")
    } else if (result && result.success && result.items) {
      setError("Unexpected OCR endpoint used; please upload purchase bill")
    }
  }

  const saveJournal = async () => {
    if (!draft) return
    setSaving(true)
    setError("")
    try {
      const res = await apiClient.post("/journal-entries", {
        entry_date: draft.entry_date,
        reference_no: draft.reference_no,
        vendor_id: draft.vendor_id,
        description: draft.description,
        debit_account: draft.debit_account,
        credit_account: draft.credit_account,
        amount: draft.amount,
        cgst_input: draft.cgst_input,
        sgst_input: draft.sgst_input,
        igst_input: draft.igst_input,
        total_amount: draft.total_amount,
        entry_type: draft.entry_type,
        ocr_json_path: draft.ocr_json_path,
      })
      setSavedEntry(res.data)
      setSaving(false)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#122C4F] to-[#5B88B2] rounded-2xl">
            <FaFileInvoice className="text-[#F0D637]" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-[#122C4F]">Purchase Bills</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FBF9E3] p-6 rounded-2xl shadow-md border border-slate-200"
        >
          <h2 className="text-lg font-semibold text-[#122C4F] mb-4 flex items-center gap-2">
            <FaFileInvoice className="text-[#5B88B2]" /> Upload Bill
          </h2>
          <div className="bg-white p-6 rounded-xl border-2 border-dashed border-[#5B88B2]/30 hover:border-[#5B88B2]/60 transition-colors">
            <InvoiceUploader
              onSuccess={handleUploadSuccess}
              uploadUrl={"http://localhost:5000/api/purchase-bills/upload"}
              fileFieldName={"bill_file"}
            />
          </div>
        </motion.div>

        {draft && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FBF9E3] p-6 rounded-2xl shadow-md border border-slate-200"
          >
            <h2 className="text-lg font-semibold text-[#122C4F] mb-4 flex items-center gap-2">
              <FaFileInvoice className="text-[#5B88B2]" /> Auto Journal Preview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-medium text-slate-500 uppercase mb-2">Entry Date</p>
                <p className="text-lg font-semibold text-[#122C4F]">{draft.entry_date}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-medium text-slate-500 uppercase mb-2">Reference No</p>
                <p className="text-lg font-semibold text-[#122C4F]">{draft.reference_no || "-"}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-medium text-slate-500 uppercase mb-2">Entry Type</p>
                <p className="text-lg font-semibold text-[#122C4F]">{draft.entry_type}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-5 rounded-xl border border-red-200">
                <p className="text-xs font-medium text-red-600 uppercase mb-2">Debit Account</p>
                <p className="text-lg font-semibold text-[#122C4F]">{draft.debit_account}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-green-200">
                <p className="text-xs font-medium text-green-600 uppercase mb-2">Credit Account</p>
                <p className="text-lg font-semibold text-[#122C4F]">{draft.credit_account}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <p className="text-xs font-medium text-slate-500 uppercase mb-1">Amount</p>
                <p className="text-2xl font-bold text-[#122C4F]">₹{Number(draft.amount || 0).toFixed(0)}</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <p className="text-xs font-medium text-slate-500 uppercase mb-1">Total</p>
                <p className="text-2xl font-bold text-[#F0D637]">₹{Number(draft.total_amount || 0).toFixed(0)}</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <p className="text-xs font-medium text-slate-500 uppercase mb-1">CGST ITC</p>
                <p className="text-lg font-semibold text-blue-600">₹{Number(draft.cgst_input || 0).toFixed(0)}</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <p className="text-xs font-medium text-slate-500 uppercase mb-1">SGST ITC</p>
                <p className="text-lg font-semibold text-green-600">₹{Number(draft.sgst_input || 0).toFixed(0)}</p>
              </motion.div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveJournal}
                disabled={saving}
                className="px-6 py-3 bg-[#F0D637] text-[#122C4F] rounded-full font-semibold hover:bg-[#e6c82f] disabled:opacity-50 transition-all flex items-center gap-2 shadow-md"
              >
                <FaSave size={16} /> {saving ? "Saving..." : "Save Journal Entry"}
              </motion.button>
              {savedEntry && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-green-700 font-semibold"
                >
                  <FaCheckCircle size={20} /> Entry #{savedEntry.id} saved!
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-700 font-medium">
                  {error}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
