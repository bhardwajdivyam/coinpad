export default function Loader({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-secondary">
      <div className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
