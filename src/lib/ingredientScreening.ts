import type { ScreeningRule } from '../types'

export interface IngredientFlag {
  ingredient: string
  certainty: 'Confirmed' | 'Uncertain'
  ruleType: ScreeningRule['ruleType']
  reference: string
  message: string
}

export function screenIngredients(ingredients: string[], rules: ScreeningRule[], category: string) {
  const normalized = ingredients.map((item) => item.trim().toLowerCase())
  const flags: IngredientFlag[] = []

  for (const rule of rules) {
    if (rule.category && rule.category.toLowerCase() !== category.toLowerCase()) continue

    const matchedIngredient = normalized.find((ingredient) =>
      rule.matchType === 'exact' ? ingredient === rule.ingredient.toLowerCase() : ingredient.includes(rule.ingredient.toLowerCase()),
    )

    if (matchedIngredient) {
      flags.push({
        ingredient: matchedIngredient,
        certainty: rule.matchType === 'exact' ? 'Confirmed' : 'Uncertain',
        ruleType: rule.ruleType,
        reference: rule.reference,
        message: `${rule.ruleType}: ${rule.note}`,
      })
    }
  }

  return {
    flags,
    status: flags.some((flag) => flag.ruleType === 'Prohibited' || flag.ruleType === 'Restricted')
      ? 'Flagged'
      : flags.length
        ? 'Needs Expert Review'
        : 'Clear',
  } as const
}
