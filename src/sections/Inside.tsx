import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import { inside } from '@/content/copy'
import { Chip } from '@/components/bits'
import { CoverflowCarousel, type CoverflowSlide } from '@/components/ui/coverflow-carousel'
import { Words } from '@/components/Words'
import { Avatar } from '@/lib/avatars'
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
      style={{ background: `linear-gradient(160deg, ${tint} 0%, #12151c 62%)`, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.09)' }}
    >
      <span aria-hidden className="text-[13px] font-semibold tracking-[0.14em] text-white/45">
        {n} / 06
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
        {/* the real "What to fix" screen, rising from the bottom of the card */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[44%] w-[72%] overflow-hidden rounded-t-[22px] ring-1 ring-white/15">
          <img src="/assets/screens/G9.webp" alt="" loading="lazy" decoding="async" draggable={false} className="w-full object-cover object-top" />
        </div>
      </Face>
    ),
  },
  {
    label: 'Recipients',
    content: (
      <Face n="02" tint="#2a1d6e">
        <h3 className={title + ' !mt-6'}>{c.recipients.title}</h3>
        <p className={line}>{c.recipients.line}</p>
        <div className="mt-auto" aria-label="Pat Morgan and Alex Rivera are on the deal team; Sam Lee is not">
          <div className="flex">
            <Avatar name="pat" size={64} ring="#1a1740" className="relative z-[3]" />
            <Avatar name="alex" size={64} ring="#1a1740" className="relative z-[2] -ml-4" />
            <Avatar name="sam" size={64} ring="#1a1740" dashed className="relative z-[1] -ml-4" />
          </div>
          <ul className="mt-5 space-y-1.5 text-[14px] text-muted">
            <li className="flex items-center gap-2"><Check size={15} className="text-[#58d6a0]" /> Pat Morgan</li>
            <li className="flex items-center gap-2"><Check size={15} className="text-[#58d6a0]" /> Alex Rivera</li>
            <li className="flex items-center gap-2"><span aria-hidden className="size-[15px] rounded-full border border-dashed border-lavender-soft" /> Sam Lee</li>
          </ul>
        </div>
      </Face>
    ),
  },
  {
    label: 'Wording',
    content: (
      <Face n="03" tint="#15185a">
        <h3 className={title + ' !mt-6'}>{c.wording.title}</h3>
        <p className="mt-6 text-[clamp(21px,2vw,27px)] font-medium leading-[1.3] text-text">{c.wording.quote}</p>
        <span aria-hidden className="mt-4 block h-[3px] w-[62%] rounded bg-lavender-soft" />
        <p className={line + ' mt-auto'}>{c.wording.line}</p>
      </Face>
    ),
  },
  {
    label: 'Ask the deal owner',
    content: (
      <Face n="04" tint="#26145f">
        <div className="mt-5"><Chip>{c.ask.state}</Chip></div>
        <h3 className={title + ' !mt-5'}>{c.ask.title}</h3>
        <p className={line}>{c.ask.line}</p>
        <div className="mt-auto flex items-center gap-4">
          <Avatar name="dana" size={72} ring="#1a1740" />
          <span className="text-[15px] text-muted">Dana<br />deal owner</span>
        </div>
      </Face>
    ),
  },
  {
    label: 'After an edit',
    content: (
      <Face n="05" tint="#19206a">
        <div className="mt-5"><Chip tone="muted">↻ {c.edit.state}</Chip></div>
        <h3 className={title + ' !mt-5'}>{c.edit.title}</h3>
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
      <Face n="06" tint="#1f1a52">
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
      gsap.from('[data-stage]', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '[data-stage]', start: 'top 85%', once: true } })
    }, root.current!)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="inside" aria-labelledby="inside-title" className="relative overflow-hidden bg-bg py-24 lg:py-[130px]">
      <div aria-hidden className="drift pointer-events-none absolute left-1/2 top-[40%] size-[620px] -translate-x-1/2 rounded-full bg-glow-3/15 blur-[130px] max-md:hidden" />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-[120px]">
        <h2 id="inside-title" className="text-[clamp(40px,5vw,72px)] font-extrabold leading-[1.04] tracking-[-0.02em]">
          <Words lines={[inside.title]} />
        </h2>
        <p className="mt-5 max-w-[520px] text-[clamp(17px,1.5vw,20px)] text-muted">Drag, or use the arrows, to move through a review.</p>
      </div>

      <div data-stage className="relative mt-6 lg:mt-10">
        <CoverflowCarousel
          slides={slides}
          label="Inside every review"
          aspect={0.8}
          cardWidth="clamp(250px, 30vw, 380px)"
          rotate={40}
          depth={0.55}
          perspective={3.2}
          fade={0.14}
          gap={0.06}
          showNavigation
          showPagination
          cardClassName="!rounded-[26px] shadow-[0_40px_70px_-30px_rgba(0,0,0,0.85)]"
        />
      </div>
    </section>
  )
}
