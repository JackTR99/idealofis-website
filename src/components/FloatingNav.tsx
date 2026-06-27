import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PAGES } from '../data/pages'

const GLASS =
  'overflow-hidden border border-[rgba(20,20,20,0.08)] bg-white/18 ' +
  'shadow-[0_12px_38px_-10px_rgba(20,20,20,0.22),inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-1px_0_rgba(255,255,255,0.25)] ' +
  'backdrop-blur-lg backdrop-saturate-150'

const BAR = 'absolute left-1/2 top-1/2 h-[2.5px] w-6 rounded-full bg-ink'
const BAR_TR = { duration: 0.32, ease: 'easeInOut' } as const

export default function FloatingNav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const lineItems = PAGES.slice(0, 2) // çizgiden uzayarak oluşan ilk 2 buton
  const restItems = PAGES.slice(2) // sonradan beliren sayfalar

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      <nav className={`pointer-events-auto relative w-full max-w-5xl rounded-full ${GLASS}`}>
        <div className="relative z-10 flex h-14 items-center justify-between gap-4 pl-5 pr-3">
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center">
            <img src="/logo-light.png" alt="idealofis" className="h-11 w-auto" />
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            {PAGES.map((p) => (
              <NavLink
                key={p.path}
                to={p.path}
                className={({ isActive }) =>
                  `whitespace-nowrap text-sm font-medium transition-colors hover:text-ink ${
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
            className="relative h-10 w-10 lg:hidden"
          >
            {/* üst çizgi -> X'in 1. kolu */}
            <motion.span
              className={BAR}
              initial={false}
              animate={open ? { x: '-50%', y: 0, rotate: 45 } : { x: '-50%', y: -7, rotate: 0 }}
              transition={BAR_TR}
            />
            {/* X'in 2. kolu (çapraz tamamlanır) */}
            <motion.span
              className={BAR}
              initial={false}
              animate={
                open
                  ? { x: '-50%', y: 0, rotate: -45, opacity: 1, scaleX: 1 }
                  : { x: '-50%', y: 0, rotate: 0, opacity: 0, scaleX: 0.2 }
              }
              transition={{ ...BAR_TR, delay: open ? 0.12 : 0 }}
            />
            {/* orta çizgi -> aşağı düşer */}
            <motion.span
              className={BAR}
              initial={false}
              animate={open ? { x: '-50%', y: 16, opacity: 0 } : { x: '-50%', y: 0, opacity: 1 }}
              transition={BAR_TR}
            />
            {/* alt çizgi -> aşağı düşer */}
            <motion.span
              className={BAR}
              initial={false}
              animate={open ? { x: '-50%', y: 20, opacity: 0 } : { x: '-50%', y: 7, opacity: 1 }}
              transition={{ ...BAR_TR, delay: 0.05 }}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-menu"
            className={`pointer-events-auto relative w-full max-w-5xl rounded-3xl lg:hidden ${GLASS}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.25, delay: 0.5 } }}
            transition={{ duration: 0.25 }}
          >
            <div className="relative z-10 flex flex-col gap-1 p-2">
              {lineItems.map((p, i) => (
                <Link key={p.path} to={p.path} onClick={() => setOpen(false)} className="block">
                  <motion.div
                    className="mx-auto flex items-center justify-center overflow-hidden"
                    initial={{ width: 28, height: 3, backgroundColor: 'rgba(20,20,20,1)', borderRadius: 999 }}
                    animate={{
                      width: '100%',
                      height: 46,
                      backgroundColor: 'rgba(20,20,20,0)',
                      borderRadius: 16,
                      transition: { duration: 0.42, ease: 'easeOut', delay: 0.18 + i * 0.16 },
                    }}
                    exit={{
                      width: 28,
                      height: 3,
                      backgroundColor: 'rgba(20,20,20,1)',
                      borderRadius: 999,
                      transition: { duration: 0.4, delay: 0.22 + (1 - i) * 0.1 },
                    }}
                  >
                    <motion.span
                      className={`whitespace-nowrap px-4 text-sm font-medium ${
                        pathname === p.path ? 'text-brand' : 'text-ink'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.18 + i * 0.16 + 0.24 } }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    >
                      {p.label}
                    </motion.span>
                  </motion.div>
                </Link>
              ))}

              {restItems.map((p, i) => (
                <motion.div
                  key={p.path}
                  className="overflow-hidden rounded-2xl"
                  initial={{ opacity: 0, y: 8, backgroundColor: 'rgba(20,20,20,0.05)' }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundColor: 'rgba(20,20,20,0)',
                    transition: { duration: 0.45, delay: 0.55 + i * 0.08 },
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    backgroundColor: 'rgba(20,20,20,0.05)',
                    transition: { duration: 0.35, delay: (restItems.length - 1 - i) * 0.07 },
                  }}
                >
                  <NavLink
                    to={p.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-[rgba(20,20,20,0.05)] ${
                        isActive ? 'text-brand' : 'text-ink'
                      }`
                    }
                  >
                    {p.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}
