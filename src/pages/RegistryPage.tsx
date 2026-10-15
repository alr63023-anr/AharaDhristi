import { useMemo, useState } from 'react'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useNutrixon } from '../context/NutrixonContext'
import { calculateNutritionScore } from '../lib/nutritionScore'
import { deriveLaboratoryEvidenceLabel } from '../lib/verificationStatus'

export function RegistryPage() {
  const [search, setSearch] = useState('')
  const { products } = useNutrixon()

  const visible = useMemo(
    () => products.filter((product) => `${product.name} ${product.brand}`.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  )

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-[#10233F]">Product Verification Registry</h1>
        <p className="text-sm text-slate-600">Public view shows only approved-for-disclosure fields.</p>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product or brand" className="mt-3 w-full rounded-lg border p-2 text-sm" />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((product) => {
          const score = calculateNutritionScore(product.nutrition, product.category, product.isBeverage)
          const evidence = deriveLaboratoryEvidenceLabel(product)
          return (
            <Card key={product.id}>
              <h2 className="text-lg font-bold text-[#10233F]">{product.name}</h2>
              <p className="text-sm text-slate-600">{product.brand} · {product.category}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone={score.score === null ? 'warning' : 'success'}>
                  Nutrition: {score.score === null ? 'Insufficient Data' : `${score.score}/100`}
                </Badge>
                <Badge tone={product.ingredientScreeningStatus === 'Flagged' ? 'danger' : product.ingredientScreeningStatus === 'Needs Expert Review' ? 'warning' : 'success'}>
                  Ingredient: {product.ingredientScreeningStatus}
                </Badge>
                <Badge tone={evidence.includes('Failed') ? 'danger' : evidence.includes('Pending') || evidence.includes('Insufficient') ? 'warning' : 'success'}>
                  Lab: {evidence}
                </Badge>
                <Badge tone={product.internalReviewStatus.includes('Not Met') ? 'danger' : 'neutral'}>Internal Review: {product.internalReviewStatus}</Badge>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Evidence limitations and completeness: {product.completeness}. Public registry excludes confidential formulation details and private documents.
              </p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
