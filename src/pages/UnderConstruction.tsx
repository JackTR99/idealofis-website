interface Props {
  title: string
  home?: boolean
}

export default function UnderConstruction({ title, home }: Props) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center">
      <img
        src="/building-mark.png"
        alt=""
        className="mb-8 h-20 w-auto opacity-90"
      />

      <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        Yapım aşamasında
      </span>

      <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
        {home ? (
          <>
            ideal<span className="text-brand">ofis</span>
          </>
        ) : (
          title
        )}
      </h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        {home
          ? 'Web sitemiz şu anda hazırlanıyor. Çok yakında burada olacağız.'
          : 'Bu sayfa şu anda hazırlanıyor. Çok yakında burada olacak.'}
      </p>
    </section>
  )
}
