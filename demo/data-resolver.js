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

    function sharedGet(url, opts) {
        var o = opts || {};
        // Anything with a body, a non-GET method or custom headers is somebody
        // else's request; it goes straight out.
        if (o.body || (o.method && o.method.toUpperCase() !== 'GET') || o.headers) {
            return fetch(url, o);
        }
        if (!inflight[url]) {
            inflight[url] = fetch(url).then(function (r) {
                delete inflight[url];
                return r;
            }, function (e) {
                delete inflight[url];
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
