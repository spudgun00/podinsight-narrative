# Notable Signals, honest v1 — completion report

**28 Aug 2026.** Against `podinsight/UI_ACCEPTANCE.md`. Instance eight.

---

## What it is

Four cards, each with a real source. Subtitle **"Jan–Jun 2025"**.

| Card | Source | Shipped value |
|---|---|---|
| **Watchlist Mentions** | `CompanyTrackingLive` — the browser's own watchlist | 265 mentions across 221 episodes (one company configured) |
| **Notable Figures** | `GET /api/signals` | **567** claims citing $1bn or more |
| **Topic Movement** | `GET /api/topic-mentions` through `SyntheaTrend` | AI Agents +52%, Crypto/Web3 −10%, three below the floor |
| **Library** | `GET /api/signals` | 1,236 episodes · 1,136 hours · **5,814 verified claims** · 31 podcasts |

**The Market Narratives slot does not render at all.** It needs topics the
corpus discovers for itself rather than the five tracked by hand — the parked
topic-discovery engine. An absent card is honest; an empty one invites a reader
to wonder what broke.

Two cards are composed client-side rather than served. Watchlist Mentions
because the watchlist lives in the browser, and Topic Movement because
`/api/topic-mentions` and `trend.js` already own that number — serving a second
copy is how the same topic ends up reading one thing here and another on the
Narrative Pulse legend.

---

## 1. Parity table

Against the Vision Notable Signals strip (`vision-strip.png`).

| Vision element | Verdict | Detail |
|---|---|---|
| "NOTABLE SIGNALS" title | **PRESENT** | |
| "Key patterns from this week's episodes" | **REPLACED** | "Jan–Jun 2025". No week exists. |
| `.signals-grid` of five cards | **REPLACED** | Four cards. The fifth slot is absent, not empty. |
| **Market Narratives** card — "67 narrative shifts detected, ↑ 24 from last week" | **DELIBERATELY ABSENT** | Needs the topic-discovery engine. Both numbers were invented, and "last week" has no referent. |
| Thesis Validation card | **REPLACED** | By Notable Figures, which counts something the corpus can be asked for. |
| Notable Deals card | **REPLACED** | By Notable Figures. |
| Portfolio Mentions card | **REPLACED** | By Watchlist Mentions, live from Company Tracking. |
| LP Sentiment card | **DELIBERATELY ABSENT** | Nothing in the corpus measures LP sentiment, or any sentiment. |
| `.signal-strength` four-dot confidence meters | **DELIBERATELY ABSENT** | Nothing computes confidence. |
| Per-card counts 23 / 14 / 31 / 12 / 34 / 28 | **DELIBERATELY ABSENT** | Invented in `unified-data.js`. |
| `.signal-icon` circles | **DELIBERATELY ABSENT** | Decorative; the cards carry a value and a rule instead. |
| Signal detail panel | **REPLACED** | The Notable Figures list panel, which opens to real claims. |
| "Have a specific question about these insights?" | **PRESENT**, reworded | "…about these episodes?" — the strip shows episodes, not insights. |
| "Ask our AI →" | **PRESENT**, and now **wired** | It was decoration in Vision. It focuses and opens the real search panel. It does not render at all if the search input is absent. |
| — | **ADDED** | Topic Movement, showing all five tracked topics under the shared floor. |
| — | **ADDED** | Library totals. |
| — | **ADDED** | The $1bn rule, printed on the card and again on the panel. |

---

## 2. Interaction audit

| Control | Action taken | Result |
|---|---|---|
| **Watchlist Mentions** card | Clicked | Opens the Company Tracking panel. |
| Watchlist card, no companies | Rendered | Not clickable, no value, honest empty state — see §3. |
| **Notable Figures** card | Clicked | Panel opened: the rule, "567 claims. Showing 200, largest figure first.", 200 rows, largest **$900 trillion**. |
| Figure row **Play** (×200) | Clicked | Fetched a real clip and played it; first row timestamp 30:11. |
| Figure row **Full brief** (×200) | Present only when `BriefingsLive` exists | Opens that episode's brief. |
| Panel close / backdrop / **Escape** | Each tried | Closed each time; audio stops on close. |
| **Ask our AI →** | Clicked | `document.activeElement` became `.search-input` and the search dropdown opened. It drives the real panel, not a copy. |
| Topic Movement / Library cards | Inspected | Not clickable and not styled as clickable — they are readouts. |

Controls in the strip: 2 openable cards, 1 Ask button. No dead controls.

---

## 3. States

| State | Screenshot | What renders |
|---|---|---|
| Populated | `live-strip.png` | Four cards. |
| **Empty watchlist** | `live-strip-empty-watchlist.png` | "No companies configured", and "Add companies in Company Tracking to see how often the library names them." **No value is rendered** — not a zero. |
| Loading | — | "Loading signals…" |
| Error | — | "Could not load signals." with a working **Try again**. |
| Movement unavailable | — | "Movement unavailable" rather than an empty card. |

---

## 4. Copy check

Scoped to `.nsl`, excluding corpus-derived names. 23 text nodes.

| Check | Result |
|---|---|
| Relative time, incl. "weekly" and "new" | **0 hits** |
| Confidence / sentiment / "shifts detected" | **0 hits** |
| Placeholders | **0 hits** |
| Invented statistics | **None.** Every number is a count: mentions, episodes, claims, hours, podcasts, or a percentage the shared floor permitted. |

---

## 5. One bug this caught, worth recording

The Topic Movement card first rendered **DePIN as "low volume"**, where the
Narrative Pulse legend says "no data" and Velocity Tracking says "no mentions" —
the same topic reading three different ways on three surfaces, which is the
exact drift `trend.js` was written to prevent.

The cause: the card re-derived its own wording from `fmt.suppressed` and
`fmt.dir` instead of using `fmt.text`, which the formatter already returns.
Fixed by using `fmt.text`, plus Velocity Tracking's own zero case. DePIN now
reads "2 mentions" — the formatter's wording, on every surface.

---

## 6. Retiring the mock — instance eight

| Entry point | Guard |
|---|---|
| `features/notable-signals/init.js` | **Default-deny**: renders only when the resolver is present *and* in Vision. |
| `NotableSignals.init` | Guarded inside the component, so a caller bypassing `init.js` is covered. |
| `data-resolver.js` `UNBUILT` | `notable-signals` removed, with the reason recorded in place. |

It mattered for the same reason as the feed: the live strip reuses
`.signals-grid`, so an unguarded mock does not leave a stale placeholder — it
paints "67 narrative shifts detected" and four-dot confidence meters over real
cards.

**Verified.** Live: `.signal-card:not(.nsl-card)` = **0**, `.strength-dot` = **0**,
no unbuilt card, `data-synthea-source="live"`. Vision: 5 mock cards, "Key
patterns from this week's episodes", "67 narrative shifts" — untouched, and no
`.nsl`.
