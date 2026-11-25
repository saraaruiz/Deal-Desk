import { useEffect, useRef } from 'react'
import { gsap, isDesktopMotion, prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Splits headline lines into words and reveals them one by one when the heading scrolls into view.
 * Real spaces stay between the words, so screen readers read the heading normally.
 *
 * MOTION · scroll into view · words rise out of a mask and un-blur (yPercent 115 -> 0, opacity 0 -> 1, blur 10px -> 0, blur only on
 *   desktop) · 1s expo.out, stagger 0.045 · plays once · reduced-motion: none (text is already in its final state).
 * Each heading owns its reveal, so it also works for sections that mount late (see App.tsx).
 */
/** gradientLast: the gradient is used only on the LAST word of the heading (e.g. just utton.), everything else stays white. */
export function Words({ lines, className, gradientLast }: { lines: string[]; className?: string; gradientLast?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('[data-w]'), {
        yPercent: 115,
        opacity: 0,
        ...(isDesktopMotion() ? { filter: 'blur(10px)' } : {}),
        duration: 1,
        ease: 'expo.out',
        stagger: 0.045,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <span ref={ref} data-words className={className}>
      {lines.map((line, li) => (
        <span key={line} className="block">
          {line.split(' ').map((w, i, a) => (
            <span key={i}>
              <span className="-mx-[0.06em] -mb-[0.12em] -mt-[0.06em] inline-block overflow-hidden px-[0.06em] pb-[0.24em] pt-[0.06em] align-top">
                <span data-w className={cn('inline-block will-change-transform', gradientLast && li === lines.length - 1 && i === a.length - 1 && 'grad-text')}>
                  {w}
                </span>
              </span>
              {i < a.length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}
