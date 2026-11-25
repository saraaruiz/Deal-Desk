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