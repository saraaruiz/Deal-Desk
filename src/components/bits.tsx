import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { gsap, prefersReducedMotion } from '@/lib/motion'

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn('inline-flex items-center gap-[6.6px]', className)} aria-label="DealDesk, back to top">
      <img src="/assets/logo-mark.svg" alt="" width={52} height={34} className="h-[34px] w-[52px]" />
      <span className="text-[20px] font-bold tracking-[-0.03em]">
        <span className="text-text">Deal</span>
        <span className="bg-gradient-to-r from-[#c19bff] to-[#6f7df5] bg-clip-text text-transparent">Desk</span>
      </span>
    </a>
  )
}

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-lavender px-5 py-3 text-[15px] font-semibold text-indigo"
    >
      Skip to content
    </a>
  )
}

export function FilmGrain() {
  return <div aria-hidden className="film-grain" />
}

/*
 * MOTION · scroll (whole page) · 2px lavender line scaleX 0 -> 1 · scrubbed to page progress (no easing) ·
 * reduced-motion: line stays, updated with native scroll (no smoothing), no transition.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = bar.current!
    const upd = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      gsap.set(el, { scaleX: max > 0 ? window.scrollY / max : 0 })
    }
    upd()
    window.addEventListener('scroll', upd, { passive: true })
    window.addEventListener('resize', upd)
    return () => {
      window.removeEventListener('scroll', upd)
      window.removeEventListener('resize', upd)
    }
  }, [])
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[95] h-[2px]">
      <div ref={bar} className="h-full origin-left bg-lavender-soft" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}

/*
 * MOTION · pointer hover (desktop, fine pointer) · button translates toward the cursor, max 8px ·
 * 0.5s expo.out, springs back on leave · reduced-motion: disabled.
 */
export function MagneticLink({
  href,
  children,
  className,
  strength = 0.25,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { strength?: number }) {
  const ref = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    const el = ref.current!
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'expo.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'expo.out' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      xTo(Math.max(-8, Math.min(8, dx * strength)))
      yTo(Math.max(-8, Math.min(8, dy * strength)))
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])
  return (
    <a ref={ref} href={href} className={className} {...rest}>
      {children}
    </a>
  )
}

export const btnPrimary =
  'inline-flex min-h-[48px] items-center justify-center rounded-full bg-lavender px-[30px] py-[16px] text-[17px] font-semibold text-indigo shadow-[0_10px_30px_rgba(156,140,255,0.35)] transition-[box-shadow,background-color] duration-500 hover:bg-lavender-soft'
export const btnGhost =
  'inline-flex min-h-[48px] items-center justify-center rounded-full border-[1.2px] border-white/30 px-[30px] py-[16px] text-[17px] font-semibold text-text transition-colors duration-500 hover:bg-white/10'

export function Chip({ children, className, tone }: { children: React.ReactNode; className?: string; tone?: 'ready' | 'muted' }) {
  return (
    <span className={cn('chip', tone === 'muted' && 'before:bg-muted', className)}>
      {children}
    </span>
  )
}

export function Initials({ children, tone = 'ready', dashed }: { children: string; tone?: 'ready' | 'lav'; dashed?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex size-16 items-center justify-center rounded-full border-2 text-[17px] font-semibold',
        tone === 'ready' ? 'border-[#58d6a0] bg-[#58d6a0]/10 text-[#58d6a0]' : 'border-lavender-soft bg-bg/80 text-lavender-soft',
        dashed && 'border-dashed',
      )}
    >
      {children}
    </span>
  )
}

/** Splits text into masked lines for the reveal. `lines` are provided already split. */
export function MaskLines({ lines, className, lineClass }: { lines: string[]; className?: string; lineClass?: string }) {
  return (
    <span className={className}>
      {lines.map((l) => (
        <span key={l} className="block overflow-hidden pb-[0.08em] [clip-path:inset(0_0_-0.1em_0)]">
          <span data-line className={cn('block will-change-transform', lineClass)}>
            {l}
          </span>
        </span>
      ))}
    </span>
  )
}
