# Quality check (2026-11-25)

The final pre-launch pass for issue #14. Checks were scripted against the static build and the live site using
headless Chrome (`scripts/screenshot.mjs` and a keyboard-driver script), plus a full read of every sample brief.

## 1. Timed first visit (goal: open a target, see the fit score and generate a brief in under 3 minutes)

| Measure | Result |
|---|---|
| Live site, desktop, cold cache | First paint 0.17 s, interactive 0.14 s, loaded 0.23 s |
| Live site, phone (400 px), cold cache | First paint 0.34 s, loaded 1.3 s |
| Page weight | 291 kB, all files |
| Guided tour | 6 steps, about 290 words: about **75 seconds** of reading plus 6 clicks. The brief is generated at step 5, about **70 seconds** in |
| "Explore on my own" path | 4 clicks: landing → Emberline on the map → Decision brief tab → Generate |

Timings are on a fast connection; slow mobile networks will be slower. **Pass**, with a wide margin.

## 2. Keyboard-only use

| Check | Result |
|---|---|
| "Skip to content" is the first Tab stop | Pass |
| Every focused element shows a visible focus ring | Pass |
| Tour: Enter opens it, focus moves to the card, ← / → change steps, Esc closes | Pass |
| Target tabs: one Tab stop, ← / → / Home / End switch tabs | **Fixed**, then pass |
| Fit ratings: one Tab stop per criterion, arrow keys change the rating | **Fixed**, then pass |
| Tour arrow keys no longer hijack sliders, fields, tabs or ratings | **Fixed**, then pass |
| Footer dialogs: focus moves in, Esc closes, focus returns to the button | Pass |
| Add-company form: chips toggle with Space, errors are announced | Pass |

## 3. Contrast (WCAG 2.1 AA: 4.5:1 for text)

| Color pair | Before | After |
|---|---|---|
| Faint text, light mode | 3.3:1 | 5.3:1 |
| Faint text, dark mode | 4.45:1 | 5.0:1 |
| "Demo with fictional data" badge, light mode | 4.35:1 | 5.2:1 |
| All other text pairs, both modes | 4.6:1 or higher | unchanged |

Dark mode is the default. Its tour dimming was strengthened so the spotlight reads clearly.

## 4. Sample briefs (all 12 re-read)

Every number traces to the target's data (also enforced by `tests/briefs.test.ts`). Timings match what the app
shows, for example "more than three months" and Ashby's 97 days, or "past our 45-day rhythm" and Graywater's 52 days.
Fit lines match the calculated scores, and every brief ends with an owned next step.

| Finding | Fix |
|---|---|
| Wildmoor's "15th anniversary in about 11 weeks" would be its 16th (founded 2011), and the label drifts as dates move with the visit | Now "founding anniversary" in the seed and the brief |
| A Harborlight note mentioned a "40th anniversary" that didn't match its 1981 opening | Now "the store's anniversary" |
| Foilscope: "We haven't spoken with Nadia" left out that we'd heard her speak | Now mentions hearing her on an industry panel |

**Known limit:** Emberline's "12th-anniversary set" is correct for visits through late 2027.
