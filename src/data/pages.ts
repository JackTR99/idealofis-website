export interface PageDef {
  path: string
  label: string
  title: string
}

export const PAGES: PageDef[] = [
  { path: '/hakkimizda', label: 'Hakkımızda', title: 'Hakkımızda' },
  { path: '/neden-ideal', label: 'Neden İdeal', title: 'Neden İdeal' },
  { path: '/ofislerimiz', label: 'Ofislerimiz', title: 'Ofislerimiz' },
  {
    path: '/toplanti-salonlari',
    label: 'Toplantı Salonlarımız',
    title: 'Toplantı Salonlarımız',
  },
  { path: '/sertifikasyonlar', label: 'Sertifikasyonlar', title: 'Sertifikasyonlar' },
  { path: '/iletisim', label: 'İletişim', title: 'İletişim' },
]

export const LEGAL_PAGES: PageDef[] = [
  { path: '/kvkk', label: 'KVKK', title: 'KVKK' },
  { path: '/cerez-politikasi', label: 'Çerez Politikası', title: 'Çerez Politikası' },
]
