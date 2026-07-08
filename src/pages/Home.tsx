import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroSequence from '../components/HeroSequence'
import StatsBand from '../components/StatsBand'
import WhyIdeal from '../components/WhyIdeal'
import { useIntro } from '../components/IntroContext'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function reduceMotion() {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}
function videoSeen() {
  return typeof window !== 'undefined' && sessionStorage.getItem('heroIntroSeen') === '1'
}

export default function Home() {
  const { setIntroActive } = useIntro()
  const reduce = reduceMotion()
  // VİDEO yalnızca ilk ziyarette oynar; premium GİRİŞ animasyonu her yüklemede oynar.
  const playVideo = !reduce && !videoSeen()

  const [stage, setStage] = useState<'intro' | 'reveal'>(reduce ? 'reveal' : 'intro')
  const [heroDone, setHeroDone] = useState(reduce) // reduce → ışıma statik yerleşik

  useEffect(() => {
    if (reduce) return // hareket azaltılmış → her şey statik, animasyon yok
    setIntroActive(true) // chrome (navbar+footer) gizli → reveal ile gelir
    let t1 = 0
    let t2 = 0
    if (!playVideo) {
      // yenileme: video yok → premium giriş kısa gecikmeyle hemen oynar
      t1 = window.setTimeout(() => {
        setHeroDone(true) // ışıma bir kez parlar
        setIntroActive(false) // navbar + footer iner
      }, 250)
      t2 = window.setTimeout(() => setStage('reveal'), 500) // yazılar & butonlar yükselir
    }
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      setIntroActive(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // sadece ilk ziyarette (video bitince) tetiklenir
  const handleEnd = () => {
    setHeroDone(true)
    try {
      sessionStorage.setItem('heroIntroSeen', '1')
    } catch {
      /* yok say */
    }
    window.setTimeout(() => setIntroActive(false), 900) // navbar + footer gelir
    window.setTimeout(() => setStage('reveal'), 1150) // ardından yazılar & butonlar
  }

  // premium giriş: yüksel + belir + netleş (stagger'lı). reduce ise statik.
  const rise = (delay: number, kind: 'rise' | 'scale' | 'line' = 'rise') => {
    if (reduce) return undefined
    if (stage !== 'reveal') return kind === 'line' ? { transform: 'scaleX(0)' } : { opacity: 0 }
    const name = kind === 'scale' ? 'heroRiseScale' : kind === 'line' ? 'heroLineDraw' : 'heroRise'
    const dur = kind === 'line' ? '0.6s' : '0.7s'
    return { animation: `${name} ${dur} ${EASE} ${delay}s both` }
  }

  return (
    <>
    <section className="relative -mt-24 overflow-hidden">
      {/* hero + cam kaynağı: ilk ziyarette ilk kare, tekrar ziyarette son kare */}
      <img
        src={playVideo ? '/images/hero/hero-0001.jpg' : '/images/hero/hero-0193.jpg'}
        alt="İdeal Ofis bina dış cephesi, Bayraklı"
        data-glass-bg
        className="absolute inset-0 h-full w-full object-cover object-[57%_50%]"
      />
      {/* video-kare dizisi: yalnızca ilk ziyarette oynar, bitince koreografiyi tetikler */}
      <HeroSequence
        active={playVideo}
        onEnd={handleEnd}
        className="absolute inset-0 h-full w-full object-cover object-[57%_50%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/30" />

      {/* bina vurgusu — giriş sırasında bir kez parlar; reduce'ta statik ışıma */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: heroDone ? 1 : 0,
          transition: 'opacity 1.3s ease-out',
          background:
            'radial-gradient(78% 88% at 58% 42%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: reduce ? 0.42 : heroDone ? undefined : 0,
          animation: !reduce && heroDone ? 'heroGlowOnce 1.8s ease-out forwards' : undefined,
          background:
            'radial-gradient(36% 44% at 58% 42%, rgba(255,238,214,0.55), transparent 62%)',
          mixBlendMode: 'screen',
        }}
      />

      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-5 pb-20 pt-36">
        <p
          className="text-sm font-semibold uppercase tracking-[0.14em] text-white/80"
          style={rise(0)}
        >
          Bayraklı / İzmir
        </p>
        <div
          className="mb-5 mt-3 h-px w-12 origin-left bg-brand"
          aria-hidden="true"
          style={rise(0.1, 'line')}
        />
        <h1
          className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-6xl"
          style={rise(0.18)}
        >
          Bayraklı’nın kalbinde <span className="text-brand">İdeal</span> konum
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75" style={rise(0.34)}>
          İzmir’in yükselen merkezi Bayraklı’da, prestijli şirketler için tasarlanan 102{' '}
          <span className="font-display font-semibold tracking-tight text-page">ideal</span>
          <span className="font-display font-semibold tracking-tight text-brand">ofis</span>.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <span className="inline-flex" style={rise(0.46, 'scale')}>
            <Link
              to="/ofislerimiz"
              className="hero-btn hero-btn-primary inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold text-white"
            >
              <span className="relative z-10">Ofisleri İncele</span>
            </Link>
          </span>
          <span className="inline-flex" style={rise(0.54)}>
            <Link
              to="/iletisim"
              className="hero-btn hero-btn-ghost inline-flex items-center rounded-full px-7 py-3 text-sm font-medium text-white backdrop-blur"
            >
              İletişime Geç
            </Link>
          </span>
        </div>
      </div>
      {/* alta yumuşak geçiş: çok-duraklı, aşağıdan başlar, tam beyaza yalnız en altta ulaşır → algılanmaz */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36"
        style={{
          background:
            'linear-gradient(to bottom,' +
            ' rgba(250,250,250,0) 0%,' +
            ' rgba(250,250,250,0) 45%,' +
            ' rgba(250,250,250,0.10) 68%,' +
            ' rgba(250,250,250,0.35) 85%,' +
            ' rgba(250,250,250,1) 100%)',
        }}
      />
    </section>

    <StatsBand />
    <WhyIdeal />
    </>
  )
}
