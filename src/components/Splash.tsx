import { useEffect, useState } from 'react'

/*
 * Splash (Figma "G1 · Splash"): dark screen, soft blue/purple glows, the DealDesk eye mark with its wordmark and the prototype note.
 * MOTION · page load · glows fade in and drift; the mark rises, un-blurs and settles (0.9s expo-out); the wordmark follows (+0.15s);
 *   after ~1.7s the whole splash fades and lifts away (0.6s) and is removed from the DOM · plays on every load / refresh ·
 *   reduced-motion: no movement, a short fade only. CSS only (no JS animation library) so it costs nothing at startup.
 * It is fixed ON TOP of the hero, which keeps rendering underneath, so it does not delay the first paint of the page.
 */
export function Splash() {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in') // every load and refresh, phones included

  useEffect(() => {
    if (phase === 'gone') return
    document.documentElement.style.overflow = 'hidden'
    const t1 = window.setTimeout(() => setPhase('out'), 1900)
    const t2 = window.setTimeout(() => setPhase('gone'), 2550)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      document.documentElement.style.overflow = ''
    }
  }, [phase === 'gone']) // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'gone') return null
  return (
    <div role="presentation" aria-hidden className={`dd-splash ${phase === 'out' ? 'dd-splash--out' : ''}`}>
      <span className="dd-splash-glow dd-splash-glow--a" />
      <span className="dd-splash-glow dd-splash-glow--b" />
      <span className="dd-splash-glow dd-splash-glow--c" />
      <div className="dd-splash-logo">
        <img src="/assets/logo-mark.svg" alt="" width={164} height={109} className="dd-splash-mark" />
        <span className="dd-splash-word">
          <span className="text-white">Deal</span>
          <span className="bg-gradient-to-r from-[#c19bff] to-[#6f7df5] bg-clip-text text-transparent">Desk</span>
        </span>
      </div>
      <p className="dd-splash-note">Fictional prototype · nothing really sends</p>
    </div>
  )
}
