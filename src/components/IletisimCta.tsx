import { Phone, WhatsappLogo } from '@phosphor-icons/react'

/**
 * Footer öncesi kapanış bandı (taslak): tek çağrı + telefon + WhatsApp.
 * Numara katalogdan; Kaan doğrulayınca güncellenir.
 */
const TEL = '+90 232 325 0 444'
const TEL_HREF = 'tel:+902323250444'
const WA_HREF = 'https://wa.me/902323250444'

export default function IletisimCta() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">İletişim</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
          Ofisinizi yerinde görün
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
          Satış ofisimiz Bayraklı'da, projenin içinde. Arayın; size uygun ofisi birlikte
          gezelim.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={TEL_HREF}
            className="inline-flex items-center gap-2.5 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-10px_rgba(226,0,26,0.55)] transition-transform active:scale-[0.97]"
          >
            <Phone weight="fill" size={18} />
            {TEL}
          </a>
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/15"
          >
            <WhatsappLogo weight="fill" size={18} />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
