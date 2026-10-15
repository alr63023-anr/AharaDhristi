import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../components/ui/alert'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { lookupBarcode } from '../services/barcodeService'
import { extractLabelData } from '../services/aiServices'
import { calculateNutritionScore } from '../lib/nutritionScore'
import { screenIngredients } from '../lib/ingredientScreening'
import { demoRules } from '../data/demoData'
import type { Product } from '../types'
import { useNutrixon } from '../context/NutrixonContext'

const formSchema = z.object({
  productName: z.string().min(2),
  brand: z.string().min(2),
  category: z.string().min(2),
  ingredients: z.string().min(2),
  allergens: z.string().optional(),
  barcode: z.string().optional(),
  basis: z.enum(['per_100g', 'per_100ml']),
  energyKcal: z.preprocess((value) => (value === '' ? undefined : Number(value)), z.number().optional()),
  sugarG: z.preprocess((value) => (value === '' ? undefined : Number(value)), z.number().optional()),
  saturatedFatG: z.preprocess((value) => (value === '' ? undefined : Number(value)), z.number().optional()),
  sodiumMg: z.preprocess((value) => (value === '' ? undefined : Number(value)), z.number().optional()),
  fibreG: z.preprocess((value) => (value === '' ? undefined : Number(value)), z.number().optional()),
  proteinG: z.preprocess((value) => (value === '' ? undefined : Number(value)), z.number().optional()),
})

type FormValues = z.output<typeof formSchema>
type FormInputValues = z.input<typeof formSchema>
const MAX_FILE_MB = 5

export function ScannerPage() {
  const navigate = useNavigate()
  const { addScannedProduct } = useNutrixon()
  const [labelImage, setLabelImage] = useState<string | null>(null)
  const [packageImage, setPackageImage] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('Scanner runs in demo mode unless external OCR/barcode services are configured.')

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputValues, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { basis: 'per_100g' },
  })

  const loadImage = (file: File | undefined, setState: (value: string | null) => void) => {
    if (!file) return
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setMessage('Only PNG/JPG files are supported for scanner images.')
      return
    }
    if (file.size / 1024 / 1024 > MAX_FILE_MB) {
      setMessage(`Image exceeds ${MAX_FILE_MB}MB limit.`)
      return
    }
    setState(URL.createObjectURL(file))
  }

  const handleBarcodeLookup = async (barcode?: string) => {
    if (!barcode) return
    const data = await lookupBarcode(barcode)
    if (data) {
      setValue('productName', data.productName)
      setValue('brand', data.brand)
      setValue('category', data.category)
      setValue('ingredients', data.ingredients.join(', '))
      setMessage('Barcode lookup completed from configured endpoint.')
    } else {
      setMessage('Barcode service not configured or no result found. Please continue with manual entry.')
    }
  }

  const onExtract = async () => {
    const result = await extractLabelData()
    if (result.data.productName) setValue('productName', result.data.productName)
    if (result.data.brand) setValue('brand', result.data.brand)
    if (result.data.ingredients) setValue('ingredients', result.data.ingredients)
    setMessage(
      result.mode === 'demo'
        ? 'Demo extraction loaded. Please review and edit values before submission.'
        : 'Configured extraction endpoint reached. Confirm extracted values.',
    )
  }

  const onSubmit = handleSubmit((values) => {
    const ingredients = values.ingredients.split(',').map((item: string) => item.trim())
    const screen = screenIngredients(ingredients, demoRules, values.category)
    const product: Product = {
      id: crypto.randomUUID(),
      name: values.productName,
      brand: values.brand,
      category: values.category,
      isBeverage: values.basis === 'per_100ml',
      ingredients,
      allergens: values.allergens?.split(',').map((a: string) => a.trim()).filter(Boolean) ?? [],
      nutrition: {
        basis: values.basis,
        energyKcal: values.energyKcal,
        sugarG: values.sugarG,
        saturatedFatG: values.saturatedFatG,
        sodiumMg: values.sodiumMg,
        fibreG: values.fibreG,
        proteinG: values.proteinG,
      },
      ingredientScreeningStatus: screen.status,
      ingredientFlags: screen.flags.map((flag) => `${flag.message} (${flag.reference})`),
      laboratoryEvidenceStatus: 'Insufficient Evidence',
      internalReviewStatus: 'Submission Incomplete',
      lastUpdated: new Date().toISOString().slice(0, 10),
      dataSource: 'Manual Entry',
      completeness: 'Partial',
      labTests: [],
    }

    const score = calculateNutritionScore(product.nutrition, product.category, product.isBeverage)
    if (score.score === null) {
      setMessage('Product saved with Insufficient Data score. Add complete nutrition facts for score calculation.')
    }

    addScannedProduct(product)
    navigate('/results', { state: { id: product.id } })
  })

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold text-[#10233F]">Consumer Product Scanner</h1>
        <p className="text-sm text-slate-600">Upload package and nutrition label images, use camera capture, or enter details manually.</p>
        <div className="mt-3">
          <Alert title="Demo mode" message={message} />
        </div>
      </Card>

      <form className="space-y-4" onSubmit={onSubmit}>
        <Card className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Package image (PNG/JPG, max 5MB)
            <input type="file" accept="image/png,image/jpeg" className="mt-1 block w-full" onChange={(e) => loadImage(e.target.files?.[0], setPackageImage)} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Nutrition label image (PNG/JPG, max 5MB)
            <input type="file" accept="image/png,image/jpeg" className="mt-1 block w-full" onChange={(e) => loadImage(e.target.files?.[0], setLabelImage)} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Capture photo (mobile camera supported)
            <input type="file" accept="image/*" capture="environment" className="mt-1 block w-full" onChange={(e) => loadImage(e.target.files?.[0], setLabelImage)} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            {packageImage && <img src={packageImage} alt="Package preview" className="h-28 w-full rounded-lg object-cover" />}
            {labelImage && <img src={labelImage} alt="Nutrition preview" className="h-28 w-full rounded-lg object-cover" />}
            {(packageImage || labelImage) && (
              <Button type="button" variant="secondary" onClick={() => { setPackageImage(null); setLabelImage(null) }}>
                Remove uploaded images
              </Button>
            )}
          </div>
        </Card>

        <Card className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium">Barcode
            <input className="mt-1 w-full rounded-lg border p-2" {...register('barcode')} onBlur={(e) => handleBarcodeLookup(e.target.value)} />
          </label>
          <label className="text-sm font-medium">Product Name<input className="mt-1 w-full rounded-lg border p-2" {...register('productName')} /></label>
          <label className="text-sm font-medium">Brand<input className="mt-1 w-full rounded-lg border p-2" {...register('brand')} /></label>
          <label className="text-sm font-medium">Category<input className="mt-1 w-full rounded-lg border p-2" {...register('category')} /></label>
          <label className="text-sm font-medium md:col-span-2">Ingredients (comma separated)<input className="mt-1 w-full rounded-lg border p-2" {...register('ingredients')} /></label>
          <label className="text-sm font-medium md:col-span-2">Allergens (comma separated)<input className="mt-1 w-full rounded-lg border p-2" {...register('allergens')} /></label>
          <label className="text-sm font-medium">Basis
            <select className="mt-1 w-full rounded-lg border p-2" {...register('basis')}>
              <option value="per_100g">Per 100 g</option>
              <option value="per_100ml">Per 100 ml</option>
            </select>
          </label>
          <div className="md:col-span-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {['energyKcal', 'sugarG', 'saturatedFatG', 'sodiumMg', 'fibreG', 'proteinG'].map((field) => (
              <label key={field} className="text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}
                <input type="number" step="0.1" className="mt-1 w-full rounded-lg border p-2" {...register(field as keyof FormValues)} />
              </label>
            ))}
          </div>
          {Object.values(errors).length > 0 && <p className="text-sm text-red-600">Please complete required fields before viewing results.</p>}
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={onExtract}>Run label extraction (demo-aware)</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'View Product Results'}</Button>
        </div>
      </form>
    </div>
  )
}
