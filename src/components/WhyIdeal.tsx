import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
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
  ArrowRight,
  type Icon as PhIcon,
} from '@phosphor-icons/react'
import LokasyonHarita from './LokasyonHarita'

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
        'flex h-10 w-10 items-center justify-center rounded-xl bg-brand/[0.06] ring-1 ring-brand/10 lg:h-12 lg:w-12 lg:rounded-2xl ' +
        'transition-transform duration-500 group-hover:scale-110 ' +
        className
      }
    >
      <Icon weight="duotone" size={26} className="h-[22px] w-[22px] text-brand lg:h-[26px] lg:w-[26px]" />
    </span>
  )
}

function Num({ children }: { children: ReactNode }) {
  return <span className="text-sm font-semibold tracking-[0.14em] text-brand">{children}</span>
}

function Cta({
  to,
  children,
  margin = 'mt-4 lg:mt-5',
}: {
  to: string
  children: ReactNode
  margin?: string
}) {
  return (
    <Link
      to={to}
      className={`${margin} inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark`}
    >
      {children}
      <ArrowRight weight="bold" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
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
    <article className={`${CARD} flex h-full flex-col-reverse lg:flex-row`}>
      <div className="flex flex-1 flex-col p-5 lg:w-[52%] lg:flex-none lg:justify-center lg:p-6">
        <IconBadge Icon={Icon} className={iconClass} />
        <div className="mt-3">
          <Num>{num}</Num>
          <h3 className="mt-1 min-h-[50px] text-lg font-semibold leading-snug text-ink lg:min-h-0 lg:text-xl lg:leading-7">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
        </div>
      </div>
      <div className="relative h-44 shrink-0 overflow-hidden lg:h-auto lg:min-h-[190px] lg:flex-1 lg:shrink">
        <img src={img} alt={alt} loading="lazy" className={IMG} />
      </div>
    </article>
  )
}

// 02 + 03 içerikleri — mobil slider ve masaüstü bento aynı kaynağı kullanır
const CARD_02 = {
  Icon: Buildings,
  num: '02',
  title: 'A+ Mimari',
  text: '68–125 m² arasında değişen esnek planlar, yüksek tavanlar ve modern mimari ile verimli çalışma alanları.',
  img: '/images/why/ofis.jpg',
  alt: 'İdeal Ofis modern ofis içi',
}
const CARD_03 = {
  Icon: Leaf,
  num: '03',
  title: 'Nefes Alan Ofisler',
  text: 'Açılabilir balkonlar ve doğal havalandırma ile gün boyu ferah ve sağlıklı bir çalışma deneyimi.',
  img: '/images/why/balkon.jpg',
  alt: 'İdeal Ofis yeşil balkon ve iç bahçe',
  iconClass:
    '[&_svg]:origin-bottom [&_svg]:transition-transform [&_svg]:duration-700 group-hover:[&_svg]:-rotate-[10deg]',
}

// 01 — Şehrin Kalbinde (harita hover sahnesiyle)
function LokasyonCard({ style }: { style?: CSSProperties }) {
  return (
    <article className={`${CARD} flex flex-col-reverse lg:flex-row`} style={style}>
      <div className="flex flex-1 flex-col p-5 lg:w-[46%] lg:flex-none lg:justify-center lg:p-8">
        <IconBadge Icon={MapPin} />
        <div className="mt-3 lg:mt-4">
          <Num>01</Num>
          <h3 className="mt-1 min-h-[50px] text-lg font-semibold leading-snug text-ink lg:min-h-0 lg:text-2xl">
            Şehrin Kalbinde,<br className="hidden sm:block" /> İşin Merkezinde.
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted lg:mt-3">
            İzmir’in yükselen finans ve ticaret bölgesinde, adliye, ulaşım ağları ve iş
            merkezlerine dakikalar uzaklıkta.
          </p>
        </div>
        <Cta to="/iletisim" margin="mt-auto pt-4 lg:mt-5 lg:pt-0">Lokasyonu Keşfet</Cta>
      </div>
      <div className="relative h-44 shrink-0 overflow-hidden bg-section lg:h-auto lg:min-h-[300px] lg:flex-1 lg:shrink">
        {/* varsayılan: bina fotoğrafı — hover'da haritaya döner */}
        <img
          src="/images/why/lokasyon.jpg"
          alt="İdeal Ofis konumu — Bayraklı, İzmir"
          loading="lazy"
          className="h-full w-full object-cover transition-opacity duration-500 ease-out group-hover:opacity-0"
        />
        {/* harita sahnesi: işaretçiler haritanın kendi karesine kilitli — hover'da belirir */}
        <LokasyonHarita />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent transition-opacity duration-500 group-hover:opacity-0" />
      </div>
    </article>
  )
}

// 04 — Ayrıcalıklı Hizmetler
const SERVICES = [
  { Icon: Car, label: 'Vale Hizmeti' },
  { Icon: UsersThree, label: 'Toplantı Salonları' },
  { Icon: Armchair, label: 'Lobby & Resepsiyon' },
  { Icon: Headset, label: 'Ortak Sekreterya' },
  { Icon: Printer, label: 'Copy Center' },
]

function HizmetlerCard({ style }: { style?: CSSProperties }) {
  return (
    <article className={`${CARD} flex flex-col`} style={style}>
      <div className="flex flex-1 flex-col-reverse lg:flex-row">
        <div className="flex flex-1 flex-col p-5 lg:w-[48%] lg:flex-none lg:justify-center lg:p-7">
          <IconBadge Icon={Star} />
          <div className="mt-3 lg:mt-4">
            <span className="block lg:hidden">
              <Num>04</Num>
            </span>
            <h3 className="mt-1 min-h-[50px] text-lg font-semibold leading-snug text-ink lg:mt-0 lg:min-h-0 lg:text-2xl">
              İşinizi Kolaylaştıran Ayrıcalıklar
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Prestiji ve konforu bir araya getiren hizmetler, işinizi daha kolay ve verimli hale
              getirir.
            </p>
            {/* mobil: hizmetler ayrı bar yerine kart içeriğinde ikonlu mini liste */}
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 lg:hidden">
              {SERVICES.map((s) => (
                <li key={s.label} className="flex items-center gap-2">
                  <s.Icon weight="duotone" size={16} className="shrink-0 text-brand" />
                  <span className="text-xs font-medium text-ink">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative h-44 shrink-0 overflow-hidden lg:h-auto lg:min-h-[180px] lg:flex-1 lg:shrink">
          <img src="/images/why/lobby.jpg" alt="İdeal Ofis lobi ve resepsiyon" loading="lazy" className={IMG} />
        </div>
      </div>
      {/* hizmet barı — yalnız masaüstü */}
      <div className="hidden flex-wrap items-center border-t border-line lg:flex lg:gap-x-6 lg:gap-y-3 lg:px-8 lg:py-5">
        {SERVICES.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <s.Icon weight="duotone" size={20} className="text-brand" />
            <span className="text-xs font-medium text-ink">{s.label}</span>
          </div>
        ))}
      </div>
    </article>
  )
}

// 05 — Güvenlik
function GuvenlikCard({ style }: { style?: CSSProperties }) {
  return (
    <article className={`${CARD} flex flex-col`} style={style}>
      <div className="relative h-44 shrink-0 overflow-hidden lg:h-40">
        <img
          src="/images/why/calisma.jpg"
          alt="İdeal Ofis modern çalışma ortamı"
          loading="lazy"
          className={IMG}
        />
      </div>
      <div className="flex flex-1 flex-col p-5 lg:justify-between lg:p-7 lg:pt-6">
        <div className="flex flex-col items-start gap-3 lg:flex-row lg:gap-4">
          <IconBadge
            Icon={ShieldCheck}
            className="shrink-0 [&_svg]:transition-[filter] [&_svg]:duration-500 group-hover:[&_svg]:drop-shadow-[0_0_10px_rgba(226,0,26,0.6)]"
          />
          <div>
            <Num>05</Num>
            <h3 className="mt-1 min-h-[50px] text-lg font-semibold leading-snug text-ink lg:mt-0.5 lg:min-h-0 lg:text-xl lg:leading-7">
              7/24 Güvende
            </h3>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted lg:mt-3">
          Kontrollü giriş-çıkış, kamera sistemi, intercom ve yangın güvenlik altyapısı ile her
          zaman güvendesiniz.
        </p>
        {/* mobilde link yok — slider altındaki "Neden İdeal Ofis" butonu bu görevi taşıyor */}
        <div className="hidden lg:block">
          <Cta to="/neden-ideal">Detayları İncele</Cta>
        </div>
      </div>
    </article>
  )
}

// 06 — Yatırım Değeri
function YatirimCard({ style }: { style?: CSSProperties }) {
  return (
    <article className={`${CARD} flex flex-col`} style={style}>
      <div className="relative h-44 shrink-0 overflow-hidden lg:h-40">
        <img
          src="/images/why/toplanti.jpg"
          alt="İdeal Ofis premium toplantı salonu"
          loading="lazy"
          className={IMG}
        />
      </div>
      <div className="flex flex-1 flex-col p-5 lg:justify-between lg:p-7 lg:pt-6">
        <div className="flex flex-col items-start gap-3 lg:flex-row lg:gap-4">
          <IconBadge Icon={TrendUp} className="shrink-0" />
          <div>
            <Num>06</Num>
            <h3 className="mt-1 min-h-[50px] text-lg font-semibold leading-snug text-ink lg:mt-0.5 lg:min-h-0 lg:text-xl lg:leading-7">
              Geleceğe Değer Katar
            </h3>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted lg:mt-3">
          Bayraklı’nın gelişen iş merkezi içinde konumlanan güçlü yatırım fırsatı ve yüksek kira
          getirisi potansiyeli.
        </p>
        <Cta to="/iletisim" margin="mt-auto pt-4 lg:mt-5 lg:pt-0">Yatırım Fırsatını Keşfet</Cta>
      </div>
    </article>
  )
}

// mobil: sürekli sağdan sola akan kart şeridi — dokununca durur, bırakınca devam eder
function MobileSlider({ children }: { children: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const count = children.length

  useEffect(() => {
    const el = ref.current
    if (!el || reduceMotion()) return
    let raf = 0
    let visible = true
    let paused = false
    let lastTouch = 0
    const io = new IntersectionObserver((e) => {
      visible = e[0].isIntersecting
    })
    io.observe(el)
    const pause = () => {
      paused = true
      lastTouch = performance.now()
    }
    // kullanıcı kaydırırken (fling dahil) sayaç tazelenir → akış erken başlamaz
    const onScroll = () => {
      if (paused) lastTouch = performance.now()
    }
    el.addEventListener('pointerdown', pause)
    el.addEventListener('wheel', pause, { passive: true })
    el.addEventListener('scroll', onScroll, { passive: true })

    const SPEED = 30 // px/sn — sabit akış hızı
    const RESUME = 2000 // ms — son dokunuştan sonra bekleme
    let prev = 0
    // kesirli konum JS'te tutulur; scrollLeft geri OKUNMAZ (tarayıcı yuvarlayıp akışı dondurur)
    let pos = -1
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      const dt = prev ? Math.min(0.05, (t - prev) / 1000) : 0
      prev = t
      if (!visible || el.children.length <= count) return
      if (paused) {
        if (performance.now() - lastTouch < RESUME) return
        paused = false
        pos = -1 // kullanıcının bıraktığı yerden devam
      }
      if (pos < 0) pos = el.scrollLeft
      // bir tam tur = kopya setin başladığı nokta → dikişsiz sarma
      const period =
        (el.children[count] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft
      pos += SPEED * dt
      if (pos >= period) pos -= period
      el.scrollLeft = pos
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      el.removeEventListener('pointerdown', pause)
      el.removeEventListener('wheel', pause)
      el.removeEventListener('scroll', onScroll)
    }
  }, [count])

  const slide = 'w-[84vw] max-w-96 shrink-0 [&>*]:h-full'
  return (
    <div className="lg:hidden">
      <div
        ref={ref}
        className="-mx-5 -mb-8 flex items-stretch gap-4 overflow-x-auto px-5 pb-10 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children.map((c, i) => (
          <div key={i} className={slide}>
            {c}
          </div>
        ))}
        {/* dikişsiz döngü için kopya set — odak ve tıklamaya kapalı */}
        {children.map((c, i) => (
          <div key={`kopya-${i}`} inert aria-hidden="true" className={slide}>
            {c}
          </div>
        ))}
      </div>
    </div>
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
            Neden{' '}
            <span className="font-display text-sm font-semibold normal-case tracking-tight text-ink">
              ideal
            </span>
            <span className="font-display text-sm font-semibold normal-case tracking-tight">
              ofis
            </span>
            ?
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {"Verimli ve prestijli bir iş hayatı için"}{' '}
            <span className="font-display font-semibold tracking-tight text-brand">ideal</span>
          </h2>
          <p className="mt-5 text-base italic leading-relaxed text-muted">
            İyi bir ofis markanızın temsilidir.
          </p>
          <span className="mx-auto mt-8 block h-1 w-14 rounded-full bg-brand" />
        </div>

        {/* MOBİL: kaydırmalı slider (tüm kartlar tek şeritte) */}
        <div className="mt-14 lg:hidden" style={reveal(1)}>
          <MobileSlider>
            {[
              <LokasyonCard key="01" />,
              <PhotoCard key="02" {...CARD_02} />,
              <PhotoCard key="03" {...CARD_03} />,
              <HizmetlerCard key="04" />,
              <GuvenlikCard key="05" />,
              <YatirimCard key="06" />,
            ]}
          </MobileSlider>
          {/* şerit altı: bölümün ana yönlendirmesi */}
          <div className="mt-7 flex justify-center">
            <Link
              to="/neden-ideal"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-10px_rgba(226,0,26,0.55)] transition-transform active:scale-[0.97]"
            >
              <span>
                Neden <span className="font-display font-semibold tracking-tight text-ink">ideal</span>?
              </span>
              <ArrowRight weight="bold" size={16} />
            </Link>
          </div>
        </div>

        {/* MASAÜSTÜ BANT 1: büyük sol (lokasyon) + sağda 2 küçük */}
        <div className="mt-20 hidden gap-5 lg:grid lg:grid-cols-[1.25fr_1fr]">
          <LokasyonCard style={reveal(1)} />
          {/* sağ sütun: 02 + 03 */}
          <div className="flex flex-col gap-5">
            <div className="lg:h-[15.5rem]" style={reveal(2)}>
              <PhotoCard {...CARD_02} />
            </div>
            <div className="lg:h-[15.5rem]" style={reveal(3)}>
              <PhotoCard {...CARD_03} />
            </div>
          </div>
        </div>

        {/* MASAÜSTÜ BANT 2: büyük sol (ayrıcalıklar) + 2 küçük sağ */}
        <div className="mt-5 hidden gap-5 lg:grid lg:grid-cols-[1.7fr_1fr_1fr]">
          <HizmetlerCard style={reveal(4)} />
          <GuvenlikCard style={reveal(5)} />
          <YatirimCard style={reveal(6)} />
        </div>
      </div>
    </section>
  )
}
