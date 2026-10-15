export type UserRole = 'consumer' | 'company' | 'reviewer' | 'admin'

export type SubmissionStatus =
  | 'Draft'
  | 'Submission Incomplete'
  | 'Submitted for Review'
  | 'Evidence Under Review'
  | 'Additional Documents Required'
  | 'Additional Testing Required'
  | 'Potential Non-Compliance'
  | 'Review Completed — Requirements Met'
  | 'Review Completed — Requirements Not Met'

export type LabEvidenceLabel =
  | 'All Required Checks Passed — Evidence Verified'
  | 'Failed Test — Potential Non-Compliance'
  | 'Pending Laboratory Results'
  | 'Needs Further Review'
  | 'Insufficient Evidence'

export interface NutritionFacts {
  energyKcal?: number
  sugarG?: number
  saturatedFatG?: number
  sodiumMg?: number
  fibreG?: number
  proteinG?: number
  basis: 'per_100g' | 'per_100ml'
}

export interface LabTestResult {
  name: string
  result: number | null
  unit: string
  threshold: string
  status: 'Pass' | 'Fail' | 'Inconclusive' | 'Pending'
}

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  isBeverage: boolean
  ingredients: string[]
  allergens: string[]
  nutrition: NutritionFacts
  ingredientScreeningStatus: 'Clear' | 'Flagged' | 'Needs Expert Review'
  ingredientFlags: string[]
  laboratoryEvidenceStatus: LabEvidenceLabel
  internalReviewStatus: SubmissionStatus
  lastUpdated: string
  dataSource: 'Company Submitted' | 'Demo Sample' | 'Manual Entry'
  completeness: 'Complete' | 'Partial' | 'Insufficient'
  labTests: LabTestResult[]
}

export interface ScreeningRule {
  id: string
  ingredient: string
  matchType: 'exact' | 'contains'
  category?: string
  jurisdiction: string
  ruleType: 'Prohibited' | 'Restricted' | 'Category Limited' | 'Review Required'
  reference: string
  effectiveDate: string
  note: string
}

export interface SubmissionRecord {
  id: string
  productId: string
  companyName: string
  status: SubmissionStatus
  intendedLaunchDate: string
  missingFields: string[]
  updatedAt: string
  reviewerFeedback?: string
  files: { name: string; type: string; sizeMb: number }[]
}
