import { useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { PAGES } from '../data/pages'
import LensGlass from './LensGlass'
import { useIntro } from './IntroContext'

// tekdüze çerçeve YOK; yönlü stroke + iç parlama ayrı katmanlarla veriliyor
const GLASS =
  'overflow-hidden bg-white/4 ' +
  'shadow-[0_24px_60px_rgba(0,0,0,0.09),0_10px_30px_-12px_rgba(20,20,20,0.18),inset_0_1px_0_rgba(255,255,255,0.5)] ' +
  'backdrop-blur-lg backdrop-saturate-150'

export default function FloatingNav() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [slideX, setSlideX] = useState(0) // hamburger açılırken barın ortasına kayar
  const barRef = useRef<HTMLElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  const openMenu = () => {
    const bar = barRef.current?.getBoundingClientRect()
    const btn = btnRef.current?.getBoundingClientRect()
    if (bar && btn) {
      setSlideX(bar.left + bar.width / 2 - (btn.left + btn.width / 2))
    }
    setOpen(true)
  }

  const closeMenu = () => {
    if (closing) return
    setClosing(true)
    window.setTimeout(() => setSlideX(0), 780)
    window.setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 920)
  }

  const toggleMenu = () => {
    if (closing) return
    if (open) closeMenu()
    else openMenu()
  }
  const { introActive } = useIntro()

  // KOD A: hero'daki navbar — her sayfada ve her kaydırma konumunda AYNI görünüm
  const logoShadow = 'drop-shadow(0 1px 6px rgba(0,0,0,0.4))'
  const textShadow = '0 1px 10px rgba(0,0,0,0.4)'
  const menuText = 'text-white'
  const menuHover = 'hover:bg-white/15'
  const menuPill = 'bg-white/10'
  const lastIndex = PAGES.length - 1

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-7 z-50 flex flex-col items-center gap-2 px-4"
      style={{
        transform: introActive ? 'translateY(-160%)' : 'translateY(0)',
        opacity: introActive ? 0 : 1,
        transition: 'transform 0.75s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease',
      }}
    >
      <nav ref={barRef} className={`pointer-events-auto relative w-full max-w-5xl rounded-full ${GLASS}`}>
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
          <Link
            to="/"
            onClick={() => open && closeMenu()}
            style={{
              opacity: slideX !== 0 ? 0 : 1,
              pointerEvents: slideX !== 0 ? 'none' : 'auto',
              transition: 'opacity 0.25s ease-in-out',
            }}
            className="flex items-center lg:mr-8"
          >
            <span className="relative inline-flex h-[2.8rem] items-center" style={{ filter: logoShadow }}>
              <img src="/logo-white.png" alt="idealofis" className="h-[2.8rem] w-auto" />
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
                    isActive ? 'text-brand' : 'text-white/90 hover:text-white'
                  }`
                }
              >
                {p.label}
              </NavLink>
            ))}
          </div>

          <button
            ref={btnRef}
            type="button"
            aria-label="Menüyü aç/kapat"
            aria-expanded={open}
            onClick={toggleMenu}
            style={{
              filter: logoShadow,
              transform: `translateX(${slideX}px)`,
              transition:
                'transform 0.35s ease-in-out, color 0.3s ease, filter 0.3s ease',
              transitionDelay: '0.15s',
            }}
            className="relative h-10 w-10 text-white lg:hidden"
          >
            <span className="relative mx-auto flex size-6 flex-col items-center justify-center gap-[4px]">
              {/* çizgiler: açılışta tek tek aşağı düşer, kapanışta geri yükselir */}
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`ham-bar ${open && !closing ? 'ham-bar--drop' : ''} ${closing ? 'ham-bar--rise' : ''}`}
                  style={{ animationDelay: closing ? `${420 + i * 30}ms` : `${300 + i * 35}ms` }}
                />
              ))}
              {/* çarpı: yukarıdan iner, dönerek X olur (kapanışta tersi) */}
              {open && (
                <>
                  <span
                    className={`x-stroke ${closing ? 'x-stroke-a-out' : 'x-stroke-a-in'}`}
                    style={{ animationDelay: closing ? '0ms' : '650ms' }}
                  />
                  <span
                    className={`x-stroke ${closing ? 'x-stroke-b-out' : 'x-stroke-b-in'}`}
                    style={{ animationDelay: closing ? '0ms' : '650ms' }}
                  />
                </>
              )}
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <nav
          className={`pointer-events-auto relative w-full max-w-5xl rounded-3xl lg:hidden ${GLASS} ${
            closing ? 'menu-card-out' : 'menu-card-in'
          }`}
          style={{ animationDelay: closing ? '560ms' : '600ms' }}
        >
          <div className="relative z-10 flex flex-col items-center gap-1.5 p-2">
            {PAGES.map((p, i) => (
              <Link
                key={p.path}
                to={p.path}
                onClick={closeMenu}
                aria-current={pathname === p.path ? 'page' : undefined}
                style={{ animationDelay: closing ? `${(lastIndex - i) * 55}ms` : `${580 + i * 60}ms` }}
                className={`flex h-11 w-full items-center justify-center overflow-hidden rounded-full text-sm font-[450] transition-colors ${menuPill} ${menuHover} ${
                  closing ? 'menu-pill-out' : 'menu-pill-in'
                } ${pathname === p.path ? 'text-brand' : menuText}`}
              >
                <span
                  className={`whitespace-nowrap ${closing ? 'menu-label-out' : 'menu-label-in'}`}
                  style={{
                    textShadow,
                    animationDelay: closing
                      ? `${(lastIndex - i) * 55}ms`
                      : `${580 + i * 60 + 150}ms`,
                  }}
                >
                  {p.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
