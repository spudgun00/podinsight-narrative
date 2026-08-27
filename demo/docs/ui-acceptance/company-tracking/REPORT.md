# Company Tracking v1 — completion report

**28 Aug 2026.** Against `podinsight/UI_ACCEPTANCE.md`. Phase E. Sixth retired
mock guarded at its entry point.

---

## What it is

A watchlist of companies, with real mention data behind every number.

| | |
|---|---|
| Panel | The Company Tracking button, `.portfolio-panel`, rebuilt in Live by `features/company-tracking/company-tracking-live.js` |
| Names | Typeahead over the curated entity index — `GET /api/companies/search` |
| Per company | Episodes that name it, and total mentions, Jan–Jun 2025 — `GET /api/companies/{name}` |
| Company view | Those episodes, each opening its brief |
| Brief panel | A Watchlist tile: how many watchlist companies this episode names, names on expand — `GET /api/companies/mentions` |
| Persistence | `localStorage`, v1, stated on the panel |

### The data underneath

`entities` answers *how many* episodes name a company. It could not answer
*which*, because the rollup counts into sets and discards the breakdown. A
second index, `entity_episodes`, was built for this: one document per (entity,
episode) with that episode's mention count.

It is built by `podinsight-aws-pilot/build_entity_episodes_aws.py`, which
**imports** `KEEP_LABELS`, `STOPLIST`, `ALIASES`, `MIN_EPISODES` and all three
version numbers from `build_entities_aws.py` rather than restating them. The two
indexes cannot disagree about what a company is called or which terms are
excluded, and bumping the stoplist rebuilds both from the same constants.

| | |
|---|---|
| Rows | **85,201** (entity, episode) pairs |
| Entities | **9,581** at ≥ 2 episodes — the same 9,581 the rollup holds |
| Reconciliation | Top 40 entities checked against the rollup episode-by-episode: **all agree** |
| Versions | filter v1, stoplist v2, alias table v1 — returned on every response |

The floor matters: a company that is searchable is always openable, because both
indexes describe the same entity set.

---

## 1. Parity table

Against the Vision Company Tracking panel (`vision-panel.png`) and the Vision
brief's Portfolio/Watchlist tiles.

| Vision element | Verdict | Detail |
|---|---|---|
| Panel title "Company Tracking" | **PRESENT** | Unchanged, and so is the open/close animation — same `data-state`, backdrop and body class. |
| Company Tracking button | **PRESENT** | Now wired by `CompanyTrackingLive`; `PortfolioManager` used to own it and is Vision-only. |
| Notification badge on the button ("3") | **DELIBERATELY ABSENT** | It counted "new mentions", cycling 1 → 2 → 3 on a five-minute timer. Nothing is new in a corpus ending 23 June 2025. Removed from the DOM rather than rendered as a zero. |
| Pulse indicator | **DELIBERATELY ABSENT** | Same mechanism, same reason. |
| "Tracking 3 companies" | **PRESENT** | Real count of the watchlist. |
| "26 mentions this week" | **REPLACED** | "551 mentions across 463 episodes, Jan–Jun 2025". There is no "this week": the corpus is six fixed months. |
| "46% positive sentiment" | **DELIBERATELY ABSENT** | Nothing computes sentiment. It was `_generateMockCompanyData` returning a hand-written string per company. |
| Two lists: PORTFOLIO and WATCHLIST | **REPLACED** | One list. v1 has no concept that distinguishes a held company from a watched one, and two lists with identical behaviour would be a distinction the data does not make. |
| Add-company input | **PRESENT**, constrained | A typeahead over the entity index instead of free text. A user picks a canonical name or nothing. |
| Add button | **PRESENT** | Disabled until a canonical name is chosen. |
| Company card: name | **PRESENT** | |
| Company card: "7 mentions" | **REPLACED** | "221 episodes · 265 mentions", both counted from the index. The Vision number was invented per company. |
| Company card: sentiment dots (7–12 per card) | **DELIBERATELY ABSENT** | Nothing computes sentiment. |
| Company card: trend arrow ↑ | **DELIBERATELY ABSENT** | A trend needs two periods to compare; there is one fixed period. |
| Company card: status ring (validated / neutral / negative) | **DELIBERATELY ABSENT** | A thesis judgement nothing in the corpus makes. |
| Company card: "last insight" line | **DELIBERATELY ABSENT** | Editorial prose, hand-written per company in the mock. |
| Remove button (×) | **PRESENT** | Removes and persists. |
| Empty state | **PRESENT** | "No companies configured" preserved verbatim, with a line saying what adding one does. |
| "Import companies from CSV or CRM" | **DELIBERATELY ABSENT** | Its only handler is `PortfolioManager.initializeScaffold`, now Vision-only, so in Live it was an `<a href="#">` nothing listened to. Vision keeps both the link and its dialog. |
| — | **ADDED** | Company view: the episodes naming a company — date, podcast, title, mention count — each opening that episode's brief. Vision had no such view. |
| — | **ADDED** | "Saved in this browser", with a tooltip stating exactly what `localStorage` does and does not do. |
| — | **ADDED** | The extraction note, and the three curation version numbers in its tooltip. |
| **Brief panel** — PORTFOLIO tile | **DELIBERATELY ABSENT** | v1 keeps one list; a second tile reading 0 forever is the kind of empty slot this project keeps removing. |
| **Brief panel** — WATCHLIST tile | **PRESENT**, live for the first time | Counts the watchlist companies this episode names; names and per-episode counts on expand. Absent entirely when no companies are configured. |

---

## 2. Interaction audit

Every control in the panel, and what it **did**. Driven through CDP against the
live page.

| Control | Action taken | Result |
|---|---|---|
| Company Tracking button | Clicked | Panel opened, `data-state="open"`, backdrop faded in, focus moved to the input. |
| Company Tracking button | Clicked again | Panel closed; view reset to the watchlist. |
| Close (×) / backdrop / **Escape** | Each tried | Panel closed each time, view reset to the list. |
| Input, `"anthro"` | Typed | 8 canonical suggestions with episode counts: Anthropic 221, Anthropics 18, Anthropix 17, Anthropic Dorcas 12, Anthrobic 6, Anthropix Cloud 4, Anthropocene 2, Anthropics Claude 2. Already-tracked names show "already tracked" and are inert. |
| Suggestion | Clicked | Added; card appeared; metrics updated; `localStorage` written; help line "Anthropic added." |
| Input, `"Zzzqqx"` | Typed | **"No mentions found in the library for “Zzzqqx”."** No suggestion list, no card, `localStorage` unchanged — verified before and after. |
| Add button | Inspected before a choice | `disabled`. It cannot submit free text. |
| Enter in the input | Pressed | Adds the highlighted or first suggestion; never a raw string. |
| Company card | Clicked | Company view opened: Anthropic, "221 episodes · 265 mentions · 22 podcasts", 221 rows. |
| "← Watchlist" | Clicked | Returned to the list. |
| Episode row | Clicked | Brief panel opened on that episode ("How to Design an AI-Native Engineering Organization"). All 221 rows carry `role="button"` and open. |
| Episode row | **Enter** pressed | Same. |
| Remove (×) | Clicked | Card removed, metrics recomputed, help line "Nvidia removed.", `localStorage` rewritten. |
| **Persistence** | Removed Nvidia, then **reloaded the page** with no reseeding | Watchlist came back as `["Anthropic"]`, both on screen and in storage. The removal survived, not just the addition. |
| Watchlist tile in the brief | Expanded | "Anthropic — 2 mentions", "Nvidia — 1 mention", with the extraction note beneath. |
| Tile count | Hovered | "2 of the 2 companies on your watchlist are named in this episode." |

No dead controls. Nothing in the panel raises an alert.

---

## 3. States

| State | Screenshot | What renders |
|---|---|---|
| Empty watchlist | `live-panel-empty.png` | "No companies configured" — the Vision string, preserved — plus "Add a company above to see which episodes name it, and how often." Resolver stamps `empty`. |
| Populated | `live-panel-list.png` | Metrics line, add box, cards, extraction note. |
| Typeahead open | `live-typeahead.png` | Canonical matches with episode counts. |
| Unknown name | `live-unknown-name.png` | The refusal message. Nothing added. |
| Company view | `live-company-view.png` | Episodes, most mentions first. |
| Company view loading | — | "Loading episodes…" under the company name. |
| Company view error | — | "Could not load the episodes for this company." with a working **Try again**. |
| Brief tile, none matched | — | "None of your watchlist companies is named in this episode." |
| Brief tile, no watchlist | — | The section does not render at all. |

---

## 4. Screenshots

All at 1440px, **viewport-only**. The Company Tracking panel, the brief panel
and the customization panel are all `position: fixed`, and
`captureBeyondViewport` relays fixed elements out against the whole page — the
mistake that produced a false finding on the Narrative Feed. It produced a
wrong screenshot here too, before the method was corrected.

| File | What |
|---|---|
| `live-panel-list.png` | Live panel, **in page context**. |
| `vision-panel.png` | Vision panel, same viewport width — the side-by-side. |
| `live-panel-empty.png`, `live-typeahead.png`, `live-unknown-name.png`, `live-company-view.png` | States. |
| `live-brief-tile.png` | The brief panel's Watchlist tile, expanded. |

---

## 5. Copy check

DOM audit scoped to `.portfolio-panel`, excluding corpus-derived nodes
(company names, podcast names, episode titles). 11 text nodes examined.

| Check | Result |
|---|---|
| Relative time (`ago`, `this week`, `new mentions`) | **0 hits** |
| Placeholders | **0 hits** |
| **Percentages** | **0 hits** — deliberate. The one percentage this surface could show is a share of episodes, which is the unstable kind the volume floor exists to suppress, and most watchlist companies sit at the low end. None is shown anywhere, so the floor never has to be applied. |
| Sentiment vocabulary | **0 hits** |
| Invented statistics | **None.** Every number is a count from the index: episodes, mentions, podcasts. |

Full text: "Company Tracking", "Tracking 2 companies · 551 mentions across 463
episodes, Jan–Jun 2025", "Saved in this browser", "Add a company", "Add",
"WATCHLIST", "221 episodes · 265 mentions", "×", "242 episodes · 286 mentions",
"×", and the extraction note.

---

## 6. Retiring the mock — instance six

The brief said to check that the render path was guarded, not just the interval.
It was not. Only `initializeMentionsCycle` carried a Live guard, which stopped
the badge cycling; `addCompany` still ran every name through
`_generateMockCompanyData` — inventing a mention count, a seven-dot sentiment
array, a status and a "last insight" — and `renderList` still painted them.

The guard is now at the **constructor**, the first statement, because every path
into the class ends in the same invented card: the button, the input, the remove
buttons, and restoring from `localStorage` on load.

**Verified in both modes.**

| | Live | Vision |
|---|---|---|
| `PortfolioManager.disabled` | `true` | `false` |
| `.ctl` panel present | yes | no |
| Mock company cards | **0** | 3 |
| Mock sentiment dots | **0** | 3 |
| Mock "last insight" lines | **0** | 3 |
| Import link | **absent** | present |
| Notification badge | **absent** | present |

---

## 7. The other two fates

Recorded here because both were verified in the same pass.

- **Consensus Monitor — dropped from Live, 28 Aug 2026 by James.**
  `#consensus-monitor-section` and `.consensus-monitor-container` are both
  **absent** in Live and both **present** in Vision. It is removed in
  `intelligence-brief.js` *after* `setupIntersectionObserver` has run, never
  before: that function assigns the four sidebar section ids by position, so
  removing the section first would hand `#consensus-monitor-section` to Topic
  Correlations. It is no longer in the resolver's unbuilt list, because it is no
  longer a Live surface at all.
- **Notable Signals — parked.** Its placeholder now reads *"Awaiting the
  topic-discovery engine (parked)"* and names the dependency: topics the corpus
  discovers for itself rather than the five tracked by hand, plus a series dense
  enough to compare consecutive periods. Effort line reads "Parked — depends on
  the topic-discovery engine".

---

## Known limits of v1

Stated rather than hidden.

- **Variants are separate entities.** "Anthropics", "Anthropix", "Anthrobic" and
  "Anthropics Claude" all appear in the typeahead alongside "Anthropic". They are
  Whisper mis-transcriptions, and only explicit entries in the alias table are
  folded. This is why the extraction note says a count is a floor. Adding them to
  the alias table is a data change, not a UI one.
- **The panel's episode total double-counts.** An episode naming two watchlist
  companies counts in both. The tooltip on the metrics line says so.
- **`localStorage` only.** No account, no sync, no sharing. The tooltip says so.
- **No alerting.** There is no "new since last visit" anywhere, and there cannot
  be until forward ingestion exists.
