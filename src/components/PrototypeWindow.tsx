import { useEffect, useRef, useState } from 'react'
import { ExternalLink, Maximize2, Minimize2, Minus, X } from 'lucide-react'

/*
 * Prototype window: every link to #prototype opens the Figma prototype INSIDE the page (no new tab).
 * Minimize keeps the iframe alive (the person keeps their place), maximize fills the screen, close unloads it.
 * MOTION · open / restore · panel fades in (opacity 0 -> 1, scale .98 -> 1) · 220ms cubic-bezier(.22,1,.36,1) · reduced-motion: none.
 */
const PATH =
  'proto/jgldLsdlZKwrYC2xhzIm7k/DealDesk---Futureproofing?node-id=173-2546&starting-point-node-id=173%3A2529'
// scaling=contain fits the whole phone frame inside the window (no inner scrolling); on small screens Figma's own bars are hidden too
const embedUrl = (small: boolean) => `https://embed.figma.com/${PATH}&scaling=contain&embed-host=dealdesk${small ? '&footer=false&hide-ui=1' : ''}`
const OPEN = `https://www.figma.com/${PATH}&scaling=scale-down&content-scaling=fixed`

type Lenis = { stop: () => void; start: () => void }

export function PrototypeWindow() {
  const [state, setState] = useState<'closed' | 'open' | 'min'>('closed')
  const [big, setBig] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [src, setSrc] = useState('') // decided when the window opens, so rotating the phone does not reload the prototype
  const trigger = useRef<HTMLElement | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const restore = useRef<HTMLButtonElement>(null)

  const close = () => {
    setState('closed')
    setLoaded(false)
    setBig(false)
    setSrc('')
    const t = trigger.current
    window.setTimeout(() => t?.isConnected && t.focus({ preventScroll: true }), 0)
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href="#prototype"]') as HTMLElement | null
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey) return
      e.preventDefault()
      trigger.current = a
      // sound from the films would play over the prototype
      document.querySelectorAll('video').forEach((v) => !v.muted && v.pause())
      setSrc((current) => current || embedUrl(window.matchMedia('(max-width: 639px), (max-height: 500px)').matches))
      setState('open')
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  // loading feedback on the button that opened the window
  useEffect(() => {
    const t = trigger.current
    if (!t || state === 'closed' || loaded) return
    t.setAttribute('aria-busy', 'true')
    return () => t.removeAttribute('aria-busy')
  }, [state, loaded])

  useEffect(() => {
    if (state === 'min') restore.current?.focus()
    if (state !== 'open') return
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    panel.current?.focus()
    // Esc works while focus is on the page; keys pressed inside the Figma frame stay inside it
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [state])

  if (state === 'closed') return null
  const ctl =
    'flex size-11 items-center justify-center rounded-full text-text/85 transition-colors duration-200 hover:bg-white/12 hover:text-text'
  const size = big ? 'sm:h-[94svh] sm:w-[96vw]' : 'sm:h-[min(880px,90svh)] sm:w-[min(480px,92vw)]'
  return (
    <>
      {state === 'open' && <div aria-hidden onClick={() => setState('min')} className="fixed inset-0 z-[110] bg-black/65 backdrop-blur-sm" />}
      <div className={`pointer-events-none fixed inset-0 z-[120] items-center justify-center ${state === 'min' ? 'hidden' : 'flex'}`}>
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="DealDesk prototype"
          tabIndex={-1}
          data-lenis-prevent
          className={`dd-pop pointer-events-auto flex h-full w-full flex-col overflow-hidden border border-white/15 bg-[#12151c] shadow-2xl outline-none sm:rounded-3xl ${size}`}
        >
          <div className="flex items-center gap-1 border-b border-white/10 py-1 pl-5 pr-2">
            <p className="mr-auto truncate text-[14px] font-semibold text-text">DealDesk prototype</p>
            <a href={OPEN} target="_blank" rel="noopener noreferrer" aria-label="Open in Figma (new tab)" title="Open in Figma" className={ctl}>
              <ExternalLink size={17} aria-hidden />
            </a>
            <button type="button" aria-label="Minimize" title="Minimize" onClick={() => setState('min')} className={ctl}>
              <Minus size={18} aria-hidden />
            </button>
            <button type="button" aria-label={big ? 'Restore size' : 'Maximize'} title={big ? 'Restore size' : 'Maximize'} onClick={() => setBig((b) => !b)} className={ctl + ' max-sm:hidden'}>
              {big ? <Minimize2 size={16} aria-hidden /> : <Maximize2 size={16} aria-hidden />}
            </button>
            <button type="button" aria-label="Close" title="Close (Esc)" onClick={close} className={ctl}>
              <X size={18} aria-hidden />
            </button>
          </div>
          <div className="relative min-h-0 flex-1 bg-black">
            {!loaded && (
              <p role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[14px] text-muted">
                <span className="dd-spinner" aria-hidden /> Opening the prototype…
              </p>
            )}
            <iframe title="DealDesk Figma prototype" src={src} onLoad={() => setLoaded(true)} allowFullScreen className="relative size-full border-0" />
          </div>
          <a href={OPEN} target="_blank" rel="noopener noreferrer" className="mx-3 mt-2 flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-lavender px-4 text-center text-[13px] font-semibold text-indigo sm:hidden">
            For a better experience, open it in the Figma app <ExternalLink size={14} aria-hidden />
          </a>
          <p className="px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 text-center text-[12px] text-muted/80">Prototype · fictional data · nothing is sent</p>
        </div>
      </div>
      {state === 'min' && (
        <div className="dd-pop fixed bottom-4 right-4 z-[120] flex items-center gap-1 rounded-full border border-white/15 bg-[#12151c] p-1 shadow-2xl">
          <button ref={restore} type="button" onClick={() => setState('open')} className="flex min-h-[44px] items-center gap-2 rounded-full px-4 text-[14px] font-semibold text-text hover:bg-white/12">
            <Maximize2 size={15} aria-hidden /> Open prototype
          </button>
          <button type="button" aria-label="Close prototype" title="Close" onClick={close} className={ctl}>
            <X size={17} aria-hidden />
          </button>
        </div>
      )}
    </>
  )
}
