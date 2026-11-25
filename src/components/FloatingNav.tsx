import { useEffect, useState } from 'react'
import { nav } from '@/content/copy'
import { MagneticLink } from '@/components/bits'

/*
 * MOTION · scroll · a floating glass pill nav slides in (y -140% -> 0, opacity 0 -> 1) once the hero header has left,
 *   hides again when scrolling down and returns when scrolling up · 0.7s cubic-bezier(.22,1,.36,1) ·
 *   reduced-motion: shows/hides with no slide. Hidden from assistive tech while off-screen (inert).
 */
export function FloatingNav() {
  const [show, setShow] = useState(false)
  const [current, setCurrent] = useState('')

  useEffect(() => {
    let last = window.scrollY
    const on = () => {
      const y = window.scrollY
      const goingUp = y < last
      setShow(y > 520 && goingUp)
      last = y
      let cur = ''
      for (const l of nav.links) {
        const el = document.getElementById(l.href.slice(1))
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = l.href
      }
      setCurrent(cur)
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <nav
      aria-label="Floating"
      inert={!show}
      // Centred with auto margins (NOT translateX): Tailwind v4's -translate-x-1/2 uses the `translate` property, which stacked
      // with an inline transform and pushed the pill half its width to the left.
      className="glass-nav fixed inset-x-0 top-4 z-[80] mx-auto hidden w-max items-center gap-1 !rounded-full px-2 py-2 transition-[transform,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:flex"
      style={{ transform: `translateY(${show ? '0' : '-160%'})`, opacity: show ? 1 : 0 }}
    >
      <a href="#top" aria-label="DealDesk, back to top" className="flex size-11 items-center justify-center rounded-full hover:bg-white/10">
        <img src="/assets/logo-mark.svg" alt="" width={30} height={20} className="h-5 w-[30px]" />
      </a>
      {nav.links.map((l) => (
        <a key={l.label} href={l.href} aria-current={current === l.href ? 'location' : undefined} className={`flex min-h-[44px] items-center rounded-full px-4 text-[14px] font-medium transition-colors duration-200 hover:bg-white/10 hover:text-text ${current === l.href ? 'bg-white/[0.14] text-text' : 'text-text/85'}`}>
          {l.label}
        </a>
      ))}
      <MagneticLink
        href="#prototype"
        className="btn-shine ml-1 inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full bg-lavender px-5 text-[14px] font-semibold text-indigo"
      >
        {nav.cta}
      </MagneticLink>
    </nav>
  )
}
