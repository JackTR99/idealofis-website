import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { OFISLER, type Ofis } from '../data/ofisler'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const AKIS_HIZI = 48 // px/sn — sakin, premium akış

function reduceMotion() {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

const pts = (p: { x: number; y: number }[]) => p.map((v) => `${v.x},${v.y}`).join(' ')

/**
 * Tek tip ofis kartı — plan görseli + ad + genel brüt m² (ofisler.ts'ten).
 * Görsel kabı aspect-ratio: en/boy'a sabitlenir; böylece 0–100 viewBox'lu
 * SVG bindirmesinin poligon koordinatları plana birebir oturur.
 * sira: parlama dalgasının kartlar arası faz farkı (kart başına ~0.5 sn).
 */
function OfisKart({ ofis, sira, sinif }: { ofis: Ofis; sira: number; sinif: string }) {
  return (
    <Link
      to="/ofislerimiz"
      className={`group block rounded-[24px] bg-surface p-4 shadow-[0_1px_2px_rgba(20,20,20,0.04),0_18px_40px_-24px_rgba(20,20,20,0.16)] ring-1 ring-black/[0.04] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(20,20,20,0.04),0_32px_64px_-28px_rgba(20,20,20,0.3)] ${sinif}`}
    >
      <div className="flex h-40 items-center justify-center sm:h-44">
        <div
          className="relative h-full max-w-full"
          style={{ aspectRatio: `${ofis.en} / ${ofis.boy}` }}
        >
          <img
            src={ofis.gorsel}
            alt={`${ofis.ad} plan önizlemesi`}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {/* alan konturları — sırayla parlar (calisma → mutfak → wc → balkon) */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {ofis.alanlar.map(
              (a, i) =>
                a.poligon.length > 0 && (
                  <polygon
                    key={a.id}
                    points={pts(a.poligon)}
                    className="alan-parla"
                    fill="currentColor"
                    fillOpacity={0.09}
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    style={
                      {
                        color: a.renk,
                        '--parla-gecikme': `${i * 2 + sira * 0.5}s`,
                      } as CSSProperties
                    }
                  />
                ),
            )}
          </svg>
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between px-1 pb-1">
        <span className="text-sm font-semibold text-ink">{ofis.ad}</span>
        <span className="text-sm font-semibold tabular-nums text-brand">
          {ofis.genelBrut} m²
        </span>
      </div>
    </Link>
  )
}

/**
 * Anasayfa ofis vitrini — 7 kartlık kesintisiz kayan şerit (masaüstü + mobil).
 * WhyIdeal mobil marquee deseni referans: tek tip kart, sabit genişlik,
 * sağdan sola dikişsiz akış (içerik iki kez render + translateX(-50%) döngüsü),
 * kenarlarda yumuşak geçiş. Hover'da duraklar; kartlar /ofislerimiz'e gider.
 * IO ile yalnız görünürken akar; prefers-reduced-motion → statik 4+3 grid.
 */
export default function OfislerTeaser() {
  const ref = useRef<HTMLElement>(null)
  const setRef = useRef<HTMLDivElement>(null)
  const [reduce] = useState(reduceMotion)
  const [shown, setShown] = useState(false)
  const [gorunur, setGorunur] = useState(false)
  const [parla, setParla] = useState(false)
  const [sure, setSure] = useState(48)

  // görünürlük takibi — şerit yalnız görünürken akar (gizli sekme/scroll dışı → durur)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (e) => {
        const v = e[0].isIntersecting
        setGorunur(v)
        if (v) setShown(true)
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  // Madde 8: ilk açılışta hiçbir alan parlamaz — görünür olduktan ~1 sn sonra dalga başlar
  useEffect(() => {
    if (reduce || !gorunur) {
      setParla(false)
      return
    }
    const t = setTimeout(() => setParla(true), 1000)
    return () => clearTimeout(t)
  }, [gorunur, reduce])

  // akış süresi: set genişliği / sabit hız → her ekranda ~48 px/sn
  useEffect(() => {
    const set = setRef.current
    if (!set || reduce) return
    const olc = () => {
      const w = set.offsetWidth
      if (w > 0) setSure(w / AKIS_HIZI)
    }
    olc()
    const ro = new ResizeObserver(olc)
    ro.observe(set)
    return () => ro.disconnect()
  }, [reduce])

  const reveal = (i: number) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.6s ${EASE} ${i * 0.08}s, transform 0.7s ${EASE} ${i * 0.08}s`,
  })

  const seritSinif = 'flex items-stretch gap-4 pr-4 lg:gap-5 lg:pr-5'

  return (
    <section ref={ref} className="border-t border-line bg-section">
      <div className="mx-auto max-w-6xl px-5 pt-24">
        <div className="mx-auto max-w-2xl text-center" style={reveal(0)}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            Ofislerimiz
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Size uygun ofisi seçin
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            68–125 m² arasında yedi farklı plan. Her alanı adım adım keşfedin.
          </p>
        </div>
      </div>

      {reduce ? (
        /* hareket azaltılmış: akış yok — statik 4+3 grid */
        <div className="mx-auto mb-8 mt-12 grid max-w-6xl grid-cols-2 gap-4 px-5 lg:grid-cols-4 lg:gap-5">
          {OFISLER.map((o, i) => (
            <OfisKart key={o.id} ofis={o} sira={i} sinif="w-full" />
          ))}
        </div>
      ) : (
        <div
          className={`teaser-marquee relative mt-12 overflow-hidden${gorunur ? ' is-akan' : ''}${parla ? ' is-parla' : ''}`}
          style={{ '--teaser-sure': `${sure}s`, ...reveal(1) } as CSSProperties}
        >
          <div className="teaser-serit flex w-max pb-8 pt-2">
            <div ref={setRef} className={seritSinif}>
              {OFISLER.map((o, i) => (
                <OfisKart key={o.id} ofis={o} sira={i} sinif="w-60 shrink-0 sm:w-64" />
              ))}
            </div>
            {/* dikişsiz döngü için kopya set — odak ve tıklamaya kapalı */}
            <div inert aria-hidden="true" className={seritSinif}>
              {OFISLER.map((o, i) => (
                <OfisKart
                  key={`kopya-${o.id}`}
                  ofis={o}
                  sira={i + OFISLER.length}
                  sinif="w-60 shrink-0 sm:w-64"
                />
              ))}
            </div>
          </div>
          {/* kenarlarda yumuşak geçiş */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-section to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-section to-transparent sm:w-16" />
        </div>
      )}

      <div className="mx-auto max-w-6xl px-5 pb-24">
        <div className="mt-2 flex justify-center" style={reveal(2)}>
          <Link
            to="/ofislerimiz"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-semibold text-page shadow-[0_14px_28px_-10px_rgba(226,0,26,0.55)] transition-transform active:scale-[0.97]"
          >
            Ofisleri Keşfet
            <ArrowRight weight="bold" size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
