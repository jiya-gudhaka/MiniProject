import express from "express"
import pool from "../config/database.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

router.use(authMiddleware)

// Get all products
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM products WHERE organization_id = $1 ORDER BY created_at DESC`, [
      req.user.organizationId,
    ])
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create product
router.post("/", async (req, res) => {
  const { name, hsn_sac_code, price, expected_gst_rate, stock, meta } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO products (name, hsn_sac_code, price, expected_gst_rate, stock, organization_id, meta) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, hsn_sac_code, price, expected_gst_rate || 0, stock || 0, req.user.organizationId, meta || {}],
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update product
router.put("/:id", async (req, res) => {
  const { name, hsn_sac_code, price, expected_gst_rate, stock } = req.body

  try {
    const result = await pool.query(
      `UPDATE products SET name = $1, hsn_sac_code = $2, price = $3, expected_gst_rate = $4, stock = $5 
       WHERE id = $6 AND organization_id = $7 RETURNING *`,
      [name, hsn_sac_code, price, expected_gst_rate, stock, req.params.id, req.user.organizationId],
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = $1 AND organization_id = $2", [
      req.params.id,
      req.user.organizationId,
    ])
    res.json({ message: "Product deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
