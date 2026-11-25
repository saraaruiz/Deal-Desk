import { useEffect, useRef } from 'react'
import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react'
import { footer, hero, nav } from '@/content/copy'
import { Logo } from '@/components/bits'
import { gsap, prefersReducedMotion } from '@/lib/motion'

/*
 * Footer: brand + promise, product links, contact and social (all PLACEHOLDERS: nothing links anywhere), a legal bar and a giant
 * wordmark that rises into view. Contact details use reserved example values (example domain, 555-01xx phone).
 */

// Simple social glyphs (drawn here, lucide dropped its brand icons). Decorative links that go nowhere.
const social = [
  { name: 'LinkedIn', d: <path d="M6.5 9.5v8M6.5 6.2v.1M10.5 17.5v-8m0 3.2c0-1.9 1.2-3.2 3-3.2s2.5 1.2 2.5 3.2v4.8" /> },
  { name: 'Instagram', d: (<><rect x="4.5" y="4.5" width="15" height="15" rx="4.5" /><circle cx="12" cy="12" r="3.4" /><path d="M16.6 7.4v.1" /></>) },
  { name: 'YouTube', d: (<><rect x="3.5" y="6.5" width="17" height="11" rx="3.5" /><path d="M10.4 9.8v4.4l3.8-2.2-3.8-2.2z" /></>) },
  { name: 'X', d: <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" /> },
]

const col = 'text-[12px] font-semibold tracking-[0.16em] text-lavender-soft'
const link = 'flex min-h-[40px] items-center text-[16px] text-text/80 transition-colors hover:text-text'

export function Footer() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /*
       * MOTION · scroll into view · the divider line draws across the top (scaleX 0 -> 1, from the left) and the four columns rise in
       *   one by one (y 30 -> 0, fade, stagger 0.1) · 1s expo.out · plays once · reduced-motion: none.
       * MOTION · scroll · the giant "DealDesk" wordmark rises into place (y 140 -> 0) and brightens (opacity .3 -> 1) as the footer
       *   comes into view · scrubbed, ease none · reduced-motion: none.
       */
      gsap.from('[data-fline]', { scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } })
      gsap.from('[data-fcol]', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } })
      gsap.fromTo('[data-fmark]', { y: 140, opacity: 0.3 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } })
    }, root.current!)
    return () => ctx.revert()
  }, [])

  const toTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: { duration?: number }) => void } }).__lenis
    if (lenis) lenis.scrollTo(0, { duration: 1.6 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer ref={root} className="relative overflow-hidden bg-bg-deep">
      <span data-fline aria-hidden className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-lavender-soft/60 via-white/20 to-transparent lg:inset-x-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-[1440px] gap-12 px-6 pb-14 pt-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr] lg:gap-10 lg:px-[120px] lg:pt-24">
        <div data-fcol>
          <Logo />
          <p className="mt-6 max-w-[320px] text-[clamp(20px,1.7vw,26px)] font-semibold leading-[1.25] tracking-[-0.01em] text-text">
            {hero.h1.join(' ')}
          </p>
          <p className="mt-4 max-w-[340px] text-[14px] leading-[1.55] text-muted">{footer.disclaimer}</p>
        </div>

        <nav data-fcol aria-label="Footer">
          <p className={col}>PRODUCT</p>
          <ul className="mt-4">
            {footer.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className={link}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#prototype" className={link}>
                {nav.cta}
              </a>
            </li>
          </ul>
        </nav>

        <div data-fcol>
          <p className={col}>CONTACT</p>
          <ul className="mt-4 space-y-1">
            <li>
              <span className="flex min-h-[40px] items-center gap-3 text-[16px] text-text/80">
                <Mail size={16} className="text-lavender-soft" aria-hidden /> hello@dealdesk.example
              </span>
            </li>
            <li>
              <span className="flex min-h-[40px] items-center gap-3 text-[16px] text-text/80">
                <Phone size={16} className="text-lavender-soft" aria-hidden /> +1 (555) 010-0100
              </span>
            </li>
            <li className="flex min-h-[40px] items-center gap-3 text-[16px] text-text/80">
              <MapPin size={16} className="text-lavender-soft" aria-hidden /> Project Harbor (fictional)
            </li>
          </ul>
        </div>

        <div data-fcol>
          <p className={col}>FOLLOW</p>
          <ul className="mt-4 flex gap-3">
            {social.map((s) => (
              <li key={s.name}>
                <span role="img" aria-label={`${s.name} (example)`} className="flex size-11 items-center justify-center text-text/60">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {s.d}
                  </svg>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-muted/70">Contact details and social links are examples.</p>
        </div>
      </div>

      {/* giant wordmark, rising into place */}
      <div aria-hidden className="pointer-events-none relative z-0 -mb-[0.16em] select-none overflow-hidden text-center">
        <p
          data-fmark
          className="whitespace-nowrap text-[clamp(60px,19.5vw,340px)] font-extrabold leading-[0.9] tracking-[-0.05em]"
          style={{
            backgroundImage: 'linear-gradient(180deg, rgba(183,172,255,0.5) 0%, rgba(111,125,245,0.16) 55%, rgba(111,125,245,0) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          DealDesk
        </p>
      </div>

      {/* legal bar */}
      <div className="relative z-10 border-t border-white/10 bg-bg-deep/80">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center lg:px-[120px]">
          <p className="text-[13px] text-muted/80">{footer.legal}</p>
          <p className="text-[13px] text-muted/60">© 2026 DealDesk · A fictional product made for a design exercise</p>
          <button
            type="button"
            onClick={toTop}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white/[0.05] px-4 text-[13px] font-medium text-text/85 ring-1 ring-white/12 transition-colors hover:bg-white/12"
          >
            Back to top <ArrowUp size={15} aria-hidden />
          </button>
        </div>
      </div>
    </footer>
  )
}
