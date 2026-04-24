export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-md">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input
        id="search-coins"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search coins…"
        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-secondary focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all duration-200"
      />
    </div>
  )
}
