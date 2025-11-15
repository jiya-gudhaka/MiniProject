import express from "express"
import bcrypt from "bcryptjs"
import pool from "../config/database.js"
import { generateToken } from "../config/jwt.js"

const router = express.Router()

// ✅ Register User
router.post("/register", async (req, res) => {
  const { name, email, password, role, organizationId, branchId } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, organization_id, branch_id, locale)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, role, organization_id, branch_id`,
      [name, email, hashedPassword, role, organizationId, branchId, "en-IN"]
    )

    const user = result.rows[0]
    const token = generateToken(user.id, user.organization_id, user.role)
    res.status(201).json({ user, token })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ error: error.message })
  }
})

// ✅ Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    const user = result.rows[0]

    if (!user) return res.status(404).json({ error: "User not found" })

    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) return res.status(401).json({ error: "Invalid password" })

    const token = generateToken(user.id, user.organization_id, user.role)
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        branchId: user.branch_id,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: error.message })
  }
})

// ✅ Get all branches (used in signup dropdown)
router.get("/branches", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM branches ORDER BY id ASC")
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
