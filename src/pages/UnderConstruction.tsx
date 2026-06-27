interface Props {
  title: string
  home?: boolean
}

export default function UnderConstruction({ title, home }: Props) {
  if (home) {
    return (
      <section className="relative -mt-24 flex min-h-screen items-center justify-center overflow-hidden px-5 text-center">
        {/* geçici koyu hero zemini — floating cam navbar'ı göstermek için */}
        <div className="absolute inset-0 bg-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(226,0,26,0.20),transparent_55%),radial-gradient(80%_60%_at_82%_12%,rgba(255,255,255,0.07),transparent_60%)]" />
        <img
          src="/building-mark-dark.png"
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 w-[560px] max-w-[88vw] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
        />

        <div className="relative z-10 flex flex-col items-center pt-20">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Yapım aşamasında
          </span>
          <h1 className="text-5xl font-semibold text-white sm:text-6xl">
            ideal<span className="text-brand">ofis</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
            Web sitemiz şu anda hazırlanıyor. Çok yakında burada olacağız.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center">
      <img src="/building-mark.png" alt="" className="mb-8 h-20 w-auto opacity-90" />

      <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        Yapım aşamasında
      </span>

      <h1 className="text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        Bu sayfa şu anda hazırlanıyor. Çok yakında burada olacak.
      </p>
    </section>
  )
}
