import { useEffect, useRef } from 'react'
import { invite } from '@/content/copy'
import { MagneticLink, btnPrimary } from '@/components/bits'
import { PhoneFrame } from '@/components/PhoneFrame'
import { ShaderBackground } from '@/components/ShaderBackground'
import { gsap, prefersReducedMotion } from '@/lib/motion'

export function Invitation() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll · big title scales in (scale .86 -> 1, opacity .2 -> 1), scrubbed (ease none) from section entry to
       *   its middle · reduced-motion: none.
       * MOTION · scroll into view · line, CTA and phone rise (y 40 -> 0, fade) · 0.9s expo.out, stagger 0.12 · plays once.
       */
      gsap.fromTo('[data-big]', { scale: 0.86, opacity: 0.2 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 35%', scrub: true } })
      gsap.from('[data-in]', { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: root.current, start: 'top 55%', once: true } })
    }, root.current!)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="invite" aria-labelledby="invite-title" className="relative isolate -mt-[1px] overflow-hidden bg-bg pt-24 text-center lg:pt-[150px]">
      {/* same shader as the hero, a touch brighter: intensity 45 */}
      <ShaderBackground intensity={0.45} brightness={0.04} />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/30 to-bg/80" />
      <div className="relative mx-auto max-w-[1440px] px-6">
        <h2 id="invite-title" data-big className="text-[clamp(52px,7.2vw,104px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-text will-change-transform">
          {invite.title.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </h2>
        <p data-in className="mx-auto mt-8 max-w-[700px] text-[clamp(18px,1.6vw,22px)] text-muted">
          {invite.line}
        </p>
        <div data-in className="mt-9">
          {/* href="#prototype" is a placeholder: replace it with the real prototype link */}
          <MagneticLink href="#prototype" className={btnPrimary + ' min-h-[56px] px-10 text-[18px]'}>
            {invite.cta}
          </MagneticLink>
        </div>
        <p data-in className="mt-5 text-[14px] text-muted/80">
          {invite.micro}
        </p>
        <div data-in className="mx-auto mt-14 w-[min(405px,72vw)] lg:mt-[70px]">
          <PhoneFrame
            src="/assets/screens/G11.png"
            alt="Project Harbor chat with Pat Morgan: the message is Ready and Nothing leaves until you tap Send."
          />
        </div>
      </div>
    </section>
  )
}
