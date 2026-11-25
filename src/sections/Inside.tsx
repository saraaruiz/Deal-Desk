import { useEffect, useRef, useState } from 'react'
import { inside } from '@/content/copy'
import { Chip } from '@/components/bits'
import { CoverflowCarousel, type CoverflowSlide } from '@/components/ui/coverflow-carousel'
import { Words } from '@/components/Words'
import { gsap, prefersReducedMotion } from '@/lib/motion'

const c = inside.cards

/**
 * One review card: a SOLID dark surface (no blur, no translucency) with a deep gradient from the DealDesk palette,
 * a hairline border and a big index number. The content is the Figma copy for "Inside every review".
 */
function Face({ n, tint, children }: { n: string; tint: string; children: React.ReactNode }) {
  return (
    <div
      className="relative flex h-full w-full flex-col p-6 text-left sm:p-7"
      style={{ background: `linear-gradient(160deg, ${tint}cc 0%, rgba(18,21,28,0.28) 72%)`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5), inset 0 0 0 1px rgba(255,255,255,.14)' }}
    >
      <span aria-hidden className="text-[13px] font-semibold tracking-[0.14em] text-white/45">
        {n} / 04
      </span>
      {children}
    </div>
  )
}

const title = 'mt-3 text-[clamp(22px,2vw,28px)] font-semibold leading-[1.15] text-text'
const line = 'mt-3 text-[15px] leading-[1.5] text-muted sm:text-[16px]'

const slides: CoverflowSlide[] = [
  {
    label: 'What to fix',
    content: (
      <Face n="01" tint="#1d2275">
        <p className="mt-4 text-[12px] font-semibold tracking-[0.1em] text-lavender-soft">WHAT TO FIX</p>
        <h3 className={title}>{c.fix.title}</h3>
        <p className={line}>{c.fix.line}</p>
        {/* no mockup: just words and pills, as in the app ("2 things to fix") */}
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-lavender px-3.5 py-1.5 text-[13px] font-bold tracking-[0.04em] text-indigo">2 TO FIX</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-1.5 text-[13px] font-semibold text-text ring-1 ring-white/12">
            <span aria-hidden className="size-2 rounded-full bg-[#ff7a6b]" /> Recipient
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-1.5 text-[13px] font-semibold text-text ring-1 ring-white/12">
            <span aria-hidden className="size-2 rounded-full bg-[#F5C451]" /> Wording
          </span>
        </div>      </Face>
    ),
  },
  {
    label: 'Wording',
    content: (
      <Face n="02" tint="#15185a">
        <h3 className={title + ' !mt-6'}>{c.wording.title}</h3>
        <p className="mt-6 text-[clamp(21px,2vw,27px)] font-medium leading-[1.3] text-text">{c.wording.quote}</p>
        <span aria-hidden className="mt-4 block h-[3px] w-[62%] rounded bg-lavender-soft" />
        <p className={line + ' mt-auto'}>{c.wording.line}</p>
      </Face>
    ),
  },
  {
    label: 'After an edit',
    content: (
      <Face n="03" tint="#19206a">
        <h3 className={title + ' !mt-6'}>{c.edit.title}</h3>
        <p className={line}>{c.edit.line}</p>
        <div className="mt-auto flex items-center gap-3" aria-hidden>
          <Chip tone="muted">↻ OUTDATED</Chip>
          <span className="text-[26px] text-lavender">→</span>
          <Chip>✓ READY</Chip>
        </div>
      </Face>
    ),
  },
  {
    label: 'A short record',
    content: (
      <Face n="04" tint="#1f1a52">
        <div className="mt-5"><Chip>✓ READY</Chip></div>
        <h3 className={title + ' !mt-5'}>{c.record.title}</h3>
        <p className={line}>{c.record.line}</p>
        <div className="mt-auto rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
          <p className="text-[15px] font-medium text-text">{c.record.version}</p>
          <p className="mt-1 text-[14px] text-muted">{c.record.to}</p>
        </div>
      </Face>
    ),
  },
]

export function Inside() {
  const root = useRef<HTMLElement>(null)
  // phones get slightly taller, narrower cards so the text never feels cramped
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const on = () => setNarrow(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll into view · the carousel rises and fades in (y 60 -> 0, opacity 0 -> 1) · 1.1s expo.out · plays once ·
       *   reduced-motion: none.
       * MOTION · drag / arrow keys / buttons / dots · COVERFLOW: the centre card faces front, neighbours tilt back (rotateY up to 82 deg,
       *   translateZ recession, fading 10% per step); the ring loops. Exponential ease-out settle (factor 0.16 per frame),
       *   a flick carries up to 2 cards · reduced-motion: movement is still user-driven only (nothing autoplays).
       */
      /*
       * MOTION · scroll (whole section) · the coloured light orbs behind the glass drift in opposite directions (y ±90px, x ±40px) and the
       *   carousel floats against the page (y 40 -> -40px) · scrubbed, ease none · reduced-motion: none.
       */
      gsap.fromTo('[data-orb]', { y: (i) => (i % 2 ? 90 : -90), x: (i) => (i === 1 ? -40 : 40) }, { y: (i) => (i % 2 ? -90 : 90), x: (i) => (i === 1 ? 40 : -40), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo('[data-stage-inner]', { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.from('[data-stage]', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '[data-stage]', start: 'top 85%', once: true } })
    }, root.current!)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="inside" aria-labelledby="inside-title" className="relative overflow-hidden bg-bg py-24 lg:py-[130px]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span data-orb className="absolute left-[4%] top-[24%] size-[260px] rounded-full bg-[#6941E1]/60 blur-[70px] md:size-[440px] md:blur-[110px]" />
        <span data-orb className="absolute right-[3%] top-[36%] size-[280px] rounded-full bg-[#3A3FC0]/60 blur-[70px] md:size-[480px] md:blur-[120px]" />
        <span data-orb className="absolute bottom-[2%] left-[36%] size-[220px] rounded-full bg-[#B04BD8]/40 blur-[70px] md:size-[380px] md:blur-[110px]" />
      </div>
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-[120px]">
        <h2 id="inside-title" className="h-display">
          <Words lines={[inside.title]} gradientLines={[0]} />
        </h2>
        <p className="mt-5 max-w-[520px] text-[clamp(17px,1.5vw,20px)] text-muted">Drag, or use the arrows, to move through a review.</p>
      </div>

      <div data-stage className="relative mt-6 lg:mt-10">
        <div data-stage-inner>
        <CoverflowCarousel
          slides={slides}
          label="Inside every review"
          aspect={narrow ? 0.78 : 0.82}
          cardWidth={narrow ? 'clamp(240px, 68vw, 300px)' : 'clamp(250px, 30vw, 380px)'}
          rotate={40}
          depth={0.55}
          perspective={3.2}
          fade={0.14}
          gap={0.06}
          showNavigation
          cardClassName="!rounded-[26px] !bg-transparent backdrop-blur-[18px] backdrop-saturate-[1.7] shadow-[0_40px_70px_-30px_rgba(0,0,0,0.7)]"
        />
        </div>
      </div>
    </section>
  )
}
