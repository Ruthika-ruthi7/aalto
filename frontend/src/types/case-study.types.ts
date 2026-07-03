export type ServiceType = 'consulting' | 'engineering' | 'construction' | 'maintenance' | 'automation' | 'lifts_elevators' | 'material_handling' | 'warehouse_solutions' | 'other'
export type Industry = 'manufacturing' | 'construction' | 'pharmaceutical' | 'logistics' | 'automotive' | 'aerospace' | 'food_beverage' | 'textile' | 'chemical' | 'energy' | 'Real Estate' | 'Manufacturing' | 'other'
export type CaseStudyStatus = 'draft' | 'published' | 'unpublished'

export interface CaseStudy {
  id: number
  title?: string
  case_study_title?: string
  slug?: string
  client_name?: string
  service_type?: ServiceType
  industry?: Industry
  featured_image?: string
  short_description?: string
  challenge?: string
  solution?: string
  results?: string
  impact?: string
  technologies_used?: string
  project_duration?: string
  status?: CaseStudyStatus
  website_id?: number
  created_at?: string
  updated_at?: string
  created_by?: number
  updated_by?: number
}

export interface CaseStudyFormData {
  title: string
  client_name: string
  service_type: ServiceType
  industry: Industry
  featured_image?: File | string
  short_description: string
  challenge: string
  solution: string
  results: string
  technologies_used?: string
  project_duration?: string
  status: CaseStudyStatus
}

export interface CaseStudyFilters {
  status?: CaseStudyStatus
  service_type?: ServiceType
  industry?: Industry
  search?: string
}
