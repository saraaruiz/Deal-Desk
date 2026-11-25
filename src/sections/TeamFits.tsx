import { useEffect, useRef } from 'react'
import { PenLine, SendHorizontal, UserCheck } from 'lucide-react'
import { fits } from '@/content/copy'
import { TeamInvite } from '@/components/ui/team-invite'
import { Chip } from '@/components/bits'
import { GlassCard } from '@/components/GlassCard'
import { Words } from '@/components/Words'
import { Avatar, avatarUri } from '@/lib/avatars'
import { gsap, prefersReducedMotion } from '@/lib/motion'

/** Leading visual for each role: an illustrated avatar with a small role icon, the DealDesk mark, or the Send icon. */
function RoleVisual({ name }: { name: string }) {
  const badge = 'absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-lavender text-indigo ring-2 ring-[#12151c]'
  if (name === 'Coordinator')
    return (
      <span className="relative inline-block shrink-0">
        <Avatar name="jordan" size={56} />
        <span className={badge}>
          <PenLine size={13} strokeWidth={2.2} />
        </span>
      </span>
    )
  if (name === 'Deal owner')
    return (
      <span className="relative inline-block shrink-0">
        <Avatar name="dana" size={56} />
        <span className={badge}>
          <UserCheck size={13} strokeWidth={2.2} />
        </span>
      </span>
    )
  if (name === 'DealDesk')
    return (
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-lavender/15 ring-1 ring-lavender/50">
        <img src="/assets/logo-mark.svg" alt="" width={34} height={22} className="h-[22px] w-[34px]" />
      </span>
    )
  return (
    <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-lavender-soft ring-1 ring-white/10">
      <SendHorizontal size={22} strokeWidth={1.8} />
    </span>
  )
}

export function TeamFits() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll into view · title/line rise (y 36 -> 0, fade), role rows slide in one by one (x 24 -> 0, fade) and the
       *   vertical connector draws down (scaleY 0 -> 1) · 0.9s expo.out, stagger 0.12 · plays once · reduced-motion: none.
       *   (The Team Invite loop itself is CSS keyframes 4.4s and is frozen to a still frame under prefers-reduced-motion.)
       */
      gsap.from('[data-rise]', { y: 36, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } })
      gsap.from('[data-role]', { x: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '[data-roles]', start: 'top 80%', once: true } })
      gsap.from('[data-connector]', { scaleY: 0, transformOrigin: 'top', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '[data-roles]', start: 'top 80%', once: true } })
    }, root.current!)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="fits" aria-labelledby="fits-title" className="relative overflow-hidden bg-bg py-24 lg:py-[130px]">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[55%] size-[700px] -translate-x-1/2 rounded-full bg-glow-2/20 blur-[140px] max-md:hidden" />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-[120px]">
        <h2 id="fits-title" className="text-[clamp(36px,4.4vw,64px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
          <Words lines={fits.title} />
        </h2>
        <p data-rise className="mt-6 max-w-[620px] text-[clamp(17px,1.5vw,22px)] leading-[1.5] text-muted">
          {fits.line}
        </p>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[minmax(0,560px)_1fr] lg:gap-24">
          <GlassCard data-rise tilt={3} className="!rounded-[28px] p-4 sm:p-8">
            {/* Illustrated avatars (fictional people). Dana, the deal owner, is the one dragged into the slot. */}
            <TeamInvite
              avatars={[
                { src: avatarUri('pat'), name: 'Pat Morgan' },
                { src: avatarUri('alex'), name: 'Alex Rivera' },
                { src: avatarUri('dana'), name: 'Dana, deal owner' },
              ]}
              label={fits.label}
            />
          </GlassCard>

          <ol data-roles className="relative space-y-4">
            {/* vertical connector between the rows */}
            <span data-connector aria-hidden className="absolute bottom-10 left-[51px] top-10 w-px bg-gradient-to-b from-lavender/60 via-lavender/25 to-lavender/60" />
            {fits.roles.map((r) => (
              <li key={r.name} data-role>
                <GlassCard
                  tilt={2}
                  className={
                    'group flex items-center gap-5 !rounded-[22px] px-5 py-4 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:translate-x-1.5 ' +
                    (r.name === 'DealDesk' ? 'ring-1 ring-lavender/50' : '')
                  }
                >
                  <RoleVisual name={r.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[22px] font-semibold leading-tight text-text">{r.name}</p>
                    <p className="mt-1 text-[16px] text-muted">{r.line}</p>
                    {r.note && <p className="mt-1.5 text-[13px] text-muted/70">{r.note}</p>}
                  </div>
                  {r.name === 'Send' && <Chip>✓ READY</Chip>}
                </GlassCard>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
