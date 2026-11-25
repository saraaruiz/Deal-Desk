import { useEffect, useRef } from 'react'
import { FileText, Pause, Search, Users } from 'lucide-react'
import { limits } from '@/content/copy'
import { GlassCard } from '@/components/GlassCard'
import { Words } from '@/components/Words'
import { cn } from '@/lib/utils'
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
      /*
       * MOTION · scroll (whole section) · the coloured orbs behind the frosted cards drift in opposite directions (y ±80px) · scrubbed, ease none · reduced-motion: none.
       */
      gsap.fromTo('[data-orb]', { y: (i) => (i % 2 ? 80 : -80) }, { y: (i) => (i % 2 ? -80 : 80), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
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
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span data-orb className="absolute left-[6%] top-[38%] size-[240px] rounded-full bg-[#6941E1]/55 blur-[70px] md:size-[420px] md:blur-[110px]" />
        <span data-orb className="absolute right-[5%] top-[52%] size-[260px] rounded-full bg-[#3A3FC0]/55 blur-[70px] md:size-[460px] md:blur-[120px]" />
        <span data-orb className="absolute bottom-[4%] left-[40%] size-[200px] rounded-full bg-[#B04BD8]/35 blur-[70px] md:size-[340px] md:blur-[110px]" />
      </div>
      <span data-light-line aria-hidden className="absolute inset-x-[10%] top-0 h-px origin-center bg-gradient-to-r from-transparent via-lavender-soft/70 to-transparent" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-[120px]">
        <p data-head className="text-center text-[14px] font-semibold tracking-[0.12em] text-lavender-soft">
          {limits.marker.toUpperCase()}
        </p>
        <h2 id="limits-title" className="h-display mt-5 text-center text-text">
          <Words lines={limits.title} gradientLines={[1]} />
        </h2>
        <p data-head className="h-lede mt-6 text-center text-muted">
          {limits.line}
        </p>

        <ul data-limits className="mx-auto mt-16 grid max-w-[1200px] gap-4 lg:grid-cols-3 lg:gap-6">
          {limits.items.map((it, i) => {
            const Icon = icons[it.icon]
            const featured = i === 0 // the main limit leads: bigger type, full width; the other three support it
            return (
              <GlassCard key={it.t} as="li" variant="real" tilt={featured ? 2 : 3} data-limit className={cn('group relative overflow-hidden p-8', featured ? 'lg:col-span-3 lg:p-12' : 'lg:min-h-[270px]')}>
                {/* accent hairline and a big faint index number */}
                <span aria-hidden className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-lavender/55 to-transparent" />
                <span aria-hidden className="pointer-events-none absolute right-6 top-3 select-none text-[clamp(64px,8vw,128px)] font-extrabold leading-none tracking-[-0.04em] text-white/[0.045]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className={cn('relative flex gap-5', featured ? 'flex-col lg:flex-row lg:items-center lg:gap-12' : 'flex-col')}>
                  <span
                    aria-hidden
                    className={cn(
                      'inline-flex flex-none items-center justify-center rounded-full bg-lavender/12 text-lavender-soft ring-1 ring-lavender/30 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-rotate-6 group-hover:scale-105',
                      featured ? 'size-16 lg:size-20' : 'size-12',
                    )}
                  >
                    <Icon size={featured ? 32 : 22} strokeWidth={1.6} />
                  </span>
                  <div className={cn(featured && 'lg:flex lg:flex-1 lg:items-center lg:justify-between lg:gap-12')}>
                    <h3 className={cn('font-semibold leading-[1.15] tracking-[-0.01em] text-text', featured ? 'text-[clamp(28px,3vw,42px)] font-bold lg:max-w-[460px]' : 'text-[22px]')}>{it.t}</h3>
                    <p className={cn('leading-[1.55] text-muted', featured ? 'mt-4 text-[clamp(17px,1.5vw,20px)] lg:mt-0 lg:max-w-[460px]' : 'mt-3 text-[16px]')}>{it.d}</p>
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
