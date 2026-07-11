import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { PAGES } from '../data/pages'
import LensGlass from './LensGlass'
import { useIntro } from './IntroContext'

// tekdüze çerçeve YOK; yönlü stroke + iç parlama ayrı katmanlarla veriliyor
const GLASS =
  'overflow-hidden bg-white/4 ' +
  'shadow-[0_24px_60px_rgba(0,0,0,0.09),0_10px_30px_-12px_rgba(20,20,20,0.18),inset_0_1px_0_rgba(255,255,255,0.5)]'
// KOD 2 (Safari/iPhone ve diğerleri): klasik buğulu cam — orijinal navbar
const FROST = 'backdrop-blur-lg backdrop-saturate-150'

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

  // KOD 1 / KOD 2 seçimi: gerçek ışık kırılması (SVG yer değiştirme haritalı
  // backdrop-filter) yalnız Chromium'da çalışır; Safari/Firefox desteklemiyor
  // (WebKit bug 245510). Tarayıcı kendini bildirir, Safari otomatik KOD 2 alır.
  const [refract, setRefract] = useState(false)
  useEffect(() => {
    const uaData = (
      navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }
    ).userAgentData
    setRefract(!!uaData?.brands?.some((b) => /Chromium/i.test(b.brand)))
  }, [])

  // KOD 1: barın ölçülerine göre kubbe kırılma haritası üret (R=X, G=Y kayması).
  // Merkez birebir net, kenara doğru artan bükülme — hero merceğiyle aynı fizik.
  useEffect(() => {
    if (!refract) return
    const bar = barRef.current
    const img = document.getElementById('liquid-lens-map')
    if (!bar || !img) return
    const edgeImg = document.getElementById('liquid-lens-edge')
    // gradyan sönüm: kenarda 1 → merkezde 0, iki uçta sıfır eğimle (çizgisiz geçiş)
    const smootherstep = (v: number) =>
      v <= 0 ? 0 : v >= 1 ? 1 : v * v * v * (v * (v * 6 - 15) + 10)
    const draw = () => {
      const W = Math.max(2, Math.round(bar.clientWidth))
      const H = Math.max(2, Math.round(bar.clientHeight))
      const c = document.createElement('canvas')
      c.width = W
      c.height = H
      const ce = document.createElement('canvas')
      ce.width = W
      ce.height = H
      const ctx = c.getContext('2d')
      const ctxE = ce.getContext('2d')
      if (!ctx || !ctxE) return
      const px = ctx.createImageData(W, H)
      const pe = ctxE.createImageData(W, H)
      const hx = W / 2
      const hy = H / 2
      const r = hy
      const sd = (x: number, y: number) => {
        const qx = Math.abs(x - hx) - (hx - r)
        const qy = Math.abs(y - hy) - (hy - r)
        const ax = Math.max(qx, 0)
        const ay = Math.max(qy, 0)
        return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r
      }
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4
          const d = sd(x + 0.5, y + 0.5)
          let dx = 0
          let dy = 0
          let bend = 0
          if (d < 0) {
            const t = Math.min(1, -d / r)
            bend = 1 - smootherstep(t)
            const gx = sd(x + 1.5, y + 0.5) - sd(x - 0.5, y + 0.5)
            const gy = sd(x + 0.5, y + 1.5) - sd(x + 0.5, y - 0.5)
            const len = Math.hypot(gx, gy) || 1
            // İÇE doğru örnekleme (büyüteç): pill dışından örnek alınmaz →
            // kenarlarda düz çizgi/leke oluşmaz
            dx = -(gx / len) * bend
            dy = -(gy / len) * bend
          }
          px.data[i] = Math.round(127.5 + dx * 127.5)
          px.data[i + 1] = Math.round(127.5 + dy * 127.5)
          px.data[i + 2] = 0
          px.data[i + 3] = 255
          // kenar maskesi: bükülen banda hafif bulanıklık karışımı için
          pe.data[i] = 255
          pe.data[i + 1] = 255
          pe.data[i + 2] = 255
          pe.data[i + 3] = Math.round(bend * 255)
        }
      }
      ctx.putImageData(px, 0, 0)
      ctxE.putImageData(pe, 0, 0)
      img.setAttribute('href', c.toDataURL())
      img.setAttribute('width', String(W))
      img.setAttribute('height', String(H))
      if (edgeImg) {
        edgeImg.setAttribute('href', ce.toDataURL())
        edgeImg.setAttribute('width', String(W))
        edgeImg.setAttribute('height', String(H))
      }
    }
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(bar)
    return () => ro.disconnect()
  }, [refract])

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
      {/* KOD 1 filtresi: kubbe haritasıyla arkadaki CANLI pikselleri büker (yalnız Chromium) */}
      {refract && (
        <svg width="0" height="0" aria-hidden="true" className="absolute">
          <filter
            id="liquid-lens"
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
            primitiveUnits="userSpaceOnUse"
          >
            <feImage id="liquid-lens-map" x="0" y="0" preserveAspectRatio="none" result="map" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="36"
              xChannelSelector="R"
              yChannelSelector="G"
              result="bent"
            />
            {/* bükülen banda hafif bulanıklık: merkez jilet net kalır */}
            <feGaussianBlur in="bent" stdDeviation="1.3" result="soft" />
            <feImage id="liquid-lens-edge" x="0" y="0" preserveAspectRatio="none" result="edge" />
            <feComposite in="soft" in2="edge" operator="in" result="softEdge" />
            <feMerge>
              <feMergeNode in="bent" />
              <feMergeNode in="softEdge" />
            </feMerge>
          </filter>
        </svg>
      )}
      <nav
        ref={barRef}
        className={`pointer-events-auto relative w-full max-w-5xl rounded-full ${GLASS} ${refract ? '' : FROST}`}
        style={
          refract
            ? { backdropFilter: 'url(#liquid-lens)', WebkitBackdropFilter: 'url(#liquid-lens)' }
            : undefined
        }
      >
        {/* TEK CAM: Chromium'da bükmeyi filtre yapar, mercek yalnız KOD 2'de (Safari) */}
        {!refract && <LensGlass className="pointer-events-none absolute inset-0 h-full w-full" />}
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
          className={`pointer-events-auto relative w-full max-w-5xl rounded-3xl lg:hidden ${GLASS} ${FROST} ${
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
