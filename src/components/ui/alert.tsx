export function Alert({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-semibold">{title}</p>
      <p>{message}</p>
    </div>
  )
}
