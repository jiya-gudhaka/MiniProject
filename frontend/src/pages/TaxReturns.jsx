"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import apiClient from "../components/ApiClient";
import { motion } from "framer-motion";
import { FaBalanceScale, FaDownload, FaFileAlt } from "react-icons/fa";

export default function TaxReturns() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [gstr1, setGstr1] = useState(null);
  const [gstr3b, setGstr3b] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ====================== GSTR-1 Load ====================== */
  const loadGSTR1 = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get("/tax/gstr1", {
        params: { start, end },
      });
      setGstr1(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ====================== GSTR-3B Load ====================== */
  const loadGSTR3B = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get("/api/tax/gstr3b", {
        params: { start, end },
      });
      setGstr3b(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ====================== Export Handler ====================== */
  const exportFile = async (path, filename) => {
    const resp = await apiClient.get(path, {
      params: { start, end },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([resp.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#122C4F] to-[#5B88B2] rounded-2xl">
            <FaBalanceScale className="text-[#F0D637]" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-[#122C4F]">GST Returns</h1>
        </motion.div>

        {/* Date Filter Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FBF9E3] p-6 rounded-2xl shadow-md border border-slate-200"
        >
          <h2 className="text-lg font-semibold text-[#122C4F] mb-4">Select Return Period</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-[#122C4F] mb-2 block">Start Date</label>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B88B2] outline-none bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#122C4F] mb-2 block">End Date</label>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B88B2] outline-none bg-white"
              />
            </div>

            <div className="flex items-end gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadGSTR1}
                className="flex-1 px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-full font-semibold hover:bg-[#e6c82f] transition-all shadow-sm"
                disabled={loading}
              >
                {loading ? "Loading..." : "GSTR-1"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadGSTR3B}
                className="flex-1 px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-full font-semibold hover:bg-[#e6c82f] transition-all shadow-sm"
                disabled={loading}
              >
                {loading ? "Loading..." : "GSTR-3B"}
              </motion.button>
            </div>
          </div>

          {/* Error Box */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-red-100 text-red-800 rounded-xl border border-red-300 flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <p>{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* ====================== GSTR-1 TABLE ====================== */}
        {gstr1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#FBF9E3] p-6 rounded-2xl shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#122C4F] flex items-center gap-2">
                <FaFileAlt className="text-[#5B88B2]" /> GSTR-1 Preview
              </h2>

              <div className="flex gap-2 flex-wrap">

                {/* Export JSON */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => exportFile("/tax/gstr1/export?format=json", "GSTR1.json")}
                  className="px-4 py-2 bg-[#5B88B2] text-white rounded-full hover:bg-[#4f79a0] transition-all font-medium flex items-center gap-2 shadow-sm"
                >
                  <FaDownload size={14} /> JSON
                </motion.button>

                {/* Export CSV */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => exportFile("/tax/gstr1/export?format=csv", "GSTR1.csv")}
                  className="px-4 py-2 bg-[#5B88B2] text-white rounded-full hover:bg-[#4f79a0] transition-all font-medium flex items-center gap-2 shadow-sm"
                >
                  <FaDownload size={14} /> Excel
                </motion.button>

              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-[#122C4F] to-[#5B88B2]">
                  <tr>
                    <th className="px-4 py-3 text-left text-white font-semibold">Invoice No</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">Value</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">POS</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">Taxable</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">IGST</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">CGST</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">SGST</th>
                  </tr>
                </thead>

                <tbody>
                  {gstr1.data.map((r, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#F7F5D6]`}
                    >
                      <td className="px-4 py-3">{r.invoiceNumber}</td>
                      <td className="px-4 py-3">{r.invoiceDate}</td>
                      <td className="px-4 py-3 font-semibold">₹{Number(r.invoiceValue).toFixed(2)}</td>
                      <td className="px-4 py-3">{r.placeOfSupply}</td>
                      <td className="px-4 py-3">₹{Number(r.taxableValue).toFixed(2)}</td>
                      <td className="px-4 py-3">₹{Number(r.igst).toFixed(2)}</td>
                      <td className="px-4 py-3">₹{Number(r.cgst).toFixed(2)}</td>
                      <td className="px-4 py-3">₹{Number(r.sgst).toFixed(2)}</td>
                    </motion.tr>
                  ))}
                </tbody>

              </table>
            </div>
          </motion.div>
        )}

        {/* ====================== GSTR-3B SUMMARY ====================== */}
        {gstr3b && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#FBF9E3] p-6 rounded-2xl shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#122C4F] flex items-center gap-2">
                <FaFileAlt className="text-[#5B88B2]" /> GSTR-3B Summary
              </h2>

              <div className="flex gap-2 flex-wrap">

                {/* JSON */}
                <motion.button
                  onClick={() => exportFile("/api/tax/gstr3b/export?format=json", "GSTR3B.json")}
                  className="px-4 py-2 bg-[#5B88B2] text-white rounded-full"
                >
                  <FaDownload size={14} /> JSON
                </motion.button>

                {/* CSV */}
                <motion.button
                  onClick={() => exportFile("/api/tax/gstr3b/export?format=csv", "GSTR3B.csv")}
                  className="px-4 py-2 bg-[#5B88B2] text-white rounded-full"
                >
                  <FaDownload size={14} /> Excel
                </motion.button>

              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {["taxable", "cgst", "sgst", "igst", "cess"].map((key) => (
                <motion.div
                  key={key}
                  whileHover={{ y: -4 }}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
                >
                  <p className="text-xs font-medium text-slate-500 uppercase mb-2">{key.toUpperCase()}</p>
                  <p className="text-2xl font-bold text-[#122C4F]">₹{Number(gstr3b.summary[key]).toFixed(0)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </Layout>
  );
}
