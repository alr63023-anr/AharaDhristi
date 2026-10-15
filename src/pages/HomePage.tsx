import { Link } from 'react-router-dom'
import { Activity, Beaker, FileCheck, ScanLine, ShieldAlert } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

const workflow = ['Company Submission', 'Evidence Review', 'Laboratory Verification', 'Reviewer Decision', 'Consumer Transparency']

const stats = [
  { name: 'Submitted', value: 74 },
  { name: 'Under Review', value: 22 },
  { name: 'Needs Update', value: 16 },
  { name: 'Completed', value: 40 },
]

const features = [
  { icon: ScanLine, title: 'AI-Assisted Label Recognition', description: 'Modular extraction with manual fallback when OCR is not configured.' },
  { icon: ShieldAlert, title: 'Ingredient Screening', description: 'Rule-based checks with references and uncertainty labeling.' },
  { icon: Activity, title: 'Nutrition Scoring', description: 'Transparent category-aware 1-100 prototype nutrition score.' },
  { icon: Beaker, title: 'Laboratory Tracking', description: 'Track test status, thresholds, and reviewer verification.' },
  { icon: FileCheck, title: 'Public Transparency', description: 'Registry surfaces only approved public fields and limitations.' },
]

export function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-[#10233F] p-8 text-white shadow-lg">
        <p className="text-sm font-semibold text-[#13B8A6]">Nutrixon</p>
        <h1 className="mt-2 text-3xl font-bold md:text-5xl">Trust Your Food. Verify Before It Reaches the Shelf.</h1>
        <p className="mt-4 max-w-3xl text-slate-200">
          Pre-launch product screening for companies, evidence-first review support for experts, and nutrition transparency for consumers.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/scanner">
            <Button>Scan a Product</Button>
          </Link>
          <Link to="/company">
            <Button variant="secondary">Register a Company</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        {workflow.map((step, idx) => (
          <Card key={step} className="text-center">
            <p className="text-xs font-semibold text-[#13B8A6]">Step {idx + 1}</p>
            <p className="mt-1 text-sm font-semibold text-[#10233F]">{step}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {features.map((feature) => (
          <Card key={feature.title}>
            <feature.icon className="h-6 w-6 text-[#13B8A6]" />
            <h2 className="mt-2 text-lg font-bold text-[#10233F]">{feature.title}</h2>
            <p className="text-sm text-slate-600">{feature.description}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold text-[#10233F]">Illustrative Demo Statistics</h2>
          <p className="mb-4 text-sm text-slate-500">Demo-only numbers for hackathon presentation.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#13B8A6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-[#10233F]">Important Disclaimer</h2>
          <p className="text-sm text-slate-700">
            Nutrixon is a prototype decision-support platform. Results are based on submitted data and reviewer checks and are not a
            substitute for official regulatory decisions or physical laboratory testing by Nutrixon itself.
          </p>
        </Card>
      </section>
    </div>
  )
}
