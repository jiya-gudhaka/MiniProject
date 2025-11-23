"use client"

import { useState } from "react"
import Layout from "../components/Layout"
import InvoiceUploader from "../components/InvoiceUploader"
import apiClient from "../components/ApiClient"
import { motion } from 'framer-motion'
import { FaFileInvoice } from 'react-icons/fa'

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
        <div className="flex items-center justify-between">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold text-blueZodiac flex items-center gap-2">
            <FaFileInvoice className="text-hippieBlue" size={24} /> Purchase Bills
          </motion.h1>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card card-top card-top-hippieBlue p-6">
          <h2 className="text-lg font-semibold mb-4 text-blueZodiac">Upload Bill</h2>
          <InvoiceUploader onSuccess={handleUploadSuccess} uploadUrl={"http://localhost:5000/api/purchase-bills/upload"} fileFieldName={"bill_file"} />
        </motion.div>

        {draft && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card card-top card-top-hippieBlue p-6">
            <h2 className="text-lg font-semibold mb-4 text-blueZodiac">Auto Journal Preview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Entry Date</p>
                <p className="font-medium">{draft.entry_date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reference No</p>
                <p className="font-medium">{draft.reference_no || ""}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Debit</p>
                <p className="font-medium">{draft.debit_account}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Credit</p>
                <p className="font-medium">{draft.credit_account}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium">₹{Number(draft.amount || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-medium">₹{Number(draft.total_amount || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">CGST ITC</p>
                <p className="font-medium">₹{Number(draft.cgst_input || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">SGST ITC</p>
                <p className="font-medium">₹{Number(draft.sgst_input || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">IGST ITC</p>
                <p className="font-medium">₹{Number(draft.igst_input || 0).toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button onClick={saveJournal} disabled={saving} className="px-4 py-2 bg-goldenDream text-blueZodiac rounded-2xl disabled:bg-gray-300">
                {saving ? "Saving..." : "Save Journal Entry"}
              </button>
              {savedEntry && <span className="text-green-700 text-sm">Saved entry #{savedEntry.id}</span>}
              {error && <span className="text-red-700 text-sm">{error}</span>}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}