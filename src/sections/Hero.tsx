import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { hero, nav } from '@/content/copy'
import { Chip, Logo, MagneticLink, MaskLines, btnGhost, btnPrimary } from '@/components/bits'
import { PhoneFrame } from '@/components/PhoneFrame'
import { ShaderBackground } from '@/components/ShaderBackground'
import { gsap, ScrollTrigger, isDesktopMotion, prefersReducedMotion } from '@/lib/motion'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const phone = useRef<HTMLDivElement>(null)
  const [menu, setMenu] = useState(false) // mobile menu (Figma M0 has a Menu button)

  useEffect(() => {
    const el = root.current!
    if (prefersReducedMotion()) return // static: everything is already in its final state
    const ctx = gsap.context(() => {
      /*
       * MOTION · page load · LOAD SEQUENCE (~2.2s): shader canvas fades in (1.2s, CSS), H1 lines rise from a mask
       *   (y 105% -> 0, 0.9s, stagger 0.12), sub + micro-line fade/rise (0.7s), buttons (0.7s), then the iPhone
       *   rises (y 140 -> 0, scale .96 -> 1, 1.2s) · all expo.out ≈ cubic-bezier(.22,1,.36,1) ·
       *   reduced-motion: skipped, content is shown in its final state.
       */
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-line]', { yPercent: 105, duration: 0.9, stagger: 0.12 }, 0.05)
        .from('[data-sub]', { y: 18, opacity: 0, duration: 0.6 }, 0.3)
        .from('[data-cta]', { y: 18, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.4)
        .from('[data-micro]', { opacity: 0, duration: 0.6 }, 0.6)
        .from('[data-phone-in]', { y: 140, scale: 0.96, opacity: 0, duration: 1.2 }, 0.5)
        .from('[data-chip]', { opacity: 0, x: (i) => (i ? 24 : -24), duration: 0.8, stagger: 0.12 }, 1.5)

      if (isDesktopMotion()) {
        /*
         * MOTION · pointer move over the hero (desktop) · the phone turns toward the cursor (rotationY ±8°, rotationX ±5°) and the
         *   two chips drift the opposite way (x/y up to ±22px) for depth · 0.9s power3.out via quickTo · reduced-motion / touch: none.
         */
        const tiltEl = el.querySelector<HTMLElement>('[data-phone-tilt]')!
        gsap.set(tiltEl, { transformPerspective: 1200 })
        const ry = gsap.quickTo(tiltEl, 'rotationY', { duration: 0.9, ease: 'power3.out' })
        const rx = gsap.quickTo(tiltEl, 'rotationX', { duration: 0.9, ease: 'power3.out' })
        const pars = gsap.utils.toArray<HTMLElement>('[data-par]', el).map((p) => ({
          dir: Number(p.dataset.par),
          x: gsap.quickTo(p, 'x', { duration: 0.9, ease: 'power3.out' }),
          y: gsap.quickTo(p, 'y', { duration: 0.9, ease: 'power3.out' }),
        }))
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          const nx = (e.clientX - r.left) / r.width - 0.5
          const ny = (e.clientY - r.top) / Math.min(r.height, 900) - 0.5
          ry(nx * 9)
          rx(-ny * 6)
          pars.forEach((p) => {
            p.x(nx * 26 * p.dir)
            p.y(-ny * 16)
          })
        }
        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerleave', () => {
          ry(0)
          rx(0)
          pars.forEach((p) => {
            p.x(0)
            p.y(0)
          })
        })
        /*
         * MOTION · scroll (hero leaving) · phone: slow Z parallax (translateY 0 -> -90px) + subtle tilt
         *   (rotateX 0 -> 6deg max) · scrubbed (ease none, scrub 0.6) · desktop only · reduced-motion: none.
         */
        /*
         * MOTION · scroll (hero leaving) · LAYERED PARALLAX: phone rises faster (y 0 -> -170px, scale 1 -> 1.05, rotateX 0 -> 7deg),
         *   the container panel behind it slower (y 0 -> -50px), the two chips at their own speeds (y -> -110 / -60) ·
         *   scrubbed (ease none, scrub 0.8) · desktop only · reduced-motion: none.
         * MOTION · scroll · the giant "DealDesk" wordmark glides sideways (x 8vw -> -22vw) instead of falling ·
         *   scrubbed (ease none) · desktop only · reduced-motion: none.
         */
        const scrub = { trigger: el, start: 'top top', end: 'bottom top' }
        gsap.to(phone.current, { y: -170, scale: 1.05, rotateX: 7, ease: 'none', scrollTrigger: { ...scrub, scrub: 0.8 } })
        gsap.to('[data-panel]', { y: -50, ease: 'none', scrollTrigger: { ...scrub, scrub: 0.8 } })
        gsap.to('[data-chip]', { y: (i) => (i ? -60 : -110), ease: 'none', scrollTrigger: { ...scrub, scrub: 0.8 } })
        gsap.fromTo('[data-ghost]', { x: '8vw' }, { x: '-22vw', ease: 'none', scrollTrigger: { ...scrub, scrub: true } })
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
          className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.07] text-text backdrop-blur sm:hidden"
        >
          {menu ? <X size={20} /> : <Menu size={20} />}
        </button>
        {menu && (
          <nav id="mobile-menu" aria-label="Mobile" className="absolute inset-x-6 top-[80px] z-30 rounded-3xl border border-white/15 bg-card/95 p-3 backdrop-blur sm:hidden">
            {[...nav.links, { label: nav.cta, href: '#prototype' }].map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenu(false)} className="flex min-h-[48px] items-center rounded-2xl px-4 text-[16px] font-medium text-text hover:bg-white/10">
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center">
        <h1
          id="hero-title"
          className="mx-auto mt-[44px] max-w-[1100px] text-[clamp(44px,6.67vw,96px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-text lg:mt-[62px]"
        >
          <MaskLines lines={hero.h1} />
        </h1>
        <p data-sub className="mx-auto mt-6 max-w-[780px] text-[clamp(17px,1.5vw,22px)] text-muted lg:mt-[34px]">
          {hero.sub}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:mt-[33px]">
          <MagneticLink data-cta href="#prototype" className={btnPrimary}>
            {hero.primary}
          </MagneticLink>
          <a data-cta href="#moments" className={btnGhost}>
            {hero.ghost}
          </a>
        </div>
        <p data-micro className="mt-5 text-[14px] text-muted/80">
          {hero.micro}
        </p>
      </div>

      {/* Phone breaks out of the container */}
      <div className="relative z-10 mx-auto mt-12 max-w-[1440px] px-6 pb-16 lg:pb-0">
        <div
          aria-hidden
          data-panel className="absolute inset-x-6 top-[22%] hidden h-[640px] rounded-[56px] border border-white/[0.14] bg-gradient-to-b from-[rgba(29,36,104,0.85)] to-bg lg:inset-x-[100px] lg:block"
        />
        <div style={{ perspective: 1400 }} className="relative mx-auto w-[min(426px,72vw)]">
          <div ref={phone} data-phone className="will-change-transform [transform-style:preserve-3d]">
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
          {/* chips + connectors (decorative, desktop) */}
          <div data-chip className="absolute -left-[182px] top-[53%] hidden lg:block" aria-hidden>
            <div data-par="-1" className="flex items-center">
              <div className="float-y flex items-center">
                <Chip>✓ CHECKED</Chip>
                <span className="h-[1.5px] w-[110px] bg-gradient-to-r from-softblue/70 to-transparent" />
              </div>
            </div>
          </div>
          <div data-chip className="absolute -right-[122px] top-[64%] hidden lg:block" aria-hidden>
            <div data-par="1" className="flex items-center">
              <div className="float-y flex items-center [animation-delay:-3s]">
                <span className="h-[1.5px] w-[150px] -translate-x-[78px] bg-gradient-to-l from-softblue/70 to-transparent" />
                <Chip className="-translate-x-[78px]">✓ READY</Chip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
