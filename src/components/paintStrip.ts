/**
 * KOD 2 ressamı: barın altındaki şeridi CANLI DOM'dan okuyup tuvale boyar.
 * Bölümleri değil TİPLERİ tanır: zemin kutusu, degrade, görsel, ikon (svg),
 * metin. Yeni bölüm/sayfa eklendiğinde otomatik çalışır — içerik listesi yok.
 * Tuval, WebGL merceğine doku olur; mercek bu kopyayı fizikle büker.
 */

export type Region = { left: number; top: number; right: number; bottom: number }

const svgCache = new Map<string, HTMLImageElement>()

function intersects(r: DOMRect, g: Region): boolean {
  return r.right > g.left && r.left < g.right && r.bottom > g.top && r.top < g.bottom
}

function colorAlpha(c: string): number {
  if (!c || c === 'transparent') return 0
  const m = c.match(/rgba?\(([^)]+)\)/)
  if (!m) return 1
  const parts = m[1].split(',')
  return parts.length >= 4 ? parseFloat(parts[3]) : 1
}

/** üst seviye virgüllerden böl (rgba içindeki virgüllere takılmadan) */
function splitTop(s: string): string[] {
  const out: string[] = []
  let depth = 0
  let cur = ''
  for (const ch of s) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      out.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

/** linear-gradient(...) → tuvale çiz (sitede kullanılan yön+durak sözlüğü) */
function drawLinearGradient(
  ctx: CanvasRenderingContext2D,
  bgImage: string,
  r: DOMRect,
): boolean {
  const m = bgImage.match(/linear-gradient\((.+)\)$/)
  if (!m) return false
  const parts = splitTop(m[1])
  if (!parts.length) return false
  let dir = 'to bottom'
  if (parts[0].startsWith('to ') || parts[0].endsWith('deg')) dir = parts.shift() as string
  const ends: Record<string, [number, number, number, number]> = {
    'to bottom': [r.left, r.top, r.left, r.bottom],
    'to top': [r.left, r.bottom, r.left, r.top],
    'to right': [r.left, r.top, r.right, r.top],
    'to left': [r.right, r.top, r.left, r.top],
  }
  const e = ends[dir] ?? ends['to bottom']
  const grad = ctx.createLinearGradient(e[0], e[1], e[2], e[3])
  const stops = parts
    .map((p) => {
      const sm = p.match(/^(.*?)\s+([\d.]+)%$/)
      return sm ? { c: sm[1], p: parseFloat(sm[2]) / 100 } : { c: p, p: -1 }
    })
    .filter((s) => s.c)
  stops.forEach((s, i) => {
    const pos = s.p >= 0 ? s.p : stops.length === 1 ? 0 : i / (stops.length - 1)
    try {
      grad.addColorStop(Math.min(1, Math.max(0, pos)), s.c)
    } catch {
      /* tanınmayan renk: durağı atla */
    }
  })
  ctx.fillStyle = grad
  ctx.fillRect(r.left, r.top, r.width, r.height)
  return true
}

function drawImageCover(ctx: CanvasRenderingContext2D, el: HTMLImageElement, r: DOMRect) {
  if (!el.complete || !el.naturalWidth || !el.naturalHeight) return
  const cs = getComputedStyle(el)
  if (cs.objectFit === 'cover') {
    const scale = Math.max(r.width / el.naturalWidth, r.height / el.naturalHeight)
    const pos = (cs.objectPosition || '50% 50%').split(' ')
    const pp = (v: string | undefined, fb: number) => {
      const mm = (v || '').match(/([\d.]+)%/)
      return mm ? parseFloat(mm[1]) / 100 : fb
    }
    const px = pp(pos[0], 0.5)
    const py = pp(pos[1], 0.5)
    const dw = el.naturalWidth * scale
    const dh = el.naturalHeight * scale
    const sx = ((dw - r.width) * px) / scale
    const sy = ((dh - r.height) * py) / scale
    try {
      ctx.drawImage(el, sx, sy, r.width / scale, r.height / scale, r.left, r.top, r.width, r.height)
    } catch {
      /* henüz çözülmemiş görsel */
    }
  } else {
    try {
      ctx.drawImage(el, r.left, r.top, r.width, r.height)
    } catch {
      /* yok say */
    }
  }
}

function drawSvg(ctx: CanvasRenderingContext2D, el: SVGSVGElement, r: DOMRect) {
  const key = el.outerHTML
  let im = svgCache.get(key)
  if (!im) {
    im = new Image()
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(key)
    svgCache.set(key, im)
    if (svgCache.size > 80) svgCache.delete(svgCache.keys().next().value as string)
  }
  if (im.complete && im.naturalWidth) ctx.drawImage(im, r.left, r.top, r.width, r.height)
}

type FontMetric = { ascent: number; height: number }
const fontMetrics = new Map<string, FontMetric>()

function metricFor(ctx: CanvasRenderingContext2D, font: string): FontMetric {
  let fm = fontMetrics.get(font)
  if (!fm) {
    const m = ctx.measureText('Hgy')
    fm = {
      ascent: m.actualBoundingBoxAscent || 0,
      height: (m.actualBoundingBoxAscent || 0) + (m.actualBoundingBoxDescent || 0),
    }
    fontMetrics.set(font, fm)
  }
  return fm
}

/** metin düğümünü KELİME KELİME kendi satır kutusuna çizer (çok satır otomatik) */
function drawTextNode(
  ctx: CanvasRenderingContext2D,
  node: Text,
  cs: CSSStyleDeclaration,
  g: Region,
) {
  const s = node.textContent
  if (!s || !s.trim()) return
  const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`.trim()
  ctx.font = font
  const anyCtx = ctx as CanvasRenderingContext2D & { letterSpacing?: string }
  if ('letterSpacing' in anyCtx)
    anyCtx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing
  ctx.fillStyle = cs.color
  ctx.textBaseline = 'alphabetic'
  const fm = metricFor(ctx, font)
  const range = document.createRange()
  const re = /\S+/g
  let m: RegExpExecArray | null
  while ((m = re.exec(s))) {
    range.setStart(node, m.index)
    range.setEnd(node, m.index + m[0].length)
    const r = range.getClientRects()[0]
    if (!r || !intersects(r, g)) continue
    const y = r.top + (r.height - fm.height) / 2 + fm.ascent
    let word = m[0]
    if (cs.textTransform === 'uppercase') word = word.toLocaleUpperCase('tr')
    ctx.fillText(word, r.left, y)
  }
}

function paintElement(ctx: CanvasRenderingContext2D, el: Element, g: Region) {
  if ((el as HTMLElement).dataset?.glassSkip !== undefined) return
  const tag = el.tagName
  if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CANVAS' || tag === 'NOSCRIPT') return
  const r = el.getBoundingClientRect()
  // kesişmeyen dal: çocuklara inme (performansın anahtarı)
  if (r.width <= 0 || r.height <= 0 || !intersects(r, g)) return
  const cs = getComputedStyle(el)
  if (cs.display === 'none' || cs.visibility === 'hidden') return
  const op = parseFloat(cs.opacity)
  if (op <= 0.02) return
  ctx.globalAlpha = Math.min(1, op)

  // 1) zemin rengi (yuvarlak köşeli)
  if (colorAlpha(cs.backgroundColor) > 0) {
    const rad = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, r.height / 2, r.width / 2)
    ctx.fillStyle = cs.backgroundColor
    ctx.beginPath()
    ctx.roundRect(r.left, r.top, r.width, r.height, rad)
    ctx.fill()
  }
  // 2) degrade
  if (cs.backgroundImage && cs.backgroundImage.startsWith('linear-gradient'))
    drawLinearGradient(ctx, cs.backgroundImage, r)

  // 3) görsel / ikon (yaprak düğümler)
  if (el instanceof HTMLImageElement) {
    drawImageCover(ctx, el, r)
    return
  }
  if (el instanceof SVGSVGElement) {
    drawSvg(ctx, el, r)
    return
  }

  // 4) metin + çocuklar (DOM sırası = boyama sırası)
  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) drawTextNode(ctx, child as Text, cs, g)
    else if (child.nodeType === Node.ELEMENT_NODE) paintElement(ctx, child as Element, g)
  }
}

/** şeridi boya: sayfa zemini + görünen her şey (bar hariç) */
export function paintStrip(ctx: CanvasRenderingContext2D, g: Region) {
  const bodyBg = getComputedStyle(document.body).backgroundColor
  ctx.fillStyle = colorAlpha(bodyBg) > 0 ? bodyBg : '#fafafa'
  ctx.fillRect(g.left, g.top, g.right - g.left, g.bottom - g.top)
  for (const child of document.body.children) paintElement(ctx, child, g)
  ctx.globalAlpha = 1
}
