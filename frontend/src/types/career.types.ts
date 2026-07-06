export type EmploymentType = string
export type WorkMode = string
export type CareerStatus = 'ACTIVE' | 'CLOSED' | 'draft' | 'open' | 'closed' | 'archived' | 'expired' | 'on_hold'

export const CAREER_STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  open: 'bg-green-100 text-green-800',
  published: 'bg-green-100 text-green-800',
  draft: 'bg-orange-100 text-orange-800',
  on_hold: 'bg-orange-100 text-orange-800',
  closed: 'bg-red-100 text-red-800',
  archived: 'bg-gray-100 text-gray-800',
  expired: 'bg-gray-100 text-gray-800',
}

export const CAREER_STATUS_LABELS: Record<string, string> = {
  active: 'Published',
  open: 'Published',
  published: 'Published',
  draft: 'Draft',
  on_hold: 'Draft',
  closed: 'Closed',
  archived: 'Archived',
  expired: 'Archived',
}

export interface Career {
  id: number
  job_code?: string
  job_title?: string
  Bu_id?: number
  jobDescription?: string
  Experience?: string
  Locations?: string
  location?: string
  Responsibilities?: string
  Roles?: string
  IndustryType?: string
  industry_type?: string
  Department?: string
  department?: string
  EmploymentType?: string
  employment_type?: string
  RoleCategory?: string
  role_category?: string
  Education?: string
  KeySkills?: string
  key_skills?: string
  job_titles?: string
  number_of_openings?: number
  experience_required?: string
  education_qualification?: string
  description?: string
  roles_and_responsibilities?: string
  benefits?: string
  application_deadline?: string
  posted_date?: string
  created_at?: string
  job_status?: CareerStatus
  status?: CareerStatus | string
  work_mode?: string
  updated_at?: string
  updated_date?: string
}

export interface CareerFormData {
  job_code?: string
  job_title?: string
  department?: string
  role_category?: string
  industry_type?: string
  employment_type?: EmploymentType
  work_mode?: WorkMode
  location?: string
  number_of_openings?: number
  experience_required?: string
  education_qualification?: string
  key_skills?: string
  description?: string
  roles_and_responsibilities?: string
  benefits?: string
  application_deadline?: string
  status?: CareerStatus
}

export interface CareerFilters {
  status?: CareerStatus
  department?: string
  employment_type?: EmploymentType
  work_mode?: WorkMode
  location?: string
  search?: string
}
