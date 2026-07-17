/**
 * İLETİŞİM — SİTE GENELİNDE TEK KAYNAK.
 *
 * Telefon, WhatsApp, e-posta, adres ve çalışma saatleri YALNIZ burada tanımlıdır.
 * Başka hiçbir dosyada numara/adres/saat SABİT YAZILMAZ; hepsi buradan import edilir.
 * Kaan gerçek değerleri verince SADECE bu dosya güncellenir; site tamamı düzelir.
 *
 * Okuyan dosyalar:
 *   src/components/IletisimCta.tsx   (anasayfa + Hakkımızda kapanış bandı)
 *   src/pages/Iletisim.tsx           (iletişim sayfası)
 *   src/pages/NedenIdeal.tsx         (kapanış paneli)
 */

/* ── TELEFON ─────────────────────────────────────────────────────────────── */
// MOCK — Kaan gerçeğini verecek (katalogdan gelen sabit hat, doğrulanmadı)
// Görünen biçim TEK: '+90 232 325 04 44' (Türkiye standart gruplama)
export const TEL = '+90 232 325 04 44'
export const TEL_DIGITS = '902323250444'
export const TEL_HREF = `tel:+${TEL_DIGITS}`

/* ── WHATSAPP ────────────────────────────────────────────────────────────── */
// MOCK — Kaan gerçeğini verecek. WhatsApp şimdilik AYNI hat.
// WhatsApp genelde ayrı bir GSM hattıdır ve sabit hat WhatsApp'ta çalışmayabilir;
// Kaan ayrı numara verirse YALNIZ WA_DIGITS değişir.
export const WA_DIGITS = TEL_DIGITS
export const WHATSAPP = TEL // ekranda gösterilen WhatsApp numarası
export const WA_HREF = `https://wa.me/${WA_DIGITS}`

// MOCK — hazır mesaj metni de yer tutucu
export const WA_MESAJ = 'Merhaba, idealofis hakkında bilgi almak istiyorum.'
export const WA_HREF_MESAJLI = `${WA_HREF}?text=${encodeURIComponent(WA_MESAJ)}`

/* ── E-POSTA ─────────────────────────────────────────────────────────────── */
// MOCK — Kaan gerçeğini verecek
export const EPOSTA = 'bilgi@idealofis.com.tr'
export const EPOSTA_HREF = `mailto:${EPOSTA}`

/* ── ADRES ───────────────────────────────────────────────────────────────── */
// MOCK — Kaan gerçeğini verecek (mahalle / sokak / kapı no uydurma)
// Not: mahalle ve cadde, mesafe araştırmasındaki ters geokodla uyumlu taslağa çekildi
// (Mansuroğlu Mah., Ankara Cad., 35535 Bayraklı). Kapı no hâlâ yer tutucu.
export const ADRES = 'Mansuroğlu Mah. Ankara Cad. No: 00, idealofis, 35535 Bayraklı / İzmir'
// MOCK — satış ofisinin kat bilgisi teyit edilmedi
export const SATIS_OFISI_NOT = 'Proje alanının içinde, zemin kat.'
// MOCK — Kaan gerçeğini verecek (kısa cümle; NedenIdeal kapanış panelinde geçer)
export const SATIS_OFISI_KISA = 'Satış ofisimiz proje içinde, Bayraklı.'
// Koordinat GERÇEK: 38.449961, 27.185122 (Yandex kaydı + site harita pini + katalog
// çapraz doğrulaması, bkz. mesafe araştırması). Adres METNİ hâlâ MOCK. Kaan gerçek
// adresi verince yalnız yukarıdaki ADRES sabiti güncellenir, bu bağlantı değişmez.
export const MAPS_YOL_TARIFI =
  'https://www.google.com/maps/dir/?api=1&destination=38.449961,27.185122'

/* ── ÇALIŞMA SAATLERİ ────────────────────────────────────────────────────── */
export interface CalismaSatiri {
  id: string
  gun: string // ekranda görünen satır etiketi
  gunIndeksleri: number[] // JS getDay(): 0 Pazar … 6 Cumartesi
  ac: string | null // 'HH:MM' (24s, sıfır dolgulu) — null = kapalı
  kapa: string | null
  not?: string
}

// MOCK — Kaan gerçeğini verecek (çalışma saatlerinin TAMAMI uydurma)
const HAFTA_ICI: CalismaSatiri = {
  id: 'hafta-ici',
  gun: 'Pazartesi – Cuma',
  gunIndeksleri: [1, 2, 3, 4, 5],
  ac: '09:00',
  kapa: '18:30',
}
const CUMARTESI: CalismaSatiri = {
  id: 'cumartesi',
  gun: 'Cumartesi',
  gunIndeksleri: [6],
  ac: '10:00',
  kapa: '16:00',
}
const PAZAR: CalismaSatiri = {
  id: 'pazar',
  gun: 'Pazar',
  gunIndeksleri: [0],
  ac: null,
  kapa: null,
  not: 'Randevu ile açık',
}

export const CALISMA_SAATLERI: CalismaSatiri[] = [HAFTA_ICI, CUMARTESI, PAZAR]

// Üstteki saatlerden TÜRETİLİR — saat değişirse bu cümleler de kendiliğinden değişir.
export const CALISMA_SAATLERI_KISA = `Hafta içi ${HAFTA_ICI.ac} – ${HAFTA_ICI.kapa}, Cumartesi ${CUMARTESI.ac} – ${CUMARTESI.kapa}.`
export const CALISMA_OZET = 'Haftanın altı günü açık'
export const GUN_ADLARI = [
  'Pazar',
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
]
