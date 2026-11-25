# Motion spec

Global easing token: `cubic-bezier(.22,1,.36,1)` (GSAP `expo.out` for tweens, `none` for scrubbed timelines). Duration 500 to 900 ms for reveals. Only `transform` and `opacity` animate, except the clip-path curtain (requested) and the spotlight gradient position.
Reduced motion (`prefers-reduced-motion: reduce`): no Lenis, no scrub, no pin, no autoplay, shader draws one still frame, Warp Carousel is replaced by the static swipe list, Team Invite is a still frame.
Mobile / low-power / coarse pointer: same rules as reduced motion for scrub and WebGL carousel; reveals still play.

| # | Section | Trigger | What moves | Duration / easing | Reduced motion | Parallax |
|---|---|---|---|---|---|---|
| 1 | Global | Page load | Lenis smooth scroll synced to ScrollTrigger | lerp 0.1 | Not created (native scroll) | n/a |
| 2 | Global | Scroll | 2 px lavender progress line `scaleX 0 → 1` | Scrubbed, none | Same, no smoothing | n/a |
| 3 | Global | Static | Film grain overlay, 4% opacity | None (static) | Same | n/a |
| 4 | Hero | Load | Shader canvas fades in (opacity 0 → 1) | 1.2 s, token | Instant, still frame | n/a |
| 5 | Hero | Load | H1 lines rise from a mask (`yPercent 105 → 0`), stagger 0.12 | 0.9 s expo.out, t = 0.15 s | Final state | n/a |
| 6 | Hero | Load | Subline, buttons, micro-line fade + rise (y 18 → 0) | 0.7 s expo.out, t = 0.75 to 1.1 s | Final state | n/a |
| 7 | Hero | Load | iPhone (screen G11) rises (y 140 → 0, scale .96 → 1, opacity) | 1.2 s expo.out, t = 1.0 s | Final state | n/a |
| 8 | Hero | Load | Two chips fade in from the sides (x ±24 → 0) | 0.8 s expo.out, t = 1.8 s | Final state | n/a |
| 9 | Hero | Scroll (desktop) | Phone tilts `rotateX 0 → 6°` and moves `y 0 → -90` | Scrubbed 0.6, none | None | Phone slow Z/Y parallax; ghost wordmark `y 0 → 120` |
| 10 | Hero / Invitation | Pointer | Shader cursor swirl (strength 27, radius 89) | Presence lerp 0.08 | Disabled | n/a |
| 11 | 1 Several deals | Scroll (desktop) | Pinned 100vh (+400%). Video `currentTime = progress × duration`. Title `scale 1 → .62`, `y -70`; video box `scale 1 → 1.1` | Scrubbed 0.4, none | No scrub, no pin | Video box moves `y -40` |
| 12 | 1 Several deals | Scroll (desktop) | Six captions cross-fade in sync (opacity + y 12 → 0) | 0.5 s token | Captions stacked as a list | n/a |
| 13 | 1 Several deals | Mobile | Muted autoplay loop with poster, tap to pause. Poster-only if the file is missing | n/a | Same | n/a |
| 14 | 2 Right people | Enter view | Title lines, line and stage rise (y 40 → 0) | 0.9 s expo.out, stagger 0.1 | Final state | n/a |
| 15 | 2 Right people | Near viewport | Warp Carousel lazy-mounts. Autoplay 3.8 s, step 1, warp 1. Pauses on hover/focus, arrow keys, drag | Component's own spin curve | Static swipe list (CSS gradients) | Lens flare is the component's |
| 16 | 3 Four moments | Scroll (desktop) | Pinned 100vh (+300%). One phone swaps H5 → G9 → A1 → G17 (outgoing opacity 1 → 0, y -28; incoming 0 → 1, y 28 → 0) | 0.3 of a step, scrubbed 0.5, none | Swipe row of 4 phones, no pin | Phone is static, content moves |
| 17 | 3 Four moments | Scroll (desktop) | Dotted connector draws (`stroke-dashoffset 1 → 0`), labels light up, step line cross-fades | Scrubbed, none | Static labels | n/a |
| 18 | 4 Fits your team | Enter view | Title rises; role rows slide in one by one (x 24 → 0) | 0.8 s expo.out, stagger 0.1 / 0.12 | Final state | n/a |
| 19 | 4 Fits your team | Loop | Team Invite: avatar dragged into the slot, dashed line turns solid, status dot lights up | 4.4 s CSS keyframes, infinite | Still frame of the waiting state | n/a |
| 20 | 5 Inside | Enter view | Title, then 6 cards reveal staggered (y 48 → 0) | 0.9 s expo.out, stagger 0.09 | Final state | n/a |
| 21 | 5 Inside | Pointer over card | Lavender spotlight follows the cursor (gradient position, opacity 0 → 1) | 0.5 s token | Shows on hover, does not follow | n/a |
| 22 | 6 Limits | Scroll (desktop) | Dark → light curtain: `clip-path inset(10% 5% 0 5% round 64px) → inset(0)` | Scrubbed, none | None (appears light) | n/a |
| 23 | 6 Limits | Scroll (desktop) | Light → dark out: bottom edge closes to `inset(0 5% 10% 5% round 0 0 64px 64px)` | Scrubbed, none | None | n/a |
| 24 | 6 Limits | Enter view | Header, then four limits reveal one by one (y 40 → 0) | 0.8 s expo.out, stagger 0.14 | Final state | n/a |
| 25 | 7 Invitation | Scroll | Big title `scale .86 → 1`, opacity .2 → 1 | Scrubbed, none | None | n/a |
| 26 | 7 Invitation | Enter view | Line, CTA, micro-line and phone rise (y 40 → 0) | 0.9 s expo.out, stagger 0.12 | Final state | n/a |
| 27 | 7 Invitation | Pointer (desktop) | Magnetic CTA follows the cursor, max 8 px | 0.5 s expo.out (quickTo) | Disabled | n/a |

Smart Animate notes for Figma: keep layer names identical between frames for rows 5 to 8 (hero), 16 (phone screens) and 22 to 23 (curtain), and use `Ease out (custom 0.22, 1, 0.36, 1)`.

## Visual upgrade (glass + interactions)

| # | Section | Trigger | What moves | Duration / easing | Reduced motion / touch | Parallax |
|---|---|---|---|---|---|---|
| 28 | Global | Pointer (desktop) | Custom cursor: dot + trailing ring; ring grows 1.9x over links/buttons and shrinks on press. Native cursor stays visible | dot 0.12 s, ring 0.45 s power3.out | Not mounted | n/a |
| 29 | Global | Scroll up past 520 px | Floating glass pill nav slides in (y -160% to 0) and hides on scroll down | 0.7 s token | Shows/hides without slide; inert while hidden | n/a |
| 30 | Global | Enter view | Every headline reveals word by word out of a mask, un-blurring (yPercent 115 to 0, blur 10px to 0) | 1 s expo.out, stagger 0.045 | Final state | n/a |
| 31 | After hero | Always on screen | Marquee of the four states (Ready, Pending, Sent, Outdated), seamless loop, pauses on hover | 28 s linear | Static row | n/a |
| 32 | Glass cards (Inside, Team, Limits) | Pointer over card | 3D tilt up to 5 deg, scale 1.015, specular sheen + rim glow follow the cursor | 0.6 s power3.out, spring back 0.8 s expo.out | No tilt; sheen on hover only | Children with `.depth` shift up to 12 px in x/y and 18 px in z |
| 33 | Hero | Pointer over hero | Phone turns toward the cursor (rotationY ±8, rotationX ±5); the two chips drift the opposite way (up to 22 px) | 0.9 s power3.out | None | Chips = counter-parallax layer |
| 34 | Hero | Always | Chips bob gently (translateY 0 to -8 px) | 6 s ease-in-out, infinite | None | n/a |
| 35 | All buttons | Hover | Light sheen sweeps across, button lifts 2 px and glows | 0.9 s / 0.5 s token | Instant | n/a |
| 36 | Inside, Limits | Always | Colour orbs behind the glass drift slowly | 22 s ease-in-out, infinite | None | n/a |
| 37 | Limits | Hover on a row | Icon rotates -12 deg and scales 1.1 | 0.5 s token | Instant | n/a |
## Videos

| # | Section | Trigger | What moves | Duration / easing | Reduced motion / touch | Parallax |
|---|---|---|---|---|---|---|
| 38 | 2 Right people | Visible (>= 35%) | Motion reel (16:9, no audio) plays muted in a glass frame, loops; pause button | 15 s loop | Poster only until the person presses play | Frame tilts 2 deg on hover |
| 39 | 3 Four moments | Scroll (desktop pin) | The phone plays the real screen recording of the active moment (Draft, Review, Ask, Send); the others pause. Cross-fade as in row 16 | Clips of 8 to 14 s, looped | Static exported screens | n/a |
| 40 | 3 Four moments | Mobile swipe | Each phone plays its clip while it is on screen | Same clips | Static screens | n/a |
| 41 | 7 Invitation | Visible | The final phone plays the clean path (message to Pat, Ready, Send, Sent) | 8 s loop | Static G11 screen | n/a |
## Revision 2 (less noise, more cinema)

Removed: rows 28 (custom cursor) and 31 (states marquee); row 36 orbs now only on dark sections and very slow; the Limits white curtain (rows 22 and 23) is replaced by row 42.
Cards (rows 32 to 33) are now near-solid dark surfaces with a hairline rim: same tilt (max 3 deg) and faint cursor sheen, no backdrop blur.

| # | Section | Trigger | What moves | Duration / easing | Reduced motion / touch | Parallax |
|---|---|---|---|---|---|---|
| 42 | 6 Limits | Scroll | A hairline of light draws across the top edge (scaleX 0 to 1 from the centre) | Scrubbed, none | Fully drawn | n/a |
| 43 | Hero | Scroll | Giant "DealDesk" wordmark glides sideways (x 8vw to -22vw) | Scrubbed, none | None | Slowest layer |
| 44 | Hero | Scroll | Phone rises faster (y -170, scale 1 to 1.05, rotateX 7 deg); panel behind it -50 px; chips -110 / -60 px | Scrubbed 0.8, none | None | Three depth layers |
| 45 | 3 Four moments | Scroll (desktop pin, +400%) | Each phone clip is SCRUBBED by scroll: clip i time = progress inside step i x duration. Earlier clips rest on their last frame, later ones on their first | Scrubbed 0.5, none | Clips play on their own (swipe row) | n/a |
| 46 | 5 Inside | Scroll | Big phone (plays the Review recording) drifts y 40 to -50 against the page | Scrubbed 0.8, none | None | Phone vs card |
| 47 | 4 Fits | Enter view | Vertical connector between the roles draws down (scaleY 0 to 1) | 1.4 s expo.out | Final state | n/a |
| 48 | 7 Invitation | Always (desktop) | Soft conic halo behind the phone turns slowly | 40 s linear | None | n/a |
## Revision 3 (flow reduced, videos re-ordered)

Page flow is now: Hero, 1 Jordan's film, 2 Four moments, 3 Fits your team, 4 Inside every review, 5 Limits, 6 Look twice. Send once. (with the Motion reel).
The "Right people / Right words / Latest version" section (Warp Carousel) is no longer rendered: its three ideas are already the Recipients, Wording and After-an-edit cards in section 4. Files are kept (`src/sections/RightPeople.tsx`, `src/components/ui/warp-carousel.tsx`) so it can be brought back.
Rows 11, 12, 13 and 41 are replaced by:

| # | Section | Trigger | What moves | Duration / easing | Reduced motion / touch | Parallax |
|---|---|---|---|---|---|---|
| 49 | 1 Jordan's film | >= 55% visible | Film starts by itself WITH sound; if the browser refuses, it starts muted and shows "Sound is off · tap to turn it on". Pauses when it leaves the view. Controls on top: mute, pause / replay, skip (scrolls to How it works) | 19 s, plays once, progress hairline | Does not autoplay; the person presses play | Frame scales .94 to 1 on entry |
| 50 | 6 Last section | Visible | Motion reel plays muted in a loop (pause button), then the CTA | 15 s loop | Poster until play is pressed | n/a |
| 51 | 2 Four moments | Scroll (pin) | Pin shortened from +400% to +320% | Scrubbed | Swipe row | n/a |
## Revision 4 (Coverflow + team orbit)

Row 20 to 21 and 46 (the old Inside bento) are replaced by:

| # | Section | Trigger | What moves | Duration / easing | Reduced motion / touch | Parallax |
|---|---|---|---|---|---|---|
| 52 | 4 Inside | Drag, flick, arrows, dots | Coverflow: centre card faces front, neighbours tilt back (rotateY up to 82 deg, translateZ recession, 14% fade per step), ring loops. A flick carries up to 2 cards | Exponential ease-out, 0.16 per frame | Only user-driven (nothing autoplays) | Depth from the 3D perspective |
| 53 | 4 Inside | Scroll into view | Carousel rises and fades in (y 60 to 0) | 1.1 s expo.out | Final state | n/a |
| 54 | 3 Fits | Click a person / arrows | Orbit: the ring turns the short way round to bring the person to the top; the person leaves the ring and appears in the centre card (pop-in) | 0.9 s token (ring), 0.5 s (card) | Instant | Counter-rotation keeps faces upright |
| 55 | 3 Fits | Click "Ask Dana to add" | Chip changes NOT ON HARBOR to PENDING, button to "Withdraw request". Nothing is sent | 0.5 s | Instant | n/a |
## Revision 5 (sideways moments, fewer repeats)

Replaces rows 16, 17, 45 (four moments), 52 (Coverflow dots) and 54 (orbit dots). The Team Invite is no longer rendered (file kept in `src/components/ui/team-invite.tsx`). Inside has 4 cards (Recipients and Ask the deal owner are covered by the deal-team orbit and by moment 3).

| # | Section | Trigger | What moves | Duration / easing | Reduced motion / touch | Parallax |
|---|---|---|---|---|---|---|
| 56 | 2 Four moments | Scroll (desktop pin, +320%) | SIDEWAYS: four phones in a row; the one at p is centred at full size, the others slide away (x = (i - p) x spacing), minimise (scale 1 to .58) and dim (opacity 1 to .4) | Scrubbed 0.6, none | Swipe row of 4 phones, no pin | Phones vs giant word |
| 57 | 2 Four moments | Scroll | Giant outlined step word (Draft / Review / Ask / Send) travels sideways at about 2x the phone speed and fades around the centre | Scrubbed, none | Not shown | Layer at 2x |
| 58 | 2 Four moments | Scroll | The centred phone's recording is scrubbed: time = (p - (i - .5)) x duration. Step sentence cross-fades under it; labels and a hairline show progress | Scrubbed, none | Clips play on their own | n/a |
| 59 | 3 Fits | Click "Ask Dana to add" | NOT ON HARBOR (red) becomes PENDING (yellow, #F5C451) with "Withdraw request"; ON HARBOR is green | 0.5 s | Instant | n/a |