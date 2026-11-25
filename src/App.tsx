import { useEffect } from 'react'
import { FilmGrain, ScrollProgress, SkipLink } from '@/components/bits'
import { FloatingNav } from '@/components/FloatingNav'
import { ScrollTrigger, revealWords, startSmoothScroll } from '@/lib/motion'
import { DealsOneSend } from '@/sections/DealsOneSend'
import { Footer } from '@/sections/Footer'
import { FourMoments } from '@/sections/FourMoments'
import { Hero } from '@/sections/Hero'
import { Inside } from '@/sections/Inside'
import { Invitation } from '@/sections/Invitation'
import { Limits } from '@/sections/Limits'
import { TeamFits } from '@/sections/TeamFits'

export default function App() {
  useEffect(() => {
    const stop = startSmoothScroll()
    const stopWords = revealWords()
    // Pinned sections depend on final layout: refresh once fonts and images settle.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    void document.fonts?.ready.then(refresh)
    return () => {
      window.removeEventListener('load', refresh)
      stopWords()
      stop()
    }
  }, [])

  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <FilmGrain />
      <FloatingNav />
      <main id="main">
        <Hero />
        <DealsOneSend />
        <FourMoments />
        <TeamFits />
        <Inside />
        <Limits />
        <Invitation />
      </main>
      <Footer />
    </>
  )
}
