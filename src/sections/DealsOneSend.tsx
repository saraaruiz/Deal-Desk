import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronsRight, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { deals } from '@/content/copy'
import { Words } from '@/components/Words'
import { gsap, prefersReducedMotion } from '@/lib/motion'

// Jordan's story: 19 s, 16:9, with its sound design and music. It starts by itself WITH SOUND when it is mostly on screen.
// Browsers only allow sound before the person has clicked/tapped on the page; if they refuse, it starts muted and says so
// ("Sound is off, tap to turn it on"). There is no scroll-scrubbing here: it plays like a film.
const VIDEO = '/assets/video/jordan.mp4'
const POSTER = '/assets/video1-poster.webp'
// The captions are burned into the film, so the page carries the same words as a text transcript for screen readers.
const TRANSCRIPT =
  "Several deals open. One more message to send. Who's on Harbor again? Pat, Alex… It looks ready. Is it? DealDesk already checked who's on the deal. Sam removed. Nothing leaves until you tap Send. Sent. Nothing to remember. A second pair of eyes. Prototype, fictional data, AI-generated character."

type Lenis = { scrollTo: (target: string | number | HTMLElement, opts?: { duration?: number }) => void }

export function DealsOneSend() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [near, setNear] = useState(false) // attach the file only when close to the viewport
  const [visible, setVisible] = useState(false) // >= 55% of the frame on screen
  const [muted, setMuted] = useState(false) // what the person wants: sound ON by default
  const [soundBlocked, setSoundBlocked] = useState(false) // the browser refused sound autoplay -> started muted
  const [userPaused, setUserPaused] = useState(false)
  const [ended, setEnded] = useState(false)
  const [broken, setBroken] = useState(false)
  const reduced = prefersReducedMotion()

  // visibility (lazy attach + play only while mostly in view)
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const lazy = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '700px' })
    const vis = new IntersectionObserver(([e]) => setVisible(e.intersectionRatio >= 0.55), { threshold: [0, 0.3, 0.55, 0.8] })
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
      // Sound autoplay was refused: play muted instead and tell the person.
      v.muted = true
      setMuted(true)
      setSoundBlocked(true)
      await v.play().catch(() => {})
    }
  }, [muted, soundBlocked])

  // autoplay when mostly visible (not for reduced motion), pause when it leaves or the person paused
  useEffect(() => {
    const v = video.current
    if (!v || !near || broken) return
    if (visible && !userPaused && !ended && !reduced) void start()
    else v.pause()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, userPaused, ended, near, reduced, broken])

  // gentle entrance for the frame (calm, not a pin)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll into view · the video frame grows from 94% to 100% (scale .94 -> 1) while it enters (top 95% -> top 45%) ·
       *   scrubbed, ease none · reduced-motion: none. The film itself plays on its own, with sound (see above).
       */
      gsap.fromTo(stage.current, { scale: 0.94 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: stage.current, start: 'top 95%', end: 'top 45%', scrub: true } })
    }, root.current!)
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
      if (!visible || reduced) void start() // reduced motion / off-screen: explicit press plays it
    } else {
      setUserPaused(true)
    }
  }
  const skip = () => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
    const target = document.getElementById('moments')
    video.current?.pause()
    if (lenis && target) lenis.scrollTo(target, { duration: 1.4 })
    else target?.scrollIntoView({ behavior: 'smooth' })
  }

  const playing = !userPaused && !ended && (visible || false) && !reduced
  const btn = 'inline-flex size-11 items-center justify-center rounded-full bg-bg/70 text-text backdrop-blur transition-colors hover:bg-bg/90'

  return (
    <section ref={root} id="deals" aria-labelledby="deals-title" className="relative overflow-hidden bg-bg px-6 py-24 lg:px-[120px] lg:py-[130px]">
      <div aria-hidden className="pointer-events-none absolute -left-[200px] top-[300px] size-[700px] rounded-full bg-glow-1/25 blur-[120px] max-md:hidden" />
      <div className="relative mx-auto w-full max-w-[1200px]">
        <h2 id="deals-title" className="text-[clamp(40px,5vw,72px)] font-extrabold leading-[1.04] tracking-[-0.02em] text-text">
          <Words lines={deals.title} />
        </h2>
        <p className="mt-5 max-w-[520px] text-[clamp(17px,1.5vw,22px)] leading-[1.5] text-muted">{deals.line}</p>

        <div ref={stage} className="relative mt-10 will-change-transform lg:mt-14">
          <div className="relative aspect-video w-full overflow-hidden rounded-[20px] bg-black shadow-[0_40px_90px_-30px_rgba(10,14,70,0.9)] ring-1 ring-white/10 lg:rounded-[28px]">
            <img src={POSTER} alt="Jordan walks out of an office building at dusk, checking his watch." loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            {!broken && (
              <video
                ref={video}
                className="absolute inset-0 h-full w-full object-cover"
                playsInline
                preload="metadata"
                poster={POSTER}
                src={near ? VIDEO : undefined}
                onError={() => setBroken(true)}
                onEnded={() => setEnded(true)}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget
                  if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`
                }}
                aria-label="Video: Jordan's story, 19 seconds, with sound. The words are on screen; the full text is below."
              />
            )}

            {/* Controls on top: sound, pause / replay, skip */}
            {!broken && (
              <div className="absolute inset-x-0 top-0 flex items-center justify-end gap-2 bg-gradient-to-b from-black/55 to-transparent p-3 lg:p-4">
                {soundBlocked && (
                  <span className="mr-1 hidden rounded-full bg-bg/70 px-3 py-2 text-[13px] text-text backdrop-blur sm:inline">Sound is off · tap to turn it on</span>
                )}
                <button onClick={toggleMute} aria-label={muted ? 'Turn sound on' : 'Mute'} aria-pressed={muted} className={btn}>
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button onClick={togglePlay} aria-label={ended ? 'Replay' : playing ? 'Pause' : 'Play'} className={btn}>
                  {ended ? <RotateCcw size={18} /> : playing ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button onClick={skip} aria-label="Skip the film and go to How it works" className={btn + ' w-auto gap-1.5 px-4 text-[14px] font-medium'}>
                  Skip <ChevronsRight size={16} />
                </button>
              </div>
            )}

            {/* progress hairline */}
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
              <span ref={bar} className="block h-full origin-left bg-lavender-soft transition-transform duration-300 ease-linear" style={{ transform: 'scaleX(0)' }} />
            </span>
          </div>
          <p className="sr-only">{TRANSCRIPT}</p>
        </div>
      </div>
    </section>
  )
}
