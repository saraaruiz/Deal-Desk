import { useEffect, useRef } from 'react'
import { PenLine, SendHorizontal, UserCheck } from 'lucide-react'
import { fits } from '@/content/copy'
import { OrbitingTeamCarousel, type TeamPerson } from '@/components/ui/orbiting-team-carousel'
import { Chip } from '@/components/bits'
import { GlassCard } from '@/components/GlassCard'
import { Words } from '@/components/Words'
import { Avatar } from '@/lib/avatars'
import { gsap, prefersReducedMotion } from '@/lib/motion'

// The fictional deal team, from the prototype (Harbor · Deal team). Alternating so the ring reads as a mix.
const team: TeamPerson[] = [
  { id: 'pat', name: 'Pat Morgan', role: 'Advisor', onHarbor: true, avatar: 'pat' },
  { id: 'sam', name: 'Sam Lee', role: 'Client company · Finance', deals: 'Deals: Atlas · Keystone', onHarbor: false, avatar: 'sam' },
  { id: 'alex', name: 'Alex Rivera', role: 'Client representative', onHarbor: true, avatar: 'alex' },
  { id: 'maya', name: 'Maya Chen', role: 'Advisor', deals: 'Deals: Atlas', onHarbor: false, avatar: 'maya' },
  { id: 'dana', name: 'Dana', role: 'Deal owner', onHarbor: true, avatar: 'dana' },
  { id: 'leo', name: 'Leo Ortiz', role: 'Client representative', deals: 'Deals: Keystone', onHarbor: false, avatar: 'leo' },
  { id: 'priya', name: 'Priya Nair', role: 'Analyst', onHarbor: true, avatar: 'priya' },
  { id: 'adrian', name: 'Adrián Soto', role: 'Advisor', deals: 'Deals: Orion', onHarbor: false, avatar: 'adrian' },
]

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

        <div className="mt-16 grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-20">
          {/* the review flow, as people and steps */}
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

          {/* who can be on the message: On Harbor, or not on Harbor and "Ask Dana to add" (as in the app) */}
          <div data-rise>
            <div className="text-center">
              <p className="text-[13px] font-semibold tracking-[0.12em] text-lavender-soft">HARBOR · DEAL TEAM</p>
              <h3 className="mx-auto mt-3 max-w-[480px] text-[clamp(24px,2.4vw,32px)] font-bold leading-[1.12] tracking-[-0.01em] text-text">
                Not on Harbor? Ask Dana to add.
              </h3>
              <p className="mx-auto mt-3 max-w-[420px] text-[16px] text-muted">Tap a person. Nothing is sent.</p>
            </div>
            <div className="mt-6">
              <OrbitingTeamCarousel people={team} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}