import { useEffect, useRef, useState } from 'react'
import { deals } from '@/content/copy'
import { gsap, ScrollTrigger, isDesktopMotion, useLiteMode } from '@/lib/motion'
import { Pause, Play } from 'lucide-react'

const VIDEO = '/assets/video1-jordan.mp4'
const POSTER = '/assets/video1-poster.png' // placeholder from Figma (ASSET A3). Swap for /assets/video1-poster.jpg when it exists

export function DealsOneSend() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [missing, setMissing] = useState(false) // video file not there yet -> poster-only fallback
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const lite = useLiteMode()

  // Poster-only fallback: a <source> error does not bubble, so listen in the capture phase.
  useEffect(() => {
    const v = video.current
    if (!v) return
    const on = () => setMissing(true)
    v.addEventListener('error', on, true)
    return () => v.removeEventListener('error', on, true)
  }, [lite])

  useEffect(() => {
    if (lite || !isDesktopMotion()) return
    const el = root.current!
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll · PINNED 100vh section (+400% scroll). Video 1 is scrubbed: video.currentTime = progress × duration.
       *   Title scales 1 -> .62 and moves up (y -70) as the video box scales 1 -> 1.1 · six captions cross-fade in sync
       *   (opacity, 0.5s expo.out) · scrub: ease none, smoothing 0.4 · desktop/fine pointer only ·
       *   reduced-motion + mobile: NO scrub (see the loop version below).
       */
      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      tl.to('[data-title]', { scale: 0.62, y: -70, transformOrigin: 'left top', duration: 0.2 }, 0)
        .to('[data-human]', { opacity: 0, y: -30, duration: 0.15 }, 0)
        .to('[data-stage]', { scale: 1.1, y: -40, duration: 0.25 }, 0)
      ScrollTrigger.create({
        animation: tl,
        trigger: el,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 0.4,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          const v = video.current
          if (v && v.duration && Number.isFinite(v.duration)) v.currentTime = p * v.duration
          setActive(Math.min(deals.captions.length - 1, Math.floor(p * deals.captions.length)))
        },
      })
    }, el)
    return () => ctx.revert()
  }, [lite])

  const toggle = () => {
    const v = video.current
    if (!v) return
    if (v.paused) {
      void v.play()
      setPaused(false)
    } else {
      v.pause()
      setPaused(true)
    }
  }

  return (
    <section
      ref={root}
      id="deals"
      aria-labelledby="deals-title"
      className="relative overflow-hidden bg-bg px-6 py-20 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:px-[120px] lg:py-0"
    >
      <div aria-hidden className="pointer-events-none absolute -left-[200px] top-[300px] size-[700px] rounded-full bg-glow-1/30 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -top-[100px] right-0 size-[700px] rounded-full bg-glow-2/20 blur-[120px]" />
      <div className="relative mx-auto w-full max-w-[1200px]">
        <div data-title className="will-change-transform">
          <h2 id="deals-title" className="text-[clamp(40px,5vw,72px)] font-extrabold leading-[1.04] tracking-[-0.02em] text-text">
            {deals.title.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h2>
        </div>
        <p data-human className="mt-5 max-w-[520px] text-[clamp(17px,1.5vw,22px)] leading-[1.5] text-muted">
          {deals.line}
        </p>

        <div data-stage className="relative mt-10 will-change-transform lg:mt-12">
          <div className="relative aspect-video w-full overflow-hidden rounded-[24px] border border-white/10 bg-card lg:rounded-[36px]">
            {/* poster is always underneath, so a missing/slow video never leaves a hole */}
            <img src={POSTER} alt="Jordan, in the car, looks at a message on his phone before sending it." loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            {!missing && (
              <video
                ref={video}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
                preload={lite ? 'none' : 'metadata'}
                poster={POSTER}
                // Mobile / reduced motion: muted loop that autoplays (tap to pause). Desktop: scrubbed, never plays.
                autoPlay={lite}
                loop={lite}
                aria-label="Video: Jordan's story in six short shots. No audio."
              >
                <source src={VIDEO} type="video/mp4" />
              </video>
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />

            {/* Desktop captions: cross-fade in sync with the scrub */}
            <div className={lite ? 'hidden' : 'absolute inset-x-0 bottom-0 p-8'} aria-live="polite">
              {deals.captions.map((c, i) => (
                <p
                  key={c}
                  className="absolute inset-x-8 bottom-8 text-[clamp(22px,2.4vw,34px)] font-semibold tracking-[-0.01em] text-text transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
                  style={{ opacity: active === i ? 1 : 0, transform: `translateY(${active === i ? 0 : 12}px)` }}
                  aria-hidden={active !== i}
                >
                  {c}
                </p>
              ))}
            </div>

            {lite && !missing && (
              <button
                onClick={toggle}
                aria-label={paused ? 'Play video' : 'Pause video'}
                className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-full bg-bg/70 text-text backdrop-blur"
              >
                {paused ? <Play size={18} /> : <Pause size={18} />}
              </button>
            )}
          </div>

          {/* Mobile / reduced motion: captions stack under the video */}
          <ol className={lite ? 'mt-5 space-y-2' : 'hidden'}>
            {deals.captions.map((c) => (
              <li key={c} className="text-[17px] font-medium text-text/90">
                {c}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
