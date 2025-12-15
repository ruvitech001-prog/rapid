export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance_employeeattendance: {
        Row: {
          clock_in: string | null
          clock_in_location_lat: number | null
          clock_in_location_lng: number | null
          clock_out: string | null
          clock_out_location_lat: number | null
          clock_out_location_lng: number | null
          company_id: string | null
          created_at: string | null
          date: string
          employee_id: string | null
          id: string
          status: string | null
          total_hours: number | null
          updated_at: string | null
          work_type: string | null
        }
        Insert: {
          clock_in?: string | null
          clock_in_location_lat?: number | null
          clock_in_location_lng?: number | null
          clock_out?: string | null
          clock_out_location_lat?: number | null
          clock_out_location_lng?: number | null
          company_id?: string | null
          created_at?: string | null
          date: string
          employee_id?: string | null
          id?: string
          status?: string | null
          total_hours?: number | null
          updated_at?: string | null
          work_type?: string | null
        }
        Update: {
          clock_in?: string | null
          clock_in_location_lat?: number | null
          clock_in_location_lng?: number | null
          clock_out?: string | null
          clock_out_location_lat?: number | null
          clock_out_location_lng?: number | null
          company_id?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string | null
          id?: string
          status?: string | null
          total_hours?: number | null
          updated_at?: string | null
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employeeattendance_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_employeeattendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_revenue: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          invoice_count: number | null
          month: string
          paid_amount: number | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          invoice_count?: number | null
          month: string
          paid_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          invoice_count?: number | null
          month?: string
          paid_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_revenue_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
        ]
      }
      commons_address: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          city: string
          country: string | null
          created_at: string | null
          id: string
          pin_code: string
          state: string
          updated_at: string | null
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          city: string
          country?: string | null
          created_at?: string | null
          id?: string
          pin_code: string
          state: string
          updated_at?: string | null
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          city?: string
          country?: string | null
          created_at?: string | null
          id?: string
          pin_code?: string
          state?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      commons_bankaccount: {
        Row: {
          account_holder_name: string
          account_number: string
          account_type: string | null
          bank_name: string | null
          branch_name: string | null
          contractor_id: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          ifsc_code: string
          is_primary: boolean | null
          is_verified: boolean | null
          updated_at: string | null
        }
        Insert: {
          account_holder_name: string
          account_number: string
          account_type?: string | null
          bank_name?: string | null
          branch_name?: string | null
          contractor_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          ifsc_code: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          updated_at?: string | null
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          account_type?: string | null
          bank_name?: string | null
          branch_name?: string | null
          contractor_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          ifsc_code?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commons_bankaccount_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractor_contractor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commons_bankaccount_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
        ]
      }
      commons_bankbranch: {
        Row: {
          address: string | null
          bank_name: string
          branch_name: string
          city: string | null
          contact: string | null
          id: string
          ifsc_code: string
          state: string | null
        }
        Insert: {
          address?: string | null
          bank_name: string
          branch_name: string
          city?: string | null
          contact?: string | null
          id?: string
          ifsc_code: string
          state?: string | null
        }
        Update: {
          address?: string | null
          bank_name?: string
          branch_name?: string
          city?: string | null
          contact?: string | null
          id?: string
          ifsc_code?: string
          state?: string | null
        }
        Relationships: []
      }
      commons_document: {
        Row: {
          company_id: string | null
          contractor_id: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          document_category: string | null
          document_subcategory: string | null
          document_type: string
          employee_id: string | null
          file_name: string
          file_size: number | null
          file_type: string
          financial_year: string | null
          id: string
          is_deleted: boolean | null
          is_signed: boolean | null
          is_verified: boolean | null
          previous_version_id: string | null
          rejection_reason: string | null
          requires_signature: boolean | null
          signature_hash: string | null
          signature_provider: string | null
          signature_recipient_email: string | null
          signature_sent_at: string | null
          signature_status: string | null
          signed_at: string | null
          signed_by: string | null
          signer_email: string | null
          signer_name: string | null
          storage_bucket: string
          storage_path: string
          storage_url: string | null
          updated_at: string | null
          uploaded_by_id: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
          version: number | null
          zoho_request_id: string | null
        }
        Insert: {
          company_id?: string | null
          contractor_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          document_category?: string | null
          document_subcategory?: string | null
          document_type: string
          employee_id?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          financial_year?: string | null
          id?: string
          is_deleted?: boolean | null
          is_signed?: boolean | null
          is_verified?: boolean | null
          previous_version_id?: string | null
          rejection_reason?: string | null
          requires_signature?: boolean | null
          signature_hash?: string | null
          signature_provider?: string | null
          signature_recipient_email?: string | null
          signature_sent_at?: string | null
          signature_status?: string | null
          signed_at?: string | null
          signed_by?: string | null
          signer_email?: string | null
          signer_name?: string | null
          storage_bucket: string
          storage_path: string
          storage_url?: string | null
          updated_at?: string | null
          uploaded_by_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          version?: number | null
          zoho_request_id?: string | null
        }
        Update: {
          company_id?: string | null
          contractor_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          document_category?: string | null
          document_subcategory?: string | null
          document_type?: string
          employee_id?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          financial_year?: string | null
          id?: string
          is_deleted?: boolean | null
          is_signed?: boolean | null
          is_verified?: boolean | null
          previous_version_id?: string | null
          rejection_reason?: string | null
          requires_signature?: boolean | null
          signature_hash?: string | null
          signature_provider?: string | null
          signature_recipient_email?: string | null
          signature_sent_at?: string | null
          signature_status?: string | null
          signed_at?: string | null
          signed_by?: string | null
          signer_email?: string | null
          signer_name?: string | null
          storage_bucket?: string
          storage_path?: string
          storage_url?: string | null
          updated_at?: string | null
          uploaded_by_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          version?: number | null
          zoho_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commons_document_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commons_document_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractor_contractor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commons_document_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commons_document_previous_version_id_fkey"
            columns: ["previous_version_id"]
            isOneToOne: false
            referencedRelation: "commons_document"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commons_document_signed_by_fkey"
            columns: ["signed_by"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commons_document_uploaded_by_id_fkey"
            columns: ["uploaded_by_id"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commons_document_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
        ]
      }
      commons_emergencycontact: {
        Row: {
          alternate_phone: string | null
          contractor_id: string | null
          created_at: string | null
          email: string | null
          employee_id: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone_number: string
          relationship: string
          updated_at: string | null
        }
        Insert: {
          alternate_phone?: string | null
          contractor_id?: string | null
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone_number: string
          relationship: string
          updated_at?: string | null
        }
        Update: {
          alternate_phone?: string | null
          contractor_id?: string | null
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone_number?: string
          relationship?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commons_emergencycontact_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractor_contractor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commons_emergencycontact_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
        ]
      }
      company_company: {
        Row: {
          cin: string | null
          created_at: string | null
          display_name: string | null
          gstin: string | null
          id: string
          is_active: boolean | null
          legal_name: string
          logo_url: string | null
          organization_id: string | null
          pan: string | null
          registered_address_id: string | null
          updated_at: string | null
        }
        Insert: {
          cin?: string | null
          created_at?: string | null
          display_name?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean | null
          legal_name: string
          logo_url?: string | null
          organization_id?: string | null
          pan?: string | null
          registered_address_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cin?: string | null
          created_at?: string | null
          display_name?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean | null
          legal_name?: string
          logo_url?: string | null
          organization_id?: string | null
          pan?: string | null
          registered_address_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_company_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "company_organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_company_registered_address_id_fkey"
            columns: ["registered_address_id"]
            isOneToOne: false
            referencedRelation: "commons_address"
            referencedColumns: ["id"]
          },
        ]
      }
      company_companyemployee: {
        Row: {
          company_id: string | null
          employee_id: string | null
          exited_at: string | null
          id: string
          is_active: boolean | null
          joined_at: string
        }
        Insert: {
          company_id?: string | null
          employee_id?: string | null
          exited_at?: string | null
          id?: string
          is_active?: boolean | null
          joined_at: string
        }
        Update: {
          company_id?: string | null
          employee_id?: string | null
          exited_at?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_companyemployee_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_companyemployee_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
        ]
      }
      company_employer: {
        Row: {
          company_id: string | null
          created_at: string | null
          department: string | null
          designation: string | null
          id: string
          phone_number: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          designation?: string | null
          id?: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          designation?: string | null
          id?: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_employer_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_employer_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
        ]
      }
      company_expensepolicy: {
        Row: {
          approval_limit: number | null
          company_id: string | null
          created_at: string | null
          expense_category: string
          id: string
          is_active: boolean | null
          is_taxable: boolean | null
          per_diem_rate: number | null
          receipt_mandatory: boolean | null
          requires_approval: boolean | null
          updated_at: string | null
        }
        Insert: {
          approval_limit?: number | null
          company_id?: string | null
          created_at?: string | null
          expense_category: string
          id?: string
          is_active?: boolean | null
          is_taxable?: boolean | null
          per_diem_rate?: number | null
          receipt_mandatory?: boolean | null
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Update: {
          approval_limit?: number | null
          company_id?: string | null
          created_at?: string | null
          expense_category?: string
          id?: string
          is_active?: boolean | null
          is_taxable?: boolean | null
          per_diem_rate?: number | null
          receipt_mandatory?: boolean | null
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_expensepolicy_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
        ]
      }
      company_leavepolicy: {
        Row: {
          accrual_rate: number | null
          allow_carry_forward: boolean | null
          allow_encashment: boolean | null
          annual_allocation: number
          company_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          leave_type: string
          max_carry_forward: number | null
          max_consecutive_days: number | null
          min_days_per_request: number | null
          requires_approval: boolean | null
          requires_documentation: boolean | null
          updated_at: string | null
        }
        Insert: {
          accrual_rate?: number | null
          allow_carry_forward?: boolean | null
          allow_encashment?: boolean | null
          annual_allocation: number
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          leave_type: string
          max_carry_forward?: number | null
          max_consecutive_days?: number | null
          min_days_per_request?: number | null
          requires_approval?: boolean | null
          requires_documentation?: boolean | null
          updated_at?: string | null
        }
        Update: {
          accrual_rate?: number | null
          allow_carry_forward?: boolean | null
          allow_encashment?: boolean | null
          annual_allocation?: number
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          leave_type?: string
          max_carry_forward?: number | null
          max_consecutive_days?: number | null
          min_days_per_request?: number | null
          requires_approval?: boolean | null
          requires_documentation?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_leavepolicy_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
        ]
      }
      company_organization: {
        Row: {
          created_at: string | null
          created_by_id: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by_id?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by_id?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_organization_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
        ]
      }
      company_status_history: {
        Row: {
          changed_by: string | null
          company_id: string
          created_at: string | null
          id: string
          previous_status: string | null
          reason: string | null
          status: string
        }
        Insert: {
          changed_by?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          previous_status?: string | null
          reason?: string | null
          status: string
        }
        Update: {
          changed_by?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          previous_status?: string | null
          reason?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_status_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_contractor: {
        Row: {
          bgv_completed_at: string | null
          bgv_status: string | null
          business_name: string | null
          contractor_code: string | null
          created_at: string | null
          full_name: string
          gstin: string | null
          id: string
          kyc_status: string | null
          pan_number: string | null
          phone_number: string | null
          springverify_candidate_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bgv_completed_at?: string | null
          bgv_status?: string | null
          business_name?: string | null
          contractor_code?: string | null
          created_at?: string | null
          full_name: string
          gstin?: string | null
          id?: string
          kyc_status?: string | null
          pan_number?: string | null
          phone_number?: string | null
          springverify_candidate_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bgv_completed_at?: string | null
          bgv_status?: string | null
          business_name?: string | null
          contractor_code?: string | null
          created_at?: string | null
          full_name?: string
          gstin?: string | null
          id?: string
          kyc_status?: string | null
          pan_number?: string | null
          phone_number?: string | null
          springverify_candidate_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_contractor_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_contractorcontract: {
        Row: {
          company_id: string | null
          contractor_id: string | null
          created_at: string | null
          end_date: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          is_current: boolean | null
          monthly_rate: number | null
          payment_terms: string | null
          scope_of_work: string | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          contractor_id?: string | null
          created_at?: string | null
          end_date?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_current?: boolean | null
          monthly_rate?: number | null
          payment_terms?: string | null
          scope_of_work?: string | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          contractor_id?: string | null
          created_at?: string | null
          end_date?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_current?: boolean | null
          monthly_rate?: number | null
          payment_terms?: string | null
          scope_of_work?: string | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_contractorcontract_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_contractorcontract_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractor_contractor"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_invoice: {
        Row: {
          billing_period_end: string | null
          billing_period_start: string | null
          cgst_amount: number | null
          cgst_percent: number | null
          contract_id: string | null
          contractor_id: string | null
          created_at: string | null
          due_date: string | null
          hours: number | null
          id: string
          igst_amount: number | null
          igst_percent: number | null
          invoice_date: string
          invoice_number: string
          paid_date: string | null
          payment_reference: string | null
          rate: number | null
          sgst_amount: number | null
          sgst_percent: number | null
          status: string | null
          subtotal: number
          timesheet_id: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          billing_period_end?: string | null
          billing_period_start?: string | null
          cgst_amount?: number | null
          cgst_percent?: number | null
          contract_id?: string | null
          contractor_id?: string | null
          created_at?: string | null
          due_date?: string | null
          hours?: number | null
          id?: string
          igst_amount?: number | null
          igst_percent?: number | null
          invoice_date: string
          invoice_number: string
          paid_date?: string | null
          payment_reference?: string | null
          rate?: number | null
          sgst_amount?: number | null
          sgst_percent?: number | null
          status?: string | null
          subtotal: number
          timesheet_id?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          billing_period_end?: string | null
          billing_period_start?: string | null
          cgst_amount?: number | null
          cgst_percent?: number | null
          contract_id?: string | null
          contractor_id?: string | null
          created_at?: string | null
          due_date?: string | null
          hours?: number | null
          id?: string
          igst_amount?: number | null
          igst_percent?: number | null
          invoice_date?: string
          invoice_number?: string
          paid_date?: string | null
          payment_reference?: string | null
          rate?: number | null
          sgst_amount?: number | null
          sgst_percent?: number | null
          status?: string | null
          subtotal?: number
          timesheet_id?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_invoice_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contractor_contractorcontract"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_invoice_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractor_contractor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_invoice_timesheet_id_fkey"
            columns: ["timesheet_id"]
            isOneToOne: false
            referencedRelation: "contractor_timesheet"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_timesheet: {
        Row: {
          approved_at: string | null
          approved_by_id: string | null
          contract_id: string | null
          contractor_id: string | null
          created_at: string | null
          friday_hours: number | null
          id: string
          monday_hours: number | null
          saturday_hours: number | null
          status: string | null
          submitted_at: string | null
          sunday_hours: number | null
          task_description: string | null
          thursday_hours: number | null
          tuesday_hours: number | null
          updated_at: string | null
          wednesday_hours: number | null
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          approved_at?: string | null
          approved_by_id?: string | null
          contract_id?: string | null
          contractor_id?: string | null
          created_at?: string | null
          friday_hours?: number | null
          id?: string
          monday_hours?: number | null
          saturday_hours?: number | null
          status?: string | null
          submitted_at?: string | null
          sunday_hours?: number | null
          task_description?: string | null
          thursday_hours?: number | null
          tuesday_hours?: number | null
          updated_at?: string | null
          wednesday_hours?: number | null
          week_end_date: string
          week_start_date: string
        }
        Update: {
          approved_at?: string | null
          approved_by_id?: string | null
          contract_id?: string | null
          contractor_id?: string | null
          created_at?: string | null
          friday_hours?: number | null
          id?: string
          monday_hours?: number | null
          saturday_hours?: number | null
          status?: string | null
          submitted_at?: string | null
          sunday_hours?: number | null
          task_description?: string | null
          thursday_hours?: number | null
          tuesday_hours?: number | null
          updated_at?: string | null
          wednesday_hours?: number | null
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_timesheet_approved_by_id_fkey"
            columns: ["approved_by_id"]
            isOneToOne: false
            referencedRelation: "company_employer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_timesheet_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contractor_contractorcontract"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_timesheet_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractor_contractor"
            referencedColumns: ["id"]
          },
        ]
      }
      e_signature_employmentagreement: {
        Row: {
          agreement_url: string | null
          contract_id: string | null
          created_at: string | null
          employee_id: string | null
          expires_at: string | null
          external_id: string | null
          id: string
          provider: string
          sent_at: string | null
          signed_at: string | null
          signed_document_url: string | null
          status: string | null
          template_type: string | null
          updated_at: string | null
          viewed_at: string | null
        }
        Insert: {
          agreement_url?: string | null
          contract_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          expires_at?: string | null
          external_id?: string | null
          id?: string
          provider: string
          sent_at?: string | null
          signed_at?: string | null
          signed_document_url?: string | null
          status?: string | null
          template_type?: string | null
          updated_at?: string | null
          viewed_at?: string | null
        }
        Update: {
          agreement_url?: string | null
          contract_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          expires_at?: string | null
          external_id?: string | null
          id?: string
          provider?: string
          sent_at?: string | null
          signed_at?: string | null
          signed_document_url?: string | null
          status?: string | null
          template_type?: string | null
          updated_at?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_signature_employmentagreement_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "employee_employeecontract"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_signature_employmentagreement_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
        ]
      }
      ekyc_verification_kycverificationdetail: {
        Row: {
          contractor_id: string | null
          created_at: string | null
          document_id: string | null
          employee_id: string | null
          extracted_data: Json | null
          failed_reason: string | null
          id: string
          match_score: number | null
          person_id: string | null
          status: string | null
          updated_at: string | null
          verification_data: Json | null
          verification_id: string | null
          verification_type: string
          verified_at: string | null
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string | null
          document_id?: string | null
          employee_id?: string | null
          extracted_data?: Json | null
          failed_reason?: string | null
          id?: string
          match_score?: number | null
          person_id?: string | null
          status?: string | null
          updated_at?: string | null
          verification_data?: Json | null
          verification_id?: string | null
          verification_type: string
          verified_at?: string | null
        }
        Update: {
          contractor_id?: string | null
          created_at?: string | null
          document_id?: string | null
          employee_id?: string | null
          extracted_data?: Json | null
          failed_reason?: string | null
          id?: string
          match_score?: number | null
          person_id?: string | null
          status?: string | null
          updated_at?: string | null
          verification_data?: Json | null
          verification_id?: string | null
          verification_type?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ekyc_verification_kycverificationdetail_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractor_contractor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ekyc_verification_kycverificationdetail_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "commons_document"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ekyc_verification_kycverificationdetail_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_asset: {
        Row: {
          company_id: string
          created_at: string | null
          delivered_at: string | null
          description: string | null
          employee_id: string
          id: string
          name: string
          ordered_at: string | null
          receipt_notes: string | null
          received_at: string | null
          serial_number: string | null
          shipped_at: string | null
          status: string
          tracking_number: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          delivered_at?: string | null
          description?: string | null
          employee_id: string
          id?: string
          name: string
          ordered_at?: string | null
          receipt_notes?: string | null
          received_at?: string | null
          serial_number?: string | null
          shipped_at?: string | null
          status?: string
          tracking_number?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          delivered_at?: string | null
          description?: string | null
          employee_id?: string
          id?: string
          name?: string
          ordered_at?: string | null
          receipt_notes?: string | null
          received_at?: string | null
          serial_number?: string | null
          shipped_at?: string | null
          status?: string
          tracking_number?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_asset_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_asset_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_employee: {
        Row: {
          aadhaar_number: string | null
          bgv_completed_at: string | null
          bgv_status: string | null
          blood_group: string | null
          created_at: string | null
          current_address_id: string | null
          date_of_birth: string | null
          deleted_at: string | null
          documents_signed: boolean | null
          employee_code: string | null
          esic_number: string | null
          face_verified: boolean | null
          first_name: string | null
          full_name: string
          gender: string | null
          id: string
          insurance_enrolled_at: string | null
          insurance_plan_id: string | null
          insurance_status: string | null
          keka_employee_id: string | null
          keka_employee_number: string | null
          keka_synced_at: string | null
          kyc_status: string | null
          last_name: string | null
          marital_status: string | null
          onboarding_documents_completed_at: string | null
          pan_number: string | null
          permanent_address_id: string | null
          personal_email: string | null
          phone_number: string | null
          plum_member_id: string | null
          springverify_candidate_id: string | null
          status: string | null
          uan_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          aadhaar_number?: string | null
          bgv_completed_at?: string | null
          bgv_status?: string | null
          blood_group?: string | null
          created_at?: string | null
          current_address_id?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          documents_signed?: boolean | null
          employee_code?: string | null
          esic_number?: string | null
          face_verified?: boolean | null
          first_name?: string | null
          full_name: string
          gender?: string | null
          id?: string
          insurance_enrolled_at?: string | null
          insurance_plan_id?: string | null
          insurance_status?: string | null
          keka_employee_id?: string | null
          keka_employee_number?: string | null
          keka_synced_at?: string | null
          kyc_status?: string | null
          last_name?: string | null
          marital_status?: string | null
          onboarding_documents_completed_at?: string | null
          pan_number?: string | null
          permanent_address_id?: string | null
          personal_email?: string | null
          phone_number?: string | null
          plum_member_id?: string | null
          springverify_candidate_id?: string | null
          status?: string | null
          uan_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          aadhaar_number?: string | null
          bgv_completed_at?: string | null
          bgv_status?: string | null
          blood_group?: string | null
          created_at?: string | null
          current_address_id?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          documents_signed?: boolean | null
          employee_code?: string | null
          esic_number?: string | null
          face_verified?: boolean | null
          first_name?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          insurance_enrolled_at?: string | null
          insurance_plan_id?: string | null
          insurance_status?: string | null
          keka_employee_id?: string | null
          keka_employee_number?: string | null
          keka_synced_at?: string | null
          kyc_status?: string | null
          last_name?: string | null
          marital_status?: string | null
          onboarding_documents_completed_at?: string | null
          pan_number?: string | null
          permanent_address_id?: string | null
          personal_email?: string | null
          phone_number?: string | null
          plum_member_id?: string | null
          springverify_candidate_id?: string | null
          status?: string | null
          uan_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_employee_current_address_id_fkey"
            columns: ["current_address_id"]
            isOneToOne: false
            referencedRelation: "commons_address"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_employee_permanent_address_id_fkey"
            columns: ["permanent_address_id"]
            isOneToOne: false
            referencedRelation: "commons_address"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_employee_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_employeecontract: {
        Row: {
          basic_salary: number
          company_id: string | null
          created_at: string | null
          ctc: number
          department: string | null
          designation: string
          employee_id: string | null
          employment_type: string | null
          end_date: string | null
          epf_employee: number | null
          epf_employer: number | null
          esic_employee: number | null
          esic_employer: number | null
          gratuity: number | null
          gross_salary: number
          health_insurance: number | null
          hra: number | null
          id: string
          is_active: boolean | null
          is_current: boolean | null
          joining_bonus: number | null
          lta: number | null
          medical_allowance: number | null
          notice_period_days: number | null
          performance_bonus: number | null
          probation_period_months: number | null
          professional_tax: number | null
          referral_bonus: number | null
          reporting_manager_id: string | null
          special_allowance: number | null
          start_date: string
          telephone_allowance: number | null
          updated_at: string | null
          variable_compensation: number | null
          work_location: string | null
        }
        Insert: {
          basic_salary: number
          company_id?: string | null
          created_at?: string | null
          ctc: number
          department?: string | null
          designation: string
          employee_id?: string | null
          employment_type?: string | null
          end_date?: string | null
          epf_employee?: number | null
          epf_employer?: number | null
          esic_employee?: number | null
          esic_employer?: number | null
          gratuity?: number | null
          gross_salary: number
          health_insurance?: number | null
          hra?: number | null
          id?: string
          is_active?: boolean | null
          is_current?: boolean | null
          joining_bonus?: number | null
          lta?: number | null
          medical_allowance?: number | null
          notice_period_days?: number | null
          performance_bonus?: number | null
          probation_period_months?: number | null
          professional_tax?: number | null
          referral_bonus?: number | null
          reporting_manager_id?: string | null
          special_allowance?: number | null
          start_date: string
          telephone_allowance?: number | null
          updated_at?: string | null
          variable_compensation?: number | null
          work_location?: string | null
        }
        Update: {
          basic_salary?: number
          company_id?: string | null
          created_at?: string | null
          ctc?: number
          department?: string | null
          designation?: string
          employee_id?: string | null
          employment_type?: string | null
          end_date?: string | null
          epf_employee?: number | null
          epf_employer?: number | null
          esic_employee?: number | null
          esic_employer?: number | null
          gratuity?: number | null
          gross_salary?: number
          health_insurance?: number | null
          hra?: number | null
          id?: string
          is_active?: boolean | null
          is_current?: boolean | null
          joining_bonus?: number | null
          lta?: number | null
          medical_allowance?: number | null
          notice_period_days?: number | null
          performance_bonus?: number | null
          probation_period_months?: number | null
          professional_tax?: number | null
          referral_bonus?: number | null
          reporting_manager_id?: string | null
          special_allowance?: number | null
          start_date?: string
          telephone_allowance?: number | null
          updated_at?: string | null
          variable_compensation?: number | null
          work_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_employeecontract_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_employeecontract_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_employeecontract_reporting_manager_id_fkey"
            columns: ["reporting_manager_id"]
            isOneToOne: false
            referencedRelation: "company_employer"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_familydetails: {
        Row: {
          created_at: string | null
          employee_id: string | null
          father_name: string | null
          id: string
          mother_name: string | null
          number_of_children: number | null
          spouse_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          father_name?: string | null
          id?: string
          mother_name?: string | null
          number_of_children?: number | null
          spouse_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          father_name?: string | null
          id?: string
          mother_name?: string | null
          number_of_children?: number | null
          spouse_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_familydetails_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_investmentdeclaration: {
        Row: {
          approved_at: string | null
          created_at: string | null
          employee_id: string | null
          financial_year: string
          hra_exemption: number | null
          hra_landlord_name: string | null
          hra_landlord_pan: string | null
          hra_received: number | null
          hra_rent_paid: number | null
          hra_rental_address: string | null
          id: string
          metro_city: boolean | null
          previous_employer_income: number | null
          previous_employer_tds: number | null
          property_interest: number | null
          property_municipal_tax: number | null
          property_rental_income: number | null
          rent_paid: number | null
          section_24b_home_loan_interest: number | null
          section_80c_elss: number | null
          section_80c_fd: number | null
          section_80c_home_loan_principal: number | null
          section_80c_lic: number | null
          section_80c_nsc: number | null
          section_80c_ppf: number | null
          section_80c_tuition_fees: number | null
          section_80c_ulip: number | null
          section_80ccd_nps: number | null
          section_80d_health_insurance: number | null
          section_80d_parents_insurance: number | null
          section_80d_preventive_checkup: number | null
          section_80e_education_loan: number | null
          section_80g_donations: number | null
          section_80tta_savings_interest: number | null
          status: string | null
          submitted_at: string | null
          tax_regime: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          financial_year: string
          hra_exemption?: number | null
          hra_landlord_name?: string | null
          hra_landlord_pan?: string | null
          hra_received?: number | null
          hra_rent_paid?: number | null
          hra_rental_address?: string | null
          id?: string
          metro_city?: boolean | null
          previous_employer_income?: number | null
          previous_employer_tds?: number | null
          property_interest?: number | null
          property_municipal_tax?: number | null
          property_rental_income?: number | null
          rent_paid?: number | null
          section_24b_home_loan_interest?: number | null
          section_80c_elss?: number | null
          section_80c_fd?: number | null
          section_80c_home_loan_principal?: number | null
          section_80c_lic?: number | null
          section_80c_nsc?: number | null
          section_80c_ppf?: number | null
          section_80c_tuition_fees?: number | null
          section_80c_ulip?: number | null
          section_80ccd_nps?: number | null
          section_80d_health_insurance?: number | null
          section_80d_parents_insurance?: number | null
          section_80d_preventive_checkup?: number | null
          section_80e_education_loan?: number | null
          section_80g_donations?: number | null
          section_80tta_savings_interest?: number | null
          status?: string | null
          submitted_at?: string | null
          tax_regime: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          financial_year?: string
          hra_exemption?: number | null
          hra_landlord_name?: string | null
          hra_landlord_pan?: string | null
          hra_received?: number | null
          hra_rent_paid?: number | null
          hra_rental_address?: string | null
          id?: string
          metro_city?: boolean | null
          previous_employer_income?: number | null
          previous_employer_tds?: number | null
          property_interest?: number | null
          property_municipal_tax?: number | null
          property_rental_income?: number | null
          rent_paid?: number | null
          section_24b_home_loan_interest?: number | null
          section_80c_elss?: number | null
          section_80c_fd?: number | null
          section_80c_home_loan_principal?: number | null
          section_80c_lic?: number | null
          section_80c_nsc?: number | null
          section_80c_ppf?: number | null
          section_80c_tuition_fees?: number | null
          section_80c_ulip?: number | null
          section_80ccd_nps?: number | null
          section_80d_health_insurance?: number | null
          section_80d_parents_insurance?: number | null
          section_80d_preventive_checkup?: number | null
          section_80e_education_loan?: number | null
          section_80g_donations?: number | null
          section_80tta_savings_interest?: number | null
          status?: string | null
          submitted_at?: string | null
          tax_regime?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_investmentdeclaration_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
        ]
      }
      employer_team: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          manager_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employer_team_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employer_team_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employer_team_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
        ]
      }
      employer_team_member: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          employee_id: string
          id: string
          reporting_manager_id: string | null
          role: string | null
          team_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          employee_id: string
          id?: string
          reporting_manager_id?: string | null
          role?: string | null
          team_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          employee_id?: string
          id?: string
          reporting_manager_id?: string | null
          role?: string | null
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employer_team_member_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employer_team_member_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employer_team_member_reporting_manager_id_fkey"
            columns: ["reporting_manager_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employer_team_member_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "employer_team"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_expenseclaim: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by_id: string | null
          client_name: string | null
          created_at: string | null
          description: string | null
          employee_id: string | null
          expense_category: string
          expense_date: string
          id: string
          merchant_name: string | null
          payment_mode: string | null
          project_name: string | null
          receipt_document_id: string | null
          reimbursement_date: string | null
          reimbursement_reference: string | null
          rejection_reason: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by_id?: string | null
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          expense_category: string
          expense_date: string
          id?: string
          merchant_name?: string | null
          payment_mode?: string | null
          project_name?: string | null
          receipt_document_id?: string | null
          reimbursement_date?: string | null
          reimbursement_reference?: string | null
          rejection_reason?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by_id?: string | null
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          expense_category?: string
          expense_date?: string
          id?: string
          merchant_name?: string | null
          payment_mode?: string | null
          project_name?: string | null
          receipt_document_id?: string | null
          reimbursement_date?: string | null
          reimbursement_reference?: string | null
          rejection_reason?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_expenseclaim_approved_by_id_fkey"
            columns: ["approved_by_id"]
            isOneToOne: false
            referencedRelation: "company_employer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_expenseclaim_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_expenseclaim_receipt_document_id_fkey"
            columns: ["receipt_document_id"]
            isOneToOne: false
            referencedRelation: "commons_document"
            referencedColumns: ["id"]
          },
        ]
      }
      holiday_holiday: {
        Row: {
          applicable_location: string | null
          company_id: string | null
          created_at: string | null
          date: string
          description: string | null
          holiday_type: string
          id: string
          is_mandatory: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          applicable_location?: string | null
          company_id?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          holiday_type: string
          id?: string
          is_mandatory?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          applicable_location?: string | null
          company_id?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          holiday_type?: string
          id?: string
          is_mandatory?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "holiday_holiday_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_leavebalance: {
        Row: {
          accrued: number | null
          carry_forward: number | null
          created_at: string | null
          employee_id: string | null
          financial_year: string
          id: string
          leave_type: string
          opening_balance: number | null
          pending: number | null
          taken: number | null
          updated_at: string | null
        }
        Insert: {
          accrued?: number | null
          carry_forward?: number | null
          created_at?: string | null
          employee_id?: string | null
          financial_year: string
          id?: string
          leave_type: string
          opening_balance?: number | null
          pending?: number | null
          taken?: number | null
          updated_at?: string | null
        }
        Update: {
          accrued?: number | null
          carry_forward?: number | null
          created_at?: string | null
          employee_id?: string | null
          financial_year?: string
          id?: string
          leave_type?: string
          opening_balance?: number | null
          pending?: number | null
          taken?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_leavebalance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_leaverequest: {
        Row: {
          approved_at: string | null
          approved_by_id: string | null
          created_at: string | null
          emergency_contact: string | null
          employee_id: string | null
          end_date: string
          id: string
          is_half_day: boolean | null
          keka_leave_request_id: string | null
          keka_synced_at: string | null
          leave_balance_id: string | null
          leave_type: string
          reason: string | null
          rejection_reason: string | null
          start_date: string
          status: string | null
          total_days: number
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by_id?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          employee_id?: string | null
          end_date: string
          id?: string
          is_half_day?: boolean | null
          keka_leave_request_id?: string | null
          keka_synced_at?: string | null
          leave_balance_id?: string | null
          leave_type: string
          reason?: string | null
          rejection_reason?: string | null
          start_date: string
          status?: string | null
          total_days: number
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by_id?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          employee_id?: string | null
          end_date?: string
          id?: string
          is_half_day?: boolean | null
          keka_leave_request_id?: string | null
          keka_synced_at?: string | null
          leave_balance_id?: string | null
          leave_type?: string
          reason?: string | null
          rejection_reason?: string | null
          start_date?: string
          status?: string | null
          total_days?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_leaverequest_approved_by_id_fkey"
            columns: ["approved_by_id"]
            isOneToOne: false
            referencedRelation: "company_employer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_leaverequest_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_employee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_leaverequest_leave_balance_id_fkey"
            columns: ["leave_balance_id"]
            isOneToOne: false
            referencedRelation: "leave_leavebalance"
            referencedColumns: ["id"]
          },
        ]
      }
      request_request: {
        Row: {
          approval_token: string | null
          assigned_to_id: string | null
          created_at: string | null
          id: string
          priority: string | null
          reference_id: string | null
          reference_type: string
          remarks: string | null
          request_type: string
          requester_id: string | null
          status: string | null
          token_expires_at: string | null
          updated_at: string | null
        }
        Insert: {
          approval_token?: string | null
          assigned_to_id?: string | null
          created_at?: string | null
          id?: string
          priority?: string | null
          reference_id?: string | null
          reference_type: string
          remarks?: string | null
          request_type: string
          requester_id?: string | null
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_token?: string | null
          assigned_to_id?: string | null
          created_at?: string | null
          id?: string
          priority?: string | null
          reference_id?: string | null
          reference_type?: string
          remarks?: string | null
          request_type?: string
          requester_id?: string | null
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_request_assigned_to_id_fkey"
            columns: ["assigned_to_id"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_request_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
        ]
      }
      superadmin_audit_log: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
          user_email: string
          user_id: string
          user_role: string
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_email: string
          user_id: string
          user_role: string
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_email?: string
          user_id?: string
          user_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "superadmin_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
        ]
      }
      superadmin_permission: {
        Row: {
          category: string | null
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      superadmin_report_template: {
        Row: {
          columns: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          filters: Json | null
          id: string
          is_shared: boolean | null
          name: string
          report_type: string
          schedule: string | null
          updated_at: string | null
        }
        Insert: {
          columns: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          filters?: Json | null
          id?: string
          is_shared?: boolean | null
          name: string
          report_type: string
          schedule?: string | null
          updated_at?: string | null
        }
        Update: {
          columns?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          filters?: Json | null
          id?: string
          is_shared?: boolean | null
          name?: string
          report_type?: string
          schedule?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "superadmin_report_template_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
        ]
      }
      superadmin_role_permission: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "superadmin_role_permission_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "superadmin_permission"
            referencedColumns: ["id"]
          },
        ]
      }
      superadmin_service: {
        Row: {
          category: string | null
          configuration: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      superadmin_service_enrollment: {
        Row: {
          company_id: string
          configuration: Json | null
          enrolled_at: string | null
          id: string
          service_id: string
          status: string | null
        }
        Insert: {
          company_id: string
          configuration?: Json | null
          enrolled_at?: string | null
          id?: string
          service_id: string
          status?: string | null
        }
        Update: {
          company_id?: string
          configuration?: Json | null
          enrolled_at?: string | null
          id?: string
          service_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "superadmin_service_enrollment_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "superadmin_service_enrollment_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "superadmin_service"
            referencedColumns: ["id"]
          },
        ]
      }
      superadmin_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "superadmin_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
        ]
      }
      superadmin_team: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "superadmin_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
        ]
      }
      superadmin_team_client: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          team_member_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          team_member_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          team_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "superadmin_team_client_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "superadmin_team_client_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "superadmin_team"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preference: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          language: string | null
          notification_preferences: Json | null
          theme: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          language?: string | null
          notification_preferences?: Json | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          language?: string | null
          notification_preferences?: Json | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preference_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
        ]
      }
      users_emailverification: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          is_used: boolean | null
          otp: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          is_used?: boolean | null
          otp: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          is_used?: boolean | null
          otp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_emailverification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
        ]
      }
      users_passwordhistory: {
        Row: {
          created_at: string | null
          id: string
          password_hash: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          password_hash: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          password_hash?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_passwordhistory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_user"
            referencedColumns: ["id"]
          },
        ]
      }
      users_user: {
        Row: {
          created_at: string | null
          email: string
          email_verified_at: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          is_email_verified: boolean | null
          last_login: string | null
          last_name: string | null
          password: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          created_at?: string | null
          email: string
          email_verified_at?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_email_verified?: boolean | null
          last_login?: string | null
          last_name?: string | null
          password?: string | null
          updated_at?: string | null
          user_type: string
        }
        Update: {
          created_at?: string | null
          email?: string
          email_verified_at?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_email_verified?: boolean | null
          last_login?: string | null
          last_name?: string | null
          password?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_team_clients: {
        Args: { p_client_ids: string[]; p_team_member_id: string }
        Returns: undefined
      }
      auth_user_id: { Args: never; Returns: string }
      get_user_company_id: { Args: never; Returns: string }
      get_user_contractor_id: { Args: never; Returns: string }
      get_user_employee_id: { Args: never; Returns: string }
      is_employer_for_company: {
        Args: { company_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
