import express from "express"
import pool from "../config/database.js"

const router = express.Router()

// ✅ Get all branches
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, address, gst_number, state_code FROM branches ORDER BY id")
    res.json(result.rows)
  } catch (error) {
    console.error("[v0] Error fetching branches:", error)
    res.status(500).json({ error: "Failed to fetch branches" })
  }
})

export default router
