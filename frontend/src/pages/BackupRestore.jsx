"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import { FaDatabase, FaHistory, FaClock } from "react-icons/fa"

export default function BackupRestore() {
  const { effectiveRole } = useAuth()
  const [history, setHistory] = useState([])
  const [frequency, setFrequency] = useState("daily")
  const [error, setError] = useState("")

  const loadHistory = async () => {
    try {
      const res = await apiClient.get("/backup/history")
      setHistory(res.data || [])
    } catch (e) {
      setHistory([])
    }
  }
  useEffect(() => {
    loadHistory()
  }, [])

  const saveSchedule = async () => {
    try {
      await apiClient.put("/backup/schedule", { frequency })
      alert("Backup schedule saved successfully!")
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    }
  }

  const runBackup = async () => {
    try {
      const res = await apiClient.post("/backup/run")
      alert("Backup executed: " + res.data.timestamp)
      loadHistory()
    } catch (e) {
      setError(e.response?.data?.error || e.message)
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
            <FaDatabase className="text-[#FBF9E3]" size={32} />
          </div>
          Backup & Restore
        </motion.h1>

        {effectiveRole !== "admin" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-yellow-50 border-2 border-yellow-200 text-yellow-800 rounded-2xl font-semibold flex items-center gap-3"
          >
            <span className="text-2xl">🔒</span>
            Only the owner (Admin) can manage backups.
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Schedule Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FBF9E3] p-8 rounded-2xl border-2 border-[#5B88B2]/10 shadow-lg"
            >
              <h2 className="text-lg font-bold text-[#122C4F] mb-4 flex items-center gap-2">
                <FaClock className="text-[#5B88B2]" size={20} />
                Backup Schedule
              </h2>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl mb-4 flex items-center gap-2"
                >
                  <span className="text-lg">⚠️</span>
                  {error}
                </motion.div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <label className="block text-sm font-semibold text-[#122C4F] mb-2">Backup Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                  >
                    <option value="daily">Daily (12 AM)</option>
                    <option value="weekly">Weekly (Sunday)</option>
                  </select>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-end gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveSchedule}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#F0D637] to-[#e6c82f] text-[#122C4F] font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    Save Schedule
                  </motion.button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-end"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={runBackup}
                    className="w-full px-4 py-2.5 bg-[#5B88B2] text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    Run Backup Now
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* History Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#FBF9E3] rounded-2xl border-2 border-[#5B88B2]/10 shadow-lg overflow-hidden"
            >
              <div className="p-8 border-b-2 border-[#5B88B2]/10">
                <h2 className="text-lg font-bold text-[#122C4F] flex items-center gap-2">
                  <FaHistory className="text-[#5B88B2]" size={20} />
                  Backup History
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#122C4F] to-[#5B88B2] text-white">
                      <th className="px-6 py-4 text-left font-semibold">Timestamp</th>
                      <th className="px-6 py-4 text-left font-semibold">Provider</th>
                      <th className="px-6 py-4 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, idx) => (
                      <motion.tr
                        key={h.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-t border-gray-200 hover:bg-[#F0D637]/10 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-[#122C4F]">
                          {new Date(h.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{h.provider}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-lg font-semibold text-xs ${
                              h.status === "success" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {h.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                          No backup history yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  )
}
