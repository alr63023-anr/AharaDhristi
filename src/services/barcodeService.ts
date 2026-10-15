export interface BarcodeLookupResult {
  productName: string
  brand: string
  category: string
  ingredients: string[]
}

export async function lookupBarcode(barcode: string): Promise<BarcodeLookupResult | null> {
  const endpoint = import.meta.env.VITE_OPEN_FOOD_FACTS_ENDPOINT

  if (!endpoint) {
    return null
  }

  const response = await fetch(`${endpoint.replace(/\/$/, '')}/${barcode}.json`)
  if (!response.ok) return null

  const data = await response.json()
  const product = data?.product
  if (!product) return null

  return {
    productName: product.product_name ?? 'Unknown Product',
    brand: product.brands ?? 'Unknown Brand',
    category: product.categories_tags?.[0] ?? 'Unknown Category',
    ingredients: Array.isArray(product.ingredients_tags) ? product.ingredients_tags : [],
  }
}
