/**
 * Synthea data resolver — the single source of truth for where data came from.
 *
 * Two modes, page-wide:
 *
 *   LIVE   (default)  Only real endpoints. Components that have not been built
 *                     render an honest not-built-yet state. Never mock content.
 *   VISION            Serves the July 2025 unified-data.js everywhere, with a
 *                     persistent page banner and a MOCK badge on every component.
 *
 * The badge is stamped from what THIS FILE actually returned, never from a
 * component declaring its own status. A component cannot mark itself live, and
 * a component that renders without going through the resolver has no
 * data-synthea-source attribute at all — which the debug overlay reports as
 * unclassified rather than silently trusting it.
 *
 * States: pending | live | vision | unbuilt | empty | error
 *
 * `pending` exists to fix the overlay's lazy-load blind spot. Three sidebar
 * components and the search panel do not fetch until scrolled to or used;
 * before phase B they read as MOCK, which is a different claim from "has not
 * fetched yet" and made the page look worse than it was.
 */
(function () {
    'use strict';

    var MODE_KEY = 'synthea.dataMode';
    var LIVE = 'live', VISION = 'vision';

    // Components with no honest implementation. In LIVE they render the
    // not-built state. Classification and effort are from COMPONENT_TRIAGE.md.
    var UNBUILT = {
        'narrative-feed': {
            label: 'Narrative Feed',
            root: '.narrative-feed',
            slot: '.feed-container',
            klass: 'B',
            why: 'Needs episodes ranked by how sharply their topic mentions rose against the previous month, each with a real quote from the chunk that drove the rise.',
            effort: '2–3 days'
        },
        'priority-briefings': {
            label: 'Priority Briefings',
            root: '.priority-briefings-container',
            slot: '#briefings-grid',
            klass: 'B',
            why: 'Needs the highest-reranked passage per recent episode against a set of standing queries, rendered with its real citation and timestamp.',
            effort: '2–3 days, reuses the /api/search path'
        },
        'drilldown': {
            label: 'Narrative Pulse Drilldown',
            root: '.drilldown-panel',
            slot: null,
            klass: 'B',
            why: 'Needs the episodes contributing mentions to a clicked topic-and-month cell. The topic_mentions rollup already stores this per episode.',
            effort: '1 day'
        },
        'intelligence-brief': {
            label: 'Weekly Intelligence Brief',
            root: '.intelligence-brief-sidebar',
            slot: '.brief-content',
            klass: 'C',
            why: 'The headline claims and their source counts require matching the same assertion across episodes. Retrieval finds who discussed a topic; it cannot tell whether two speakers asserted the same proposition.',
            effort: 'Not scheduled — needs claim extraction and cross-episode claim matching'
        },
        'notable-signals': {
            label: 'Notable Signals',
            root: '#notable-signals-container',
            slot: null,
            klass: 'C',
            why: 'A shift count needs a measurable definition of what a shift is, and a week-on-week series to compare against. Neither exists: the corpus is six fixed months ending 23 June 2025.',
            effort: 'Not scheduled — needs a defined, measurable shift metric'
        },
        'consensus-monitor': {
            label: 'Consensus Monitor',
            root: '#consensus-monitor-section',
            slot: '.consensus-monitor-container',
            klass: 'C',
            why: 'Measuring agreement needs stance detection — whether two speakers agree about a proposition, not merely that both mentioned the topic.',
            effort: 'Not scheduled — needs stance detection'
        }
    };

    var state = {};        // key -> state string
    var roots = {};        // key -> element

    function readMode() {
        var q = new URLSearchParams(location.search).get('data');
        if (q === VISION || q === 'mock') return VISION;
        if (q === LIVE) return LIVE;
        try {
            var s = localStorage.getItem(MODE_KEY);
            if (s === VISION || s === LIVE) return s;
        } catch (e) { /* storage blocked; fall through to the default */ }
        return LIVE;                       // LIVE is the default, deliberately
    }

    var mode = readMode();

    function setMode(next) {
        if (next !== LIVE && next !== VISION) return;
        try { localStorage.setItem(MODE_KEY, next); } catch (e) {}
        var url = new URL(location.href);
        url.searchParams.set('data', next);
        location.href = url.toString();    // full reload: components read mode at init
    }

    function stamp(key, next, detail) {
        state[key] = next;
        var el = roots[key] || (UNBUILT[key] && document.querySelector(UNBUILT[key].root));
        if (el) {
            el.setAttribute('data-synthea-source', next);
            if (detail) el.setAttribute('data-synthea-detail', detail);
        }
        document.dispatchEvent(new CustomEvent('synthea:state', { detail: { key: key, state: next } }));
    }

    var API = window.SYNTHEA_API_BASE || 'http://localhost:8000';

    var SyntheaData = {
        LIVE: LIVE,
        VISION: VISION,
        UNBUILT: UNBUILT,

        get mode() { return mode; },
        setMode: setMode,
        isLive: function () { return mode === LIVE; },
        isVision: function () { return mode === VISION; },

        /** Register a component root so the resolver can stamp it. */
        register: function (key, root) {
            if (root) roots[key] = root;
            if (!state[key]) stamp(key, 'pending');
            return root;
        },

        /**
         * The one call every live component makes. Stamps pending, then live or
         * error, from the actual outcome.
         */
        fetchJSON: function (key, path, opts) {
            stamp(key, 'pending');
            if (mode === VISION) {
                stamp(key, 'vision', 'page is in Vision mode');
                return Promise.reject(new Error('vision-mode'));
            }
            var url = /^https?:/.test(path) ? path : API + path;
            return fetch(url, opts || {}).then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.json();
            }).then(function (data) {
                stamp(key, 'live', path);
                return data;
            }).catch(function (err) {
                stamp(key, 'error', String(err.message || err));
                throw err;
            });
        },

        /**
         * Response-preserving variant, for components that need r.ok / r.json().
         * Same contract: the resolver stamps the state from the real outcome.
         */
        fetchResponse: function (key, url, opts) {
            stamp(key, 'pending');
            if (mode === VISION) {
                stamp(key, 'vision', 'page is in Vision mode');
                return Promise.reject(new Error('vision-mode'));
            }
            return fetch(url, opts || {}).then(function (r) {
                stamp(key, r.ok ? 'live' : 'error', r.ok ? String(url) : 'HTTP ' + r.status);
                return r;
            }).catch(function (err) {
                stamp(key, 'error', String(err.message || err));
                throw err;
            });
        },

        /** Attach a component's DOM root once it exists, so badges have a target. */
        claim: function (key, selector) {
            var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
            if (el) { roots[key] = el; if (state[key]) stamp(key, state[key]); }
            return el;
        },

        /** Vision-mode data. Returns null in LIVE, so mock cannot leak. */
        vision: function (key, getter) {
            if (mode !== VISION) { stamp(key, 'unbuilt'); return null; }
            var data = null;
            try { data = getter ? getter(window.unifiedData) : window.unifiedData; } catch (e) { data = null; }
            stamp(key, data ? 'vision' : 'empty');
            return data;
        },

        /** Stamp a state the resolver did not derive from a fetch. */
        mark: function (key, next, detail) {
            if (['pending','live','vision','unbuilt','empty','error'].indexOf(next) === -1) return;
            stamp(key, next, detail);
        },

        state: function (key) { return state[key] || 'pending'; },
        allStates: function () { return JSON.parse(JSON.stringify(state)); },

        /** Everything the overlay needs, without it having to infer anything. */
        report: function () {
            return Object.keys(state).map(function (k) {
                return { key: k, state: state[k], unbuilt: !!UNBUILT[k] };
            });
        }
    };

    window.SyntheaData = SyntheaData;

    // ---------------------------------------------------------------- mode UI

    function buildToggle() {
        var host = document.querySelector('.header-right, .header-actions, header') || document.body;
        var wrap = document.createElement('div');
        wrap.className = 'synthea-mode-toggle';
        wrap.setAttribute('role', 'group');
        wrap.setAttribute('aria-label', 'Data mode');
        [[LIVE, 'Live', 'Real data from the corpus. Unbuilt components show their gaps.'],
         [VISION, 'Vision', 'July 2025 mock-up of the intended product. Nothing here is real data.']
        ].forEach(function (m) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'synthea-mode-btn' + (mode === m[0] ? ' is-active' : '');
            b.textContent = m[1];
            b.title = m[2];
            b.setAttribute('aria-pressed', String(mode === m[0]));
            b.addEventListener('click', function () { setMode(m[0]); });
            wrap.appendChild(b);
        });
        host.appendChild(wrap);
    }

    function buildVisionBanner() {
        if (mode !== VISION) return;
        var bar = document.createElement('div');
        bar.className = 'synthea-vision-banner';
        bar.setAttribute('role', 'status');
        bar.innerHTML =
            '<strong>Vision mock-up — not real data.</strong> ' +
            'Everything on this page is illustrative content dated <b>25 July 2025</b>, ' +
            'showing what the product is intended to do. It is not derived from the ' +
            '1,236-episode corpus. Switch to <b>Live</b> to see what the system actually returns.' +
            '<button type="button" class="synthea-vision-switch">Switch to Live</button>';
        bar.querySelector('.synthea-vision-switch').addEventListener('click', function () { setMode(LIVE); });
        document.body.insertBefore(bar, document.body.firstChild);
        document.body.classList.add('synthea-vision-mode');
    }

    // ------------------------------------------------- unbuilt component state

    function unbuiltMarkup(spec) {
        return '' +
            '<div class="synthea-unbuilt">' +
            '  <div class="synthea-unbuilt-title">Not built yet</div>' +
            '  <p class="synthea-unbuilt-why">' + spec.why + '</p>' +
            '  <div class="synthea-unbuilt-meta">' +
            '    <span class="synthea-unbuilt-tag">Class ' + spec.klass + '</span>' +
            '    <span>' + spec.effort + '</span>' +
            '  </div>' +
            '  <p class="synthea-unbuilt-foot">In <b>Live</b> mode this space stays empty rather than ' +
            '     showing invented content. Switch to <b>Vision</b> to see the intended design.</p>' +
            '</div>';
    }

    function renderUnbuilt() {
        if (mode !== LIVE) return;
        Object.keys(UNBUILT).forEach(function (key) {
            var spec = UNBUILT[key];
            var root = document.querySelector(spec.root);
            if (!root) { stamp(key, 'unbuilt'); return; }
            roots[key] = root;
            var slot = spec.slot ? root.querySelector(spec.slot) : null;
            var target = slot || root;
            // Keep the section heading; replace only the content slot.
            target.innerHTML = unbuiltMarkup(spec);
            // A section's own subtitle can carry time-relative copy that sits
            // outside the slot - "Pattern emergence • Last 48 hours" on the
            // Narrative Feed. The corpus is six fixed months; drop it.
            root.querySelectorAll('.section-subtitle, .panel-subtitle').forEach(function (sub) {
                if (/\b(ago|last \d+ hours?|this week|last week|weekly|w\/w|today|trending now)\b/i
                        .test(sub.textContent || '')) {
                    sub.textContent = 'Not built — see below';
                }
            });
            root.classList.add('synthea-has-unbuilt');
            stamp(key, 'unbuilt');
        });
    }

    // In LIVE the vision dataset must not be reachable at all, so a component
    // that ignores the resolver still cannot render mock content.
    function sealVisionData() {
        if (mode !== LIVE) return;
        try {
            Object.defineProperty(window, 'unifiedData', {
                configurable: true,
                get: function () { return undefined; },
                set: function () { return true; }      // swallow late assignment
            });
        } catch (e) { window.unifiedData = undefined; }
    }

    document.addEventListener('DOMContentLoaded', function () {
        buildVisionBanner();
        buildToggle();
        // Let component initialisers run first, then claim the unbuilt slots.
        setTimeout(renderUnbuilt, 0);
        setTimeout(renderUnbuilt, 900);
        setTimeout(renderUnbuilt, 2500);
    });

    sealVisionData();
})();
