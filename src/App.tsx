import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { FilmGrain, ScrollProgress, SkipLink } from '@/components/bits'
import { FloatingNav } from '@/components/FloatingNav'
import { SectionDivider } from '@/components/SectionDivider'
import { ScrollTrigger, startSmoothScroll } from '@/lib/motion'
import { Hero } from '@/sections/Hero'

// Everything below the hero is its own chunk and is mounted late (see <Defer>), so the first paint only pays for the hero.
const DealsOneSend = lazy(() => import('@/sections/DealsOneSend').then((m) => ({ default: m.DealsOneSend })))
const FourMoments = lazy(() => import('@/sections/FourMoments').then((m) => ({ default: m.FourMoments })))
const TeamFits = lazy(() => import('@/sections/TeamFits').then((m) => ({ default: m.TeamFits })))
const Inside = lazy(() => import('@/sections/Inside').then((m) => ({ default: m.Inside })))
const Limits = lazy(() => import('@/sections/Limits').then((m) => ({ default: m.Limits })))
const Invitation = lazy(() => import('@/sections/Invitation').then((m) => ({ default: m.Invitation })))
const Footer = lazy(() => import('@/sections/Footer').then((m) => ({ default: m.Footer })))

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }

/**
 * Mounts its children late, in whichever of these comes first:
 *   - the placeholder gets within 300px of the viewport (the person is scrolling there), or the URL hash points at it
 *   - the browser is idle, `4s + order × 0.4s` after the page loaded (so far sections never compete with the first paint)
 * The placeholder reserves the section's height and carries its id, so anchors and the scroll length stay stable.
 * After mounting, ScrollTrigger is refreshed once (pins and triggers below it move).
 */
function Defer({ id, order, minH, divider, children }: { id?: string; order: number; minH: string; divider?: { n: string; label: string }; children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const holder = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let done = false
    const go = () => {
      if (done) return
      done = true
      setReady(true)
    }
    // Anchors: sections ABOVE the target change the page height when they mount (pins add scroll length), so a jump to #moments
    // must first mount every section before it, then re-align. Each Defer listens for "mount everything up to order N".
    const mountUntil = (e: Event) => {
      if ((e as CustomEvent<number>).detail >= order) go()
    }
    const align = () => {
      const el = id ? document.getElementById(id) : null
      if (!el) return
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: { immediate?: boolean }) => void } }).__lenis
      if (lenis) lenis.scrollTo(el, { immediate: true })
      else el.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
    }
    const onHash = () => {
      if (!id || window.location.hash !== `#${id}`) return
      window.dispatchEvent(new CustomEvent('dd:mount-until', { detail: order }))
      window.setTimeout(align, 450)
      window.setTimeout(align, 1300)
    }
    window.addEventListener('dd:mount-until', mountUntil)
    window.addEventListener('hashchange', onHash)
    onHash()
    const io = new IntersectionObserver(([e]) => e.isIntersecting && go(), { rootMargin: '300px' })
    if (holder.current) io.observe(holder.current)
    let t = 0
    const schedule = () => {
      t = window.setTimeout(() => {
        const w = window as IdleWindow
        if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 1500 })
        else go()
      }, 8000 + order * 400)
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    return () => {
      io.disconnect()
      window.clearTimeout(t)
      window.removeEventListener('load', schedule)
      window.removeEventListener('dd:mount-until', mountUntil)
      window.removeEventListener('hashchange', onHash)
    }
  }, [id, order])

  useEffect(() => {
    if (!ready) return
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => window.clearTimeout(t)
  }, [ready])

  const placeholder = <div ref={holder} id={id} aria-hidden style={{ minHeight: minH }} />
  if (!ready) return placeholder
  return (
    <>
      {divider && <SectionDivider n={divider.n} label={divider.label} />}
      <Suspense fallback={<div id={id} aria-hidden style={{ minHeight: minH }} />}>{children}</Suspense>
    </>
  )
}

export default function App() {
  useEffect(() => {
    const stop = startSmoothScroll()
    // Fonts change text metrics: one refresh when they are ready (sections that mount late refresh themselves).
    void document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => stop()
  }, [])

  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <FilmGrain />
      <FloatingNav />
      <main id="main">
        <Hero />
        <Defer id="deals" order={1} minH="100svh">
          <DealsOneSend />
        </Defer>
        <Defer id="moments" order={2} minH="100svh" divider={{ n: "02", label: "How it works" }}>
          <FourMoments />
        </Defer>
        <Defer id="fits" order={3} minH="900px" divider={{ n: "03", label: "Who it's for" }}>
          <TeamFits />
        </Defer>
        <Defer id="inside" order={4} minH="900px" divider={{ n: "04", label: "Inside every review" }}>
          <Inside />
        </Defer>
        <Defer id="limits" order={5} minH="1000px" divider={{ n: "05", label: "Limits" }}>
          <Limits />
        </Defer>
        <Defer id="invite" order={6} minH="100svh" divider={{ n: "06", label: "Look twice" }}>
          <Invitation />
        </Defer>
      </main>
      <Defer order={7} minH="700px">
        <Footer />
      </Defer>
    </>
  )
}
