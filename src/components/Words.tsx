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
/*
 * cinema: MOTION · scroll into view · each word comes into focus from a deep blur, large and low (blur 22px -> 0, scale 1.25 -> 1,
 *   y 50 -> 0, opacity 0 -> 1) · 1.5s expo.out, stagger 0.14 · replays after scrolling back above it · phones too · reduced-motion: none.
 */
export function Words({ lines, className, gradientLast, cinema }: { lines: string[]; className?: string; gradientLast?: boolean; cinema?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      if (cinema) {
        gsap.fromTo(
          el.querySelectorAll('[data-w]'),
          { y: 50, scale: 1.25, opacity: 0, filter: 'blur(22px)' },
          { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'expo.out', stagger: 0.14, scrollTrigger: { trigger: el, start: 'top 72%', toggleActions: 'play none none reset' } },
        )
        return
      }
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
              <span className={cn('-mx-[0.06em] -mb-[0.12em] -mt-[0.06em] inline-block px-[0.06em] pb-[0.24em] pt-[0.06em] align-top', !cinema && 'overflow-hidden')}>
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
