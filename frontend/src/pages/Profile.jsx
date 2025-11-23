"use client"

import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import { motion } from 'framer-motion'
import { FaUserCircle } from 'react-icons/fa'

export default function Profile() {
  const { user } = useAuth()
  return (
    <Layout>
      <div className="space-y-6">
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-semibold text-blueZodiac flex items-center gap-2">
          <FaUserCircle className="text-hippieBlue" size={28} /> My Profile
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card card-top card-top-hippieBlue p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <p className="px-4 py-2 border rounded-lg">{user?.name || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <p className="px-4 py-2 border rounded-lg">{user?.email || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <p className="px-4 py-2 border rounded-lg">{user?.role || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Organization ID</label>
              <p className="px-4 py-2 border rounded-lg">{user?.organization_id || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Branch ID</label>
              <p className="px-4 py-2 border rounded-lg">{user?.branch_id || '-'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}