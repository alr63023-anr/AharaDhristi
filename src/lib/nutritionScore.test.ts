import { describe, expect, it } from 'vitest'
import { calculateNutritionScore } from './nutritionScore'

describe('calculateNutritionScore', () => {
  it('returns insufficient data when required values are missing', () => {
    const result = calculateNutritionScore({ basis: 'per_100g', energyKcal: 200 }, 'Snack', false)
    expect(result.score).toBeNull()
    expect(result.grade).toBe('Insufficient Data')
  })

  it('returns a bounded score with grade', () => {
    const result = calculateNutritionScore(
      { basis: 'per_100g', energyKcal: 280, sugarG: 7, saturatedFatG: 2, sodiumMg: 120, fibreG: 5, proteinG: 7 },
      'Breakfast Cereal',
      false,
    )
    expect(result.score).toBeGreaterThan(0)
    expect(result.score).toBeLessThanOrEqual(100)
    expect(result.grade).toBe('Excellent')
  })
})
