/**
 * Ofis tipleri — katalog s.19-22'den (OFİS I / III / V / VII).
 * Koordinatlar görselin YÜZDESİ (0-100). Poligonlar plan görseli üzerindeki
 * oda sınırlarıdır; ajan üretimi + bağımsız kontrol sonrası buraya işlenir.
 * Görseller: ofis-1 = Kaan'ın iyileştirilmiş render'ı; 3/5/7 katalogdan
 * geçici kırpım — Kaan iyileştirilmişini yükleyince dosya değişir, veri kalır.
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
    id: 'ofis-3',
    roma: 'III',
    ad: 'Ofis III',
    gorsel: '/images/ofisler/ofis-3.png',
    en: 758,
    boy: 564,
    net: '70,20',
    brut: '76,79',
    genelBrut: '118,92',
    alanlar: [
      { id: 'calisma', ad: 'Çalışma Odası', m2: '61,23', renk: ALAN_RENK.calisma, nokta: { x: 58.31, y: 67.18 }, poligon: [{ x: 2.78, y: 3.73 }, { x: 44.98, y: 3.73 }, { x: 44.98, y: 29.43 }, { x: 64.24, y: 29.43 }, { x: 64.24, y: 23.41 }, { x: 79.3, y: 23.41 }, { x: 79.3, y: 29.62 }, { x: 86.54, y: 29.62 }, { x: 86.54, y: 3.73 }, { x: 97.62, y: 3.73 }, { x: 97.62, y: 70.57 }, { x: 95.77, y: 70.57 }, { x: 95.77, y: 78.02 }, { x: 77.71, y: 78.02 }, { x: 77.71, y: 96.62 }, { x: 17.94, y: 96.62 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '2,83', renk: ALAN_RENK.mutfak, nokta: { x: 76.89, y: 16.16 }, poligon: [{ x: 64.37, y: 3.18 }, { x: 84.56, y: 3.18 }, { x: 84.56, y: 21.81 }, { x: 64.37, y: 21.81 }] },
      { id: 'wc', ad: 'Wc', m2: '3,21', renk: ALAN_RENK.wc, nokta: { x: 56.71, y: 15.61 }, poligon: [{ x: 51.31, y: 1.94 }, { x: 63.32, y: 1.94 }, { x: 63.32, y: 27.3 }, { x: 51.31, y: 27.3 }] },
      { id: 'balkon', ad: 'Balkon', m2: '2,93', renk: ALAN_RENK.balkon, nokta: { x: 85.89, y: 87.52 }, poligon: [{ x: 79.68, y: 81.04 }, { x: 97.62, y: 81.04 }, { x: 97.62, y: 98.58 }, { x: 79.68, y: 98.58 }] },
    ],
  },
  {
    id: 'ofis-5',
    roma: 'V',
    ad: 'Ofis V',
    gorsel: '/images/ofisler/ofis-5.png',
    en: 1260,
    boy: 1388,
    net: '72,52',
    brut: '80,73',
    genelBrut: '125,02',
    alanlar: [
      { id: 'calisma', ad: 'Çalışma Odası', m2: '64,78', renk: ALAN_RENK.calisma, nokta: { x: 32.18, y: 44.84 }, poligon: [{ x: 2.22, y: 23.2 }, { x: 8.57, y: 23.2 }, { x: 8.57, y: 15.64 }, { x: 18.81, y: 15.64 }, { x: 18.81, y: 30.19 }, { x: 39.04, y: 30.19 }, { x: 39.04, y: 15.64 }, { x: 40.39, y: 15.64 }, { x: 40.39, y: 2.16 }, { x: 66.83, y: 2.16 }, { x: 66.83, y: 22.12 }, { x: 85.88, y: 22.12 }, { x: 87.77, y: 23.06 }, { x: 96.75, y: 97.77 }, { x: 48.57, y: 97.77 }, { x: 48.57, y: 84.36 }, { x: 23.89, y: 84.36 }, { x: 23.89, y: 58.07 }, { x: 2.22, y: 58.07 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '1,33', renk: ALAN_RENK.mutfak, nokta: { x: 29.19, y: 27.92 }, poligon: [{ x: 18.81, y: 15.64 }, { x: 39.04, y: 15.64 }, { x: 39.04, y: 30.19 }, { x: 18.81, y: 30.19 }] },
      { id: 'wc', ad: 'Wc', m2: '3,34', renk: ALAN_RENK.wc, nokta: { x: 10.68, y: 70.8 }, poligon: [{ x: 2.22, y: 59.29 }, { x: 14.6, y: 59.29 }, { x: 14.6, y: 66.35 }, { x: 22.93, y: 66.35 }, { x: 22.93, y: 75.79 }, { x: 13.73, y: 75.79 }, { x: 13.73, y: 82.14 }, { x: 2.22, y: 82.14 }] },
      { id: 'balkon', ad: 'Balkon', m2: '3,07', renk: ALAN_RENK.balkon, nokta: { x: 77.96, y: 8.64 }, poligon: [{ x: 69.6, y: 2.16 }, { x: 86.51, y: 2.16 }, { x: 88.65, y: 20.03 }, { x: 73.49, y: 20.03 }, { x: 73.49, y: 11.96 }, { x: 69.6, y: 11.96 }] },
    ],
  },
  {
    id: 'ofis-7',
    roma: 'VII',
    ad: 'Ofis VII',
    gorsel: '/images/ofisler/ofis-7.png',
    en: 672,
    boy: 796,
    net: '45,22',
    brut: '51,01',
    genelBrut: '78,99',
    alanlar: [
      { id: 'calisma', ad: 'Çalışma Odası', m2: '34,18', renk: ALAN_RENK.calisma, nokta: { x: 59.03, y: 54.78 }, poligon: [{ x: 5.07, y: 24.49 }, { x: 50.14, y: 24.49 }, { x: 50.14, y: 57.29 }, { x: 52.08, y: 57.29 }, { x: 52.08, y: 3.39 }, { x: 95.97, y: 3.39 }, { x: 95.97, y: 69.1 }, { x: 78.42, y: 69.1 }, { x: 78.42, y: 97.24 }, { x: 52.08, y: 97.24 }, { x: 52.08, y: 68.34 }, { x: 50.14, y: 68.34 }, { x: 50.14, y: 70.61 }, { x: 44.19, y: 70.61 }, { x: 44.19, y: 75.25 }, { x: 10.56, y: 75.25 }, { x: 10.56, y: 70.73 }, { x: 3.71, y: 70.73 }, { x: 3.71, y: 46.23 }, { x: 5.07, y: 46.23 }] },
      { id: 'mutfak', ad: 'Mutfak Nişi', m2: '1,87', renk: ALAN_RENK.mutfak, nokta: { x: 76.52, y: 87.19 }, poligon: [{ x: 80.22, y: 76.38 }, { x: 96.27, y: 76.38 }, { x: 96.27, y: 97.24 }, { x: 80.22, y: 97.24 }] },
      { id: 'wc', ad: 'Wc', m2: '4', renk: ALAN_RENK.wc, nokta: { x: 32.73, y: 90.75 }, poligon: [{ x: 10.86, y: 77.13 }, { x: 44.19, y: 77.13 }, { x: 44.19, y: 84.92 }, { x: 50.14, y: 84.92 }, { x: 50.14, y: 97.24 }, { x: 10.86, y: 97.24 }] },
      { id: 'balkon', ad: 'Balkon', m2: '5,17', renk: ALAN_RENK.balkon, nokta: { x: 28.51, y: 12.16 }, poligon: [{ x: 3.57, y: 1.51 }, { x: 48.5, y: 1.51 }, { x: 48.5, y: 21.73 }, { x: 5.07, y: 21.73 }, { x: 5.07, y: 18.97 }, { x: 3.57, y: 18.97 }] },
    ],
  },
]
