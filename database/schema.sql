-- Organizations Table
CREATE TABLE organizations (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  gst_number VARCHAR(20),
  address TEXT,
  locale VARCHAR(10) DEFAULT 'en-IN',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Branches Table
CREATE TABLE branches (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NOT NULL REFERENCES organizations(id),
  name VARCHAR(150) NOT NULL,
  address TEXT,
  gst_number VARCHAR(20),
  state_code CHAR(2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NOT NULL REFERENCES organizations(id),
  branch_id BIGINT REFERENCES branches(id),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'accountant', 'sales')),
  locale VARCHAR(10) DEFAULT 'en-IN',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Customers Table
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NOT NULL REFERENCES organizations(id),
  branch_id BIGINT REFERENCES branches(id),
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(150),
  address TEXT,
  gstin VARCHAR(15),
  state_code CHAR(2),
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NOT NULL REFERENCES organizations(id),
  branch_id BIGINT REFERENCES branches(id),
  name VARCHAR(150) NOT NULL,
  hsn_sac_code VARCHAR(20),
  price NUMERIC(12,2) NOT NULL,
  expected_gst_rate NUMERIC(5,2) DEFAULT 0,
  stock INT DEFAULT 0,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invoices Table
CREATE TABLE invoices (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NOT NULL REFERENCES organizations(id),
  branch_id BIGINT REFERENCES branches(id),
  customer_id BIGINT REFERENCES customers(id),
  created_by BIGINT REFERENCES users(id),
  invoice_number VARCHAR(60) UNIQUE,
  invoice_type VARCHAR(20) CHECK (invoice_type IN ('GST', 'Non-GST')),
  issue_date DATE NOT NULL,
  taxable_value NUMERIC(12,2) DEFAULT 0,
  cgst_amount NUMERIC(12,2) DEFAULT 0,
  sgst_amount NUMERIC(12,2) DEFAULT 0,
  igst_amount NUMERIC(12,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  rounding NUMERIC(12,2) DEFAULT 0,
  net_amount NUMERIC(12,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial')),
  place_of_supply_state CHAR(2),
  pdf_url TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoice Items Table
CREATE TABLE invoice_items (
  id BIGSERIAL PRIMARY KEY,
  invoice_id BIGINT NOT NULL REFERENCES invoices(id),
  product_id BIGINT REFERENCES products(id),
  description VARCHAR(200),
  qty NUMERIC(12,3) NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  applied_gst_rate NUMERIC(5,2) DEFAULT 0,
  line_discount NUMERIC(12,2) DEFAULT 0,
  line_total NUMERIC(12,2) NOT NULL,
  meta JSONB DEFAULT '{}'
);

-- Payments Table
CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  invoice_id BIGINT NOT NULL REFERENCES invoices(id),
  method VARCHAR(30),
  provider VARCHAR(50),
  txn_id VARCHAR(120),
  status VARCHAR(20) CHECK (status IN ('success', 'pending', 'failed')),
  amount NUMERIC(12,2),
  received_at TIMESTAMP,
  meta JSONB DEFAULT '{}'
);

-- Vendors Table
CREATE TABLE vendors (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NOT NULL REFERENCES organizations(id),
  branch_id BIGINT REFERENCES branches(id),
  name VARCHAR(150) NOT NULL,
  gstin VARCHAR(15),
  phone VARCHAR(20),
  email VARCHAR(150),
  address TEXT,
  state_code CHAR(2),
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);
-- Expenses Table
CREATE TABLE expenses (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NOT NULL REFERENCES organizations(id),
  branch_id BIGINT REFERENCES branches(id),
  category VARCHAR(100),
  vendor VARCHAR(150),
  vendor_id BIGINT REFERENCES vendors(id),
  amount NUMERIC(12,2),
  gst_percent NUMERIC(5,2),
  expense_date DATE,
  notes TEXT,
  purchase_bill_id BIGINT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);



-- Purchase Bills Table
CREATE TABLE purchase_bills (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NOT NULL REFERENCES organizations(id),
  branch_id BIGINT REFERENCES branches(id),
  vendor_id BIGINT REFERENCES vendors(id),
  uploaded_by BIGINT REFERENCES users(id),
  bill_number VARCHAR(80),
  bill_date DATE,
  raw_text TEXT,
  structured_json JSONB DEFAULT '{}',
  file_url TEXT,
  status VARCHAR(20),
  subtotal NUMERIC(12,2),
  cgst_amount NUMERIC(12,2),
  sgst_amount NUMERIC(12,2),
  igst_amount NUMERIC(12,2),
  discount_amount NUMERIC(12,2),
  rounding NUMERIC(12,2),
  net_amount NUMERIC(12,2),
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Purchase Bill Items
CREATE TABLE purchase_bill_items (
  id BIGSERIAL PRIMARY KEY,
  purchase_bill_id BIGINT NOT NULL REFERENCES purchase_bills(id),
  product_id BIGINT REFERENCES products(id),
  description VARCHAR(200),
  qty NUMERIC(12,3),
  price NUMERIC(12,2),
  applied_gst_rate NUMERIC(5,2),
  line_discount NUMERIC(12,2),
  line_total NUMERIC(12,2),
  meta JSONB DEFAULT '{}'
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NOT NULL REFERENCES organizations(id),
  user_id BIGINT REFERENCES users(id),
  action VARCHAR(100),
  entity VARCHAR(40),
  entity_id BIGINT,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- E-way Bills Table
CREATE TABLE ewaybills (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NOT NULL REFERENCES organizations(id),
  branch_id BIGINT REFERENCES branches(id),
  invoice_id BIGINT REFERENCES invoices(id),
  generated_by BIGINT REFERENCES users(id),
  ewaybill_no VARCHAR(50),
  file_url TEXT,
  status VARCHAR(20),
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_invoices_org ON invoices(organization_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_date ON invoices(issue_date);
CREATE INDEX idx_customers_org ON customers(organization_id);
CREATE INDEX idx_products_org ON products(organization_id);
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id);
