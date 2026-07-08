import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PAGES } from '../data/pages'
import LensGlass from './LensGlass'
import { useIntro } from './IntroContext'

// tekdüze çerçeve YOK; yönlü stroke + iç parlama ayrı katmanlarla veriliyor
const GLASS =
  'overflow-hidden bg-white/4 ' +
  'shadow-[0_24px_60px_rgba(0,0,0,0.09),0_10px_30px_-12px_rgba(20,20,20,0.18),inset_0_1px_0_rgba(255,255,255,0.5)] ' +
  'backdrop-blur-lg backdrop-saturate-150'

const BAR = 'absolute left-1/2 top-1/2 h-[2.5px] w-6 rounded-full bg-current'
const BAR_TR = { duration: 0.32, ease: 'easeInOut' } as const

export default function FloatingNav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { introActive } = useIntro()
  const lineItems = PAGES.slice(0, 2) // çizgiden uzayarak oluşan ilk 2 buton
  const restItems = PAGES.slice(2) // sonradan beliren sayfalar

  // A: navbar koyu hero'nun üstündeyken içerik beyaza döner
  const [onHero, setOnHero] = useState(true)
  useEffect(() => {
    const check = () => {
      const hero = document.querySelector('[data-glass-bg]')
      if (!hero) return setOnHero(false)
      setOnHero(hero.getBoundingClientRect().bottom > 88)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [pathname])

  // B: her zeminde okunurluk için ince adaptif gölge (kutu değil)
  const logoShadow = onHero
    ? 'drop-shadow(0 1px 6px rgba(0,0,0,0.4))'
    : 'drop-shadow(0 1px 3px rgba(255,255,255,0.55))'
  const textShadow = onHero ? '0 1px 10px rgba(0,0,0,0.4)' : '0 1px 6px rgba(255,255,255,0.6)'
  // mobil menü rengi: hero üstünde beyaz, açık zeminde koyu (renk uyumu + okunurluk)
  const menuText = onHero ? 'text-white' : 'text-ink'
  const menuHover = onHero ? 'hover:bg-white/10' : 'hover:bg-[rgba(20,20,20,0.05)]'
  const menuLine = onHero ? 'rgba(255,255,255,0.92)' : 'rgba(20,20,20,1)'
  const menuLineClear = onHero ? 'rgba(255,255,255,0)' : 'rgba(20,20,20,0)'

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-7 z-50 flex flex-col items-center gap-2 px-4"
      style={{
        transform: introActive ? 'translateY(-160%)' : 'translateY(0)',
        opacity: introActive ? 0 : 1,
        transition: 'transform 0.75s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease',
      }}
    >
      <nav className={`pointer-events-auto relative w-full max-w-5xl rounded-full ${GLASS}`}>
        <LensGlass className="pointer-events-none absolute inset-0 h-full w-full" />
        {/* iç parlama: sol-üst aydınlık, sağ-alt koyu → cam hacmi hissi */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            // üst kenar highlight + yatayda homojen cam (sağ güçlü, sol hafif)
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0.16), rgba(255,255,255,0) 22%), ' +
              'radial-gradient(130% 160% at 90% 22%, rgba(255,255,255,0.18), rgba(255,255,255,0) 52%), ' +
              'radial-gradient(130% 160% at 8% 72%, rgba(255,255,255,0.08), rgba(255,255,255,0) 48%)',
          }}
        />
        {/* Apple tarzı yönlü stroke: üstte beyaz highlight → altta neredeyse görünmez */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            padding: '1px',
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.06) 42%, rgba(255,255,255,0) 100%)',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        <div className="relative z-10 flex h-[3.125rem] items-center justify-between gap-4 pl-7 pr-3">
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center lg:mr-8">
            <span className="relative inline-flex h-[2.8rem] items-center" style={{ filter: logoShadow }}>
              <img
                src="/logo-light.png"
                alt="idealofis"
                className={`h-[2.8rem] w-auto transition-opacity duration-300 ${onHero ? 'opacity-0' : 'opacity-100'}`}
              />
              <img
                src="/logo-white.png"
                alt=""
                aria-hidden="true"
                className={`absolute left-0 top-0 h-[2.8rem] w-auto transition-opacity duration-300 ${onHero ? 'opacity-100' : 'opacity-0'}`}
              />
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {PAGES.map((p) => (
              <NavLink
                key={p.path}
                to={p.path}
                style={{ textShadow }}
                className={({ isActive }) =>
                  `whitespace-nowrap text-sm font-[450] tracking-[0.02em] transition-colors ${
                    isActive
                      ? 'text-brand'
                      : onHero
                        ? 'text-white/90 hover:text-white'
                        : 'text-ink/80 hover:text-ink'
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
            style={{ filter: logoShadow }}
            className={`relative h-10 w-10 transition-colors lg:hidden ${onHero ? 'text-white' : 'text-ink'}`}
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
                    initial={{ width: 28, height: 3, backgroundColor: menuLine, borderRadius: 999 }}
                    animate={{
                      width: '100%',
                      height: 46,
                      backgroundColor: menuLineClear,
                      borderRadius: 16,
                      transition: { duration: 0.42, ease: 'easeOut', delay: 0.18 + i * 0.16 },
                    }}
                    exit={{
                      width: 28,
                      height: 3,
                      backgroundColor: menuLine,
                      borderRadius: 999,
                      transition: { duration: 0.4, delay: 0.22 + (1 - i) * 0.1 },
                    }}
                  >
                    <motion.span
                      style={{ textShadow }}
                      className={`whitespace-nowrap px-4 text-sm font-[450] ${
                        pathname === p.path ? 'text-brand' : menuText
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
                    style={{ textShadow }}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-3 text-center text-sm font-[450] transition-colors ${menuHover} ${
                        isActive ? 'text-brand' : menuText
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
