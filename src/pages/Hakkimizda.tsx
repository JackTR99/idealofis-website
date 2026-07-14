import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  ArrowRight,
  HardHat,
  CalendarCheck,
  Handshake,
  Lifebuoy,
  Certificate,
  SquaresFour,
  type Icon as PhIcon,
} from '@phosphor-icons/react'
import BrandWord from '../components/BrandWord'
import IletisimCta from '../components/IletisimCta'

/* ─────────────────────────────────────────────────────────────
   ORTAK MOTOR — WhyIdeal.tsx deseni (IntersectionObserver + inline style)
   ───────────────────────────────────────────────────────────── */
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function reduceMotion() {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Hareketi azalt tercihi açıkken sayfa içi kaydırmayı ANLIK yapar.
 *
 * NEDEN: index.css'te `html { scroll-behavior: smooth }` KOŞULSUZ tanımlı ve dosyada
 * bunu geri alan bir `@media (prefers-reduced-motion: reduce)` bloğu yok. Bu yüzden
 * hareketi azalt tercihi açık kullanıcıda her hash bağlantısı ve her scrollIntoView
 * yumuşak kayıyor.
 *
 * KALICI ÇÖZÜM (AYRI İŞ — bu görev yalnız bu dosyaya dokunuyor): index.css'e
 *   @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto } }
 * eklemek sorunu site genelinde çözer. O 3 satır eklendiğinde bu hook silinebilir.
 *
 * O zamana kadar: sayfa ömrü boyunca <html> üzerine inline stil yazıyoruz (inline stil
 * stylesheet'i ezer), unmount'ta eski değeri geri koyuyoruz. Böylece bağlantılar düz
 * <a href="#..."> kalıyor — history API'sine hiç dokunulmuyor, React Router'ın geçmiş
 * yığın indeksi (history.state.idx) bozulmuyor ve geri tuşu herkeste aynı çalışıyor.
 */
function useAnlikKaydirma() {
  useEffect(() => {
    if (!reduceMotion()) return
    const html = document.documentElement
    const onceki = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    return () => {
      html.style.scrollBehavior = onceki
    }
  }, [])
}

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

  const reveal = (i: number): CSSProperties | undefined =>
    reduce
      ? undefined
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0)' : 'translateY(24px)',
          transition: `opacity 0.6s ${EASE} ${i * 0.08}s, transform 0.7s ${EASE} ${i * 0.08}s`,
        }

  const line = (delay = 0.24, origin: 'left' | 'center' = 'left'): CSSProperties | undefined =>
    reduce
      ? undefined
      : {
          transform: shown ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: origin,
          transition: `transform 0.6s ${EASE} ${delay}s`,
        }

  return { ref, reduce, shown, reveal, line }
}

// kart kabuğu — DİKKAT: transition-[translate,box-shadow] (transform DEĞİL).
// Tailwind v4'te hover:-translate-y-1.5 `translate` özelliğini yazar; transition
// listesinde translate yoksa kart hover'da zıplar.
// (Aynı düzeltme WhyIdeal.tsx ve OfislerTeaser.tsx'te de yapılmalı — ayrı iş.)
const CARD =
  'group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-surface p-6 lg:p-7 ' +
  'ring-1 ring-black/[0.04] ' +
  'shadow-[0_1px_2px_rgba(20,20,20,0.04),0_18px_40px_-24px_rgba(20,20,20,0.16)] ' +
  'transition-[translate,box-shadow] duration-500 ' +
  'hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(20,20,20,0.04),0_36px_72px_-28px_rgba(20,20,20,0.34)]'

// odak halkası — site dili (IletisimCta.tsx ile aynı mantık, açık zemine uyarlanmış)
const FOCUS =
  'rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2'

/* ═════════════════════════════════════════════════════════════
   ⚠️ MOCK BLOĞU — BU BLOKTAKİ HİÇBİR VERİ DOĞRULANMADI.
   Kaan onaylamadan YAYINA ÇIKMAZ. Sayfadaki tüm uydurma içerik
   yalnızca burada; gerçek metin gelince SADECE burası güncellenir.

   ⛔ KURAL: Uydurma SAYI ve TARİH bu dosyada HİÇ YAZILMAZ.
   Önceden "ONAY kapısı" (ONAY.rakamlar / ONAY.teslim) vardı: veriler kodda
   duruyor, sadece ekrana çizilmiyordu. Bu YETERSİZ — boolean kapı ağaç budamayı
   (tree-shaking) tetiklemediği için uydurma kurumsal rakamlar ve teslim tarihi
   üretim paketine (dist/assets/index-*.js) AYNEN giriyor, herkes okuyabiliyordu.
   Bu yüzden kapı da, arkasındaki veri de kaldırıldı:
   • "Rakamlarla Özlütürk" bölümü → aşağıda YORUM olarak duruyor (yorumlar pakete
     girmez). Kaan gerçek rakamları verince yorum açılır, sayılar doldurulur.
   • Teslim tarihi satırı → KUNYE listesinden çıkarıldı (aşağıya bakın).

   KAAN'A SORULACAKLAR:
   • Özlütürk kuruluş yılı, tamamlanan proje sayısı, teslim edilen m² ve
     bağımsız bölüm sayısı  → "Rakamlar" yorum bloğu
   • Teslim tarihi                                        → KUNYE listesi
   • "Biz Kimiz" metinleri ve kurumsal ilkeler (Değerler kartları)
   • Telefon / WhatsApp numarası
   • Çalışma saatleri
   • Proje render'ında bina tabelasında "idealofis" altında ikinci bir isim
     okunuyor → projenin marka/yüklenici atfı (Özlütürk) TEYİT ETTİRİLECEK
   • Künye için ek alanlar: ada/parsel, mimari ofis, yapı denetim firması,
     ruhsat tarihi

   İLETİŞİM MOCK'LARI BU DOSYADA YOK: telefon / WhatsApp / e-posta / adres /
   çalışma saatleri artık tek kaynakta — src/data/iletisim.ts (TEL, TEL_DIGITS,
   WA_DIGITS, EPOSTA, ADRES, CALISMA_SAATLERI). Bu sayfa bunların hiçbirini
   doğrudan kullanmıyor; iletişim bilgisi yalnız <IletisimCta /> üzerinden geliyor.
   Kaan gerçek numarayı verince tek dosya güncellenir.
   ═════════════════════════════════════════════════════════════ */
const MOCK = {
  // MOCK — Kaan gerçeğini verecek (kurumsal anlatı)
  ozluturk: {
    spot: 'Bir ofise karar vermeden önce, arkasındaki markayı tanımaya hakkınız var.',
    p1: 'Özlütürk, İzmir’de konut ve ofis projeleri geliştiren bir yapı markası. Aynı anda çok sayıda şantiye yürütmek yerine az sayıda projeyle ilerlemeyi tercih ediyor; böylece bir binanın planlamasından teslimine kadar aynı ekip işin başında kalıyor.',
    p2: 'Bizim için bir binanın gerçek sınavı teslim günü değil, beşinci yılıdır. Bu yüzden görünmeyen işlere — altyapıya, yalıtıma, ortak alanların bakımına — görünen işler kadar zaman ayırıyoruz. Teslimden sonra da binayla ilgilenmeye devam ediyoruz.',
    p3Son:
      ', bu yaklaşımın ofis tarafındaki karşılığı: Bayraklı’da, adliyenin ve toplu ulaşımın yanı başında, butik ölçekli bir ofis binası. Otopark, ortak alanlar ve hizmetler bu ölçeğe göre planlandı.',
    imzaAd: 'Özlütürk',
    imzaTanim: '· İzmir — yapı markası',
  },

  // MOCK — Kaan gerçeğini verecek: Özlütürk'ün gerçek kurumsal ilkeleri elimizde yok.
  degerler: [
    {
      Icon: HardHat,
      baslik: 'Mühendislik ve Malzeme',
      metin:
        'Statikten yalıtıma kadar her kalemde, daha önce denenmiş ve arkasında durabildiğimiz çözümleri seçiyoruz. Görünmeyen detaylar da görünenler kadar önemli.',
    },
    {
      Icon: CalendarCheck,
      baslik: 'Zamanında Teslim',
      metin:
        'İş programını baştan paylaşıyor, ilerlemeyi düzenli olarak takip ediyoruz. Takvimde bir değişiklik olursa, öğrendiğimiz gün size de bildiriyoruz.',
    },
    {
      Icon: Handshake,
      baslik: 'Şeffaf Süreç',
      metin:
        'Sözleşme, ödeme planı ve inşaatın geldiği aşama tek elden yürüyor. Alıcı, sürecin neresinde olduğunu sorduğunda net bir cevap alır.',
    },
    {
      Icon: Lifebuoy,
      baslik: 'Teslimden Sonra da Yanınızda',
      metin:
        'İş, anahtar teslimiyle bitmiyor. Ortak alanların işletmesi ve binanın bakımı, teslimden sonra da bina yönetimiyle birlikte sürüyor.',
    },
  ] as { Icon: PhIcon; baslik: string; metin: string }[],
}
/* ════════════════════ MOCK BLOĞU BİTTİ ════════════════════ */

/**
 * GERÇEK proje verisi (Kaan'ın dosyası).
 * Künye BİLEREK kısa: ofis sayısı (102), metrekare aralığı (68–125 m²), kat (8)
 * ve otopark (3 katlı + vale) satırları anasayfadaki StatsBand'de ve Ofislerimiz
 * sayfasında zaten var — burada tekrar edilmez. Bu liste yalnızca projenin
 * KİMLİK bilgilerini taşır.
 * Kaan'dan gelecek ek alanlar buraya eklenir: ada/parsel, mimari ofis,
 * yapı denetim firması, ruhsat tarihi.
 */
const KUNYE: { Icon: PhIcon; terim: string; deger: string }[] = [
  { Icon: Certificate, terim: 'Marka', deger: 'Özlütürk' },
  { Icon: MapPin, terim: 'Konum', deger: 'Bayraklı / İzmir' },
  { Icon: SquaresFour, terim: 'Plan tipleri', deger: '4 farklı tip' },
  // TESLİM SATIRI — Kaan gerçek tarihi verince şu satır açılır (CalendarCheck zaten
  // içeri alınmış durumda, Değerler kartlarında kullanılıyor):
  // { Icon: CalendarCheck, terim: 'Teslim', deger: '<Kaan verecek>' },
  // Uydurma tarih koyulmaz: kod içinde duran uydurma veri, render edilmese bile
  // üretim paketine girip okunabiliyor.
]

/* Yalnız geliştirme modunda görünen uyarı — üretim derlemesinde hiç basılmaz. */
function MockRozeti() {
  if (!import.meta.env.DEV) return null
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-4 left-4 z-50 max-w-[15rem] rounded-2xl bg-ink/90 px-3.5 py-2.5 text-[11px] leading-snug text-page shadow-[0_18px_40px_-24px_rgba(20,20,20,0.6)] backdrop-blur"
    >
      <span className="font-semibold text-brand">MOCK</span> — “Biz Kimiz” metinleri ve “Değerler”
      kartları doğrulanmadı. Kurumsal rakamlar ve teslim tarihi koddan tamamen çıkarıldı; Kaan
      gerçeğini verince eklenecek.
    </div>
  )
}

/* ─────────────────────────── 1) AÇILIŞ ─────────────────────────── */
function Acilis() {
  const { ref, reduce, shown, reveal, line } = useReveal()

  return (
    <section id="acilis" ref={ref} className="bg-page">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-36 lg:pb-28">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-6">
            <p
              className="text-xs font-semibold uppercase tracking-[0.22em] text-brand"
              style={reveal(0)}
            >
              Hakkımızda
            </p>
            <h1
              className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl"
              style={reveal(1)}
            >
              İmzanın arkasındaki marka: Özlütürk.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted" style={reveal(2)}>
              <BrandWord />, Özlütürk’ün İzmir Bayraklı’da hayata geçirdiği 102 ofisli butik bir iş
              merkezidir. Bu sayfada projenin arkasındaki markayı, işi ele alış biçimimizi ve{' '}
              <BrandWord />’in künyesini bulacaksınız.
            </p>
            <span
              aria-hidden="true"
              className="mt-8 block h-1 w-14 rounded-full bg-brand"
              style={line(0.3, 'left')}
            />
          </div>

          <div className="mt-12 lg:col-span-6 lg:mt-0" style={reveal(4)}>
            {/* Açılış görseli BİLEREK iç mekân: dış cephe render'ı anasayfa hero'sunun
                son karesiyle aynı görüntü — ziyaretçi aynı görseli ikinci kez görmesin.
                NOT (Kaan'a): aynı lobby.jpg anasayfada WhyIdeal.tsx'teki "Hizmetler"
                kartında da kullanılıyor — yani bir tekrardan kaçınırken başka bir tekrar
                oluşmuş. Rahatsız ederse henüz hiç kullanılmamış toplanti.jpg / calisma.jpg
                değerlendirilebilir; görsel seçimi Kaan'ın kararı, kod hazır.

                Bu görsel sayfanın LCP adayı → eager + fetchPriority="high" (doğru).
                Boyut kabı aspect-[16/10] / lg:aspect-[4/3] ile kilitli → CLS yok.
                375 KB'lık tek JPEG yerine WebP türevleri + srcset/sizes: mobilde ~35 KB
                (lobby-640.webp), masaüstünde en fazla ~102 KB inecek. <picture> sayesinde
                WebP desteklemeyen tarayıcı yine orijinal JPEG'i alır. */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-surface ring-1 ring-black/[0.04] shadow-[0_1px_2px_rgba(20,20,20,0.04),0_18px_40px_-24px_rgba(20,20,20,0.16)] lg:aspect-[4/3]">
              {/* picture VARSAYILAN OLARAK inline → img'nin h-full'ü (height:100%) picture'a
                  göre çözülür ve kutuyu dolduramaz. block + h-full + w-full ile picture'ı
                  aspect kilitli kabın boyutuna oturtuyoruz; object-cover kırpması korunuyor. */}
              <picture className="block h-full w-full">
                <source
                  type="image/webp"
                  srcSet="/images/why/lobby-640.webp 640w, /images/why/lobby-960.webp 960w, /images/why/lobby-1280.webp 1280w"
                  sizes="(min-width: 1024px) 528px, calc(100vw - 40px)"
                />
                <img
                  src="/images/why/lobby.jpg"
                  alt="idealofis lobi ve resepsiyon alanı — Bayraklı, İzmir"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={1500}
                  height={932}
                  className="h-full w-full object-cover object-center"
                  style={
                    reduce
                      ? undefined
                      : {
                          transform: shown ? 'scale(1)' : 'scale(1.05)',
                          transition: `transform 1.2s ${EASE} 0.32s`,
                        }
                  }
                />
              </picture>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-ink/0 to-transparent"
              />
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-surface/90 px-3.5 py-2 shadow-[0_8px_20px_-8px_rgba(20,20,20,0.35)] ring-1 ring-black/[0.04] backdrop-blur lg:bottom-5 lg:left-5">
                <MapPin weight="duotone" size={16} aria-hidden="true" className="shrink-0 text-brand" />
                <span className="text-xs font-medium text-ink">
                  <BrandWord /> — Bayraklı, İzmir
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── 2) BİZ KİMİZ ─────────────────────────── */
function BizKimiz() {
  const { ref, reveal, line } = useReveal()

  // Künye bağlantısı DÜZ <a href="#proje-kunyesi"> — onClick yok, history API'sine
  // dokunulmuyor. Hareketi azalt tercihi sayfa düzeyindeki useAnlikKaydirma() hook'uyla
  // karşılanıyor (yukarıdaki açıklamaya bakın).
  return (
    <section id="biz-kimiz" ref={ref} className="scroll-mt-28 border-y border-line bg-section">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:py-28">
        <div className="lg:grid lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p
              className="text-xs font-semibold uppercase tracking-[0.22em] text-brand"
              style={reveal(0)}
            >
              Biz Kimiz
            </p>
            <div style={reveal(1)}>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                Binanın arkasında kim var?
              </h2>
              <p className="mt-4 text-base italic leading-relaxed text-muted">{MOCK.ozluturk.spot}</p>
            </div>
            <span
              aria-hidden="true"
              className="mt-7 block h-1 w-14 rounded-full bg-brand"
              style={line(0.24, 'left')}
            />
          </div>

          <div className="mt-8 lg:col-span-7 lg:mt-0">
            <div className="space-y-4" style={reveal(2)}>
              <p className="text-base leading-relaxed text-muted">{MOCK.ozluturk.p1}</p>
              <p className="text-base leading-relaxed text-muted">{MOCK.ozluturk.p2}</p>
              <p className="text-base leading-relaxed text-muted">
                <BrandWord />
                {MOCK.ozluturk.p3Son}
              </p>
            </div>

            <div style={reveal(3)}>
              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-5">
                <span aria-hidden="true" className="h-5 w-1 shrink-0 rounded-full bg-brand" />
                <span className="text-sm font-medium text-ink">{MOCK.ozluturk.imzaAd}</span>
                <span className="text-sm text-muted">{MOCK.ozluturk.imzaTanim}</span>
              </div>
              <a
                href="#proje-kunyesi"
                className={`group mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark ${FOCUS} focus-visible:ring-offset-section`}
              >
                Proje künyesine bakın
                <ArrowRight
                  weight="bold"
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── 3) RAKAMLAR ───────────────────────────
   ⚠️ MOCK — Kaan gerçeğini verecek. Özlütürk'ün kurumsal rakamları elimizde YOK;
   aşağıdakiler TASLAK amaçlı yer tutucudur. Sayfada "Örnek veri" rozetiyle
   işaretlidir (bkz. MockRozeti). Gerçek rakamlar gelince sadece STATS güncellenir.
   ─────────────────────────────────────────────────────────────────────────── */
// MOCK — Kaan gerçeğini verecek
const STATS: { value: string; suffix?: string; label: string }[] = [
  { value: '1998', label: 'Kuruluş yılı' },
  { value: '12', label: 'Tamamlanan proje' },
  { value: '310.000', suffix: 'm²', label: 'Teslim edilen toplam alan' },
  { value: '1.850', label: 'Teslim edilen bağımsız bölüm' },
]

function Rakamlar() {
  const { ref, reduce, shown, reveal, line } = useReveal()

  return (
    <section id="rakamlarla-ozluturk" ref={ref} className="scroll-mt-28 bg-page">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div style={reveal(0)}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
              Kurumsal birikim
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Rakamlarla Özlütürk
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Bugüne kadar tamamlanan işlerin toplamı; <BrandWord /> bu birikimin üzerine kuruldu.
            </p>
          </div>
          <span
            aria-hidden="true"
            className="mx-auto mt-8 block h-1 w-14 rounded-full bg-brand"
            style={line(0.16, 'center')}
          />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-start text-left ${
                i > 0 ? 'lg:border-l lg:border-line lg:pl-6' : ''
              }`}
              style={reveal(i + 1)}
            >
              <p className="font-display text-2xl font-semibold leading-none tracking-tight tabular-nums text-ink min-[360px]:text-[1.75rem] sm:text-4xl">
                {s.value}
                {s.suffix && (
                  <span className="ml-0.5 align-baseline text-base font-medium text-muted sm:ml-1.5 sm:text-xl">
                    {s.suffix}
                  </span>
                )}
              </p>
              <span
                aria-hidden="true"
                className="mt-5 block h-0.5 w-10 rounded-full bg-brand"
                style={
                  reduce
                    ? undefined
                    : {
                        transform: shown ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: `transform 0.5s ${EASE} ${0.35 + i * 0.08}s`,
                      }
                }
              />
              <p className="mt-4 text-sm font-medium leading-snug text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <p
          className="mx-auto mt-14 max-w-xl text-center text-xs leading-relaxed text-muted"
          style={reveal(5)}
        >
          Bu bölümdeki rakamlar örnek verilerdir; gerçek değerlerle güncellenecektir.
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────────── 4) DEĞERLER ─────────────────────────── */
function Degerler() {
  const { ref, reveal, line } = useReveal()

  return (
    <section
      id="degerler"
      ref={ref}
      aria-labelledby="degerler-baslik"
      className="scroll-mt-28 border-y border-line bg-section"
    >
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div style={reveal(0)}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
              Yaklaşımımız
            </p>
            <h2
              id="degerler-baslik"
              className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl"
            >
              Nasıl çalışıyoruz?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Bir binayı kalıcı kılan yalnızca malzemesi değil, arkasındaki çalışma biçimidir.
              Özlütürk olarak bu projede işimizi nasıl yürüttüğümüzü dört başlıkta topladık.
            </p>
          </div>
          <span
            aria-hidden="true"
            className="mx-auto mt-8 block h-1 w-14 rounded-full bg-brand"
            style={line(0.16, 'center')}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {MOCK.degerler.map((d, i) => {
            const Icon = d.Icon
            return (
              // reveal SARMALAYICIYA — article'a değil (inline transition hover'ı ezmesin)
              <div key={d.baslik} className="h-full" style={reveal(i + 1)}>
                <article className={CARD}>
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/[0.06] ring-1 ring-brand/10 transition-transform duration-500 group-hover:scale-110"
                  >
                    <Icon weight="duotone" size={26} className="text-brand" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold leading-snug text-ink lg:text-xl">
                    {d.baslik}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{d.metin}</p>
                </article>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── 5) PROJE KÜNYESİ ─────────────────────────── */
function Kunye() {
  const { ref, reduce, shown, reveal, line } = useReveal()

  return (
    <section id="proje-kunyesi" ref={ref} className="scroll-mt-28 bg-page">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <div style={reveal(0)}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Künye</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              <BrandWord /> Proje Künyesi
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Projenin kimliği tek bir listede: marka, konum ve plan tipleri. Ofis sayısı, metrekare
              aralığı, kat ve otopark bilgileri için ofis planlarına bakabilirsiniz.
            </p>
          </div>
          <span
            aria-hidden="true"
            className="mx-auto mt-8 block h-1 w-14 rounded-full bg-brand"
            style={line(0.16, 'center')}
          />
        </div>

        <div className="mt-12 lg:mt-14" style={reveal(1)}>
          <div className="relative flex flex-col overflow-hidden rounded-[28px] bg-surface ring-1 ring-black/[0.04] shadow-[0_1px_2px_rgba(20,20,20,0.04),0_18px_40px_-24px_rgba(20,20,20,0.16)] lg:flex-row">
            {/* marka paneli — fotoğraf DEĞİL (tekrarsız).
                Görsel tamamen dekoratif (alt="" + aria-hidden) ve ekranda yalnız ~120x96
                (lg: ~140x112) çiziliyor. Eskiden 1008x801 / 355 KB'lık /building-mark.png
                yükleniyordu → indirilen baytların ~%97'si boşa gidiyordu. Bu panel için
                üretilen 280x222 / ~10 KB'lık WebP türevi kullanılıyor (2x ekranlarda bile
                net). Not: 355 KB'lık asıl dosya UnderConstruction.tsx'te hâlâ kullanılıyor
                — orada da bu türeve geçilirse kazanç sayfa dışına yayılır (AYRI İŞ). */}
            <div className="flex shrink-0 flex-col items-center justify-center gap-3 border-b border-line bg-section px-6 py-10 lg:w-[38%] lg:border-b-0 lg:border-r lg:py-12">
              <img
                src="/building-mark-sm.webp"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width={280}
                height={222}
                className="h-24 w-auto opacity-80 lg:h-28"
              />
              <p className="text-2xl">
                <BrandWord />
              </p>
              <p className="text-sm text-muted">Bayraklı / İzmir</p>
              <span aria-hidden="true" className="mt-1 block h-1 w-10 rounded-full bg-brand" />
            </div>

            {/* künye listesi */}
            <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-10">
              <dl className="flex flex-col">
                {KUNYE.map((k, i) => {
                  const Icon = k.Icon
                  return (
                    // <dl> içindeki <div> YALNIZ <dt> + <dd> sarabilir → ikon <dt>'nin içinde.
                    <div
                      key={k.terim}
                      className="flex min-h-[56px] items-center gap-3 border-b border-line py-3.5 last:border-b-0 sm:gap-4 sm:py-4"
                      style={
                        reduce
                          ? undefined
                          : {
                              opacity: shown ? 1 : 0,
                              transform: shown ? 'translateY(0)' : 'translateY(12px)',
                              transition: `opacity 0.5s ${EASE} ${0.28 + i * 0.05}s, transform 0.55s ${EASE} ${
                                0.28 + i * 0.05
                              }s`,
                            }
                      }
                    >
                      <dt className="flex flex-1 items-center gap-3 pr-2 text-sm font-medium text-muted sm:gap-4">
                        <span
                          aria-hidden="true"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/[0.06] ring-1 ring-brand/10 sm:h-10 sm:w-10"
                        >
                          <Icon weight="duotone" size={20} className="text-brand" />
                        </span>
                        {k.terim}
                      </dt>
                      <dd className="max-w-[62%] text-right text-[15px] font-semibold leading-snug text-ink sm:text-base lg:text-[17px]">
                        {k.deger}
                      </dd>
                    </div>
                  )
                })}
              </dl>

              <div
                style={
                  reduce
                    ? undefined
                    : {
                        opacity: shown ? 1 : 0,
                        transform: shown ? 'translateY(0)' : 'translateY(12px)',
                        transition: `opacity 0.5s ${EASE} 0.7s, transform 0.55s ${EASE} 0.7s`,
                      }
                }
              >
                <p className="mt-5 text-xs leading-relaxed text-muted">
                  Bilgiler proje dosyasından alınmıştır; bilgi amaçlıdır. Resmî belgeler ve sözleşme
                  hükümleri esastır.
                </p>
                <Link
                  to="/ofislerimiz"
                  className={`group mt-3 inline-flex min-h-11 w-fit items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark ${FOCUS} focus-visible:ring-offset-surface`}
                >
                  Ofis planlarını inceleyin
                  <ArrowRight
                    weight="bold"
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
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

export default function Hakkimizda() {
  // Hareketi azalt tercihi açıkken sayfa içi her kaydırma anlık olur (hash bağlantıları
  // dahil). Kalıcı çözüm index.css'te — hook'un başındaki açıklamaya bakın.
  useAnlikKaydirma()

  return (
    <>
      <Acilis />
      <BizKimiz />
      <Rakamlar />
      <Degerler />
      <Kunye />
      <IletisimCta id="kapanis-cta" />
      <MockRozeti />
    </>
  )
}
