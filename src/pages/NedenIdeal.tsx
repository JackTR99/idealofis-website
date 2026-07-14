import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Buildings,
  ListChecks,
  Star,
  ShieldCheck,
  TrendUp,
  Bank,
  Train,
  TrainRegional,
  Gavel,
  PersonSimpleWalk,
  ArrowsVertical,
  Plant,
  Wind,
  CheckCircle,
  ArrowRight,
  Ruler,
  Car,
  UsersThree,
  Armchair,
  Headset,
  Printer,
  IdentificationBadge,
  SecurityCamera,
  PhoneCall,
  FireExtinguisher,
  Info,
  Stack,
  Phone,
  WhatsappLogo,
  type Icon as PhIcon,
} from '@phosphor-icons/react'
import BrandWord from '../components/BrandWord'
import LokasyonHarita from '../components/LokasyonHarita'
import {
  OFISLER,
  OLCU_BEKLEYEN,
  olcuDogrulandi,
  M2_ARALIK,
  M2_ARALIK_TAM,
  M2_MOCK,
} from '../data/ofisler'
/* Telefon / WhatsApp / satış ofisi / çalışma saatleri BU DOSYADA TANIMLANMAZ.
   Site genelinde tek kaynak: src/data/iletisim.ts → Kaan gerçek numarayı verince
   YALNIZ o dosya güncellenir, bu sayfanın kapanış CTA'sı da kendiliğinden düzelir. */
import { TEL, TEL_HREF, WA_HREF, SATIS_OFISI_KISA, CALISMA_SAATLERI_KISA } from '../data/iletisim'

/* ════════════════════════════════════════════════════════════════════════
   MOCK — Kaan gerçeğini verecek
   Aşağıdaki değerlerin HİÇBİRİ doğrulanmadı; onay gelmeden YAYINA ÇIKMAMALI.
   MOCK_GOSTER = false → doğrulanmamış her değer (künye satırı, m² aralığı,
   doğrulanmamış ofis tiplerinin ölçüleri) ekrandan DÜŞER, düzen bozulmaz.
   MOCK_GOSTER = true  → değerler görünür, ama yanlarına <MockIsaret /> düşer.
   Kural: uydurmayı gizleme, işaretle.
   ════════════════════════════════════════════════════════════════════════ */
const MOCK_GOSTER = true

// MOCK — Kaan gerçeğini verecek (teknik künyenin doğrulanmamış satırları)
const KUNYE_MOCK = {
  teslim: '2026 4. çeyrek',
  asansor: '2 adet yolcu asansörü',
  tavanYuksekligi: '3,20 m (net)',
  iklimlendirme: 'VRF klima altyapısı',
  jenerator: 'Ortak alanlar için jeneratör',
}

/* ── m² — DOĞRULANMAMIŞ ÖLÇÜLER ───────────────────────────────────────────
   Aralık BU DOSYADA HESAPLANMAZ: tek kaynak src/data/ofisler.ts (M2_ARALIK,
   M2_ARALIK_TAM, M2_MOCK). Ofis 2 ve 4 ölçüleri orada PLACEHOLDER olduğu için
   aralığın İKİ UCU da (min = Ofis 4, max = Ofis 2) doğrulanmamış → M2_MOCK:
     • doğrulanmamış tipler MOCK_GOSTER=false iken tablodan düşer,
       true iken görünür MOCK işareti alır (<MockIsaret />),
     • Kaan gerçek ölçüleri verip bayrakları çevirince işaretler kendiliğinden düşer.
   ⚠️ KAAN'A SORU (ofisler.ts'te ayrıntısı yazılı): bu sayfa ofisler.ts'ten türetip
      "79–125" diyor, sitenin geri kalanı elle "68–125" yazıyor (StatsBand, WhyIdeal,
      OfislerTeaser, Hakkimizda). 68 bu dosyadaki hiçbir sütuna denk gelmiyor → biri
      yanlış. Doğru rakam gelince ofisler.ts güncellenir ve o dört dosya da M2_ARALIK'ı
      oradan okur; hiçbir sayfa m² aralığını elle yazmaz.
   ─────────────────────────────────────────────────────────────────────── */
const OLCU_BEKLEYEN_METIN = OLCU_BEKLEYEN.map((o) => o.ad).join(' ve ')
const OFISLER_GOSTERILEN = OFISLER.filter((o) => MOCK_GOSTER || olcuDogrulandi(o.id))

/* ── MESAFELER (GERÇEK) ───────────────────────────────────────────────────
   TEK GERÇEK VERİ: `metre`. Görünen mesafe metni, yürüme süresi ve oran çubuğunun
   yüzdesi HEP ondan türetilir → mesafe değişince üçü birden değişir, desenkron olamaz.
     • süre: ~80 m/dk ortalama yürüme hızı (TÜRETİLMİŞ, ÖLÇÜLMEDİ)
     • oran: en uzak nokta %100 kabul edilir
   Haritadaki işaretçiler src/components/LokasyonHarita.tsx içinde tanımlı;
   İstinaf'ın harita koordinatı YOK → haritada çizilmiyor, yalnız listede.
   ─────────────────────────────────────────────────────────────────────── */
const YURUME_HIZI = 80 // m/dk

// metre → görünen metin: 1.000 m altı "400 m", üstü "1,1 km" (Türkçe ondalık virgül)
const mesafeMetni = (metre: number) =>
  metre < 1000 ? `${metre} m` : `${(metre / 1000).toFixed(1).replace('.', ',')} km`
const sureMetni = (metre: number) => `yaklaşık ${Math.round(metre / YURUME_HIZI)} dk yürüme`

const MESAFELER_HAM: { id: string; Icon: PhIcon; ad: string; metre: number }[] = [
  { id: 'adliye', Icon: Bank, ad: 'Adalet Sarayı', metre: 400 },
  { id: 'metro', Icon: Train, ad: 'Sanayi Metro', metre: 550 },
  { id: 'istinaf', Icon: Gavel, ad: 'İstinaf Mahkemeleri', metre: 800 },
  { id: 'izban', Icon: TrainRegional, ad: 'İzban Salhane', metre: 1100 },
]

const EN_UZAK = Math.max(...MESAFELER_HAM.map((m) => m.metre))

const MESAFELER = MESAFELER_HAM.map((m) => ({
  ...m,
  mesafe: mesafeMetni(m.metre),
  sure: sureMetni(m.metre),
  oran: Math.round((m.metre / EN_UZAK) * 100),
}))

/* ════════════════════════════════════════════════════════════════════════
   ANİMASYON MOTORU — WhyIdeal deseni: yeni CSS/keyframe YOK, inline style + IO
   ════════════════════════════════════════════════════════════════════════ */
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/* ── Hareket azaltma tercihi — REAKTİF ────────────────────────────────────
   Eskiden her render'da matchMedia kuruluyordu (7 bölüm × her render) ve tercih
   oturum ortasında değişirse (macOS'ta "Hareketi azalt" açılınca) sayfa tepki
   vermiyordu. Artık MediaQueryList BİR KEZ kurulur, 'change' olayı dinlenir ve
   useSyncExternalStore tüm bölümleri aynı anda günceller.
   ─────────────────────────────────────────────────────────────────────── */
const AZ_HAREKET = '(prefers-reduced-motion: reduce)'

let mql: MediaQueryList | null = null
function mqlAl() {
  if (typeof window === 'undefined' || !window.matchMedia) return null
  mql ??= window.matchMedia(AZ_HAREKET)
  return mql
}

function reduceMotionAbone(bildir: () => void) {
  const m = mqlAl()
  if (!m) return () => {}
  m.addEventListener('change', bildir)
  return () => m.removeEventListener('change', bildir)
}
// snapshot bir boolean → React değeri karşılaştırır, gereksiz render olmaz
const reduceMotionOku = () => mqlAl()?.matches ?? false
const reduceMotionSunucu = () => false

function useReduceMotion() {
  return useSyncExternalStore(reduceMotionAbone, reduceMotionOku, reduceMotionSunucu)
}

function useReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null)
  const reduce = useReduceMotion()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    // Hareket azaltma açıkken animasyon YOK → her şey doğrudan açık sayılır.
    // (Tercih oturum ortasında kapatılırsa, ekranın dışında kalmış bölümler
    //  opacity:0'a düşmesin diye `shown` burada kalıcı olarak true kalır.)
    if (reduce) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce, threshold])

  // blok reveal'ı (opacity + translateY)
  const reveal = (i: number): CSSProperties | undefined =>
    reduce
      ? undefined
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0)' : 'translateY(24px)',
          transition: `opacity 0.6s ${EASE} ${i * 0.08}s, transform 0.7s ${EASE} ${i * 0.08}s`,
        }

  // kart içi ikinci katman (satır / çip stagger'ı)
  const alt = (gecikme: number, mesafe = 8): CSSProperties | undefined =>
    reduce
      ? undefined
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0)' : `translateY(${mesafe}px)`,
          transition: `opacity 0.45s ${EASE} ${gecikme}s, transform 0.45s ${EASE} ${gecikme}s`,
        }

  return { ref, shown, reduce, reveal, alt }
}

/* ════════════════════════════════════════════════════════════════════════
   ORTAK KABUKLAR (WhyIdeal.tsx'teki CARD ile birebir)
   ════════════════════════════════════════════════════════════════════════ */
const CARD =
  'group relative overflow-hidden rounded-[28px] bg-surface ring-1 ring-black/[0.04] ' +
  'shadow-[0_1px_2px_rgba(20,20,20,0.04),0_18px_40px_-24px_rgba(20,20,20,0.16)] ' +
  'transition-[transform,box-shadow] duration-500 ' +
  'hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(20,20,20,0.04),0_36px_72px_-28px_rgba(20,20,20,0.34)] ' +
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0'

/* Hover lift KURALI (tek cümle): kabuğun içinde link YOKSA kart tıklanamaz →
   CARD_SABIT (lift yok). İçinde link/CTA olan kartlar CARD kullanır; lift, o linke
   giden görsel davettir (Hizmetler kartları anasayfa WhyIdeal ile aynı kalsın diye
   bilinçli istisnadır). */
const CARD_SABIT =
  'relative overflow-hidden rounded-[28px] bg-surface ring-1 ring-black/[0.04] ' +
  'shadow-[0_1px_2px_rgba(20,20,20,0.04),0_18px_40px_-24px_rgba(20,20,20,0.16)]'

const IMG =
  'h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] ' +
  'motion-reduce:transition-none motion-reduce:group-hover:scale-100'

/* Sayfadaki TEK rozet bileşeni (üç ayrı ölçü kullanılmıyor).
   boyut="std"   → h-10 → lg:h-12 (WhyIdeal ile birebir)
   boyut="kucuk" → h-10 sabit; satır içi listelerde hizayı bozmaz
   Köşe: mobilde rounded-xl, lg'de rounded-2xl (her iki boyutta da aynı). */
function IconBadge({
  Icon,
  className = '',
  boyut = 'std',
}: {
  Icon: PhIcon
  className?: string
  boyut?: 'std' | 'kucuk'
}) {
  const std = boyut === 'std'
  return (
    <span
      className={
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/[0.06] ring-1 ring-brand/10 lg:rounded-2xl ' +
        (std ? 'lg:h-12 lg:w-12 ' : '') +
        'transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ' +
        className
      }
    >
      <Icon
        weight="duotone"
        size={26}
        aria-hidden="true"
        className={
          std ? 'h-[22px] w-[22px] text-brand lg:h-[26px] lg:w-[26px]' : 'h-[20px] w-[20px] text-brand'
        }
      />
    </span>
  )
}

/* Doğrulanmamış (MOCK) değerlerin yanına düşen görünür işaret.
   Yalnız MOCK_GOSTER=true iken ekranda kalır; Kaan gerçek değeri verince
   ilgili bayrak true olur ve işaret kendiliğinden düşer. */
function MockIsaret() {
  return (
    <span
      title="Doğrulanmamış değer — teyit bekleniyor"
      className="ml-0.5 align-super text-[10px] font-bold text-brand"
    >
      *<span className="sr-only"> (doğrulanmamış değer)</span>
    </span>
  )
}

// koyu bant (bg-ink) rozeti
function IconBadgeKoyu({ Icon, className = '' }: { Icon: PhIcon; className?: string }) {
  return (
    <span
      className={
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/[0.12] ring-1 ring-brand/25 lg:h-12 lg:w-12 lg:rounded-2xl ' +
        'transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ' +
        className
      }
    >
      <Icon weight="duotone" size={24} aria-hidden="true" className="text-brand" />
    </span>
  )
}

/* Küçük kırmızı üst-etiket.
   dekoratif=true → yalnız SIRA NUMARASI taşır (Hizmetler'deki 01–05). Ekran okuyucu
   "sıfır bir, Vale Hizmeti" diye okumasın diye aria-hidden basılır (Güvenlik bölümündeki
   numaralarla aynı davranış). Mimari'deki metinli kullanımlar ("Hacim", "Balkon", "Hava")
   anlam taşır → dekoratif DEĞİL, okunmaya devam eder. */
function Num({ children, dekoratif = false }: { children: ReactNode; dekoratif?: boolean }) {
  return (
    <span
      aria-hidden={dekoratif ? 'true' : undefined}
      className="text-sm font-semibold tracking-[0.14em] text-brand"
    >
      {children}
    </span>
  )
}

/* MARKA YAZISI: yerel kopya YOK — tek kaynak src/components/BrandWord.tsx.
   Koyu zeminde <BrandWord idealClass="text-page" /> (yoksa "ideal" hecesi solar). */

/* 2–7. bölümlerin ORTAK başlık kalıbı.
   Etiket rengi: açık zeminde text-brand (WhyIdeal / OfislerTeaser / Ofislerimiz ile aynı),
   koyu zeminde text-page/70 (IletisimCta ile aynı; text-brand koyu zeminde ~3,7:1 → AA altı).
   h2 ölçeği burada kilitli: text-3xl sm:text-4xl = site geneli bölüm başlığı ölçeği. */
function BolumBasligi({
  id,
  etiket,
  baslik,
  aciklama,
  ton = 'acik',
  hiza = 'orta',
}: {
  id: string
  etiket: string
  baslik: ReactNode
  aciklama: ReactNode
  ton?: 'acik' | 'koyu'
  hiza?: 'orta' | 'sol'
}) {
  const orta = hiza === 'orta'
  return (
    <div className={orta ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}>
      <p
        className={`text-xs font-semibold uppercase tracking-[0.22em] ${
          ton === 'koyu' ? 'text-page/70' : 'text-brand'
        }`}
      >
        {etiket}
      </p>
      <h2
        id={id}
        className={`mt-3 text-3xl font-semibold leading-tight sm:text-4xl ${
          ton === 'koyu' ? 'text-page' : 'text-ink'
        }`}
      >
        {baslik}
      </h2>
      <p
        className={`mt-4 text-base leading-relaxed ${ton === 'koyu' ? 'text-page/70' : 'text-muted'}`}
      >
        {aciklama}
      </p>
      <span
        aria-hidden="true"
        className={`mt-8 block h-1 w-14 rounded-full bg-brand ${orta ? 'mx-auto' : ''}`}
      />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   1 — AÇILIŞ (bg-page, görselsiz; sayfanın TEK h1'i)
   ════════════════════════════════════════════════════════════════════════ */
const BOLUM_CIPLERI = [
  { Icon: MapPin, ad: 'Lokasyon', hedef: '#lokasyon' },
  { Icon: Buildings, ad: 'Mimari', hedef: '#mimari' },
  { Icon: ListChecks, ad: 'Teknik Künye', hedef: '#teknik-kunye' },
  { Icon: Star, ad: 'Hizmetler', hedef: '#hizmetler' },
  { Icon: ShieldCheck, ad: 'Güvenlik', hedef: '#guvenlik' },
  { Icon: TrendUp, ad: 'Yatırım', hedef: '#yatirim' },
]

function Acilis() {
  const { ref, shown, reduce, reveal } = useReveal<HTMLElement>(0.12)

  return (
    <section ref={ref} id="acilis" className="scroll-mt-32 bg-page">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-36 lg:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.22em] text-brand"
            style={reveal(0)}
          >
            Bayraklı, İzmir · Özlütürk
          </p>
          {/* h1, bölüm h2'lerinin (3xl/4xl) bir kademe üstünde → hiyerarşi okunur */}
          <h1
            className="mt-3 text-4xl font-semibold leading-tight text-ink sm:text-5xl"
            style={reveal(1)}
          >
            Neden <BrandWord />?
          </h1>
          <p className="mt-5 text-lg italic leading-relaxed text-muted" style={reveal(2)}>
            Bir ofisin iyi olduğunu cümleler değil; mesafeler, metrekareler ve planlar gösterir.
          </p>
          <p
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted"
            style={reveal(3)}
          >
            Anasayfadaki altı başlığın karşılığı bu sayfada tek tek yazılı: adliyeye kaç metre,
            binada kaç kat ve kaç ofis var, hangi hizmetler veriliyor, güvenlik nasıl kurulmuş.
          </p>
          <span
            aria-hidden="true"
            className="mx-auto mt-8 block h-1 w-14 origin-center rounded-full bg-brand"
            style={
              reduce
                ? undefined
                : {
                    transform: shown ? 'scaleX(1)' : 'scaleX(0)',
                    transition: `transform 0.7s ${EASE} 0.32s`,
                  }
            }
          />

          {/* BÖLÜM KILAVUZU — mobilde kaydırmalı şerit, sm+'ta sarmalı ve ortalı */}
          <nav aria-label="Sayfa bölümleri" className="mt-10" style={reveal(5)}>
            <div className="-mx-5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:snap-none sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
              {BOLUM_CIPLERI.map((c, i) => (
                <a
                  key={c.hedef}
                  href={c.hedef}
                  className="inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-[0_1px_2px_rgba(20,20,20,0.04)] ring-1 ring-line transition-[transform,box-shadow,color] duration-300 hover:-translate-y-0.5 hover:text-brand hover:shadow-[0_10px_24px_-14px_rgba(20,20,20,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-page active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  style={
                    reduce
                      ? undefined
                      : {
                          opacity: shown ? 1 : 0,
                          transform: shown ? 'translateY(0)' : 'translateY(10px)',
                          transition: `opacity 0.5s ${EASE} ${0.4 + i * 0.05}s, transform 0.5s ${EASE} ${
                            0.4 + i * 0.05
                          }s`,
                        }
                  }
                >
                  <c.Icon
                    weight="duotone"
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 text-brand"
                  />
                  {c.ad}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   2 — LOKASYON (bg-section; harita + mesafe verisi)
   ════════════════════════════════════════════════════════════════════════ */
const LOKASYON_ANLATI: { baslik: string; metin: string | null }[] = [
  {
    baslik: 'Hukukun yanı başında',
    metin:
      'Adalet Sarayı ve İstinaf Mahkemeleri yürüme mesafesinde. Duruşma günü, dosya teslimi ve müvekkil görüşmesi için ofisten yürüyerek çıkabilirsiniz.',
  },
  {
    baslik: 'İki ayrı raylı hat',
    metin:
      'Sanayi Metro istasyonu ve İzban Salhane durağı yürüme mesafesinde. Ekibiniz ve müvekkilleriniz şehrin farklı yakalarından raylı sistemle gelebiliyor.',
  },
  // marka yazısı içerdiği için metni JSX'te yazılıyor
  { baslik: 'Bayraklı’nın iş hattı', metin: null },
]

function Lokasyon() {
  // `shown` ŞART: oran çubuklarının genişliği buna bağlı (0% → oran%). Yoksa
  // genişlik ilk boyamada zaten hedefinde olur ve CSS transition hiç tetiklenmez.
  const { ref, shown, reduce, reveal } = useReveal<HTMLElement>(0.12)

  return (
    <section
      ref={ref}
      id="lokasyon"
      aria-labelledby="lokasyon-baslik"
      className="scroll-mt-32 border-t border-line bg-section"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 lg:py-28">
        <div style={reveal(0)}>
          <BolumBasligi
            id="lokasyon-baslik"
            etiket="Lokasyon"
            baslik="Adliyeye 400 Metre, Metroya 550"
            aciklama={
              <>
                <BrandWord />, Bayraklı’da adliye hattı ile ulaşım hattının kesiştiği noktada
                duruyor.
                Duruşma, dosya teslimi, müvekkil görüşmesi ya da metroya iniş için araca binmeniz
                gerekmiyor; günlük işlerin önemli bir bölümü yürüme mesafesinde kalıyor.
              </>
            }
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:mt-14 lg:grid-cols-[1.55fr_1fr] lg:items-stretch">
          {/* HARİTA KARTI */}
          <div className={`${CARD_SABIT} p-3 sm:p-4`} style={reveal(1)}>
            {/*
              hep → LokasyonHarita kendi IntersectionObserver'ı ile görünür alana girince açılır.
              Dokunmatikte :hover tetiklenmediği için hover moduyla harita mobilde BOŞ kalırdı.
              cipler="smUstu" → mesafe çipleri dar ekranda kart dışına taşıp kesiliyordu; <sm'de
              basılmıyorlar (bilgi kaybı yok: mesafeler yandaki mesafe kartında yazılı).
              Kararı artık BİLEŞENİN PROP'U veriyor; eskiden burada [&_.backdrop-blur] ile bir
              yardımcı sınıfın ADINA bağlanılıyordu → sınıf değişince çipler sessizce geri gelirdi.
            */}
            <div className="relative aspect-square overflow-hidden rounded-[22px] bg-section lg:aspect-[4/3] lg:min-h-[520px]">
              <LokasyonHarita hep cipler="smUstu" />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line px-2 pt-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-ink">
                <MapPin weight="duotone" size={16} aria-hidden="true" className="text-brand" />
                Bayraklı, İzmir — proje konumu ve çevresi
              </p>
              <p className="text-xs text-muted">Mesafeler yaklaşık değerlerdir.</p>
            </div>
          </div>

          {/* MESAFE KARTI — tıklanabilir değil: hover/focus vurgusu yok */}
          <div className={`${CARD_SABIT} flex flex-col justify-center p-6 sm:p-7`} style={reveal(2)}>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
              <PersonSimpleWalk
                weight="duotone"
                size={22}
                aria-hidden="true"
                className="shrink-0 text-brand"
              />
              Yürüme mesafesindeki dört nokta
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Süreler ortalama yürüme hızıyla hesaplanmış yaklaşık değerlerdir.
            </p>

            {/* role="list" ŞART: Tailwind Preflight ul'den list-style'ı kaldırıyor ve
                Safari + VoiceOver bu durumda listeyi liste olarak duyurmuyor. */}
            <ul role="list" className="mt-6 flex flex-col divide-y divide-line">
              {MESAFELER.map((m, i) => (
                <li key={m.id} className="min-h-14 py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3.5">
                    {/* boyut="kucuk" → rozet lg'de de 40px kalır; alttaki ml-[54px]
                        (40px rozet + 14px gap) hizası her kırılımda tutar. */}
                    <IconBadge Icon={m.Icon} boyut="kucuk" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink">{m.ad}</p>
                      <p className="mt-0.5 text-xs text-muted">{m.sure}</p>
                    </div>
                    <p className="whitespace-nowrap text-base font-semibold tabular-nums text-brand">
                      {m.mesafe}
                    </p>
                  </div>
                  {/* oran çubuğu — w-full YOK (ml-[54px] + w-full = yatay taşma) */}
                  <div aria-hidden="true" className="ml-[54px] mt-2.5 h-[3px] rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-brand/70"
                      style={
                        reduce
                          ? { width: `${m.oran}%` } // hareket kapalı → çubuk anında dolu
                          : {
                              width: shown ? `${m.oran}%` : '0%',
                              transition: `width 0.8s ${EASE}`,
                              transitionDelay: `${300 + i * 90}ms`,
                            }
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">
              En uzak nokta bile yaklaşık 15 dakikalık bir yürüyüş.
            </p>
          </div>
        </div>

        {/* ANLATI ŞERİDİ — RAKAM YOK (mesafeler yukarıda bir kez veriliyor) */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LOKASYON_ANLATI.map((b, i) => (
            <div key={b.baslik} style={reveal(3 + i)}>
              <span aria-hidden="true" className="block h-0.5 w-8 rounded-full bg-brand" />
              <h3 className="mt-4 text-base font-semibold text-ink">{b.baslik}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {b.metin ?? (
                  <>
                    Bölge, İzmir’in kurumsal ofis hattı olarak gelişmeye devam ediyor. <BrandWord />{' '}
                    bu hattın adliye tarafında, yürüme mesafesinde konumlanıyor.
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   3 — MİMARİ (bg-page; görsel yüklü bento)
   MOCK / DOĞRULANACAK — Kaan gerçeklerini verecek; hiçbiri burada render EDİLMİYOR:
     tavan yüksekliği (m) → gelirse M1 paragrafına tek cümle
     balkon m² → gelirse M2'ye tek cümle
     cephe/doğrama, teslim yılı → teknik künyenin işi
   ════════════════════════════════════════════════════════════════════════ */
// m² aralığı MOCK (uçları placeholder) → MOCK_GOSTER=false iken şeritten düşer.
// Sütun sayısı ve ayraçlar öğe sayısına göre kendini kurar (aşağıdaki grid).
const OLCEK_TUM: { deger: string; etiket: string; mock?: boolean }[] = [
  { deger: '8', etiket: 'Kat' },
  { deger: '102', etiket: 'Ofis' },
  { deger: M2_ARALIK, etiket: 'm² genel brüt', mock: M2_MOCK },
  { deger: '4', etiket: 'Plan tipi' },
]
const OLCEK = OLCEK_TUM.filter((o) => MOCK_GOSTER || !o.mock)

const M1_MADDELER = [
  'Her planda çalışma odası, mutfak nişi ve WC ayrı çözülmüş',
  'Dört plan tipinin ölçüleri teknik künyede tek tek yazılı',
]

function Mimari() {
  const { ref, reveal } = useReveal<HTMLElement>(0.15)

  return (
    <section ref={ref} id="mimari" aria-labelledby="mimari-baslik" className="scroll-mt-32 bg-page">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:py-28">
        <div style={reveal(0)}>
          <BolumBasligi
            id="mimari-baslik"
            etiket="Mimari & Teknik"
            baslik="8 Katlı Butik Bir Bina"
            aciklama="Sekiz kat, 102 ofis. Bu ölçek büyük görünmek için değil, gün boyu rahat çalışabilmek için seçildi: yüksek tavanlar hacmi genişletiyor, açılabilir balkonlar havayı tazeliyor, dört farklı plan farklı ekip büyüklüklerine yer bırakıyor."
          />
        </div>

        {/* ÖLÇEK ŞERİDİ — sayaç animasyonu YOK (StatsBand ile çakışmasın).
            Ayraçlar: her hücre border-b/border-r alır; dıştaki -mb-px -mr-px + kabuğun
            overflow-hidden'ı kenardaki çizgileri kırpar → öğe sayısı değişse de bozulmaz. */}
        <div className={`${CARD_SABIT} mt-12`} style={reveal(1)}>
          <div
            className={`-mb-px -mr-px grid grid-cols-2 ${
              OLCEK.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'
            }`}
          >
            {OLCEK.map((o) => (
              <div
                key={o.etiket}
                className="border-b border-r border-line px-6 py-6 text-center last:border-r-0"
              >
                <p className="font-display text-2xl font-semibold tabular-nums text-brand sm:text-3xl">
                  {o.deger}
                  {o.mock && <MockIsaret />}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  {o.etiket}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BENTO */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          {/* M1 — Hacim */}
          <article className={`${CARD} flex flex-col-reverse lg:flex-row`} style={reveal(2)}>
            <div className="flex flex-1 flex-col p-5 lg:w-[46%] lg:flex-none lg:justify-center lg:p-8">
              <IconBadge Icon={ArrowsVertical} />
              <div className="mt-3">
                <Num>Hacim</Num>
                <h3 className="mt-1 text-lg font-semibold leading-snug text-ink lg:text-xl">
                  Yüksek Tavan, Geniş Hacim
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Bir ofis yalnızca metrekareyle ölçülmez; hacimle de ölçülür. Yüksek tavan, ışığın
                  odanın derinine ulaşmasına ve havanın rahat dolaşmasına alan açar. Aynı
                  metrekarede daha ferah çalışılır.
                </p>
                {/* role="list" — Preflight list-style'ı kaldırdığı için (bkz. mesafe listesi) */}
                <ul role="list" className="mt-4 flex flex-col gap-2">
                  {M1_MADDELER.map((m) => (
                    <li key={m} className="flex gap-2">
                      <CheckCircle
                        weight="duotone"
                        size={16}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-brand"
                      />
                      <span className="text-sm text-ink">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/ofislerimiz"
                className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-semibold text-brand transition-colors hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 lg:mt-5 lg:pt-0"
              >
                Ofis planlarını incele
                <ArrowRight
                  weight="bold"
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
              </Link>
            </div>
            <div className="relative h-44 shrink-0 overflow-hidden lg:h-auto lg:min-h-[300px] lg:flex-1 lg:shrink">
              <img
                src="/images/why/ofis.jpg"
                alt="idealofis ofis içi — yüksek tavanlı çalışma alanı"
                loading="lazy"
                decoding="async"
                className={IMG}
              />
            </div>
          </article>

          {/* SAĞ SÜTUN — M2 + M3
              ⚠️ WhyIdeal'deki sabit lg:h-[15.5rem] BURADA KULLANILMAZ: bu bölümün
              metinleri daha uzun, 248px'lik kart Balkon paragrafını kesiyordu.
              lg:flex-1 + min-height:auto → kartlar sol kartın yüksekliğini paylaşır,
              ama hiçbir zaman içerikten kısa olmaz. */}
          <div className="flex flex-col gap-5">
            <div className="lg:flex-1" style={reveal(3)}>
              <article className={`${CARD} flex h-full flex-col-reverse lg:flex-row`}>
                <div className="flex flex-1 flex-col p-5 lg:w-[52%] lg:flex-none lg:justify-center lg:p-6">
                  <IconBadge
                    Icon={Plant}
                    className="[&_svg]:origin-bottom [&_svg]:transition-transform [&_svg]:duration-700 group-hover:[&_svg]:-rotate-[10deg] motion-reduce:group-hover:[&_svg]:rotate-0"
                  />
                  <div className="mt-3">
                    <Num>Balkon</Num>
                    <h3 className="mt-1 text-lg font-semibold leading-snug text-ink lg:text-xl">
                      Açılabilen Bir Balkon
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Balkon, kapalı geçen bir ofis gününü bölen en basit ara. Kapıyı açıp iki
                      dakika dışarı çıkmak; bir telefon görüşmesi, bir kahve ya da sadece temiz hava
                      için yeterli. Dört plan tipinin dördünde de balkon var.
                    </p>
                  </div>
                </div>
                <div className="relative h-44 shrink-0 overflow-hidden lg:h-auto lg:min-h-[190px] lg:flex-1 lg:shrink">
                  <img
                    src="/images/why/balkon.jpg"
                    alt="idealofis balkon ve yeşil alan"
                    loading="lazy"
                    decoding="async"
                    className={IMG}
                  />
                </div>
              </article>
            </div>

            <div className="lg:flex-1" style={reveal(4)}>
              <article className={`${CARD} flex h-full flex-col-reverse lg:flex-row`}>
                <div className="flex flex-1 flex-col p-5 lg:w-[52%] lg:flex-none lg:justify-center lg:p-6">
                  <IconBadge Icon={Wind} />
                  <div className="mt-3">
                    <Num>Hava</Num>
                    <h3 className="mt-1 text-lg font-semibold leading-snug text-ink lg:text-xl">
                      Doğal Havalandırma
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Pencereler açılıyor; hava dolaşımı yalnızca mekanik sisteme bırakılmıyor.
                      Günün başında havalandırılan bir ofis, öğleden sonra daha ferah kalır.
                    </p>
                  </div>
                </div>
                <div className="relative h-44 shrink-0 overflow-hidden lg:h-auto lg:min-h-[190px] lg:flex-1 lg:shrink">
                  <img
                    src="/images/why/calisma.jpg"
                    alt="idealofis aydınlık çalışma ortamı"
                    loading="lazy"
                    decoding="async"
                    className={IMG}
                  />
                </div>
              </article>
            </div>
          </div>
        </div>

        {/* ALT BANT
            `group` SARMALAYICIDA DEĞİL, <a>'nın kendisinde: eskiden grup açıklama <p>'sini de
            kapsıyordu → salt metnin üzerine gelince linkin oku oynuyor, tıklanamayan metin
            tıklanabilirmiş gibi davranıyordu. */}
        <div
          className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3"
          style={reveal(5)}
        >
          <p className="text-sm text-muted">
            Kat planları, otopark ve altyapı detaylarının tamamı aşağıdaki künyede.
          </p>
          <a
            href="#teknik-kunye"
            className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            Teknik Künye
            <ArrowRight
              weight="bold"
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   4 — TEKNİK KÜNYE (bg-section; sessiz veri adası, görselsiz)
   Ölçüler OFISLER'den map ile basılır — m² kodda SABİT YAZILMAZ.
   ════════════════════════════════════════════════════════════════════════ */
type KunyeSatir = { k: string; v: string; mock?: boolean }

const KUNYE_GRUPLARI: { etiket: string; satirlar: KunyeSatir[] }[] = [
  {
    etiket: 'Proje',
    satirlar: [
      { k: 'Konum', v: 'Bayraklı, İzmir' },
      { k: 'Marka', v: 'Özlütürk' },
      { k: 'Kat sayısı', v: '8 kat' },
      { k: 'Toplam ofis', v: '102 ofis' },
      { k: 'Ofis tipi', v: '4 tip (Ofis 1–4)' },
      // OFISLER'den hesaplanır; uçları placeholder olduğu için MOCK (bkz. M2_MOCK)
      { k: 'Ofis büyüklükleri', v: M2_ARALIK_TAM, mock: M2_MOCK },
      { k: 'Balkon', v: 'Dört tipte de var (açılabilir)' },
      { k: 'Teslim', v: KUNYE_MOCK.teslim, mock: true },
    ],
  },
  {
    etiket: 'Donanım ve Altyapı',
    satirlar: [
      { k: 'Otopark', v: '3 katlı otopark (vale hizmetli)' },
      { k: 'Asansör', v: KUNYE_MOCK.asansor, mock: true },
      { k: 'Tavan yüksekliği', v: KUNYE_MOCK.tavanYuksekligi, mock: true },
      { k: 'İklimlendirme', v: KUNYE_MOCK.iklimlendirme, mock: true },
      { k: 'Jeneratör', v: KUNYE_MOCK.jenerator, mock: true },
      { k: 'Havalandırma', v: 'Doğal havalandırma, açılabilir balkon' },
      { k: 'Yangın', v: 'Yangın güvenlik altyapısı' },
    ],
  },
]

// MOCK_GOSTER=false → mock satırlar düşer, düzen bozulmaz. 'bas' = satır stagger sırası.
let kunyeSira = 0
const KUNYE = KUNYE_GRUPLARI.map((g) => {
  const satirlar = g.satirlar.filter((s) => MOCK_GOSTER || !s.mock)
  const bas = kunyeSira
  kunyeSira += 1 + satirlar.length
  return { etiket: g.etiket, satirlar, bas }
})
// Ekranda duran mock satır var mı? (varsa künye kartına "* doğrulanmadı" dipnotu düşer)
const KUNYE_MOCK_VAR = KUNYE.some((g) => g.satirlar.some((s) => s.mock))

function TeknikKunye() {
  const { ref, reveal, alt } = useReveal<HTMLElement>(0.15)

  return (
    <section
      ref={ref}
      id="teknik-kunye"
      aria-labelledby="kunye-baslik"
      className="scroll-mt-32 border-y border-line bg-section"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 lg:py-28">
        <div style={reveal(0)}>
          <BolumBasligi
            id="kunye-baslik"
            etiket="Teknik Bilgiler"
            baslik="Teknik Künye"
            aciklama="Karşılaştırma yapmak için gereken sayılar tek yerde: binanın teknik bilgileri ve dört ofis tipinin net, brüt, genel brüt ölçüleri."
          />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          {/* KART A — Bina Künyesi (içinde link YOK → tıklanamaz → CARD_SABIT, hover lift yok) */}
          <article className={`${CARD_SABIT} p-6 sm:p-7`} style={reveal(1)}>
            <div className="flex items-center gap-3">
              <IconBadge Icon={Buildings} boyut="kucuk" />
              <h3 className="text-lg font-semibold text-ink lg:text-xl">Bina Künyesi</h3>
            </div>

            {/* Geçerli HTML: her grubun kendi <dl>'si var; grup etiketi <dl>'nin DIŞINDA.
                (Bir <dl> > <div> yalnız <dt>/<dd> içerebilir; araya <p> giremez.) */}
            {KUNYE.map((g, gi) => (
              <div key={g.etiket} className={gi === 0 ? 'mt-5' : 'mt-6 border-t border-line pt-5'}>
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted"
                  style={alt(0.28 + g.bas * 0.05)}
                >
                  {g.etiket}
                </p>
                <dl>
                  {g.satirlar.map((s, i) => (
                    <div
                      key={s.k}
                      className="flex flex-col items-start gap-0.5 border-b border-line/70 py-2.5 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                      style={alt(0.28 + (g.bas + 1 + i) * 0.05)}
                    >
                      <dt className="text-sm text-muted">{s.k}</dt>
                      <dd className="text-sm font-semibold tabular-nums text-ink sm:text-right">
                        {s.v}
                        {s.mock && <MockIsaret />}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}

            {/* Uydurmayı gizleme, işaretle: ekranda mock satır varsa okuyucu bunu bilsin. */}
            {KUNYE_MOCK_VAR && (
              <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-brand-dark">
                <span aria-hidden="true">*</span> İşaretli değerler henüz doğrulanmadı; teyit
                edildiğinde güncellenecektir.
              </p>
            )}
            <p
              className={`text-xs leading-relaxed text-muted ${
                KUNYE_MOCK_VAR ? 'mt-2' : 'mt-5 border-t border-line pt-4'
              }`}
            >
              Teknik değerler proje dosyasına göredir; sözleşmedeki onaylı veriler esastır.
            </p>
          </article>

          {/* KART B — Ofis Tipleri ve Ölçüler (içinde /ofislerimiz linki VAR → CARD, lift kalır) */}
          <article className={`${CARD} p-6 sm:p-7`} style={reveal(2)}>
            <div className="flex items-center gap-3">
              <IconBadge Icon={Ruler} boyut="kucuk" />
              <h3 className="text-lg font-semibold text-ink lg:text-xl">Ofis Tipleri ve Ölçüler</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Dört tip; net, brüt ve genel brüt ölçüler. Tüm değerler m² cinsindendir.
            </p>

            {/* ≥sm: gerçek tablo */}
            <table className="mt-6 hidden w-full text-left sm:table">
              <caption className="sr-only">Ofis tipleri ve metrekare ölçüleri</caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-line pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"
                  >
                    Tip
                  </th>
                  {['Net', 'Brüt', 'Genel Brüt'].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="border-b border-line pb-3 text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {OFISLER_GOSTERILEN.map((o, i) => (
                  <tr
                    key={o.id}
                    className="border-b border-line/70 transition-colors duration-200 last:border-b-0 hover:bg-ink/[0.03]"
                    style={alt(0.36 + i * 0.06)}
                  >
                    <th scope="row" className="py-3.5 text-left text-sm font-semibold text-ink">
                      {o.ad}
                      {!olcuDogrulandi(o.id) && <MockIsaret />}
                    </th>
                    <td className="py-3.5 text-right text-sm tabular-nums text-ink/80">{o.net}</td>
                    <td className="py-3.5 text-right text-sm tabular-nums text-ink/80">{o.brut}</td>
                    <td className="py-3.5 text-right text-sm font-semibold tabular-nums text-brand sm:text-base">
                      {o.genelBrut}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* <sm: mini kartlar (tablo yerine) */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:hidden">
              {OFISLER_GOSTERILEN.map((o, i) => (
                <div
                  key={o.id}
                  className="rounded-2xl bg-section p-4 ring-1 ring-line"
                  style={alt(0.36 + i * 0.06)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">
                      {o.ad}
                      {!olcuDogrulandi(o.id) && <MockIsaret />}
                    </p>
                    <span className="rounded-full bg-brand/[0.06] px-2.5 py-1 text-xs font-semibold tabular-nums text-brand-dark ring-1 ring-brand/10">
                      {o.genelBrut} m²
                    </span>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs tabular-nums text-muted">
                    <span>Net {o.net} m²</span>
                    <span>Brüt {o.brut} m²</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-line pt-5">
              {/* Doğrulanmamış ölçüler: MOCK_GOSTER=true iken işaretli + dipnotlu,
                  false iken tablodan komple düşer ve "paylaşılacaktır" notu kalır.
                  "Ölçüler katalog verisidir" iddiası KALDIRILDI — Ofis 2 ve 4 ölçüleri
                  ofisler.ts'te placeholder; doğrulanmamış sayı katalog verisi diye sunulamaz. */}
              {OLCU_BEKLEYEN.length > 0 && (
                <p className="mb-2 text-xs leading-relaxed text-brand-dark">
                  {MOCK_GOSTER ? (
                    <>
                      <span aria-hidden="true">*</span> {OLCU_BEKLEYEN_METIN} ölçüleri henüz
                      doğrulanmadı; teyit edildiğinde güncellenecektir.
                    </>
                  ) : (
                    <>{OLCU_BEKLEYEN_METIN} ölçüleri paylaşılacaktır.</>
                  )}
                </p>
              )}
              <p className="text-xs leading-relaxed text-muted">
                Net: kullanılabilir iç alan. Brüt: duvarlar dahil. Genel brüt: ortak alan payı
                dahil. Sözleşmedeki onaylı ölçüler esastır.
              </p>
              <Link
                to="/ofislerimiz"
                className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
              >
                İnteraktif Planı İncele
                <ArrowRight
                  weight="bold"
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   5 — HİZMETLER (bg-page; kart bento, 2 foto)
   TEYİT — hizmet ADLARI gerçek; kapsam/koşul (saat, rezervasyon, salon
   kapasitesi, sekreterya görev tanımı, ücret) proje verisinde YOK → metinler
   bilinçli olarak sayısız tutuldu. Güvenlik burada GEÇMEZ (6. bölümün konusu).
   ════════════════════════════════════════════════════════════════════════ */
function Hizmetler() {
  const { ref, reveal } = useReveal<HTMLElement>(0.12)

  return (
    <section
      ref={ref}
      id="hizmetler"
      aria-labelledby="hizmetler-baslik"
      className="scroll-mt-32 bg-page"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 lg:py-28">
        <div style={reveal(0)}>
          <BolumBasligi
            id="hizmetler-baslik"
            etiket="Hizmetler"
            baslik="Beş Hizmet, Tek Çatı Altında"
            aciklama="Karşılama, toplantı, baskı ve otopark düzeni; küçük ve orta ölçekli ekiplerin çoğu zaman kendi imkânlarıyla kurduğu işlerdir. Burada bunların hepsi binanın ortak alanlarında hazır. Ofisiniz sadece çalıştığınız yer olarak kalır."
          />
        </div>

        {/* DOM sırası = içerik sırası (01→05); masaüstü bento `order` ile kurulur.
            01 ve 02'nin reveal gecikmesi EŞİT: mobilde DOM sırası (01→02), masaüstünde
            görsel sıra (02→01) ters işliyor; eşitleme iki dizilimde de doğru akıtır.
            (Eskiden 01=reveal(2), 02=reveal(1) idi → mobilde üstteki kart alttakinden
            SONRA beliriyordu.) */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {/* 01 — Vale Hizmeti (ikon kart) */}
          <article
            className={`${CARD} flex h-full flex-col p-5 lg:order-2 lg:p-7`}
            style={reveal(1)}
          >
            <IconBadge
              Icon={Car}
              className="[&_svg]:transition-transform [&_svg]:duration-500 group-hover:[&_svg]:translate-x-1 motion-reduce:group-hover:[&_svg]:translate-x-0"
            />
            <div className="mt-3">
              <Num dekoratif>01</Num>
              <h3 className="mt-1 text-lg font-semibold leading-snug text-ink lg:text-xl">
                Vale Hizmeti
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Aracınızı bina girişinde bırakırsınız; vale üç katlı otoparka yerleştirir. Siz de
                ziyaretçileriniz de sabah park yeri aramakla vakit kaybetmezsiniz.
              </p>
            </div>
          </article>

          {/* 02 — Toplantı Salonları (geniş foto kart) */}
          <article
            className={`${CARD} flex h-full flex-col-reverse lg:order-1 lg:col-span-2 lg:flex-row`}
            style={reveal(1)}
          >
            <div className="flex flex-1 flex-col p-5 lg:w-[52%] lg:flex-none lg:justify-center lg:p-7">
              <IconBadge Icon={UsersThree} />
              <div className="mt-3">
                <Num dekoratif>02</Num>
                <h3 className="mt-1 text-lg font-semibold leading-snug text-ink lg:text-xl">
                  Toplantı Salonları
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Kalabalık sunumlar ve müşteri görüşmeleri için binanın ortak toplantı salonlarını
                  kullanırsınız. Sürekli kullanmadığınız bir toplantı odası için kendi ofisinizden
                  metrekare ayırmanız gerekmez.
                </p>
              </div>
            </div>
            <div className="relative h-44 shrink-0 overflow-hidden lg:h-auto lg:min-h-[240px] lg:flex-1 lg:shrink">
              <img
                src="/images/why/toplanti.jpg"
                alt="idealofis toplantı salonu"
                loading="lazy"
                decoding="async"
                className={IMG}
              />
            </div>
          </article>

          {/* 03 — Lobby & Resepsiyon (dikey foto kart) */}
          <article className={`${CARD} flex h-full flex-col lg:order-3`} style={reveal(2)}>
            <div className="relative h-44 shrink-0 overflow-hidden lg:h-40">
              <img
                src="/images/why/lobby.jpg"
                alt="idealofis lobi ve resepsiyon alanı"
                loading="lazy"
                decoding="async"
                className={IMG}
              />
            </div>
            <div className="flex flex-1 flex-col p-5 lg:p-6">
              <IconBadge Icon={Armchair} />
              <div className="mt-3">
                <Num dekoratif>03</Num>
                <h3 className="mt-1 text-lg font-semibold leading-snug text-ink lg:text-xl">
                  Lobby &amp; Resepsiyon
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Misafiriniz binanın girişinde karşılanır, siz hazır olana kadar lobide ağırlanır.
                  İlk izlenim ofis kapınızda değil, binanın girişinde başlar.
                </p>
              </div>
            </div>
          </article>

          {/* 04 — Ortak Sekreterya (ikon kart) */}
          <article
            className={`${CARD} flex h-full flex-col p-5 lg:order-4 lg:p-7`}
            style={reveal(3)}
          >
            <IconBadge Icon={Headset} />
            <div className="mt-3">
              <Num dekoratif>04</Num>
              <h3 className="mt-1 text-lg font-semibold leading-snug text-ink lg:text-xl">
                Ortak Sekreterya
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Karşılama ve yönlendirme gibi işler bina genelinde ortak sekreterya tarafından
                yürütülür. Birkaç kişilik bir ekip, sırf bu iş için ayrı bir kişi çalıştırmak
                zorunda kalmaz.
              </p>
            </div>
          </article>

          {/* 05 — Copy Center (ikon kart; sm'de geniş → içerik yatay dizilir) */}
          <article
            className={`${CARD} flex h-full flex-col p-5 sm:col-span-2 sm:flex-row sm:items-center sm:gap-5 lg:order-5 lg:col-span-1 lg:flex-col lg:items-start lg:gap-0 lg:p-7`}
            style={reveal(4)}
          >
            <IconBadge
              Icon={Printer}
              className="[&_svg]:transition-transform [&_svg]:duration-500 group-hover:[&_svg]:-translate-y-0.5 motion-reduce:group-hover:[&_svg]:translate-y-0"
            />
            <div className="mt-3 sm:mt-0 lg:mt-3">
              <Num dekoratif>05</Num>
              <h3 className="mt-1 text-lg font-semibold leading-snug text-ink lg:text-xl">
                Copy Center
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Baskı ve fotokopi işleri bina içindeki ortak merkezde yapılır. Her ofisin kendi
                yazıcı ve sarf malzemesi düzenini kurmasına gerek kalmaz.
              </p>
            </div>
          </article>
        </div>

        <p
          className="mx-auto mt-8 max-w-xl text-center text-xs leading-relaxed text-muted lg:mt-10"
          style={reveal(5)}
        >
          Ortak hizmetler bina yönetimi tarafından sunulur; kapsam ve çalışma saatleri bina
          yönetimince belirlenir.
        </p>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   6 — GÜVENLİK (bg-ink — sayfanın TEK koyu bandı)
   Katalogda olmayan hiçbir teknik iddia YOK (kamera adedi, kayıt süresi,
   kartlı geçiş, 7/24 personel). text-white YASAK → yalnız text-page tonları.
   KONTRAST: koyu zeminde küçük uppercase etiketler text-page/70 (≈6,9:1) —
   IletisimCta ile aynı. text-brand (#e2001a) ink üzerinde ~3,7:1 kalıyor, 12px
   metin için AA (4,5:1) altında → etiketlerde kullanılmaz. Kırmızı vurgu koyu
   zeminde ikon / çizgi / rozet halkasında kalır (dekoratif, metin değil).
   ════════════════════════════════════════════════════════════════════════ */
const KATMANLAR = [
  {
    num: '01',
    kapsam: 'Bina girişi',
    baslik: 'Kontrollü Giriş-Çıkış',
    metin:
      'Binaya giriş ve çıkışlar kontrol altındadır. Ziyaretçiler lobide karşılanır; ofisinize ulaşmadan önce kim olduğu bilinir.',
    Icon: IdentificationBadge,
    ikonSinif: '',
  },
  {
    num: '02',
    kapsam: 'Ortak alanlar',
    baslik: 'Kamera Sistemi',
    metin:
      'Binanın ortak alanları kamera sistemiyle izlenir. Ofis kapınızın dışında kalan bölüm — giriş, lobi, koridorlar — gözetim dışında kalmaz.',
    Icon: SecurityCamera,
    ikonSinif: '',
  },
  {
    num: '03',
    kapsam: 'Ofis kapısı',
    baslik: 'İntercom',
    metin:
      'İntercom, ofisiniz ile bina girişi arasında doğrudan bağlantı kurar. Kapıyı açmadan önce görüşür, ziyaretçiyi kendiniz onaylarsınız.',
    Icon: PhoneCall,
    ikonSinif: '',
  },
  {
    num: '04',
    kapsam: 'Yapının kendisi',
    baslik: 'Yangın Güvenlik Altyapısı',
    metin:
      'Yangın güvenlik altyapısı proje kapsamındadır. Güvenlik yalnızca kapıda değil, yapının kendi sistemlerinde de tanımlıdır.',
    Icon: FireExtinguisher,
    // imza ışıma — anasayfa GuvenlikCard ile birebir aynı değer
    ikonSinif:
      '[&_svg]:transition-[filter] [&_svg]:duration-500 group-hover:[&_svg]:drop-shadow-[0_0_10px_rgba(226,0,26,0.6)]',
  },
]

const KART_KOYU =
  'group relative overflow-hidden rounded-[28px] bg-page/[0.04] ring-1 ring-page/10 backdrop-blur-sm ' +
  'shadow-[0_1px_2px_rgba(0,0,0,0.2),0_18px_40px_-24px_rgba(0,0,0,0.6)] ' +
  'transition-[transform,box-shadow,background-color] duration-500 ' +
  'hover:-translate-y-1.5 hover:bg-page/[0.06] hover:ring-page/20 ' +
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0'

function Guvenlik() {
  const { ref, shown, reduce, reveal } = useReveal<HTMLElement>(0.15)

  return (
    <section
      ref={ref}
      id="guvenlik"
      aria-labelledby="guvenlik-baslik"
      className="scroll-mt-32 bg-ink"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          {/* SOL — başlık + görsel */}
          <div className="lg:sticky lg:top-28">
            <div style={reveal(0)}>
              <BolumBasligi
                id="guvenlik-baslik"
                etiket="Güvenlik"
                baslik="Dört Katmanlı Güvenlik"
                ton="koyu"
                hiza="sol"
                aciklama={
                  <>
                    “Güvenli bina” cümlesi tek başına bir şey söylemez.{' '}
                    <BrandWord idealClass="text-page" />’te
                    güvenlik, dışarıdan içeriye doğru birbirini tamamlayan dört bileşenden oluşur:
                    binaya kimin girdiği, ortak alanlarda ne olduğu, ofis kapınızı kimin çaldığı ve
                    beklenmedik bir durumda yapının kendisinin ne yaptığı.
                  </>
                }
              />
            </div>

            <div
              className="relative mt-10 aspect-[16/10] overflow-hidden rounded-[28px] ring-1 ring-page/10 lg:aspect-[4/3]"
              style={
                reduce
                  ? undefined
                  : {
                      opacity: shown ? 1 : 0,
                      transform: shown ? 'translateY(0) scale(1)' : 'translateY(24px) scale(1.04)',
                      transition: `opacity 0.6s ${EASE} 0.08s, transform 0.9s ${EASE} 0.08s`,
                    }
              }
            >
              <img
                src="/images/hero/hero-0193.jpg"
                alt="idealofis bina dış cephesi, Bayraklı"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
              />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 ring-1 ring-page/10 backdrop-blur">
                <ShieldCheck weight="duotone" size={14} aria-hidden="true" className="text-brand" />
                <span className="text-[11px] font-medium text-page/80">
                  Güvenlik binanın girişinde başlar
                </span>
              </span>
            </div>
          </div>

          {/* SAĞ — dört katman zinciri (dışarıdan içeriye)
              role="list" ŞART: Preflight list-style'ı kaldırınca Safari + VoiceOver listeyi
              liste diye duyurmuyor. Burada SIRA anlamlı (01→04 dışarıdan içeriye) ve "01"
              rozetleri aria-hidden → liste semantiği düşerse sıra bilgisi tamamen kaybolur. */}
          <ol role="list" className="relative flex flex-col gap-4">
            {KATMANLAR.map((k, i) => (
              <li key={k.num} className="relative" style={reveal(2 + i)}>
                <article className={`${KART_KOYU} p-5 lg:p-6`}>
                  <div className="flex items-start gap-4 lg:gap-5">
                    <IconBadgeKoyu Icon={k.Icon} className={k.ikonSinif} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span
                          aria-hidden="true"
                          className="text-sm font-semibold tracking-[0.14em] text-brand"
                        >
                          {k.num}
                        </span>
                        <span className="rounded-full bg-page/[0.06] px-2.5 py-1 text-[11px] font-medium text-page/60 ring-1 ring-page/10">
                          {k.kapsam}
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-lg font-semibold leading-snug text-page lg:text-xl">
                        {k.baslik}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-page/70">{k.metin}</p>
                    </div>
                  </div>
                </article>
                {/* zincir: rozet merkezi = p-5 (20px) + h-10/2 (20px) = 40px · lg: 24 + 24 = 48px */}
                {i < KATMANLAR.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[40px] top-full h-4 w-px bg-brand/40 lg:left-[48px]"
                    style={
                      reduce
                        ? undefined
                        : {
                            transform: `scaleY(${shown ? 1 : 0})`,
                            transformOrigin: 'top',
                            transition: `transform 0.45s ${EASE} ${(2 + i) * 0.08 + 0.28}s`,
                          }
                    }
                  />
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex items-start gap-2" style={reveal(6)}>
          <Info
            weight="duotone"
            size={14}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-page/55"
          />
          <p className="text-xs leading-relaxed text-page/55">
            Kamera kapsamı, sistem markaları ve teknik detaylar proje kataloğunda yer almaz; satış
            ofisimizden öğrenebilirsiniz.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   7 — YATIRIM (bg-page + koyu kapanış paneli)
   ⚠️ Bu SON bölümdür; kapanış paneli <IletisimCta /> bileşeninin YERİNE geçer →
   sayfaya IletisimCta EKLENMEZ (yoksa iki koyu CTA + koyu Footer üst üste yığılır).
   Yüzde / getiri / değer artışı rakamı YOK → "yatırım tavsiyesi değildir" notu zorunlu.
   ════════════════════════════════════════════════════════════════════════ */
const DEGER_KARTLARI = [
  {
    Icon: Bank,
    baslik: 'Adliye Ekosistemi',
    metin:
      'Adalet Sarayı ve İstinaf Mahkemeleri yürüme mesafesinde. Hukuk büroları, mali müşavirler ve danışmanlık ofisleri için adliyeye yürüyerek gidebilmek, günlük iş akışını doğrudan kolaylaştırır.',
  },
  {
    Icon: Train,
    baslik: 'Ulaşımın Kesiştiği Nokta',
    metin:
      'Metro ve İzban durakları yürüme mesafesinde. Ekibinizin ve müşterilerinizin toplu taşımayla kolayca ulaşabildiği bir ofis, hem çalışanın hem ziyaretçinin gününü kısaltır.',
  },
  {
    Icon: Ruler,
    baslik: 'Doğru Ölçek',
    metin:
      'Dört farklı plan tipi; iki kişilik bir bürodan yerleşik bir ekibe kadar farklı ihtiyaçlara uyan bir ölçek aralığı. Hangi planın size uyduğunu ölçüleriyle birlikte teknik künyede görebilirsiniz.',
  },
]

// m² aralığı MOCK (uçları placeholder) → MOCK_GOSTER=false iken şeritten düşer;
// sütun sayısı öğe sayısına göre kendini kurar.
const KANIT_TUM: { Icon: PhIcon; ust: string; altSatir: string; mock?: boolean }[] = [
  { Icon: Bank, ust: '400 m', altSatir: 'Adalet Sarayı' },
  { Icon: Train, ust: '550 m', altSatir: 'Sanayi Metro' },
  { Icon: Stack, ust: '102 ofis', altSatir: '8 katlı butik bina' },
  { Icon: Ruler, ust: `${M2_ARALIK} m²`, altSatir: 'Genel brüt aralığı', mock: M2_MOCK },
]
const KANIT = KANIT_TUM.filter((c) => MOCK_GOSTER || !c.mock)

function Yatirim() {
  const { ref, shown, reduce, reveal, alt } = useReveal<HTMLElement>(0.12)

  return (
    <section
      ref={ref}
      id="yatirim"
      aria-labelledby="yatirim-baslik"
      className="scroll-mt-32 bg-page"
    >
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-24">
        <div style={reveal(0)}>
          <BolumBasligi
            id="yatirim-baslik"
            etiket="Yatırım Değeri"
            baslik="Bayraklı Büyürken Doğru Noktada Olmak"
            aciklama={
              <>
                Bayraklı, İzmir’in yeni iş merkezi olarak büyümeye devam ediyor. <BrandWord /> bu
                büyümenin ortasında; adliyenin, metronun ve İzban’ın yürüme mesafesinde olduğu bir
                noktada duruyor. Bir ofisin uzun vadeli değerini belirleyen şey, çoğu zaman binanın
                kendisinden çok bulunduğu yerdir.
              </>
            }
          />
        </div>

        {/* ÜÇ DEĞER KARTI — RAKAM YOK (kanıt şeridi bir kez veriyor).
            İçlerinde link YOK → tıklanamaz → CARD_SABIT (hover lift yok). */}
        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {DEGER_KARTLARI.map((k, i) => (
            <article key={k.baslik} className={CARD_SABIT} style={reveal(1 + i)}>
              <div className="flex h-full flex-col p-6 lg:p-7">
                <IconBadge Icon={k.Icon} />
                <h3 className="mt-4 text-lg font-semibold leading-snug text-ink lg:text-xl">
                  {k.baslik}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{k.metin}</p>
              </div>
            </article>
          ))}
        </div>

        {/* KANIT ŞERİDİ */}
        <div
          className="mt-5 rounded-[28px] bg-section px-6 py-6 ring-1 ring-black/[0.03] lg:px-8 lg:py-7"
          style={reveal(4)}
        >
          <p className="text-sm font-semibold text-ink">Özetle</p>
          <div
            className={`mt-4 grid grid-cols-2 gap-4 lg:gap-6 ${
              KANIT.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
            }`}
          >
            {KANIT.map((c, i) => (
              <div
                key={c.altSatir}
                className={`flex items-center gap-3 ${
                  i > 0 ? 'lg:border-l lg:border-line lg:pl-6' : ''
                }`}
                style={alt(4 * 0.08 + i * 0.06)}
              >
                <c.Icon
                  weight="duotone"
                  size={22}
                  aria-hidden="true"
                  className="shrink-0 text-brand"
                />
                <div>
                  <p className="text-sm font-semibold tabular-nums text-ink">
                    {c.ust}
                    {c.mock && <MockIsaret />}
                  </p>
                  <p className="text-xs leading-snug text-muted">{c.altSatir}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">
            Buradaki bilgiler tanıtım amaçlıdır; yatırım tavsiyesi niteliği taşımaz. Getiri veya
            değer artışı taahhüdü verilmez.
          </p>
        </div>

        {/* KAPANIŞ PANELİ — IletisimCta'nın yerine geçer */}
        <div
          className="relative mt-5 overflow-hidden rounded-[32px] bg-ink px-6 py-14 text-center sm:px-10 lg:py-16"
          style={reveal(5)}
        >
          <img
            src="/images/why/lokasyon.jpg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={
              reduce
                ? { opacity: 0.18 }
                : {
                    opacity: shown ? 0.18 : 0,
                    transform: shown ? 'scale(1)' : 'scale(1.06)',
                    transition: `opacity 1.2s ${EASE}, transform 1.2s ${EASE}`,
                  }
            }
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/85 to-ink"
          />

          <div className="relative z-10 mx-auto max-w-xl">
            {/* koyu zemin → etiket text-page/70 (IletisimCta ile aynı; text-brand AA altı) */}
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-page/70">
              Sonraki Adım
            </p>
            {/* h3, bölüm h2'lerinin (3xl/4xl) bir kademe altında kalır */}
            <h3 className="mt-3 text-xl font-semibold text-page sm:text-2xl">
              Karar vermeden önce planları görün
            </h3>
            <p className="mt-4 text-base leading-relaxed text-page/70">
              Dört plan tipi, 102 ofis, tek bina. Size uygun olanı önce ekranda inceleyin; sonra
              Bayraklı’da yerinde gezelim.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              {/* Sayfanın BİRİNCİL CTA'sı → focus-visible zinciri IletisimCta.tsx'teki birebir
                  aynı görünümlü butonla AYNI (koyu zeminde açık halka + ink offset). Klavyeyle
                  gezen kullanıcı en önemli dönüşüm butonunda zayıf odak görmesin. */}
              <Link
                to="/ofislerimiz"
                className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-page shadow-[0_14px_28px_-10px_rgba(226,0,26,0.55)] transition-[background-color,transform] hover:bg-brand-dark active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-page/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ink motion-reduce:transition-none"
              >
                Ofisleri Keşfet
                <ArrowRight
                  weight="bold"
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
              </Link>
              {/* MOCK — Kaan gerçeğini verecek (telefon) */}
              <a
                href={TEL_HREF}
                aria-label={`Telefonla arayın: ${TEL}`}
                className="inline-flex items-center gap-2.5 rounded-full border border-page/25 bg-page/10 px-7 py-3.5 text-sm font-medium text-page backdrop-blur transition-[background-color,transform] hover:bg-page/15 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-page/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <Phone weight="fill" size={18} aria-hidden="true" />
                {TEL}
              </a>
              {/* IletisimCta'daki İKİNCİ temas kanalı burada da olmalı: sayfanın kapanışı
                  odur (bu sayfa IletisimCta kullanmıyor) → WhatsApp düşmesin. */}
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp’tan yazın (yeni sekmede açılır)"
                className="inline-flex items-center gap-2.5 rounded-full border border-page/25 bg-page/10 px-7 py-3.5 text-sm font-medium text-page backdrop-blur transition-[background-color,transform] hover:bg-page/15 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-page/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <WhatsappLogo weight="fill" size={18} aria-hidden="true" />
                WhatsApp
              </a>
            </div>
            {/* MOCK — Kaan gerçeğini verecek (satış ofisi konumu + çalışma saatleri).
                Tek kaynak: src/data/iletisim.ts — saatler İletişim sayfasıyla aynı yerden gelir. */}
            <p className="mt-6 text-xs leading-relaxed text-page/60">
              {SATIS_OFISI_KISA} {CALISMA_SAATLERI_KISA}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function NedenIdeal() {
  return (
    <>
      <Acilis />
      <Lokasyon />
      <Mimari />
      <TeknikKunye />
      <Hizmetler />
      <Guvenlik />
      <Yatirim />
    </>
  )
}
