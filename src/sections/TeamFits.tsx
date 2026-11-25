import { useEffect, useRef } from 'react'
import { fits } from '@/content/copy'
import { OrbitingTeamCarousel, type TeamPerson } from '@/components/ui/orbiting-team-carousel'
import { Words } from '@/components/Words'
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

/**
 * "Fits the way your team already works." The flow of roles (Coordinator, DealDesk, Deal owner, Send) now lives inside
 * "One message, four moments", one role per step. What stays here is the deal team: who is on Harbor, and who needs Dana.
 */
export function TeamFits() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll into view · line and orbit rise (y 36 -> 0, fade) · 0.9s expo.out, stagger 0.1 · plays once · reduced-motion: none.
       */
      gsap.from('[data-rise]', { y: 36, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } })
    }, root.current!)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="fits" aria-labelledby="fits-title" className="relative overflow-hidden bg-bg py-24 lg:py-[120px]">
      <div aria-hidden className="pointer-events-none absolute left-[70%] top-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow-2/20 blur-[140px] max-md:hidden" />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-20 lg:px-[120px]">
        <div>
          <h2 id="fits-title" className="text-[clamp(36px,4.4vw,64px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
            <Words lines={fits.title} />
          </h2>
          <p data-rise className="mt-6 max-w-[520px] text-[clamp(17px,1.5vw,22px)] leading-[1.5] text-muted">
            {fits.line}
          </p>
        </div>

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
    </section>
  )
}
