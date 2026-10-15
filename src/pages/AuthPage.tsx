import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types'
import { isSupabaseConfigured } from '../services/supabase'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['consumer', 'company', 'reviewer', 'admin']),
})

type FormValues = z.infer<typeof schema>

export function AuthPage() {
  const navigate = useNavigate()
  const { setRole } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'consumer' },
  })

  const onSubmit = handleSubmit((values) => {
    setRole(values.role as UserRole)
    if (values.role === 'reviewer') navigate('/reviewer')
    else if (values.role === 'company') navigate('/company')
    else navigate('/')
  })

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-[#10233F]">Sign In / Sign Up</h1>
        <p className="text-sm text-slate-600">
          {isSupabaseConfigured
            ? 'Supabase environment detected. Integrate production auth flows as needed.'
            : 'Supabase is not configured. Running in clearly labeled local demo authentication mode.'}
        </p>
      </Card>
      <form onSubmit={onSubmit} className="space-y-4">
        <Card className="space-y-3">
          <label className="text-sm font-medium">Email<input className="mt-1 w-full rounded-lg border p-2" {...register('email')} /></label>
          <label className="text-sm font-medium">Password<input type="password" className="mt-1 w-full rounded-lg border p-2" {...register('password')} /></label>
          <label className="text-sm font-medium">Role
            <select className="mt-1 w-full rounded-lg border p-2" {...register('role')}>
              <option value="consumer">Consumer</option>
              <option value="company">Company User</option>
              <option value="reviewer">Reviewer</option>
              <option value="admin">Administrator</option>
            </select>
          </label>
          {!!Object.keys(errors).length && <p className="text-sm text-red-600">Please provide valid credentials.</p>}
          <Button type="submit">Continue</Button>
        </Card>
      </form>
    </div>
  )
}
