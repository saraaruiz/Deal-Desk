import { useEffect } from 'react'
import { FilmGrain, ScrollProgress, SkipLink } from '@/components/bits'
import { ScrollTrigger, startSmoothScroll } from '@/lib/motion'
import { DealsOneSend } from '@/sections/DealsOneSend'
import { Footer } from '@/sections/Footer'
import { FourMoments } from '@/sections/FourMoments'
import { Hero } from '@/sections/Hero'
import { Inside } from '@/sections/Inside'
import { Invitation } from '@/sections/Invitation'
import { Limits } from '@/sections/Limits'
import { RightPeople } from '@/sections/RightPeople'
import { TeamFits } from '@/sections/TeamFits'

export default function App() {
  useEffect(() => {
    const stop = startSmoothScroll()
    // Pinned sections depend on final layout: refresh once fonts and images settle.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    void document.fonts?.ready.then(refresh)
    return () => {
      window.removeEventListener('load', refresh)
      stop()
    }
  }, [])

  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <FilmGrain />
      <main id="main">
        <Hero />
        <DealsOneSend />
        <RightPeople />
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
