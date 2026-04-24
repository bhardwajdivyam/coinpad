import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { dark, toggle } = useTheme()

  const linkClass = ({ isActive }) =>
    `relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? 'text-[var(--color-accent)] bg-[var(--color-accent-glow)]'
        : 'text-secondary hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'
    }`

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl border-b border-[var(--color-border)] transition-colors duration-300"
         style={{ background: dark ? 'rgba(10,10,15,0.72)' : 'rgba(245,245,247,0.72)' }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-14">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <span className="text-xl">🪙</span>
          <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-[var(--color-accent)] to-cyan-300 bg-clip-text text-transparent">
            Coinpad
          </span>
        </NavLink>

        {/* Links + Toggle */}
        <div className="flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>Dashboard</NavLink>
          <NavLink to="/tracker" className={linkClass}>Tracker</NavLink>
          <NavLink to="/tx" className={linkClass}>Tx Tracker</NavLink>

          <button
            onClick={toggle}
            className="ml-3 p-2 rounded-lg text-secondary hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-all duration-200 cursor-pointer"
            aria-label="Toggle theme"
          >
            {dark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
