import { useEffect, useRef } from 'react'

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `precision highp float;
uniform float uTime;
uniform vec2 uRes;

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;

  // gentle liquid wobble — smooth waves, not turbulent smoke
  float wob = sin(uv.x * 6.0 + uTime * 0.6) * 0.020
            + sin(uv.x * 3.0 - uTime * 0.35) * 0.035;
  float x = uv.x + wob;

  // clean moving specular glints (glass light streaks)
  float a = sin((x * 2.2 + uv.y * 0.5) * 3.14159 - uTime * 0.65);
  float glint1 = pow(max(a, 0.0), 7.0);
  float b = sin((x * 1.25 - uv.y * 0.35) * 3.14159 - uTime * 0.40 + 2.0);
  float glint2 = pow(max(b, 0.0), 16.0);

  // edge highlights for the glass rim (top + bottom)
  float topLight = smoothstep(1.0, 0.3, uv.y) * 0.06;
  float rim = (smoothstep(0.85, 1.0, uv.y) + smoothstep(0.15, 0.0, uv.y)) * 0.10;

  float sheen = glint1 * 0.14 + glint2 * 0.24 + topLight + rim;
  gl_FragColor = vec4(vec3(1.0), clamp(sheen, 0.0, 0.5));
}`

export default function LiquidGlass({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    })
    if (!gl || gl.isContextLost()) return

    const compile = (type: number, src: string, name: string) => {
      const s = gl.createShader(type)
      if (!s) return null
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(`LiquidGlass ${name} compile failed:`, gl.getShaderInfoLog(s))
        return null
      }
      return s
    }

    const vs = compile(gl.VERTEX_SHADER, VERT, 'vertex')
    const fs = compile(gl.FRAGMENT_SHADER, FRAG, 'fragment')
    if (!vs || !fs) return

    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('LiquidGlass link failed:', gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uRes = gl.getUniformLocation(prog, 'uRes')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    let raf = 0
    const start = performance.now()
    const render = () => {
      if (gl.isContextLost()) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.floor((canvas.clientWidth || 0) * dpr))
      const h = Math.max(1, Math.floor((canvas.clientHeight || 0) * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(render)
    }
    render()

    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(render)
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
