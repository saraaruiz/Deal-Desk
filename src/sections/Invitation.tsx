import { useEffect, useRef } from 'react'
import { invite } from '@/content/copy'
import { MagneticLink, btnPrimary } from '@/components/bits'
import { FilmPlayer } from '@/components/FilmPlayer'
import { ShaderBackground } from '@/components/ShaderBackground'
import { gsap, prefersReducedMotion } from '@/lib/motion'

/**
 * Final section. The Motion reel closes the page: it explains, in 15 seconds, what DealDesk catches
 * (the recipient who isn't on the deal team, the promise nobody approved, the edit that makes it outdated),
 * and only then comes the invitation. Value first, then the ask.
 */
export function Invitation() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll · big title scales in (scale .86 -> 1, opacity .2 -> 1), scrubbed (ease none) from section entry to
       *   its middle · reduced-motion: none.
       * MOTION · scroll into view · line, Motion reel, CTA rise (y 40 -> 0, fade) · 0.9s expo.out, stagger 0.12 · plays once.
       */
      gsap.fromTo('[data-big]', { scale: 0.86, opacity: 0.2 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 35%', scrub: true } })
      gsap.from('[data-in]', { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: root.current, start: 'top 55%', once: true } })
    }, root.current!)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="invite" aria-labelledby="invite-title" className="relative isolate -mt-[1px] overflow-hidden bg-bg pb-24 pt-24 text-center lg:pb-[140px] lg:pt-[150px]">
      {/* same shader as the hero, a touch brighter: intensity 45 */}
      <ShaderBackground intensity={0.45} brightness={0.04} />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/30 to-bg/80" />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-8">
        <h2 id="invite-title" data-big className="text-[clamp(52px,7.2vw,104px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-text will-change-transform">
          {invite.title.map((l, i) => (
            <span
              key={l}
              className={i === 1 ? 'block bg-gradient-to-r from-[#F2F4F8] via-[#B7ACFF] to-[#7FB4FF] bg-clip-text text-transparent' : 'block'}
            >
              {l}
            </span>
          ))}
        </h2>
        <p data-in className="mx-auto mt-8 max-w-[700px] text-[clamp(18px,1.6vw,22px)] text-muted">
          {invite.line}
        </p>

        {/* Motion reel (16:9): same player as Jordan's film. Starts with sound when on screen; mute, pause, skip on top. */}
        <div data-in className="relative mx-auto mt-12 max-w-[1280px] lg:mt-16">
          <FilmPlayer
            src="/assets/video/motion-reel.mp4"
            poster="/assets/video/motion-reel.jpg"
            posterAlt="Looks ready. A phone showing the Project Harbor message next to the words on screen."
            label="Motion reel, 15 seconds, with sound: DealDesk flags a recipient who is not on the deal team and a promise nobody approved, and marks the message outdated after an edit"
            transcript="Looks ready. Sam isn't on the deal team. A promise nobody approved. Pending is not approved. Ready when everything is clear. Edit it, and it's outdated. Look twice. Send once. A second look, not a guarantee."
            skipTo="invite-cta"
            skipLabel="Skip the reel and go to the button"
          />
        </div>

        <div id="invite-cta" data-in className="mt-12 scroll-mt-32 lg:mt-14">
          {/* href="#prototype" is a placeholder: replace it with the real prototype link */}
          <MagneticLink href="#prototype" className={btnPrimary + ' h-16 w-auto px-10 text-[18px]'}>
            {invite.cta}
          </MagneticLink>
        </div>
        <p data-in className="mt-5 text-[14px] text-muted/80">
          {invite.micro}
        </p>
      </div>
    </section>
  )
}
