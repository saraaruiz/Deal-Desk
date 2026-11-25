import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import { inside } from '@/content/copy'
import { Chip } from '@/components/bits'
import { GlassCard } from '@/components/GlassCard'
import { PhoneFrame } from '@/components/PhoneFrame'
import { Words } from '@/components/Words'
import { Avatar } from '@/lib/avatars'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

const depth = (d: number) => ({ ['--d' as string]: d }) as React.CSSProperties

function Card({ className, children, label }: { className?: string; children: React.ReactNode; label?: string }) {
  return (
    <GlassCard as="article" data-card label={label} tilt={3} className={cn('group p-7 lg:p-8', className)}>
      {children}
    </GlassCard>
  )
}

export function Inside() {
  const root = useRef<HTMLElement>(null)
  const c = inside.cards

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll into view · the 6 cards reveal staggered (y 60 -> 0, opacity 0 -> 1) · 1.1s expo.out, stagger 0.09 ·
       *   plays once · reduced-motion: none.
       * MOTION · scroll (desktop) · the big phone drifts up slower than the page (y 40 -> -50px), scrubbed (ease none) ·
       *   reduced-motion: none.
       */
      gsap.from('[data-card]', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: '[data-grid]', start: 'top 82%', once: true } })
      gsap.fromTo('[data-big-phone]', { y: 40 }, { y: -50, ease: 'none', scrollTrigger: { trigger: '[data-grid]', start: 'top 80%', end: 'bottom 20%', scrub: 0.8 } })
      ScrollTrigger.refresh()
    }, root.current!)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="inside" aria-labelledby="inside-title" className="relative overflow-hidden bg-bg py-24 lg:py-[130px]">
      <div aria-hidden className="drift pointer-events-none absolute -left-40 top-[28%] size-[520px] rounded-full bg-glow-3/20 blur-[130px] max-md:hidden" />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-[120px]">
        <h2 id="inside-title" className="text-[clamp(40px,5vw,72px)] font-extrabold leading-[1.04] tracking-[-0.02em]">
          <Words lines={[inside.title]} />
        </h2>

        <div data-grid className="mt-14 grid gap-4 lg:grid-cols-12 lg:gap-6">
          {/* What to fix: big card, the phone plays the real Review recording and breaks out of the card at the top */}
          <Card label="What to fix" className="min-h-[520px] lg:col-span-7 lg:row-span-2 lg:min-h-[700px]">
            <div className="depth max-w-[230px] xl:max-w-[300px]" style={depth(0.6)}>
              <p className="text-[13px] font-semibold tracking-[0.08em] text-lavender-soft">WHAT TO FIX</p>
              <h3 className="mt-4 text-[clamp(24px,2.2vw,34px)] font-semibold leading-[1.15] text-text">{c.fix.title}</h3>
              <p className="mt-4 text-[17px] leading-[1.55] text-muted">{c.fix.line}</p>
            </div>
            <div
              data-big-phone
              className="mt-10 w-[min(280px,70%)] lg:absolute lg:-top-10 lg:right-8 lg:mt-0 lg:w-[270px] xl:right-10 xl:w-[330px]"
              style={{ filter: 'drop-shadow(0 40px 60px rgba(8,12,60,.7))' }}
            >
              <PhoneFrame
                src="/assets/screens/G9.webp"
                video="/assets/video/moment-review.mp4"
                alt="What to fix: two items, each listed next to the recipient or the words it concerns."
              />
            </div>
          </Card>

          <Card label="Recipients" className="lg:col-span-5">
            <h3 className="depth text-[24px] font-semibold text-text" style={depth(0.5)}>
              {c.recipients.title}
            </h3>
            <p className="mt-2 text-[17px] text-muted">{c.recipients.line}</p>
            <div className="mt-7 flex items-center gap-4" aria-label="Pat Morgan and Alex Rivera are on the deal team; Sam Lee is not">
              <div className="flex">
                <Avatar name="pat" size={60} ring="#12151c" className="relative z-[3]" />
                <Avatar name="alex" size={60} ring="#12151c" className="relative z-[2] -ml-4" />
                <Avatar name="sam" size={60} ring="#12151c" dashed className="relative z-[1] -ml-4" />
              </div>
              <ul className="space-y-1 text-[14px] text-muted">
                <li className="flex items-center gap-2"><Check size={14} className="text-[#58d6a0]" /> Pat Morgan</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#58d6a0]" /> Alex Rivera</li>
                <li className="flex items-center gap-2"><span aria-hidden className="size-[14px] rounded-full border border-dashed border-lavender-soft" /> Sam Lee</li>
              </ul>
            </div>
          </Card>

          <Card label="Wording" className="lg:col-span-5">
            <h3 className="depth text-[24px] font-semibold text-text" style={depth(0.5)}>
              {c.wording.title}
            </h3>
            <p className="mt-5 text-[clamp(20px,1.7vw,24px)] font-medium leading-[1.35] text-text">{c.wording.quote}</p>
            <span aria-hidden className="mt-4 block h-[3px] w-[62%] origin-left rounded bg-lavender-soft transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-[1.35]" />
            <p className="mt-4 text-[16px] text-muted">{c.wording.line}</p>
          </Card>

          <Card label="Ask the deal owner" className="lg:col-span-4">
            <Chip>{c.ask.state}</Chip>
            <h3 className="mt-6 text-[24px] font-semibold text-text">{c.ask.title}</h3>
            <p className="mt-2 text-[17px] text-muted">{c.ask.line}</p>
            <div className="mt-6 flex items-center gap-3">
              <Avatar name="dana" size={40} />
              <span className="text-[14px] text-muted">Dana · deal owner</span>
            </div>
          </Card>

          <Card label="After an edit" className="lg:col-span-4">
            <Chip tone="muted">↻ {c.edit.state}</Chip>
            <h3 className="mt-6 text-[24px] font-semibold text-text">{c.edit.title}</h3>
            <p className="mt-2 text-[17px] text-muted">{c.edit.line}</p>
          </Card>

          <Card label="A short record" className="lg:col-span-4">
            <Chip>✓ READY</Chip>
            <h3 className="mt-6 text-[24px] font-semibold text-text">{c.record.title}</h3>
            <p className="mt-2 text-[17px] text-muted">{c.record.line}</p>
            <div className="mt-5 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/[0.07]">
              <p className="text-[15px] font-medium text-text">{c.record.version}</p>
              <p className="mt-1 text-[14px] text-muted">{c.record.to}</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
