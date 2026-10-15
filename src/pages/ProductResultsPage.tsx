import { useLocation } from 'react-router-dom'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useNutrixon } from '../context/NutrixonContext'
import { calculateNutritionScore } from '../lib/nutritionScore'
import { deriveLaboratoryEvidenceLabel } from '../lib/verificationStatus'

export function ProductResultsPage() {
  const location = useLocation()
  const id = (location.state as { id?: string } | undefined)?.id
  const { products, latestProduct } = useNutrixon()
  const product = products.find((item) => item.id === id) ?? latestProduct

  if (!product) return <Card>No product result available yet.</Card>

  const score = calculateNutritionScore(product.nutrition, product.category, product.isBeverage)
  const evidenceLabel = deriveLaboratoryEvidenceLabel(product)

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold text-[#10233F]">Product Results</h1>
        <p className="text-sm text-slate-600">Data source: {product.dataSource} · Completeness: {product.completeness}</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold text-[#10233F]">{product.name}</h2>
          <p className="text-sm text-slate-600">{product.brand} · {product.category}</p>
          <p className="mt-2 text-sm text-slate-700">Ingredients: {product.ingredients.join(', ')}</p>
          <p className="text-sm text-slate-700">Allergens: {product.allergens.join(', ') || 'Not declared'}</p>
          <p className="text-sm text-slate-700">Last updated: {product.lastUpdated}</p>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-[#10233F]">Nutrition Quality Score</h2>
          {score.score === null ? (
            <Badge tone="warning">Insufficient Data</Badge>
          ) : (
            <>
              <div className="mt-2 h-3 w-full rounded-full bg-slate-200">
                <div className="h-3 rounded-full bg-[#13B8A6]" style={{ width: `${score.score}%` }} />
              </div>
              <p className="mt-2 text-2xl font-bold text-[#10233F]">{score.score}/100</p>
              <p className="text-sm text-slate-600">{score.grade}</p>
            </>
          )}
          <p className="mt-3 text-xs text-slate-500">{score.disclaimer}</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-bold text-[#10233F]">Ingredient Screening Status</h3>
          <Badge tone={product.ingredientScreeningStatus === 'Flagged' ? 'danger' : product.ingredientScreeningStatus === 'Needs Expert Review' ? 'warning' : 'success'}>
            {product.ingredientScreeningStatus}
          </Badge>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
            {product.ingredientFlags.length ? product.ingredientFlags.map((flag) => <li key={flag}>{flag}</li>) : <li>No demo rule flags found.</li>}
          </ul>
        </Card>
        <Card>
          <h3 className="font-bold text-[#10233F]">Laboratory Evidence Status</h3>
          <Badge tone={evidenceLabel.includes('Failed') ? 'danger' : evidenceLabel.includes('Pending') || evidenceLabel.includes('Insufficient') ? 'warning' : 'success'}>
            {evidenceLabel}
          </Badge>
          <p className="mt-3 text-sm text-slate-700">Internal review: {product.internalReviewStatus}</p>
          <p className="text-xs text-slate-500 mt-2">High nutrition score does not override failed or missing safety checks.</p>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-[#10233F]">What this means</h3>
        <p className="text-sm text-slate-700">
          Nutrixon separates nutrition quality, ingredient screening, laboratory evidence, and internal review. Results are decision-support
          outputs from submitted and demo data, not official regulatory approvals.
        </p>
      </Card>
    </div>
  )
}
