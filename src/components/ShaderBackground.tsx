import { useEffect, useRef, useState } from 'react'
import { shaderManager } from '@/lib/shaderManager'

/**
 * Absolutely-positioned host behind the content. The single shared WebGL canvas is moved in while this
 * host is the most visible one. Fallback (WebGL missing / failing): static CSS gradient, same colours.
 *
 * MOTION · load (hero) / scroll-into-view (invitation) · canvas opacity 0 -> 1 · 1.2 s cubic-bezier(.22,1,.36,1)
 *   · reduced-motion: shader draws one still frame (no time, no cursor swirl), fades instantly.
 */
export function ShaderBackground({ intensity = 0.35, brightness = 0 }: { intensity?: number; brightness?: number }) {
  const host = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = host.current
    if (!el) return
    // Phones keep the CSS gradient (animated, same colours): a full-screen WebGL shader is the costliest thing on a
    // mid-range phone and it is what Lighthouse mobile punishes. Tablets and desktop get the real shader.
    if (window.matchMedia('(max-width: 767px)').matches) return
    return shaderManager.register(el, { intensity, brightness, onReady: setReady })
  }, [intensity, brightness])

  return (
    <div
      ref={host}
      aria-hidden="true"
      data-shader-ready={ready}
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden [&>canvas]:opacity-0 [&>canvas]:transition-opacity [&>canvas]:duration-[1200ms] [&>canvas]:ease-[cubic-bezier(.22,1,.36,1)] data-[shader-ready=true]:[&>canvas]:opacity-100"
      style={{
        // Static CSS fallback: the same four colours (#081326 #04052E #6941E1 #916BBF)
        background:
          'radial-gradient(60% 55% at 78% 18%, #6941E1 0%, rgba(105,65,225,0) 70%), radial-gradient(50% 50% at 15% 85%, #916BBF 0%, rgba(145,107,191,0) 70%), linear-gradient(160deg, #081326 0%, #04052E 100%)',
      }}
    >
      {/* CSS-only motion for the fallback: two soft gradient blobs drifting (transform only, no blur filter) */}
      <span aria-hidden className="drift absolute -right-1/4 -top-1/4 size-[90%] rounded-full opacity-70 [background:radial-gradient(closest-side,#6941E1,transparent)]" />
      <span aria-hidden className="drift absolute -bottom-1/4 -left-1/4 size-[80%] rounded-full opacity-60 [animation-delay:-11s] [background:radial-gradient(closest-side,#916BBF,transparent)]" />
    </div>
  )
}
