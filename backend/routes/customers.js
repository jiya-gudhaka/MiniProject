import express from "express"
import pool from "../config/database.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

router.use(authMiddleware)

// 🟢 Get all customers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM customers 
       WHERE organization_id = $1 AND branch_id = $2 
       ORDER BY created_at DESC`,
      [req.user.organizationId, req.user.branchId || 1] // fallback to branch 1
    )
    res.json(result.rows)
  } catch (error) {
    console.error("[v0] Error fetching customers:", error)
    res.status(500).json({ error: error.message })
  }
})

// 🟢 Create customer
router.post("/", async (req, res) => {
  const { name, phone, email, address, gstin, state_code, meta } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO customers 
       (organization_id, branch_id, name, phone, email, address, gstin, state_code, meta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        req.user.organizationId,
        req.user.branchId || 1, // ✅ default branch
        name,
        phone,
        email,
        address,
        gstin,
        state_code,
        meta || {},
      ]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error("[v0] Error creating customer:", error)
    res.status(500).json({ error: error.message })
  }
})

// 🟡 Update customer
router.put("/:id", async (req, res) => {
  const { name, phone, email, address, gstin, state_code } = req.body

  try {
    const result = await pool.query(
      `UPDATE customers 
       SET name = $1, phone = $2, email = $3, address = $4, gstin = $5, state_code = $6
       WHERE id = $7 AND organization_id = $8 AND branch_id = $9
       RETURNING *`,
      [
        name,
        phone,
        email,
        address,
        gstin,
        state_code,
        req.params.id,
        req.user.organizationId,
        req.user.branchId || 1,
      ]
    )
    res.json(result.rows[0])
  } catch (error) {
    console.error("[v0] Error updating customer:", error)
    res.status(500).json({ error: error.message })
  }
})

// 🔴 Delete customer
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM customers 
       WHERE id = $1 AND organization_id = $2 AND branch_id = $3`,
      [req.params.id, req.user.organizationId, req.user.branchId || 1]
    )
    res.json({ message: "Customer deleted" })
  } catch (error) {
    console.error("[v0] Error deleting customer:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
