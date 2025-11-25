import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("pdfs"))
app.use(express.static("reports"))

// Serve frontend production build if present (optional)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontendDist = path.join(__dirname, "..", "frontend", "dist")
try {
  // If dist exists, serve it
  app.use(express.static(frontendDist))
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"))
  })
} catch (err) {
  // ignore if frontend build not present
}

app.get("/api/health", (req, res) => {
  console.log("[v0] Health check called")
  res.json({ status: "ok", message: "Backend is running!" })
})

// Routes
import authRoutes from "./routes/auth.js"
import organizationRoutes from "./routes/organizations.js"
import customerRoutes from "./routes/customers.js"
import productRoutes from "./routes/products.js"
import invoiceRoutes from "./routes/invoices.js"
import paymentRoutes from "./routes/payments.js"
import expenseRoutes from "./routes/expenses.js"
import reportRoutes from "./routes/reports.js"
import ocrRoutes from "./routes/ocr.js"
import pdfRoutes from "./routes/pdf-generation.js"
import reportGenRoutes from "./routes/report-generation.js"
import branchesRoutes from "./routes/branches.js"
import taxRoutes from "./routes/tax.js"
import backupRoutes from "./routes/backup.js"
import purchaseBillsRoutes from "./routes/purchase-bills.js"
import journalEntriesRoutes from "./routes/journal-entries.js"

app.use("/api/auth", authRoutes)
app.use("/api/organizations", organizationRoutes)
app.use("/api/customers", customerRoutes)
app.use("/api/products", productRoutes)
app.use("/api/invoices", invoiceRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/expenses", expenseRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/ocr", ocrRoutes)
app.use("/api/pdf", pdfRoutes)
app.use("/api/report-gen", reportGenRoutes)
app.use("/api/branches", branchesRoutes)
app.use("/api/tax", taxRoutes)
app.use("/api/backup", backupRoutes)
app.use("/api/purchase-bills", purchaseBillsRoutes)
app.use("/api/journal-entries", journalEntriesRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`[v0] Server running on http://localhost:${PORT}`)
  console.log(`[v0] Test health: curl http://localhost:${PORT}/api/health`)
})

// Error handling
process.on("unhandledRejection", (err) => {
  console.error("[v0] Unhandled Error:", err)
})
