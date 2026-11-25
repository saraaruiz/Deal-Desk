import { useEffect, useRef, useState } from 'react'
import { deals } from '@/content/copy'
import { FilmPlayer } from '@/components/FilmPlayer'
import { Words } from '@/components/Words'
import { gsap, ScrollTrigger, useStaticMotion } from '@/lib/motion'

// Jordan's story, final cut: 26.5 s, 16:9, with its sound design and music. See components/FilmPlayer.tsx for the player.
const SRC = '/assets/video/jordan.mp4'
const POSTER = '/assets/video1-poster.webp'
const TRANSCRIPT =
  "Several deals open. One more message to send. Who's on Harbor again? Pat, Alex… Sam? It looks ready. Is it? DealDesk already checked who's on the deal. Sam Lee isn't on this deal. Sam removed. Nothing leaves until you tap Send. Ready. Sent. Nothing else to remember. A second pair of eyes. Prototype, fictional data, AI-generated character."
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

const player = {
  src: SRC,
  poster: POSTER,
  posterAlt: 'Jordan walks out of an office building at dusk, checking his watch.',
  label: "Video: Jordan's story, 26 seconds, with sound. The words are on screen; the full text is below.",
  transcript: TRANSCRIPT,
  skipTo: 'moments',
  skipLabel: 'Skip the film and go to How it works',
}

export function DealsOneSend() {
  const root = useRef<HTMLElement>(null)
  const staticMode = useStaticMotion()
  const [play, setPlay] = useState(false)

  useEffect(() => {
    if (staticMode) return
    const el = root.current!
    const ctx = gsap.context(() => {
      const frame = el.querySelector<HTMLElement>('[data-zoom]')!
      const head = el.querySelector<HTMLElement>('[data-head]')!
      const veil = el.querySelector<HTMLElement>('[data-veil]')!

      /*
       * MOTION · scroll · PINNED 100vh (+320%) · ZOOM TO FULL SCREEN, then FADE OUT.
       *   0 -> 26%   the film, a framed window under the title, zooms in: scale s0 -> 1 and slides to the centre (y y0 -> 0),
       *              corner radius 28px -> 0, until it fills the whole screen; the title rises and fades (y -60, opacity 1 -> 0)
       *   22% -> 97% the film plays by itself WITH sound (it waits until the picture is big enough)
       *   88% -> 100% a veil in the page colour fades in over the picture (opacity 0 -> 1) while the sound fades with it (volume 1 -> 0),
       *              so the next section begins from a soft dissolve instead of a hard cut
       *   scrub 0.5, ease none · reduced motion / data saver: no pin, the film sits in a normal frame.
       */
      const vw = window.innerWidth
      const vh = window.innerHeight
      const portrait = vw < vh
      // size of the starting window: as large as fits under the title
      const headBottom = head.getBoundingClientRect().bottom - el.getBoundingClientRect().top
      const s0 = portrait ? 0.88 : Math.min(0.66, Math.max(0.4, (vh - headBottom - 56) / vh))
      const boxH = portrait ? (vw * 9) / 16 * s0 : s0 * vh
      const y0 = portrait ? headBottom + 24 + boxH / 2 - vh / 2 : headBottom + 24 + boxH / 2 - vh / 2
      gsap.set(frame, { scale: s0, y: y0, borderRadius: 28 / s0, transformOrigin: '50% 50%' })

      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      tl.to(frame, { scale: 1, y: 0, borderRadius: 0, duration: 0.26 }, 0)
        .to(head, { opacity: 0, y: -60, duration: 0.18 }, 0.02)
        .to(veil, { opacity: 1, duration: 0.12 }, 0.88)
      ScrollTrigger.create({
        animation: tl,
        trigger: el,
        start: 'top top',
        end: '+=320%',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          const next = p > 0.22 && p < 0.97
          setPlay((prev) => (prev === next ? prev : next))
          const v = el.querySelector<HTMLVideoElement>('video')
          if (v) v.volume = 1 - clamp01((p - 0.88) / 0.12)
        },
      })
    }, el)
    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [staticMode])

  const header = (
    <div data-head className="pointer-events-none relative z-20 mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-6 pt-20 lg:flex-row lg:items-end lg:justify-between lg:px-0 lg:pt-24">
      <h2 id="deals-title" className="h-display text-text">
        <Words lines={deals.title} gradientLast />
      </h2>
      <p className="h-lede max-w-[440px] text-muted lg:pb-2">{deals.line}</p>
    </div>
  )

  if (staticMode) {
    return (
      <section id="deals" aria-labelledby="deals-title" className="relative overflow-hidden bg-bg px-6 py-24 lg:px-[120px] lg:py-[130px]">
        <div className="relative mx-auto w-full max-w-[1200px]">
          <h2 id="deals-title" className="h-display text-text">
            <Words lines={deals.title} gradientLast />
          </h2>
          <p className="mt-5 max-w-[520px] text-[clamp(17px,1.5vw,22px)] leading-[1.5] text-muted">{deals.line}</p>
          <FilmPlayer className="mt-10 lg:mt-14" {...player} />
        </div>
      </section>
    )
  }

  return (
    <section ref={root} id="deals" aria-labelledby="deals-title" className="relative h-[100svh] overflow-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute -left-[200px] top-[300px] size-[700px] rounded-full bg-glow-1/25 blur-[120px] max-md:hidden" />
      {header}
      {/* the film: a full-screen element that starts scaled down into a window under the title and zooms to fill the screen */}
      <div data-zoom className="absolute inset-0 z-10 overflow-hidden will-change-transform">
        <FilmPlayer fullBleed playWhen={play} className="portrait:absolute portrait:inset-x-0 portrait:top-1/2 portrait:-translate-y-1/2" {...player} />
      </div>
      {/* dissolve into the next section */}
      <div data-veil aria-hidden className="pointer-events-none absolute inset-0 z-30 bg-bg opacity-0" />
    </section>
  )
}
