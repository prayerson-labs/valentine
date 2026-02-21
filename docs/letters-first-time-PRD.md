# letters / first-time
## Product Requirements Document

*a small collection of things i didn't want to forget*

Version 1.3 · February 2026

---

## Overview

`first-time` is a single-page web experience — a personal letter rendered as a slow, quiet reading. Not an app. Not a product. The page feels like finding a note someone left open on their desk: warm, unhurried, a little fragile.

The reader does nothing except read. Every interaction is discoverable, never announced. No calls to action. No redirects. No controls.

---

## Repository Structure

Inside the `valentine` repository:

```
valentine/
└── letters/
    └── first-time/
        ├── first-time.html      ← single self-contained file
        └── audio/
            └── letter-1-music.mp3  ← drop your ambient track here
```

No build step. No bundler. No framework. No external JS beyond Google Fonts. Open `first-time.html` directly in a browser or serve the folder from any static host.

---

## Screen Flow

```
[SPLASH]  →  user clicks "continue"  →  [LETTER types out]  →  [page rests]
```

### Splash Screen

Covers the full viewport on load. Two elements, vertically centred:

1. Eyebrow text: `a small collection of things i didn't want to forget` — Inter 300, 0.63rem, tracking 0.15em, muted
2. Button: `continue` — Cormorant Garamond 300 italic, 1.05rem, dotted underline, no chrome

Eyebrow fades in at ~0.5s delay, button at ~1.6s. Both use a gentle upward fadeUp animation.

On click: splash fades out over 900ms → letter page fades in → audio starts → stars begin spawning → typewriter begins.

### Letter Page

Scrollable, not fixed height. Vertically centred on first load via padding (not flexbox on body). Auto-scrolls to keep the blinking cursor in view as text grows — triggers when cursor is within 130px of viewport bottom via `window.scrollBy({ behavior: 'smooth' })`.

---

## Title Block

When the letter page fades in, before typing begins, a title block appears at the top. Fades in over 1.2s with a gentle upward drift (`titleReveal` keyframe animation).

Two elements stacked, centre-aligned:

1. `a letter` — Inter 300, 0.6rem, uppercase, letter-spacing 0.22em, muted colour
2. `the first time & how it started` — Cormorant Garamond 300, `clamp(2rem, 6vw, 3.2rem)`, line-height 1.15

The `&` is styled separately: italic, colour `#9a8fb8` (muted violet). Editorial and minimal — the title feels typographic, not decorative.

The title does not animate again once visible.

---

## Letter Content

Displayed via typewriter effect. Never pre-rendered. One character appended at a time via JS.

```
i first saw you sitting in the conference room on your orientation day.

you have eyes that catch attention.

they way they say, aankhon mein teri, ajab si ajab si adayein hain

the second time was a company [reel].

i never imagined i would get a chance to really know you.
but God had other plans.

he gave me a seat beside you.
they say ram knew, the moment he saw sita in the garden.

i won't pretend i was happy about it at first.
moving away from my team felt like loss.
but the day i noticed you were there,
something in me settled.

the first two days were hard.
the introvert in me didn't know how to begin.

then you started it. on the third day.

and since then, although my work suffered a little,
my heart was happy dancing.

so yeah.
that's how it started.
```

### Inline Special Elements

**Reel link** — `[reel]` in the raw text is replaced with a live `<a>` tag. Styled with a dotted underline only — `color: inherit`, `border-bottom: 1px dotted`, no colour change, no visited state, opens in new tab. Replace `YOUR_REEL_URL_HERE` before deploy (appears twice in the JS).

**Song line** — `they way they say,` types in normal weight. Then `aankhon mein teri, ajab si ajab si adayein hain` types in italic inside an `<em>` element, colour `#b8a898` (warm muted). Same character-by-character timing as the rest of the letter. Implemented as a separate `italic` segment type in the parser.

**Ramayana line** — `they say ram knew, the moment he saw sita in the garden.` — plain prose, no call-out, no annotation, same voice as the rest of the letter. Sits on the line immediately after `he gave me a seat beside you.` with no paragraph gap.

### Typewriter Timing

| Character | Delay |
|---|---|
| `.` | 480ms |
| `,` | 200ms |
| `\n\n` (paragraph break) | 850ms |
| All other | 40ms |

Cursor: 1px wide blinking vertical line, `step-end` animation, 1.1s cycle. On completion: fades out over 1.2s via CSS transition.

---

## Background & Visual Design

The background is the priority. Modern, considered, easy on the eyes. Not paper. Not retro. Clean depth with warmth.

*Mood reference: Linear.app, Craft dark mode — but warmer and more personal. Reading by the light of a good monitor in a dim room.*

### Layer Stack

**Base** — `body { background: #0f0e11 }` — near-black with a barely-there purple undertone.

**Gradient layer** — `body::before`, fixed to viewport, three radial gradients:
- Soft violet bloom at top: `rgba(99, 78, 143, 0.18)`
- Warm amber breath at bottom-left: `rgba(180, 120, 80, 0.10)`
- Cool blue whisper at bottom-right: `rgba(60, 100, 140, 0.09)`

**Film grain** — `body::after`, fixed, inline SVG `feTurbulence` filter, opacity `0.038`, `background-size: 180px`. Barely visible — felt not seen.

**Evening mode** — after the letter finishes, `body.evening` class is added. The violet bloom intensifies to `0.28`, body background deepens to `#0a090d`. Transition: 40 seconds linear.

### Colour Tokens

| Token | Value | Usage |
|---|---|---|
| `--ink` | `#e8e2d9` | Letter body text |
| `--ink-muted` | `#6e6a72` | Eyebrow, footer, secondary |
| `--star` | `#8a7fa0` | Star dots |
| `--cursor` | `#c8c0b8` | Typewriter cursor |
| `--note-bg` | `rgba(22, 20, 28, 0.92)` | Annotation tooltip bg |
| `--thought-bg` | `rgba(22, 20, 28, 0.85)` | Star thought bubble bg |
| `--note-text` | `#d4cec8` | Text inside notes and thoughts |
| `--continue-text` | `#7a7280` | Continue button colour |

---

## Typography

Google Fonts import:
```
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400
```

| Role | Font | Weight | Size |
|---|---|---|---|
| Title eyebrow | Inter | 300 | 0.6rem, tracking 0.22em, uppercase |
| Title main | Cormorant Garamond | 300 | clamp(2rem, 6vw, 3.2rem) |
| Splash eyebrow | Inter | 300 | 0.63rem, tracking 0.15em |
| Continue button | Cormorant Garamond | 300 italic | 1.05rem |
| Letter body | Cormorant Garamond | 300 | clamp(1.1rem, 2.6vw, 1.42rem), line-height 2.2 |
| Song line italic | Cormorant Garamond | 300 italic | same as body, colour #b8a898 |
| Annotation notes | Cormorant Garamond | 300 italic | 0.8rem |
| Thought bubbles | Cormorant Garamond | 300 italic | 0.93rem |
| Footer | Inter | 300 | 0.62rem, tracking 0.13em |

---

## Audio

Starts on `continue` click/tap — required for browser autoplay policy on iOS and Android. No visible controls. No mute button. Music simply exists underneath the reading.

```
File:    valentine/letters/first-time/audio/letter-1-music.mp3
Loop:    yes
Volume:  0.15  (range 0.12–0.18)
```

Implementation: Web Audio API — `AudioContext` → `GainNode` → `destination`. The `<Audio>` element is connected as a media source.

Drop the `.mp3` into the `audio/` folder before deploying.

---

## Stars — Living Sky

18 faint star dots appear across the upper ~62% of the screen. They begin spawning the moment typing starts, staggered over the first ~9 seconds (one every ~500ms + random offset). Each star breathes independently on its own cycle — never in sync.

### Breathing Cycle (per star)

1. Fade in to peak opacity (`0.30–0.70`) over `1200–3200ms`
2. Hold at peak for `800–3500ms`
3. Fade out to near-zero (`0.02`) over `1000–3000ms`
4. Pause `600–3600ms`
5. Repeat indefinitely

Each star has a randomised size (`1.8–4px` diameter). Stars are distributed across the full width, upper 62% of viewport height.

### Star Interactions

Every star is clickable and tappable. Clicking reveals a floating thought bubble just below it — fades in, holds, fades out over 3 seconds total.

On mobile, each star has an invisible `18×18px` tap target (the visible dot sits centred inside it) so they're reliably tappable without pixel precision.

**Thought pool** (selected randomly per click):

```
God put you right there and i almost didn't notice
the third day changed everything
i wasn't supposed to move seats. funny how that worked out
i hope my work gets better. it hasn't yet
you started talking first. i was too scared
some things you don't plan. they just happen on a monday
```

---

## Margin Annotations

Three phrases in the letter get a subtle dotted underline after typing completes. Clicking or tapping reveals a note for 2.5 seconds then it disappears.

| Phrase | Note |
|---|---|
| `catch attention` | you didn't try. that was the point. |
| `something in me settled` | that's when everything changed |
| `heart was happy dancing` | the best kind of distraction |

One note visible per phrase at a time. If already showing, ignore the click. Notes appear above the phrase, centred, with a fade-in/fade-out animation. On mobile, notes clamp to `max-width: 200px` with `white-space: normal`.

---

## Ambient Dust Particles

38–40 very faint particles drift slowly upward on a fixed canvas layer. Start after typing completes.

```
Radius:   0.3–1.5px
Speed:    0.06–0.26px per frame upward
Opacity:  0.015–0.07
Drift:    ±0.14px horizontal per frame
Colour:   rgba(200, 190, 210, opacity)  — faint violet-white
```

Particles reset to the bottom of the screen when they exit the top.

---

## Footer

Text: `no response needed.`

Sits at the true bottom of the document — inside `.scroll-wrap`, not fixed to the viewport. Only visible when the reader has scrolled to the end of the letter. Fades in over 2s after typing completes, opacity `0.55`.

Inter 300, `0.62rem`, tracking `0.13em`, colour `#8a7d6a`.

---

## Mobile Friendliness

The experience is fully functional on phones. The letter is meant to be read at night on a phone screen — every feature works on touch.

### Breakpoint ≤ 480px

| Property | Desktop | Mobile |
|---|---|---|
| Side padding | 36px | 22px |
| Top padding | 88px | 56px |
| Letter line-height | 2.2 | 2.05 |
| Title font size | clamp(2rem, 6vw, 3.2rem) | clamp(1.7rem, 8vw, 2.4rem) |
| Title bottom margin | 72px | 52px |

### Breakpoint ≤ 360px

- Side padding: `18px`
- Title font size: `1.6rem`

### Touch Specifics

- Stars have invisible `18×18px` tap targets — the visual dot is centred inside
- Thought bubbles: `white-space: normal`, `max-width: calc(100vw - 40px)`, centred text
- Annotation notes: `white-space: normal`, `max-width: 200px`
- Auto-scroll keeps the cursor in view throughout — no manual scrolling needed at any point
- Audio starts on the `continue` tap, satisfying iOS and Android autoplay policy

---

## Layout

```
max-width:     620px, centred
text-align:    center
padding:       88px top, 150px bottom, 36px sides (desktop)
               56px top, 120px bottom, 22px sides (mobile ≤480px)
               48px top, 100px bottom, 18px sides (mobile ≤360px)
```

---

## Z-Index Stack

| Layer | z-index |
|---|---|
| Background gradients (`body::before`, `body::after`) | 0 |
| Dust particles canvas | 2 |
| Stars (`#sky`) | 3 |
| Letter + title (`.scroll-wrap`) | 4 |
| Thought bubbles | 5 |
| Footer | 6 |
| Splash screen | 20 |

---

## Hard Constraints

This page must never:

- Autoplay audio without a user gesture
- Animate anything aggressively or draw attention to itself
- Show a call to action
- Redirect anywhere
- Require manual scrolling (auto-scroll handles it)
- Use any framework, bundler, or external JS
- Restart any timer or loop the letter

---

## Deploy Checklist

- [ ] Create `valentine/letters/first-time/` in your repo
- [ ] Create `valentine/letters/first-time/audio/` and drop `letter-1-music.mp3` inside
- [ ] Place `first-time.html` in `valentine/letters/first-time/`
- [ ] Replace `YOUR_REEL_URL_HERE` (appears twice in the JS) with the actual video URL
- [ ] Serve from any static host — no build step needed

---

*that's how it started.*
