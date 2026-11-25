import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/motion'

/*
 * MOTION · pointer move (fine pointer, desktop) · a small lavender dot and a trailing ring follow the cursor
 *   (dot 0.12s, ring 0.45s power3.out). Over links/buttons/[data-cursor] the ring grows to 1.9x and fills softly; on press it
 *   shrinks to .8x · The native cursor is NOT hidden (accessibility) · reduced-motion / touch: not mounted.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const d = dot.current!
    const r = ring.current!
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 })
    const dx = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3.out' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3.out' })
    const rx = gsap.quickTo(r, 'x', { duration: 0.45, ease: 'power3.out' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.45, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      gsap.to([d, r], { opacity: 1, duration: 0.3, overwrite: 'auto' })
    }
    const over = (e: PointerEvent) => {
      const hot = (e.target as Element | null)?.closest('a, button, [data-cursor]')
      gsap.to(r, { scale: hot ? 1.9 : 1, backgroundColor: hot ? 'rgba(155,140,255,.18)' : 'rgba(155,140,255,0)', duration: 0.5, ease: 'expo.out', overwrite: 'auto' })
    }
    const down = () => gsap.to(r, { scale: 0.8, duration: 0.25, overwrite: 'auto' })
    const up = (e: PointerEvent) => over(e)
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.3, overwrite: 'auto' })
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[96] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={ring} className="fixed left-0 top-0 size-9 rounded-full border border-lavender-soft/70" />
      <div ref={dot} className="fixed left-0 top-0 size-1.5 rounded-full bg-lavender-soft" />
    </div>
  )
}
