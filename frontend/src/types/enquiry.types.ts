export type ServiceType = 'consulting' | 'engineering' | 'construction' | 'maintenance' | 'other'
export type EnquiryStatus = 'new' | 'start_working' | 'on_hold' | 'spam' | 'closed'

export interface Enquiry {
  id: number
  name?: string
  mobile?: string
  phone?: string
  email?: string
  subject?: string
  message?: string
  description?: string
  assigned_to?: string | { id: number | string | { id: number | string; first_name: string; last_name: string }; first_name: string; last_name: string }
  status?: string
  service_type?: ServiceType
  company_name?: string
  full_name?: string
  hold_reason?: string
  closing_remarks?: string
  created_at?: string
  last_updated?: string
  enquiry_date?: string
  updated_at?: string
}

export interface EnquiryFormData {
  name?: string
  email?: string
  mobile?: string
  subject?: string
  message?: string
  assigned_to?: string | { id: number | string; first_name: string; last_name: string }
  status?: EnquiryStatus
}

export interface EnquiryFilters {
  status?: EnquiryStatus
  service_type?: ServiceType
  assigned_to?: number | string
  search?: string
  start_date?: string
  end_date?: string
}
