import { describe, expect, it } from 'vitest'
import { screenIngredients } from './ingredientScreening'
import { demoRules } from '../data/demoData'

describe('screenIngredients', () => {
  it('flags prohibited ingredients', () => {
    const result = screenIngredients(['corn', 'rhodamine b'], demoRules, 'Snack')
    expect(result.status).toBe('Flagged')
    expect(result.flags[0].ruleType).toBe('Prohibited')
  })

  it('returns clear when no rules match', () => {
    const result = screenIngredients(['oats', 'honey'], demoRules, 'Breakfast Cereal')
    expect(result.status).toBe('Clear')
  })
})
