"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { FaBoxOpen, FaPlus } from "react-icons/fa"

export default function Products() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    hsn_sac_code: "",
    price: "",
    expected_gst_rate: "",
    stock: "",
    meta: "",
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      console.log("[v0] Fetching products from API")
      const res = await apiClient.get("/products")
      console.log("[v0] Products fetched:", res.data)
      setProducts(res.data || [])
    } catch (err) {
      console.error("[v0] Failed to fetch products:", err.response?.status, err.message)
      alert("Failed to load products. Make sure backend is running at http://localhost:5000")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post("/products", {
        ...formData,
        price: Number.parseFloat(formData.price),
        expected_gst_rate: Number.parseFloat(formData.expected_gst_rate),
        stock: Number.parseInt(formData.stock),
      })
      setFormData({ name: "", hsn_sac_code: "", price: "", expected_gst_rate: "", stock: "", meta: "" })
      setShowForm(false)
      fetchProducts()
    } catch (err) {
      console.error("Failed to create product", err)
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Delete this product?")) {
      try {
        console.log("[v0] Deleting product:", id)
        await apiClient.delete(`/products/${id}`)
        console.log("[v0] Product deleted successfully")
        fetchProducts()
      } catch (err) {
        console.error("[v0] Failed to delete product:", err.response?.status, err.message)
        alert("Failed to delete product: " + (err.response?.data?.error || err.message))
      }
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-[#122C4F] flex items-center gap-3"
          >
            <div className="p-2 bg-gradient-to-br from-[#5B88B2] to-[#122C4F] rounded-xl">
              <FaBoxOpen className="text-[#FBF9E3]" size={32} />
            </div>
            Products
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F0D637] to-[#e6c82f] text-[#122C4F] font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <FaPlus size={18} /> Add Product
          </motion.button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-[#FBF9E3] p-8 rounded-2xl border-2 border-[#5B88B2]/20 shadow-lg space-y-6"
          >
            <h3 className="text-lg font-bold text-[#122C4F] mb-4">Create New Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <label htmlFor="product-name" className="block text-sm font-semibold text-[#122C4F] mb-2">
                  Product Name
                </label>
                <input
                  id="product-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                  placeholder="e.g., Premium Widget"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label htmlFor="product-hsn" className="block text-sm font-semibold text-[#122C4F] mb-2">
                  HSN/SAC Code
                </label>
                <input
                  id="product-hsn"
                  type="text"
                  value={formData.hsn_sac_code}
                  onChange={(e) => setFormData({ ...formData, hsn_sac_code: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                  placeholder="1234567890"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label htmlFor="product-price" className="block text-sm font-semibold text-[#122C4F] mb-2">
                  Price (₹)
                </label>
                <input
                  id="product-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                  placeholder="0.00"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label htmlFor="product-gst" className="block text-sm font-semibold text-[#122C4F] mb-2">
                  GST Rate (%)
                </label>
                <input
                  id="product-gst"
                  type="number"
                  value={formData.expected_gst_rate}
                  onChange={(e) => setFormData({ ...formData, expected_gst_rate: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                  placeholder="5, 12, 18..."
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <label htmlFor="product-stock" className="block text-sm font-semibold text-[#122C4F] mb-2">
                  Stock
                </label>
                <input
                  id="product-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F0D637] focus:border-[#F0D637] outline-none transition-all"
                  placeholder="0"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="md:col-span-2"
              >
                <label htmlFor="product-meta" className="block text-sm font-semibold text-[#122C4F] mb-2">
                  Notes
                </label>
                <textarea
                  id="product-meta"
                  value={formData.meta}
                  onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B88B2] focus:border-[#5B88B2] outline-none transition-all"
                  placeholder="Additional product information..."
                  rows="3"
                />
              </motion.div>
            </div>
            <div className="flex gap-3 pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#F0D637] to-[#e6c82f] text-[#122C4F] font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Save Product
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowForm(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-400 transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </motion.form>
        )}

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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FBF9E3] rounded-2xl border-2 border-[#5B88B2]/10 shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#122C4F] to-[#5B88B2] text-white">
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">HSN/SAC</th>
                    <th className="px-6 py-4 text-left font-semibold">Price</th>
                    <th className="px-6 py-4 text-left font-semibold">GST Rate</th>
                    <th className="px-6 py-4 text-left font-semibold">Stock</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-t border-gray-200 hover:bg-[#F0D637]/10 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-[#122C4F]">{product.name}</td>
                      <td className="px-6 py-4 text-gray-700">{product.hsn_sac_code || "-"}</td>
                      <td className="px-6 py-4 font-semibold text-[#5B88B2]">₹{product.price}</td>
                      <td className="px-6 py-4 text-gray-700">{product.expected_gst_rate}%</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                            product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No products yet. Create one to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
