import { deals } from '@/content/copy'
import { FilmPlayer } from '@/components/FilmPlayer'
import { Words } from '@/components/Words'

// Jordan's story, final cut: 26.5 s, 16:9, with its sound design and music. See components/FilmPlayer.tsx for the player.
const SRC = '/assets/video/jordan.mp4'
const POSTER = '/assets/video1-poster.webp'
const TRANSCRIPT =
  "Several deals open. One more message to send. Who's on Harbor again? Pat, Alex… Sam? It looks ready. Is it? DealDesk already checked who's on the deal. Sam Lee isn't on this deal. Sam removed. Nothing leaves until you tap Send. Ready. Sent. Nothing else to remember. A second pair of eyes. Prototype, fictional data, AI-generated character."

const player = {
  src: SRC,
  poster: POSTER,
  posterAlt: 'Jordan walks out of an office building at dusk, checking his watch.',
  label: "Video: Jordan's story, 26 seconds, with sound. The words are on screen; the full text is below.",
  transcript: TRANSCRIPT,
  skipTo: 'moments',
  skipLabel: 'Skip the film and go to How it works',
}

/*
 * The film does NOT pin or hold the scroll. It sits on a soft stage (a blurred copy of its poster with a subtle blue / purple glow, so
 * there is no flat grey around it, above all on phones), and once it is playing, scrolling on turns it into a corner mini player.
 */
export function DealsOneSend() {
  return (
    <section id="deals" aria-labelledby="deals-title" className="relative overflow-hidden bg-bg py-16 lg:py-[110px]">
      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-6 lg:flex-row lg:items-end lg:justify-between lg:px-0">
        <h2 id="deals-title" className="h-display text-text">
          <Words lines={deals.title} gradientLast />
        </h2>
        <p className="h-lede max-w-[440px] text-muted lg:pb-2">{deals.line}</p>
      </div>

      <div className="relative mt-6 flex min-h-[70svh] items-center py-10 sm:px-6 lg:mt-10 lg:min-h-0 lg:py-16">
        <div aria-hidden className="film-stage">
          <img src={POSTER} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="relative mx-auto w-full max-w-[1200px]">
          <FilmPlayer dock wide {...player} />
        </div>
      </div>
    </section>
  )
}
