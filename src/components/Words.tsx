import { cn } from '@/lib/utils'

/**
 * Splits headline lines into words so they can be revealed one by one (see revealWords() in lib/motion.ts).
 * Real spaces stay between the words, so screen readers read the heading normally.
 */
export function Words({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <span data-words className={className}>
      {lines.map((line) => (
        <span key={line} className="block">
          {line.split(' ').map((w, i, a) => (
            <span key={i}>
              <span className="inline-block overflow-hidden pb-[0.12em] align-top">
                <span data-w className={cn('inline-block will-change-transform')}>
                  {w}
                </span>
              </span>
              {i < a.length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}
