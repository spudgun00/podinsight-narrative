# Intelligence Brief redesign — completion report

**28 Aug 2026.** Against `podinsight/UI_ACCEPTANCE.md`. Phase E. The last
unbuilt surface with a future.

---

## What it is

One cached document for the whole period. **"Intelligence Brief · Jan–Jun
2025"** — not "Weekly", because the corpus is six fixed months.

Generated once by `podinsight-aws-pilot/build_intelligence_brief.py`, written to
the `intelligence_brief` index, served by `GET /api/intelligence-brief`,
rendered by `features/intelligence-brief/intelligence-brief-live.js`. Nothing is
generated per view.

| Section | Source |
|---|---|
| **a. The Period in Numbers** | Rollup arithmetic. Nothing generated. |
| **b. What Dominated** | Sonnet 4.5, one cached generation, from verified claims only, cited sentence by sentence. |
| **c. Notable Claims** | The essential quote of each top-ranked Notable Episode, by a stated rule. |
| **d. What is not here** | The honest absence where consensus, contrarian signals and blindspots sat. |

---

## 1. Sections

### a. The Period in Numbers

1,236 episodes · 31 podcasts · 1,136 hours · 2025-01-01 to 2025-06-23. Then
topics with mention counts (Crypto/Web3 9,778 · AI Agents 1,781 · B2B SaaS 105 ·
Capital Efficiency 71 · DePIN 2), most-mentioned companies, most-mentioned
people. Every figure is a rollup aggregation.

**The company/person split needed a curation decision, and it is stated on the
page.** spaCy's labels cannot make it: the 2025 extraction tags **Bitcoin,
Anthropic, Solana and Uber as PERSON** and **OpenAI, LinkedIn and Spotify as
GPE** (places). Merging across labels made the entity list rankable; it did not
make the label mean anything. So the split comes from an explicit, versioned map
(`ENTITY_KIND` v1) in the builder — the same pattern as the stoplist, each entry
auditable — and the section carries a note naming two defects that survive it:

- **Surface forms are not folded.** "Trump" (487 episodes) and "Donald Trump"
  (141) appear as separate rows for one person. Folding them is the alias
  table's job, not a second merge mechanism invented here.
- **Ambiguous names are classed as neither.** "Gemini" is a Google model and a
  crypto exchange; "Doge" is a memecoin and a government department.

### b. What Dominated

One paragraph per topic **that clears the 50-mention volume floor** — four of
five. DePIN is named as excluded with its count and the reason, rather than
quietly dropped.

The writer received **only** claim text from the brief store, each with an id,
and was required to cite ids per sentence. 28 citations across 16 sentences, all
resolving. Every citation renders with the source episode, the claim, the
**verbatim quote**, the timestamp and **Play**; all 28 are located well enough to
play a clip. A "Full brief" control opens that episode's full brief.

### c. Notable Claims

8 claims, one per top-ranked Notable Episode, with the rule printed above them:
*the longest quote carrying a numeric figure, falling back to the longest quote.*
Same rule the Notable Episodes cards use, restated so the section can state it.
All 8 have quote, timestamp and Play.

### d. What is not here

> Consensus, contrarian signals and blindspots are not here. Measuring agreement
> across speakers requires claim matching, which does not exist yet: retrieval
> can find who discussed a topic, but it cannot tell whether two speakers
> asserted the same proposition, or opposite ones.

---

## 2. Validation

Three rules, applied **per sentence**, before the document ships:

1. every cited claim id resolves to a claim actually supplied to the writer;
2. every numeral in the sentence appears verbatim in the text of a claim **that
   sentence** cites;
3. no relative-time strings.

A generation with any failing sentence regenerates **once**, then ships without
the failing sentences.

### What it caught, on the shipped run

| Attempt | Kept | Rejected | Reasons |
|---|---|---|---|
| 1 | 11 | 3 | one **hallucinated citation id** that resolved to nothing; two **relative-time strings** ("the previous week", and one more) |
| 2 | **16** | **0** | — |

**A retry at temperature 0 is not a retry.** The first implementation
regenerated the same prompt and got back a character-identical response with the
same three rejections — the brief generator had already learned this across
1,236 episodes. The retry now feeds the rejected sentences and their reasons
back in, which makes it a real second attempt. That change is what took the
document from 12 kept / 2 dropped to 16 kept / 0 dropped.

**The validator had a bug of its own, and it cost a true sentence.** The numeral
pattern `\d[\d,]*` swallowed sentence punctuation: "aged 22 to 24, which" yielded
`"24,"`, which is not in the claim, though `24` is. A correct sentence was
rejected as an invented figure. The pattern now requires a digit after any inner
comma. Found by reading every rejection rather than trusting the count.

**Relative time needed widening.** The first regex caught "this week" and "last
week" but not **"the previous week"**, which reached the shipped prose. It now
covers `this|last|the previous|the prior|the past|next` × `week|month|quarter|
year|cycle`, and the sentence carrying it was rejected and rewritten on retry.

Verified on the shipped document: **0 relative-time hits in the generated prose,
0 sentences without a citation, all 28 cited ids resolve.**

---

## 3. Parity table

Against the Vision Weekly Intelligence Brief (`vision-brief.png`).

| Vision element | Verdict | Detail |
|---|---|---|
| "WEEKLY INTELLIGENCE BRIEF" | **REPLACED** | "Intelligence Brief · Jan–Jun 2025". There is no week. |
| Meta line | **REPLACED** | "1,236 episodes · 31 podcasts · 1,136 hours", with the generation model in its tooltip. |
| Share link | **DELIBERATELY ABSENT** | Its handler lives below the Live guard in `intelligence-brief.js`, so in Live it never had one. |
| Email link | **DELIBERATELY ABSENT** | Same. |
| "Download Brief (PDF)" | **DELIBERATELY ABSENT** | Nothing generates a PDF. Same dead handler. |
| CONSENSUS FORMING preview | **DELIBERATELY ABSENT** | Needs claim matching. Named in the absence note. |
| CONTRARIAN SIGNALS preview | **DELIBERATELY ABSENT** | Needs stance detection. Named in the absence note. |
| EMERGING BLINDSPOTS preview | **DELIBERATELY ABSENT** | Needs claim matching across episodes. Named in the absence note. |
| Value indicator badges | **DELIBERATELY ABSENT** | Scores nothing computes. |
| Collapsed → expanded structure | **PRESENT** | Kept, and it is the reason a long document fits a 320px sidebar. |
| "Expand Brief" button | **PRESENT** | Works; toggles label to "Collapse brief"; `aria-expanded` tracks it. |
| `.brief-section` / `.brief-section-title` grammar | **PRESENT** | Reused for all four sections. |
| — | **ADDED** | The Period in Numbers. |
| — | **ADDED** | Per-sentence citations, each opening to quote, timestamp and Play. |
| — | **ADDED** | Notable Claims with its selection rule printed. |
| — | **ADDED** | The absence note and the validation rules, on the page. |

---

## 4. Interaction audit

| Control | Action taken | Result |
|---|---|---|
| Citation marker ◆ (×28) | Clicked | Opened inline: "BANKLESS · 2025-01-22", episode title, the claim, the verbatim quote, timestamp **4:25**, Play, Full brief. |
| Same marker | Clicked again | Closed. Toggles cleanly. |
| **Play** (×8 notable + one per open citation) | Clicked | Fetched `/api/v1/audio_clips/…`, returned a real S3 clip URL and played it; label went "Loading…" → "▮▮ Playing" in 26.7s (cold Lambda). |
| **Full brief** | Present only when `BriefingsLive` exists | Opens that episode's full brief panel. A control that cannot do its job does not render. |
| **Expand brief** | Clicked | 7 collapsible blocks revealed; label → "Collapse brief". |
| Vision's Download PDF / Share / Email | Searched for in Live | **Not in the DOM at all.** |

Controls in the component: 28 × citation marker, 8 × Play, 8 × Full brief, 1 ×
Expand. No dead controls.

---

## 5. States

| State | What renders |
|---|---|
| Loading | "Loading the brief…" |
| Error | "Could not load the brief." and a working **Try again**. No status code, no endpoint URL. |
| Collapsed (default) | Header, the numbers, the first topic paragraph, Expand. |
| Expanded | All four topics, the DePIN exclusion, Notable Claims, the absence note, the validation rules. |
| Sentences dropped | If validation drops any, the count and reasons render in the expanded region. On the shipped document this is empty, because none was dropped. |

---

## 6. Screenshots

1440px. The brief is not `position: fixed`, so the expanded shot is clipped to
the component; the rest are viewport-only.

| File | What |
|---|---|
| `live-brief-collapsed.png` | Live, **in page context**. |
| `live-brief-expanded.png` | The whole document. |
| `live-citation-open.png` | A citation opened, with quote, timestamp and Play. |
| `vision-brief.png` | Vision, same viewport width — the side-by-side. |

---

## 7. Copy check

DOM audit scoped to `.ibl`, excluding corpus-derived nodes (rank names,
citation sources, titles, claims, quotes, and the generated paragraphs, which
are checked separately). 64 text nodes.

| Check | Result |
|---|---|
| Relative time, incl. "weekly" | **0 hits** |
| Placeholders, incl. "loading" | **0 hits** |
| Generated prose, checked separately | **0 relative-time hits**, **0 sentences without a citation** |

**One relative-time string does appear on the page, inside a verbatim quote:**
*"That was last night on January 21st."* It is a speaker's words, quoted exactly,
and the quote is verbatim-checked against the transcript. Editing it would break
the guarantee that makes citations worth having. Corpus data is data, not copy.

---

## 8. Retiring the mock — instance seven

The mock's *content* path was already guarded: `IntelligenceBrief.init` returns
before `bindEvents()` in Live. What was **not** handled is that
`init.js` injects `intelligence-brief.html` in Live too — it must, because the
live sidebar components live in that same template — so the Vision **markup**
shipped into Live: Download PDF, Share, Email, and three "Loading..." preview
sections, all with no handlers. The not-built card happened to cover them.

`intelligence-brief-live.js` now waits for the slot and replaces `.brief-content`
outright, so that markup does not render. Verified in Live: `downloadBriefBtn`
absent, 0 share links, all three preview sections absent, the word "weekly"
absent, 0 unbuilt cards.

**Vision untouched:** "WEEKLY INTELLIGENCE BRIEF", the three previews, Download
PDF, 2 share links, no `.ibl`, and the Consensus Monitor section still present.

---

## 9. Cost

| Run | Calls | Tokens | Cost |
|---|---|---|---|
| Dry run (before the validator fixes) | 2 | 6.4k in / 3.7k out | $0.0731 |
| First build | 2 | 6.4k in / 3.7k out | $0.0752 |
| **Shipped build** | **2** | **6,518 in / 3,574 out** | **$0.0732** |
| **Total spent on this section** | 6 | — | **$0.2215** |

The shipped document cost **$0.0732** — two Sonnet 4.5 calls, the second being
the validation retry. Well under the $1 expected. Project spend to date is
approximately **$71.30**.
