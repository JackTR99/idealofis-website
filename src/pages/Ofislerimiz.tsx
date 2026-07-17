import { useMemo, useState } from 'react'
import { OFISLER, type AlanId, type Ofis } from '../data/ofisler'

/**
 * İnteraktif plan gezgini: ofis tipi seç → kuşbakışı planda alanları keşfet.
 * Seçilen alan spot ışığında kalır, planın kalanı kararır; ölçüler yanda.
 * Poligon verisi yoksa nokta çevresinde dairesel spot kullanılır (yedek yol).
 */

const pts = (p: { x: number; y: number }[]) => p.map((v) => `${v.x},${v.y}`).join(' ')

function Sahne({ ofis, aktif, setHover, setSabit }: {
  ofis: Ofis
  aktif: AlanId | null
  setHover: (a: AlanId | null) => void
  setSabit: (a: AlanId | null) => void
}) {
  const alan = ofis.alanlar.find((a) => a.id === aktif) ?? null
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-surface p-3 shadow-[0_1px_2px_rgba(20,20,20,0.04),0_18px_40px_-24px_rgba(20,20,20,0.16)] ring-1 ring-black/[0.04] sm:p-5">
      <div className="relative" style={{ aspectRatio: `${ofis.en} / ${ofis.boy}` }}>
        <img
          src={ofis.gorsel}
          alt={`${ofis.ad} kuşbakışı plan`}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {/* karartma + seçili alan spotu */}
          <defs>
            <mask id={`spot-${ofis.id}`}>
              <rect x="-2" y="-2" width="104" height="104" fill="#fff" />
              {alan &&
                (alan.poligon.length ? (
                  <polygon points={pts(alan.poligon)} fill="#000" />
                ) : (
                  <ellipse cx={alan.nokta.x} cy={alan.nokta.y} rx="14" ry="11" fill="#000" />
                ))}
            </mask>
          </defs>
          <rect
            x="-2"
            y="-2"
            width="104"
            height="104"
            fill="rgba(20,20,20,0.55)"
            mask={`url(#spot-${ofis.id})`}
            className="transition-opacity duration-300"
            style={{ opacity: alan ? 1 : 0, pointerEvents: 'none' }}
          />
          {/* seçili alanın konturu */}
          {alan &&
            (alan.poligon.length ? (
              <polygon
                points={pts(alan.poligon)}
                fill="none"
                stroke={alan.renk}
                strokeWidth="0.6"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{ pointerEvents: 'none', strokeWidth: 2.5 }}
              />
            ) : (
              <ellipse
                cx={alan.nokta.x}
                cy={alan.nokta.y}
                rx="14"
                ry="11"
                fill="none"
                stroke={alan.renk}
                vectorEffect="non-scaling-stroke"
                style={{ pointerEvents: 'none', strokeWidth: 2.5 }}
              />
            ))}
          {/* görünmez oda yüzeyleri: hover/tıklama alanı */}
          {ofis.alanlar.map(
            (a) =>
              a.poligon.length > 0 && (
                <polygon
                  key={a.id}
                  points={pts(a.poligon)}
                  fill="rgba(0,0,0,0)"
                  className="cursor-pointer"
                  onMouseEnter={() => setHover(a.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setSabit(aktif === a.id ? null : a.id)}
                />
              ),
          )}
        </svg>
        {/* alan noktaları */}
        {ofis.alanlar.map((a) => (
          <button
            key={a.id}
            type="button"
            aria-label={`${a.ad} — ${a.m2} m²`}
            onMouseEnter={() => setHover(a.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => setSabit(aktif === a.id ? null : a.id)}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${a.nokta.x}%`, top: `${a.nokta.y}%` }}
          >
            {/* kubbe nokta: color=alan rengi → nabız halkası (currentColor) alan renginde */}
            <span
              className={`ofis-dot ofis-kubbe block rounded-full ring-2 ring-white/90 transition-[width,height,box-shadow,filter] duration-300${
                aktif === a.id ? ' ofis-kubbe--secili' : ''
              }`}
              style={{
                backgroundColor: a.renk,
                color: a.renk,
                width: aktif === a.id ? 18 : 13,
                height: aktif === a.id ? 18 : 13,
                boxShadow:
                  aktif === a.id
                    ? `0 0 0 5px ${a.renk}40, 0 0 18px 4px ${a.renk}59, 0 2px 8px rgba(0,0,0,0.35)`
                    : `0 0 0 4px ${a.renk}33, 0 2px 8px rgba(0,0,0,0.35)`,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Ofislerimiz() {
  const [secili, setSecili] = useState(0)
  const [sabit, setSabit] = useState<AlanId | null>(null)
  const [hover, setHover] = useState<AlanId | null>(null)
  const ofis = OFISLER[secili]
  const aktif = hover ?? sabit
  const alanlar = useMemo(() => ofis.alanlar, [ofis])

  return (
    <section className="bg-page">
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-36">
        {/* başlık */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            Ofislerimiz
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Size uygun ofisi seçin
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Plan üzerindeki noktalara dokunun; alanlar ve metrekareler canlansın.
          </p>
        </div>

        {/* tip seçici */}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {OFISLER.map((o, i) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setSecili(i)
                setSabit(null)
                setHover(null)
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                i === secili
                  ? 'bg-brand text-white shadow-[0_10px_22px_-10px_rgba(226,0,26,0.55)]'
                  : 'bg-surface text-ink ring-1 ring-line hover:bg-white'
              }`}
            >
              {o.ad}
              <span className={`ml-2 text-xs font-medium ${i === secili ? 'text-white/80' : 'text-muted'}`}>
                {o.genelBrut} m²
              </span>
            </button>
          ))}
        </div>

        {/* sahne + panel */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-start">
          <Sahne ofis={ofis} aktif={aktif} setHover={setHover} setSabit={setSabit} />

          <div className="rounded-[28px] bg-surface p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04),0_18px_40px_-24px_rgba(20,20,20,0.16)] ring-1 ring-black/[0.04] sm:p-7">
            <h2 className="text-lg font-semibold text-ink">{ofis.ad} — Alanlar</h2>
            <ul className="mt-4 flex flex-col gap-1.5">
              {alanlar.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setHover(a.id)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setSabit(sabit === a.id ? null : a.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${
                      aktif === a.id ? 'bg-[rgba(20,20,20,0.05)]' : 'hover:bg-[rgba(20,20,20,0.03)]'
                    }`}
                  >
                    <span
                      className="ofis-kubbe h-3 w-3 shrink-0 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: a.renk, boxShadow: `0 0 0 3px ${a.renk}26` }}
                    />
                    <span className="flex-1 text-sm font-medium text-ink">{a.ad}</span>
                    <span className="text-sm font-semibold tabular-nums text-ink">
                      {a.m2} m²
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-line pt-5">
              {[
                ['Net', ofis.net],
                ['Brüt', ofis.brut],
                ['Genel Brüt', ofis.genelBrut],
              ].map(([ad, deger]) => (
                <div key={ad} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-muted">{ad}</span>
                  <span
                    className={`tabular-nums ${
                      ad === 'Genel Brüt'
                        ? 'text-base font-semibold text-brand'
                        : 'text-sm font-semibold text-ink'
                    }`}
                  >
                    {deger} m²
                  </span>
                </div>
              ))}
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Ölçüler katalog verileridir; bilgi amaçlıdır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
