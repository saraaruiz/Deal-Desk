import { useEffect, useRef, useState } from 'react'
import { moments } from '@/content/copy'
import { PhoneFrame } from '@/components/PhoneFrame'
import { gsap, ScrollTrigger, isDesktopMotion, useLiteMode } from '@/lib/motion'

const shot = (s: (typeof moments.steps)[number]) => ({ src: `/assets/screens/${s.screen}.png`, alt: s.alt })

export function FourMoments() {
  const root = useRef<HTMLElement>(null)
  const lite = useLiteMode()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (lite || !isDesktopMotion()) return
    const el = root.current!
    const ctx = gsap.context(() => {
      const imgs = gsap.utils.toArray<HTMLElement>('[data-screen]', el)
      const lines = gsap.utils.toArray<HTMLElement>('[data-step-line]', el)
      gsap.set(imgs.slice(1), { opacity: 0, y: 28 })
      gsap.set(lines.slice(1), { opacity: 0, y: 16 })
      /*
       * MOTION · scroll · PINNED 100vh (+300%). ONE phone; the screen swaps Draft (H5) -> Review (G9) -> Ask (A1) -> Send (G17):
       *   outgoing screen opacity 1 -> 0 + y -28, incoming 0 -> 1 + y 28 -> 0 (cross-fade/slide, 0.3 of a step, ease none because scrubbed) ·
       *   step line copy cross-fades the same way · the dotted connector draws with stroke-dashoffset 1 -> 0 across the whole pin ·
       *   labels light up per step · reduced-motion / mobile: no pin, no scrub (swipe row of 4 phones).
       */
      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      tl.fromTo('[data-path]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 4 }, 0)
      for (let i = 1; i < 4; i++) {
        const t = i - 0.15
        tl.to(imgs[i - 1], { opacity: 0, y: -28, duration: 0.3 }, t)
          .to(imgs[i], { opacity: 1, y: 0, duration: 0.3 }, t)
          .to(lines[i - 1], { opacity: 0, y: -16, duration: 0.3 }, t)
          .to(lines[i], { opacity: 1, y: 0, duration: 0.3 }, t)
      }
      tl.to({}, { duration: 0.01 }, 4)
      ScrollTrigger.create({
        animation: tl,
        trigger: el,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (s) => setStep(Math.min(3, Math.floor(s.progress * 4))),
      })
    }, el)
    return () => ctx.revert()
  }, [lite])

  const title = (
    <h2 id="moments-title" className="text-[clamp(40px,5vw,72px)] font-extrabold leading-[1.04] tracking-[-0.02em]">
      {moments.title.map((l) => (
        <span key={l} className="block">
          {l}
        </span>
      ))}
    </h2>
  )

  return (
    <section ref={root} id="moments" aria-labelledby="moments-title" className="relative overflow-hidden bg-bg py-20 lg:py-0">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow-1/30 blur-[140px]" />
      {lite ? (
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-12">
          {title}
          {/* Mobile: horizontal swipe row of 4 phones (scroll-snap) */}
          <ol className="swipe -mx-6 mt-10 px-6 pb-4 md:mx-0 md:px-0" aria-label="The four moments">
            {moments.steps.map((s, i) => (
              <li key={s.step} className="w-[min(70vw,260px)] text-center">
                <PhoneFrame src={`/assets/screens/${s.screen}.png`} alt={s.alt} />
                <p className="mt-5 text-[15px] font-semibold tracking-[0.06em] text-lavender-soft">
                  {i + 1} · {s.step}
                </p>
                <p className="mt-1 text-[17px] leading-[1.5] text-muted">{s.line}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="relative mx-auto grid h-screen max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-10 px-[120px]">
          <div className="self-center">
            {title}
            {/* stepper with the dotted connector */}
            <div className="relative mt-10 h-[200px]">
              <svg className="absolute left-[7px] top-[8px] h-[184px] w-[2px] overflow-visible" aria-hidden viewBox="0 0 2 184" preserveAspectRatio="none">
                <line x1="1" y1="0" x2="1" y2="184" stroke="rgba(183,172,255,.25)" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
                <line data-path x1="1" y1="0" x2="1" y2="184" pathLength={1} stroke="#B7ACFF" strokeWidth="2" strokeDasharray="1" strokeDashoffset="1" strokeLinecap="round" />
              </svg>
              <ol className="relative grid h-full grid-rows-4 items-center">
                {moments.steps.map((s, i) => (
                  <li key={s.step} className="flex items-center gap-5">
                    <span
                      aria-hidden
                      className="size-4 rounded-full border-2 border-lavender-soft transition-colors duration-500"
                      style={{ background: step >= i ? '#B7ACFF' : '#0F1115' }}
                    />
                    <span
                      className="text-[15px] font-semibold tracking-[0.06em] transition-colors duration-500"
                      style={{ color: step === i ? '#F2F4F8' : '#B7ACFF', opacity: step === i ? 1 : 0.75 }}
                      aria-current={step === i ? 'step' : undefined}
                    >
                      {s.step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="w-[300px]">
            <PhoneFrame stack={moments.steps.map(shot)} />
          </div>

          <div className="relative h-[120px] self-center" aria-live="polite">
            {moments.steps.map((s) => (
              <p key={s.step} data-step-line className="absolute inset-0 flex items-center text-[28px] font-semibold leading-[1.25] tracking-[-0.01em] text-text">
                {s.line}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
