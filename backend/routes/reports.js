import express from "express"
import pool from "../config/database.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

router.use(authMiddleware)

// Sales summary
router.get("/sales/summary", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(DISTINCT id) as total_invoices,
        SUM(net_amount) as total_sales,
        AVG(net_amount) as avg_invoice_value
       FROM invoices WHERE organization_id = $1`,
      [req.user.organizationId],
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Tax liability report
router.get("/tax/liability", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        SUM(cgst_amount) as total_cgst,
        SUM(sgst_amount) as total_sgst,
        SUM(igst_amount) as total_igst,
        SUM(cgst_amount + sgst_amount + igst_amount) as total_tax
       FROM invoices WHERE organization_id = $1`,
      [req.user.organizationId],
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Top customers
router.get("/customers/top", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.name, COUNT(i.id) as invoice_count, SUM(i.net_amount) as total_spent
       FROM customers c 
       LEFT JOIN invoices i ON c.id = i.customer_id 
       WHERE c.organization_id = $1 
       GROUP BY c.id, c.name 
       ORDER BY total_spent DESC LIMIT 10`,
      [req.user.organizationId],
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Expense summary
router.get("/expenses/summary", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT category, SUM(amount) as total_amount, COUNT(*) as count
       FROM expenses WHERE organization_id = $1
       GROUP BY category ORDER BY total_amount DESC`,
      [req.user.organizationId],
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
