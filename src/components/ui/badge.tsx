import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

const colors: Record<string, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-900',
  danger: 'bg-red-100 text-red-800',
  neutral: 'bg-slate-100 text-slate-700',
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'success' | 'warning' | 'danger' | 'neutral' }) {
  return <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', colors[tone])}>{children}</span>
}
