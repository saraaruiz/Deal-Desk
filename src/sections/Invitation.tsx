import { useEffect, useRef } from 'react'
import { invite } from '@/content/copy'
import { MagneticLink, btnPrimary } from '@/components/bits'
import { FilmPlayer } from '@/components/FilmPlayer'
import { ShaderBackground } from '@/components/ShaderBackground'
import { gsap, prefersReducedMotion } from '@/lib/motion'

/**
 * Final section, FULL SCREEN version. The Motion reel takes the whole screen (edge to edge, full height, letterboxed on black so
 * nothing is cropped) and plays with sound; the real call to action sits right under it, because the film's own end card
 * already says "Look twice. Send once." (its drawn button is part of the picture).
 */
export function Invitation() {
  const strip = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll into view · the line, the button and the micro-line under the film rise (y 40 -> 0, fade) · 0.9s expo.out,
       *   stagger 0.12 · plays once · reduced-motion: none.
       */
      gsap.from('[data-in]', { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: strip.current, start: 'top 80%', once: true } })
    }, strip.current!)
    return () => ctx.revert()
  }, [])

  return (
    <section id="invite" aria-labelledby="invite-title" className="relative isolate -mt-[1px] bg-black">
      <h2 id="invite-title" className="sr-only">
        {invite.title.join(' ')}
      </h2>

      {/* the film: full width, full height of the screen, sound on by default; mute, pause, skip on top */}
      <FilmPlayer
        fullBleed
        src="/assets/video/motion-reel.mp4"
        poster="/assets/video/motion-reel.jpg"
        posterAlt="Looks ready. A phone showing the Project Harbor message next to the words on screen."
        label="Motion reel, 15 seconds, with sound: DealDesk flags a recipient who is not on the deal team and a promise nobody approved, and marks the message outdated after an edit"
        transcript="Looks ready. Sam isn't on the deal team. A promise nobody approved. Pending is not approved. Ready when everything is clear. Edit it, and it's outdated. Look twice. Send once. A second look, not a guarantee."
        skipTo="invite-cta"
        skipLabel="Skip the reel and go to the button"
      />

      {/* the invitation, under the film */}
      <div ref={strip} className="relative isolate overflow-hidden bg-bg px-6 pb-24 pt-20 text-center lg:pb-[130px] lg:pt-[110px]">
        <ShaderBackground intensity={0.45} brightness={0.04} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black via-bg/45 to-bg/85" />
        <div className="relative mx-auto max-w-[760px]">
          <p data-in className="mx-auto max-w-[560px] text-[clamp(20px,2vw,28px)] font-semibold leading-[1.3] tracking-[-0.01em] text-text">
            {invite.line}
          </p>
          <div id="invite-cta" data-in className="mt-9 scroll-mt-32">
            {/* href="#prototype" is a placeholder: replace it with the real prototype link */}
            <MagneticLink href="#prototype" className={btnPrimary + ' h-16 w-auto px-10 text-[18px]'}>
              {invite.cta}
            </MagneticLink>
          </div>
          <p data-in className="mt-5 text-[14px] text-muted/80">
            {invite.micro}
          </p>
        </div>
      </div>
    </section>
  )
}
