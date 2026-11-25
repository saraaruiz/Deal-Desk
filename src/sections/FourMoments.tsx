import { useEffect, useRef, useState } from 'react'
import { fits, moments } from '@/content/copy'
import { RoleVisual } from '@/components/RoleVisual'
import { PhoneFrame } from '@/components/PhoneFrame'
import { gsap, ScrollTrigger, useStaticMotion } from '@/lib/motion'

// Each moment has its real screen recording (public/assets/video/moment-<step>.mp4). The exported WebP stays underneath as the
// poster, the reduced-motion version and the fallback if a clip is missing.
type Step = (typeof moments.steps)[number]
const clip = (s: Step) => `/assets/video/moment-${s.step.toLowerCase()}.mp4`
const screen = (s: Step) => `/assets/screens/${s.screen}.webp`
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export function FourMoments() {
  const root = useRef<HTMLElement>(null)
  // The sideways scroll effect runs on desktop, tablet AND phones (it is scroll-driven, so it works on touch).
  // Only reduced motion / data saver / very low-power devices get the plain swipe row.
  const staticMode = useStaticMotion()
  const [step, setStep] = useState(0)
  const [hint, setHint] = useState(true) // scroll hint: leaves after the first step change or 4s of scrolling, never returns
  const jump = useRef<(i: number) => void>(() => {})

  useEffect(() => {
    if (staticMode) return
    const el = root.current!
    const ctx = gsap.context(() => {
      const phones = gsap.utils.toArray<HTMLElement>('[data-phone]', el)
      const tilts = gsap.utils.toArray<HTMLElement>('[data-tilt]', el)
      const sheens = gsap.utils.toArray<HTMLElement>('[data-sheen]', el)
      const words = gsap.utils.toArray<HTMLElement>('[data-word]', el)
      const lines = gsap.utils.toArray<HTMLElement>('[data-step-line]', el)
      const seg = el.querySelector<HTMLElement>('[data-seg]')
      const stage = el.querySelector<HTMLElement>('[data-stage]')!
      const bar = el.querySelector<HTMLElement>('[data-progress]')
      let hintTimer = 0
      gsap.set([...phones, ...words], { xPercent: -50, yPercent: -50 })
      gsap.set(lines, { xPercent: -50 })
      gsap.set(tilts, { transformPerspective: 1100 })

      /*
       * MOTION · scroll · PINNED 100vh (+320%), SIDEWAYS (desktop, tablet and phone). A single value p (0 -> 3) is scrubbed by scroll:
       *   - the four phones sit in a row; the one at p is centred at full size, the others slide away (x = (i - p) × spacing),
       *     MINIMISE (scale 1 -> .58) and dim (opacity 1 -> .4)
       *   - the giant outlined step word (Draft / Review / Ask / Send) travels sideways at ~2x the phone speed (parallax)
       *   - the role chip + sentence cross-fade under the centre phone
       *   - the centre phone's recording is SCRUBBED: time = (p - (i - .5)) × duration
       *   - the iOS-style segmented control's highlight slides with p (xPercent = p × 100)
       *   scrub 0.6 (smoothing), ease none · reduced motion / data saver / very low power: no pin, swipe row instead.
       */
      const apply = (p: number) => {
        const spacing = Math.min(400, Math.max(window.innerWidth * 0.3, (phones[0]?.offsetWidth ?? 160) * 0.85))
        phones.forEach((ph, i) => {
          const d = i - p
          const a = clamp01(Math.abs(d))
          gsap.set(ph, { x: d * spacing, scale: 1 - 0.42 * a, opacity: 1 - 0.6 * a, zIndex: 10 - Math.round(Math.abs(d)) })
        })
        words.forEach((w, i) => {
          const d = i - p
          gsap.set(w, { x: d * window.innerWidth * 0.6, opacity: Math.max(0, 1 - Math.abs(d) * 1.3) })
        })
        lines.forEach((l, i) => {
          const d = i - p
          gsap.set(l, { opacity: clamp01(1 - (Math.abs(d) - 0.15) * 2.2), y: d * 22 })
        })
        el.querySelectorAll<HTMLVideoElement>('video[data-scrub]').forEach((v, i) => {
          if (!v.duration || !Number.isFinite(v.duration)) return
          const t = Math.min(v.duration - 0.05, clamp01(p - (i - 0.5)) * v.duration)
          if (Math.abs(v.currentTime - t) > 0.04) v.currentTime = t
        })
        if (seg) gsap.set(seg, { xPercent: p * 100 })
        if (bar) gsap.set(bar, { scaleX: p / 3 })
        if (Math.round(p) > 0) setHint(false)
        const s = Math.round(p)
        setStep((prev) => (prev === s ? prev : s))
        activeIndex = s
      }
      let activeIndex = 0
      const state = { p: 0 }
      apply(0)
      const tween = gsap.to(state, {
        p: 3,
        ease: 'none',
        onUpdate: () => apply(state.p),
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=320%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: () => {
            if (!hintTimer) hintTimer = window.setTimeout(() => setHint(false), 4000)
          },
        },
      })
      // click a step label: scroll to that step's position inside the pin
      jump.current = (i) => {
        const st = tween.scrollTrigger!
        const top = st.start + ((st.end - st.start) * i) / 3 + (i === 0 ? 2 : 0)
        const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: { duration?: number }) => void } }).__lenis
        if (lenis) lenis.scrollTo(top, { duration: 0.9 })
        else window.scrollTo({ top, behavior: 'smooth' })
      }

      /*
       * MOTION · pointer over the stage (mouse only) · CINEMATIC HOVER on the centred phone: it turns toward the cursor
       *   (rotationY ±9°, rotationX ±6°) and a soft light highlight follows the cursor across its glass (soft-light blend);
       *   0.8s power3.out via quickTo, light fades 0.5s · reduced motion / touch: none.
       */
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const cleanups: Array<() => void> = []
      if (fine) {
        const ry = tilts.map((t) => gsap.quickTo(t, 'rotationY', { duration: 0.8, ease: 'power3.out' }))
        const rx = tilts.map((t) => gsap.quickTo(t, 'rotationX', { duration: 0.8, ease: 'power3.out' }))
        const move = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect()
          const nx = (e.clientX - r.left) / r.width - 0.5
          const ny = (e.clientY - r.top) / r.height - 0.5
          const a = activeIndex
          ry[a]?.(nx * 18)
          rx[a]?.(-ny * 12)
          const sh = sheens[a]
          const pr = phones[a]?.getBoundingClientRect()
          if (sh && pr) {
            sh.style.setProperty('--mx', `${((e.clientX - pr.left) / pr.width) * 100}%`)
            sh.style.setProperty('--my', `${((e.clientY - pr.top) / pr.height) * 100}%`)
            sh.style.opacity = '1'
          }
        }
        const leave = () => {
          ry.forEach((f) => f(0))
          rx.forEach((f) => f(0))
          sheens.forEach((s) => (s.style.opacity = '0'))
        }
        stage.addEventListener('pointermove', move)
        stage.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          stage.removeEventListener('pointermove', move)
          stage.removeEventListener('pointerleave', leave)
        })
      }

      const onResize = () => apply(state.p)
      window.addEventListener('resize', onResize)
      return () => {
        window.removeEventListener('resize', onResize)
        window.clearTimeout(hintTimer)
        cleanups.forEach((c) => c())
      }
    }, el)
    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [staticMode])

  return (
    <section ref={root} id="moments" aria-labelledby="moments-title" className={`relative overflow-hidden bg-bg ${staticMode ? 'py-20' : ''}`}>
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow-1/25 blur-[140px] max-md:hidden" />
      {staticMode ? (
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-12">
          <h2 id="moments-title" className="text-[clamp(36px,4.6vw,64px)] font-extrabold leading-[1.04] tracking-[-0.02em]">
            {moments.title.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h2>
          {/* Reduced motion / data saver: horizontal swipe row of 4 phones (scroll-snap), no pin, no scrub */}
          <p className="hint-pill mt-6">
            Swipe to see each step <span aria-hidden>→</span>
          </p>
          <ol className="swipe -mx-6 mt-10 px-6 pb-4 md:mx-0 md:px-0" aria-label="The four moments">
            {moments.steps.map((s, i) => (
              <li key={s.step} className="w-[min(70vw,260px)] text-center">
                <PhoneFrame src={screen(s)} alt={s.alt} video={clip(s)} />
                <div className="mt-5 flex items-center justify-center gap-2.5">
                  <RoleVisual name={fits.roles[i].name} size={32} />
                  <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-lavender-soft">{fits.roles[i].name}</span>
                </div>
                <p className="mt-3 text-[15px] font-semibold tracking-[0.06em] text-lavender-soft">
                  {i + 1} · {s.step}
                </p>
                <p className="mt-1 text-[17px] leading-[1.5] text-muted">{s.line}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="relative flex h-[100svh] flex-col px-[clamp(20px,7vw,120px)] pb-6 pt-14 sm:pb-8">
          <div className="relative z-10">
            <p className="text-[12px] font-semibold tracking-[0.18em] text-lavender-soft">HOW IT WORKS</p>
            <h2 id="moments-title" className="mt-2 text-[clamp(36px,4.8vw,76px)] font-extrabold leading-[1] tracking-[-0.03em] text-text">
              {moments.title[0]} {moments.title[1].split(' ')[0]}{' '}
              <span className="bg-gradient-to-r from-[#F2F4F8] via-[#B7ACFF] to-[#7FB4FF] bg-clip-text text-transparent">{moments.title[1].split(' ')[1]}</span>
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <p className="text-[13px] font-semibold tabular-nums tracking-[0.04em] text-text/80">
                {step + 1} / 4 · {moments.steps[step]?.step}
              </p>
              <span aria-hidden className="h-[2px] w-[120px] overflow-hidden rounded bg-white/15">
                <span data-progress className="block h-full origin-left bg-lavender-soft" style={{ transform: 'scaleX(0)' }} />
              </span>
            </div>
          </div>

          {/* stage: giant step word behind, four phones in a row, the centred one in focus */}
          <div data-stage className="relative min-h-0 flex-1">
            {moments.steps.map((s) => (
              <span
                key={s.step}
                data-word
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 select-none whitespace-nowrap text-[clamp(120px,24vw,360px)] font-extrabold leading-none tracking-[-0.04em] will-change-transform"
                style={{ backgroundImage: 'linear-gradient(180deg, rgba(183,172,255,0.42) 0%, rgba(111,125,245,0.16) 55%, rgba(111,125,245,0) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'blur(3px)' }}
              >
                {s.step}
              </span>
            ))}
            {moments.steps.map((s) => (
              <div key={s.step} data-phone className="absolute left-1/2 top-1/2 w-[clamp(160px,min(46vw,31vh),350px)] will-change-transform">
                <div data-tilt className="relative" style={{ filter: 'drop-shadow(0 36px 50px rgba(8,12,60,.65))' }}>
                  <PhoneFrame src={screen(s)} alt={s.alt} video={clip(s)} scrub />
                  {/* light that follows the cursor across the glass (mouse only) */}
                  <span
                    data-sheen
                    aria-hidden
                    className="pointer-events-none absolute inset-[1.5%] rounded-[15%/7.5%] opacity-0 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(220px circle at var(--mx,50%) var(--my,0%), rgba(255,255,255,.28), transparent 62%)', mixBlendMode: 'soft-light' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div aria-hidden={!hint} className={`pointer-events-none relative z-20 flex h-0 justify-center sm:justify-start transition-opacity duration-300 ${hint ? 'opacity-100' : 'opacity-0'}`}>
            <p className="hint-pill absolute bottom-1">
              <svg className="hint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 6l5 5 5-5M7 13l5 5 5-5" />
              </svg>
              Scroll to move the screens
            </p>
          </div>

          {/* who acts + the sentence for the centred step. The role chip is a frosted, iOS-style pill: it sits over the giant word,
              so the glass has something to refract. */}
          <div className="relative h-[84px] sm:h-[66px]" aria-live="polite">
            {moments.steps.map((s, i) => (
              <div key={s.step} data-step-line className="absolute left-1/2 top-0 flex w-max max-w-[90vw] flex-col items-center gap-2.5 will-change-transform">
                <span className="flex items-center gap-2.5 rounded-full bg-white/[0.07] py-1.5 pl-1.5 pr-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] ring-1 ring-white/12 backdrop-blur-xl">
                  <RoleVisual name={fits.roles[i].name} size={26} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-lavender-soft">{fits.roles[i].name}</span>
                  {fits.roles[i].note && <span className="hidden text-[12px] text-muted/80 sm:inline">· {fits.roles[i].note}</span>}
                </span>
                <p className="text-center text-[clamp(15px,1.45vw,20px)] font-semibold leading-[1.25] tracking-[-0.005em] text-text/90 sm:whitespace-nowrap">{s.line}</p>
              </div>
            ))}
          </div>

          {/* step selector: an iOS-style segmented control whose highlight slides with the scroll */}
          <div className="relative mx-auto mt-2 w-full max-w-[520px]">
            <div className="relative flex rounded-full bg-white/[0.06] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-white/10 backdrop-blur-xl">
              <span
                data-seg
                aria-hidden
                className="absolute inset-y-1 left-1 w-[calc(25%-2px)] rounded-full bg-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-10px_rgba(0,0,0,0.7)]"
              />
              <ol className="relative z-10 flex w-full">
                {moments.steps.map((s, i) => (
                  <li
                    key={s.step}
                    aria-current={step === i ? 'step' : undefined}
                    className="flex-1"
                  >
                    <button
                      type="button"
                      onClick={() => jump.current(i)}
                      className={`min-h-[44px] w-full rounded-full text-center text-[12px] font-semibold tracking-[0.06em] transition-colors duration-200 hover:bg-white/[0.08] sm:text-[13px] ${step === i ? 'text-text' : 'text-lavender-soft/80 hover:text-text'}`}
                    >
                      <span className="hidden sm:inline">{String(i + 1).padStart(2, '0')} · </span>
                      {s.step}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
