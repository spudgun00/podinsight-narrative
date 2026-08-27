# Narrative Pulse v2 — completion report

**28 Aug 2026.** Part 2, built against `NARRATIVE_PULSE_VISION.md`. Theme names
approved by James; all four judgement calls stand.

---

## What shipped

Two layers on one chart, per the vision doc.

| | |
|---|---|
| Default | **6 theme lines**, per-episode normalised — `GET /api/themes` |
| Lenses | **Momentum** (per episode) and **Volume** (passages). **Consensus stays disabled.** |
| Theme click | Drilldown listing its narratives, flagged ones marked |
| Narrative click | Straight into the existing chain — narrative → episodes → brief |
| Topics gear | **The watchlist.** Overlay narratives or the 5 legacy topics, 6 series max, `localStorage` |
| Subtitle | `6 themes · passages across 1,236 episodes · Jan 2025–Jun 2025 · monthly` |

Chain verified: **legend → "Crypto and digital assets" (7 narratives) → "Crypto
AI agents and market trends" → 250 episodes → brief.**

---

## 1. One plotting path, one floor

Themes are emitted in **exactly** the `/api/topic-mentions` shape — `bucket`,
`mentions`, `episodes`, `mentions_per_episode`, `partial` — so a theme is plotted
by the code that plots a tracked topic, and `SyntheaTrend` applies the same floor
to both. A second plotting path would have been a second set of rules.

The narratives endpoint gained `episodes` and `mentions_per_episode` per bucket
for the same reason: an overlaid narrative must be normalisable on the same axis.

**Per-month episode counts are DISTINCT episodes**, aggregated from
`discovered_topic_episodes` — an episode in two of a theme's narratives counts
once. This is why normalisation cannot use the theme document's
`episodes_summed`, which is an upper bound and is named to say so.

**Every theme series is cross-checked against the indexed theme totals on every
request**, and the endpoint returns 503 rather than serve a chart that disagrees
with the drilldown beneath it.

---

## 2. Floors, dashing and labels — unchanged at every level

| Check | Result |
|---|---|
| Legend values | All 6 through `SyntheaTrend.format`; **every one carries the formatter's own tooltip** |
| Unit | `format(topic, unit)` gained an optional unit: themes and narratives read **passages**, legacy topics read **mentions**. Default `'mention'`, so every existing caller is unchanged |
| Partial June | 6 dashed segments, 6 hollow dots, `partialBuckets: [F,F,F,F,F,T]` |
| Axis | "Per episode" in Momentum, **"Passages"** in Volume |
| "low volume" / "no data" | Unchanged — the formatter decides, the chart never re-derives |

---

## 3. Parity table

| Vision element | Verdict | Detail |
|---|---|---|
| Chart, legend, axis, month labels | **PRESENT** | Unchanged geometry |
| Momentum lens | **PRESENT** | Now per-episode over themes |
| Volume lens | **PRESENT** | 36 bars, 6 themes × 6 buckets |
| Consensus lens | **DELIBERATELY ABSENT** (disabled) | Nothing measures agreement. Per the vision doc it becomes **Emerging** after ingestion |
| Topics gear | **PRESENT**, and now **works** | Was disabled while there was nothing to choose between; v2 gives it the watchlist |
| Time-range selector | **DELIBERATELY ABSENT** (disabled) | Six fixed buckets |
| Share / Download Image | **DELIBERATELY ABSENT** (disabled) | Tied to the old mock chart state |
| Static legend, "+107% Enterprise Agents" | **REPLACED** | See §5 |
| "Topic momentum across 1,498 episodes" | **REPLACED** | Real subtitle, real episode count |
| — | **ADDED** | Theme layer, theme drilldown, overlay badges, "carried by few shows" |

---

## 4. Interaction audit

| Control | Action taken | Result |
|---|---|---|
| Legend item (theme ×6) | Clicked | Drilldown: "Crypto and digital assets", "7 narratives · 8,766 passages · 412 episodes", 7 rows |
| Narrative row in a theme | Clicked | Theme panel closed, narrative panel opened on "Crypto AI agents and market trends", **250 episode rows** |
| **Below-breadth row** | Inspected | Marked **"carried by few shows"** with the reason in its tooltip, and rendered **inert** — no `role`, no `tabindex`, no hover. It is not in `/api/narratives`, so there is nothing to open, and it does not pretend otherwise. 2 of 7 rows in Crypto. |
| Momentum / Volume | Clicked | Lens switches; axis label follows |
| Consensus | Inspected | `disabled`, with its reason |
| **Topics gear** | Clicked | Watchlist panel: "Overlay narratives or legacy topics… Six series maximum", NARRATIVES (23) and LEGACY TRACKED TOPICS (5) |
| Overlay option | Clicked ×2 | Subtitle → "4 themes + 2 overlaid"; badges **narrative** and **topic**; `localStorage` written |
| Overlay at the cap | Added 6 | 6 overlays, 0 themes, **22 remaining options disabled** with "Six series is the maximum" |
| Persistence | Seeded 1 overlay, reloaded | "5 themes + 1 overlaid", badge `topic` |
| Close / backdrop / Escape | Each tried | Both panels close |

**Themes are never dropped to make room** — an overlay beyond the cap is refused
at the point of adding, so the chart cannot silently lose the layer the reader
started from.

---

## 5. A defect this build uncovered and fixed

**The section template ships a static legend from the July 2025 mock** —
"Enterprise Agents +107%", "Defense Tech +111%", and the subtitle "Topic
momentum across 1,498 episodes". `renderLegend` returned early whenever
`dataState !== 'ready'`, so **on a failed load those fabricated figures stayed on
screen underneath the error message.**

This was pre-existing, not introduced here, and it is the worst kind of failure
this project guards against: an error state that still shows invented numbers.

**Fixed.** The legend and subtitle are cleared before the first fetch and
repainted from whatever actually loaded. Verified by forcing `/api/themes` to
fail:

```
legend      : ["No themes to show."]
subtitle    : "Themes across the transcript corpus"
mockFigures : false        ← /107%|111%|1,498|Enterprise Agents|Defense Tech/
chart       : "Themes unavailable" / "Could not reach …/api/themes."
```

I found this only because a wait condition matched the template's own legend
items and I screenshotted before the live render — the same timing trap that has
now produced three false readings in this project. It is worth the standing note
in the handover.

---

## 6. DOM audit

Scoped to the chart container and the theme panel, corpus-derived nodes
excluded. **52 text nodes.**

| Check | Result |
|---|---|
| Relative time | **0 hits** |
| Banned vocabulary — sentiment, consensus percentages, confidence numbers | **0 hits** |
| **Mock leakage** — `107%`, `111%`, `1,498`, Enterprise Agents, Defense Tech, Vertical AI, Exit Strategies, Climate Tech | **0 hits** |
| Legend values all via the shared formatter | **true** (all 6 carry its tooltip) |

**Vision mode untouched:** no theme panel, no watchlist panel, 0 openable legend
items, still "Not part of the vision mock-up".

---

## 7. Screenshots

1600px, viewport-only.

| File | What |
|---|---|
| `live-themes-momentum.png` | Default — 6 theme lines, per episode, **in page context** |
| `live-themes-volume.png` | Volume lens |
| `live-theme-drilldown.png` | A theme's narratives, two marked "carried by few shows" |
| `live-watchlist.png` | The Topics gear as watchlist |
| `live-overlay.png` | Themes + 2 overlays, badged |
| `state-error.png` | The failed-load state, with no mock figures |

---

## 8. Cost

**$0.** No model call at render time or in the theme build.
