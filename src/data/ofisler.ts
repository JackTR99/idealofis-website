/**
 * Ofis tipleri — katalog s.19-22'den (OFİS I / III / V / VII).
 * Koordinatlar görselin YÜZDESİ (0-100). Poligonlar plan görseli üzerindeki
 * oda sınırlarıdır; ajan üretimi + bağımsız kontrol sonrası buraya işlenir.
 * Görseller: dördü de Kaan'ın iyileştirilmiş render'ları (İdeal Ofis/Resimler).
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
    roma: 'I',
    ad: 'Ofis I',
    gorsel: '/images/ofisler/ofis-1.png',
    en: 872,
    boy: 1112,
    net: '58,58',
    brut: '65,30',
    genelBrut: '101,12',
    alanlar: [
      { id: 'calisma', ad: 'Çalışma Odası', m2: '50,96', renk: ALAN_RENK.calisma, nokta: { x: 43.53, y: 42.35 }, poligon: [{ x: 6.43, y: 6.03 }, { x: 71.53, y: 6.03 }, { x: 71.89, y: 16.85 }, { x: 71.89, y: 93.34 }, { x: 63.52, y: 93.34 }, { x: 63.52, y: 79.12 }, { x: 55.86, y: 79.12 }, { x: 55.86, y: 77.88 }, { x: 47.84, y: 77.88 }, { x: 47.84, y: 74.96 }, { x: 38.66, y: 74.96 }, { x: 38.66, y: 75.8 }, { x: 24.89, y: 75.8 }, { x: 15.8, y: 43.2 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '1,17', renk: ALAN_RENK.mutfak, nokta: { x: 59.73, y: 87.84 }, poligon: [{ x: 47.66, y: 78.99 }, { x: 63.34, y: 78.99 }, { x: 63.34, y: 93.82 }, { x: 47.66, y: 94.38 }] },
      { id: 'wc', ad: 'Wc', m2: '3,15', renk: ALAN_RENK.wc, nokta: { x: 84.51, y: 84.8 }, poligon: [{ x: 73.42, y: 79.96 }, { x: 95.2, y: 79.96 }, { x: 95.2, y: 93.96 }, { x: 73.42, y: 93.96 }] },
      { id: 'balkon', ad: 'Balkon', m2: '3,30', renk: ALAN_RENK.balkon, nokta: { x: 32.83, y: 88.54 }, poligon: [{ x: 25.43, y: 77.88 }, { x: 39.38, y: 77.88 }, { x: 40.55, y: 84.88 }, { x: 40.73, y: 85.79 }, { x: 44.69, y: 85.79 }, { x: 44.69, y: 93.89 }, { x: 30.02, y: 94.38 }] },
    ],
  },
  {
    id: 'ofis-3',
    roma: 'III',
    ad: 'Ofis III',
    gorsel: '/images/ofisler/ofis-3.png',
    en: 806,
    boy: 614,
    net: '70,20',
    brut: '76,79',
    genelBrut: '118,92',
    alanlar: [
      { id: 'calisma', ad: 'Çalışma Odası', m2: '61,23', renk: ALAN_RENK.calisma, nokta: { x: 57.75, y: 65.96 }, poligon: [{ x: 3.52, y: 5.44 }, { x: 44.73, y: 5.44 }, { x: 44.73, y: 29.95 }, { x: 63.54, y: 29.95 }, { x: 63.54, y: 24.21 }, { x: 78.25, y: 24.21 }, { x: 78.25, y: 30.13 }, { x: 85.32, y: 30.13 }, { x: 85.32, y: 5.44 }, { x: 96.14, y: 5.44 }, { x: 96.14, y: 69.19 }, { x: 94.33, y: 69.19 }, { x: 94.33, y: 76.3 }, { x: 76.69, y: 76.3 }, { x: 76.69, y: 94.04 }, { x: 18.33, y: 94.04 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '2,83', renk: ALAN_RENK.mutfak, nokta: { x: 75.89, y: 17.29 }, poligon: [{ x: 63.67, y: 4.91 }, { x: 83.38, y: 4.91 }, { x: 83.38, y: 22.68 }, { x: 63.67, y: 22.68 }] },
      { id: 'wc', ad: 'Wc', m2: '3,21', renk: ALAN_RENK.wc, nokta: { x: 56.19, y: 16.77 }, poligon: [{ x: 50.91, y: 3.73 }, { x: 62.64, y: 3.73 }, { x: 62.64, y: 27.92 }, { x: 50.91, y: 27.92 }] },
      { id: 'balkon', ad: 'Balkon', m2: '2,93', renk: ALAN_RENK.balkon, nokta: { x: 84.68, y: 85.36 }, poligon: [{ x: 78.62, y: 79.18 }, { x: 96.14, y: 79.18 }, { x: 96.14, y: 95.91 }, { x: 78.62, y: 95.91 }] },
    ],
  },
  {
    id: 'ofis-5',
    roma: 'V',
    ad: 'Ofis V',
    gorsel: '/images/ofisler/ofis-5.png',
    en: 822,
    boy: 918,
    net: '72,52',
    brut: '80,73',
    genelBrut: '125,02',
    alanlar: [
      { id: 'calisma', ad: 'Çalışma Odası', m2: '64,78', renk: ALAN_RENK.calisma, nokta: { x: 32.61, y: 45.3 }, poligon: [{ x: 4.33, y: 25.21 }, { x: 10.32, y: 25.21 }, { x: 10.32, y: 18.19 }, { x: 19.99, y: 18.19 }, { x: 19.99, y: 31.7 }, { x: 39.08, y: 31.7 }, { x: 39.08, y: 18.19 }, { x: 40.36, y: 18.19 }, { x: 40.36, y: 5.67 }, { x: 65.32, y: 5.67 }, { x: 65.32, y: 24.21 }, { x: 83.3, y: 24.21 }, { x: 85.09, y: 25.08 }, { x: 93.56, y: 94.45 }, { x: 48.08, y: 94.45 }, { x: 48.08, y: 82.0 }, { x: 24.78, y: 82.0 }, { x: 24.78, y: 57.58 }, { x: 4.33, y: 57.58 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '1,33', renk: ALAN_RENK.mutfak, nokta: { x: 29.79, y: 29.59 }, poligon: [{ x: 19.99, y: 18.19 }, { x: 39.08, y: 18.19 }, { x: 39.08, y: 31.7 }, { x: 19.99, y: 31.7 }] },
      { id: 'wc', ad: 'Wc', m2: '3,34', renk: ALAN_RENK.wc, nokta: { x: 12.31, y: 69.4 }, poligon: [{ x: 4.33, y: 58.72 }, { x: 16.01, y: 58.72 }, { x: 16.01, y: 65.27 }, { x: 23.88, y: 65.27 }, { x: 23.88, y: 74.04 }, { x: 15.19, y: 74.04 }, { x: 15.19, y: 79.93 }, { x: 4.33, y: 79.93 }] },
      { id: 'balkon', ad: 'Balkon', m2: '3,07', renk: ALAN_RENK.balkon, nokta: { x: 75.83, y: 11.69 }, poligon: [{ x: 67.93, y: 5.67 }, { x: 83.9, y: 5.67 }, { x: 85.92, y: 22.26 }, { x: 71.61, y: 22.26 }, { x: 71.61, y: 14.77 }, { x: 67.93, y: 14.77 }] },
    ],
  },
  {
    id: 'ofis-7',
    roma: 'VII',
    ad: 'Ofis VII',
    gorsel: '/images/ofisler/ofis-7.png',
    en: 598,
    boy: 718,
    net: '45,22',
    brut: '51,01',
    genelBrut: '78,99',
    alanlar: [
      { id: 'calisma', ad: 'Çalışma Odası', m2: '34,18', renk: ALAN_RENK.calisma, nokta: { x: 58.41, y: 53.47 }, poligon: [{ x: 6.53, y: 24.67 }, { x: 49.87, y: 24.67 }, { x: 49.87, y: 55.85 }, { x: 51.73, y: 55.85 }, { x: 51.73, y: 4.61 }, { x: 93.93, y: 4.61 }, { x: 93.93, y: 67.08 }, { x: 77.06, y: 67.08 }, { x: 77.06, y: 93.83 }, { x: 51.73, y: 93.83 }, { x: 51.73, y: 66.36 }, { x: 49.87, y: 66.36 }, { x: 49.87, y: 68.52 }, { x: 44.14, y: 68.52 }, { x: 44.14, y: 72.93 }, { x: 11.81, y: 72.93 }, { x: 11.81, y: 68.63 }, { x: 5.22, y: 68.63 }, { x: 5.22, y: 45.34 }, { x: 6.53, y: 45.34 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '1,87', renk: ALAN_RENK.mutfak, nokta: { x: 75.23, y: 84.28 }, poligon: [{ x: 78.79, y: 74.0 }, { x: 94.22, y: 74.0 }, { x: 94.22, y: 93.83 }, { x: 78.79, y: 93.83 }] },
      { id: 'wc', ad: 'Wc', m2: '4', renk: ALAN_RENK.wc, nokta: { x: 33.13, y: 87.66 }, poligon: [{ x: 12.1, y: 74.71 }, { x: 44.14, y: 74.71 }, { x: 44.14, y: 82.12 }, { x: 49.87, y: 82.12 }, { x: 49.87, y: 93.83 }, { x: 12.1, y: 93.83 }] },
      { id: 'balkon', ad: 'Balkon', m2: '5,17', renk: ALAN_RENK.balkon, nokta: { x: 29.07, y: 12.95 }, poligon: [{ x: 5.09, y: 2.83 }, { x: 48.29, y: 2.83 }, { x: 48.29, y: 22.05 }, { x: 6.53, y: 22.05 }, { x: 6.53, y: 19.42 }, { x: 5.09, y: 19.42 }] },
    ],
  },
]
