import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useNutrixon } from '../context/NutrixonContext'

const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg']
const MAX_FILE_MB = 8

const schema = z.object({
  companyName: z.string().min(2),
  foodLicense: z.string().min(2),
  productId: z.string().min(2),
  productName: z.string().min(2),
  brand: z.string().min(2),
  category: z.string().min(2),
  ingredients: z.string().min(2),
  allergens: z.string().min(1),
  launchDate: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

export function SubmitProductPage() {
  const { addSubmission } = useNutrixon()
  const [files, setFiles] = useState<File[]>([])
  const [statusMessage, setStatusMessage] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const handleFileChange = (incoming: FileList | null) => {
    if (!incoming) return
    const selected = Array.from(incoming)
    for (const file of selected) {
      if (!allowedTypes.includes(file.type)) {
        setStatusMessage('Invalid file type. Only PDF, PNG, JPG accepted.')
        return
      }
      if (file.size / 1024 / 1024 > MAX_FILE_MB) {
        setStatusMessage(`File ${file.name} exceeds ${MAX_FILE_MB}MB limit.`)
        return
      }
    }
    setFiles((prev) => [...prev, ...selected])
    setStatusMessage('Files added successfully.')
  }

  const onSaveDraft = handleSubmit((values) => {
    addSubmission({
      id: `S-${Math.floor(Math.random() * 10000)}`,
      productId: values.productId,
      companyName: values.companyName,
      status: 'Draft',
      intendedLaunchDate: values.launchDate,
      missingFields: ['Laboratory reports pending'],
      updatedAt: new Date().toISOString().slice(0, 10),
      files: files.map((file) => ({ name: file.name, type: file.type, sizeMb: Number((file.size / 1024 / 1024).toFixed(2)) })),
    })
    setStatusMessage('Draft saved. You can resume and submit later.')
  })

  const onSubmit = handleSubmit((values) => {
    const shouldSubmit = window.confirm('Submit application for human review?')
    if (!shouldSubmit) return

    const missingFields = [] as string[]
    if (!files.length) missingFields.push('Supporting files')

    addSubmission({
      id: `S-${Math.floor(Math.random() * 10000)}`,
      productId: values.productId,
      companyName: values.companyName,
      status: missingFields.length ? 'Submission Incomplete' : 'Submitted for Review',
      intendedLaunchDate: values.launchDate,
      missingFields,
      updatedAt: new Date().toISOString().slice(0, 10),
      files: files.map((file) => ({ name: file.name, type: file.type, sizeMb: Number((file.size / 1024 / 1024).toFixed(2)) })),
    })

    reset()
    setFiles([])
    setStatusMessage('Submission recorded for reviewer workflow.')
  })

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-[#10233F]">Submit a Product</h1>
        <p className="text-sm text-slate-600">Upload product documents and submit for internal review.</p>
      </Card>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Card className="grid gap-3 md:grid-cols-2">
          <label className="text-sm font-medium">Company name<input className="mt-1 w-full rounded-lg border p-2" {...register('companyName')} /></label>
          <label className="text-sm font-medium">Food license<input className="mt-1 w-full rounded-lg border p-2" {...register('foodLicense')} /></label>
          <label className="text-sm font-medium">Product ID<input className="mt-1 w-full rounded-lg border p-2" {...register('productId')} /></label>
          <label className="text-sm font-medium">Product name<input className="mt-1 w-full rounded-lg border p-2" {...register('productName')} /></label>
          <label className="text-sm font-medium">Brand<input className="mt-1 w-full rounded-lg border p-2" {...register('brand')} /></label>
          <label className="text-sm font-medium">Category<input className="mt-1 w-full rounded-lg border p-2" {...register('category')} /></label>
          <label className="text-sm font-medium md:col-span-2">Ingredients/formulation<input className="mt-1 w-full rounded-lg border p-2" {...register('ingredients')} /></label>
          <label className="text-sm font-medium">Allergens<input className="mt-1 w-full rounded-lg border p-2" {...register('allergens')} /></label>
          <label className="text-sm font-medium">Intended launch date<input type="date" className="mt-1 w-full rounded-lg border p-2" {...register('launchDate')} /></label>
          <label className="text-sm font-medium md:col-span-2">Upload docs (PDF/PNG/JPG up to 8MB each)
            <input multiple type="file" accept=".pdf,.png,.jpg,.jpeg" className="mt-1 block w-full" onChange={(e) => handleFileChange(e.target.files)} />
          </label>
          <ul className="md:col-span-2 list-disc pl-5 text-xs text-slate-600">
            {files.map((file) => <li key={file.name}>{file.name}</li>)}
          </ul>
          {!!Object.keys(errors).length && <p className="md:col-span-2 text-sm text-red-600">Please fill required fields and address validation errors.</p>}
          {statusMessage && <p className="md:col-span-2 text-sm text-[#10233F]">{statusMessage}</p>}
        </Card>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onSaveDraft}>Save Draft</Button>
          <Button type="submit">Submit for Review</Button>
        </div>
      </form>
    </div>
  )
}
