import { useEffect, useRef, useState } from 'react'
import { Buildings, Ruler, Stack, Car, type Icon as PhIcon } from '@phosphor-icons/react'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function reduceMotion() {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

type Stat = {
  Icon: PhIcon
  value: number | string // sayı → 0'dan sayar; metin (aralık) → iki uçtan sayar
  suffix?: string
  label: string
}

const STATS: Stat[] = [
  { Icon: Buildings, value: 102, label: 'Ofis' },
  { Icon: Ruler, value: '68–125', suffix: ' m²', label: 'Metrekare seçenekleri' },
  { Icon: Stack, value: 8, label: 'Katlı butik bina' },
  { Icon: Car, value: 3, label: 'Katlı otopark + vale' },
]

const COUNT_DUR = 1400 // ms — tüm sayaçlar aynı süre → aynı anda biter

/* 0'dan hedefe sayan tek rakam */
function Counter({ end, run }: { end: number; run: boolean }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    if (reduceMotion()) {
      setN(end)
      return
    }
    let raf = 0
    let start = 0
    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / COUNT_DUR)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * end))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, end])
  return <>{n}</>
}

/* "68–125" gibi aralığı iki uçtan aynı anda sayar */
function RangeCounter({ text, run }: { text: string; run: boolean }) {
  const [lo, hi] = text.split(/[–-]/).map((v) => parseInt(v, 10))
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  useEffect(() => {
    if (!run) return
    if (reduceMotion()) {
      setA(lo)
      setB(hi)
      return
    }
    let raf = 0
    let start = 0
    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / COUNT_DUR)
      const e = 1 - Math.pow(1 - p, 3)
      setA(Math.round(e * lo))
      setB(Math.round(e * hi))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, lo, hi])
  return (
    <>
      {a}–{b}
    </>
  )
}

/* etiketi harf harf yazan daktilo efekti (yer kaydırmadan) */
function Typewriter({
  text,
  run,
  delay,
  reduce,
}: {
  text: string
  run: boolean
  delay: number
  reduce: boolean
}) {
  if (reduce) return <>{text}</>
  return (
    <span aria-label={text}>
      {[...text].map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={
            run
              ? { animation: `charIn 0.06s ease ${(delay + i * 0.045).toFixed(3)}s both` }
              : { opacity: 0 }
          }
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}

export default function StatsBand() {
  const ref = useRef<HTMLElement>(null)
  const reduce = reduceMotion()
  const [shown, setShown] = useState(false)
  const [countRun, setCountRun] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      setShown(true)
      setCountRun(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true)
          window.setTimeout(() => setCountRun(true), 700) // çizgi+kart girişinden sonra saymaya başla
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  // giriş katmanları (sıra: çizgi → kart yüksel/ikon aç → sayı → daktilo)
  const headingFx = reduce ? undefined : shown ? { animation: `heroRise 0.6s ${EASE} 0s both` } : { opacity: 0 }
  const tickFx = reduce ? undefined : shown ? { animation: `heroLineDraw 0.5s ${EASE} 0s both` } : { transform: 'scaleX(0)' }
  const badgeFx = reduce ? undefined : shown ? { animation: `heroRise 0.6s ${EASE} 0.5s both` } : { opacity: 0 }
  const iconFx = reduce ? undefined : shown ? { animation: `statIconPop 0.75s ${EASE} 0.6s both` } : { opacity: 0, transform: 'scale(0)' }
  const numFx = reduce ? undefined : shown ? { animation: `heroRise 0.6s ${EASE} 0.55s both` } : { opacity: 0 }

  return (
    <section ref={ref} className="border-b border-line bg-page">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-12 text-center" style={headingFx}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Rakamlarla</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">Bir bakışta İdeal Ofis</h2>
        </div>

        <div className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center px-4 text-center ${
                i > 0 ? 'lg:border-l lg:border-line' : ''
              }`}
            >
              {/* rozet yükselir, ikon içinden ortadan büyür */}
              <span
                className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-brand/[0.06] ring-1 ring-brand/10"
                style={badgeFx}
              >
                <span className="flex" style={iconFx}>
                  <s.Icon weight="duotone" size={28} className="text-brand" />
                </span>
              </span>

              {/* rakam aşağıdan yükselir + 0'dan sayar (hepsi aynı anda biter) */}
              <p
                className="mt-4 text-3xl font-semibold tabular-nums text-ink sm:text-4xl"
                style={numFx}
              >
                {typeof s.value === 'number' ? (
                  <Counter end={s.value} run={countRun} />
                ) : (
                  <RangeCounter text={s.value} run={countRun} />
                )}
                {s.suffix ? <span className="text-xl font-medium text-muted">{s.suffix}</span> : null}
              </p>

              {/* çizgi: her şeyden ÖNCE soldan sağa açılır */}
              <span
                className="mt-3 h-0.5 w-8 origin-left rounded-full bg-brand"
                aria-hidden="true"
                style={tickFx}
              />

              {/* etiket: daktilo efekti */}
              <p className="mt-3 text-sm text-muted">
                <Typewriter text={s.label} run={shown} delay={0.85} reduce={reduce} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
