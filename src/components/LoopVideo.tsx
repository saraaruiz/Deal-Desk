import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * MOTION · video that plays only while it matters · muted, looped, inline.
 *   - Lazy: no network until the element is within 400px of the viewport (then `src` is attached).
 *   - Plays while >=35% visible (or while `playing` is true when controlled), pauses when off-screen.
 *   - reduced-motion: never autoplays; the poster stays visible and a play/pause button lets the person start it.
 *   - Missing file: it just hides itself, the poster / static screen underneath remains.
 */
export function LoopVideo({
  src,
  poster,
  className,
  playing,
  label,
  showToggle,
  rate = 1,
}: {
  src: string
  poster?: string
  className?: string
  /** when set, it controls playback (used by the pinned scroll section); otherwise visibility does */
  playing?: boolean
  label: string
  showToggle?: boolean
  rate?: number
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const wrap = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [broken, setBroken] = useState(false)
  const [userPaused, setUserPaused] = useState(false) // normal motion: person paused it
  const [manualPlay, setManualPlay] = useState(false) // reduced motion: person pressed play

  // lazy attach + visibility
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const lazy = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '400px' })
    const vis = new IntersectionObserver(([e]) => setVisible(e.intersectionRatio >= 0.35), { threshold: [0, 0.35, 0.6] })
    lazy.observe(el)
    vis.observe(el)
    return () => {
      lazy.disconnect()
      vis.disconnect()
    }
  }, [])

  const shouldPlay = !broken && near && (reduced ? manualPlay && visible : !userPaused && (playing ?? visible))

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.playbackRate = rate
    if (shouldPlay) void v.play().catch(() => {})
    else v.pause()
  }, [shouldPlay, rate, near])

  return (
    <span ref={wrap} className={cn('absolute inset-0 block', className)}>
      {!broken && (
        <video
          ref={ref}
          aria-label={label}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          onError={() => setBroken(true)}
          className="h-full w-full object-cover"
          src={near ? src : undefined}
        />
      )}
      {showToggle && !broken && (
        <button
          type="button"
          onClick={() => (reduced ? setManualPlay((p) => !p) : setUserPaused((p) => !p))}
          aria-label={shouldPlay ? `Pause video: ${label}` : `Play video: ${label}`}
          className="absolute bottom-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-bg/70 text-text backdrop-blur"
        >
          {shouldPlay ? '❚❚' : '▶'}
        </button>
      )}
    </span>
  )
}
