/**
 * Marka yazısı — tek kaynak.
 * Kural: her zaman küçük harf, bitişik, "ofis" kırmızı.
 * Koyu zeminde: <BrandWord idealClass="text-page" />
 */
export default function BrandWord({ idealClass = 'text-ink' }: { idealClass?: string }) {
  return (
    <>
      <span className={`font-display font-semibold tracking-tight ${idealClass}`}>ideal</span>
      <span className="font-display font-semibold tracking-tight text-brand">ofis</span>
    </>
  )
}
