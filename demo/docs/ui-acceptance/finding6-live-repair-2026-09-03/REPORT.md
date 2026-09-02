# Live repair — badge suppression, the shared renderer, and the Topic Movement window

**3 Sep 2026. Live changes this time.** Three ruled fixes and two stragglers, each
proven by running the page rather than by reading the diff.

Instruments, all kept:
`demo/prove_badges.py` (three badge states, three passes, screenshotted),
`demo/prove_renderer_readers.py` (who calls the shared renderer, by call trace),
`demo/walk_vision.py` (the finding-6 walk).

---

## 1. Badge suppression — scoped, not overridden

### What was wrong

`styles/utilities.css` carried a block headed *"Remove any possible vignette or
edge effects"* that killed `::before` and `::after` on `body`, `html`, **`div`**,
`main`, `.container` and **`aside`**, with `display: none !important; content:
none !important`. Every module root on `demo.html` is a `div`, and the resolver's
MOCK / PENDING / ERROR badge is a `::before`. So the badge painted on exactly one
element in the page — `<header>`, the only module root that is not a div — while
the dashed outline, which sits on the element rather than a pseudo-element, drew
everywhere. **The page looked badged and was not.**

### How the new scope was chosen — measured, not guessed

The rule was deleted **at run time** and every generated pseudo-element on the
page diffed before and after. Dropping `div` and `aside` brings back:

| Element | Gains | Reading |
|---|---|---|
| `#searchPanel::before` | `PENDING` | true — search has not been run, so nothing has been fetched |
| `.synthea-unbuilt-title::before` | `○` | a bullet glyph on an unbuilt-panel title; design, not data |

Nothing resembling a vignette appeared. The page containers a full-bleed overlay
can actually attach to — `body`, `html`, `main`, `.container` — keep the guard.
The Vision-only `!important` override that stood in `data-resolver.css` for a day
has been **removed**: one rule now serves all three states in both modes.

### The three states, on screen

| Pass | How it was produced | States stamped | Badges painted | Screenshots |
|---|---|---|---|---|
| **Live** | ordinary page | 13 `live`, 1 `pending`, 1 `empty` | **1** | `live-00..05.png` |
| **Error** | `SYNTHEA_API_BASE` pointed at a dead port before any page script, so every component takes its real failure path | 11 `error`, 1 `live`, 1 `pending`, 1 `empty` | **12** | `error-00..01.png` |
| **Vision** | mock exhibit | 14 `vision` | **14** | `vision-00..03.png` |

`live` carries no badge by design: a panel that fetched real data and said so
needs no sticker. The badge exists for the three states where the reader would
otherwise not know.

### Every element that newly shows a badge, read for truth

**Live (1 new):**

| Element | Badge | Says | True? |
|---|---|---|---|
| `#searchPanel` | PENDING | "Search / Share Insight" | **Yes.** The panel has never fetched. It is off-screen until opened, so the badge is not loose on the page. |

**Error pass (10 new, plus 2 that already painted):**

| Element | Badge | Says | True? |
|---|---|---|---|
| `#narrative-feed-container` | ERROR | "Could not load the feed. Try again" | Yes |
| `#notable-signals-container` | ERROR | "Could not load signals. Try again" | Yes |
| `#priority-briefings-container` | ERROR | "Could not load briefs." | Yes |
| `.brief-content` | ERROR | "Could not load the brief. Try again" | Yes |
| `#velocity-tracking-section` | ERROR | "Topic velocity could not be loaded" | Yes |
| `#influence-metrics-section` | ERROR | "Influence metrics could not be loaded" | Yes |
| `#topic-correlations-section` | ERROR | "Topic correlations could not be loaded" | Yes |
| `#episodePanel` | ERROR | closed panel template | Yes — its fetch failed; off-screen until opened |
| `#searchPanel` | PENDING | as above | Yes — never fetched, so pending, not error |
| `.episode-library-overlay` | ERROR | "Catalogue unavailable" | Yes — off-screen until opened |
| `<header>` | ERROR | header stats | Yes — already painted before, header is not a div |
| `.narrative-pulse` `<section>` | ERROR | "Themes unavailable" | Yes — already painted before, section is not a div |

**Vision (13 new, plus `<header>`):** all fourteen read `MOCK` on a page whose
banner says every figure is illustrative. Two worth stating explicitly:

| Element | Reading |
|---|---|
| `#searchDropdown` | MOCK on an element with no text — it is the closed dropdown, positioned above the viewport, so the badge is off-screen. Truthful, not visible. |
| `#portfolio-metrics` | "Tracking 3 companies • 26 mentions this week • **46% positive sentiment**". A sentiment percentage with nothing behind it, on a badged mock surface, reachable by clicking Company Tracking. Under the narrowed finding-6 rule this is backlog rather than corpse, so it stays; **the equivalent surface in Live is `empty` and shows nothing.** Flagged rather than passed silently. |

---

## 2. The shared briefing-card renderer — readers proven by running

`shared/briefing-card-renderer.js` was removed on 27 Aug 2026 as *"read by
nothing since the live cards replaced it."* A text search agreed: both call sites
reach it through `window.` on a global, in files nobody was reading.

`prove_renderer_readers.py` does not search. It installs a `defineProperty`
setter trap on `window` **before any page script runs**, wraps the function the
moment it is assigned, records `new Error().stack` on every call, and drives both
modes through the front page, the Episode Library, and the library's card view.

**Readers observed:**

| Mode | Caller | Rendered |
|---|---|---|
| **Live** | `episode-library.js:514` → `renderCardView` ← `renderContentHTML` | **613 cards**, no apology. Stats line: "613 episodes • 25 podcasts • 542 hours analysed" |
| **Vision** | `priority-briefings-compact.js:71` → `renderCards` ← `render` | **9 mock briefing cards** |

Before: the Live library card view rendered *"Shared renderer not loaded. Please
refresh the page."* After: 613 cards. Screenshots `library-cards-live.png` and
`library-cards-vision.png`.

The renderer is restored to `demo.html` for **both** modes. Its
`getEpisodeNumber()` helper was **deleted, not restored**: it invented an episode
number from a hardcoded per-podcast base (`'All-In': 180`, `'20VC': 1200`) minus
a regex match on the id, and its only call site had already been commented out.
A fabricator does not sit in a live file waiting to be uncommented.

The rule is recorded as `SOURCE_OF_TRUTH.md` **14.20**: a deletion claim of "read
by nothing" requires runtime evidence — a trap installed before page scripts, both
modes driven through every surface including those behind a click and a view
toggle, and the callers **observed** rather than inferred.

---

## 3. `data/unified-data.js` under Live — parked, with a written trigger

Unchanged, by ruling. Recorded as `SOURCE_OF_TRUTH.md` **14.21**: the seal is the
guarantee and the Live audit is the proof, but the 126 KB file is still fetched
in Live. It cannot be made Vision-only with a one-line change because four
components read `window.unifiedData` directly at initialisation and would race a
dynamic load. **Trigger written down: the next asset or performance pass,
whichever comes first.**

---

## 4. Stragglers

| Straggler | State |
|---|---|
| CC_DATE_WINDOW_REPORT section 4A | **Already done.** Section 4A reads "CLOSED 2 Sep 2026", carries the corrected note text and the chip-gap table. No change. |
| Chip-contradiction ADV log entry, 2 Sep | **Already landed**, `CEO_LOG.md` line 46. No change. |
| Topic Movement window fix (14.18) | **Done this session** — below. |

### Topic Movement: two endpoints were ignoring a window they were already being sent

`topic-mentions` and `topic-correlations` took no `window` argument. The page had
been stamping one on every call since finding 1 — `withWindow()` in
`data-resolver.js` adds `window=` to every `/api/` URL from one place — so both
endpoints were receiving a window and discarding it. **Measured on the wire
against the running server, before and after:**

| | 30 days | 90 days | All time |
|---|---|---|---|
| `topic-mentions` episodes, **before** | 4,471 | 4,471 | 4,471 |
| `topic-mentions` episodes, **after** | **208** | **613** | 4,471 |
| Month buckets, before | 20 | 20 | 20 |
| Month buckets, after | **2** | **4** | 20 |
| `topic-correlations` episodes, before | 4,471 | 4,471 | 4,471 |
| `topic-correlations` episodes, after | **208** | **613** | 4,471 |
| Meaningful pairs, before | 6 | 6 | 6 |
| Meaningful pairs, after | **3** | 6 | 6 |

Both filter on the rollup's own `published_at`, so the window is a real date
filter and not a month-boundary approximation: "last 90 days" beginning on 31 May
counts one day of May, not thirty-one.

**On the page, after** (`window-all.png`, `window-90d.png`, `window-30d.png`):

| Panel | All time | Last 90 days | Last 30 days |
|---|---|---|---|
| Topic Correlations, AI Agents + Crypto/Web3 observed | **683** | **118** | **34** |
| Topic Movement card | 2 of 5 move | 2 of 5 move | **0 of 5 clear the floor** |
| Velocity Tracking | ↑10% / ↓32%, low volume | ↑10% / ↓32%, low volume | per-topic counts, 2 of 2 months |

**One reading that needs stating, because it looks like a bug and is not.**
Velocity Tracking shows the same `↑ 10%` and `↓ 32%` at 90 days and all time. That
is correct: the change figure is month-over-month on the **last two complete
buckets**, which are July and August 2026 in both windows. What moved underneath
it is the volume — Crypto/Web3 totals 36,385 mentions all-time and 4,063 in the
last 90 days — and the 30-day view, which has no two complete months, correctly
declines to report a change at all.

All four snapshots rebuilt; no panel failed. Sizes 193 KB–722 KB, unchanged in
shape.

---

## 5. Live before and after, at the same viewport

Live is **meant** to change this session, so the finding-6 identity check is
reported as a diff rather than as a match:

| Check | Before | After |
|---|---|---|
| Header stats | Episodes 613 · Podcasts 25 · Hours analysed 542 | **unchanged** |
| Date-window span | 31 May 2026 to 28 Aug 2026 | **unchanged** |
| Notable Signals values | 25, 298, 2, 613 | **unchanged** at 90 days |
| Feed period / rows | 31 May – 28 August 2026 / 10 | **unchanged** |
| Pulse subtitle | 6 themes · 613 episodes · May–Aug 2026 · monthly | **unchanged** |
| Badges painted in Live | 0 | **1** (PENDING, off-screen search panel) |
| Badges painted in a Live failure | 0 | **12** |
| Episode Library card view | "Shared renderer not loaded" | **613 cards** |
| Topic Correlations at 30 days | all-time numbers | **30-day numbers** |

Nothing on the happy-path front page moved. What moved is what a reader is told
when something is not real data, what the library renders when asked for cards,
and what two panels report when a window is selected.
