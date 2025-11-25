"use client"

import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import { FaUserCircle, FaEnvelope, FaUserTie, FaBuilding, FaMapPin } from "react-icons/fa"

export default function Profile() {
  const { user } = useAuth()

  const profileFields = [
    { label: "Full Name", value: user?.name, icon: FaUserCircle, color: "text-[#5B88B2]" },
    { label: "Email", value: user?.email, icon: FaEnvelope, color: "text-[#5B88B2]" },
    { label: "Role", value: user?.role, icon: FaUserTie, color: "text-[#F0D637]" },
    { label: "Organization", value: user?.organization_id, icon: FaBuilding, color: "text-[#5B88B2]" },
    { label: "Branch", value: user?.branch_id, icon: FaMapPin, color: "text-[#F0D637]" },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#122C4F] to-[#5B88B2] rounded-2xl">
            <FaUserCircle className="text-[#F0D637]" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-[#122C4F]">My Profile</h1>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FBF9E3] p-8 rounded-2xl shadow-md border border-slate-200"
        >
          {/* User Avatar */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-200 mb-6">
            <div className="p-4 bg-gradient-to-br from-[#122C4F] to-[#5B88B2] rounded-full">
              <FaUserCircle className="text-[#F0D637]" size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#122C4F]">{user?.name || "User"}</h2>
              <p className="text-sm text-slate-600">{user?.email}</p>
            </div>
          </div>

          {/* Profile Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileFields.map((field, idx) => {
              const IconComponent = field.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {field.label}
                    </label>
                    <IconComponent className={`${field.color} text-lg`} />
                  </div>
                  <p className="text-lg font-semibold text-[#122C4F]">{field.value || "—"}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-[#F0D637]/10 border border-[#F0D637]/30 rounded-xl">
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-[#122C4F]">Account Status:</span> Active
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
