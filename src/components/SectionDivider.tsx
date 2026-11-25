import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/motion'

/**
 * A thin dividing line between sections, with the number and name of the next one.
 * MOTION · scroll · the hairline DRAWS from left to right (scaleX 0 -> 1) while the divider travels from 92% to 55% of the viewport,
 *   a small light at its tip leads it, and the label slides in (x -16 -> 0, fade) · scrubbed, ease none ·
 *   reduced-motion: the line is fully drawn, nothing moves.
 */
export function SectionDivider({ n, label }: { n: string; label: string }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top 92%', end: 'top 55%', scrub: 0.6 }
      gsap.fromTo('[data-dline]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: st })
      gsap.fromTo('[data-dlead]', { left: '0%', opacity: 1 }, { left: '100%', opacity: 0, ease: 'none', scrollTrigger: st })
      gsap.fromTo('[data-dlabel]', { x: -16, opacity: 0 }, { x: 0, opacity: 1, ease: 'none', scrollTrigger: st })
    }, root.current!)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} aria-hidden className="relative mx-auto flex max-w-[1440px] items-center gap-5 px-6 py-8 lg:px-[120px]">
      <span data-dlabel className="whitespace-nowrap text-[12px] font-semibold tracking-[0.18em] text-lavender-soft/90">
        {n} <span className="text-white/35">/</span> {label.toUpperCase()}
      </span>
      <span className="relative block h-px flex-1">
        <span data-dline className="absolute inset-0 origin-left bg-gradient-to-r from-lavender-soft/70 via-white/25 to-transparent" />
        <span data-dlead className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lavender-soft shadow-[0_0_12px_3px_rgba(183,172,255,0.7)]" style={{ left: '100%' }} />
      </span>
    </div>
  )
}
