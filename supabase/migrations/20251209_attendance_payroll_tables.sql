-- Migration: Create attendance and payroll_run tables
-- Run this in Supabase SQL Editor

-- =============================================
-- ATTENDANCE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS attendance_employeeattendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employee_employee(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES company_company(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clock_in TIME,
  clock_out TIME,
  clock_in_location_lat DECIMAL(10, 8),
  clock_in_location_lng DECIMAL(11, 8),
  clock_out_location_lat DECIMAL(10, 8),
  clock_out_location_lng DECIMAL(11, 8),
  total_hours DECIMAL(5, 2),
  status VARCHAR(20) NOT NULL DEFAULT 'clocked_in' CHECK (status IN ('clocked_in', 'clocked_out', 'absent')),
  work_type VARCHAR(50) DEFAULT 'office' CHECK (work_type IN ('office', 'wfh', 'field', 'hybrid')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate attendance records for same employee on same day
  UNIQUE(employee_id, date)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date
  ON attendance_employeeattendance(employee_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_attendance_company_date
  ON attendance_employeeattendance(company_id, date DESC);

-- =============================================
-- PAYROLL RUN TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS payroll_run (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES company_company(id) ON DELETE CASCADE,
  pay_period_month INTEGER NOT NULL CHECK (pay_period_month BETWEEN 1 AND 12),
  pay_period_year INTEGER NOT NULL CHECK (pay_period_year >= 2020),
  pay_period_start DATE,
  pay_period_end DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'failed', 'cancelled')),
  total_employees INTEGER DEFAULT 0,
  total_gross_amount DECIMAL(15, 2) DEFAULT 0,
  total_deductions DECIMAL(15, 2) DEFAULT 0,
  total_net_amount DECIMAL(15, 2) DEFAULT 0,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate payroll runs for same company/month/year
  UNIQUE(company_id, pay_period_month, pay_period_year)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_payroll_run_company
  ON payroll_run(company_id, pay_period_year DESC, pay_period_month DESC);

-- =============================================
-- PAYROLL RUN DETAILS TABLE (Individual employee payroll in a run)
-- =============================================
CREATE TABLE IF NOT EXISTS payroll_run_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_run_id UUID NOT NULL REFERENCES payroll_run(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employee_employee(id) ON DELETE CASCADE,
  basic_salary DECIMAL(12, 2) DEFAULT 0,
  hra DECIMAL(12, 2) DEFAULT 0,
  lta DECIMAL(12, 2) DEFAULT 0,
  medical_allowance DECIMAL(12, 2) DEFAULT 0,
  special_allowance DECIMAL(12, 2) DEFAULT 0,
  telephone_allowance DECIMAL(12, 2) DEFAULT 0,
  performance_bonus DECIMAL(12, 2) DEFAULT 0,
  other_earnings DECIMAL(12, 2) DEFAULT 0,
  gross_salary DECIMAL(12, 2) DEFAULT 0,
  epf_employee DECIMAL(12, 2) DEFAULT 0,
  epf_employer DECIMAL(12, 2) DEFAULT 0,
  esic_employee DECIMAL(12, 2) DEFAULT 0,
  esic_employer DECIMAL(12, 2) DEFAULT 0,
  professional_tax DECIMAL(12, 2) DEFAULT 0,
  income_tax DECIMAL(12, 2) DEFAULT 0,
  other_deductions DECIMAL(12, 2) DEFAULT 0,
  total_deductions DECIMAL(12, 2) DEFAULT 0,
  net_salary DECIMAL(12, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One entry per employee per payroll run
  UNIQUE(payroll_run_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_payroll_detail_run
  ON payroll_run_detail(payroll_run_id);

CREATE INDEX IF NOT EXISTS idx_payroll_detail_employee
  ON payroll_run_detail(employee_id);

-- =============================================
-- TRIGGERS FOR updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON attendance_employeeattendance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_run_updated_at
    BEFORE UPDATE ON payroll_run
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (Optional but recommended)
-- =============================================
-- Enable RLS
ALTER TABLE attendance_employeeattendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_run ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_run_detail ENABLE ROW LEVEL SECURITY;

-- Policies for attendance (employees can see their own, employers can see all in company)
CREATE POLICY "Employees can view own attendance" ON attendance_employeeattendance
  FOR SELECT USING (auth.uid()::text = employee_id::text);

CREATE POLICY "Employees can insert own attendance" ON attendance_employeeattendance
  FOR INSERT WITH CHECK (auth.uid()::text = employee_id::text);

CREATE POLICY "Employees can update own attendance" ON attendance_employeeattendance
  FOR UPDATE USING (auth.uid()::text = employee_id::text);

-- For testing/dev, allow all authenticated users (remove in production)
CREATE POLICY "Allow all for authenticated users" ON attendance_employeeattendance
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all payroll_run for authenticated" ON payroll_run
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all payroll_run_detail for authenticated" ON payroll_run_detail
  FOR ALL USING (auth.role() = 'authenticated');
