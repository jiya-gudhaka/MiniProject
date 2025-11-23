import express from "express"
import pool from "../config/database.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

router.use(authMiddleware)

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT je.*, v.name AS vendor_name
       FROM journal_entries je
       LEFT JOIN vendors v ON je.vendor_id = v.id
       WHERE je.organization_id = $1
       ORDER BY je.entry_date DESC, je.id DESC`,
      [req.user.organizationId]
    )
    res.json(result.rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT je.* FROM journal_entries je WHERE je.organization_id = $1 AND je.vendor_id = $2 ORDER BY je.entry_date DESC`,
      [req.user.organizationId, req.params.vendorId]
    )
    res.json(result.rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const {
      entry_date,
      reference_no,
      vendor_id,
      description,
      debit_account,
      credit_account,
      amount,
      cgst_input,
      sgst_input,
      igst_input,
      total_amount,
      entry_type,
      ocr_json_path,
    } = req.body

    const result = await pool.query(
      `INSERT INTO journal_entries (
        organization_id, branch_id, entry_date, reference_no, vendor_id, description,
        debit_account, credit_account, amount, cgst_input, sgst_input, igst_input,
        total_amount, entry_type, ocr_json_path
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        req.user.organizationId,
        req.user.branchId || 1,
        entry_date,
        reference_no || null,
        vendor_id || null,
        description || null,
        debit_account,
        credit_account,
        amount,
        cgst_input || 0,
        sgst_input || 0,
        igst_input || 0,
        total_amount,
        entry_type || "purchase",
        ocr_json_path || null,
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router