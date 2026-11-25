import { deals } from '@/content/copy'
import { FilmPlayer } from '@/components/FilmPlayer'
import { Words } from '@/components/Words'

// Jordan's story: 19 s, 16:9, with its sound design and music. Plays by itself WITH sound when it is mostly on screen
// (muted + a notice if the browser refuses), with sound / pause / skip on top. See components/FilmPlayer.tsx.
const TRANSCRIPT =
  "Several deals open. One more message to send. Who's on Harbor again? Pat, Alex… It looks ready. Is it? DealDesk already checked who's on the deal. Sam removed. Nothing leaves until you tap Send. Sent. Nothing to remember. A second pair of eyes. Prototype, fictional data, AI-generated character."

export function DealsOneSend() {
  return (
    <section id="deals" aria-labelledby="deals-title" className="relative overflow-hidden bg-bg px-6 py-24 lg:px-[120px] lg:py-[130px]">
      <div aria-hidden className="pointer-events-none absolute -left-[200px] top-[300px] size-[700px] rounded-full bg-glow-1/25 blur-[120px] max-md:hidden" />
      <div className="relative mx-auto w-full max-w-[1200px]">
        <h2 id="deals-title" className="text-[clamp(40px,5vw,72px)] font-extrabold leading-[1.04] tracking-[-0.02em] text-text">
          <Words lines={deals.title} />
        </h2>
        <p className="mt-5 max-w-[520px] text-[clamp(17px,1.5vw,22px)] leading-[1.5] text-muted">{deals.line}</p>

        <FilmPlayer
          className="mt-10 lg:mt-14"
          src="/assets/video/jordan.mp4"
          poster="/assets/video1-poster.webp"
          posterAlt="Jordan walks out of an office building at dusk, checking his watch."
          label="Video: Jordan's story, 19 seconds, with sound. The words are on screen; the full text is below."
          transcript={TRANSCRIPT}
          skipTo="moments"
          skipLabel="Skip the film and go to How it works"
        />
      </div>
    </section>
  )
}
