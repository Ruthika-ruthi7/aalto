export type ApplicantStatus = 'new' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'interview_completed' | 'selected' | 'offered' | 'joined' | 'rejected' | 'on_hold'

export interface Applicant {
  id: number
  name?: string
  applicant_name?: string
  email?: string
  phone?: string
  mobile?: string
  address?: string
  current_location?: string
  resume?: string | File
  resume_path?: string | File
  position?: string
  additional_info?: string
  apply_id?: number
  career_id?: number
  status?: ApplicantStatus
  applied_at?: string
  applied_date?: string
  created_at?: string
  updated_at?: string
  experience?: string
  current_company?: string
  current_ctc?: number
  expected_ctc?: number
  notice_period?: string
  rejection_reason?: string
  hold_reason?: string
  interview_date?: string
  interview_feedback?: string
  career?: { id: number; job_title: string; job_code: string }
}

export interface ApplicantFormData {
  career_id?: number
  applicant_name?: string
  name?: string
  mobile?: string
  phone?: string
  email?: string
  current_location?: string
  experience?: string
  current_company?: string
  current_ctc?: number
  expected_ctc?: number
  notice_period?: string
  resume_path?: File | string
  resume?: File | string
  status?: ApplicantStatus
  rejection_reason?: string
  hold_reason?: string
  interview_date?: string
  interview_feedback?: string
}

export interface ApplicantFilters {
  career_id?: number
  status?: ApplicantStatus
  search?: string
}
