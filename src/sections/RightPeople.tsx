import { useEffect, useRef, useState } from 'react'
import { look } from '@/content/copy'
import { reviewCards } from '@/content/cards'
import { WarpCarousel } from '@/components/ui/warp-carousel'
import { Words } from '@/components/Words'
import { GlassCard } from '@/components/GlassCard'
import { LoopVideo } from '@/components/LoopVideo'
import { gsap, useLiteMode, useNearViewport, prefersReducedMotion } from '@/lib/motion'

const FONT = '"Inter Variable", "Inter", system-ui, sans-serif'

function cssMesh(mesh: string[]) {
  // The same colours as the WebGL card, as a CSS gradient for mobile / low-power / reduced motion.
  const [a, , c, d, e, f, g] = mesh
  return `radial-gradient(90% 70% at 85% 15%, ${e}, transparent 60%), radial-gradient(80% 60% at 10% 90%, ${f}, transparent 60%), linear-gradient(165deg, ${a}, ${c} 35%, ${d} 60%, ${g})`
}

function StaticList() {
  return (
    <ul className="swipe -mx-6 px-6 pb-4" aria-label="Review at a glance">
      {reviewCards.map((c) => (
        <li
          key={c.title}
          className="relative flex aspect-[256/320] w-[min(78vw,300px)] flex-col justify-between overflow-hidden rounded-[20px] border border-white/10 p-5"
          style={{ background: cssMesh(c.mesh!) }}
        >
          <p className="whitespace-pre-line text-[14px] font-light leading-snug text-white/90">{c.title}</p>
          <p
            className="text-[96px] font-light leading-none tracking-[-0.02em]"
            style={{ backgroundImage: `linear-gradient(90deg, ${c.numeral![0]}, ${c.numeral![1]})`, WebkitBackgroundClip: 'text', color: 'transparent' }}
          >
            {c.value}
          </p>
          <p className="min-h-[1.25em] text-[13px] text-white/85">{c.footer}</p>
        </li>
      ))}
    </ul>
  )
}

export function RightPeople() {
  const lite = useLiteMode()
  const [stageRef, near] = useNearViewport<HTMLDivElement>('700px')
  const [hover, setHover] = useState(false)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll into view · title lines rise (y 40 -> 0, opacity 0 -> 1), then the stage fades up ·
       *   0.9s expo.out, stagger 0.1 · plays once · reduced-motion: none (final state).
       */
      gsap.from('[data-rise]', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      })
    }, root.current!)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="look" aria-labelledby="look-title" className="relative overflow-hidden bg-bg py-20 lg:py-[110px]">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[300px] size-[700px] rounded-full bg-glow-2/25 blur-[140px] max-md:hidden" />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-[120px]">
        <h2 id="look-title" className="text-[clamp(40px,5vw,72px)] font-extrabold leading-[1.04] tracking-[-0.02em]">
          <Words lines={look.title} />
        </h2>
        <p data-rise className="mt-6 max-w-[520px] text-[clamp(17px,1.5vw,22px)] leading-[1.5] text-muted">
          {look.line}
        </p>
      </div>

      {/* Motion reel (16:9). Its on-screen words are the same three ideas as this section's title. */}
      <div data-rise className="relative mx-auto mt-12 max-w-[1440px] px-6 lg:mt-14 lg:px-[120px]">
        <GlassCard tilt={2} className="!rounded-[32px] p-2 sm:p-3">
          <div className="relative aspect-video overflow-hidden rounded-[24px] bg-card">
            <img src="/assets/video/motion-reel.jpg" alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            <LoopVideo
              src="/assets/video/motion-reel.mp4"
              poster="/assets/video/motion-reel.jpg"
              label="Motion reel: DealDesk flags a recipient who is not on the deal team and a promise nobody approved, and marks the message outdated after an edit"
              showToggle
            />
          </div>
        </GlassCard>
        <p className="sr-only">
          Motion reel, no audio. Looks ready. Sam isn&apos;t on the deal team. A promise nobody approved. Pending is not approved. Ready when everything
          is clear. Edit it, and it&apos;s outdated. Look twice. Send once. A second look, not a guarantee.
        </p>
      </div>

      <div ref={stageRef} data-rise className="relative mx-auto mt-10 max-w-[1440px] px-6 lg:mt-12 lg:px-0">
        {lite ? (
          <StaticList />
        ) : (
          <div
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            onFocusCapture={() => setHover(true)}
            onBlurCapture={() => setHover(false)}
            className="h-[min(640px,78vh)] w-full"
          >
            {/* Lazy-mounted: WebGL only when near the viewport. Never on mobile / low-power / reduced motion. */}
            {near && (
              <WarpCarousel
                cards={reviewCards}
                background="#0F1115"
                warp={1}
                autoplay={!hover}
                interval={3.8}
                step={1}
                font={FONT}
                ariaLabel="Review at a glance"
                style={{ height: '100%', aspectRatio: 'auto', minHeight: 360 }}
              />
            )}
          </div>
        )}
        <p className="mt-5 px-0 text-center text-[13px] text-muted/80">{look.caption}</p>
      </div>
    </section>
  )
}
