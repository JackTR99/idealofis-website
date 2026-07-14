import { useEffect, useRef, useState } from 'react'
import { Bank, Train, TrainRegional, type Icon as PhIcon } from '@phosphor-icons/react'

function reduceMotion() {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

// örümcek ağı hatları — ofis pininden POI'lere; işaretçiyle aynı sırada uzar
const HATLAR = [
  { x: 28.3, y: 63.3, delay: 450 }, // Adalet Sarayı
  { x: 60.4, y: 70.5, delay: 800 }, // Sanayi Metro
  { x: 17.9, y: 61.5, delay: 800 }, // İzban Salhane
]

// POI işaretçileri — koordinatlar haritanın kendi yüzdesi (1500px kare)
const POI = [
  { Icon: Bank, label: 'Adalet Sarayı', dist: '400 m', x: 28.3, y: 63.3, dir: 'tr', delay: 530 },
  { Icon: Train, label: 'Sanayi Metro', dist: '550 m', x: 60.4, y: 70.5, dir: 'br', delay: 880 },
  {
    Icon: TrainRegional,
    label: 'İzban Salhane',
    dist: '1,1 km',
    x: 17.9,
    y: 61.5,
    dir: 'bl',
    delay: 880,
  },
] as const

/** Mesafe çipi görünürlüğü — sınıf adına değil, bu prop'a bakılır.
 *  true     → her ekranda görünür (varsayılan)
 *  false    → hiç basılmaz
 *  'smUstu' → <sm'de gizli (dar kartta çip kart dışına taşıp kesiliyordu) */
export type CipModu = boolean | 'smUstu'

// haritada gerçek konum: kırmızı nokta + yönlü mesafe çipi
// hep=false → kapsayıcı group hover'ında sırayla belirir (anasayfa davranışı)
// hep=true  → "acik" true olduğunda bir kez oynar ve görünür kalır
function Marker({
  Icon,
  label,
  dist,
  x,
  y,
  dir,
  delay,
  hep,
  acik,
  cip,
}: {
  Icon: PhIcon
  label: string
  dist: string
  x: number // konum, kapsayıcıya göre %
  y: number
  dir: 'tl' | 'tr' | 'bl' | 'br' // çipin noktaya göre açıldığı yön
  delay: number // ms — nokta bu anda, çip +120ms sonra belirir
  hep: boolean
  acik: boolean
  cip: CipModu
}) {
  const chipPos = {
    tl: 'bottom-2 right-1.5',
    tr: 'bottom-2 left-1.5',
    bl: 'top-2 right-1.5',
    br: 'top-2 left-1.5',
  }[dir]
  const chipKapali = `opacity-0 ${dir.startsWith('t') ? 'translate-y-1' : '-translate-y-1'}`
  return (
    <div className="absolute z-10" style={{ left: `${x}%`, top: `${y}%` }}>
      {/* gerçek nokta */}
      <span
        className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand ring-4 ring-brand/25 transition-all duration-300 ${
          hep
            ? acik
              ? 'scale-100 opacity-100'
              : 'scale-50 opacity-0'
            : 'scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      />
      {/* mesafe çipi (kompakt) — cip=false ise hiç basılmaz */}
      {cip !== false && (
        <div
          className={`absolute ${chipPos} ${
            cip === 'smUstu' ? 'max-sm:hidden ' : ''
          }flex w-max items-center gap-1 rounded-lg bg-white/95 px-2 py-1 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)] backdrop-blur transition-all duration-[400ms] ${
            hep
              ? acik
                ? 'translate-y-0 opacity-100'
                : chipKapali
              : `${chipKapali} group-hover:translate-y-0 group-hover:opacity-100`
          }`}
          style={{ transitionDelay: `${delay + 120}ms` }}
        >
          <Icon weight="duotone" size={13} className="shrink-0 text-brand" />
          <div className="leading-tight">
            <p className="whitespace-nowrap text-[10px] font-semibold text-ink">{label}</p>
            <p className="text-[9px] text-muted">{dist}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Lokasyon haritası sahnesi: kapsayıcıyı örten KARE katman (1500x1500 görselle 1:1).
// İşaretçi yüzdeleri haritanın kendi karesine kilitlenir → her ekran boyutunda doğru nokta.
// hep=false → yalnızca kapsayıcı group'a hover olunca belirir (anasayfa kartı).
// hep=true  → görünür alana girince bir kez oynar, sonra hep açık kalır (iç sayfa).
// cipler    → mesafe çiplerinin görünürlüğü (bkz. CipModu). Çağıran sayfa BU PROP'la karar verir;
//             dışarıdan yardımcı sınıf adına ([&_.backdrop-blur] gibi) bağlanmak YASAK — sınıf adı
//             değişince çipler sessizce geri gelir.
export default function LokasyonHarita({
  hep = false,
  cipler = true,
  className = '',
}: {
  hep?: boolean
  cipler?: CipModu
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [side, setSide] = useState(0)
  // hareket azaltma tercihinde animasyon yok → doğrudan açık başla
  const [acik, setAcik] = useState(() => hep && reduceMotion())

  // kare sahne ölçüsü
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setSide(Math.max(r.width, r.height))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // hep=true → görünür alana girince bir kez aç.
  // IntersectionObserver'ın çalışmadığı ortamlarda (ör. sekme gizli sayıldığında) harita
  // hiç açılmasın diye kaydırma/boyut olaylarıyla elle görünürlük kontrolü de yapılır.
  useEffect(() => {
    if (!hep || acik) return
    const el = ref.current
    if (!el) return

    const gorunurMu = () => {
      const r = el.getBoundingClientRect()
      if (r.height === 0) return false
      const gorunenYukseklik = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)
      return gorunenYukseklik > r.height * 0.2
    }
    const kontrol = () => {
      if (gorunurMu()) {
        setAcik(true)
        temizle()
      }
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAcik(true)
          temizle()
        }
      },
      { threshold: 0.2 },
    )
    const temizle = () => {
      io.disconnect()
      window.removeEventListener('scroll', kontrol)
      window.removeEventListener('resize', kontrol)
    }
    io.observe(el)
    window.addEventListener('scroll', kontrol, { passive: true })
    window.addEventListener('resize', kontrol)
    kontrol()
    return temizle
  }, [hep, acik])

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] duration-700 ease-out ${
          hep
            ? acik
              ? 'scale-100 opacity-100'
              : 'scale-[1.08] opacity-0'
            : 'scale-[1.08] opacity-0 group-hover:scale-100 group-hover:opacity-100'
        }`}
        style={side ? { width: side, height: side } : { width: '100%', height: '100%' }}
      >
        <img
          src="/images/why/harita.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {/* örümcek ağı: ofisten POI'lere noktalı hatlar */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          {HATLAR.map((t) => (
            <line
              key={`${t.x}-${t.y}`}
              x1={49}
              y1={63.9}
              x2={t.x}
              y2={t.y}
              stroke="var(--color-brand)"
              strokeWidth={0.3}
              strokeDasharray="0.05 1.1"
              strokeLinecap="round"
              className={`transition-[scale,opacity] duration-500 ease-out ${
                hep
                  ? acik
                    ? 'scale-100 opacity-60'
                    : 'scale-0 opacity-0'
                  : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-60'
              }`}
              style={{
                transitionDelay: `${t.delay}ms`,
                transformOrigin: '49px 63.9px',
                transformBox: 'view-box',
              }}
            />
          ))}
        </svg>
        {/* İdeal Ofis pini — Ankara Asfaltı kuzey kenarı (Manda Çayı kavşağı ile Alija ayrımı arası) */}
        <div className="absolute z-20" style={{ left: '49%', top: '63.9%' }}>
          <div
            className={`absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center transition-all delay-150 duration-500 ease-out ${
              hep
                ? acik
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-1 opacity-0'
                : 'translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand shadow-[0_10px_24px_-6px_rgba(226,0,26,0.6)] ring-1 ring-white/40">
              <img src="/building-mark-white.png" alt="İdeal Ofis konumu" className="h-7 w-7" />
            </div>
            <span className="-mt-[5px] h-2.5 w-2.5 rotate-45 rounded-[2px] bg-brand shadow-[0_4px_8px_rgba(226,0,26,0.35)]" />
          </div>
        </div>
        {/* POI işaretçileri — sıra: ofis → adliye → metro + izban */}
        {POI.map((p) => (
          <Marker
            key={p.label}
            Icon={p.Icon}
            label={p.label}
            dist={p.dist}
            x={p.x}
            y={p.y}
            dir={p.dir}
            delay={p.delay}
            hep={hep}
            acik={acik}
            cip={cipler}
          />
        ))}
      </div>
    </div>
  )
}
