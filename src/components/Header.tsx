import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { PAGES } from '../data/pages'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center">
          <img src="/logo-light.png" alt="idealofis" className="h-9 w-auto" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {PAGES.map((p) => (
            <NavLink
              key={p.path}
              to={p.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-brand ${
                  isActive ? 'text-brand' : 'text-ink'
                }`
              }
            >
              {p.label}
            </NavLink>
          ))}
        </nav>

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

      {open && (
        <nav className="border-t border-line bg-surface md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {PAGES.map((p) => (
              <NavLink
                key={p.path}
                to={p.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `border-b border-line py-3 text-sm font-medium last:border-b-0 ${
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
    </header>
  )
}
