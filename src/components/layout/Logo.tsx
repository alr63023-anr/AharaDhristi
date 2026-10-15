import { ShieldCheck, Leaf } from 'lucide-react'

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-[#10233F]">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#10233F] text-white">
        <ShieldCheck className="h-5 w-5" aria-hidden />
        <Leaf className="absolute -right-2 -top-2 h-4 w-4 text-[#13B8A6]" aria-hidden />
      </div>
      <div>
        <p className="text-lg font-bold tracking-tight">Nutrixon</p>
        <p className="text-xs text-slate-500">Screen Before Launch. Scan Before You Consume.</p>
      </div>
    </div>
  )
}
