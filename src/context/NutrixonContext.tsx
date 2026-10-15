import { createContext, useContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { demoProducts, demoSubmissions } from '../data/demoData'
import type { Product, SubmissionRecord } from '../types'

interface NutrixonState {
  products: Product[]
  submissions: SubmissionRecord[]
  latestProduct?: Product
  addScannedProduct: (product: Product) => void
  addSubmission: (submission: SubmissionRecord) => void
}

const NutrixonContext = createContext<NutrixonState | null>(null)

export function NutrixonProvider({ children }: PropsWithChildren) {
  const [products, setProducts] = useState<Product[]>(demoProducts)
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(demoSubmissions)

  const value = useMemo(
    () => ({
      products,
      submissions,
      latestProduct: products[products.length - 1],
      addScannedProduct: (product: Product) => setProducts((prev) => [...prev, product]),
      addSubmission: (submission: SubmissionRecord) => setSubmissions((prev) => [...prev, submission]),
    }),
    [products, submissions],
  )

  return <NutrixonContext.Provider value={value}>{children}</NutrixonContext.Provider>
}

export function useNutrixon() {
  const context = useContext(NutrixonContext)
  if (!context) throw new Error('useNutrixon must be used inside NutrixonProvider')
  return context
}
