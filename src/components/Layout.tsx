import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import FloatingNav from './FloatingNav'
import Footer from './Footer'
import { IntroContext } from './IntroContext'

// Anasayfada ilk açılışta chrome (navbar+footer) başta gizli olsun ki intro'da
// görünmesin (flash önlemi). Diğer sayfalarda / tekrar ziyarette görünür.
function initialIntroActive(pathname: string) {
  if (pathname !== '/' || typeof window === 'undefined') return false
  // hareket azaltılmış değilse chrome başta gizli → premium giriş her yüklemede oynar
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export default function Layout() {
  const { pathname } = useLocation()
  const [introActive, setIntroActive] = useState(() => initialIntroActive(pathname))

  return (
    <IntroContext.Provider value={{ introActive, setIntroActive }}>
      <div className="flex min-h-screen flex-col bg-page">
        <FloatingNav />
        <main className="flex-1 pt-24">
          <Outlet />
        </main>
        <div
          style={{
            opacity: introActive ? 0 : 1,
            transform: introActive ? 'translateY(20px)' : 'translateY(0)',
            transition: 'opacity 0.6s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
            pointerEvents: introActive ? 'none' : undefined,
          }}
        >
          <Footer />
        </div>
      </div>
    </IntroContext.Provider>
  )
}
