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
        // narrative-feed retired from this list on 27 Aug 2026: it is now
        // built, from the brief store, by
        // features/narrative-feed/narrative-feed-live.js (GET /api/feed). The
        // ranked-by-topic-rise design described here was never the only honest
        // option - date order is a fact about the corpus and needs nothing
        // computed - and that is what shipped.
        // intelligence-brief retired from this list on 28 Aug 2026: it is built,
        // by features/intelligence-brief/intelligence-brief-live.js against
        // GET /api/intelligence-brief. The redesign dropped the three sections
        // that needed claim matching rather than waiting for it, and says so on
        // the page - see the document's absence note.
        // notable-signals retired from this list on 28 Aug 2026: the strip is
        // built, by features/notable-signals/notable-signals-live.js, from four
        // cards that each have a real source. The fifth Vision card, Market
        // Narratives, does not render at all - it needs the parked
        // topic-discovery engine, and an absent card is honest where an empty
        // one invites a reader to wonder what broke.
        // consensus-monitor is not here because it is no longer a Live surface
        // at all. Dropped 28 Aug 2026 by James: stance detection is not on any
        // roadmap, so a permanent not-built card is worse than the honest
        // absence of a section. intelligence-brief.js removes it from the
        // sidebar in Live. Vision still renders it in full.
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

    // ------------------------------------------------- one request per URL
    //
    // Three components each read GET /api/episodes, and three more each read
    // GET /api/topic-mentions?bucket=month. They fire within a few ms of each
    // other on load, so the page was asking for the same bytes three times -
    // measured at 1.1 MB of the cold load, and three times the work for an API
    // that answers them one at a time.
    //
    // Identical in-flight GETs now share one request. Only in-flight: nothing
    // is retained after it settles, so this is de-duplication, not a cache,
    // and it cannot serve anything stale.
    //
    // The caller's AbortController is deliberately NOT passed to the shared
    // fetch. Each component sets its own timeout, and one component timing out
    // must not cancel the response the other two are waiting for. Instead the
    // signal rejects that caller's promise alone, which is the behaviour each
    // component already handles.
    var inflight = {};
    var corpusPromise = null;

    function sharedGet(url, opts) {
        var o = opts || {};
        // Anything with a body, a non-GET method or custom headers is somebody
        // else's request; it goes straight out.
        if (o.body || (o.method && o.method.toUpperCase() !== 'GET') || o.headers) {
            return fetch(url, o);
        }
        if (!inflight[url]) {
            requestStarted();
            inflight[url] = fetch(url).then(function (r) {
                delete inflight[url];
                requestSettled();
                return r;
            }, function (e) {
                delete inflight[url];
                requestSettled();
                throw e;
            });
        }
        // Every caller gets its own Response. The shared one is never read, so
        // it is always safe to clone.
        return withSignal(inflight[url], o.signal).then(function (r) { return r.clone(); });
    }

    function withSignal(promise, signal) {
        if (!signal) return promise;
        if (signal.aborted) return Promise.reject(abortError());
        return new Promise(function (resolve, reject) {
            function onAbort() { reject(abortError()); }
            signal.addEventListener('abort', onAbort, { once: true });
            promise.then(function (v) {
                signal.removeEventListener('abort', onAbort); resolve(v);
            }, function (e) {
                signal.removeEventListener('abort', onAbort); reject(e);
            });
        });
    }

    function abortError() {
        // Components branch on error.name === 'AbortError' to tell a timeout
        // from a failure, so the shape has to match what fetch itself throws.
        var e = new Error('The operation was aborted.');
        e.name = 'AbortError';
        return e;
    }

    // The period label the page shows, built from the corpus's real first and
    // last episode rather than written down. "Jan-Jun 2025" was hardcoded in
    // five places; the backfill makes the corpus current, and a label that says
    // Jun 2025 over episodes from this month is simply a lie.
    /* Add the active window to any of our own API calls. Absolute URLs to
     * other hosts, and the audio-clip Lambda, are left alone: the window is a
     * property of this API's period questions, not of every request. */
    function withWindow(url) {
        if (!/\/api\//.test(url)) return url;
        if (/[?&]window=/.test(url)) return url;            // caller was explicit
        var w = SyntheaData.getWindow();
        return url + (url.indexOf('?') === -1 ? '?' : '&') + 'window=' + encodeURIComponent(w);
    }

    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function rangeLabel(period) {
        // period is "YYYY-MM-DD to YYYY-MM-DD", straight from the index.
        var m = /^(\d{4})-(\d{2})-\d{2}\s+to\s+(\d{4})-(\d{2})-\d{2}$/.exec(period || '');
        if (!m) return null;
        var y1 = m[1], m1 = MONTHS[+m[2] - 1], y2 = m[3], m2 = MONTHS[+m[4] - 1];
        if (y1 === y2) {
            return m1 === m2 ? m1 + ' ' + y1 : m1 + '\u2013' + m2 + ' ' + y1;
        }
        return m1 + ' ' + y1 + '\u2013' + m2 + ' ' + y2;
    }

    // Entity coverage lags the corpus: extraction reads precomputed artefacts
    // that exist only for the pre-backfill episodes. Surfaces built on entities
    // are correct AND incomplete, so they say through when. Derived from the
    // API, never written down, so the label removes itself the moment
    // extraction catches up - `complete` flips and this returns null.
    var coveragePromise = null;

    function coverageLabel(cov) {
        if (!cov || cov.complete || !cov.entity_coverage_through) return null;
        var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cov.entity_coverage_through);
        if (!m) return null;
        return 'mentions through ' + (+m[3]) + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1];
    }

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

        /* ---------------------------------------------------------------
         * The global date window. One control, four choices, and it is
         * stamped onto every API call from ONE place - here - so no panel can
         * forget it and none can be filtered client-side by hiding rows.
         * ------------------------------------------------------------- */
        WINDOWS: [
            { key: '30d', label: 'Last 30 days' },
            { key: '90d', label: 'Last 90 days' },
            { key: '12m', label: 'Last 12 months' },
            { key: 'all', label: 'All time' }
        ],
        WINDOW_DEFAULT: '90d',
        WINDOW_KEY: 'synthea.window.v1',

        getWindow: function () {
            var v;
            try { v = localStorage.getItem(SyntheaData.WINDOW_KEY); } catch (e) { v = null; }
            var ok = SyntheaData.WINDOWS.some(function (w) { return w.key === v; });
            return ok ? v : SyntheaData.WINDOW_DEFAULT;
        },

        setWindow: function (key) {
            if (key === SyntheaData.getWindow()) return;
            try { localStorage.setItem(SyntheaData.WINDOW_KEY, key); } catch (e) { /* private mode */ }
            // A full reload, deliberately. The window changes the period every
            // panel is about, and several panels cache internally; re-rendering
            // them piecemeal is how one panel ends up showing 90 days under a
            // control that says 30. A reload cannot leave a stale panel behind.
            location.reload();
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
            var url = withWindow(/^https?:/.test(path) ? path : API + path);
            return sharedGet(url, opts).then(function (r) {
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
            url = withWindow(url);
            return sharedGet(url, opts).then(function (r) {
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

        /**
         * Reader-facing copy for a failed load.
         *
         * UI_ACCEPTANCE.md section 3: no endpoint URLs, no exception messages
         * and no internal paths in a user-facing surface. Seven components each
         * built their own message by interpolating apiBaseUrl and the caught
         * error, which put "Could not reach http://localhost:8000/api/themes."
         * in front of a reader.
         *
         * No diagnostic detail is lost: every caller console.errors the real
         * error immediately before calling this. What comes back is only what a
         * reader should see, and it lives here so that the same failure cannot
         * read seven different ways on seven surfaces - the rule trend.js
         * already applies to volume wording.
         *
         * @param error   the caught error
         * @param subject capitalised noun phrase for what failed, e.g.
         *                'The theme series'. Defaults to something neutral.
         */
        describeError: function (error, subject) {
            var what = subject || 'This section';
            if (error && error.name === 'AbortError') {
                return what + ' is taking longer than usual to load. '
                     + 'The service may still be starting up.';
            }
            return what + ' could not be loaded. Try again in a moment.';
        },

        /**
         * The corpus's own headline figures, fetched once per page load.
         *
         * Five surfaces used to hardcode these - "54,284 passages across 1,236
         * episodes", "over 31 podcasts" - and the editorial purge of 28 Aug 2026
         * made every one of them wrong at a stroke. Hardcoding v2 would only
         * move the problem to the next corpus event, so the numbers come from
         * the corpus.
         *
         * Callers must handle null: a surface that cannot get the figure says
         * less rather than saying something untrue.
         */
        corpus: function () {
            if (!corpusPromise) {
                corpusPromise = SyntheaData.fetchJSON('corpus-facts', '/api/signals?limit=1')
                    .then(function (d) {
                        return {
                            episodes: d.episodes, podcasts: d.podcasts,
                            hours: d.hours, claims: d.verified_claims,
                            period: d.period,
                            rangeLabel: rangeLabel(d.period)
                        };
                    })
                    .catch(function () { return null; });
            }
            return corpusPromise;
        },

        /**
         * Entity coverage, and the label that says how far it reaches.
         * Resolves to null when coverage has caught up with the corpus.
         */
        entityCoverage: function () {
            if (!coveragePromise) {
                coveragePromise = SyntheaData.fetchJSON('entity-coverage', '/api/entities?limit=1')
                    .then(function (d) { return d.entity_coverage || null; })
                    .catch(function () { return null; });
            }
            return coveragePromise;
        },

        /** Put the coverage label into [data-entity-coverage] nodes, or leave them empty. */
        fillEntityCoverage: function (root) {
            SyntheaData.entityCoverage().then(function (cov) {
                var label = coverageLabel(cov);
                (root || document).querySelectorAll('[data-entity-coverage]').forEach(function (el) {
                    if (!label) { el.textContent = ''; el.hidden = true; return; }
                    el.textContent = label;
                    el.hidden = false;
                });
            });
        },

        /**
         * "YYYY-MM-DD to YYYY-MM-DD" -> "Jan-Jun 2025". Exposed so a surface
         * summarising a NARROWER range than the corpus - Company Tracking's
         * metrics line, over the episodes its entity data actually covers -
         * formats it the same way rather than writing its own wording.
         */
        rangeLabel: rangeLabel,

        /**
         * Replace [data-corpus-range] text with the real period label.
         *
         * When the figures cannot be fetched this used to return early, which
         * left whatever the markup shipped standing - and the markup shipped
         * "Jan-Jun 2025", a date that stopped being true the moment the
         * backfill landed. Returning early is only safe if the fallback is
         * honest, and it was not. The failure path now writes an explicit
         * unavailable state, so the page never shows a period it could not read.
         *
         * A node that ships visible text is a standalone label and gets the
         * unavailable string; a node that ships empty is a suffix on someone
         * else's sentence and stays empty, because "Range unavailable" tacked
         * onto a subtitle reads worse than nothing.
         */
        UNAVAILABLE: 'Range unavailable',

        fillRange: function (root) {
            var nodes = (root || document).querySelectorAll('[data-corpus-range]');
            nodes.forEach(function (el) {
                if (el.dataset.corpusRangeHadText === undefined) {
                    el.dataset.corpusRangeHadText = el.textContent.trim() ? '1' : '';
                }
            });
            SyntheaData.corpus().then(function (f) {
                nodes.forEach(function (el) {
                    if (f && f.rangeLabel) { el.textContent = f.rangeLabel; return; }
                    el.textContent = el.dataset.corpusRangeHadText
                        ? SyntheaData.UNAVAILABLE : '';
                });
            });
        },

        /** Fill [data-corpus="episodes"] nodes once the figures arrive. */
        fillCorpus: function (root) {
            SyntheaData.corpus().then(function (f) {
                if (!f) return;
                (root || document).querySelectorAll('[data-corpus]').forEach(function (el) {
                    var v = f[el.getAttribute('data-corpus')];
                    if (v !== undefined && v !== null) el.textContent = Number(v).toLocaleString();
                });
            });
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

    // ------------------------------------------------------- warming-up state
    //
    // The search engine scales to zero when idle, and waking it measured 38s on
    // a cold page. Every component sits in its own loading state for that whole
    // time, which reads as a broken page rather than a waiting one.
    //
    // So say what is happening, once, at page level. It appears only when a
    // request has actually been slow - the threshold is well above a warm
    // load's slowest request - so a normal visit never sees it.
    var WARMING_AFTER_MS = 4000;
    var inflightCount = 0, warmTimer = null, warmingBar = null;

    function requestStarted() {
        inflightCount++;
        if (warmTimer === null && !warmingBar) {
            warmTimer = setTimeout(showWarming, WARMING_AFTER_MS);
        }
    }

    function requestSettled() {
        inflightCount = Math.max(0, inflightCount - 1);
        if (inflightCount > 0) return;
        if (warmTimer !== null) { clearTimeout(warmTimer); warmTimer = null; }
        if (warmingBar) { warmingBar.remove(); warmingBar = null; }
    }

    function showWarming() {
        warmTimer = null;
        if (warmingBar || !inflightCount || !document.body) return;
        warmingBar = document.createElement('div');
        warmingBar.className = 'synthea-warming-banner';
        warmingBar.setAttribute('role', 'status');
        warmingBar.innerHTML =
            '<span class="synthea-warming-dot" aria-hidden="true"></span>' +
            '<span><strong>Warming up.</strong> The search engine sleeps when it has ' +
            'not been used, and the first visit afterwards can take up to a minute. ' +
            'Nothing is wrong - each section fills in as its data arrives.</span>';
        document.body.insertBefore(warmingBar, document.body.firstChild);
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
            'transcript corpus. Switch to <b>Live</b> to see what the system actually returns.' +
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
