import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * MOTION · pointer over a glass card (fine pointer, desktop) · 3D tilt (rotationX/Y up to ±`tilt` deg) + scale 1.015,
 *   specular sheen and rim glow follow the cursor (--mx/--my), children with .depth shift in parallax (--px/--py) ·
 *   0.6s power3.out on enter/move, spring-back 0.8s expo.out on leave · reduced-motion / touch: no tilt, sheen only on hover.
 */
export function GlassCard({
  className,
  children,
  tilt = 5,
  tone = 'dark',
  as: Tag = 'div',
  label,
  ...rest
}: React.HTMLAttributes<HTMLElement> & { tilt?: number; tone?: 'dark' | 'light'; as?: 'div' | 'article' | 'li'; label?: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current!
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    gsap.set(el, { transformPerspective: 900 })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width // 0..1
      const ny = (e.clientY - r.top) / r.height
      ry((nx - 0.5) * tilt * 2)
      rx(-(ny - 0.5) * tilt * 2)
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
      el.style.setProperty('--px', String((nx - 0.5) * 2))
      el.style.setProperty('--py', String((ny - 0.5) * 2))
    }
    const enter = () => gsap.to(el, { scale: 1.015, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
    const leave = () => {
      rx(0)
      ry(0)
      gsap.to(el, { scale: 1, duration: 0.8, ease: 'expo.out', overwrite: 'auto' })
      el.style.setProperty('--px', '0')
      el.style.setProperty('--py', '0')
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
    }
  }, [tilt])

  return (
    // @ts-expect-error polymorphic ref: the element type is one of div | article | li
    <Tag ref={ref} data-tone={tone} aria-label={label} className={cn('glass-apple', className)} {...rest}>
      {children}
    </Tag>
  )
}
