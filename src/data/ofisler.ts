/**
 * Ofis tipleri — Kaan'ın iyileştirilmiş render'ları. Poligonlar çok-ajanlı
 * workflow ile (algıla→oluştur→kontrol→düzelt→adversarial doğrula) çıkarıldı;
 * perspektif duvarları ve gri-fayans oda şekilleri birebir izlenir.
 * ⚠️ Ofis 2 ve 4 metrekareleri PLACEHOLDER — Kaan gerçek değerleri verecek.
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
      { id: 'calisma', ad: 'Çalışma Odası', m2: '64,78', renk: ALAN_RENK.calisma, nokta: { x: 45.2, y: 48.56 }, poligon: [{ x: 7.4, y: 7.4 }, { x: 60.3, y: 7.3 }, { x: 60.3, y: 28.4 }, { x: 80.45, y: 28.4 }, { x: 80.45, y: 7.3 }, { x: 89.6, y: 7.3 }, { x: 89.6, y: 28.5 }, { x: 95.4, y: 28.5 }, { x: 95.4, y: 61.8 }, { x: 89.5, y: 62.5 }, { x: 89.4, y: 90 }, { x: 33.2, y: 90 }, { x: 33.2, y: 65 }, { x: 15.7, y: 63.7 }, { x: 8, y: 20 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '1,33', renk: ALAN_RENK.mutfak, nokta: { x: 85.27, y: 17.85 }, poligon: [{ x: 89, y: 7.3 }, { x: 95.3, y: 7.4 }, { x: 95.3, y: 27.5 }, { x: 89, y: 27.5 }] },
      { id: 'wc', ad: 'Wc', m2: '3,34', renk: ALAN_RENK.wc, nokta: { x: 69.41, y: 20.63 }, poligon: [{ x: 62.7, y: 7.4 }, { x: 79.4, y: 7.3 }, { x: 79.4, y: 26.6 }, { x: 62.7, y: 26.6 }] },
      { id: 'balkon', ad: 'Balkon', m2: '3,07', renk: ALAN_RENK.balkon, nokta: { x: 22.37, y: 80.05 }, poligon: [{ x: 14.8, y: 67.2 }, { x: 26.9, y: 66.9 }, { x: 27.2, y: 77.1 }, { x: 31, y: 76.7 }, { x: 31, y: 90 }, { x: 18.5, y: 89.5 }] },
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
      { id: 'calisma', ad: 'Çalışma Odası', m2: '61,23', renk: ALAN_RENK.calisma, nokta: { x: 54.81, y: 58.62 }, poligon: [{ x: 92, y: 5.5 }, { x: 80.7, y: 5.4 }, { x: 80.7, y: 26 }, { x: 42, y: 26 }, { x: 42, y: 5.4 }, { x: 4.5, y: 5.8 }, { x: 15.4, y: 90 }, { x: 17.8, y: 91 }, { x: 73, y: 90.8 }, { x: 75.8, y: 70.4 }, { x: 90.5, y: 70.2 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '2,83', renk: ALAN_RENK.mutfak, nokta: { x: 73.26, y: 16.79 }, poligon: [{ x: 59.5, y: 5.4 }, { x: 80.7, y: 5.4 }, { x: 80.5, y: 25.1 }, { x: 76, y: 25.3 }, { x: 72, y: 26 }, { x: 59.7, y: 26 }] },
      { id: 'wc', ad: 'Wc', m2: '3,21', renk: ALAN_RENK.wc, nokta: { x: 54.4, y: 15.66 }, poligon: [{ x: 49.3, y: 5.4 }, { x: 59.7, y: 5.4 }, { x: 60.3, y: 14 }, { x: 59.8, y: 25.3 }, { x: 49.3, y: 25.3 }] },
      { id: 'balkon', ad: 'Balkon', m2: '2,93', renk: ALAN_RENK.balkon, nokta: { x: 82.72, y: 79.37 }, poligon: [{ x: 76, y: 69.5 }, { x: 90.4, y: 69.5 }, { x: 90.5, y: 71.3 }, { x: 92.5, y: 71.8 }, { x: 92.6, y: 91 }, { x: 76.2, y: 91 }] },
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
      { id: 'calisma', ad: 'Çalışma Odası', m2: '34,18', renk: ALAN_RENK.calisma, nokta: { x: 57.21, y: 56.29 }, poligon: [{ x: 11, y: 7 }, { x: 27.6, y: 7 }, { x: 27.7, y: 25.3 }, { x: 48.5, y: 25.3 }, { x: 47.6, y: 7 }, { x: 84, y: 7 }, { x: 91, y: 67 }, { x: 74.5, y: 70 }, { x: 74.5, y: 92 }, { x: 7, y: 92 }, { x: 7, y: 48.3 }, { x: 19.5, y: 48.3 }, { x: 19.5, y: 27 }, { x: 11, y: 27 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '1,87', renk: ALAN_RENK.mutfak, nokta: { x: 17.47, y: 38.44 }, poligon: [{ x: 4.5, y: 27 }, { x: 17.8, y: 27.3 }, { x: 19.5, y: 31 }, { x: 19.5, y: 43.5 }, { x: 17.8, y: 48.3 }, { x: 4.5, y: 48.3 }] },
      { id: 'wc', ad: 'Wc', m2: '4', renk: ALAN_RENK.wc, nokta: { x: 38.69, y: 13.99 }, poligon: [{ x: 27.7, y: 4.5 }, { x: 47.6, y: 4.5 }, { x: 48.7, y: 25.3 }, { x: 27.7, y: 25 }] },
      { id: 'balkon', ad: 'Balkon', m2: '5,17', renk: ALAN_RENK.balkon, nokta: { x: 86.98, y: 85.09 }, poligon: [{ x: 74.5, y: 75.2 }, { x: 81.7, y: 69.5 }, { x: 87.8, y: 70.6 }, { x: 92.4, y: 74 }, { x: 94.3, y: 92 }, { x: 74.5, y: 92 }] },
    ],
  },
]
