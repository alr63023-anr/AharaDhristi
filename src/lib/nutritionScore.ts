import type { NutritionFacts } from '../types'

interface Factor {
  label: string
  impact: number
  reason: string
}

export interface NutritionScoreResult {
  score: number | null
  grade: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Insufficient Data'
  factors: Factor[]
  suggestions: string[]
  disclaimer: string
}

const required: (keyof NutritionFacts)[] = ['energyKcal', 'sugarG', 'saturatedFatG', 'sodiumMg', 'fibreG', 'proteinG']

export function calculateNutritionScore(nutrition: NutritionFacts, category: string, isBeverage: boolean): NutritionScoreResult {
  const missing = required.some((field) => nutrition[field] === undefined)
  if (missing) {
    return {
      score: null,
      grade: 'Insufficient Data',
      factors: [],
      suggestions: ['Provide complete per-100g/per-100ml nutrition facts to compute a prototype score.'],
      disclaimer:
        'Prototype score unavailable due to missing essential nutrition data. This system does not invent missing values.',
    }
  }

  const factors: Factor[] = []
  let score = 100
  const sugarLimit = isBeverage ? 5 : 10
  const sodiumLimit = isBeverage ? 200 : 400
  const energyLimit = isBeverage ? 60 : 300

  const penalize = (value: number, limit: number, label: string, reason: string, weight: number) => {
    if (value > limit) {
      const impact = Math.min(30, ((value - limit) / limit) * weight)
      score -= impact
      factors.push({ label, impact: -impact, reason })
    }
  }

  penalize(nutrition.sugarG!, sugarLimit, 'Sugar', `High sugar for ${isBeverage ? 'beverage' : 'solid'} threshold`, 28)
  penalize(nutrition.saturatedFatG!, 5, 'Saturated Fat', 'Elevated saturated fat content', 20)
  penalize(nutrition.sodiumMg!, sodiumLimit, 'Sodium', 'High sodium concentration', 22)
  penalize(nutrition.energyKcal!, energyLimit, 'Energy', 'High energy density', 18)

  if (nutrition.fibreG! >= 3) {
    score += 8
    factors.push({ label: 'Fibre', impact: 8, reason: 'Helpful fibre level' })
  }
  if (nutrition.proteinG! >= 5) {
    score += 6
    factors.push({ label: 'Protein', impact: 6, reason: 'Meaningful protein contribution' })
  }

  if (category.toLowerCase().includes('snack')) {
    score -= 3
    factors.push({ label: 'Category Adjustment', impact: -3, reason: 'Snack category receives conservative adjustment' })
  }

  score = Math.max(1, Math.min(100, Math.round(score)))

  const grade = score >= 80 ? 'Excellent' : score >= 65 ? 'Good' : score >= 45 ? 'Moderate' : 'Poor'

  return {
    score,
    grade,
    factors,
    suggestions: [
      'Reduce added sugar and sodium where feasible.',
      'Increase fibre-rich ingredients to improve score stability.',
      'Remember: nutrition score never overrides failed or missing safety evidence.',
    ],
    disclaimer:
      'This Nutrition Quality Score is an illustrative prototype for demo use and is not a medical, scientific, or regulatory certification.',
  }
}
