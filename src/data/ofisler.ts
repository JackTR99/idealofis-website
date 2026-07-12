/**
 * Ofis tipleri — Kaan'ın iyileştirilmiş kuşbakışı render'ları (İndirilenler).
 * Koordinatlar görselin YÜZDESİ (0-100). Poligonlar oda sınırlarıdır (cv2 segmentasyon).
 * ⚠️ Ofis 2 ve Ofis 4 metrekareleri PLACEHOLDER (yeni/yeniden tasarlanmış planlar,
 *    katalogda karşılığı yok) — Kaan gerçek değerleri verecek.
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
      { id: 'calisma', ad: 'Çalışma Odası', m2: '64,78', renk: ALAN_RENK.calisma, nokta: { x: 45.17, y: 48.53 }, poligon: [{ x: 96.97, y: 25.68 }, { x: 62.74, y: 26.85 }, { x: 62.31, y: 11.71 }, { x: 77.63, y: 12.79 }, { x: 78.33, y: 5.5 }, { x: 3.67, y: 5.77 }, { x: 13.13, y: 66.31 }, { x: 20.96, y: 66.58 }, { x: 22.3, y: 74.23 }, { x: 31.55, y: 77.57 }, { x: 27.03, y: 90.36 }, { x: 17.08, y: 91.98 }, { x: 96.97, y: 92.07 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '1,33', renk: ALAN_RENK.mutfak, nokta: { x: 87.0, y: 16.5 }, poligon: [{ x: 78.5, y: 6.5 }, { x: 96.5, y: 6.5 }, { x: 96.5, y: 25.5 }, { x: 78.5, y: 25.5 }] },
      { id: 'wc', ad: 'Wc', m2: '3,34', renk: ALAN_RENK.wc, nokta: { x: 66.5, y: 20.5 }, poligon: [{ x: 62.67, y: 10.63 }, { x: 62.6, y: 26.4 }, { x: 79.68, y: 26.85 }, { x: 79.32, y: 13.33 }, { x: 70.85, y: 14.32 }, { x: 70.36, y: 7.21 }, { x: 66.83, y: 13.69 }] },
      { id: 'balkon', ad: 'Balkon', m2: '3,07', renk: ALAN_RENK.balkon, nokta: { x: 22.32, y: 80.01 }, poligon: [{ x: 13.48, y: 67.21 }, { x: 16.73, y: 88.74 }, { x: 27.24, y: 90.0 }, { x: 27.1, y: 84.86 }, { x: 31.05, y: 84.95 }, { x: 30.98, y: 76.94 }, { x: 21.74, y: 74.86 }, { x: 20.82, y: 69.01 }, { x: 24.28, y: 67.12 }] },
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
      { id: 'calisma', ad: 'Çalışma Odası', m2: '61,23', renk: ALAN_RENK.calisma, nokta: { x: 54.79, y: 58.58 }, poligon: [{ x: 4.12, y: 3.85 }, { x: 16.13, y: 92.84 }, { x: 94.24, y: 92.84 }, { x: 93.89, y: 3.85 }, { x: 82.59, y: 3.85 }, { x: 81.66, y: 21.02 }, { x: 60.41, y: 21.11 }, { x: 58.64, y: 25.49 }, { x: 52.45, y: 20.21 }, { x: 50.39, y: 25.58 }, { x: 49.04, y: 5.64 }, { x: 59.84, y: 3.85 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '2,83', renk: ALAN_RENK.mutfak, nokta: { x: 72.5, y: 12.0 }, poligon: [{ x: 60.5, y: 3.0 }, { x: 82.0, y: 3.0 }, { x: 82.0, y: 20.5 }, { x: 60.5, y: 20.5 }] },
      { id: 'wc', ad: 'Wc', m2: '3,21', renk: ALAN_RENK.wc, nokta: { x: 53.0, y: 15.2 }, poligon: [{ x: 59.56, y: 5.55 }, { x: 49.4, y: 5.46 }, { x: 49.4, y: 24.96 }, { x: 51.31, y: 24.78 }, { x: 51.39, y: 19.59 }, { x: 57.43, y: 19.32 }, { x: 57.78, y: 24.69 }, { x: 59.56, y: 24.96 }] },
      { id: 'balkon', ad: 'Balkon', m2: '2,93', renk: ALAN_RENK.balkon, nokta: { x: 82.67, y: 79.33 }, poligon: [{ x: 90.62, y: 67.62 }, { x: 76.12, y: 69.95 }, { x: 80.88, y: 91.14 }, { x: 85.36, y: 91.14 }, { x: 86.99, y: 83.9 }, { x: 92.18, y: 82.74 }] },
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
      { id: 'calisma', ad: 'Çalışma Odası', m2: '34,18', renk: ALAN_RENK.calisma, nokta: { x: 57.2, y: 56.24 }, poligon: [{ x: 3.17, y: 2.69 }, { x: 3.02, y: 27.08 }, { x: 15.87, y: 27.17 }, { x: 16.1, y: 49.2 }, { x: 2.95, y: 49.71 }, { x: 3.02, y: 94.2 }, { x: 79.59, y: 92.09 }, { x: 75.81, y: 82.76 }, { x: 80.05, y: 67.45 }, { x: 89.12, y: 66.69 }, { x: 86.62, y: 74.52 }, { x: 91.31, y: 76.53 }, { x: 93.42, y: 69.81 }, { x: 85.56, y: 2.78 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '1,87', renk: ALAN_RENK.mutfak, nokta: { x: 9.5, y: 38.0 }, poligon: [{ x: 4.0, y: 27.0 }, { x: 15.5, y: 27.0 }, { x: 15.5, y: 50.0 }, { x: 4.0, y: 50.0 }] },
      { id: 'wc', ad: 'Wc', m2: '4', renk: ALAN_RENK.wc, nokta: { x: 38.64, y: 13.94 }, poligon: [{ x: 27.89, y: 4.54 }, { x: 27.74, y: 24.31 }, { x: 29.48, y: 18.25 }, { x: 36.21, y: 18.33 }, { x: 36.66, y: 24.05 }, { x: 40.82, y: 25.57 }, { x: 48.6, y: 23.63 }, { x: 47.54, y: 4.54 }] },
      { id: 'balkon', ad: 'Balkon', m2: '5,17', renk: ALAN_RENK.balkon, nokta: { x: 86.94, y: 85.04 }, poligon: [{ x: 90.1, y: 67.12 }, { x: 80.73, y: 67.2 }, { x: 76.19, y: 83.85 }, { x: 80.05, y: 85.87 }, { x: 80.35, y: 92.51 }, { x: 74.07, y: 94.53 }, { x: 95.99, y: 93.1 }, { x: 93.5, y: 70.48 }, { x: 92.14, y: 77.54 }, { x: 85.49, y: 74.94 }] },
    ],
  },
]
