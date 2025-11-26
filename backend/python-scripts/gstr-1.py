import pandas as pd
import psycopg2
import json
from collections import defaultdict
import sys
from datetime import datetime

# --- DB connection ---
conn = psycopg2.connect(
    host="localhost",
    database="your_db_name",
    user="your_db_user",
    password="your_db_pass",
    port=5432
)

# Fetch invoices with items for given date range (start/end passed via stdin)
input_json = sys.stdin.read()
params = json.loads(input_json)
start = params.get("start")
end = params.get("end")

query = """
SELECT i.id AS invoice_id, i.invoice_number, i.issue_date, i.net_amount AS invoice_value,
       i.place_of_supply_state AS pos, i.taxable_value, i.igst_amount, i.cgst_amount, i.sgst_amount,
       c.gstin AS customer_gstin
FROM invoices i
JOIN customers c ON c.id = i.customer_id
WHERE i.issue_date BETWEEN %s AND %s AND i.invoice_type='GST'
ORDER BY i.issue_date
"""
df = pd.read_sql(query, conn, params=(start, end))

# --- CSV Generation ---
df.to_csv("gstr1.csv", index=False)

# --- JSON Generation ---
def generate_gstr1_json(df):
    gstr1 = {"gstin": "YOUR_GSTIN_HERE", "fp": datetime.now().strftime("%m%Y"), "b2b": []}
    grouped = df.groupby("customer_gstin")
    for gstin, group in grouped:
        inv_list = []
        for _, row in group.iterrows():
            inv_list.append({
                "inum": row['invoice_number'],
                "idt": row['issue_date'].strftime("%d-%m-%Y"),
                "val": float(row['invoice_value']),
                "pos": row['pos'],
                "taxable": float(row['taxable_value']),
                "cgst": float(row['cgst_amount']),
                "sgst": float(row['sgst_amount']),
                "igst": float(row['igst_amount']),
                "itms": [
                    {"num": 1, "itm_det": {
                        "txval": float(row['taxable_value']),
                        "rt": 0,
                        "camt": float(row['cgst_amount']),
                        "samt": float(row['sgst_amount'])
                    }}
                ]
            })
        gstr1['b2b'].append({"ctin": gstin, "inv": inv_list})
    return gstr1

gstr1_json = generate_gstr1_json(df)
with open("gstr1.json", "w") as f:
    json.dump(gstr1_json, f, indent=2)

# --- Print summary ---
summary = {
    "total_customers": len(gstr1_json['b2b']),
    "total_invoices": len(df),
    "total_value": df['invoice_value'].sum()
}
print(json.dumps(summary))
