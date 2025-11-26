import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// --- Generate GSTR-1 summary ---
router.get("/gstr1", (req, res) => {
  const { start, end } = req.query;
  const python = spawn("python", [path.join(__dirname, "../gstr1_generator.py")]);

  python.stdin.write(JSON.stringify({ start, end }));
  python.stdin.end();

  let output = "";
  python.stdout.on("data", (data) => { output += data.toString(); });
  python.stderr.on("data", (data) => console.error(data.toString()));

  python.on("close", () => {
    try {
      const summary = JSON.parse(output);
      res.json({ status: "success", data: summary });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "error", message: "Failed to generate GSTR-1" });
    }
  });
});

// --- Export CSV or JSON ---
router.get("/gstr1/export", (req, res) => {
  const { format } = req.query;
  const file = format === "json" ? "gstr1.json" : "gstr1.csv";
  res.sendFile(path.join(__dirname, "../", file));
});

// --- GSTR-3B (dummy example, you can enhance later) ---
router.get("/gstr3b", (req, res) => {
  res.json({
    summary: {
      taxable: 50000,
      cgst: 4500,
      sgst: 4500,
      igst: 0,
      cess: 0
    }
  });
});

router.get("/gstr3b/export", (req, res) => {
  const { format } = req.query;
  const data = [{ taxable: 50000, cgst: 4500, sgst: 4500, igst: 0, cess: 0 }];
  if (format === "json") {
    res.json(data);
  } else {
    const csv = "taxable,cgst,sgst,igst,cess\n" + data.map(d => `${d.taxable},${d.cgst},${d.sgst},${d.igst},${d.cess}`).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  }
});

export default router;
