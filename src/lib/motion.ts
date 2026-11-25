import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/** Global easing token: cubic-bezier(.22,1,.36,1). GSAP flavour below. */
export const EASE_CSS = 'cubic-bezier(.22,1,.36,1)'
export const EASE = 'expo.out' // closest named GSAP ease to the token for tweens; scrubbed timelines use 'none'

const mqReduce = () => window.matchMedia('(prefers-reduced-motion: reduce)')
const mqDesktop = () => window.matchMedia('(min-width: 1024px) and (hover: hover)')

export const prefersReducedMotion = () => typeof window !== 'undefined' && mqReduce().matches
/** Desktop-class scroll choreography (pinned, scrubbed). Mobile gets swipe rows + loops instead. */
export const isDesktopMotion = () => typeof window !== 'undefined' && mqDesktop().matches && !mqReduce().matches

export function useReducedMotion() {
  const [r, setR] = useState(() => (typeof window === 'undefined' ? false : mqReduce().matches))
  useEffect(() => {
    const mq = mqReduce()
    const on = () => setR(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return r
}

/** True when the screen should get the swipe/CSS version (no WebGL carousel, no scrub). */
export function useLiteMode() {
  const [lite, setLite] = useState(true)
  useEffect(() => {
    const check = () => {
      const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
      const lowPower = (nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2 || !!nav.connection?.saveData
      setLite(!mqDesktop().matches || mqReduce().matches || lowPower)
    }
    check()
    const a = mqDesktop()
    const b = mqReduce()
    a.addEventListener('change', check)
    b.addEventListener('change', check)
    return () => {
      a.removeEventListener('change', check)
      b.removeEventListener('change', check)
    }
  }, [])
  return lite
}

/**
 * True only when the page should NOT run scroll choreography: reduced motion, data saver, or a very low-power device.
 * Unlike useLiteMode it does not depend on screen width or on having a mouse: scroll-driven effects work on touch too.
 */
export function useStaticMotion() {
  const [stat, setStat] = useState(false)
  useEffect(() => {
    const check = () => {
      const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
      const lowPower = (nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2 || !!nav.connection?.saveData
      setStat(mqReduce().matches || lowPower)
    }
    check()
    const b = mqReduce()
    b.addEventListener('change', check)
    return () => b.removeEventListener('change', check)
  }, [])
  return stat
}

/** Lazy mount: true once the element is within `margin` of the viewport. */
export function useNearViewport<T extends HTMLElement>(margin = '600px') {
  const ref = useRef<T>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, near] as const
}

/*
 * MOTION · page load · Lenis smooth scroll synced with ScrollTrigger · continuous · lerp 0.1 ·
 * reduced-motion: Lenis is NOT created (native scroll).
 */
export function startSmoothScroll() {
  if (prefersReducedMotion()) return () => {}
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (t: number) => lenis.raf(t * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
  }
}

/*
 * MOTION · scroll into view (every [data-words] headline) · words rise out of a mask and un-blur
 *   (yPercent 115 -> 0, opacity 0 -> 1, blur 10px -> 0) · 1s expo.out, stagger 0.045 · plays once ·
 *   reduced-motion: none (text is already in its final state).
 */
export function revealWords() {
  if (prefersReducedMotion()) return () => {}
  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('[data-words]').forEach((el) => {
      gsap.from(el.querySelectorAll('[data-w]'), {
        yPercent: 115,
        opacity: 0,
        ...(isDesktopMotion() ? { filter: 'blur(10px)' } : {}),
        duration: 1,
        ease: 'expo.out',
        stagger: 0.045,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    })
  })
  return () => ctx.revert()
}

export { gsap, ScrollTrigger }
