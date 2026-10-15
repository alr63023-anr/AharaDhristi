import { describe, expect, it } from 'vitest'
import { deriveLaboratoryEvidenceLabel } from './verificationStatus'

describe('deriveLaboratoryEvidenceLabel', () => {
  it('returns failed when any test fails', () => {
    const result = deriveLaboratoryEvidenceLabel({
      laboratoryEvidenceStatus: 'Needs Further Review',
      labTests: [{ name: 'Lead', result: 0.2, unit: 'mg/kg', threshold: '<=0.1', status: 'Fail' }],
    })
    expect(result).toBe('Failed Test — Potential Non-Compliance')
  })

  it('returns verified only when all tests pass', () => {
    const result = deriveLaboratoryEvidenceLabel({
      laboratoryEvidenceStatus: 'Needs Further Review',
      labTests: [{ name: 'Lead', result: 0.04, unit: 'mg/kg', threshold: '<=0.1', status: 'Pass' }],
    })
    expect(result).toBe('All Required Checks Passed — Evidence Verified')
  })
})
