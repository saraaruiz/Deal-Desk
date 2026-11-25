import { useEffect, useRef, useState } from 'react'
import { moments } from '@/content/copy'
import { PhoneFrame } from '@/components/PhoneFrame'
import { gsap, ScrollTrigger, isDesktopMotion, useLiteMode } from '@/lib/motion'

// Each moment has its real screen recording (public/assets/video/moment-<step>.mp4). The exported WebP stays underneath as the
// poster, the reduced-motion version and the fallback if a clip is missing.
type Step = (typeof moments.steps)[number]
const clip = (s: Step) => `/assets/video/moment-${s.step.toLowerCase()}.mp4`
const screen = (s: Step) => `/assets/screens/${s.screen}.webp`
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export function FourMoments() {
  const root = useRef<HTMLElement>(null)
  const lite = useLiteMode()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (lite || !isDesktopMotion()) return
    const el = root.current!
    const ctx = gsap.context(() => {
      const phones = gsap.utils.toArray<HTMLElement>('[data-phone]', el)
      const words = gsap.utils.toArray<HTMLElement>('[data-word]', el)
      const lines = gsap.utils.toArray<HTMLElement>('[data-step-line]', el)
      const bar = el.querySelector<HTMLElement>('[data-progress]')
      gsap.set([...phones, ...words], { xPercent: -50, yPercent: -50 })
      gsap.set(lines, { xPercent: -50 })

      /*
       * MOTION · scroll · PINNED 100vh (+320%), SIDEWAYS. A single value p (0 -> 3) is scrubbed by scroll; every layer is derived from it:
       *   - the four phones sit in a row; the one at p is centred at full size, the others slide away (x = (i - p) × spacing),
       *     MINIMISE (scale 1 -> .58) and dim (opacity 1 -> .4)
       *   - the giant outlined step word (Draft / Review / Ask / Send) travels sideways at ~2x the phone speed (parallax),
       *     fading in and out around the centre
       *   - the step sentence cross-fades under the centre phone
       *   - the centre phone's recording is SCRUBBED: time = (p - (i - .5)) × duration, so each clip lasts exactly while its step is centred
       *   - a hairline fills with p under the step labels
       *   scrub 0.6 (smoothing), ease none · mobile / reduced motion: no pin, swipe row of 4 phones instead.
       */
      const apply = (p: number) => {
        const spacing = Math.min(400, window.innerWidth * 0.3)
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
          gsap.set(l, { opacity: Math.max(0, 1 - Math.abs(d) * 2.4), y: d * 22 })
        })
        el.querySelectorAll<HTMLVideoElement>('video[data-scrub]').forEach((v, i) => {
          if (!v.duration || !Number.isFinite(v.duration)) return
          const t = Math.min(v.duration - 0.05, clamp01(p - (i - 0.5)) * v.duration)
          if (Math.abs(v.currentTime - t) > 0.04) v.currentTime = t
        })
        if (bar) bar.style.transform = `scaleX(${p / 3})`
        const s = Math.round(p)
        setStep((prev) => (prev === s ? prev : s))
      }
      const state = { p: 0 }
      apply(0)
      gsap.to(state, {
        p: 3,
        ease: 'none',
        onUpdate: () => apply(state.p),
        scrollTrigger: { trigger: el, start: 'top top', end: '+=320%', pin: true, scrub: 0.6, anticipatePin: 1 },
      })
      const onResize = () => apply(state.p)
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }, el)
    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [lite])

  return (
    <section ref={root} id="moments" aria-labelledby="moments-title" className="relative overflow-hidden bg-bg py-20 lg:py-0">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow-1/25 blur-[140px] max-md:hidden" />
      {lite ? (
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-12">
          <h2 id="moments-title" className="text-[clamp(36px,4.6vw,64px)] font-extrabold leading-[1.04] tracking-[-0.02em]">
            {moments.title.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h2>
          {/* Mobile: horizontal swipe row of 4 phones (scroll-snap); each clip plays while it is on screen */}
          <ol className="swipe -mx-6 mt-10 px-6 pb-4 md:mx-0 md:px-0" aria-label="The four moments">
            {moments.steps.map((s, i) => (
              <li key={s.step} className="w-[min(70vw,260px)] text-center">
                <PhoneFrame src={screen(s)} alt={s.alt} video={clip(s)} />
                <p className="mt-5 text-[15px] font-semibold tracking-[0.06em] text-lavender-soft">
                  {i + 1} · {s.step}
                </p>
                <p className="mt-1 text-[17px] leading-[1.5] text-muted">{s.line}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="relative flex h-screen flex-col px-[clamp(32px,7vw,120px)] pb-8 pt-24">
          <h2 id="moments-title" className="text-[clamp(26px,2.8vw,40px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-text">
            {moments.title.join(' ')}
          </h2>

          {/* stage: giant step word behind, four phones in a row, the centred one in focus */}
          <div className="relative min-h-0 flex-1">
            {moments.steps.map((s) => (
              <span
                key={s.step}
                data-word
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 select-none whitespace-nowrap text-[clamp(140px,24vw,360px)] font-extrabold leading-none tracking-[-0.04em] text-transparent will-change-transform"
                style={{ WebkitTextStroke: '2px rgba(183,172,255,0.22)' }}
              >
                {s.step}
              </span>
            ))}
            {moments.steps.map((s) => (
              <div key={s.step} data-phone className="absolute left-1/2 top-1/2 w-[clamp(180px,min(26vw,36vh),290px)] will-change-transform">
                <PhoneFrame src={screen(s)} alt={s.alt} video={clip(s)} scrub />
              </div>
            ))}
          </div>

          {/* the sentence for the centred step */}
          <div className="relative h-[64px]" aria-live="polite">
            {moments.steps.map((s) => (
              <p
                key={s.step}
                data-step-line
                className="absolute left-1/2 top-0 whitespace-nowrap text-[clamp(20px,2.2vw,30px)] font-semibold tracking-[-0.01em] text-text will-change-transform"
              >
                {s.line}
              </p>
            ))}
          </div>

          {/* step labels + progress hairline */}
          <div className="relative mx-auto mt-2 w-full max-w-[560px]">
            <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/12">
              <span data-progress className="block h-full origin-left bg-lavender-soft" style={{ transform: 'scaleX(0)' }} />
            </span>
            <ol className="flex justify-between pt-3">
              {moments.steps.map((s, i) => (
                <li
                  key={s.step}
                  aria-current={step === i ? 'step' : undefined}
                  className="text-[14px] font-semibold tracking-[0.08em] transition-colors duration-500"
                  style={{ color: step === i ? '#F2F4F8' : 'rgba(183,172,255,.55)' }}
                >
                  {String(i + 1).padStart(2, '0')} · {s.step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </section>
  )
}
