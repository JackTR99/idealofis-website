/**
 * Ofis tipleri — Kaan'ın iyileştirilmiş kuşbakışı render'ları (İndirilenler).
 * Koordinatlar görselin YÜZDESİ (0-100). Poligonlar oda sınırlarıdır (elle, ızgara ile çizildi).
 * ⚠️ Ofis 2 ve Ofis 4 metrekareleri PLACEHOLDER (katalogda karşılığı yok) — Kaan verecek.
 */

export type AlanId = 'calisma' | 'mutfak' | 'wc' | 'balkon'

export type OfisAlan = {
  id: AlanId
  ad: string
  m2: string
  renk: string
  nokta: { x: number; y: number }
  poligon: { x: number; y: number }[]
}

export type Ofis = {
  id: string
  roma: string
  ad: string
  gorsel: string
  en: number
  boy: number
  net: string
  brut: string
  genelBrut: string
  alanlar: OfisAlan[]
}

export const ALAN_RENK: Record<AlanId, string> = {
  calisma: '#cf3d85',
  mutfak: '#e5a93c',
  wc: '#3e7fbe',
  balkon: '#339a58',
}

export const OFISLER: Ofis[] = [
  {
    id: 'ofis-1',
    roma: '1',
    ad: 'Ofis 1',
    gorsel: '/images/ofisler/ofis-1.png',
    en: 1111,
    boy: 1415,
    net: '58,58',
    brut: '65,30',
    genelBrut: '101,12',
    alanlar: [
      { id: 'calisma', ad: 'Çalışma Odası', m2: '50,96', renk: ALAN_RENK.calisma, nokta: { x: 43.21, y: 41.53 }, poligon: [{ x: 6.12, y: 4.52 }, { x: 71.2, y: 4.52 }, { x: 71.56, y: 15.55 }, { x: 71.56, y: 93.5 }, { x: 63.19, y: 93.5 }, { x: 63.19, y: 79.01 }, { x: 55.54, y: 79.01 }, { x: 55.54, y: 77.74 }, { x: 47.52, y: 77.74 }, { x: 47.52, y: 74.77 }, { x: 38.34, y: 74.77 }, { x: 38.34, y: 75.62 }, { x: 24.57, y: 75.62 }, { x: 15.48, y: 42.4 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '1,17', renk: ALAN_RENK.mutfak, nokta: { x: 59.41, y: 87.89 }, poligon: [{ x: 47.34, y: 78.87 }, { x: 63.01, y: 78.87 }, { x: 63.01, y: 93.99 }, { x: 47.34, y: 94.56 }] },
      { id: 'wc', ad: 'Wc', m2: '3,15', renk: ALAN_RENK.wc, nokta: { x: 84.18, y: 84.79 }, poligon: [{ x: 73.09, y: 79.86 }, { x: 94.87, y: 79.86 }, { x: 94.87, y: 94.13 }, { x: 73.09, y: 94.13 }] },
      { id: 'balkon', ad: 'Balkon', m2: '3,30', renk: ALAN_RENK.balkon, nokta: { x: 32.51, y: 88.61 }, poligon: [{ x: 25.11, y: 77.74 }, { x: 39.06, y: 77.74 }, { x: 40.23, y: 84.88 }, { x: 40.41, y: 85.8 }, { x: 44.37, y: 85.8 }, { x: 44.37, y: 94.06 }, { x: 29.7, y: 94.56 }] },
    ],
  },
  {
    id: 'ofis-2',
    roma: '2',
    ad: 'Ofis 2',
    gorsel: '/images/ofisler/ofis-2.png',
    en: 1417,
    boy: 1110,
    net: '72,52',
    brut: '80,73',
    genelBrut: '125,02',
    alanlar: [
      { id: 'calisma', ad: 'Çalışma Odası', m2: '64,78', renk: ALAN_RENK.calisma, nokta: { x: 45, y: 49 }, poligon: [{ x: 4, y: 4 }, { x: 58, y: 4 }, { x: 58, y: 33 }, { x: 78, y: 33 }, { x: 78, y: 4 }, { x: 80, y: 4 }, { x: 80, y: 32 }, { x: 96, y: 32 }, { x: 96, y: 88 }, { x: 38, y: 90 }, { x: 38, y: 62 }, { x: 14, y: 62 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '1,33', renk: ALAN_RENK.mutfak, nokta: { x: 87, y: 17 }, poligon: [{ x: 80, y: 5 }, { x: 96, y: 5 }, { x: 96, y: 32 }, { x: 80, y: 32 }] },
      { id: 'wc', ad: 'Wc', m2: '3,34', renk: ALAN_RENK.wc, nokta: { x: 66, y: 20 }, poligon: [{ x: 58, y: 5 }, { x: 78, y: 5 }, { x: 78, y: 33 }, { x: 58, y: 33 }] },
      { id: 'balkon', ad: 'Balkon', m2: '3,07', renk: ALAN_RENK.balkon, nokta: { x: 22, y: 78 }, poligon: [{ x: 14, y: 62 }, { x: 38, y: 62 }, { x: 38, y: 90 }, { x: 20, y: 90 }] },
    ],
  },
  {
    id: 'ofis-3',
    roma: '3',
    ad: 'Ofis 3',
    gorsel: '/images/ofisler/ofis-3.png',
    en: 1407,
    boy: 1118,
    net: '70,20',
    brut: '76,79',
    genelBrut: '118,92',
    alanlar: [
      { id: 'calisma', ad: 'Çalışma Odası', m2: '61,23', renk: ALAN_RENK.calisma, nokta: { x: 55, y: 58 }, poligon: [{ x: 5, y: 3 }, { x: 47, y: 3 }, { x: 47, y: 30 }, { x: 62, y: 30 }, { x: 62, y: 22 }, { x: 83, y: 22 }, { x: 83, y: 3 }, { x: 95, y: 3 }, { x: 95, y: 68 }, { x: 71, y: 68 }, { x: 71, y: 91 }, { x: 16, y: 92 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '2,83', renk: ALAN_RENK.mutfak, nokta: { x: 72, y: 17 }, poligon: [{ x: 62, y: 3 }, { x: 83, y: 3 }, { x: 83, y: 22 }, { x: 62, y: 22 }] },
      { id: 'wc', ad: 'Wc', m2: '3,21', renk: ALAN_RENK.wc, nokta: { x: 53, y: 15 }, poligon: [{ x: 47, y: 4 }, { x: 62, y: 4 }, { x: 62, y: 30 }, { x: 47, y: 30 }] },
      { id: 'balkon', ad: 'Balkon', m2: '2,93', renk: ALAN_RENK.balkon, nokta: { x: 83, y: 79 }, poligon: [{ x: 71, y: 68 }, { x: 93, y: 68 }, { x: 93, y: 91 }, { x: 71, y: 91 }] },
    ],
  },
  {
    id: 'ofis-4',
    roma: '4',
    ad: 'Ofis 4',
    gorsel: '/images/ofisler/ofis-4.png',
    en: 1323,
    boy: 1189,
    net: '45,22',
    brut: '51,01',
    genelBrut: '78,99',
    alanlar: [
      { id: 'calisma', ad: 'Çalışma Odası', m2: '34,18', renk: ALAN_RENK.calisma, nokta: { x: 57, y: 56 }, poligon: [{ x: 2, y: 3 }, { x: 28, y: 3 }, { x: 28, y: 30 }, { x: 48, y: 30 }, { x: 48, y: 3 }, { x: 85, y: 3 }, { x: 93, y: 68 }, { x: 70, y: 68 }, { x: 70, y: 90 }, { x: 3, y: 90 }, { x: 3, y: 50 }, { x: 16, y: 50 }, { x: 16, y: 27 }, { x: 3, y: 27 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '1,87', renk: ALAN_RENK.mutfak, nokta: { x: 9, y: 38 }, poligon: [{ x: 3, y: 27 }, { x: 16, y: 27 }, { x: 16, y: 50 }, { x: 3, y: 50 }] },
      { id: 'wc', ad: 'Wc', m2: '4', renk: ALAN_RENK.wc, nokta: { x: 39, y: 14 }, poligon: [{ x: 28, y: 3 }, { x: 48, y: 3 }, { x: 48, y: 30 }, { x: 28, y: 30 }] },
      { id: 'balkon', ad: 'Balkon', m2: '5,17', renk: ALAN_RENK.balkon, nokta: { x: 87, y: 80 }, poligon: [{ x: 70, y: 68 }, { x: 93, y: 68 }, { x: 95, y: 90 }, { x: 70, y: 90 }] },
    ],
  },
]
