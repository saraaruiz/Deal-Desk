import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { fits } from '@/content/copy'
import { TeamInvite } from '@/components/ui/team-invite'
import { Chip } from '@/components/bits'
import { gsap, prefersReducedMotion } from '@/lib/motion'

export function TeamFits() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll into view · title/line rise (y 36 -> 0, fade), role rows slide in one by one (x 24 -> 0, fade) ·
       *   0.8s expo.out, stagger 0.1 · plays once · reduced-motion: none. (The Team Invite loop itself is CSS keyframes
       *   4.4s and is frozen to a still frame under prefers-reduced-motion.)
       */
      gsap.from('[data-rise]', { y: 36, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } })
      gsap.from('[data-role]', { x: 24, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '[data-roles]', start: 'top 80%', once: true } })
    }, root.current!)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="fits" aria-labelledby="fits-title" className="relative overflow-hidden bg-bg py-20 lg:py-[110px]">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[55%] size-[700px] -translate-x-1/2 rounded-full bg-glow-2/25 blur-[140px]" />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-[120px]">
        <h2 id="fits-title" data-rise className="text-[clamp(36px,4.4vw,64px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
          {fits.title.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </h2>
        <p data-rise className="mt-6 max-w-[620px] text-[clamp(17px,1.5vw,22px)] leading-[1.5] text-muted">
          {fits.line}
        </p>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[minmax(0,560px)_1fr] lg:gap-20">
          <div data-rise className="glass rounded-[32px] p-4 sm:p-8">
            {/* Initials avatars: no photos of real people. D (Dana, deal owner) is the one dragged into the slot. */}
            <TeamInvite
              avatars={[
                { initials: 'PM', name: 'Pat Morgan' },
                { initials: 'AR', name: 'Alex Rivera' },
                { initials: 'D', name: 'Dana, deal owner' },
              ]}
              label={fits.label}
            />
          </div>

          <ol data-roles className="space-y-3">
            {fits.roles.map((r, i) => (
              <li key={r.name} data-role>
                <div
                  className={
                    'glass flex items-center justify-between gap-4 rounded-[24px] px-6 py-5 ' +
                    (r.name === 'DealDesk' ? '!border-lavender/70 !bg-lavender/10' : '')
                  }
                >
                  <div>
                    <p className="text-[22px] font-semibold text-text">{r.name}</p>
                    <p className="mt-1 text-[17px] text-muted">{r.line}</p>
                    {r.note && <p className="mt-2 text-[13px] text-muted/80">{r.note}</p>}
                  </div>
                  {r.name === 'Send' && <Chip>✓ READY</Chip>}
                </div>
                {i < fits.roles.length - 1 && <ArrowRight aria-hidden className="mx-auto mt-3 rotate-90 text-lavender/90" size={22} />}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
