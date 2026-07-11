import { useEffect, useRef } from 'react'

/**
 * Kubbe (dome) pill mercek: sayfadaki [data-glass-bg] görselinin navbar'ın
 * altına düşen dilimini WebGL ile örnekleyip dışa bombeli cam gibi büker.
 * Görselle çakışma bittiğinde (scroll) efekt zarifçe kaybolur, altta
 * backdrop-blur cam kalır. Safari dahil her yerde çalışır.
 */

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uUvOff;
uniform vec2 uUvScale;
uniform vec2 uHeroSpanX;   // hero rect: left, width (CSS px)
uniform vec2 uCanvasSpanX; // canvas rect: left, width (CSS px)

float sdPill(vec2 q, vec2 h, float r){
  vec2 d = abs(q) - (h - vec2(r));
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
}

void main(){
  vec2 fragPx = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 h = uRes * 0.5;
  float r = h.y;
  vec2 q = fragPx - h;
  float d = sdPill(q, h, r);
  if (d > 1.5) discard;

  float e = clamp(-d, 0.0, r);
  float t = e / r;                                 // 0 = kenar, 1 = tepe (plato)
  float omt = 1.0 - t;

  vec2 ex = vec2(1.0, 0.0);
  vec2 grad = vec2(
    sdPill(q + ex.xy, h, r) - sdPill(q - ex.xy, h, r),
    sdPill(q + ex.yx, h, r) - sdPill(q - ex.yx, h, r));
  vec2 dir = normalize(grad + vec2(1e-5));

  float bend = omt * omt;                          // genis kubbe kirilmasi
  vec2 nPos = fragPx / uRes;
  vec2 base = uUvOff + nPos * uUvScale;            // merkez 1:1, mercek yok
  vec2 offUv = (dir * bend * (uRes.y * 0.52) / uRes) * uUvScale;
  vec2 rc = base + offUv;                          // kirilmis ornekleme noktasi

  // dagilma (defocus): kirilan nokta etrafinda dairesel 9 ornek;
  // yaricap bukumle buyur -> kenarda metin erir, merkez jilet net.
  // renk sacilimi dagilmanin icine islenir (radyal bilesene gore agirlik).
  float blurPx = bend * uRes.y * 0.18;
  vec3 acc = vec3(0.0);
  vec3 wsum = vec3(0.0);
  for (int i = 0; i < 9; i++){
    float fi = float(i);
    float ang = fi * 2.39996;
    float rad = sqrt((fi + 0.5) / 9.0);
    vec2 dsk = vec2(cos(ang), sin(ang)) * rad;
    vec2 su = rc + (dsk * blurPx / uRes) * uUvScale;
    float pr = dot(dsk, dir);
    vec3 w = vec3(0.55 + 0.35 * pr, 0.65, 0.55 - 0.35 * pr);
    acc += texture2D(uTex, su).rgb * w;
    wsum += w;
  }
  vec3 col = acc / wsum;

  // hero'daki koyu degrade katmanin aynisi (from-ink/85 via-ink/60 to-ink/30)
  float pageX = uCanvasSpanX.x + nPos.x * uCanvasSpanX.y;
  float gx = clamp((pageX - uHeroSpanX.x) / max(uHeroSpanX.y, 1.0), 0.0, 1.0);
  float ovl = gx < 0.5 ? mix(0.85, 0.60, gx * 2.0) : mix(0.60, 0.30, (gx - 0.5) * 2.0);
  col = mix(col, vec3(0.078), ovl * 0.72);         // cam isigi toplar: sahneden bir tik aydinlik

  col = mix(col, vec3(1.0), 0.03);                  // cam tonu

  // kubbe ustunden her yone yayilan isik (onceki comert parlaklik)
  float topness = clamp(-q.y / h.y, 0.0, 1.0);
  float rim = omt * omt * omt;
  col += rim * (0.26 * topness + 0.05);

  float aa = clamp(-d, 0.0, 1.5) / 1.5;
  gl_FragColor = vec4(col, 0.80 * aa);
}`

function parsePercent(v: string, fallback: number): number {
  const m = v.match(/([\d.]+)%/)
  return m ? parseFloat(m[1]) / 100 : fallback
}

export default function LensGlass({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true })
    if (!gl || gl.isContextLost()) return

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)
      if (!s) return null
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('LensGlass shader:', gl.getShaderInfoLog(s))
        return null
      }
      return s
    }
    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('LensGlass link:', gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uUvOff = gl.getUniformLocation(prog, 'uUvOff')
    const uUvScale = gl.getUniformLocation(prog, 'uUvScale')
    const uHeroSpanX = gl.getUniformLocation(prog, 'uHeroSpanX')
    const uCanvasSpanX = gl.getUniformLocation(prog, 'uCanvasSpanX')
    gl.clearColor(0, 0, 0, 0)

    // ---- doku (hero görseli) ----
    let tex: WebGLTexture | null = null
    let texSrc = ''
    let texW = 0
    let texH = 0
    const loadTexture = (src: string) => {
      texSrc = src
      const im = new Image()
      im.crossOrigin = 'anonymous'
      im.onload = () => {
        if (texSrc !== src || gl.isContextLost()) return
        tex = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        texW = im.naturalWidth
        texH = im.naturalHeight
        draw()
      }
      im.src = src
    }

    const draw = () => {
      if (gl.isContextLost()) return
      const bg = document.querySelector<HTMLImageElement>('[data-glass-bg]')
      if (!bg || !bg.currentSrc) {
        canvas.style.opacity = '0'
        return
      }
      if (bg.currentSrc !== texSrc) loadTexture(bg.currentSrc)
      if (!tex || !texW || !texH) {
        canvas.style.opacity = '0'
        return
      }

      const C = canvas.getBoundingClientRect()
      const R = bg.getBoundingClientRect()
      if (C.width < 2 || C.height < 2) return

      // KOD A: bar hero'daki halini tüm sitede taşır — hero dikdörtgeni
      // scroll=0 konumuyla değerlendirilir, görünüm kaydırmayla değişmez.
      const heroTop0 = R.top + window.scrollY
      const heroBottom0 = heroTop0 + R.height
      const inter = Math.min(C.bottom, heroBottom0) - Math.max(C.top, heroTop0)
      const frac = Math.max(0, Math.min(1, inter / C.height))
      canvas.style.opacity = String(frac)
      if (frac <= 0) return

      // object-fit: cover + object-position eşlemesi
      const cs = getComputedStyle(bg)
      const pos = (cs.objectPosition || '50% 50%').split(' ')
      const px = parsePercent(pos[0] || '', 0.5)
      const py = parsePercent(pos[1] || '', 0.5)
      const scale = Math.max(R.width / texW, R.height / texH)
      const dispW = texW * scale
      const dispH = texH * scale
      const originX = R.left + (R.width - dispW) * px
      const originY = heroTop0 + (R.height - dispH) * py

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.floor(C.width * dpr))
      const hh = Math.max(1, Math.floor(C.height * dpr))
      if (canvas.width !== w || canvas.height !== hh) {
        canvas.width = w
        canvas.height = hh
        gl.viewport(0, 0, w, hh)
      }

      gl.uniform2f(uRes, w, hh)
      gl.uniform2f(uUvOff, (C.left - originX) / dispW, (C.top - originY) / dispH)
      gl.uniform2f(uUvScale, C.width / dispW, C.height / dispH)
      gl.uniform2f(uHeroSpanX, R.left, R.width)
      gl.uniform2f(uCanvasSpanX, C.left, C.width)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    let raf = 0
    const loop = () => {
      draw()
      raf = requestAnimationFrame(loop)
    }
    loop()
    window.addEventListener('scroll', draw, { passive: true })
    window.addEventListener('resize', draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', draw)
      window.removeEventListener('resize', draw)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ transition: 'opacity 0.25s ease' }}
      aria-hidden="true"
    />
  )
}
