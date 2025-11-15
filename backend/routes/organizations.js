import express from "express"
import pool from "../config/database.js"
import { authMiddleware, roleCheck } from "../middleware/auth.js"

const router = express.Router()

router.use(authMiddleware)

// Get Organization
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM organizations WHERE id = $1", [req.params.id])
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create Organization
router.post("/", roleCheck(["admin"]), async (req, res) => {
  const { name, gst_number, address, locale } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO organizations (name, gst_number, address, locale) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, gst_number, address, locale || "en-IN"],
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update Organization
router.put("/:id", roleCheck(["admin"]), async (req, res) => {
  const { name, gst_number, address } = req.body

  try {
    const result = await pool.query(
      `UPDATE organizations SET name = $1, gst_number = $2, address = $3 WHERE id = $4 RETURNING *`,
      [name, gst_number, address, req.params.id],
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
