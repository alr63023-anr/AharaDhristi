import { Card } from '../components/ui/card'

export function AboutPage() {
  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-[#10233F]">About Nutrixon</h1>
        <p className="mt-2 text-sm text-slate-700">
          Nutrixon helps organize pre-launch product submissions, ingredient checks, and laboratory evidence review while giving consumers
          transparent product information.
        </p>
        <p className="mt-2 text-sm text-slate-700">
          This prototype does not physically test food and does not represent government authorization or mandatory legal approval.
        </p>
      </Card>
      <Card>
        <h2 className="text-lg font-bold text-[#10233F]">Architecture and data handling</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
          <li>React + TypeScript frontend with modular services and role-based route guards.</li>
          <li>Supabase-ready interfaces for auth, PostgreSQL tables, and private storage when configured.</li>
          <li>Demonstration rules and sample data are clearly labeled and configurable.</li>
        </ul>
      </Card>
    </div>
  )
}
