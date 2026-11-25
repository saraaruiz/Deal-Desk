/*
 * Shared shader canvas manager.
 *
 * ONE plain WebGL1 context for the whole page (never two contexts alive at once). The single <canvas>
 * is moved into whichever registered host (Hero, Invitation) is most visible. The RAF loop runs only
 * while a host is on screen AND the tab is visible. With reduced motion it renders a single still frame.
 *
 * Shader: "Static Mesh Gradient" adapted from Paper Shaders (https://shaders.paper.design/static-mesh-gradient),
 * Apache-2.0. See meshFrag.ts for the attribution header and the unmodified fragment shader.
 */
import { MESH_FRAG, MESH_VERT } from './meshFrag'

export interface ShaderHostOptions {
  /** 0..1 (35/100 -> 0.35) */
  intensity: number
  /** additive brightness, 0 by default (header: u_surface.z = 0.00) */
  brightness?: number
  /** called once the first frame has been painted on this host (to fade the canvas in) */
  onReady?: (ready: boolean) => void
}

// Colours low -> high, exactly as in the shader header (vec3 in 0..1).
const COLORS = [
  [0.031, 0.075, 0.149], // #081326
  [0.016, 0.02, 0.18], //   #04052E
  [0.412, 0.255, 0.882], // #6941E1
  [0.569, 0.42, 0.749], //  #916BBF
]

const SPEED = 0.27 // header: u_scene.z = seconds * 0.27

interface Host {
  el: HTMLElement
  opts: ShaderHostOptions
  ratio: number
}

class ShaderManager {
  private canvas: HTMLCanvasElement | null = null
  private gl: WebGLRenderingContext | null = null
  private loc: Record<string, WebGLUniformLocation | null> = {}
  private hosts = new Map<HTMLElement, Host>()
  private io: IntersectionObserver | null = null
  private active: Host | null = null
  private raf = 0
  private failed = false
  private t0 = performance.now()
  private reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  private mouse = { x: 0, y: 0, tx: 0, ty: 0, presence: 0, target: 0 }
  private ro: ResizeObserver | null = null

  register(el: HTMLElement, opts: ShaderHostOptions) {
    const host: Host = { el, opts, ratio: 0 }
    this.hosts.set(el, host)
    this.ensureObserver().observe(el)
    return () => {
      this.hosts.delete(el)
      this.io?.unobserve(el)
      if (this.active === host) {
        this.active = null
        host.opts.onReady?.(false)
        this.pick()
      }
    }
  }

  private ensureObserver() {
    if (!this.io) {
      document.addEventListener('visibilitychange', () => this.sync())
      window.addEventListener('pointermove', this.onMove, { passive: true })
      this.io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const h = this.hosts.get(e.target as HTMLElement)
            if (h) h.ratio = e.isIntersecting ? e.intersectionRatio : 0
          }
          this.pick()
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
      )
    }
    return this.io
  }

  /** Most visible host wins. */
  private pick() {
    let best: Host | null = null
    for (const h of this.hosts.values()) if (h.ratio > 0 && (!best || h.ratio > best.ratio)) best = h
    if (best !== this.active) {
      this.active?.opts.onReady?.(false)
      this.active = best
      if (best) this.mount(best)
    }
    this.sync()
  }

  private init() {
    if (this.gl || this.failed) return !this.failed
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true') // decorative
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none'
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) return (this.failed = true), false
    const mk = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
    }
    const vs = mk(gl.VERTEX_SHADER, MESH_VERT)
    const fs = mk(gl.FRAGMENT_SHADER, MESH_FRAG)
    if (!vs || !fs) return (this.failed = true), false
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.bindAttribLocation(prog, 0, 'a_pos')
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return (this.failed = true), false
    gl.useProgram(prog)
    // Fullscreen triangle
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    for (const n of ['u_colors', 'u_scene', 'u_shape', 'u_surface', 'u_finish', 'u_transform', 'u_space', 'u_cursor'])
      this.loc[n] = gl.getUniformLocation(prog, n)
    // u_colors[8] (first 4 used)
    const flat = new Float32Array(24)
    COLORS.forEach((c, i) => flat.set(c, i * 3))
    gl.uniform3fv(this.loc.u_colors, flat)
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault()
      cancelAnimationFrame(this.raf)
      this.raf = 0
    })
    canvas.addEventListener('webglcontextrestored', () => {
      this.gl = null
      this.canvas = null
      this.failed = false
      if (this.active) this.mount(this.active)
      this.sync()
    })
    this.canvas = canvas
    this.gl = gl
    this.ro = new ResizeObserver(() => {
      this.resize()
      if (this.reduced) this.draw()
    })
    return true
  }

  private mount(host: Host) {
    if (!this.init() || !this.canvas) {
      host.opts.onReady?.(false) // stays on the CSS gradient fallback
      return
    }
    host.el.prepend(this.canvas) // behind the content (the host's content sits above, z-index)
    this.ro?.disconnect()
    this.ro?.observe(host.el)
    this.resize()
    this.draw()
    host.opts.onReady?.(true)
  }

  private resize() {
    if (!this.canvas || !this.active) return
    const r = this.active.el.getBoundingClientRect()
    // DPR capped at 2 (1.5 on mobile / coarse pointers)
    const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
    const w = Math.max(2, Math.round(r.width * dpr))
    const h = Math.max(2, Math.round(r.height * dpr))
    if (this.canvas.width !== w) this.canvas.width = w
    if (this.canvas.height !== h) this.canvas.height = h
  }

  // Page-wide pointer tracking (content sits above the canvas, so the host itself never sees events).
  private onMove = (e: PointerEvent) => {
    if (!this.active || e.pointerType === 'touch') return
    const r = this.active.el.getBoundingClientRect()
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
    this.mouse.target = inside && !this.reduced ? 1 : 0
    this.mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1
    this.mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  /** Start/stop the loop: only when a host is on screen and the tab is visible. */
  private sync() {
    const run = !!this.active && !!this.gl && document.visibilityState === 'visible' && !this.reduced
    if (run && !this.raf) {
      this.raf = requestAnimationFrame(this.loop)
    } else if (!run && this.raf) {
      cancelAnimationFrame(this.raf)
      this.raf = 0
    }
  }

  private loop = () => {
    this.raf = 0
    if (!this.active || document.visibilityState !== 'visible') return
    this.draw()
    this.raf = requestAnimationFrame(this.loop)
  }

  private draw() {
    const gl = this.gl
    if (!gl || !this.canvas || !this.active) return
    const m = this.mouse
    m.x += (m.tx - m.x) * 0.12
    m.y += (m.ty - m.y) * 0.12
    m.presence += (m.target - m.presence) * 0.08
    // Reduced motion: shader time is frozen at a fixed, pleasant frame.
    const seconds = this.reduced ? 4 : (performance.now() - this.t0) / 1000
    const w = this.canvas.width
    const h = this.canvas.height
    const { intensity, brightness = 0 } = this.active.opts
    gl.viewport(0, 0, w, h)
    gl.uniform4f(this.loc.u_scene, w, h, seconds * SPEED, 4.0)
    gl.uniform4f(this.loc.u_shape, 1.26, intensity, 0.28, 0.0)
    gl.uniform4f(this.loc.u_surface, 1.82, 1.0, brightness, 1.0)
    gl.uniform4f(this.loc.u_finish, 0.0, 0.0, 0.0, 0.04)
    gl.uniform4f(this.loc.u_transform, 1.0, 0.0, 0.0, 1.0)
    gl.uniform4f(this.loc.u_space, 0.0, 0.0, m.x, m.y)
    gl.uniform4f(this.loc.u_cursor, m.presence, 2.0, 0.27, 0.73)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
}

export const shaderManager = new ShaderManager()
