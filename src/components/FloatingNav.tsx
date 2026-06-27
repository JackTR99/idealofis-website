import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { PAGES } from '../data/pages'
import LiquidGlass from './LiquidGlass'

export default function FloatingNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      <nav className="pointer-events-auto relative w-full max-w-5xl overflow-hidden rounded-full border border-white/50 bg-white/55 shadow-[0_12px_40px_-8px_rgba(20,20,20,0.28)] backdrop-blur-xl backdrop-saturate-150">
        <LiquidGlass className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="relative z-10 flex h-14 items-center justify-between gap-4 pl-5 pr-3">
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center">
            <img src="/logo-light.png" alt="idealofis" className="h-7 w-auto" />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {PAGES.map((p) => (
              <NavLink
                key={p.path}
                to={p.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-brand ${
                    isActive ? 'text-brand' : 'text-ink/80'
                  }`
                }
              >
                {p.label}
              </NavLink>
            ))}
          </div>

          <button
            type="button"
            aria-label="Menü"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-ink md:hidden"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <nav className="pointer-events-auto relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-[0_12px_40px_-8px_rgba(20,20,20,0.28)] backdrop-blur-xl backdrop-saturate-150 md:hidden">
          <LiquidGlass className="pointer-events-none absolute inset-0 h-full w-full" />
          <div className="relative z-10 flex flex-col p-2">
            {PAGES.map((p) => (
              <NavLink
                key={p.path}
                to={p.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/40 ${
                    isActive ? 'text-brand' : 'text-ink'
                  }`
                }
              >
                {p.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
