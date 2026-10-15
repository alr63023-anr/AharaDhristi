export interface ExtractionResult {
  productName?: string
  brand?: string
  ingredients?: string
}

export async function extractLabelData(): Promise<{ mode: 'demo' | 'configured'; data: ExtractionResult }> {
  const aiEnabled = Boolean(import.meta.env.VITE_AI_EXTRACT_ENDPOINT)
  if (!aiEnabled) {
    return {
      mode: 'demo',
      data: {
        productName: 'Demo Extracted Product',
        brand: 'Demo Brand',
        ingredients: 'water, oats, sugar',
      },
    }
  }

  return {
    mode: 'configured',
    data: {},
  }
}
