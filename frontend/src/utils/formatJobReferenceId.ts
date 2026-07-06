import type { Applicant } from '../types/applicant.types'

const REF_PREFIX = 'REF'

function formatNumericJobId(id: number): string {
  return `${REF_PREFIX}${String(id).padStart(3, '0')}`
}

function isBlank(value?: string | null): boolean {
  return value == null || String(value).trim() === ''
}

/** Format a numeric or string job ID for display. */
export function formatJobReferenceId(value?: string | number | null): string {
  if (value == null || value === '') return 'N/A'

  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value <= 0) return 'N/A'
    return formatNumericJobId(value)
  }

  const trimmed = String(value).trim()
  if (!trimmed) return 'N/A'

  if (/^\d+$/.test(trimmed)) {
    const num = Number(trimmed)
    if (num <= 0) return 'N/A'
    return formatNumericJobId(num)
  }

  return trimmed
}

/** Resolve Job ID from applicant fields (list, detail, edit, export). */
export function getApplicantJobId(
  applicant: Pick<Applicant, 'job_reference' | 'apply_id' | 'career_id' | 'career'>,
): string {
  if (!isBlank(applicant.job_reference)) {
    return applicant.job_reference!.trim()
  }

  if (!isBlank(applicant.career?.job_reference)) {
    return applicant.career!.job_reference!.trim()
  }

  if (!isBlank(applicant.career?.job_code)) {
    return applicant.career!.job_code!.trim()
  }

  const numericId = applicant.apply_id ?? applicant.career_id
  if (numericId != null && Number.isFinite(numericId) && numericId > 0) {
    return formatNumericJobId(numericId)
  }

  return 'N/A'
}
