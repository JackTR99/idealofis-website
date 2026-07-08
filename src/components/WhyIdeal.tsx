import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Buildings,
  Leaf,
  Star,
  ShieldCheck,
  TrendUp,
  Car,
  UsersThree,
  Armchair,
  Headset,
  Printer,
  Bank,
  ArrowRight,
  type Icon as PhIcon,
} from '@phosphor-icons/react'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function reduceMotion() {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

// ortak kart kabuğu — beyaz, yumuşak gölge; hover'da yükselir + gölge derinleşir
const CARD =
  'group relative overflow-hidden rounded-[28px] bg-surface ring-1 ring-black/[0.04] ' +
  'shadow-[0_1px_2px_rgba(20,20,20,0.04),0_18px_40px_-24px_rgba(20,20,20,0.16)] ' +
  'transition-[transform,box-shadow] duration-500 ' +
  'hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(20,20,20,0.04),0_36px_72px_-28px_rgba(20,20,20,0.34)]'

const IMG = 'h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]'

function IconBadge({ Icon, className = '' }: { Icon: PhIcon; className?: string }) {
  return (
    <span
      className={
        'flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/[0.06] ring-1 ring-brand/10 ' +
        'transition-transform duration-500 group-hover:scale-110 ' +
        className
      }
    >
      <Icon weight="duotone" size={26} className="text-brand" />
    </span>
  )
}

function Num({ children }: { children: ReactNode }) {
  return <span className="text-sm font-semibold tracking-[0.14em] text-brand">{children}</span>
}

function Cta({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
    >
      {children}
      <ArrowRight weight="bold" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  )
}

// harita sahnesi: kapsayıcıyı örten KARE katman (1500x1500 görselle 1:1).
// İşaretçi yüzdeleri haritanın kendi karesine kilitlenir → her ekran boyutunda doğru nokta.
function MapStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [side, setSide] = useState(0)
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
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.08] opacity-0 transition-[opacity,scale] duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
        style={side ? { width: side, height: side } : { width: '100%', height: '100%' }}
      >
        {children}
      </div>
    </div>
  )
}

// haritada gerçek konum: kırmızı nokta + yönlü mesafe çipi (hover'da belirir)
function Marker({
  Icon,
  label,
  dist,
  x,
  y,
  dir,
  delay,
}: {
  Icon: PhIcon
  label: string
  dist: string
  x: number // konum, kapsayıcıya göre %
  y: number
  dir: 'tl' | 'tr' | 'bl' | 'br' // çipin noktaya göre açıldığı yön
  delay: string
}) {
  const chipPos = {
    tl: 'bottom-2 right-1.5',
    tr: 'bottom-2 left-1.5',
    bl: 'top-2 right-1.5',
    br: 'top-2 left-1.5',
  }[dir]
  return (
    <div className="absolute z-10" style={{ left: `${x}%`, top: `${y}%` }}>
      {/* gerçek nokta */}
      <span className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 scale-50 rounded-full bg-brand opacity-0 ring-4 ring-brand/25 transition-all delay-150 duration-300 group-hover:scale-100 group-hover:opacity-100" />
      {/* mesafe çipi (kompakt) */}
      <div
        className={`absolute ${chipPos} flex w-max items-center gap-1 rounded-lg bg-white/95 px-2 py-1 opacity-0 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)] backdrop-blur transition-all duration-[400ms] group-hover:translate-y-0 group-hover:opacity-100 ${
          dir.startsWith('t') ? 'translate-y-1' : '-translate-y-1'
        }`}
        style={{ transitionDelay: delay }}
      >
        <Icon weight="duotone" size={13} className="shrink-0 text-brand" />
        <div className="leading-tight">
          <p className="whitespace-nowrap text-[10px] font-semibold text-ink">{label}</p>
          <p className="text-[9px] text-muted">{dist}</p>
        </div>
      </div>
    </div>
  )
}

// yatay küçük kart (metin sol + foto sağ)
function PhotoCard({
  Icon,
  num,
  title,
  text,
  img,
  alt,
  iconClass = '',
}: {
  Icon: PhIcon
  num: string
  title: string
  text: string
  img: string
  alt: string
  iconClass?: string
}) {
  return (
    <article className={`${CARD} flex h-full flex-col lg:flex-row`}>
      <div className="flex flex-col justify-center p-6 lg:w-[52%]">
        <IconBadge Icon={Icon} className={iconClass} />
        <div className="mt-3">
          <Num>{num}</Num>
          <h3 className="mt-1 text-xl font-semibold text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
        </div>
      </div>
      <div className="relative min-h-[190px] flex-1 overflow-hidden">
        <img src={img} alt={alt} loading="lazy" className={IMG} />
      </div>
    </article>
  )
}

export default function WhyIdeal() {
  const ref = useRef<HTMLElement>(null)
  const reduce = reduceMotion()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  const reveal = (i: number) =>
    reduce
      ? undefined
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0)' : 'translateY(26px)',
          transition: `opacity 0.6s ${EASE} ${i * 0.08}s, transform 0.7s ${EASE} ${i * 0.08}s`,
        }

  return (
    <section ref={ref} className="bg-page">
      <div className="mx-auto max-w-6xl px-5 pb-36 pt-28">
        {/* başlık + slogan + kırmızı çizgi */}
        <div className="mx-auto max-w-2xl text-center" style={reveal(0)}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            Neden İdeal Ofis?
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Her detay, daha verimli ve prestijli bir iş hayatı için tasarlandı.
          </h2>
          <p className="mt-5 text-base italic leading-relaxed text-muted">
            İyi bir ofis yalnızca çalışılan yer değildir; markanızın, ekibinizin ve geleceğinizin
            temsilidir.
          </p>
          <span className="mx-auto mt-8 block h-1 w-14 rounded-full bg-brand" />
        </div>

        {/* BANT 1: büyük sol (lokasyon) + sağda 2 küçük */}
        <div className="mt-20 grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr]">
          {/* 01 — Şehrin Kalbinde (BÜYÜK) */}
          <article className={`${CARD} flex flex-col lg:flex-row`} style={reveal(1)}>
            <div className="flex flex-col justify-center p-8 lg:w-[46%]">
              <IconBadge Icon={MapPin} />
              <div className="mt-4">
                <Num>01</Num>
                <h3 className="mt-1 text-2xl font-semibold leading-snug text-ink">
                  Şehrin Kalbinde,<br className="hidden sm:block" /> İşin Merkezinde.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                  Bayraklı’nın yükselen finans ve ticaret bölgesinde; adliye, ulaşım ağları ve iş
                  merkezlerine dakikalar uzaklıkta.
                </p>
                <Cta to="/iletisim">Lokasyonu Keşfet</Cta>
              </div>
            </div>
            <div className="relative min-h-[300px] flex-1 overflow-hidden bg-section">
              {/* varsayılan: bina fotoğrafı — hover'da haritaya döner */}
              <img
                src="/images/why/lokasyon.jpg"
                alt="İdeal Ofis konumu — Bayraklı, İzmir"
                loading="lazy"
                className="h-full w-full object-cover transition-opacity duration-500 ease-out group-hover:opacity-0"
              />
              {/* harita sahnesi: işaretçiler haritanın kendi karesine kilitli */}
              <MapStage>
                <img
                  src="/images/why/harita.jpg"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {/* İdeal Ofis pini — Ankara Asfaltı kuzey kenarı (Manda Çayı kavşağı ile Alija ayrımı arası) */}
                <div className="absolute z-20" style={{ left: '50.8%', top: '63.7%' }}>
                  <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-1 flex-col items-center opacity-0 transition-all delay-150 duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand shadow-[0_10px_24px_-6px_rgba(226,0,26,0.6)] ring-1 ring-white/40">
                      <img src="/building-mark-white.png" alt="İdeal Ofis konumu" className="h-6 w-auto" />
                    </div>
                    <span className="-mt-[5px] h-2.5 w-2.5 rotate-45 rounded-[2px] bg-brand shadow-[0_4px_8px_rgba(226,0,26,0.35)]" />
                  </div>
                </div>
                {/* POI işaretçileri — koordinatlar haritanın kendi yüzdesi (1500px kare) */}
                <Marker Icon={Bank} label="Adalet Sarayı" dist="400 m" x={28.3} y={63.3} dir="tr" delay="200ms" />
              </MapStage>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent transition-opacity duration-500 group-hover:opacity-0" />
            </div>
          </article>

          {/* sağ sütun: 02 + 03 */}
          <div className="flex flex-col gap-5">
            <div className="lg:h-[15.5rem]" style={reveal(2)}>
              <PhotoCard
                Icon={Buildings}
                num="02"
                title="A+ Mimari"
                text="68–125 m² arasında değişen esnek planlar, yüksek tavanlar ve modern mimari ile verimli çalışma alanları."
                img="/images/why/ofis.jpg"
                alt="İdeal Ofis modern ofis içi"
              />
            </div>
            <div className="lg:h-[15.5rem]" style={reveal(3)}>
              <PhotoCard
                Icon={Leaf}
                num="03"
                title="Nefes Alan Ofisler"
                text="Açılabilir balkonlar ve doğal havalandırma ile gün boyu ferah ve sağlıklı bir çalışma deneyimi."
                img="/images/why/balkon.jpg"
                alt="İdeal Ofis yeşil balkon ve iç bahçe"
                iconClass="[&_svg]:origin-bottom [&_svg]:transition-transform [&_svg]:duration-700 group-hover:[&_svg]:-rotate-[10deg]"
              />
            </div>
          </div>
        </div>

        {/* BANT 2: büyük sol (ayrıcalıklar) + 2 küçük sağ */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.7fr_1fr_1fr]">
          {/* 04 — Ayrıcalıklı Hizmetler (BÜYÜK) */}
          <article className={`${CARD} flex flex-col`} style={reveal(4)}>
            <div className="flex flex-1 flex-col lg:flex-row">
              <div className="flex flex-col justify-center p-7 lg:w-[48%]">
                <IconBadge Icon={Star} />
                <h3 className="mt-4 text-2xl font-semibold leading-snug text-ink">
                  İşinizi Kolaylaştıran Ayrıcalıklar
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Prestiji ve konforu bir araya getiren hizmetler, işinizi daha kolay ve verimli hale
                  getirir.
                </p>
              </div>
              <div className="relative min-h-[180px] flex-1 overflow-hidden">
                <img src="/images/why/lobby.jpg" alt="İdeal Ofis lobi ve resepsiyon" loading="lazy" className={IMG} />
              </div>
            </div>
            {/* hizmet barı */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line px-8 py-5">
              {[
                { Icon: Car, label: 'Vale Hizmeti' },
                { Icon: UsersThree, label: 'Toplantı Salonları' },
                { Icon: Armchair, label: 'Lobby & Resepsiyon' },
                { Icon: Headset, label: 'Ortak Sekreterya' },
                { Icon: Printer, label: 'Copy Center' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <s.Icon weight="duotone" size={20} className="text-brand" />
                  <span className="text-xs font-medium text-ink">{s.label}</span>
                </div>
              ))}
            </div>
          </article>

          {/* 05 — Güvenlik (üstte modern çalışma ortamı fotoğrafı) */}
          <article className={`${CARD} flex flex-col`} style={reveal(5)}>
            <div className="relative h-40 shrink-0 overflow-hidden">
              <img
                src="/images/why/calisma.jpg"
                alt="İdeal Ofis modern çalışma ortamı"
                loading="lazy"
                className={IMG}
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-7 pt-6">
              <div className="flex items-start gap-4">
                <IconBadge
                  Icon={ShieldCheck}
                  className="shrink-0 [&_svg]:transition-[filter] [&_svg]:duration-500 group-hover:[&_svg]:drop-shadow-[0_0_10px_rgba(226,0,26,0.6)]"
                />
                <div>
                  <Num>05</Num>
                  <h3 className="mt-0.5 text-xl font-semibold text-ink">7/24 Güvende</h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Kontrollü giriş-çıkış, kamera sistemi, intercom ve yangın güvenlik altyapısı ile her
                zaman güvendesiniz.
              </p>
              <Cta to="/neden-ideal">Detayları İncele</Cta>
            </div>
          </article>

          {/* 06 — Yatırım Değeri (üstte premium toplantı salonu fotoğrafı) */}
          <article className={`${CARD} flex flex-col`} style={reveal(6)}>
            <div className="relative h-40 shrink-0 overflow-hidden">
              <img
                src="/images/why/toplanti.jpg"
                alt="İdeal Ofis premium toplantı salonu"
                loading="lazy"
                className={IMG}
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-7 pt-6">
              <div className="flex items-start gap-4">
                <IconBadge Icon={TrendUp} className="shrink-0" />
                <div>
                  <Num>06</Num>
                  <h3 className="mt-0.5 text-xl font-semibold text-ink">Geleceğe Değer Katar</h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Bayraklı’nın gelişen iş merkezi içinde konumlanan güçlü yatırım fırsatı ve yüksek kira
                getirisi potansiyeli.
              </p>
              <Cta to="/iletisim">Yatırım Fırsatını Keşfet</Cta>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
