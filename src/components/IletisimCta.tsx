import { Phone, WhatsappLogo } from '@phosphor-icons/react'
import { TEL, TEL_HREF, WA_HREF } from '../data/iletisim'

/**
 * Footer öncesi kapanış bandı: tek çağrı + telefon + WhatsApp.
 * Anasayfa <IletisimCta /> ve Hakkımızda <IletisimCta id="kapanis-cta" /> kullanır.
 *
 * Numara/WhatsApp burada TANIMLANMAZ → tek kaynak: src/data/iletisim.ts
 */

export default function IletisimCta({ id }: { id?: string }) {
  return (
    <section id={id} className="bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-page/70">İletişim</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-page sm:text-4xl">
          Ofisinizi yerinde görün
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-page/70">
          Fotoğraflar ve planlar bir fikir verir; kararı ofisi yerinde görünce verirsiniz.
          Bayraklı’daki projeyi birlikte gezelim: arayın ya da WhatsApp’tan yazın.
        </p>
        <div aria-hidden="true" className="mx-auto mt-6 h-1 w-14 rounded-full bg-brand" />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={TEL_HREF}
            aria-label={`Telefonla arayın: ${TEL}`}
            className="inline-flex items-center gap-2.5 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-page shadow-[0_14px_28px_-10px_rgba(226,0,26,0.55)] transition-transform active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-page/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <Phone weight="fill" size={18} aria-hidden="true" />
            {TEL}
          </a>
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
      </div>
    </section>
  )
}
