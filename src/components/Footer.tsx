import { Link } from 'react-router-dom'
import { PAGES } from '../data/pages'

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <img src="/logo-dark.png" alt="idealofis" className="h-10 w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Modern ofis ve toplantı çözümleri. Web sitemiz yapım aşamasındadır.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-3">
            {PAGES.map((p) => (
              <Link
                key={p.path}
                to={p.path}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/40">
          © 2026 idealofis. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
