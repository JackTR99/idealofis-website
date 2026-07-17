import { useEffect, useRef, useState } from 'react'
import { Bank, Train, TrainRegional, type Icon as PhIcon } from '@phosphor-icons/react'
import { MESAFE } from '../data/mesafeler'

function reduceMotion() {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

/* ── KOORDİNAT UZAYI ────────────────────────────────────────────────────────
   Tüm x/y değerleri harita-kare.jpg'nin (1232x1232) yüzdesidir. Bu görsel,
   orijinal harita.jpg'nin (1300 kare, altına Google atıf bandı baskılı)
   BANTSIZ türevidir: bant satırları (y ≥ 1232) ve kare kalsın diye sağdan
   aynı miktar kırpıldı; eski koordinatlar 1300/1232 çarpanıyla taşındı.
   Atıf artık dokuda değil, karta sabit HTML katmanında (aşağıda) — böylece
   hangi kadraj/oran olursa olsun kırpılamaz (hukuki şart, Kaan kararı).

   Sahne, kare görselle 1:1 aynı uzayda yaşayan kare bir katmandır:
   kenarı max(100cqw, 100cqh) → kartı her zaman örter (object-cover mantığını
   kapsayıcı üstlenir), işaretçiler ve görsel AYNI karede kalır → kayma imkânsız.
   Dikeyde ALT kenara demirli (POI kümesi %64-75 bandında, alt kompozisyon doğal);
   yatayda taşma %35/%65 bölünür: dikey (boy > en) kartta hem İzban (sol kıyı)
   hem Sanayi (sağ) kadrajda kalır — anasayfa masaüstü kartı 327x516 ölçüldü. */

// İdeal Ofis pini — Ankara Asfaltı kuzey kenarı (Manda Çayı kavşağı / Alija ayrımı arası)
const PIN = { x: 51.7, y: 67.43 }

// örümcek ağı hatları — ofis pininden POI'lere; işaretçiyle aynı sırada uzar
const HATLAR = [
  { x: 29.86, y: 66.79, delay: 450 }, // Adalet Sarayı
  { x: 63.73, y: 74.39, delay: 800 }, // Sanayi Metro
  { x: 18.89, y: 64.89, delay: 800 }, // İzban Salhane
]

/* POI işaretçileri — ad ve mesafe metinleri TEK KAYNAKTAN (src/data/mesafeler.ts)
   okunur, elle yazılmaz.

   cipDar: 580px'ten DAR kaplarda (anasayfa kartı, mobil kartlar) çip düzeni.
   Ölçülen kusurlar: İzban çipi soldan 44-108px kesiliyordu; Adalet çipi pinin
   altında eziliyordu (nokta-pin arası < çip genişliği; sınır tam ~580px).
   Dar düzen basamaklı yığındır (çakışmalar ölçülerek doğrulandı):
   İzban sağ-alt → Adalet sağ-alt (daha aşağı) → Sanayi sol-alt (en aşağı). */
const POI = [
  {
    Icon: Bank,
    label: MESAFE.adliye.ad,
    dist: MESAFE.adliye.mesafeEtiket,
    x: 29.86,
    y: 66.79,
    dir: 'tr',
    delay: 530,
    cipDar: '@max-[580px]:bottom-auto @max-[580px]:top-9',
  },
  {
    Icon: Train,
    label: MESAFE.metro.ad,
    dist: MESAFE.metro.mesafeEtiket,
    x: 63.73,
    y: 74.39,
    dir: 'br',
    delay: 880,
    cipDar: '@max-[580px]:left-auto @max-[580px]:right-1.5 @max-[580px]:top-12',
  },
  {
    Icon: TrainRegional,
    label: MESAFE.izban.ad,
    dist: MESAFE.izban.mesafeEtiket,
    x: 18.89,
    y: 64.89,
    dir: 'bl',
    delay: 880,
    cipDar: '@max-[580px]:right-auto @max-[580px]:left-1.5',
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
  cipDar,
}: {
  Icon: PhIcon
  label: string
  dist: string
  x: number // konum, kare sahneye (= görsele) göre %
  y: number
  dir: 'tl' | 'tr' | 'bl' | 'br' // çipin noktaya göre açıldığı yön
  delay: number // ms — nokta bu anda, çip +120ms sonra belirir
  hep: boolean
  acik: boolean
  cip: CipModu
  cipDar: string // dar kapta yatay yön düzeltme sınıfları ('' = gerekmez)
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
          className={`absolute ${chipPos} ${cipDar} ${
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

// Lokasyon haritası sahnesi: kapsayıcıyı örten KARE katman (1232x1232 görselle 1:1).
// İşaretçi yüzdeleri haritanın kendi karesine kilitlenir → her ekran boyutunda doğru nokta.
// Boyut tamamen CSS'te (container query birimleri) — JS/ResizeObserver gecikmesi yok.
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
  // hareket azaltma tercihinde animasyon yok → doğrudan açık başla
  const [acik, setAcik] = useState(() => hep && reduceMotion())

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

  // sahne ve atıf katmanı aynı görünürlük kuralını paylaşır
  const acilirOpaklik = hep
    ? acik
      ? 'opacity-100'
      : 'opacity-0'
    : 'opacity-0 group-hover:opacity-100'

  return (
    <div
      ref={ref}
      className={`absolute inset-0 overflow-hidden [container-type:size] ${className}`}
    >
      <div
        className={`absolute bottom-0 aspect-square transition-[opacity,scale] duration-700 ease-out ${
          hep ? (acik ? 'scale-100' : 'scale-[1.08]') : 'scale-[1.08] group-hover:scale-100'
        } ${acilirOpaklik}`}
        style={{
          // kare sahne kartı her zaman örter; dikeyde alta demirli,
          // yatay taşma %35 sol / %65 sağ bölünür (bkz. üstteki kadraj notu)
          width: 'max(100cqw, 100cqh)',
          left: 'calc((100cqw - max(100cqw, 100cqh)) * 0.35)',
        }}
      >
        <img
          src="/images/why/harita-kare.jpg"
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
              x1={PIN.x}
              y1={PIN.y}
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
                transformOrigin: `${PIN.x}px ${PIN.y}px`,
                transformBox: 'view-box',
              }}
            />
          ))}
        </svg>
        {/* İdeal Ofis pini */}
        <div className="absolute z-20" style={{ left: `${PIN.x}%`, top: `${PIN.y}%` }}>
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
            cipDar={p.cipDar}
          />
        ))}
      </div>
      {/* Google atıf katmanı — SAHNEYE değil KARTA sabit: hiçbir kadrajda kırpılmaz
          (hukuki şart, Kaan kararı). Doku bantsız türev olduğu için çift bant oluşmaz.
          Görünürlüğü sahneyle birebir aynı kurala bağlı (anasayfada fotoğrafın üstüne binmesin).
          Sağ/alt pay (pr-2.5 pb-2) soldan bilerek geniş: anasayfa kartının ~28px köşe
          yayında "Terms"in ucu yaya değmesin (pr-2/pb-1.5 ile ucu ~1-2px değiyordu). */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-3 pb-2 pl-1.5 pr-2.5 transition-opacity duration-700 ${acilirOpaklik}`}
      >
        <img src="/images/why/google-atif.png" alt="" className="h-4 w-auto" />
        <p className="text-[9px] leading-none text-[#5f6368] [text-shadow:0_0_2px_#fff,0_0_2px_#fff,0_0_3px_#fff]">
          Map data ©2026 · Terms
        </p>
      </div>
    </div>
  )
}
