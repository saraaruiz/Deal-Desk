# DealDesk homepage

Cinematic, accessible, responsive homepage for **DealDesk** (fictional product, *Project Harbor*).
Built from the Figma file `jgldLsdlZKwrYC2xhzIm7k` (desktop `316:5948`, mobile `372:86`).

**Stack:** Vite · React 19 · TypeScript · Tailwind v4 · shadcn structure · GSAP + ScrollTrigger · Lenis · Inter (variable).
React 19 is required: the 21st.dev components hoist `<style href precedence>` into `<head>`.

## Run, build, deploy

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build -> dist/
npm run preview    # serve dist/ locally
```

Deploy: push the folder to Vercel or Netlify. Both detect Vite (build `npm run build`, output `dist`). `vercel.json` is included.

## Where things live

```
src/
  components/ui/      warp-carousel.tsx · team-invite.tsx   (21st.dev, shadcn path)
  components/         PhoneFrame · ShaderBackground · bits (Logo, Chip, MagneticLink, ScrollProgress, FilmGrain, SkipLink)
  sections/           Hero · DealsOneSend · RightPeople · FourMoments · TeamFits · Inside · Limits · Invitation · Footer
  lib/                shaderManager.ts (one shared WebGL1 context) · meshFrag.ts (exact fragment shader) · motion.ts (Lenis, ScrollTrigger, hooks)
  content/            copy.ts (all text, from Figma) · cards.ts (Warp Carousel cards)
public/assets/        screens/*.png (exported from Figma) · logo-mark.svg · video1-poster.png
```

### Why `components/ui`
shadcn's CLI and every 21st.dev snippet import from `@/components/ui/...`. `components.json` maps that alias to `src/components/ui`, so `npx shadcn add <x>` drops files in the right place and imports resolve without edits. The `@` alias is set in `vite.config.ts` and `tsconfig.app.json`.

## Assets to drop in
| File | Used by | Fallback today |
|---|---|---|
| `public/assets/video/jordan.mp4` | Section 1: Jordan's film, starts by itself WITH sound when on screen (muted + notice if the browser refuses). Mute, pause, skip on top | Poster only |
| `public/assets/video1-poster.webp` | Section 1 poster | Placeholder exported from Figma (ASSET A3). Replace it (same path) when you have the real poster |
| `public/assets/video/motion-reel.mp4` + `.jpg` | Last section (Look twice. Send once.), muted loop | Poster only |
| `public/assets/video/moment-draft / review / ask / send .mp4` + `.jpg` | Section 3, inside the phone, one clip per moment | Static exported screen |

The phone clips in "One message, four moments" are scrubbed by scroll, so they are encoded with a keyframe every 3 frames (`-g 3 -keyint_min 3`). Jordan's film just plays, so it uses a normal encode.

## CTA
Every "Try the sample review" points at `href="#prototype"`. Replace it with the real prototype link (search for `#prototype`).

See `MOTION-SPEC.md` (every animation) and `SIMULATED.md` (what is fictional).
