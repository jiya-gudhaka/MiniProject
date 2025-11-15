import express from "express"
import pool from "../config/database.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

router.use(authMiddleware)

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, v.name as vendor_name FROM expenses e 
       LEFT JOIN vendors v ON e.vendor_id = v.id 
       WHERE e.organization_id = $1 ORDER BY e.expense_date DESC`,
      [req.user.organizationId],
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create expense
router.post("/", async (req, res) => {
  const { category, vendor_id, amount, gst_percent, expense_date, notes } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO expenses (organization_id, category, vendor_id, amount, gst_percent, expense_date, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [req.user.organizationId, category, vendor_id, amount, gst_percent || 0, expense_date, notes],
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update expense
router.put("/:id", async (req, res) => {
  const { category, vendor_id, amount, gst_percent, expense_date, notes } = req.body

  try {
    const result = await pool.query(
      `UPDATE expenses SET category = $1, vendor_id = $2, amount = $3, gst_percent = $4, expense_date = $5, notes = $6 
       WHERE id = $7 AND organization_id = $8 RETURNING *`,
      [category, vendor_id, amount, gst_percent, expense_date, notes, req.params.id, req.user.organizationId],
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete expense
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM expenses WHERE id = $1 AND organization_id = $2", [
      req.params.id,
      req.user.organizationId,
    ])
    res.json({ message: "Expense deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
