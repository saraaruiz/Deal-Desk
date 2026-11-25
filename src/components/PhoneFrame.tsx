import { cn } from '@/lib/utils'
import { LoopVideo } from '@/components/LoopVideo'

/**
 * iPhone 16 Pro frame (Black Titanium), proportions measured from the Figma frame (426 × 881.27).
 * The app screen is always the exported PNG from the prototype. It is never rebuilt in code.
 * Sized by its container width; radii use container units so it scales cleanly.
 */
export function PhoneFrame({
  src,
  alt,
  className,
  eager,
  imgRef,
  stack,
  video,
  activeIndex,
}: {
  src?: string
  alt?: string
  className?: string
  eager?: boolean
  imgRef?: React.Ref<HTMLImageElement>
  /** Several screens layered in the same frame (cross-faded from outside via [data-screen]). */
  stack?: { src: string; alt: string; video?: string }[]
  /** Screen recording for the single-screen case */
  video?: string
  /** With a stack: which screen is the active one (only that one plays). Omit to play by visibility. */
  activeIndex?: number
}) {
  return (
    <div className={cn('relative w-full [container-type:inline-size]', className)} style={{ aspectRatio: '426 / 881.27' }}>
      {/* side buttons */}
      {[
        [180.8, 40.3],
        [251.4, 65.7],
        [335, 65.7],
      ].map(([t, h], i) => (
        <span
          key={i}
          aria-hidden
          className="absolute left-0 rounded-[0.5cqw] bg-[#434343]"
          style={{ top: `${(t / 881.27) * 100}%`, height: `${(h / 881.27) * 100}%`, width: '1.8%' }}
        />
      ))}
      <span aria-hidden className="absolute right-0 rounded-[0.5cqw] bg-[#434343]" style={{ top: '31.1%', height: '11.8%', width: '1.8%' }} />
      {/* titanium body */}
      <div
        aria-hidden
        className="absolute inset-y-0"
        style={{
          left: '0.6%',
          right: '0.6%',
          borderRadius: '17.5cqw',
          background: 'linear-gradient(145deg,#5a5a5e,#2d2d30 45%,#47474b)',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.35), 0 40px 80px -20px rgba(20,26,68,.8)',
        }}
      />
      {/* bezel */}
      <div
        aria-hidden
        className="absolute bg-black"
        style={{ left: '2%', right: '2%', top: '0.66%', bottom: '0.66%', borderRadius: '16.2cqw', boxShadow: '0 -1px 3px 2px rgba(255,255,255,.18)' }}
      />
      {/* screen */}
      <div
        className="absolute overflow-hidden bg-bg"
        style={{ left: '3.79%', top: '1.6%', width: '92.06%', height: '96.75%', borderRadius: '12.6cqw' }}
      >
        {(stack ?? [{ src: src!, alt: alt!, video: video }]).map((s, i) => (
          <div key={s.src} data-screen={i} className="absolute inset-0">
            {/* static exported screen: always there (poster + reduced-motion + video fallback) */}
            <img
              ref={i === 0 ? imgRef : undefined}
              src={s.src}
              alt={s.alt}
              width={780}
              height={1688}
              loading={eager ? 'eager' : 'lazy'}
              fetchPriority={eager ? 'high' : 'auto'}
              decoding="async"
              draggable={false}
              className="block h-full w-full object-cover"
            />
            {/* the real screen recording plays on top while it is the active / visible one */}
            {s.video && (
              <LoopVideo
                src={s.video}
                poster={s.src}
                label={`Screen recording: ${s.alt}`}
                playing={activeIndex === undefined ? undefined : activeIndex === i}
              />
            )}
          </div>
        ))}
      </div>
      {/* Dynamic Island */}
      <span
        aria-hidden
        className="absolute bg-black"
        style={{ left: '35.7%', top: '3.2%', width: '28.5%', height: '4%', borderRadius: '99px' }}
      />
    </div>
  )
}
