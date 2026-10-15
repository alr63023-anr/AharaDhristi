import { Link } from 'react-router-dom'
import { Card } from '../components/ui/card'

export function NotFoundPage() {
  return (
    <Card>
      <h1 className="text-xl font-bold text-[#10233F]">Page not found</h1>
      <p className="text-sm text-slate-600">The requested route does not exist.</p>
      <Link to="/" className="mt-2 inline-block text-sm font-semibold text-[#13B8A6]">Return home</Link>
    </Card>
  )
}
