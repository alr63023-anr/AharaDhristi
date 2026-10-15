import type { PropsWithChildren } from 'react'
import { cn } from '../../lib/utils'

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200', className)}>{children}</div>
}
