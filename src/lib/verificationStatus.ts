import type { LabEvidenceLabel, Product } from '../types'

export function deriveLaboratoryEvidenceLabel(product: Pick<Product, 'labTests' | 'laboratoryEvidenceStatus'>): LabEvidenceLabel {
  const tests = product.labTests
  if (!tests.length) return 'Insufficient Evidence'

  const hasFail = tests.some((test) => test.status === 'Fail')
  if (hasFail) return 'Failed Test — Potential Non-Compliance'

  const hasPending = tests.some((test) => test.status === 'Pending')
  if (hasPending) return 'Pending Laboratory Results'

  const hasInconclusive = tests.some((test) => test.status === 'Inconclusive')
  if (hasInconclusive) return 'Needs Further Review'

  const allPass = tests.every((test) => test.status === 'Pass')
  if (allPass) return 'All Required Checks Passed — Evidence Verified'

  return product.laboratoryEvidenceStatus
}

export function canShowVerified(status: LabEvidenceLabel): boolean {
  return status === 'All Required Checks Passed — Evidence Verified'
}
