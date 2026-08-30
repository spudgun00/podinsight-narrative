# Corpus-range fallback, and cache-busting the document

**31 Aug 2026.** Two small defects found while doing pass one of the entity
extractor pilot, recorded then rather than fixed then, and fixed now. Governed by
`../../../../UI_ACCEPTANCE.md`.

Neither is a new component. This record covers what changed and the states around
it.

---

## Defect 1 — a date the page could not know

`demo.html:145` shipped `Jan–Jun 2025` as the static text of the
`[data-corpus-range]` button in the search dropdown. `SyntheaData.fillRange`
overwrote it with the real period from `/api/signals`, and **returned early when
it could not** — leaving the hardcoded date standing.

So whenever the API was unreachable the page stated a corpus range that stopped
being true the day the backfill landed. Returning early is only safe when the
fallback is honest; this one was a fiction, and it was the fiction a reader would
see precisely when the page was least able to correct itself.

**Fix.** The markup no longer carries a date at all — it ships `Range
unavailable`. `fillRange` now writes on both paths: the real label when the
figures arrive, and the unavailable string when they do not. A node that ships
visible text is a standalone label and gets the string; a node that ships empty
is a suffix on someone else's sentence and stays empty, because "Range
unavailable" tacked onto a subtitle reads worse than nothing. `SyntheaData.UNAVAILABLE`
holds the wording, in one place.

Files: `demo.html`, `data-resolver.js`.

## Defect 2 — the document had no cache-busting

Every script and stylesheet carries `?v=`; all 45 move together, per standing
rule 7. **The document itself carried nothing**, and it cannot: a user types
`/dashboard` or `/demo.html` and there is nowhere to put a query string.

A browser holding a stale `demo.html` therefore serves the *previous* build of
all 45 assets, by their old `?v=`. This is not hypothetical — it made a
before/after screenshot pair on 30 Aug render the same build twice, and it was
only caught because the two shots were identical when they should not have been.

**Fix.** Three parts, because the honest mechanism is a header and the rest is
belt to that brace:

| Part | Where | What it does |
|---|---|---|
| `Cache-Control: no-cache, must-revalidate` on the document only | `vercel.json` (production), `serve.py` (local) | The real enforcement. Assets keep caching hard, because they carry `?v=` |
| `<meta name="build-version" content="20260831a">` | `demo.html` | Declares the build the document belongs to, readable from the page and from a screenshot script |
| `<meta http-equiv="Cache-Control" content="no-cache">` | `demo.html` | Advisory; catches the case where the document is opened from disk or served by something that sets no header |

All 45 asset tags moved to `20260831a` at the same time, and the meta stamp
carries the same string. The comment in `demo.html` says to bump them together
and never one alone.

Verified against the local server:

```
$ curl -sI http://localhost:5173/demo.html   | grep -i cache-control
Cache-Control: no-cache, must-revalidate
$ curl -sI http://localhost:5173/data-resolver.js?v=20260831a | grep -i cache-control
(nothing — assets are still cacheable, which is the point)
```

---

## 1. Parity table

Scope: the `[data-corpus-range]` label and the document's cache headers. Nothing
else in the search dropdown changed.

| Vision element | Verdict | Detail |
|---|---|---|
| A stated corpus range in the search dropdown | PRESENT | Now `Jan 2025–Aug 2026`, read from `/api/signals` at request time. |
| That range when the figures cannot be read | **REPLACED** | Was the hardcoded `Jan–Jun 2025`. Now `Range unavailable` — the same shape as the `Unavailable — the API did not respond.` already rendered directly beneath it for Topic Movement. |
| A date in static markup | **DELIBERATELY ABSENT** | There is now no date anywhere in `demo.html` for this control. A date the page cannot verify is copy pretending to be data. |
| Cache-busting on the document | **REPLACED** | Was absent. Now a `Cache-Control` header plus a `build-version` stamp; the `?v=` mechanism on assets is unchanged. |

## 2. Interaction audit

| Control | Action taken | Result |
|---|---|---|
| Search input (opens the dropdown) | Focused, dropdown opened, API reachable | Range button rendered `Jan 2025–Aug 2026`. Button is `disabled`, as before — it states the range, it does not filter. |
| Search input, API unreachable | Same, with the page pointed at a dead port | Range button rendered `Range unavailable`. No date, no endpoint URL, no exception text. |
| Range button | Clicked | Nothing, by design: `disabled`, with the title "The corpus range is set by the episodes in it, not chosen here". Unchanged. |

No control was added or removed.

## 3. States

| State | Screenshot | Reading |
|---|---|---|
| API reachable | `range-live-panel.png`, `range-live-page.png` | `Jan 2025–Aug 2026` |
| API unreachable | `range-apidown-panel.png`, `range-apidown-page.png` | `Range unavailable` |

`range-live.json` and `range-apidown.json` hold the DOM readings, including
`build_version: 20260831a` in both, which is how the shots are known to be of
this build and not a cached earlier one — the defect that made this record
necessary.

Loading is not separately shot: the button holds `Range unavailable` from the
markup until `fillRange` resolves, so the loading state and the failure state
render identically and neither is a fiction.

## 4. Screenshots

- Viewport 1440×1000, `deviceScaleFactor` 2, identical for both.
- `*-panel.png` clips the open dropdown; `*-page.png` is the same frame in page
  context.
- **Viewport-only, per standing rule 8.**
- The dropdown is opened by focusing `#searchInput` and adding the `active`
  class the app itself adds at `search.js:285`, so the shot is of the real
  element in its real open state.

## 5. Copy check

DOM audit scoped to `#searchDropdown`:

- No relative time.
- No invented statistics.
- No placeholder strings.
- No diagnostic text in either state.

---

## Found here, not fixed here

**`data-furniture.js:121` hardcodes "Complete months only. The corpus ends 23
June 2025."** It renders directly under the range button — both are visible in
`range-live-panel.png`, stating two different end dates about the same corpus,
three lines apart. It is the same class of defect as the one this record fixes
and it is *not* in the brief for this session, so it is recorded rather than
quietly swept in. It needs the same treatment: derive the date from
`SyntheaData.corpus()`, or say nothing.
