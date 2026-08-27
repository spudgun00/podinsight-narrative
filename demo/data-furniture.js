/**
 * Page furniture, resolved through SyntheaData like every component.
 *
 * COMPONENT_TRIAGE.md §4 listed the statistics that render outside any
 * component and so could never be covered by a component-level badge. They are
 * handled here: derived from live data, or removed. Nothing is left hardcoded.
 *
 *   Search suggestions   Verified against the running API before shipping. Each
 *                        one was run through POST /api/search and kept only if
 *                        it returned a synthesised answer with citations. The
 *                        DePIN suggestion is gone: 2 mentions in 2 episodes of
 *                        1,236, and it was advertised at "+190% w/w".
 *   Trending topics      Derived from /api/topic-mentions, using the same
 *                        month-over-month change Velocity Tracking shows, over
 *                        complete buckets only. Labelled as such. No w/w.
 *   Company tracking     Removed in Live. No company tracking exists and no
 *                        sentiment is computed anywhere in the stack.
 *   Headline stats       Already live via header-stats.js -> /api/episodes.
 */
(function () {
    'use strict';

    // Verified 27 Aug 2026 against the running API by
    // podinsight-aws-pilot/verify_suggestions.py. 13 of 14 candidates passed;
    // "What advice is there on burn and runway?" was rejected (scored 0.001061,
    // below the 0.00113 cutoff) and is not shipped.
    var VERIFIED_SUGGESTIONS = [
        { q: 'How much ARR do you need to raise a Series A?',            topic: 'Capital Efficiency' },
        { q: 'How is AI changing B2B SaaS pricing?',                     topic: 'B2B SaaS' },
        { q: 'How are stablecoins actually being used?',                 topic: 'Crypto/Web3' },
        { q: 'What are investors saying about AI agents?',               topic: 'AI Agents' },
        { q: 'What do investors think about crypto right now?',          topic: 'Crypto/Web3' },
        { q: 'How are AI agents changing software companies?',           topic: 'AI Agents' },
        { q: 'What does going multi-product look like for SaaS companies?', topic: 'B2B SaaS' },
        { q: 'What is the argument for Bitcoin as a treasury asset?',    topic: 'Crypto/Web3' },
        { q: 'What does capital efficiency mean for founders now?',      topic: 'Capital Efficiency' },
        { q: 'Where do AI agents actually work in production today?',    topic: 'AI Agents' }
    ];

    var SD = window.SyntheaData;
    if (!SD) return;

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }

    function section(title) {
        var s = el('div', 'dropdown-section');
        s.appendChild(el('div', 'section-title', title));
        return s;
    }

    function suggestionItem(text, badge) {
        var i = el('div', 'suggestion-item');
        i.appendChild(el('span', null, text));
        if (badge) i.appendChild(el('span', 'trending-badge', badge));
        i.addEventListener('click', function () {
            if (window.patternFlowSearch) window.patternFlowSearch.fillSearch(text);
        });
        return i;
    }

    /** Replace the hardcoded dropdown with verified queries and live movement. */
    function rebuildDropdown() {
        var dd = document.getElementById('searchDropdown');
        if (!dd) return;
        SD.register('search-suggestions', dd);

        if (SD.isVision()) {
            SD.vision('search-suggestions', function (d) { return d; });
            return;                              // leave the July 2025 copy alone
        }

        dd.querySelectorAll('.dropdown-section').forEach(function (n) { n.remove(); });

        var picks = VERIFIED_SUGGESTIONS.slice(0, 5);
        var s1 = section('Try one of these');
        picks.forEach(function (p) { s1.appendChild(suggestionItem(p.q)); });
        dd.appendChild(s1);
        SD.claim('search-suggestions', dd);
        // Live because every one of these was executed against the running API
        // and kept only if it returned a synthesised answer with citations.
        SD.mark('search-suggestions', 'live',
                picks.length + ' queries verified against /api/search');

        var s2 = section('Topic movement');
        var note = el('div', 'suggestion-item');
        note.appendChild(el('span', null, 'Loading from the corpus…'));
        s2.appendChild(note);
        dd.appendChild(s2);

        SD.fetchJSON('trending-topics', '/api/topic-mentions').then(function (data) {
            s2.innerHTML = '';
            s2.appendChild(el('div', 'section-title', 'Topic movement, month over month'));
            // Same shared formatter, so a topic suppressed as "low volume" in
            // the sidebar is suppressed here too.
            (data.topics || [])
                .filter(function (t) { return t.has_data; })
                .map(function (t) { return { t: t, fmt: window.SyntheaTrend.format(t) }; })
                .sort(function (a, b) {
                    if (a.fmt.suppressed !== b.fmt.suppressed) return a.fmt.suppressed ? 1 : -1;
                    return Math.abs(b.t.change_pct || 0) - Math.abs(a.t.change_pct || 0);
                })
                .forEach(function (row) {
                    var arrow = row.fmt.dir === 'rising' ? '↑'
                              : (row.fmt.dir === 'falling' ? '↓' : '');
                    // The arrow already carries the direction, so strip the
                    // sign from the number rather than printing "down -10%".
                    var item = suggestionItem(row.t.topic,
                        row.fmt.suppressed ? row.fmt.text
                                           : arrow + row.fmt.text.replace(/^[+-]/, ''));
                    var badge = item.querySelector('.trending-badge');
                    if (badge) { badge.style.color = row.fmt.colour; badge.title = row.fmt.title; }
                    s2.appendChild(item);
                });
            var foot = el('div', 'suggestion-item');
            var span = el('span', null,
                'Complete months only. The corpus ends 23 June 2025.');
            span.style.fontSize = '11px';
            span.style.opacity = '0.65';
            foot.appendChild(span);
            s2.appendChild(foot);
            SD.claim('trending-topics', s2);
        }).catch(function () {
            s2.innerHTML = '';
            s2.appendChild(el('div', 'section-title', 'Topic movement'));
            var f = el('div', 'suggestion-item');
            f.appendChild(el('span', null, 'Unavailable — the API did not respond.'));
            s2.appendChild(f);
            SD.register('trending-topics', s2);
        });
    }

    /** Company tracking metrics are invented end to end. Remove them in Live. */
    function handleCompanyTracking() {
        var host = document.getElementById('portfolio-metrics');
        if (!host) return;
        SD.register('company-tracking', host);
        if (SD.isVision()) { SD.vision('company-tracking', function (d) { return d; }); return; }
        host.innerHTML =
            '<span class="metrics-text">Company tracking is not built. No company mentions ' +
            'or sentiment are computed anywhere in the stack.</span>';
        SD.mark('company-tracking', 'unbuilt', 'no company tracking or sentiment exists');
    }

    /** The stale-data validator is meaningless in Live and wrong in Vision. */
    function handleValidator() {
        if (SD.isLive()) {
            window.__syntheaSuppressDataValidator = true;
            return;
        }
        window.__syntheaValidatorNote =
            'Vision mode: the 25 July 2025 stamp is the date of the mock-up, not stale data.';
    }

    /**
     * The search panel ships pre-seeded with example citation cards ("2 days
     * ago", "4 days ago") that sit in the DOM before any search runs. They are
     * illustrative, not retrieved, so Live mode clears them and waits.
     */
    function clearSeededSearchResults() {
        if (!SD.isLive()) return;
        var previews = document.getElementById('sourcePreviewsContainer');
        if (previews) previews.innerHTML = '';
        var insight = document.querySelector('#searchResults .insight-text');
        if (insight) insight.innerHTML = '';
        var meta = document.querySelector('#searchResults .confidence-metadata .discussion-count');
        if (meta) meta.textContent = '';
        var content = document.querySelector('#searchResults .synthesis-content');
        if (content) {
            content.style.display = 'none';       // shown again when a search returns
            SD.claim('search', document.getElementById('searchPanel'));
            SD.mark('search', 'pending', 'no search run yet');
        }
    }

    /**
     * Lint that would otherwise go stale: a hardcoded copyright year, and a
     * "1,498 episodes" claim against a corpus of 1,236. The year is computed
     * and the count comes from /api/episodes.
     */
    function fixStaleCopy() {
        var yr = document.getElementById('footerYear');
        if (yr) yr.textContent = String(new Date().getFullYear());

        var slot = document.getElementById('corpusEpisodeCount');
        if (!slot) return;
        if (SD.isVision()) { slot.textContent = 'the corpus'; return; }
        SD.fetchJSON('corpus-count', '/api/episodes?limit=1').then(function (d) {
            var n = d && d.total;
            slot.textContent = n ? n.toLocaleString() + ' episodes' : 'the corpus';
        }).catch(function () { slot.textContent = 'the corpus'; });
    }

    document.addEventListener('DOMContentLoaded', function () {
        handleValidator();
        setTimeout(fixStaleCopy, 80);
        setTimeout(clearSeededSearchResults, 120);
        setTimeout(clearSeededSearchResults, 1200);
        setTimeout(rebuildDropdown, 60);
        setTimeout(handleCompanyTracking, 60);
    });
})();
