# Market Narratives — completion report

**28 Aug 2026.** Part B of the discovery engine. Against
`podinsight/UI_ACCEPTANCE.md`. Names approved by James; k=30 and the breadth
floor stand.

---

## What it is

The fifth Notable Signals card, absent since the strip was rebuilt, now
rendering **23 discovered narratives** from the engine in `DISCOVERY_ENGINE.md`.

| | |
|---|---|
| Card | `Market Narratives` — 23, "discovered topics, 7 clusters excluded", top 3 by breadth |
| List | `GET /api/narratives` — 12 shown, ranked by distinct podcasts then episodes |
| Drilldown | `GET /api/narratives/{cluster_id}` — the episodes behind a narrative |
| Brief | A row opens that episode's full brief, the same surface every other list opens |

Chain verified end to end: **card → 12 narratives → 300 episodes → the brief for
"LIMITLESS – AI DEBATE"**.

### Membership is real, not the samples

The cluster documents hold 8 sample chunks each — enough to justify a label,
nowhere near an episode list. Cluster 18 spans **499 episodes** and would have
shown eight of them.

So `build_topic_episodes.py` writes a second index,
**`discovered_topic_episodes`**, one document per (cluster, episode) with that
episode's chunk count — the same shape `entity_episodes` gives Company Tracking,
for the same reason: a number on a card has to be openable.

- **8,695 rows.** No labelling call; clustering is deterministic at
  `random_state=0` and the labels are read back from the build's output, so
  re-running costs **$0**.
- The script **refuses to write** unless the partition reproduces the indexed
  cluster sizes exactly, because a drilldown from a different clustering than
  the card above it would be worse than none.
- **All 30 clusters reconcile** on both chunks and episodes.

---

## 1. Floors, via `trend.js` throughout

Every trend on this surface goes through `SyntheaTrend.format`, the same
function, threshold and colours as the Narrative Pulse legend, Velocity Tracking
and Topic Movement.

**One shared change was needed.** Narratives count **chunks** — passages of
transcript — not mentions, and one episode contributes several. The floor
arithmetic is identical, but calling a chunk a "mention" would be a false label
and giving narratives their own copy of the function would let the two drift.
`format(topic, unit)` now takes an optional unit, defaulting to `'mention'`, so
**every existing caller is unchanged** and the narrative rows read "passages":

> "Change against the previous complete month, from a baseline of 413 passages.
> 2603 passages in total."

June is flagged `partial` in the series exactly as `/api/topic-mentions` flags
it, so a partial month is never a baseline.

---

## 2. Parity table

Against the Vision Notable Signals strip's Market Narratives card.

| Vision element | Verdict | Detail |
|---|---|---|
| "Market Narratives" card | **PRESENT** | Renders for the first time. |
| "67 narrative shifts detected" | **REPLACED** | "23 discovered topics, 7 clusters excluded". Both real counts. |
| "↑ 24 from last week" | **DELIBERATELY ABSENT** | No week exists, and nothing counts a shift. |
| Signal icon circle | **DELIBERATELY ABSENT** | Decorative; the card carries counts and a ranking rule. |
| `.signal-strength` confidence dots | **DELIBERATELY ABSENT** | Nothing computes a confidence score. Label confidence is a gate on shipping a name, not a number to display. |
| Signal detail panel | **REPLACED** | The narratives list, in the Narrative Pulse drilldown's own markup and classes. |
| — | **ADDED** | Breadth ranking, stated on the card. |
| — | **ADDED** | Per-narrative trend through the shared floor. |
| — | **ADDED** | Topic → episodes → brief. |
| — | **ADDED** | The method statement, naming clustering, the model, and all three exclusions. |

---

## 3. Interaction audit

| Control | Action taken | Result |
|---|---|---|
| **Market Narratives** card | Clicked | Panel opened: "23 narratives from 30 clusters, k=30. Jan–Jun 2025." 12 rows. |
| Narrative row (×12) | Clicked | Drilldown: "AI impact on jobs and productivity", "30 podcasts · 499 episodes · 2,603 passages", 300 rows, biggest contributor first. |
| Narrative row | **Enter** | Same. |
| **← All narratives** | Clicked | Returns to the list. |
| Episode row | Clicked | Opened the brief for that episode. |
| Episode row | **Enter** | Same. |
| Close ✕ / backdrop / **Escape** | Each tried | `data-state="closed"` each time. |
| Trend value | Hovered | The shared formatter's own tooltip, in passages. |
| Breadth count | Hovered | "30 distinct podcasts — the breadth this list is ranked by". |

Controls: 2 openable cards, 1 Ask button, 1 close, 12 narrative rows. **No dead
controls.**

---

## 4. States

| State | What renders |
|---|---|
| Loading | "Loading signals…", then "Loading…" inside the panel while a drilldown fetches |
| Card absent | **If `/api/narratives` fails or is empty, the card does not render at all** — the slot returns to being absent, not empty, exactly as it was before the engine existed |
| Drilldown error | "Could not load the episodes behind this narrative." with the back control still present |
| Truncated | "Showing the top 300 of 499." |

---

## 5. DOM audit

| Check | Result |
|---|---|
| Text nodes examined (card + panel, corpus-derived excluded) | 60 |
| Relative time, incl. "weekly", "shifts detected" | **0 hits** |
| Placeholders | **0 hits** |
| **Excluded clusters leaking into the UI** | **None.** No `unlabelled`, no `(not named)`, and "Ethereum scaling" — a high-confidence label held back by the breadth floor — appears nowhere. |
| Sponsor clusters | **Not listed.** The word "sponsor" appears once, in the method statement saying sponsor read-outs are excluded. That is the disclosure, not a leak. |
| **Narrative Pulse** | **Untouched** — 7 SVGs, 5 legend items, title intact. No changes were made to it. |
| Vision mode | 5 mock cards, "Key patterns from this week's episodes", no `.nsl`, no narrative panel |

---

## 6. Screenshots

1600px, viewport-only (the panel is `position: fixed`).

| File | What |
|---|---|
| `live-strip-with-narratives.png` | The strip with five cards, **in page context** |
| `live-narrative-list.png` | The 23 narratives, breadth-ranked, with trends |
| `live-narrative-drilldown.png` | Topic → episodes |

---

## 7. Cost

**$0** for Part B. No model call is made at render time or by
`build_topic_episodes.py`. Topic discovery total remains **$0.3765**.
