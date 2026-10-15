import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useNutrixon } from '../context/NutrixonContext'

export function SubmissionTrackingPage() {
  const { submissions } = useNutrixon()

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-[#10233F]">Submission Tracking</h1>
        <p className="text-sm text-slate-600">Track status progression, missing data, and reviewer feedback.</p>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Submission</th>
                <th className="p-2">Status</th>
                <th className="p-2">Missing info</th>
                <th className="p-2">Updated</th>
                <th className="p-2">Reviewer feedback</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-b align-top">
                  <td className="p-2 font-semibold text-[#10233F]">{submission.id}</td>
                  <td className="p-2">
                    <Badge
                      tone={submission.status.includes('Not Met') || submission.status.includes('Potential') ? 'danger' : submission.status.includes('Additional') || submission.status.includes('Incomplete') ? 'warning' : 'success'}
                    >
                      {submission.status}
                    </Badge>
                  </td>
                  <td className="p-2">{submission.missingFields.join(', ') || 'None'}</td>
                  <td className="p-2">{submission.updatedAt}</td>
                  <td className="p-2">{submission.reviewerFeedback ?? 'Pending reviewer update'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
