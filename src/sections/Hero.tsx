import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { hero, nav } from '@/content/copy'
import { Logo, MagneticLink, MaskLines, btnGhost, btnPrimary } from '@/components/bits'
import { PhoneFrame } from '@/components/PhoneFrame'
import { ShaderBackground } from '@/components/ShaderBackground'
import { gsap, ScrollTrigger, isDesktopMotion, prefersReducedMotion } from '@/lib/motion'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const phone = useRef<HTMLDivElement>(null)
  const [menu, setMenu] = useState(false) // mobile menu (Figma M0 has a Menu button)

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menu])

  useEffect(() => {
    const el = root.current!
    if (prefersReducedMotion()) return // static: everything is already in its final state
    const ctx = gsap.context(() => {
      /*
       * MOTION · page load · the H1 lines rise out of a mask (yPercent 105 -> 0, 0.9s, stagger 0.12) and the iPhone rises
       *   (y 140 -> 0, scale .96 -> 1, 1.2s) · expo.out ≈ cubic-bezier(.22,1,.36,1) · no opacity fades (text and phone paint on the first frame) ·
       *   the sub-line, buttons and micro-line rise with a CSS animation (.rise-in, 0.7s, staggered) · reduced-motion: final state.
       */
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-line]', { yPercent: 105, duration: 0.9, stagger: 0.12 }, 0.05).from('[data-phone-in]', { y: 140, scale: 0.96, duration: 1.2 }, 0.5)

      if (isDesktopMotion()) {
        /*
         * MOTION · pointer move over the hero (desktop) · the (static) phone turns a little toward the cursor
         *   (rotationY ±4.5°, rotationX ±3°) · 0.9s power3.out via quickTo · reduced-motion / touch: none.
         */
        const tiltEl = el.querySelector<HTMLElement>('[data-phone-tilt]')!
        gsap.set(tiltEl, { transformPerspective: 1200 })
        const ry = gsap.quickTo(tiltEl, 'rotationY', { duration: 0.9, ease: 'power3.out' })
        const rx = gsap.quickTo(tiltEl, 'rotationX', { duration: 0.9, ease: 'power3.out' })
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          const nx = (e.clientX - r.left) / r.width - 0.5
          const ny = (e.clientY - r.top) / Math.min(r.height, 900) - 0.5
          ry(nx * 9)
          rx(-ny * 6)
        }
        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerleave', () => {
          ry(0)
          rx(0)
        })
        /*
         * MOTION · scroll (hero leaving) · LAYERED PARALLAX: phone rises faster (y 0 -> -170px, scale 1 -> 1.05, rotateX 0 -> 7deg),
         *   the container panel behind it slower (y 0 -> -50px) · scrubbed (ease none, scrub 0.8) · desktop only · reduced-motion: none.
         * MOTION · scroll · the giant "DealDesk" wordmark glides sideways (x 8vw -> -22vw) instead of falling ·
         *   scrubbed (ease none) · desktop only · reduced-motion: none.
         */
        const scrub = { trigger: el, start: 'top top', end: 'bottom top' }
        gsap.to(phone.current, { y: -170, scale: 1.05, rotateX: 7, ease: 'none', scrollTrigger: { ...scrub, scrub: 0.8 } })
        gsap.to('[data-panel]', { y: -50, ease: 'none', scrollTrigger: { ...scrub, scrub: 0.8 } })
        gsap.fromTo('[data-ghost]', { x: '8vw' }, { x: '-22vw', ease: 'none', scrollTrigger: { ...scrub, scrub: true } })
      } else {
        /*
         * MOTION · scroll (phones / tablets) · the same layered parallax, tuned for a tall screen: the phone starts leaning back and
         *   stands up while it rises (rotateX 16 -> -4deg, scale .92 -> 1.06, y 0 -> -80px), the panel behind moves slower (y 0 -> -28px),
         *   the giant wordmark crosses the screen sideways (x 28vw -> -85vw) and the headline block drifts up and dims ·
         *   scrubbed (ease none, scrub 0.5), native touch scrolling · reduced-motion: none.
         */
        const st = () => ({ trigger: el, start: 'top top', end: 'bottom 25%', scrub: 0.5 }) // a fresh object per tween
        gsap.fromTo(phone.current, { y: 0, scale: 0.92, rotateX: 16, transformPerspective: 1100 }, { y: -80, scale: 1.06, rotateX: -4, ease: 'none', scrollTrigger: st() })
        gsap.to('[data-panel]', { y: -28, ease: 'none', scrollTrigger: st() })
        gsap.fromTo('[data-ghost-m]', { x: '28vw' }, { x: '-85vw', ease: 'none', scrollTrigger: st() })
        gsap.to('[data-copy]', { y: -30, opacity: 0.35, ease: 'none', scrollTrigger: { trigger: el, start: 'top+=240 top', end: '+=420', scrub: 0.5 } })
      }
    }, el)
    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <section ref={root} id="top" className="relative isolate overflow-hidden bg-bg pb-0 lg:h-[1180px]" aria-labelledby="hero-title">
      <ShaderBackground intensity={0.35} />
      {/* readability veil: shader stays visible but text keeps AA contrast */}
      <div aria-hidden className="absolute inset-0 -z-0 bg-gradient-to-b from-bg/30 via-bg/35 to-bg" />
      {/* ghost wordmark */}
      <p
        data-ghost
        aria-hidden
        className="pointer-events-none absolute left-[-4vw] top-[360px] hidden select-none whitespace-nowrap text-[clamp(160px,27.7vw,400px)] font-extrabold leading-none tracking-[-0.04em] text-white/[0.045] lg:block"
      >
        DealDesk
      </p>

      {/* Navbar */}
      <header className="relative z-20 mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-6 lg:px-[120px]">
        <Logo />
        <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 gap-[26px] md:flex">
          {nav.links.map((l) => (
            <a key={l.label} href={l.href} className="flex min-h-[44px] items-center text-[15px] font-medium text-text/80 transition-colors hover:text-text">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#prototype"
          className="hidden min-h-[44px] items-center whitespace-nowrap rounded-full bg-lavender px-[22px] py-3 text-[15px] font-semibold text-indigo transition-colors hover:bg-lavender-soft sm:inline-flex"
        >
          {nav.cta}
        </a>
        <button
          type="button"
          aria-expanded={menu}
          aria-controls="mobile-menu"
          aria-label={menu ? 'Close menu' : 'Open menu'}
          onClick={() => setMenu((m) => !m)}
          className={`relative z-40 inline-flex size-11 items-center justify-center rounded-full border backdrop-blur sm:hidden ${menu ? 'border-black/15 bg-white/70 text-[#0b0d1a]' : 'border-white/20 bg-white/[0.07] text-text'}`}
        >
          {menu ? <X size={20} /> : <Menu size={20} />}
        </button>
        {menu && (
          <nav
            id="mobile-menu"
            aria-label="Mobile"
            className="fixed inset-0 z-30 flex flex-col justify-center gap-1 px-8 pb-10 pt-24 backdrop-blur-[40px] backdrop-saturate-150 sm:hidden"
            style={{ background: 'radial-gradient(90% 60% at 0% 0%, rgba(105,140,255,0.55), transparent 70%), radial-gradient(90% 60% at 100% 100%, rgba(150,100,255,0.5), transparent 70%), rgba(238,240,252,0.94)' }}
          >
            {[...nav.links, { label: nav.cta, href: '#prototype' }].map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenu(false)} className="flex min-h-[56px] items-center rounded-2xl px-4 text-[26px] font-semibold tracking-[-0.01em] text-[#0b0d1a] transition-colors hover:bg-white/60 active:bg-white/70">
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <div data-copy className="relative z-10 mx-auto max-w-[1440px] px-6 text-center">
        <h1
          id="hero-title"
          className="mx-auto mt-[44px] max-w-[1100px] text-[clamp(44px,6.67vw,96px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-text lg:mt-[62px]"
        >
          <MaskLines lines={hero.h1} />
        </h1>
        <p className="rise-in mx-auto mt-6 max-w-[780px] text-[clamp(17px,1.5vw,22px)] text-muted lg:mt-[34px]" style={{ ['--d' as string]: '0.25s' }}>
          {hero.sub}
        </p>
        {/* Both buttons: same height, same width, same line (no per-button animation that could leave one offset) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:mt-[33px]">
          <MagneticLink href="#prototype" className={btnPrimary}>
            {hero.primary}
          </MagneticLink>
          <a href="#moments" className={btnGhost}>
            {hero.ghost}
          </a>
        </div>
        <p className="rise-in mt-5 text-[14px] text-muted/80" style={{ ['--d' as string]: '0.45s' }}>
          {hero.micro}
        </p>
      </div>

      {/* Phone breaks out of the container (a still image of the prototype's "Ready" screen) */}
      <div className="relative z-10 mx-auto mt-6 max-w-[1440px] lg:mt-12 px-6 pb-16 lg:pb-0">
        <div
          aria-hidden
          data-panel
          className="absolute inset-x-4 top-[24%] h-[68%] rounded-[36px] border border-white/[0.14] bg-gradient-to-b from-[rgba(29,36,104,0.85)] to-bg lg:inset-x-[100px] lg:top-[22%] lg:h-[640px] lg:rounded-[56px]"
        />
        {/* phones: the giant wordmark sits behind the device */}
        <p
          data-ghost-m
          aria-hidden
          className="pointer-events-none absolute left-0 top-[34%] select-none whitespace-nowrap text-[42vw] font-extrabold leading-none tracking-[-0.04em] text-white/[0.09] lg:hidden"
        >
          DealDesk
        </p>
        <div style={{ perspective: 1400 }} className="relative mx-auto w-[min(426px,72vw)]">
          <div ref={phone} data-phone className="relative will-change-transform [transform-style:preserve-3d]">
            <div data-phone-in>
              <div data-phone-tilt className="[transform-style:preserve-3d]">
                <PhoneFrame
                  eager
                  src="/assets/screens/G11.webp"
                  alt="Project Harbor chat with Pat Morgan. The message says: Hi @Pat Morgan quick question on Harbor. Can you confirm the fee question? Status: Ready · Nothing leaves until you tap Send."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
