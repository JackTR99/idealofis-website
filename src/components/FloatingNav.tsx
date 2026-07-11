import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { PAGES } from '../data/pages'
import LensGlass from './LensGlass'
import { useIntro } from './IntroContext'

// tekdüze çerçeve YOK; yönlü stroke + iç parlama ayrı katmanlarla veriliyor
// (menü kartı için: buğulu cam)
const GLASS =
  'overflow-hidden bg-white/4 ' +
  'shadow-[0_24px_60px_rgba(0,0,0,0.09),0_10px_30px_-12px_rgba(20,20,20,0.18),inset_0_1px_0_rgba(255,255,255,0.5)] ' +
  'backdrop-blur-lg backdrop-saturate-150'
// bar için: BERRAK cam — buğu ve renk canlandırma yok; altından geçen içerik net
// görünür, kenar eritmesi ayrı ince halkayla verilir (aşağıdaki katman)
const GLASS_BAR =
  'overflow-hidden bg-white/4 ' +
  'shadow-[0_24px_60px_rgba(0,0,0,0.09),0_10px_30px_-12px_rgba(20,20,20,0.18),inset_0_1px_0_rgba(255,255,255,0.5)]'

// cam büyüteci: sayfanın (main) canlı kopyasını barın içinde scroll ile birebir
// senkron akıtır ve bar merkezinden %7 büyütür → altından geçen içerik camda
// büyümüş/kaymış görünür ("içinde su olan cam"). Kopya etkileşime kapalıdır ve
// canlı içerikteki değişimleri yakalamak için 1,5 sn'de bir tazelenir.
function GlassMirror() {
  const holder = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const holderEl = holder.current
    if (!holderEl) return
    let clone: HTMLElement | null = null
    let raf = 0
    let lastClone = 0

    const reclone = () => {
      const src = document.querySelector('main')
      if (!src) return
      const fresh = src.cloneNode(true) as HTMLElement
      // kopya sayfayla çakışmasın: kimlikler ve ağır/etkileşimli parçalar temizlenir
      fresh.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'))
      fresh.querySelectorAll('canvas, video, script, iframe').forEach((n) => n.remove())
      if (clone) clone.replaceWith(fresh)
      else holderEl.appendChild(fresh)
      clone = fresh
      lastClone = performance.now()
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const src = document.querySelector('main')
      const bar = holderEl.closest('nav')
      if (!src || !bar) return
      if (!clone || (!document.hidden && performance.now() - lastClone > 1500)) reclone()
      const B = bar.getBoundingClientRect()
      const M = src.getBoundingClientRect()
      holderEl.style.width = `${M.width}px`
      holderEl.style.transform = `translate3d(${M.left - B.left}px, ${M.top - B.top}px, 0)`
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      clone?.remove()
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      inert
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
    >
      {/* büyütme bar merkezinden yapılır → cam altındaki içerik hafif şişmiş görünür */}
      <div className="absolute inset-0" style={{ transform: 'scale(1.07)' }}>
        <div ref={holder} className="absolute left-0 top-0 will-change-transform" />
      </div>
    </div>
  )
}

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
  const menuHover = onHero ? 'hover:bg-white/15' : 'hover:bg-[rgba(20,20,20,0.09)]'
  const menuPill = onHero ? 'bg-white/10' : 'bg-[rgba(20,20,20,0.05)]'
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
      <nav ref={barRef} className={`pointer-events-auto relative w-full max-w-5xl rounded-full ${GLASS_BAR}`}>
        <GlassMirror />
        <LensGlass className="pointer-events-none absolute inset-0 h-full w-full" />
        {/* kenar eritme: kenara doğru KADEMELİ artan buğu (1→2→3px), tek sert sınır yok.
            Altından geçen içerik camın kıvrımına yaklaştıkça yumuşakça erir. */}
        {[
          { pad: 14, blur: 1 },
          { pad: 9, blur: 2 },
          { pad: 4, blur: 3 },
        ].map((k) => (
          <div
            key={k.pad}
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              padding: `${k.pad}px`,
              backdropFilter: `blur(${k.blur}px)`,
              WebkitBackdropFilter: `blur(${k.blur}px)`,
              WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        ))}
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
            className={`relative h-10 w-10 lg:hidden ${onHero ? 'text-white' : 'text-ink'}`}
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
