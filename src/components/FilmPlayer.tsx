import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronsRight, Pause, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Lenis = { scrollTo: (target: string | number | HTMLElement, opts?: { duration?: number }) => void }

/**
 * Film player used for Jordan's story and for the Motion reel.
 * - Starts by itself WITH SOUND when it is mostly on screen. Browsers only allow sound after the person has clicked or tapped
 *   on the page; if they refuse, it starts muted and says so ("Sound is off · tap to turn it on").
 * - Controls on top: sound on/off, pause / replay, skip (scrolls to `skipTo`).
 * - Plays once; pauses when it leaves the view; reduced motion: no autoplay, the person presses play.
 * - The file is only attached when it is close to the viewport. If it is missing, the poster stays.
 */
export function FilmPlayer({
  src,
  poster,
  posterAlt,
  label,
  transcript,
  skipTo,
  skipLabel,
  className,
  fullBleed,
  playWhen,
  volume,
  wide,
  dock,
  onDock,
}: {
  onDock?: (docked: boolean) => void
  /** Once it has started, scrolling away turns it into a small player in the corner that keeps playing (pause, sound, close). */
  dock?: boolean
  /** Upright phones: a taller frame (aspect 16:10.26) that trims 6% off each side, so the film looks 14% bigger. Only for films whose words stay inside that margin. */
  wide?: boolean
  /** When set, it decides if the film should be playing (used by the pinned zoom section) instead of the on-screen test. */
  playWhen?: boolean
  /** 0..1, for the fade-out at the end of the pinned section. */
  volume?: number
  /** Edge to edge and the full height of the screen (no rounding, nothing cropped: the picture is letterboxed on black). */
  fullBleed?: boolean
  src: string
  poster: string
  posterAlt: string
  /** accessible name of the video */
  label: string
  /** the words of the film, as text (the captions are burned into the picture) */
  transcript: string
  /** id of the element the Skip button scrolls to */
  skipTo: string
  /** accessible name of the Skip button */
  skipLabel: string
  className?: string
}) {
  const stage = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [near, setNear] = useState(false)
  const [ioVisible, setVisible] = useState(false) // >= 55% of the frame on screen
  const [muted, setMuted] = useState(false) // sound ON by default
  const [soundBlocked, setSoundBlocked] = useState(false) // the browser refused sound autoplay -> started muted
  const [userPaused, setUserPaused] = useState(false)
  const [ended, setEnded] = useState(false)
  const [broken, setBroken] = useState(false)
  const [away, setAway] = useState(false) // less than 35% of the frame on screen
  const [started, setStarted] = useState(false)
  const [dismissed, setDismissed] = useState(false) // the corner player was closed
  const reduced = prefersReducedMotion()
  const keep = !!dock && started && !dismissed
  const visible = keep || (playWhen ?? ioVisible)
  const docked = keep && away && !ended && !broken
  useEffect(() => onDock?.(docked), [docked, onDock])
  useEffect(() => {
    if (video.current && volume !== undefined) video.current.volume = Math.min(1, Math.max(0, volume))
  }, [volume])

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const lazy = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '700px' })
    const vis = new IntersectionObserver(
      ([e]) => {
        setVisible(e.intersectionRatio >= 0.55)
        setAway(e.intersectionRatio < 0.35)
        if (e.intersectionRatio >= 0.55) setDismissed(false)
      },
      { threshold: [0, 0.35, 0.55, 0.8] },
    )
    lazy.observe(el)
    vis.observe(el)
    return () => {
      lazy.disconnect()
      vis.disconnect()
    }
  }, [])

  const start = useCallback(async () => {
    const v = video.current
    if (!v) return
    v.muted = muted
    try {
      await v.play()
      if (soundBlocked && !muted) setSoundBlocked(false)
    } catch {
      v.muted = true // sound autoplay refused: play muted and tell the person
      setMuted(true)
      setSoundBlocked(true)
      await v.play().catch(() => {})
    }
  }, [muted, soundBlocked])

  useEffect(() => {
    const v = video.current
    if (!v || !near || broken) return
    if (visible && !userPaused && !ended && !reduced) void start()
    else v.pause()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, userPaused, ended, near, reduced, broken])

  useEffect(() => {
    if (prefersReducedMotion() || fullBleed || dock) return // a transformed parent would trap the fixed corner player
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll into view · the frame grows from 94% to 100% (scale .94 -> 1) while it enters (top 95% -> top 45%) ·
       *   scrubbed, ease none · reduced-motion: none. The film itself plays on its own, with sound.
       */
      gsap.fromTo(stage.current, { scale: 0.94 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: stage.current, start: 'top 95%', end: 'top 45%', scrub: true } })
    })
    return () => ctx.revert()
  }, [])

  const toggleMute = () => {
    const v = video.current
    const next = !muted
    setMuted(next)
    setSoundBlocked(false)
    if (v) v.muted = next
    if (!next && v?.paused && !userPaused && !ended) void v.play().catch(() => {})
  }
  const togglePlay = () => {
    const v = video.current
    if (!v) return
    if (ended) {
      v.currentTime = 0
      setEnded(false)
      setUserPaused(false)
      return
    }
    if (v.paused) {
      setUserPaused(false)
      if (!visible || reduced) void start() // reduced motion / off-screen: an explicit press plays it
    } else {
      setUserPaused(true)
    }
  }
  const skip = () => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
    const target = document.getElementById(skipTo)
    video.current?.pause()
    if (dock) {
      setDismissed(true)
      setUserPaused(true)
    }
    if (lenis && target) lenis.scrollTo(target, { duration: 1.4 })
    else target?.scrollIntoView({ behavior: 'smooth' })
  }

  const playing = !userPaused && !ended && visible && !reduced
  const btn = 'inline-flex size-11 items-center justify-center rounded-full bg-bg/70 text-text backdrop-blur transition-colors hover:bg-bg/90'

  const closeMini = () => {
    setDismissed(true)
    setUserPaused(true)
    video.current?.pause()
  }
  const big = wide && !docked // upright phones: taller frame, sides trimmed, controls above the picture

  return (
    <div ref={stage} className={cn('relative', dock ? cn('aspect-video', wide && 'max-sm:portrait:aspect-auto max-sm:portrait:h-[calc(64.2vw+60px)]') : 'will-change-transform', className)}>
      <div
        role={docked ? 'region' : undefined}
        aria-label={docked ? 'Mini video player' : undefined}
        className={cn(
          'overflow-hidden',
          dock ? (docked ? 'bg-[#0f1115]' : 'film-zoom') : 'bg-black',
          docked
            ? 'dd-pop fixed bottom-3 right-3 z-[105] aspect-video w-[min(58vw,380px)] sm:w-[380px] rounded-2xl shadow-2xl sm:bottom-6 sm:right-6'
            : cn(
                'relative w-full',
                fullBleed
                  ? 'h-[100svh] portrait:aspect-video portrait:h-auto'
                  : cn('aspect-video rounded-[20px] lg:rounded-[28px]', dock ? 'shadow-[0_40px_90px_-30px_rgba(20,20,90,0.7)]' : 'shadow-[0_40px_90px_-30px_rgba(10,14,70,0.9)] ring-1 ring-white/10'),
                big && 'max-sm:portrait:aspect-auto max-sm:portrait:h-[calc(64.2vw+60px)] max-sm:portrait:rounded-none max-sm:portrait:shadow-none',
              ),
        )}
      >
        <img src={poster} alt={posterAlt} loading="lazy" decoding="async" className={cn('absolute inset-0 h-full w-full', fullBleed ? cn('object-contain', big && 'max-sm:portrait:top-[60px] max-sm:portrait:h-[calc(100%-60px)] max-sm:portrait:object-cover') : 'object-cover', big && 'max-sm:portrait:top-[60px] max-sm:portrait:h-[calc(100%-60px)]')} />
        {!broken && (
          <video
            ref={video}
            className={cn('absolute inset-0 h-full w-full', fullBleed ? cn('object-contain', big && 'max-sm:portrait:top-[60px] max-sm:portrait:h-[calc(100%-60px)] max-sm:portrait:object-cover') : 'object-cover', big && 'max-sm:portrait:top-[60px] max-sm:portrait:h-[calc(100%-60px)]')}
            playsInline
            preload="metadata"
            poster={poster}
            src={near ? src : undefined}
            onError={() => setBroken(true)}
            onEnded={() => setEnded(true)}
            onPlay={() => {
              setEnded(false)
              setStarted(true)
              setDismissed(false)
            }}
            onTimeUpdate={(e) => {
              const v = e.currentTarget
              if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`
            }}
            aria-label={label}
          />
        )}

        {!broken && (
          <div className={cn('absolute inset-x-0 top-0 flex items-center justify-end gap-2 bg-gradient-to-b from-black/55 to-transparent p-3 lg:p-4', big && 'max-sm:portrait:from-transparent', fullBleed && 'lg:px-8 lg:pt-6', docked && '!gap-1 !p-1.5')}>
            {soundBlocked && !docked && (
              <span className="mr-1 hidden rounded-full bg-bg/70 px-3 py-2 text-[13px] text-text backdrop-blur sm:inline">Sound is off · tap to turn it on</span>
            )}
            <button onClick={toggleMute} aria-label={muted ? 'Turn sound on' : 'Mute'} aria-pressed={muted} className={btn}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button onClick={togglePlay} aria-label={ended ? 'Replay' : playing ? 'Pause' : 'Play'} className={btn}>
              {ended ? <RotateCcw size={18} /> : playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            {docked ? (
              <button onClick={closeMini} aria-label="Close video" title="Close video" className={btn}>
                <X size={18} />
              </button>
            ) : (
              <button onClick={skip} aria-label={skipLabel} className={btn + ' w-auto gap-1.5 px-4 text-[14px] font-medium'}>
                Skip <ChevronsRight size={16} />
              </button>
            )}
          </div>
        )}

        <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
          <span ref={bar} className="block h-full origin-left bg-lavender-soft transition-transform duration-300 ease-linear" style={{ transform: 'scaleX(0)' }} />
        </span>
      </div>
      {/* On mobile the "sound is off" notice doesn't fit in the frame, so it goes underneath */}
      {soundBlocked && <p className="mt-3 text-center text-[13px] text-muted sm:hidden">Sound is off · tap the speaker to turn it on</p>}
      <p className="sr-only">{transcript}</p>
    </div>
  )
}
