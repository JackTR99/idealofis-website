import { useEffect, useRef } from 'react'

/**
 * Videodan çıkarılan JPG kareleri süre bazlı oynatır (fps değil — DURATION'a sığdırır).
 * İlk kare hero olarak anında görünür; kalan kareler sayfa yüklendikten SONRA (idle)
 * arka planda yüklenir → ilk açılış hızını etkilemez. Tümü hazır olunca oynar, son
 * karede durur. active=false ise (intro zaten oynandı) HİÇ oynatmaz, son kareyi
 * statik gösterir.
 */

const TOTAL = 193
const DURATION = 2500 // ms — tüm dizi bu sürede oynar
const pad = (n: number) => String(n).padStart(4, '0')
const url = (i: number) => `/images/hero/hero-${pad(i)}.jpg`

export default function HeroSequence({
  className = '',
  onEnd,
  active = true,
}: {
  className?: string
  onEnd?: () => void
  active?: boolean
}) {
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // intro zaten oynandıysa: son kareyi statik göster, tekrar oynatma yok
    if (!active) {
      el.src = url(TOTAL)
      el.style.opacity = '1'
      return
    }

    let raf = 0
    let disposed = false

    const startPreload = () => {
      let loaded = 0
      let ready = false
      for (let i = 1; i <= TOTAL; i++) {
        const im = new Image()
        im.decoding = 'async'
        im.onload = im.onerror = () => {
          loaded++
          if (loaded >= TOTAL) ready = true
        }
        im.src = url(i)
      }

      let startT = 0
      let shown = -1
      const play = (t: number) => {
        if (disposed) return
        raf = requestAnimationFrame(play)
        if (!ready) return
        el.style.opacity = '1'
        if (startT === 0) startT = t
        const idx = Math.min(TOTAL - 1, Math.floor(((t - startT) / DURATION) * TOTAL))
        if (idx !== shown) {
          shown = idx
          el.src = url(idx + 1)
        }
        if (idx >= TOTAL - 1) {
          cancelAnimationFrame(raf)
          onEnd?.()
        }
      }
      raf = requestAnimationFrame(play)
    }

    const idle = (cb: () => void) => {
      const w = window as unknown as { requestIdleCallback?: (c: () => void) => void }
      if (w.requestIdleCallback) w.requestIdleCallback(cb)
      else setTimeout(cb, 200)
    }

    if (document.readyState === 'complete') idle(startPreload)
    else window.addEventListener('load', () => idle(startPreload), { once: true })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
    }
  }, [active])

  return (
    <img
      ref={ref}
      src={url(active ? 1 : TOTAL)}
      alt=""
      aria-hidden="true"
      className={className}
      style={{ opacity: active ? 0 : 1, transition: 'opacity 0.6s ease' }}
    />
  )
}
