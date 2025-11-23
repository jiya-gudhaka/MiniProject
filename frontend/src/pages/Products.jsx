"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import apiClient from "../components/ApiClient"
import { Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { FaBoxOpen, FaPlus } from 'react-icons/fa'

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
        <div className="flex justify-between items-center">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-semibold text-blueZodiac flex items-center gap-2">
            <FaBoxOpen className="text-hippieBlue" size={28} /> Products
          </motion.h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]"
          >
            <FaPlus size={16} /> Add Product
          </button>
        </div>

        {showForm && (
          <motion.form initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="card card-top card-top-hippieBlue p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-name" className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  id="product-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="product-hsn" className="block text-sm font-medium mb-1">HSN/SAC Code</label>
                <input
                  id="product-hsn"
                  type="text"
                  value={formData.hsn_sac_code}
                  onChange={(e) => setFormData({ ...formData, hsn_sac_code: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="product-price" className="block text-sm font-medium mb-1">Price</label>
                <input
                  id="product-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="product-gst" className="block text-sm font-medium mb-1">GST Rate (%)</label>
                <input
                  id="product-gst"
                  type="number"
                  value={formData.expected_gst_rate}
                  onChange={(e) => setFormData({ ...formData, expected_gst_rate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div>
                <label htmlFor="product-stock" className="block text-sm font-medium mb-1">Stock</label>
                <input
                  id="product-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="product-meta" className="block text-sm font-medium mb-1">Meta</label>
                <textarea
                  id="product-meta"
                  value={formData.meta}
                  onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5B88B2] outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 bg-[#F0D637] text-[#122C4F] rounded-2xl hover:bg-[#e6c82f]">
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card card-top card-top-hippieBlue overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">HSN/SAC</th>
                  <th className="px-6 py-3 text-left font-semibold">Price</th>
                  <th className="px-6 py-3 text-left font-semibold">GST Rate</th>
                  <th className="px-6 py-3 text-left font-semibold">Stock</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t hover:bg-[#F7F5D6]">
                    <td className="px-6 py-3">{product.name}</td>
                    <td className="px-6 py-3">{product.hsn_sac_code}</td>
                    <td className="px-6 py-3">₹{product.price}</td>
                    <td className="px-6 py-3">{product.expected_gst_rate}%</td>
                    <td className="px-6 py-3">{product.stock}</td>
                    <td className="px-6 py-3">
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
