/**
 * MESAFELER — TEK KAYNAK (gerçek rota ölçümü).
 *
 * Kaynak: OSRM yaya (FOSSGIS routed-foot) + Valhalla pedestrian çapraz ölçümü, 17 Tem 2026.
 * Bina koordinatı: 38.449961, 27.185122 (Ankara Cd. yanyolu, Mansuroğlu Mah., Bayraklı / İzmir).
 * Yuvarlama: mesafe 50 m hassasiyet, süre tam dakika (iki motorun medyanı).
 *
 * Katalogdaki eski değerler (Adalet Sarayı 400 m, Sanayi Metro 550 m, İstinaf 800 m,
 * Salhane 1,1 km) KUŞ UÇUŞU ölçümdür ve KULLANILMAZ — Kaan kararı: ölçülen gerçek esas.
 *
 * Bu dosya yalnız VERİ taşır: ikonlar ve harita nokta konumları burada TANIMLANMAZ
 * (NedenIdeal.tsx ikon eşlemesini, LokasyonHarita.tsx işaretçi konumlarını kendisi tutar).
 * Mesafe veya süre yazan her yer (NedenIdeal, İletişim, LokasyonHarita) BURADAN okumalı;
 * hiçbir sayfa mesafe/süre değerini elle yazmamalı.
 */

export type MesafeId = 'adliye' | 'metro' | 'istinaf' | 'izban'

export type Mesafe = {
  id: MesafeId
  ad: string
  /** Gerçek yürüme rotası uzunluğu, metre (50 m hassasiyetle yuvarlanmış). */
  mesafeMetre: number
  /** Ekranda gösterilecek mesafe metni (Türkçe ondalık virgül). */
  mesafeEtiket: string
  /** Gerçek yürüme süresi, dakika (iki motorun medyanı, tam dakika). */
  sureDk: number
  /** Ekranda gösterilecek süre metni. */
  sureEtiket: string
}

export const MESAFELER: readonly Mesafe[] = [
  {
    id: 'adliye',
    ad: 'Adalet Sarayı',
    mesafeMetre: 800,
    mesafeEtiket: '800 m',
    sureDk: 10,
    sureEtiket: '10 dk',
  },
  {
    id: 'metro',
    ad: 'Sanayi Metro',
    mesafeMetre: 750,
    mesafeEtiket: '750 m',
    sureDk: 9,
    sureEtiket: '9 dk',
  },
  {
    id: 'istinaf',
    ad: 'İstinaf Mahkemeleri',
    mesafeMetre: 1000,
    mesafeEtiket: '1 km',
    sureDk: 12,
    sureEtiket: '12 dk',
  },
  {
    id: 'izban',
    ad: 'İzban Salhane',
    mesafeMetre: 1500,
    mesafeEtiket: '1,5 km',
    sureDk: 19,
    sureEtiket: '19 dk',
  },
]

/** id → kayıt kısayolu: MESAFE.adliye.mesafeEtiket gibi tekil okumalar için. */
export const MESAFE = Object.fromEntries(MESAFELER.map((m) => [m.id, m])) as Record<
  MesafeId,
  Mesafe
>
