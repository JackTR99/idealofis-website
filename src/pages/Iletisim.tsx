import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Car,
  Buildings,
  Phone,
  WhatsappLogo,
  EnvelopeSimple,
  ArrowRight,
  ArrowUpRight,
  NavigationArrow,
  Copy,
  Check,
  Bank,
  Scales,
  Train,
  TrainRegional,
  Clock,
  CalendarCheck,
  ImageSquare,
  Ruler,
  SealCheck,
  ShieldCheck,
  type Icon as PhIcon,
} from '@phosphor-icons/react'
import LokasyonHarita from '../components/LokasyonHarita'
import BrandWord from '../components/BrandWord'

/* -------------------------------------------------------------------------- */
/* SABİTLER                                                                    */
/* -------------------------------------------------------------------------- */

/* ✅ TEK KAYNAK — KAPANDI. Telefon, WhatsApp, e-posta, adres ve çalışma saatleri artık
   BU DOSYADA TANIMLANMIYOR; hepsi src/data/iletisim.ts içinde tek kez duruyor ve üç dosya
   (Iletisim.tsx, IletisimCta.tsx, NedenIdeal.tsx) oradan okuyor. Kaan gerçek numarayı
   verince YALNIZ o dosya güncellenir; site tamamı aynı anda düzelir.
   Tek fark burada: bu sayfa wa.me bağlantısını hazır mesajla (?text=) açar → WA_HREF_MESAJLI. */
import {
  TEL,
  TEL_HREF,
  WHATSAPP,
  WA_HREF_MESAJLI as WA_HREF,
  EPOSTA,
  EPOSTA_HREF,
  ADRES,
  SATIS_OFISI_NOT,
  MAPS_YOL_TARIFI,
  CALISMA_SAATLERI,
  CALISMA_OZET,
  GUN_ADLARI,
} from '../data/iletisim'

// GERÇEK veri (proje kataloğu)
// TEYİT — kaynakta "İstinaf Mah." yazıyor. "Mahkemesi" mi "Mahallesi" mi belirsiz olduğu için
// kaynaktaki kısaltma AYNEN korunuyor; Kaan doğrulayınca açılabilir.
const MESAFELER: { ad: string; mesafe: string; Icon: PhIcon }[] = [
  { ad: 'Adalet Sarayı', mesafe: '400 m', Icon: Bank },
  { ad: 'İstinaf Mah.', mesafe: '800 m', Icon: Scales },
  { ad: 'Sanayi Metro', mesafe: '550 m', Icon: Train },
  { ad: 'İzban Salhane', mesafe: '1,1 km', Icon: TrainRegional },
]

/* Çalışma saatleri, özet cümle ve gün adları: src/data/iletisim.ts (yukarıda import edildi). */

/* -------------------------------------------------------------------------- */
/* ORTAK YARDIMCILAR                                                           */
/* -------------------------------------------------------------------------- */

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function reduceMotion() {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

/* Sayfa içi çapa bağlantısı.
   index.css'te `html { scroll-behavior: smooth }` KOŞULSUZ tanımlı ve hareket azaltma tercihini
   geri alan bir @media bloğu yok. Global CSS'e dokunmadan burada saygı gösteriyoruz:
   tercihi açık kullanıcıda kaydırma anlık (auto) olur.
   Kalıcı çözüm (ayrı dosya, bu görevin kapsamı dışında):
   @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } } */
function capayaKaydir(e: ReactMouseEvent<HTMLAnchorElement>) {
  const hedefId = e.currentTarget.getAttribute('href')?.slice(1)
  if (!hedefId) return
  const hedef = document.getElementById(hedefId)
  if (!hedef) return
  e.preventDefault()
  hedef.scrollIntoView({
    behavior: reduceMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
  // çapa adres çubuğunda kalsın (paylaşılabilir + geri tuşu çalışır)
  window.history.pushState(null, '', `#${hedefId}`)
}

// görünür alana girince bir kez açılan reveal (WhyIdeal deseni)
function useReveal(threshold = 0.15) {
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
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce, threshold])

  // DİKKAT: reveal() zaten transform yazar → aynı elemana ikinci bir transform verme
  const reveal = (i: number): CSSProperties | undefined =>
    reduce
      ? undefined
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0)' : 'translateY(24px)',
          transition: `opacity 0.6s ${EASE} ${i * 0.08}s, transform 0.7s ${EASE} ${i * 0.08}s`,
        }

  // kırmızı kısa çizgi — reveal'dan AYRI eleman/style (iki transform çakışmasın)
  const cizgiStil = (): CSSProperties | undefined =>
    reduce
      ? undefined
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'center',
          transition: `opacity 0.4s ${EASE} 0.24s, transform 0.7s ${EASE} 0.24s`,
        }

  return { ref, reduce, shown, reveal, cizgiStil }
}

// ortak kart kabuğu
const KART =
  'rounded-[28px] bg-surface ring-1 ring-black/[0.04] ' +
  'shadow-[0_1px_2px_rgba(20,20,20,0.04),0_18px_40px_-24px_rgba(20,20,20,0.16)]'

// ortak birincil buton (dolu kırmızı)
const BTN_BIRINCIL =
  'inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-page ' +
  'shadow-[0_14px_28px_-10px_rgba(226,0,26,0.55)] transition-transform active:scale-[0.97] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'

// AÇIK zeminde bölüm etiketi (kırmızı — kontrast sorunsuz)
const ETIKET = 'text-xs font-semibold uppercase tracking-[0.22em] text-brand'
// KOYU zeminde (bg-ink) bölüm etiketi — kırmızı 12px yazı ink üzerinde ~3,7:1 kalıyor (eşik 4,5:1).
// IletisimCta.tsx ile aynı kalıp: etiket açık renk, kırmızı yalnız dekoratif çizgide/ikonda.
const ETIKET_KOYU = 'text-xs font-semibold uppercase tracking-[0.22em] text-page/70'
const BASLIK = 'mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl'
const CIZGI = 'mx-auto mt-8 block h-1 w-14 rounded-full bg-brand'
// bölüm ritmi — iç sayfa standardı (Ofislerimiz.tsx)
const BOLUM_PY = 'py-24 lg:py-28'

/* -------------------------------------------------------------------------- */
/* 1 — AÇILIŞ                                                                  */
/* -------------------------------------------------------------------------- */

const HIZLI_BILGI: {
  Icon: PhIcon
  ust: string
  alt: string
  to?: string
  cta?: string
}[] = [
  {
    Icon: MapPin,
    ust: 'Bayraklı, İzmir',
    alt: 'Satış ofisi proje binasının içinde',
  },
  {
    Icon: Car,
    ust: 'Otopark ve vale',
    alt: 'Ziyaretinizde araç park derdi yok',
  },
  {
    Icon: Buildings,
    ust: 'Dört ofis tipi',
    alt: 'Planları yerinde karşılaştırın',
    to: '/ofislerimiz',
    cta: 'Planları İncele',
  },
]

// hızlı bilgi hücresinin iç düzeni (li'de yalnız ayraç çizgisi kalır → Link tüm hücreyi kaplar)
const HIZLI_ICERIK =
  'flex h-full items-center gap-3 sm:flex-col sm:items-center sm:px-6 sm:text-center'

function Acilis() {
  const { ref, reduce, shown, reveal, cizgiStil } = useReveal(0.15)

  // rozet ölçeklemesi li'ye DEĞİL, içindeki span'e (reveal'ın transform'unu ezmesin).
  // GİRİŞ transform: scale() ile; HOVER ise sınıftaki group-hover:scale-110 → Tailwind v4'te
  // ayrı `scale:` özelliği. Satır-içi transition shorthand sınıfın listesini ezdiği için
  // `scale`'i buraya da yazmak ŞART, yoksa hover büyümesi yumuşamadan sıçrar.
  const rozet = (i: number): CSSProperties | undefined =>
    reduce
      ? undefined
      : {
          transform: shown ? 'scale(1)' : 'scale(0.92)',
          transition: `transform 0.5s ${EASE} ${i * 0.08}s, scale 0.5s ${EASE}`,
        }

  return (
    <section
      id="iletisim-acilis"
      ref={ref}
      aria-labelledby="iletisim-acilis-baslik"
      className="bg-page"
    >
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-36 lg:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <div style={reveal(0)}>
            {/* etiketler normal yazılır; BÜYÜTME CSS'in işi (uppercase) — lang="tr" ile i → İ doğru */}
            <p className={ETIKET}>İletişim</p>
            <h1 id="iletisim-acilis-baslik" className={BASLIK}>
              Satış Ofisimiz Projenin İçinde
            </h1>
          </div>
          <p className="mt-4 text-base leading-relaxed text-muted" style={reveal(1)}>
            Ofisleri broşürden değil, yerinde görüyorsunuz. Kat planlarını ve ofis tiplerini aynı
            ziyarette birlikte inceliyoruz.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted" style={reveal(2)}>
            Gelmeden önce telefondan veya WhatsApp'tan ulaşın; size uygun ofis tipini ve ziyaret
            saatini birlikte belirleyelim.
          </p>
          <span aria-hidden="true" className={CIZGI} style={cizgiStil()} />

          <div
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            style={reveal(4)}
          >
            <a href={TEL_HREF} className={`${BTN_BIRINCIL} w-full sm:w-auto`}>
              <Phone weight="fill" size={18} aria-hidden="true" />
              {TEL}
            </a>
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-surface px-7 py-3.5 text-sm font-semibold text-ink shadow-[0_1px_2px_rgba(20,20,20,0.04)] ring-1 ring-line transition-colors hover:bg-section focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:w-auto"
            >
              <WhatsappLogo weight="fill" size={18} aria-hidden="true" className="text-brand" />
              WhatsApp'tan Yazın
            </a>
          </div>
        </div>

        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-0">
          {HIZLI_BILGI.map(({ Icon, ust, alt, to, cta }, i) => {
            const govde = (
              <>
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/[0.06] ring-1 ring-brand/10 transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:mb-3"
                  style={rozet(5 + i)}
                >
                  <Icon weight="duotone" size={22} aria-hidden="true" className="text-brand" />
                </span>
                <span className="block">
                  <span className="block text-sm font-medium text-ink">{ust}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted">{alt}</span>
                  {cta && (
                    <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors group-hover:text-brand-dark">
                      {cta}
                      <ArrowRight
                        weight="bold"
                        size={14}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                      />
                    </span>
                  )}
                </span>
              </>
            )

            return (
              <li
                key={ust}
                className={i > 0 ? 'sm:border-l sm:border-line' : ''}
                style={reveal(5 + i)}
              >
                {to ? (
                  <Link
                    to={to}
                    className={`${HIZLI_ICERIK} group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand`}
                  >
                    {govde}
                  </Link>
                ) : (
                  <div className={HIZLI_ICERIK}>{govde}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* 2 — İLETİŞİM KANALLARI                                                      */
/* -------------------------------------------------------------------------- */

interface Kanal {
  id: string
  Icon: PhIcon
  etiket: string
  deger: string
  aciklama: string
  aksiyon: string
  href: string
  ariaLabel: string
  dis: boolean // dış bağlantı → yeni sekme + ArrowUpRight
  sayisal: boolean
  ekSinif?: string
}

/* ariaLabel kuralı (WCAG 2.5.3 — Label in Name): erişilebilir ad, kartta GÖRÜNEN aksiyon
   metniyle BAŞLAR. Aksi halde ses komutuyla "Hemen Ara" diyen kullanıcı bağlantıyı tetikleyemez;
   aria-label görünen metni addan siler. Bu yüzden ad = <aksiyon> + em dash + ek bağlam. */
const KANALLAR: Kanal[] = [
  {
    id: 'telefon',
    Icon: Phone,
    etiket: 'Telefon',
    deger: TEL,
    aciklama: 'Doğrudan satış ofisimize bağlanın; sorularınızı telefonda yanıtlayalım.',
    aksiyon: 'Hemen Ara',
    href: TEL_HREF,
    ariaLabel: `Hemen Ara — Telefonla ara: ${TEL}`,
    dis: false,
    sayisal: true,
  },
  {
    id: 'whatsapp',
    Icon: WhatsappLogo,
    etiket: 'WhatsApp',
    deger: WHATSAPP,
    aciklama: 'Ofis planlarını ve detayları WhatsApp üzerinden paylaşalım.',
    aksiyon: "WhatsApp'tan Yaz",
    href: WA_HREF,
    ariaLabel: `WhatsApp'tan Yaz — ${WHATSAPP} numarasına WhatsApp'tan yazın (yeni sekmede açılır)`,
    dis: true,
    sayisal: true,
  },
  {
    id: 'eposta',
    Icon: EnvelopeSimple,
    etiket: 'E-posta',
    deger: EPOSTA,
    aciklama: 'Detaylı bilgi ve kurumsal talepleriniz için yazın; size dönüş yapalım.',
    aksiyon: 'E-posta Gönder',
    href: EPOSTA_HREF,
    ariaLabel: `E-posta Gönder — ${EPOSTA} adresine e-posta gönderin`,
    dis: false,
    sayisal: false,
    ekSinif: 'sm:col-span-2 lg:col-span-1',
  },
]

/* DİKKAT — transition listesi `translate,scale` (transform DEĞİL). Tailwind v4'te
   hover:-translate-y-1.5 → `translate:` , active:scale-[0.99] → `scale:` özelliğini yazar;
   listede yoksa kart hover'da yumuşamadan zıplar. (Hakkimizda.tsx:75-84 ile aynı kalıp.)
   AYRICA: bu sınıflar reveal() ile AYNI elemana verilemez — reveal satır-içi `transition`
   shorthand'i sınıfın transition-property'sini bütünüyle ezer. Bu yüzden reveal DIŞ div'de,
   hover İÇ <a>'da (bkz. Kanallar). */
const KANAL_KART =
  'group relative flex h-full min-h-[160px] flex-col overflow-hidden rounded-[28px] bg-surface p-6 ring-1 ring-black/[0.04] ' +
  'shadow-[0_1px_2px_rgba(20,20,20,0.04),0_18px_40px_-24px_rgba(20,20,20,0.16)] ' +
  'transition-[translate,scale,box-shadow] duration-500 hover:-translate-y-1.5 ' +
  'hover:shadow-[0_1px_2px_rgba(20,20,20,0.04),0_36px_72px_-28px_rgba(20,20,20,0.34)] active:scale-[0.99] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ' +
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 sm:p-7'

function Kanallar() {
  const { ref, reveal, cizgiStil } = useReveal(0.15)

  return (
    <section
      id="iletisim-kanallari"
      ref={ref}
      aria-labelledby="iletisim-kanallari-baslik"
      className="scroll-mt-28 border-t border-line bg-section"
    >
      <div className={`mx-auto max-w-6xl px-5 ${BOLUM_PY}`}>
        <div className="mx-auto max-w-2xl text-center" style={reveal(0)}>
          <p className={ETIKET}>İletişim Kanalları</p>
          <h2 id="iletisim-kanallari-baslik" className={BASLIK}>
            Bize Ulaşın
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Ofis tipleri, planlar ve yerinde gezme randevusu için size en uygun kanaldan arayın ya
            da yazın.
          </p>
          <span aria-hidden="true" className={CIZGI} style={cizgiStil()} />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {KANALLAR.map((k, i) => {
            const Ok = k.dis ? ArrowUpRight : ArrowRight
            return (
              /* İKİ KATMAN: reveal (opacity+transform) dışta, hover içte.
                 Aynı elemanda olsalardı satır-içi transition, hover geçişini öldürürdü. */
              <div key={k.id} className={`h-full ${k.ekSinif ?? ''}`} style={reveal(1 + i)}>
                <a
                  href={k.href}
                  aria-label={k.ariaLabel}
                  {...(k.dis ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={KANAL_KART}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/[0.06] ring-1 ring-brand/10 transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 lg:h-12 lg:w-12 lg:rounded-2xl">
                    <k.Icon
                      weight="duotone"
                      size={26}
                      aria-hidden="true"
                      className="h-[22px] w-[22px] text-brand lg:h-[26px] lg:w-[26px]"
                    />
                  </span>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {k.etiket}
                  </p>
                  <p
                    className={`mt-1 break-words text-lg font-semibold text-ink sm:text-xl ${
                      k.sayisal ? 'tabular-nums' : ''
                    }`}
                  >
                    {k.deger}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{k.aciklama}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand transition-colors group-hover:text-brand-dark">
                    {k.aksiyon}
                    <Ok
                      weight="bold"
                      size={16}
                      aria-hidden="true"
                      className={`transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 ${
                        k.dis
                          ? 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
                          : 'group-hover:translate-x-1'
                      }`}
                    />
                  </span>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* 3 — KONUM & HARİTA                                                          */
/* -------------------------------------------------------------------------- */

function Konum() {
  const { ref, reduce, shown, reveal, cizgiStil } = useReveal(0.15)
  const [kopya, setKopya] = useState<'bos' | 'ok' | 'hata'>('bos')
  const zaman = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(zaman.current), [])

  async function adresiKopyala() {
    try {
      await navigator.clipboard.writeText(ADRES)
      setKopya('ok')
    } catch {
      // izin yok / güvensiz bağlam → sessizce yutma, kullanıcıya söyle
      setKopya('hata')
    }
    window.clearTimeout(zaman.current)
    zaman.current = window.setTimeout(() => setKopya('bos'), 2000)
  }

  // mesafe satırları: kart belirdikten sonra 60 ms aralıkla
  const satirStil = (i: number): CSSProperties | undefined =>
    reduce
      ? undefined
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity 0.5s ${EASE} ${0.12 + i * 0.06}s, transform 0.6s ${EASE} ${
            0.12 + i * 0.06
          }s`,
        }

  return (
    <section
      id="konum-harita"
      ref={ref}
      aria-labelledby="konum-harita-baslik"
      className="scroll-mt-28 bg-page"
    >
      <div className={`mx-auto max-w-6xl px-5 ${BOLUM_PY}`}>
        <div className="mx-auto max-w-2xl text-center" style={reveal(0)}>
          <p className={ETIKET}>Konum</p>
          <h2 id="konum-harita-baslik" className={BASLIK}>
            Nerede Bulunuyoruz?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Bayraklı'dayız: Adalet Sarayı, Sanayi Metro ve İzban Salhane yürüme mesafesinde. Adliye
            çevresi ve şehir içi ulaşım hatları hemen yanı başınızda.
          </p>
          <span aria-hidden="true" className={CIZGI} style={cizgiStil()} />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
          {/* HARİTA KARTI — hep açık (dokunmatikte hover yok) */}
          <div className={`${KART} overflow-hidden`} style={reveal(1)}>
            <div className="relative aspect-square bg-section sm:aspect-[4/3]">
              <LokasyonHarita hep />
            </div>
            <div className="border-t border-line px-5 py-3.5">
              <p className="text-xs leading-relaxed text-muted">
                Harita görseli temsilidir. Kesin konum için yol tarifini kullanın.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* ADRES KARTI — sayfadaki TEK adres kartı.
                reveal DIŞ div'de, hover İÇ div'de (satır-içi transition hover'ı ezmesin);
                transition listesi `translate` — Tailwind v4'te hover:-translate-y-1.5 translate yazar. */}
            <div style={reveal(2)}>
              <div
                className={`${KART} group p-6 transition-[translate,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(20,20,20,0.04),0_36px_72px_-28px_rgba(20,20,20,0.34)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/[0.06] ring-1 ring-brand/10 transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                  <MapPin weight="duotone" size={26} aria-hidden="true" className="text-brand" />
                </span>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">Satış Ofisi</p>
                <h3 className="text-lg font-semibold text-ink">Adres</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink">{ADRES}</p>
                <p className="mt-1 text-sm text-muted">{SATIS_OFISI_NOT}</p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={MAPS_YOL_TARIFI}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Yol tarifi al — haritada yeni sekmede açılır"
                    className={`${BTN_BIRINCIL} w-full sm:w-auto`}
                  >
                    <NavigationArrow weight="fill" size={18} aria-hidden="true" />
                    Yol Tarifi Al
                  </a>
                  {/* min-w sabit → metin değişince kart zıplamaz (CLS yok).
                      Butonun ADI sabit (aria-label); değişen metin aria-hidden.
                      Durum bildirimi butonun DIŞINDA, ayrı bir canlı bölgede. */}
                  <button
                    type="button"
                    onClick={adresiKopyala}
                    aria-label="Adresi kopyala"
                    className="inline-flex min-h-11 min-w-[9.5rem] items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold text-brand transition-colors hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {kopya === 'ok' ? (
                      <Check weight="bold" size={18} aria-hidden="true" />
                    ) : (
                      <Copy weight="duotone" size={18} aria-hidden="true" />
                    )}
                    <span aria-hidden="true">
                      {kopya === 'ok'
                        ? 'Adres kopyalandı'
                        : kopya === 'hata'
                          ? 'Kopyalanamadı'
                          : 'Adresi Kopyala'}
                    </span>
                  </button>
                  <span role="status" aria-live="polite" className="sr-only">
                    {kopya === 'ok'
                      ? 'Adres panoya kopyalandı'
                      : kopya === 'hata'
                        ? 'Adres kopyalanamadı'
                        : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* MESAFELER KARTI */}
            <div className={`${KART} p-6 sm:p-7`} style={reveal(3)}>
              <h3 className="text-lg font-semibold text-ink">Çevredeki Mesafeler</h3>
              <ul className="mt-4 flex flex-col">
                {MESAFELER.map((m, i) => (
                  <li
                    key={m.ad}
                    className="flex items-center gap-3 border-b border-line py-3 last:border-0"
                    style={satirStil(i)}
                  >
                    <m.Icon weight="duotone" size={18} aria-hidden="true" className="text-brand" />
                    <span className="flex-1 text-sm font-medium text-ink">{m.ad}</span>
                    <span className="text-sm font-semibold tabular-nums text-ink">{m.mesafe}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Mesafeler yaklaşık değerlerdir; bilgi amaçlıdır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* 4 — ÇALIŞMA SAATLERİ                                                        */
/* -------------------------------------------------------------------------- */

// bugün henüz açılmadıysa "bugün 09:00"; değilse 7 gün ileri bakıp ilk açık günü döndürür
function sonrakiAcilis(gun: number, saat: string): string | null {
  const bugun = CALISMA_SAATLERI.find((s) => s.gunIndeksleri.includes(gun))
  if (bugun?.ac && saat < bugun.ac) return `bugün ${bugun.ac}`
  for (let i = 1; i <= 7; i++) {
    const g = (gun + i) % 7
    const s = CALISMA_SAATLERI.find((x) => x.gunIndeksleri.includes(g))
    if (s?.ac) return `${GUN_ADLARI[g]} ${s.ac}`
  }
  return null
}

function Saatler() {
  const { ref, reduce, shown, reveal, cizgiStil } = useReveal(0.15)
  // İstanbul saati SADECE istemcide hesaplanır → ilk boyamada rozet/"Bugün" yok (yanlış gün flaşı olmaz)
  const [gun, setGun] = useState<number | null>(null)
  const [saat, setSaat] = useState<string | null>(null)

  useEffect(() => {
    const harita: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    }

    const hesapla = () => {
      const simdi = new Date()
      const kisa = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Istanbul',
        weekday: 'short',
      }).format(simdi)
      setGun(harita[kisa])
      setSaat(
        new Intl.DateTimeFormat('tr-TR', {
          timeZone: 'Europe/Istanbul',
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h23', // hour12:false bazı motorlarda gece yarısını "24:00" verir
        }).format(simdi),
      )
    }

    hesapla()
    // Sekme açık bırakılırsa rozet bayatlamasın: dakikada bir tazele.
    // Sekme arka plandayken tarayıcı timer'ı kısar → sekmeye dönüşte de yeniden hesapla
    // (gece yarısını geçen oturumlarda "Bugün" vurgusu doğru satıra kayar).
    const sayac = window.setInterval(hesapla, 60_000)
    const gorunurlukDegisti = () => {
      if (document.visibilityState === 'visible') hesapla()
    }
    document.addEventListener('visibilitychange', gorunurlukDegisti)

    return () => {
      window.clearInterval(sayac)
      document.removeEventListener('visibilitychange', gorunurlukDegisti)
    }
  }, [])

  const hazir = gun !== null && saat !== null
  const bugunSatiri = hazir
    ? CALISMA_SAATLERI.find((s) => s.gunIndeksleri.includes(gun))
    : undefined
  // 'HH:MM' sıfır dolgulu → sözlük karşılaştırması yeterli
  const acikMi = !!(
    hazir &&
    bugunSatiri?.ac &&
    bugunSatiri.kapa &&
    bugunSatiri.ac <= saat &&
    saat < bugunSatiri.kapa
  )
  const sonraki = hazir && !acikMi ? sonrakiAcilis(gun, saat) : null

  // kart belirdikten sonra iç öğeler sırayla
  const ic = (gecikme: number): CSSProperties | undefined =>
    reduce
      ? undefined
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity 0.5s ${EASE} ${gecikme}s, transform 0.6s ${EASE} ${gecikme}s`,
        }

  const rozetStil: CSSProperties = {
    opacity: hazir ? 1 : 0,
    transition: reduce ? undefined : `opacity 0.4s ${EASE}`,
  }

  return (
    <section
      id="calisma-saatleri"
      ref={ref}
      aria-labelledby="calisma-saatleri-baslik"
      className="scroll-mt-28 border-y border-line bg-section"
    >
      <div className={`mx-auto max-w-6xl px-5 ${BOLUM_PY}`}>
        <div className="mx-auto max-w-2xl text-center" style={reveal(0)}>
          <p className={ETIKET}>Ziyaret Saatleri</p>
          <h2 id="calisma-saatleri-baslik" className={BASLIK}>
            Satış Ofisi Çalışma Saatleri
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Satış ofisimiz hafta içi ve cumartesi açık. Gelmeden önce kısa bir telefon yeterli; sizi
            karşılamaya hazır olalım.
          </p>
          <span aria-hidden="true" className={CIZGI} style={cizgiStil()} />
        </div>

        <div className={`mx-auto mt-12 max-w-3xl overflow-hidden ${KART}`} style={reveal(1)}>
          {/* ÜST BAND */}
          <div
            className="flex flex-col items-start gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"
            style={ic(0.18)}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/[0.06] ring-1 ring-brand/10 lg:h-12 lg:w-12">
                <Clock weight="duotone" size={24} aria-hidden="true" className="text-brand" />
              </span>
              <span className="block">
                <span className="block text-sm font-semibold text-ink">Satış Ofisi</span>
                <span className="block text-xs text-muted">{CALISMA_OZET}</span>
              </span>
            </div>

            {/* aria-live YOK: rozet, kullanıcı eylemine verilen bir yanıt değil — yalnızca
                istemcide geç hesaplanan statik bilgi. Canlı bölge olsaydı ekran okuyucu, sayfa
                açılışında kullanıcı hiçbir şey yapmadan "Şu an açık/kapalı" diye okurdu.
                Rozet zaten kartın normal okuma sırasında yer alıyor. */}
            <div className="sm:text-right" style={rozetStil}>
              {hazir && (
                <>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
                      acikMi
                        ? 'bg-brand/[0.06] text-brand-dark ring-brand/15'
                        : 'bg-section text-muted ring-line'
                    }`}
                  >
                    {/* .ofis-dot halkası currentColor kullanır → noktaya text-brand şart */}
                    <span
                      aria-hidden="true"
                      className={
                        acikMi
                          ? 'ofis-dot block h-2 w-2 rounded-full bg-brand text-brand'
                          : 'block h-2 w-2 rounded-full bg-muted'
                      }
                    />
                    {acikMi ? 'Şu an açık' : 'Şu an kapalı'}
                  </span>
                  {!acikMi && sonraki && (
                    <span className="mt-1 block text-xs text-muted">Sonraki açılış: {sonraki}</span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* SATIRLAR */}
          <dl className="divide-y divide-line">
            {CALISMA_SAATLERI.map((s, i) => {
              const bugun = hazir && s.gunIndeksleri.includes(gun)
              return (
                <div
                  key={s.id}
                  className={`relative flex items-center justify-between gap-4 px-6 py-4 sm:px-8 sm:py-5 ${
                    bugun ? 'bg-brand/[0.04]' : ''
                  }`}
                  style={ic(0.26 + i * 0.08)}
                >
                  {bugun && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-full w-[3px] bg-brand"
                    />
                  )}
                  <dt
                    className={`text-sm font-medium sm:text-base ${
                      bugun ? 'text-brand' : 'text-ink'
                    }`}
                  >
                    {s.gun}
                    {bugun && (
                      <span className="ml-2 inline-flex rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand-dark">
                        Bugün
                      </span>
                    )}
                  </dt>
                  <dd className="text-right">
                    <span
                      className={`block whitespace-nowrap text-sm font-semibold tabular-nums sm:text-base ${
                        s.ac ? 'text-ink' : 'text-muted'
                      }`}
                    >
                      {s.ac && s.kapa ? `${s.ac} – ${s.kapa}` : 'Kapalı'}
                    </span>
                    {s.not && <span className="mt-0.5 block text-xs text-muted">{s.not}</span>}
                  </dd>
                </div>
              )
            })}
          </dl>

          {/* ALT NOT */}
          <div className="border-t border-line bg-brand/[0.03] px-6 py-5 sm:px-8" style={ic(0.5)}>
            <div className="flex items-start gap-3">
              <CalendarCheck
                weight="duotone"
                size={20}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-brand"
              />
              <div>
                <p className="text-sm font-medium text-ink">
                  Randevu ile hafta sonu da gezebilirsiniz.
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Pazar günü ya da mesai saatleri dışında gezmek isterseniz önceden haber verin;
                  size özel bir randevu saati ayarlayalım.
                </p>
                <a
                  href="#iletisim-kanallari"
                  onClick={capayaKaydir}
                  className="group mt-1 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-dark transition-colors hover:text-brand"
                >
                  Randevu için bize ulaşın
                  <ArrowRight
                    weight="bold"
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* 5 — ALT NOT & KVKK                                                          */
/* -------------------------------------------------------------------------- */

const NOT_ROZET =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand/[0.14] ring-1 ring-brand/25'

function AltNot() {
  const { ref, reduce, shown, reveal } = useReveal(0.15)

  const cizgi: CSSProperties | undefined = reduce
    ? undefined
    : {
        transform: shown ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: `transform 0.6s ${EASE} 0.25s`,
      }

  const filigran: CSSProperties = reduce
    ? { opacity: 0.05 }
    : { opacity: shown ? 0.05 : 0, transition: `opacity 1.2s ${EASE} 0.3s` }

  return (
    <section ref={ref} aria-labelledby="alt-not-baslik" className="bg-page">
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-10 lg:pb-32">
        <div className="relative overflow-hidden rounded-[28px] bg-ink px-6 py-10 shadow-[0_1px_2px_rgba(20,20,20,0.04),0_28px_60px_-30px_rgba(20,20,20,0.5)] sm:rounded-[36px] sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <img
            src="/building-mark-white.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute -right-8 -top-8 hidden h-56 w-56 select-none sm:block"
            style={filigran}
          />

          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-14">
            {/* SOL — bilgilendirme notları */}
            <div>
              <div style={reveal(0)}>
                <p className={ETIKET_KOYU}>Bilgilendirme</p>
                <h2
                  id="alt-not-baslik"
                  className="mt-3 text-2xl font-semibold text-page sm:text-3xl"
                >
                  Kısa Bir Not
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-page/70">
                  Sitede yer alan görseller, planlar ve ölçüler projeyi tanıtmak içindir. Kesin ve
                  güncel bilgiyi satış ofisimizden alabilirsiniz.
                </p>
              </div>
              <span
                aria-hidden="true"
                className="mt-7 block h-1 w-14 origin-left rounded-full bg-brand"
                style={cizgi}
              />

              <ul className="mt-8 space-y-5">
                <li className="flex gap-3.5" style={reveal(1)}>
                  <span className={NOT_ROZET}>
                    <ImageSquare
                      weight="duotone"
                      size={20}
                      aria-hidden="true"
                      className="text-brand"
                    />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-page">Görseller temsilidir</p>
                    <p className="mt-1 text-sm leading-relaxed text-page/70">
                      Sitedeki fotoğraf, render ve animasyonlar tanıtım amaçlıdır; uygulamada
                      farklılık gösterebilir.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3.5" style={reveal(2)}>
                  <span className={NOT_ROZET}>
                    <Ruler weight="duotone" size={20} aria-hidden="true" className="text-brand" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-page">Ölçüler bağlayıcı değildir</p>
                    <p className="mt-1 text-sm leading-relaxed text-page/70">
                      Belirtilen metrekareler proje bilgilerine dayanır. Bağlayıcı olan, onaylı
                      projede ve satış sözleşmesinde yer alan alan ve pay değerleridir.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3.5" style={reveal(3)}>
                  <span className={NOT_ROZET}>
                    <SealCheck
                      weight="duotone"
                      size={20}
                      aria-hidden="true"
                      className="text-brand"
                    />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-page">Özlütürk imzası</p>
                    <p className="mt-1 text-sm leading-relaxed text-page/70">
                      <BrandWord idealClass="text-page" />, Özlütürk tarafından geliştirilen bir
                      projedir. Buradaki bilgiler proje geliştiricisinin paylaştığı verilere
                      dayanır.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* SAĞ — KVKK kartı. reveal DIŞTA, hover İÇTE; transition listesi `translate`. */}
            <div style={reveal(4)}>
              <div className="h-full rounded-[24px] border border-page/12 bg-page/[0.06] p-6 backdrop-blur-[2px] transition-[translate,border-color] duration-500 hover:-translate-y-1 hover:border-page/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7">
                <span className={NOT_ROZET}>
                  <ShieldCheck
                    weight="duotone"
                    size={20}
                    aria-hidden="true"
                    className="text-brand"
                  />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-page">Kişisel Verileriniz</h3>
                <p className="mt-2 text-sm leading-relaxed text-page/70">
                  Telefon, WhatsApp veya e-posta yoluyla bizimle paylaştığınız bilgiler yalnızca
                  talebinize dönüş yapmak için kullanılır. Verilerinizin nasıl işlendiğini
                  aydınlatma metnimizde bulabilirsiniz.
                </p>
                {/* Dolu kırmızı buton DEĞİL: bu sayfada dolu kırmızı yalnız dönüşüm aksiyonlarına
                    ayrılmıştır (Hemen Ara / Yol Tarifi Al). KVKK bir yasal referans → metin bağlantısı
                    (WhyIdeal'deki Cta deseninin koyu zemin karşılığı). */}
                <Link
                  to="/kvkk"
                  className="group mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-semibold text-page/80 transition-colors hover:text-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-page/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  KVKK Aydınlatma Metni
                  <ArrowRight
                    weight="bold"
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

export default function Iletisim() {
  return (
    <>
      <Acilis />
      <Kanallar />
      <Konum />
      <Saatler />
      <AltNot />
    </>
  )
}
