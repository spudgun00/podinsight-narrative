# Finding 6 — Vision restored as the whole target exhibit

**2 Sep 2026. Vision only. Live is byte-identical, proven below.**

Instrument: `demo/walk_vision.py`, headless Chrome over CDP at 1440×1000, DPR 2,
cache disabled. It walks every top-level module, records what each one actually
renders, runs a twelve-control click audit, then loads Live and runs the wall
audit and the panel-identity check in the same pass.

---

## 1. Parity table — Vision against the July 2025 mock

| Element | Verdict | Evidence |
|---|---|---|
| Vision banner and its 25 July 2025 date | **PRESENT, unchanged** | `after/walk.json` → `vision.banner` |
| Narrative Pulse chart | **RESTORED** | mock stack injected at run time; 632px, momentum/volume/consensus, 7/30/90d, insight cards |
| Narrative Pulse insight cards | **PRESENT** | breakout / leadership change / trend character, from `chartInsights` |
| Latest Episodes (Narrative Feed) | **PRESENT** | 548px, 7 mock rows with CONSENSUS/DIVERGENCE/PATTERN/TREND tags |
| Notable Signals, five cards | **PRESENT** | 447px |
| Notable Signals confidence bars | **DELIBERATELY ABSENT** | the one thing the ruling keeps permanently banned; removed from the mock too |
| Notable Signals strength dots | **DELIBERATELY ABSENT** | same theatre in a different costume |
| Priority Briefings cards | **RESTORED** | was a 300px blank box; now 864px, four mock cards + Show More |
| Weekly Intelligence Brief | **PRESENT** | consensus / contrarian / blindspot, expand, download |
| Velocity Tracking | **RESTORED** | 7 mock rows, `+25% w/w` … `-15% w/w`; mock's own heading and description |
| Influence Metrics | **RESTORED** | 7 mock rows with bars, `High (97)` … `High (88)`; renamed back from the live "Most-Mentioned Entities" |
| Consensus Monitor | **PRESENT** | 218px, mock agreement levels |
| Topic Correlations | **RESTORED** | 6 mock donuts, 82% / 73% / 79% / 68% / 71% / 58% |
| Supporting Analytics container | **REMOVED with a note** | was a 0px empty div read by nothing; note left in `demo.html` |
| Corpus range in the search dropdown | **REPLACED** | was "Range unavailable", a Live failure state; now the mock's own week, "July 19–25, 2025" |
| Search results | **REPLACED with the honest equivalent** | "Search is a Live-mode surface" — search reads the real library and has no mock |
| Episode Library | **REPLACED with the honest equivalent** | "No mock-up for the Episode Library" — built after the mock |

**Nine modules, fourteen badged elements, zero gaps, zero visible error copy,
zero confidence theatre.** `after/walk.json` → `vision.gaps: []`,
`vision.errorsVisible: []`, `vision.confidenceTheatre: 0`.

## 2. Interaction audit — what each control actually did

| Control | Result |
|---|---|
| Pulse: time range (7 days) | opened the range menu in place; no fetch, no error |
| Pulse: customise topics | opened the topic customisation panel in place |
| Pulse: share | opened the share menu in place |
| Pulse: a topic in the legend | filtered the chart in place |
| Notable Signals: first card | opened the signal detail in place |
| Briefings: a card | opened **episodePanel** — mock brief, no error copy |
| Briefings: Show More | expanded the grid in place |
| Briefings: All Briefings → | opened **episode-library-overlay** — the "no mock-up" note, not a retry error |
| Weekly Brief: Expand Brief | expanded in place |
| Weekly Brief: Download Brief (PDF) | acted in place |
| Feed: a row | opened the row in place |
| Header: search | opened the search dropdown in place |

**No control produced Live failure copy.** `after/walk.json` → every entry's
`liveErrorCopy` is empty.

## 3. States

| State | Where |
|---|---|
| Happy path, Vision | `after/vision-top.png`, `vision-00..03.png` |
| Before, Vision | `before/vision-*.png` — placeholder, three retry errors, one blank box |
| Error, Vision | mock stack failing to load renders a named, in-voice note and stamps `error`; it cannot render Live retry copy |
| Empty, Vision | a panel whose mock dataset carries no rows says so ("The mock dataset carries no velocity rows") rather than rendering blank |
| Live | `after/live-top.png` |

## 4. Live beside Vision, same viewport

`before/live-top.png` and `after/live-top.png`, 1440×1000 DPR 2, are
**byte-identical**:

```
e6c2870de8df7fd8dd490385d02aecc355d56a889a3b6eb6cbfb05dcf17d9656  before/live-top.png
e6c2870de8df7fd8dd490385d02aecc355d56a889a3b6eb6cbfb05dcf17d9656  after/live-top.png
```

Panel identity, seven checks, before against after — all identical to the digit:

| Check | Value |
|---|---|
| Header stats | Episodes 613 · Podcasts 25 · Hours analysed 542 |
| Date-window span | 31 May 2026 to 28 Aug 2026 |
| Notable Signals values | 25, 298, 2, 613 |
| Notable Signals titles | Market Narratives, Watchlist Mentions, Notable Figures, Topic Movement, Library |
| Feed period | 31 May 2026 – 28 August 2026 |
| Feed rows | 10 |
| Pulse subtitle | 6 themes · passages across 613 episodes · May 2026–Aug 2026 · monthly |

## 5. The wall

| Check | Result |
|---|---|
| Mock component scripts loaded in Live | **0** — `[data-synthea-mock]` is empty |
| `unifiedData`, `narrativePulseData`, `NarrativePulse`, `renderBriefingCards` in Live | all **undefined** |
| Write to `window.unifiedData` in Live | swallowed; reads back `undefined` |
| MOCK badges in Live | **0** |
| Vision banner in Live | absent |
| Mock drilldown / mock briefings initialised in Live | **neither** |
| Mock-class DOM nodes in Live | 1, `.pulse-legend` — the live chart's own legend, sharing the class because both modes use one template |

**Residual, stated rather than hidden:** `data/unified-data.js` is still served to
the browser in Live as a static tag, as it was before this finding. Its global is
sealed and every read returns `undefined`, so nothing on the page can reach it,
but the file is fetched. Making it Vision-only means loading it dynamically, and
the components that read it at init would then race the load. Left as it stands.

## 6. Copy check — read for truth, not for presence

| Surface | Reads | True? |
|---|---|---|
| Banner | "illustrative content dated 25 July 2025" | yes — the mock's own date, unchanged |
| Velocity Tracking | "Topic acceleration over past 7 days" | yes in Vision — the mock's week is 19–25 July 2025 |
| Influence Metrics | "Who's shaping the conversation" | yes — the mock's own claim, badged MOCK |
| Topic Correlations | "How narratives cluster in conversation" | yes |
| Search panel | "Search is a Live-mode surface… Switch to Live to ask it something" | yes — search has no mock and reads the real library |
| Episode Library | "No mock-up for the Episode Library… built after the July 2025 mock-up" | yes — verified against the file's own history |
| Search dropdown range | "July 19–25, 2025" | yes — `unifiedData.meta.dataWeek.range` |
| Narrative Pulse subtitle | "TOPIC MOMENTUM ACROSS 1,498 EPISODES" | mock figure on a badged mock panel under a banner that says so — allowed by the finding-6 ruling |

## 7. Two defects this walk found

**The MOCK badge was painting on one element in fourteen.**
`styles/utilities.css` carries `div::after, div::before { display: none
!important; content: none !important }` to kill a vignette. Every module root is
a div and the badge is a `::before`, so it painted only on `<header>`. The dashed
outline still drew, because that sits on the element, which is why the page
looked badged and was not. Fixed with `!important`, scoped to
`body.synthea-vision-mode`. **Live's own PENDING and ERROR badges are suppressed
by the same rule and are left alone**, because fixing them changes Live.

**A badged, titled, completely blank panel passed every programmatic check.**
The first pass of Topic Correlations put six correctly-sized donuts in a correct
grid that painted nothing: `components.css` ships `.mini-pie-chart` at
`opacity: 0` awaiting `.visible`, and its percentage text at `opacity: 0`
awaiting `.animated`, and the animator that added them was gutted to a no-op when
the live panel replaced this one. Badged, no gaps, no error copy, six children,
72×72 each — all true, all passing. A screenshot caught it.
