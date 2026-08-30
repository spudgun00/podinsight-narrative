# Company Tracking — metrics-line date range

**30 Aug 2026.** One-line change, taken under `ENTITY_EXTRACTOR_SPEC.md`
§"One page fix, allowed". Governed by `../../../../UI_ACCEPTANCE.md`.

The component itself was accepted on 28 Aug (`../company-tracking/REPORT.md`);
this record covers only what changed, and re-runs the states around it.

---

## The defect

The metrics line printed the **library's** range — `Jan 2025–Aug 2026` — directly
above a coverage label reading `mentions through 23 Jun 2025`. Two different
periods, stated in adjacent lines, describing one set of numbers. The numbers
themselves were right; the range over them was borrowed from a different
population.

`rangeLabel` came from `SyntheaData.corpus()`, which reads `/api/signals` — the
episode corpus. The entity data behind the line stops on 23 Jun 2025.

## The fix

Each watchlist company's `period` is now stored from `/api/companies/{name}`,
which the API already computes as `min` and `max` of `published_at` **over that
company's own matched episodes** — the entity data the line summarises. The
metrics line takes the earliest first date and the latest last date across the
watchlist and formats them with the same `rangeLabel()` the corpus label uses,
now exported from `data-resolver.js` rather than copied.

No API change was needed: `CompanyResponse.period` already carried the figure.

Files: `data-resolver.js` (export `rangeLabel`),
`features/company-tracking/company-tracking-live.js` (`recomputeRange()`, called
from `init`, `refresh` and `remove`). 45 `?v=` tags bumped together to
`20260830c`, per standing rule 7.

---

## 1. Parity table

Scope: the metrics line only. Every other element of the panel is unchanged from
the 28 Aug acceptance and is not restated here.

| Vision element | Verdict | Detail |
|---|---|---|
| A period stated over the tracked companies' figures | **REPLACED** | Was the library's range (`Jan 2025–Aug 2026`), which is not the population being counted. Now the entity data's own range (`Jan–Jun 2025`), derived from the matched episodes' earliest and latest `published_at`. |
| Company count, mention total, episode total | PRESENT | Untouched. |
| Coverage label "mentions through 23 Jun 2025" | PRESENT | Untouched, and now agrees with the line above it. It still removes itself when `entity_coverage.complete` flips true. |
| "Saved in this browser" | PRESENT | Untouched. |
| A range when nothing is known | **DELIBERATELY ABSENT** | With no company carrying a period — an empty watchlist, or an unreachable API over a watchlist stored before this change — the line shows no range at all. No label beats a wrong one; that is the same rule `fillRange` already applies. |

## 2. Interaction audit

Recorded from what the controls actually did, driven over CDP against the live
API on `:8000`.

| Control | Action taken | Result |
|---|---|---|
| Company Tracking button (header) | Clicked | Panel opened; metrics line rendered `Tracking 2 companies · 775 mentions across 710 episodes, Jan–Jun 2025`. |
| Typeahead → "Google" → suggestion | Clicked | Google added; line became `Tracking 1 company · 594 mentions across 592 episodes, Jan–Jun 2025`. Stored period `2025-01-02 to 2025-06-23`. |
| Typeahead → "Stripe" → suggestion | Clicked | Stripe added; totals rose to 775/710, range unchanged at `Jan–Jun 2025`. Stripe's own period is `2025-01-02 to 2025-06-19`, inside Google's, so the union does not move. |
| Remove (×) on a company | Exercised via `remove()` | `recomputeRange()` runs on removal, so the range shrinks with the watchlist rather than keeping a date no remaining company covers. |

No control was added or removed. No dead buttons.

## 3. States

| State | Screenshot | What renders |
|---|---|---|
| Populated, before the fix | `before-panel.png`, `before-page.png` | `…710 episodes, Jan 2025–Aug 2026` above `mentions through 23 Jun 2025`. The defect. |
| Populated, after the fix | `after-panel.png`, `after-page.png` | `…710 episodes, Jan–Jun 2025` above the same coverage label. |
| Empty watchlist | `empty-panel.png`, `empty-page.png` | `No companies configured`. No range, no invented period. |
| API unreachable | `apidown-panel.png`, `apidown-page.png` | Stored totals kept (`Tracking 1 company · 594 mentions across 592 episodes`), **no range** — the stored company predates the `period` field, so nothing is claimed. Coverage label renders empty and hidden. No exception text, no endpoint URL. |

Loading is not separately shot: the line is absent until `renderMetrics` first
runs, and the two populated shots were taken after a 14-second settle precisely
because an earlier shot caught it mid-refresh showing one company's totals for
two. That miscapture is recorded here rather than deleted.

The machine-readable readings are `before.json`, `after.json`, `empty.json`,
`apidown.json`.

## 4. Screenshots

- Viewport 1440×1000, `deviceScaleFactor` 2, identical for every shot.
- `*-panel.png` is the panel clipped from the viewport; `*-page.png` is the same
  frame in full page context.
- **Viewport-only, per standing rule 8.** `.portfolio-panel` is `position: fixed`;
  `captureBeyondViewport` has produced wrong screenshots in this project before
  and was not used.
- There is no Vision counterpart for this line: Vision's portfolio panel has no
  metrics line, which the 28 Aug report already records. Before-and-after at the
  same viewport is the honest substitute and is what is filed here.

## 5. Copy check

DOM audit scoped to `.portfolio-panel`:

- No relative time. `Jan–Jun 2025` is absolute and derived.
- No invented statistics: every figure on the line comes from `/api/companies/*`.
- No placeholder strings.
- No diagnostic text in any state, including API-down.

---

## Two things found while doing this, neither fixed here

1. **`demo.html` carries no `?v=` on the document itself**, only on the 45 asset
   tags. A browser with the page cached serves a stale document that references
   the previous build of every script. This made the first "after" shot
   identical to the "before" one until the capture disabled the HTTP cache. It
   affects any cache-busted reload, not just screenshots.
2. **`[data-corpus-range]` falls back to the hardcoded `Jan–Jun 2025`** in
   `demo.html:145` when `/api/signals` cannot be reached — visible in
   `apidown-page.png`. `fillRange` deliberately leaves the node alone rather than
   writing a wrong label, but the markup it leaves behind is itself a stale
   figure from before the backfill. Out of scope for this fix; recorded so it is
   not rediscovered.

## Tooling

`demo/shoot_range_fix.py` drives the installed Google Chrome over CDP. The
bundled `chrome-headless-shell` in `~/.cache/puppeteer` will not start in this
environment — it dies on `bootstrap_look_up
org.chromium.Chromium.MachPortRendezvousServer` before opening a debugging port.
