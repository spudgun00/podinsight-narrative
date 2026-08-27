# Narrative Feed — completion report

**27 Aug 2026.** Against `podinsight/UI_ACCEPTANCE.md`. The last class-B
component; the fifth mock retired at its entry point.

---

## What it is

One item per episode, newest first, over every brief in the store.

- **Endpoint** — `GET /api/feed` (`podinsight-api/api/routers/feed.py`), reading
  the same `episode_briefs` index as `/api/briefings`. Sorted
  `published_at desc, episode_id asc`; `limit`/`offset` paging; optional
  `topic` filter on the five tracked topics.
- **Component** — `demo/features/narrative-feed/narrative-feed-live.js`,
  registered through the resolver as `narrative-feed`.
- **Rule, stated on the panel** — *Every episode's brief, newest first.* The
  sentence is served by the endpoint, so it and the sort order cannot drift
  apart.
- **Scale** — 1,236 episodes, 1 Jan – 23 Jun 2025, 30 per page.

The ordering is a fact about the corpus rather than a judgement about it, which
is why the panel can state its rule in one line and a reader can check it. The
Vision feed's ranking — narrative importance — cannot be stated that way,
because nothing computes it.

---

## 1. Parity table

Against the Vision Narrative Feed (`vision-feed.png`, `?data=vision`).

| Vision element | Verdict | Detail |
|---|---|---|
| Section title "NARRATIVE FEED" | **PRESENT** | Unchanged. |
| Subtitle "PATTERN EMERGENCE • LAST 48 HOURS" | **REPLACED** | "1 JAN 2025 – 23 JUN 2025", from the store's own min/max `published_at`. The corpus is six fixed months; there is no last-48-hours window to describe. |
| Feed entry row | **PRESENT** | One per episode instead of one per synthesised narrative. |
| `.feed-time` — "2h ago", "1d ago" | **REPLACED** | `.feed-date`, the episode's real publication date ("23 Jun 2025"). Relative time against a corpus frozen on 23 June 2025 is a false claim about recency. |
| `.feed-event` — "Infrastructure commanding 4x application layer multiples - consensus forming across 8 sources" | **REPLACED** | The brief's `hook`, one line generated from that episode alone. The Vision line asserts a cross-episode count ("across 8 sources") that would need claim matching. |
| `.feed-category` pill — CONSENSUS / DIVERGENCE / TREND / LP INTEL / PATTERN | **DELIBERATELY ABSENT** | Stance detection is not in the stack. Knowing two speakers *mentioned* a topic is not knowing they *agree*. This is the same wall Consensus Monitor and Intelligence Brief are behind, and it is why they still render the not-built state. |
| `→` arrow inside the category pill | **DELIBERATELY ABSENT** | It was the affordance for the pill, which is gone. The row itself is the control and carries `role="button"`. |
| Expand-on-click, `.feed-entry-content` | **REPLACED** | A row opens the full brief panel instead of expanding in place. One brief surface, the same one Notable Episodes and the episode panel open — not a second, shallower one. |
| Expansion: "Sources Reaching Consensus" | **DELIBERATELY ABSENT** | Needs cross-episode claim matching. |
| Expansion: "Dissenting Voice" / "Contrarian Position" | **DELIBERATELY ABSENT** | Needs stance detection. |
| Expansion: "Mainstream Consensus" | **DELIBERATELY ABSENT** | Needs stance detection. |
| Expansion: "Pattern Emerging Across Shows" | **DELIBERATELY ABSENT** | Needs cross-episode clustering. |
| Expansion: "Momentum Indicator" | **DELIBERATELY ABSENT** | Prose about acceleration; nothing computes it at episode level. |
| Expansion: "LP Sentiment Indicators" | **DELIBERATELY ABSENT** | No LP sentiment exists anywhere in the corpus pipeline. |
| Expansion: "Impact on Fundraising" / "Investment Implications" | **DELIBERATELY ABSENT** | Editorial judgement, not a corpus quantity. |
| Expansion: "Converging Thesis Validation" | **DELIBERATELY ABSENT** | Needs claim matching. |
| Expansion source quotes, each with a name and a relative time | **REPLACED** | The brief panel's Key Quotes, verbatim and timestamped to the transcript, reached by opening a row. |
| Share link | **DELIBERATELY ABSENT** | It raised `alert('Share functionality coming soon')`. A control that cannot do its job does not render. |
| Email link | **DELIBERATELY ABSENT** | Same — `alert('Email summary functionality coming soon')`. |
| Quote click → opens a **random** briefing | **REPLACED** | A row opens *its own* episode's brief. The Vision behaviour picked a briefing at random (`narrative-feed.js:41`), which looks like a link and is not one. |
| — | **ADDED** | Podcast chip (`.podcast-badge`), the show name, reusing the Notable Episodes card's chip. |
| — | **ADDED** | Topic tags — the tracked topics that episode actually mentions, the same field the briefings card shows. |
| — | **ADDED** | Quote count per row ("5 quotes"), the number of verbatim, timestamped claims in that episode's brief. |
| — | **ADDED** | Topic filter chips with counts, and a rule sentence. Both exist because the panel now has 1,236 items rather than 6 and has to say what it is showing. |

Nothing in the Vision feed is unaccounted for. Every DELIBERATELY ABSENT row is
absent for a stated capability reason, not because it was skipped.

---

## 2. Interaction audit

Every clickable or focusable node in the component, and what it **did** when
clicked — driven through the Chrome DevTools Protocol against the live page at
`http://localhost:3000/demo.html?data=live`, not read off the source.

| Control | Action taken | Result |
|---|---|---|
| Row (`.nfl-entry`, `role="button"`, ×30) | Clicked the first row | Full brief panel opened on **20VC: The Wild Story Raising $450M From Masa and Softbank… GetYourGuide** — the same episode as the row. `brief-from-row.png`. |
| Row | Focused, pressed **Enter** | Same panel, same episode. `aria-label` matched the panel title exactly. |
| Row | Pressed **Escape** with the panel open | Panel returned to `data-state="closed"`. |
| Row when `window.BriefingsLive` is absent | Code path inspected | Row renders without `role`, `tabindex` or the `is-openable` class — no pointer cursor, no hover highlight. It does not look like a control it cannot be. |
| Topic tag (`.tag`, e.g. `#AIAgents`) | Hovered | Nothing. Not focusable, not in the control list, and the inherited `text-decoration: underline` hover is overridden so it does not read as a link. It is metadata. |
| Chip **All** | Clicked while DePIN was active | Reset to 1,236; `aria-pressed` moved to All, off DePIN; status returned to "Showing 30 of 1,236 episodes." |
| Chip **AI Agents** / **B2B SaaS** / **Capital Efficiency** / **Crypto/Web3** | Clicked | Refetches with `topic=`, list replaced, status names the topic. |
| Chip **DePIN** | Clicked | 2 rows — a16z Podcast (20 Feb 2025) and Bankless (16 Jan 2025). Status: "Showing 2 of 2 episodes mentioning DePIN." Foot: "That is every episode mentioning DePIN." `filter-depin.png`. This is the volume-floor rule holding: counts have no floor, so DePIN drills to its two real episodes. |
| Chip, clicked while already active | Clicked All twice | Second click ignored; no refetch. |
| **Load more** | Clicked | 30 → 60 rows, **0 duplicate episode ids**, dates still strictly descending across the join. Status: "Showing 60 of 1,236 episodes." |
| **Load more** | Scrolled into view without clicking | The IntersectionObserver pressed it: 30 → 60. Same code path as the click — there is nothing reachable only by scrolling. |
| **Load more** while a request is in flight | — | `disabled`, label "Loading…". Re-entry guarded by `this.loading`. |
| **Try again** (error state) | API made to fail once, then clicked | Error box removed, 30 rows loaded, status correct. `state-error.png`. |
| End of list | Paged to the end | Button replaced by "End of the corpus." (unfiltered) or "That is every episode mentioning *X*." (filtered). |

No dead buttons. No placeholder handlers. No `alert()` anywhere in the
component.

---

## 3. States

| State | Screenshot | What renders |
|---|---|---|
| Loading (first page) | `state-loading.png` | Title, then "Loading episodes…". No chips and no rule sentence — nothing about the store is known yet, so nothing is claimed. |
| Loading (next page) | — | The button itself: `disabled`, label "Loading…". The 30 rows already on screen stay. |
| Happy path | `live-feed.png`, `live-page.png` | 30 rows, chips, rule, count, Load more. |
| Empty | `state-empty.png` | "No episode in the corpus mentions DePIN." **Unreachable through the UI**: every chip is built from the store's own facet counts and the smallest is DePIN at 2, so no chip can produce an empty list. Driven directly to prove the path renders and to check its wording. The capture shows the All chip still active, which is an artefact of forcing the state rather than clicking a chip. |
| Error | `state-error.png` | "Could not load the feed." and a working **Try again**. No status code, no endpoint URL, no exception text — the failure detail goes to the resolver's `data-synthea-detail` attribute for the debug overlay, not to the page. |
| Error on a later page | — | "Could not load more episodes." with its own Try again, below the rows already loaded. Those rows are not discarded. |

---

## 4. Screenshots

All at **1440px** viewport, deviceScaleFactor 2, captured through CDP against
`http://localhost:3000/demo.html`.

| File | What |
|---|---|
| `live-page.png` | Live, **in page context** — full dashboard, feed between Narrative Pulse and Notable Episodes. |
| `vision-page.png` | Vision, in page context, same width. |
| `live-feed.png` | Live, component isolated. |
| `vision-feed.png` | Vision, component isolated, **same viewport width** — the side-by-side. |
| `filter-depin.png` | DePIN filter applied. |
| `brief-from-row.png` | The brief panel a row opens. |
| `state-loading.png`, `state-empty.png`, `state-error.png` | States. |
| `live-feed-mobile.png` | 420px. The row collapses from four columns to date + chip / hook / count / tags. |

---

## 5. Copy check

DOM audit scoped to `.narrative-feed-live`, excluding corpus-derived nodes
(`.nfl-podcast`, `.nfl-hook`, `.tag`) per the rule that corpus data is data, not
copy. 77 text nodes examined.

| Check | Result |
|---|---|
| Relative time (`ago`, `this week`, `last N hours`, `today`, `w/w`) | **0 hits** |
| Placeholder strings (`lorem`, `TODO`, `TBD`, `coming soon`, `placeholder`) | **0 hits** |
| Stance vocabulary (`consensus`, `divergence`, `contrarian`, `dissent`, `LP intel`, `thesis validation`) | **0 hits** |
| Invented statistics | **None.** Every number in the component is either a store count (chip counts; "Showing 30 of 1,236") or a per-episode fact (publication date; quote count). |
| Diagnostic text | **None.** Checked specifically in the error state. |

---

## 6. Retiring the mock

Fifth instance. Guarded **at the entry point, before** the placeholder was
retired, per the standing rule.

| Entry point | Guard |
|---|---|
| `features/narrative-feed/init.js` | Now **default-deny**: renders only when the resolver is present *and* in Vision. It previously failed open when the resolver was missing. |
| `NarrativeFeed.init` (`narrative-feed.js`) | Guarded inside the component, so a caller that bypasses `init.js` is covered too. |
| `main.js` component registry | `loaded:` now accepts `NarrativeFeedLive`. This flag gates the postInit pass that boots Priority Briefings — the same trap the Narrative Pulse entry documents. |
| `data-resolver.js` `UNBUILT` | `narrative-feed` removed, with the reason recorded in place. |
| `demo.html` | Live script added; all 30 `?v=` cache-busters bumped to `20260827r`, **and the nine stylesheets that carried no `?v=` at all now do**. |

This mattered more than usual: the live feed reuses the Vision `.feed-container`
class, so an unguarded mock does not merely leave a stale placeholder — it
replaces real rows with "2h ago" and a CONSENSUS pill.

**Verified in both modes.**

- Live: 0 `.feed-category`, 0 `.feed-time`, 0 `.feed-action-link`, 0
  `.synthea-unbuilt` in the container; `data-synthea-source="live"`.
- Vision: mock feed still renders in full — 7 entries, its pills, its "2h ago"
  times, its "Pattern emergence • Last 48 hours" subtitle — and
  `.narrative-feed-live` is absent. No regression.

---

## Found, not fixed

- **`.tag:hover` underlines on the Notable Episodes card too.**
  `styles/priority-briefings-compact.css:223` gives every `.tag` a link's hover
  affordance, and `briefings-live.js` renders non-interactive `<span
  class="tag">`. Overridden inside the feed; the Notable Episodes instance is
  untouched, being outside this component's scope. It is a small dead
  affordance of the kind the standing rule targets.
- **At 420px a page-level customization panel overlays the top of the feed.**
  Page chrome, not the feed — visible in `live-feed-mobile.png`, unrelated to
  this component.
