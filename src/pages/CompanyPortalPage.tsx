import { Link } from 'react-router-dom'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useNutrixon } from '../context/NutrixonContext'

export function CompanyPortalPage() {
  const { submissions } = useNutrixon()

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-[#10233F]">Company Portal</h1>
        <p className="text-sm text-slate-600">Manage profile, food-license data, product submissions, and reviewer responses.</p>
        <div className="mt-3 flex gap-3">
          <Link to="/submit"><Button>Create New Submission</Button></Link>
          <Link to="/tracking"><Button variant="secondary">Track Submissions</Button></Link>
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-bold text-[#10233F]">Recent submissions</h2>
        <div className="mt-3 space-y-2 text-sm">
          {submissions.map((submission) => (
            <div key={submission.id} className="rounded-lg border p-3">
              <p className="font-semibold text-[#10233F]">{submission.id} · {submission.companyName}</p>
              <p>Status: {submission.status}</p>
              <p>Updated: {submission.updatedAt}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
