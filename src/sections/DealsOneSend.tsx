import { useEffect, useRef, useState } from 'react'
import { gsap, useStaticMotion } from '@/lib/motion'
import { deals } from '@/content/copy'
import { FilmPlayer } from '@/components/FilmPlayer'
import { Words } from '@/components/Words'

// Jordan's story, final cut: 26.5 s, 16:9, with its sound design and music. See components/FilmPlayer.tsx for the player.
const SRC = '/assets/video/jordan.mp4'
const POSTER = '/assets/video1-poster.webp'
const TRANSCRIPT =
  "Several deals open. One more message to send. Who's on Harbor again? Pat, Alex… Sam? It looks ready. Is it? DealDesk already checked who's on the deal. Sam Lee isn't on this deal. Sam removed. Nothing leaves until you tap Send. Ready. Sent. Nothing else to remember. A second pair of eyes. Prototype, fictional data, AI-generated character."

const player = {
  src: SRC,
  poster: POSTER,
  posterAlt: 'Jordan walks out of an office building at dusk, checking his watch.',
  label: "Video: Jordan's story, 26 seconds, with sound. The words are on screen; the full text is below.",
  transcript: TRANSCRIPT,
  skipTo: 'moments',
  skipLabel: 'Skip the film and go to How it works',
}

/*
 * MOTION · scroll · the section HOLDS the screen (CSS sticky, 220svh tall) while the film comes forward:
 *   0 -> 55%  the film grows from a window under the title to its full size and slides to the centre (scale s0 -> 1, y y0 -> 0)
 *   0 -> 40%  the animated title rises and fades away (y 0 -> -80, opacity 1 -> 0)
 *   0 -> 100% the soft blurred backdrop drifts the other way (y -70 -> 70, parallax)
 *   Scrolling on past the section turns the playing film into the corner mini player.
 *   Sticky + CSS variables (no transform on any parent), so the fixed mini player is never trapped · scrubbed 0.4 · reduced-motion: none.
 */
export function DealsOneSend() {
  const root = useRef<HTMLElement>(null)
  const staticMode = useStaticMotion()
  const [docked, setDocked] = useState(false)

  useEffect(() => {
    if (staticMode) return
    const el = root.current!
    const ctx = gsap.context(() => {
      const head = el.querySelector<HTMLElement>('[data-head]')!
      const box = el.querySelector<HTMLElement>('[data-film]')!
      const start = () => {
        const vh = window.innerHeight
        const headBottom = head.offsetTop + head.offsetHeight
        const h = box.offsetHeight
        const s0 = Math.min(0.86, Math.max(0.5, (vh - headBottom - 40) / h))
        const y0 = Math.max(0, headBottom + 20 + (h * s0) / 2 - vh / 2)
        return { s0: window.innerWidth < 640 ? 0.9 : s0, y0 }
      }
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.4, invalidateOnRefresh: true } })
      tl.fromTo(el, { '--film-scale': () => start().s0, '--film-y': () => start().y0 + 'px' }, { '--film-scale': 1, '--film-y': '0px', duration: 0.55 }, 0)
        .fromTo(head, { y: 0, opacity: 1 }, { y: -80, opacity: 0, duration: 0.3, immediateRender: false }, 0.1)
        .fromTo('[data-backdrop]', { y: -70 }, { y: 70, duration: 1 }, 0)
    }, el)
    return () => ctx.revert()
  }, [staticMode])

  return (
    <section ref={root} id="deals" aria-labelledby="deals-title" className={`relative bg-bg ${staticMode ? 'py-16' : 'h-[220svh]'}`} style={docked ? { zIndex: 105 } : undefined}>
      <div className={staticMode ? 'relative overflow-hidden' : 'sticky top-0 h-[100svh] overflow-hidden'}>
        <div aria-hidden className="film-stage">
          <div data-backdrop className="absolute -inset-y-[90px] inset-x-0">
            <img src={POSTER} alt="" loading="lazy" decoding="async" />
          </div>
        </div>

        <div data-head className={`pointer-events-none z-20 mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-6 lg:flex-row lg:items-end lg:justify-between lg:px-0 ${staticMode ? 'relative' : 'absolute inset-x-0 top-0 pt-20 lg:pt-24'}`}>
          <h2 id="deals-title" className="h-display text-text">
            <Words lines={deals.title} gradientLast />
          </h2>
          <p className="h-lede max-w-[440px] text-muted lg:pb-2">{deals.line}</p>
        </div>

        <div className={staticMode ? 'relative mt-8 sm:px-6' : 'relative flex h-full items-center justify-center sm:px-6'}>
          <div data-film className="relative w-full sm:max-w-[min(1280px,150svh)]">
            <FilmPlayer dock wide onDock={setDocked} {...player} />
          </div>
        </div>
      </div>
    </section>
  )
}
