-- Migration: Add NOT NULL and UNIQUE constraints for data integrity
-- Run this in Supabase SQL Editor after the base tables exist

-- =============================================
-- NOT NULL CONSTRAINTS
-- =============================================

-- Ensure company_companyemployee always has required references
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'company_companyemployee'::regclass AND attname = 'company_id' AND NOT attnotnull) THEN
        ALTER TABLE company_companyemployee ALTER COLUMN company_id SET NOT NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'company_companyemployee'::regclass AND attname = 'employee_id' AND NOT attnotnull) THEN
        ALTER TABLE company_companyemployee ALTER COLUMN employee_id SET NOT NULL;
    END IF;
EXCEPTION
    WHEN undefined_column THEN
        RAISE NOTICE 'Skipping: column does not exist';
    WHEN undefined_table THEN
        RAISE NOTICE 'Skipping: table company_companyemployee does not exist';
END $$;

-- Ensure employer always has user_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'company_employer'::regclass AND attname = 'user_id' AND NOT attnotnull) THEN
        ALTER TABLE company_employer ALTER COLUMN user_id SET NOT NULL;
    END IF;
EXCEPTION
    WHEN undefined_column THEN
        RAISE NOTICE 'Skipping: column does not exist';
    WHEN undefined_table THEN
        RAISE NOTICE 'Skipping: table company_employer does not exist';
END $$;

-- Ensure employee always has user_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'employee_employee'::regclass AND attname = 'user_id' AND NOT attnotnull) THEN
        ALTER TABLE employee_employee ALTER COLUMN user_id SET NOT NULL;
    END IF;
EXCEPTION
    WHEN undefined_column THEN
        RAISE NOTICE 'Skipping: column does not exist';
    WHEN undefined_table THEN
        RAISE NOTICE 'Skipping: table employee_employee does not exist';
END $$;

-- Ensure contractor always has user_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'contractor_contractor'::regclass AND attname = 'user_id' AND NOT attnotnull) THEN
        ALTER TABLE contractor_contractor ALTER COLUMN user_id SET NOT NULL;
    END IF;
EXCEPTION
    WHEN undefined_column THEN
        RAISE NOTICE 'Skipping: column does not exist';
    WHEN undefined_table THEN
        RAISE NOTICE 'Skipping: table contractor_contractor does not exist';
END $$;


-- =============================================
-- UNIQUE CONSTRAINTS
-- =============================================

-- Unique leave balance per employee per leave type per financial year
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'unique_employee_leavetype_year'
        AND conrelid = 'leave_leavebalance'::regclass
    ) THEN
        ALTER TABLE leave_leavebalance
        ADD CONSTRAINT unique_employee_leavetype_year
        UNIQUE (employee_id, leave_type_id, financial_year);
    END IF;
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Skipping: table leave_leavebalance does not exist';
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint already exists';
END $$;

-- Unique investment declaration per employee per financial year
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'unique_employee_investment_year'
        AND conrelid = 'employee_investmentdeclaration'::regclass
    ) THEN
        ALTER TABLE employee_investmentdeclaration
        ADD CONSTRAINT unique_employee_investment_year
        UNIQUE (employee_id, financial_year);
    END IF;
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Skipping: table employee_investmentdeclaration does not exist';
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint already exists';
END $$;


-- =============================================
-- VERSION COLUMN FOR OPTIMISTIC LOCKING
-- =============================================

-- Add version column to leave_leavebalance for optimistic locking
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'leave_leavebalance' AND column_name = 'version'
    ) THEN
        ALTER TABLE leave_leavebalance ADD COLUMN version INTEGER DEFAULT 1;
    END IF;
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Skipping: table leave_leavebalance does not exist';
END $$;


-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Index for leave requests by employee and status
CREATE INDEX IF NOT EXISTS idx_leave_request_employee_status
    ON leave_leaverequest(employee_id, status);

-- Index for expense claims by employee and status
CREATE INDEX IF NOT EXISTS idx_expense_claim_employee_status
    ON expense_expenseclaim(employee_id, status);

-- Index for invoices by company
CREATE INDEX IF NOT EXISTS idx_invoice_company
    ON invoice_invoice(company_id);

-- Index for contractor contracts by company
CREATE INDEX IF NOT EXISTS idx_contract_company
    ON contractor_contractorcontract(company_id);


-- =============================================
-- CHECK CONSTRAINTS FOR DATA VALIDATION
-- =============================================

-- Ensure leave request end_date >= start_date
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'check_leave_dates'
        AND conrelid = 'leave_leaverequest'::regclass
    ) THEN
        ALTER TABLE leave_leaverequest
        ADD CONSTRAINT check_leave_dates
        CHECK (end_date >= start_date);
    END IF;
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Skipping: table leave_leaverequest does not exist';
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint already exists';
END $$;

-- Ensure expense amounts are positive
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'check_expense_amount_positive'
        AND conrelid = 'expense_expenseclaim'::regclass
    ) THEN
        ALTER TABLE expense_expenseclaim
        ADD CONSTRAINT check_expense_amount_positive
        CHECK (amount > 0);
    END IF;
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Skipping: table expense_expenseclaim does not exist';
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint already exists';
END $$;

-- Ensure invoice amounts are non-negative
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'check_invoice_amount_nonnegative'
        AND conrelid = 'invoice_invoice'::regclass
    ) THEN
        ALTER TABLE invoice_invoice
        ADD CONSTRAINT check_invoice_amount_nonnegative
        CHECK (total_amount >= 0);
    END IF;
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Skipping: table invoice_invoice does not exist';
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint already exists';
END $$;
