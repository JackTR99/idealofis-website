import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { OFISLER } from '../data/ofisler'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * Anasayfa ofis vitrini — "heyecan yarat, tüketme": tip + m² + nefes alan
 * tek nokta. Oyunun tamamı Ofislerimiz sayfasında.
 */
export default function OfislerTeaser() {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const reveal = (i: number) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.6s ${EASE} ${i * 0.08}s, transform 0.7s ${EASE} ${i * 0.08}s`,
  })

  return (
    <section ref={ref} className="border-t border-line bg-section">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="mx-auto max-w-2xl text-center" style={reveal(0)}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            Ofislerimiz
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Size uygun ofisi seçin
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            68–125 m² arasında dört farklı plan. Her alanı adım adım keşfedin.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {OFISLER.map((o, i) => {
            const pembe = o.alanlar.find((a) => a.id === 'calisma')
            return (
              <Link
                key={o.id}
                to="/ofislerimiz"
                style={reveal(1 + i)}
                className="group rounded-[24px] bg-surface p-4 shadow-[0_1px_2px_rgba(20,20,20,0.04),0_18px_40px_-24px_rgba(20,20,20,0.16)] ring-1 ring-black/[0.04] transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(20,20,20,0.04),0_32px_64px_-28px_rgba(20,20,20,0.3)]"
              >
                <div className="relative" style={{ aspectRatio: '1 / 1' }}>
                  <img
                    src={o.gorsel}
                    alt={`${o.ad} plan önizlemesi`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  {pembe && (
                    <span
                      className="ofis-dot absolute block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white/90"
                      style={{
                        left: `${pembe.nokta.x}%`,
                        top: `${pembe.nokta.y}%`,
                        backgroundColor: pembe.renk,
                        color: pembe.renk,
                      }}
                    />
                  )}
                </div>
                <div className="mt-3 flex items-baseline justify-between px-1 pb-1">
                  <span className="text-sm font-semibold text-ink">{o.ad}</span>
                  <span className="text-sm font-semibold tabular-nums text-brand">
                    {o.genelBrut} m²
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 flex justify-center" style={reveal(5)}>
          <Link
            to="/ofislerimiz"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-10px_rgba(226,0,26,0.55)] transition-transform active:scale-[0.97]"
          >
            Ofisleri Keşfet
            <ArrowRight weight="bold" size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
