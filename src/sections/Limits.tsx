import { useEffect, useRef } from 'react'
import { FileText, Pause, Search, Users } from 'lucide-react'
import { limits } from '@/content/copy'
import { GlassCard } from '@/components/GlassCard'
import { Words } from '@/components/Words'
import { gsap, ScrollTrigger, isDesktopMotion, prefersReducedMotion } from '@/lib/motion'

const icons = { search: Search, users: Users, pause: Pause, file: FileText }

export function Limits() {
  const wrap = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll · dark -> light CURTAIN into Limits: clip-path inset(10% 5% 0 5% round 64px) -> inset(0 round 0),
       *   scrubbed over the section's entry (top bottom -> top 35%), ease none · desktop only (mobile: simple fade) ·
       *   reduced-motion: none (section simply appears light).
       * MOTION · scroll · light -> dark OUT of Limits: bottom edge closes inset(0) -> inset(0 5% 10% 5% round 0 0 64px 64px),
       *   scrubbed over the last 35% of the section, ease none · desktop only.
       */
      if (isDesktopMotion()) {
        gsap.fromTo(
          wrap.current,
          { clipPath: 'inset(10% 5% 0% 5% round 64px 64px 0px 0px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)',
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 35%', scrub: true },
          },
        )
        gsap.fromTo(
          wrap.current,
          { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)' },
          {
            clipPath: 'inset(0% 5% 10% 5% round 0px 0px 64px 64px)',
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: root.current, start: 'bottom 80%', end: 'bottom top', scrub: true },
          },
        )
      }
      /*
       * MOTION · scroll into view · four limits reveal ONE BY ONE (y 40 -> 0, opacity 0 -> 1) · 0.8s expo.out, stagger 0.14 ·
       *   plays once · reduced-motion: none.
       */
      gsap.from('[data-head]', { y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } })
      gsap.from('[data-limit]', { y: 40, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.14, scrollTrigger: { trigger: '[data-limits]', start: 'top 85%', once: true } })
    }, root.current!)
    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <section ref={root} id="limits" aria-labelledby="limits-title" className="relative bg-bg">
      <div ref={wrap} className="relative isolate overflow-hidden bg-paper py-20 text-ink will-change-[clip-path] lg:py-[110px]">
        {/* colour orbs behind the frosted glass */}
        <div aria-hidden className="drift pointer-events-none absolute -left-24 top-[38%] size-[420px] rounded-full bg-[#9b8cff]/35 blur-[90px] max-md:hidden" />
        <div aria-hidden className="drift pointer-events-none absolute -right-20 top-[60%] size-[380px] rounded-full bg-[#7fb4ff]/35 blur-[90px] max-md:hidden [animation-delay:-10s]" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-[120px]">
          <p data-head className="text-center text-[14px] font-semibold tracking-[0.04em] text-[#5b4bdb]">
            {limits.marker}
          </p>
          <h2 id="limits-title" className="mt-5 text-center text-[clamp(38px,4.4vw,64px)] font-extrabold leading-[1.06] tracking-[-0.02em] text-ink">
            <Words lines={limits.title} />
          </h2>
          <p data-head className="mt-6 text-center text-[clamp(17px,1.4vw,20px)] text-ink-2">
            {limits.line}
          </p>

          <ul data-limits className="mx-auto mt-14 grid max-w-[1200px] gap-4 md:grid-cols-2 lg:gap-6">
            {limits.items.map((it) => {
              const Icon = icons[it.icon]
              return (
                <GlassCard key={it.t} as="li" tone="light" tilt={4} data-limit className="group p-8 lg:min-h-[210px]">
                  <div className="flex items-start gap-4">
                    <span aria-hidden className="depth mt-0.5 inline-flex size-11 flex-none items-center justify-center rounded-full bg-[#eceaff] text-[#5b4bdb] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-rotate-12 group-hover:scale-110" style={{ ['--d' as string]: 1.6 } as React.CSSProperties}>
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="text-[24px] font-semibold leading-snug text-ink">{it.t}</h3>
                      <p className="mt-3 text-[17px] leading-[1.5] text-ink-2">{it.d}</p>
                    </div>
                  </div>
                </GlassCard>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
