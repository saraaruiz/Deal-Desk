import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2, X } from 'lucide-react'
import { deals } from '@/content/copy'
import { gsap, ScrollTrigger, isDesktopMotion, useLiteMode } from '@/lib/motion'

// Jordan's story (19 s, 16:9). Two encodes of the same film:
//  - scrub: no audio, a keyframe every 4 frames, so scrolling can "drag" it smoothly (desktop) or loop it muted (mobile)
//  - sound: normal encode with its sound design and music, opened on demand in a dialog
const VIDEO_SCRUB = '/assets/video/jordan-scrub.mp4'
const VIDEO_SOUND = '/assets/video/jordan.mp4'
const POSTER = '/assets/video1-poster.webp'
// The captions are burned into the film, so the page carries the same words as a text transcript for screen readers.
const TRANSCRIPT =
  "Several deals open. One more message to send. Who's on Harbor again? Pat, Alex… It looks ready. Is it? DealDesk already checked who's on the deal. Sam removed. Nothing leaves until you tap Send. Sent. Nothing to remember. A second pair of eyes. Prototype, fictional data, AI-generated character."

export function DealsOneSend() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const soundVideo = useRef<HTMLVideoElement>(null)
  const [missing, setMissing] = useState(false) // video file not there -> poster-only fallback
  const [paused, setPaused] = useState(false)
  const [soundOpen, setSoundOpen] = useState(false)
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
       * MOTION · scroll · PINNED 100vh section (+400% scroll). The film is SCRUBBED: video.currentTime = progress × duration (19 s),
       *   so the story advances exactly as fast as the person scrolls. Title scales 1 -> .62 and moves up (y -70) while the video box
       *   scales 1 -> 1.08 and the intro line fades · a hairline progress bar fills along the bottom of the frame ·
       *   scrub: ease none, smoothing 0.4 · desktop/fine pointer only · reduced-motion + mobile: NO scrub (muted loop instead).
       */
      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      tl.to('[data-title]', { scale: 0.62, y: -70, transformOrigin: 'left top', duration: 0.2 }, 0)
        .to('[data-human]', { opacity: 0, y: -30, duration: 0.15 }, 0)
        .to('[data-stage]', { scale: 1.08, y: -40, duration: 0.25 }, 0)
      ScrollTrigger.create({
        animation: tl,
        trigger: el,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 0.4,
        anticipatePin: 1,
        onUpdate: (self) => {
          const v = video.current
          if (v && v.duration && Number.isFinite(v.duration)) {
            const t = Math.min(v.duration - 0.05, self.progress * v.duration)
            if (Math.abs(v.currentTime - t) > 0.03) v.currentTime = t
          }
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
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

  const openSound = () => {
    video.current?.pause()
    setSoundOpen(true) // attaches the audio file only now; the effect below starts it once the src is in place
    dialog.current?.showModal()
  }
  useEffect(() => {
    if (soundOpen) void soundVideo.current?.play().catch(() => {})
  }, [soundOpen])
  const closeSound = () => {
    soundVideo.current?.pause()
    dialog.current?.close()
    setSoundOpen(false)
    if (lite && !paused) void video.current?.play().catch(() => {})
  }

  return (
    <section
      ref={root}
      id="deals"
      aria-labelledby="deals-title"
      className="relative overflow-hidden bg-bg px-6 py-20 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:px-[120px] lg:py-0"
    >
      <div aria-hidden className="pointer-events-none absolute -left-[200px] top-[300px] size-[700px] rounded-full bg-glow-1/25 blur-[120px] max-md:hidden" />
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
          <div className="relative aspect-video w-full overflow-hidden rounded-[20px] bg-black shadow-[0_40px_90px_-30px_rgba(10,14,70,0.9)] ring-1 ring-white/10 lg:rounded-[28px]">
            {/* poster is always underneath, so a missing/slow video never leaves a hole */}
            <img
              src={POSTER}
              alt="Jordan walks out of an office building at dusk, checking his watch."
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {!missing && (
              <video
                ref={video}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
                preload={lite ? 'none' : 'auto'}
                poster={POSTER}
                // Mobile / reduced motion: muted loop that autoplays (tap to pause). Desktop: scrubbed, never plays.
                autoPlay={lite}
                loop={lite}
                aria-label="Video: Jordan's story, 19 seconds. The words are on screen; the full text is below."
              >
                <source src={VIDEO_SCRUB} type="video/mp4" />
              </video>
            )}

            {/* scrub progress hairline (desktop) */}
            {!lite && (
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
                <span ref={bar} className="block h-full origin-left bg-lavender-soft" style={{ transform: 'scaleX(0)' }} />
              </span>
            )}

            <div className="absolute right-3 top-3 flex gap-2">
              {lite && !missing && (
                <button
                  onClick={toggle}
                  aria-label={paused ? 'Play video' : 'Pause video'}
                  className="inline-flex size-11 items-center justify-center rounded-full bg-bg/70 text-text backdrop-blur"
                >
                  {paused ? <Play size={18} /> : <Pause size={18} />}
                </button>
              )}
              {!missing && (
                <button
                  onClick={openSound}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-bg/70 px-4 text-[14px] font-medium text-text backdrop-blur transition-colors hover:bg-bg/90"
                >
                  <Volume2 size={16} /> Watch with sound
                </button>
              )}
            </div>
          </div>

          {/* The film has its captions burned in: same words, as text, for screen readers */}
          <p className="sr-only">{TRANSCRIPT}</p>
        </div>
      </div>

      {/* Full film with sound, opened on demand (native dialog: Esc closes, focus is trapped) */}
      <dialog
        ref={dialog}
        onClose={() => {
          soundVideo.current?.pause()
          setSoundOpen(false)
        }}
        className="m-auto w-[min(1100px,94vw)] rounded-[24px] bg-black p-0 text-text backdrop:bg-black/80"
        aria-label="Jordan's story, with sound"
      >
        <div className="relative aspect-video">
          <video ref={soundVideo} className="h-full w-full" controls playsInline poster={POSTER} src={soundOpen ? VIDEO_SOUND : undefined} />
          <button
            onClick={closeSound}
            aria-label="Close video"
            className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-full bg-bg/70 text-text backdrop-blur"
          >
            <X size={18} />
          </button>
        </div>
      </dialog>
    </section>
  )
}
