/*
 * MOTION · always (when on screen) · a slow marquee of the four message states drifts left, seamless loop ·
 *   28s linear, pauses on hover · reduced-motion: static row, no movement.
 * Content is only the four states from the prototype (Ready, Pending, Sent, Outdated): no logos, no claims.
 */
const states = [
  { t: 'READY', i: '✓' },
  { t: 'PENDING', i: '·' },
  { t: 'SENT', i: '↗' },
  { t: 'OUTDATED', i: '↻' },
]

export function Marquee() {
  const row = [...states, ...states, ...states, ...states]
  return (
    <section aria-label="The four message states" className="marquee relative overflow-hidden border-y border-white/10 bg-bg py-7">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />
      <p className="sr-only">Message states: Ready, Pending, Sent, Outdated.</p>
      <div aria-hidden className="marquee-track flex w-max gap-4 will-change-transform">
        {[...row, ...row].map((s, i) => (
          <span key={i} className="chip !px-6 !py-3 !backdrop-blur-none text-[15px] tracking-[0.14em] text-text/90">
            <span className="text-lavender-soft">{s.i}</span> {s.t}
          </span>
        ))}
      </div>
    </section>
  )
}
