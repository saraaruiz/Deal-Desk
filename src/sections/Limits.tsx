import { useEffect, useRef } from 'react'
import { FileText, Pause, Search, Users } from 'lucide-react'
import { limits } from '@/content/copy'
import { GlassCard } from '@/components/GlassCard'
import { Words } from '@/components/Words'
import { gsap, prefersReducedMotion } from '@/lib/motion'

const icons = { search: Search, users: Users, pause: Pause, file: FileText }

export function Limits() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll · a hairline of light draws across the top of the section (scaleX 0 -> 1, from the centre) as it enters ·
       *   scrubbed over the entry (top bottom -> top 40%), ease none · replaces the old white curtain · reduced-motion: line is fully drawn.
       * MOTION · scroll into view · header lines rise, then the four limits reveal ONE BY ONE (y 40 -> 0, opacity 0 -> 1) ·
       *   0.9s expo.out, stagger 0.14 · plays once · reduced-motion: none.
       */
      gsap.fromTo('[data-light-line]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 40%', scrub: true } })
      gsap.from('[data-head]', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } })
      gsap.from('[data-limit]', { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.14, scrollTrigger: { trigger: '[data-limits]', start: 'top 85%', once: true } })
    }, root.current!)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="limits" aria-labelledby="limits-title" className="relative isolate overflow-hidden bg-bg-deep py-24 lg:py-[130px]">
      {/* deep indigo wash instead of a white block: same dark world as the rest */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(37,41,122,0.45),transparent_70%)]" />
      <span data-light-line aria-hidden className="absolute inset-x-[10%] top-0 h-px origin-center bg-gradient-to-r from-transparent via-lavender-soft/70 to-transparent" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-[120px]">
        <p data-head className="text-center text-[14px] font-semibold tracking-[0.12em] text-lavender-soft">
          {limits.marker.toUpperCase()}
        </p>
        <h2 id="limits-title" className="mt-5 text-center text-[clamp(38px,4.4vw,64px)] font-extrabold leading-[1.06] tracking-[-0.02em] text-text">
          <Words lines={limits.title} />
        </h2>
        <p data-head className="mt-6 text-center text-[clamp(17px,1.4vw,20px)] text-muted">
          {limits.line}
        </p>

        <ul data-limits className="mx-auto mt-16 grid max-w-[1200px] gap-4 md:grid-cols-2 lg:gap-6">
          {limits.items.map((it) => {
            const Icon = icons[it.icon]
            return (
              <GlassCard key={it.t} as="li" tilt={3} data-limit className="group p-8 lg:min-h-[200px]">
                <div className="flex items-start gap-5">
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex size-12 flex-none items-center justify-center rounded-full bg-lavender/12 text-lavender-soft ring-1 ring-lavender/30 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-rotate-6 group-hover:scale-105"
                  >
                    <Icon size={22} strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3 className="text-[24px] font-semibold leading-snug text-text">{it.t}</h3>
                    <p className="mt-3 text-[17px] leading-[1.55] text-muted">{it.d}</p>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
