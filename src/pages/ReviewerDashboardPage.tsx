import { useMemo, useState } from 'react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useNutrixon } from '../context/NutrixonContext'

export function ReviewerDashboardPage() {
  const { submissions, products } = useNutrixon()
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => submissions.filter((submission) => submission.id.toLowerCase().includes(query.toLowerCase()) || submission.companyName.toLowerCase().includes(query.toLowerCase())),
    [query, submissions],
  )

  const pending = submissions.filter((s) => ['Submitted for Review', 'Evidence Under Review', 'Additional Testing Required'].includes(s.status)).length
  const incomplete = submissions.filter((s) => s.missingFields.length > 0).length
  const failed = submissions.filter((s) => s.status.includes('Potential') || s.status.includes('Not Met')).length
  const complete = submissions.filter((s) => s.status.includes('Requirements Met')).length

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-[#10233F]">Reviewer Dashboard (Demo Mode)</h1>
        <p className="text-sm text-slate-600">Fictional sample records for demonstration. Internal completion is not official government approval.</p>
      </Card>

      <section className="grid gap-3 md:grid-cols-4">
        {[['Pending', pending], ['Incomplete Evidence', incomplete], ['Failed Checks', failed], ['Completed', complete]].map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-[#10233F]">{value}</p>
          </Card>
        ))}
      </section>

      <Card>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search submissions" className="w-full rounded-lg border p-2 text-sm" />
      </Card>

      <Card>
        <div className="space-y-4">
          {filtered.map((submission) => {
            const product = products.find((item) => item.id === submission.productId)
            return (
              <div key={submission.id} className="rounded-lg border p-3">
                <p className="font-semibold text-[#10233F]">{submission.id} · {submission.companyName}</p>
                <p className="text-sm">Status: {submission.status}</p>
                <p className="text-sm">Product: {product?.name ?? submission.productId}</p>
                <p className="text-sm">Lab evidence: {product?.laboratoryEvidenceStatus ?? 'Pending'}</p>
                <p className="text-sm">Docs: {submission.files.map((file) => file.name).join(', ') || 'No documents uploaded'}</p>
                <textarea className="mt-2 w-full rounded-lg border p-2 text-sm" rows={2} placeholder="Reviewer notes and findings" aria-label="Reviewer notes" />
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button type="button" variant="secondary">Request more evidence</Button>
                  <Button type="button" variant="danger">Reject (reason required)</Button>
                  <Button type="button">Complete internal review</Button>
                </div>
              </div>
            )
          })}
          {!filtered.length && <p className="text-sm text-slate-500">No submissions found for your search.</p>}
        </div>
      </Card>
    </div>
  )
}
