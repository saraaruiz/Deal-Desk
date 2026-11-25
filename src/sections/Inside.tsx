import { useEffect, useRef } from 'react'
import { inside } from '@/content/copy'
import { Chip, Initials } from '@/components/bits'
import { GlassCard } from '@/components/GlassCard'
import { PhoneFrame } from '@/components/PhoneFrame'
import { Words } from '@/components/Words'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

const depth = (d: number) => ({ ['--d' as string]: d }) as React.CSSProperties

function Card({ className, children, label }: { className?: string; children: React.ReactNode; label?: string }) {
  return (
    <GlassCard as="article" data-card label={label} className={cn('group p-7', className)}>
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
       * MOTION · scroll into view · the 6 glass cards reveal staggered (y 60 -> 0, opacity 0 -> 1, rotationX 8 -> 0) ·
       *   1s expo.out, stagger 0.09 · plays once · reduced-motion: none.
       */
      gsap.from('[data-card]', {
        y: 60,
        opacity: 0,
        rotationX: 8,
        transformPerspective: 900,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: '[data-grid]', start: 'top 82%', once: true },
      })
    }, root.current!)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="inside" aria-labelledby="inside-title" className="relative overflow-hidden bg-bg py-20 lg:py-[110px]">
      {/* ambient orbs give the glass something to refract */}
      <div aria-hidden className="drift pointer-events-none absolute -left-40 top-[28%] size-[520px] rounded-full bg-glow-3/30 blur-[120px] max-md:hidden" />
      <div aria-hidden className="drift pointer-events-none absolute -right-32 top-[55%] size-[460px] rounded-full bg-[#6941E1]/25 blur-[120px] max-md:hidden [animation-delay:-9s]" />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-[120px]">
        <h2 id="inside-title" className="text-[clamp(40px,5vw,72px)] font-extrabold leading-[1.04] tracking-[-0.02em]">
          <Words lines={[inside.title]} />
        </h2>

        <div data-grid className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* What to fix */}
          <Card label="What to fix" className="min-h-[420px] sm:col-span-2 lg:row-span-2 lg:min-h-[640px]">
            <div className="flex h-full flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="depth max-w-[300px]" style={depth(0.6)}>
                <p className="text-[13px] font-semibold tracking-[0.06em] text-lavender-soft">WHAT TO FIX</p>
                <h3 className="mt-3 text-[28px] font-semibold leading-[1.2] text-text">{c.fix.title}</h3>
                <p className="mt-3 text-[17px] leading-[1.5] text-muted">{c.fix.line}</p>
              </div>
              <div className="depth mx-auto w-[min(260px,60%)] lg:-mb-[80px] lg:mr-2 lg:w-[283px]" style={depth(1.8)}>
                <PhoneFrame src="/assets/screens/G9.webp" alt="What to fix: two items, each listed next to the recipient or the words it concerns." />
              </div>
            </div>
          </Card>

          <Card label="Recipients">
            <h3 className="depth text-[22px] font-semibold text-text" style={depth(0.5)}>{c.recipients.title}</h3>
            <p className="mt-2 text-[17px] text-muted">{c.recipients.line}</p>
            <div className="depth mt-6 flex -space-x-3 transition-[gap] group-hover:-space-x-1" style={depth(1.4)} aria-label="PM, AR and SL">
              <Initials>PM</Initials>
              <Initials>AR</Initials>
              <Initials tone="lav" dashed>
                SL
              </Initials>
            </div>
          </Card>

          <Card label="Wording">
            <h3 className="depth text-[22px] font-semibold text-text" style={depth(0.5)}>{c.wording.title}</h3>
            <p className="depth mt-4 text-[19px] font-medium leading-[1.4] text-text" style={depth(1.2)}>{c.wording.quote}</p>
            <span aria-hidden className="mt-3 block h-[3px] w-[70%] origin-left rounded bg-lavender-soft transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-[1.3]" />
            <p className="mt-3 text-[15px] text-muted">{c.wording.line}</p>
          </Card>

          <Card label="Ask the deal owner">
            <div className="depth" style={depth(1.2)}><Chip>{c.ask.state}</Chip></div>
            <h3 className="mt-5 text-[22px] font-semibold text-text">{c.ask.title}</h3>
            <p className="mt-2 text-[17px] text-muted">{c.ask.line}</p>
          </Card>

          <Card label="After an edit">
            <div className="depth" style={depth(1.2)}><Chip tone="muted">↻ {c.edit.state}</Chip></div>
            <h3 className="mt-5 text-[22px] font-semibold text-text">{c.edit.title}</h3>
            <p className="mt-2 text-[17px] text-muted">{c.edit.line}</p>
          </Card>

          <Card label="A short record" className="sm:col-span-2 lg:col-span-4">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="text-[22px] font-semibold text-text">{c.record.title}</h3>
                <p className="mt-2 text-[17px] text-muted">{c.record.line}</p>
              </div>
              <div className="depth rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur" style={depth(1.2)}>
                <Chip>✓ READY</Chip>
                <p className="mt-3 text-[15px] font-medium text-text">{c.record.version}</p>
                <p className="mt-1 text-[14px] text-muted">{c.record.to}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
