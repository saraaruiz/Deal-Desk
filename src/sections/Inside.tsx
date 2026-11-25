import { useEffect, useRef } from 'react'
import { inside } from '@/content/copy'
import { Chip, Initials } from '@/components/bits'
import { PhoneFrame } from '@/components/PhoneFrame'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * MOTION · pointer move over a card (fine pointer) · a soft lavender spotlight follows the cursor
 *   (radial gradient position via --mx/--my, opacity 0 -> 1 on hover, 0.5s cubic-bezier(.22,1,.36,1)) ·
 *   reduced-motion: spotlight is static (appears on hover, does not follow).
 */
function SpotCard({ className, children, label }: { className?: string; children: React.ReactNode; label?: string }) {
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <article
      data-card
      aria-label={label}
      onPointerMove={onMove}
      className={cn('glass group relative overflow-hidden rounded-[28px] p-7', className)}
      style={{ ['--mx' as string]: '50%', ['--my' as string]: '0%' }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:opacity-100"
        style={{ background: 'radial-gradient(380px circle at var(--mx) var(--my), rgba(155,140,255,.22), transparent 65%)' }}
      />
      <div className="relative h-full">{children}</div>
    </article>
  )
}

export function Inside() {
  const root = useRef<HTMLElement>(null)
  const c = inside.cards

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll into view · title rises, then the 6 cards reveal staggered (y 48 -> 0, opacity 0 -> 1) ·
       *   0.9s expo.out, stagger 0.09 · plays once · reduced-motion: none.
       */
      gsap.from('[data-title]', { y: 36, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
      gsap.from('[data-card]', { y: 48, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: '[data-grid]', start: 'top 80%', once: true } })
    }, root.current!)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="inside" aria-labelledby="inside-title" className="relative overflow-hidden bg-bg py-20 lg:py-[110px]">
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-[120px]">
        <h2 id="inside-title" data-title className="text-[clamp(40px,5vw,72px)] font-extrabold leading-[1.04] tracking-[-0.02em]">
          {inside.title}
        </h2>

        <div data-grid className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* What to fix */}
          <SpotCard label="What to fix" className="min-h-[420px] sm:col-span-2 lg:row-span-2 lg:min-h-[640px]">
            <div className="flex h-full flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-[300px]">
                <p className="text-[13px] font-semibold tracking-[0.06em] text-lavender-soft">WHAT TO FIX</p>
                <h3 className="mt-3 text-[28px] font-semibold leading-[1.2] text-text">{c.fix.title}</h3>
                <p className="mt-3 text-[17px] leading-[1.5] text-muted">{c.fix.line}</p>
              </div>
              <div className="mx-auto w-[min(260px,60%)] lg:-mb-[80px] lg:mr-2 lg:w-[283px]">
                <PhoneFrame src="/assets/screens/G9.png" alt="What to fix: two items, each listed next to the recipient or the words it concerns." />
              </div>
            </div>
          </SpotCard>

          <SpotCard label="Recipients">
            <h3 className="text-[22px] font-semibold text-text">{c.recipients.title}</h3>
            <p className="mt-2 text-[17px] text-muted">{c.recipients.line}</p>
            <div className="mt-6 flex -space-x-3" aria-label="PM, AR and SL">
              <Initials>PM</Initials>
              <Initials>AR</Initials>
              <Initials tone="lav" dashed>
                SL
              </Initials>
            </div>
          </SpotCard>

          <SpotCard label="Wording">
            <h3 className="text-[22px] font-semibold text-text">{c.wording.title}</h3>
            <p className="mt-4 text-[19px] font-medium leading-[1.4] text-text">{c.wording.quote}</p>
            <span aria-hidden className="mt-3 block h-[3px] w-[70%] rounded bg-lavender-soft" />
            <p className="mt-3 text-[15px] text-muted">{c.wording.line}</p>
          </SpotCard>

          <SpotCard label="Ask the deal owner">
            <Chip>{c.ask.state}</Chip>
            <h3 className="mt-5 text-[22px] font-semibold text-text">{c.ask.title}</h3>
            <p className="mt-2 text-[17px] text-muted">{c.ask.line}</p>
          </SpotCard>

          <SpotCard label="After an edit">
            <Chip tone="muted">↻ {c.edit.state}</Chip>
            <h3 className="mt-5 text-[22px] font-semibold text-text">{c.edit.title}</h3>
            <p className="mt-2 text-[17px] text-muted">{c.edit.line}</p>
          </SpotCard>

          <SpotCard label="A short record" className="sm:col-span-2 lg:col-span-4">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="text-[22px] font-semibold text-text">{c.record.title}</h3>
                <p className="mt-2 text-[17px] text-muted">{c.record.line}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-card/80 p-5">
                <Chip>✓ READY</Chip>
                <p className="mt-3 text-[15px] font-medium text-text">{c.record.version}</p>
                <p className="mt-1 text-[14px] text-muted">{c.record.to}</p>
              </div>
            </div>
          </SpotCard>
        </div>
      </div>
    </section>
  )
}
