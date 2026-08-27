/**
 * Narrative Pulse - live topic mentions
 *
 * Replaces the mock chart (narrative-pulse.js, unified-data-adapter.js,
 * generate-dynamic-insights.js, init.js) with one driven by
 * v2, 28 Aug 2026, per NARRATIVE_PULSE_VISION.md. Two layers: themes (the
 * stable map) plot by default; discovered narratives and the five legacy
 * tracked topics can be overlaid from the Topics gear, which is now a
 * watchlist. Max six series, because six lines is the readable limit and the
 * palette has six colours.
 *
 * GET /api/themes for the default layer; /api/narratives and
 * /api/topic-mentions?bucket=month for the overlay options. Every series
 * arrives in the same shape, so there is one plotting path and one floor.
 *
 * GET /api/topic-mentions?bucket=month - the same endpoint Velocity Tracking
 * uses, serving precomputed regex counts over transcript_chunks_768d.
 *
 * What the two views mean:
 *   Momentum  mentions per episode, per month. Normalised, because episodes are
 *             unevenly spread across months (13 in January, 3 in the partial June).
 *   Volume    raw mention counts per month.
 *
 * Six monthly buckets, Jan-Jun 2025. Not weekly: at weekly resolution even the
 * two topics that do occur are non-zero in only ~52% of buckets. Nothing is
 * smoothed or interpolated.
 *
 * Only topics with enough data are plotted. The rest are named on the chart as
 * having no data rather than being hidden or drawn as a flat line at zero.
 *
 * Consensus has no data source at all, so that toggle is disabled rather than
 * left live. Same for the time-range and topic-customisation controls, whose
 * data no longer exists.
 */
const NarrativePulseLive = {
    apiBaseUrl: window.SYNTHEA_API_BASE || 'http://localhost:8000',
    apiTimeoutMs: 30000,

    // A topic needs this many populated buckets before a line means anything
    MIN_BUCKETS: 3,

    // Editorial palette, assigned in rank order. Six, matching MAX_SERIES.
    COLORS: ['#4a7c59', '#f4a261', '#5a6c8c', '#c77d7d', '#8a68a8', '#3f7d8c'],

    MAX_SERIES: 6,
    WATCHLIST_KEY: 'synthea.pulse.watchlist.v1',

    view: 'momentum',
    themes: [],
    narrativeOptions: [],
    legacyTopics: [],
    watchlist: [],          // [{kind:'narrative'|'legacy', id, label}]
    topics: [],
    plotted: [],
    empty: [],
    meta: null,
    dataState: 'loading',
    dataError: null,

    // SVG geometry (viewBox is 0 0 800 280)
    LEFT: 62, RIGHT: 770, TOP: 40, BOTTOM: 240,

    async init() {
        // Vision mode: stand aside so the July 2025 mock chart renders. Without
        // this the live component fetches, is refused by the resolver, and
        // paints "Topic mentions unavailable" over the vision content - an
        // error message about a request Vision mode never wanted made.
        if (window.SyntheaData && window.SyntheaData.isVision()) {
            // The July 2025 mock chart stack was removed from demo.html when
            // this live component replaced it, so Vision has nothing to fall
            // back to here. Say that, rather than leaving a spinner or painting
            // "Topic mentions unavailable" over a mode that never wanted a fetch.
            var host = document.getElementById('narrative-pulse-container');
            if (host) {
                host.innerHTML =
                    '<div class="synthea-unbuilt">' +
                    '<div class="synthea-unbuilt-title">Not part of the vision mock-up</div>' +
                    '<p class="synthea-unbuilt-why">Narrative Pulse is one of the components that ' +
                    'has already been built against real data. Its July 2025 mock version was ' +
                    'removed from the page when the live chart replaced it, so there is no ' +
                    'illustrative version to show here.</p>' +
                    '<p class="synthea-unbuilt-foot">Switch to <b>Live</b> to see it plotting ' +
                    '1,236 episodes.</p></div>';
            }
            window.SyntheaData.claim('narrative-pulse', '.narrative-pulse');
            window.SyntheaData.mark('narrative-pulse', 'unbuilt', 'no vision mock exists');
            return;
        }
        this.container = document.getElementById('narrative-pulse-container');
        if (!this.container) {
            console.error('[Narrative Pulse] container not found');
            return;
        }

        try {
            const response = await fetch('features/narrative-pulse/narrative-pulse.html');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.container.classList.remove('loading');
            this.container.innerHTML = await response.text();
        } catch (error) {
            console.error('[Narrative Pulse] Failed to load template:', error);
            this.container.innerHTML =
                '<div class="error-message" style="padding:20px;text-align:center;color:var(--dusty-rose);">' +
                'Error: Could not load Narrative Pulse feature.</div>';
            return;
        }

        this.stripFabricatedChrome();
        this.bindEvents();
        this.load();
    },

    /**
     * Remove the parts of the template that cannot be computed from the data:
     * the three insight callouts, and controls whose backing data is gone.
     */
    stripFabricatedChrome() {
        // Breakout Narrative / Leadership Change / Trend Character
        const insights = this.container.querySelector('.narrative-insights');
        if (insights) insights.remove();

        const disable = (selector, label, reason) => {
            const button = this.container.querySelector(selector);
            if (!button) return;
            button.disabled = true;
            button.classList.add('control-disabled');
            button.title = reason;
            button.style.opacity = '0.45';
            button.style.cursor = 'not-allowed';
            if (label) {
                const span = button.querySelector('span');
                if (span) span.textContent = label;
            }
        };

        // The series is fixed at six monthly buckets, so there is no range to pick
        disable('[data-action="toggleTimeRange"]', 'Jan–Jun 2025',
            'The series is six monthly buckets covering the whole corpus. There is no other range to show.');
        // Share/download encoded the old mock chart state
        disable('[data-action="shareChart"]', null,
            'Sharing was tied to the previous mock chart state.');
        // The Topics gear is now the watchlist: overlay specific narratives or
        // the five legacy tracked topics. It was disabled while the chart had
        // nothing to choose between; v2 gives it something.
        const gear = this.container.querySelector('[data-action="customizeTopics"]');
        if (gear) {
            gear.disabled = false;
            gear.classList.remove('control-disabled');
            gear.style.opacity = '';
            gear.style.cursor = 'pointer';
            gear.title = 'Overlay specific narratives or the five legacy tracked topics';
            gear.addEventListener('click', e => { e.preventDefault(); this.openWatchlist(); });
        }

        const consensusBtn = this.container.querySelector('.view-toggle-btn[data-view="consensus"]');
        if (consensusBtn) {
            consensusBtn.disabled = true;
            consensusBtn.classList.add('control-disabled');
            consensusBtn.title = 'No consensus data exists. Nothing in the corpus measures agreement between episodes.';
            consensusBtn.style.opacity = '0.45';
            consensusBtn.style.cursor = 'not-allowed';
        }
    },

    bindEvents() {
        this.container.querySelectorAll('.view-toggle-btn').forEach(button => {
            button.addEventListener('click', () => {
                const view = button.dataset.view;
                if (!view || view === 'consensus' || button.disabled) return;
                this.view = view;
                this.container.querySelectorAll('.view-toggle-btn').forEach(b =>
                    b.classList.toggle('active', b.dataset.view === view));
                this.renderChart();
            });
        });
    },

    async load() {
        this.clearFabricatedContent();
        this.dataState = 'loading';
        this.renderChart();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.apiTimeoutMs);

        try {
            window.SyntheaData.claim('narrative-pulse', '.narrative-pulse');
            const response = await window.SyntheaData.fetchResponse(
                'narrative-pulse', `${this.apiBaseUrl}/api/themes?limit=${this.MAX_SERIES}`,
                { signal: controller.signal });
            if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);

            const data = await response.json();
            this.meta = {
                buckets: data.buckets || [],
                // The corpus stops mid-month, so the last bucket covers part of
                // a month. Plotting it like a whole one shows a fall that is an
                // artefact of where the data ends.
                partialBuckets: (((data.themes || [])[0] || {}).series || [])
                    .map(p => !!p.partial),
                episodesScanned: data.episodes_scanned,
                from: data.range_from,
                to: data.range_to,
                unit: data.unit || 'passages',
                themeMapVersion: data.theme_map_version,
                k: data.k
            };
            this.themes = (data.themes || []).map(t => Object.assign({}, t, { kind: 'theme' }));

            // Overlay catalogues. A failure here costs the watchlist, never the
            // chart, so they are fetched separately and swallowed.
            this.narrativeOptions = [];
            this.legacyTopics = [];
            try {
                const n = await window.SyntheaData.fetchJSON('narrative-pulse', '/api/narratives?limit=30');
                this.narrativeOptions = (n.narratives || []).map(x => Object.assign({}, x, {
                    kind: 'narrative', id: String(x.cluster_id) }));
            } catch (e) { /* watchlist offers fewer options; the chart is unaffected */ }
            try {
                const l = await window.SyntheaData.fetchJSON('narrative-pulse', '/api/topic-mentions?bucket=month');
                this.legacyTopics = (l.topics || []).map(x => Object.assign({}, x, {
                    kind: 'legacy', id: x.topic }));
            } catch (e) { /* same */ }

            this.watchlist = this.loadWatchlist();
            this.composeSeries();

            this.dataState = 'ready';
            console.log('[Narrative Pulse] v2:', this.themes.length, 'themes,',
                this.watchlist.length, 'overlaid,', this.plotted.length, 'plotted over',
                this.meta.buckets.length, 'monthly buckets');
        } catch (error) {
            console.error('[Narrative Pulse] Failed to load topic mentions:', error);
            this.dataState = 'error';
            this.dataError = error && error.name === 'AbortError'
                ? `No response from ${this.apiBaseUrl} after ${Math.round(this.apiTimeoutMs / 1000)} seconds.`
                : `Could not reach ${this.apiBaseUrl}/api/themes.`;
        } finally {
            clearTimeout(timeoutId);
        }

        this.updateSubtitle();
        this.renderLegend();
        this.renderChart();
    },

    /** Called before the first fetch, so no mock figure is ever on screen. */
    clearFabricatedContent() {
        this.dataState = 'loading';
        this.updateSubtitle();
        this.renderLegend();
    },

    retryLoad() { this.load(); },

    // ------------------------------------------------------ series layers

    /**
     * Themes first, overlays after, capped at MAX_SERIES.
     *
     * Themes are the default layer and are never dropped to make room: an
     * overlay that would exceed the cap is refused at the point of adding, so
     * the chart never silently loses the layer the reader started from.
     */
    composeSeries() {
        const overlays = this.watchlist.map(w => this.resolveOverlay(w)).filter(Boolean);
        const room = Math.max(0, this.MAX_SERIES - overlays.length);
        this.topics = this.themes.slice(0, room).concat(overlays);
        // The same rule as before: a line needs enough populated buckets to
        // mean anything.
        this.plotted = this.topics.filter(t =>
            (t.series || []).filter(p => p.mentions > 0).length >= this.MIN_BUCKETS);
        this.empty = this.topics.filter(t => !this.plotted.includes(t));
    },

    resolveOverlay(w) {
        const pool = w.kind === 'narrative' ? this.narrativeOptions : this.legacyTopics;
        const hit = pool.find(x => String(x.id) === String(w.id));
        return hit ? Object.assign({}, hit) : null;
    },

    loadWatchlist() {
        try {
            const raw = localStorage.getItem(this.WATCHLIST_KEY);
            const v = raw ? JSON.parse(raw) : [];
            return Array.isArray(v) ? v.filter(x => x && x.kind && x.id).slice(0, this.MAX_SERIES) : [];
        } catch (e) { return []; }
    },

    saveWatchlist() {
        try { localStorage.setItem(this.WATCHLIST_KEY, JSON.stringify(this.watchlist)); }
        catch (e) { /* private mode; the overlay simply does not survive a reload */ }
    },

    // ------------------------------------------------------ theme drilldown

    /** Theme -> its narratives -> the existing narrative chain. */
    openTheme(theme) {
        if (!theme || theme.kind !== 'theme') return;
        this.buildDrilldown();
        this.dpanel.setAttribute('data-state', 'open');
        this.dbackdrop.setAttribute('data-state', 'open');
        this.dpanel.querySelector('.drilldown-live-title').textContent = theme.label;
        this.dpanel.querySelector('.drilldown-live-sub').textContent =
            `${theme.narrative_count} narrative${theme.narrative_count === 1 ? '' : 's'} · `
            + `${theme.total_mentions.toLocaleString()} passages · `
            + `${theme.episodes_with_mentions.toLocaleString()} episodes`;

        const body = this.dpanel.querySelector('.drilldown-live-body');
        body.innerHTML = '';
        const why = document.createElement('div');
        why.className = 'drilldown-live-summary';
        why.textContent = theme.why || '';
        body.appendChild(why);

        const list = document.createElement('ol');
        list.className = 'drilldown-live-list';
        (theme.members || []).forEach(m => {
            const li = document.createElement('li');
            li.className = 'drilldown-live-row';
            li.tabIndex = 0;
            li.setAttribute('role', 'button');
            li.setAttribute('aria-label', `Show the episodes behind ${m.label}`);

            const count = document.createElement('span');
            count.className = 'drilldown-live-count';
            count.textContent = m.podcasts;
            count.title = `${m.podcasts} distinct podcasts`;
            li.appendChild(count);

            const meta = document.createElement('div');
            meta.className = 'drilldown-live-meta';
            const t = document.createElement('div');
            t.className = 'drilldown-live-episode';
            t.textContent = m.label;
            meta.appendChild(t);
            const sub = document.createElement('div');
            sub.className = 'drilldown-live-podcast';
            sub.textContent = `${m.episodes.toLocaleString()} episodes · `
                            + `${m.chunks.toLocaleString()} passages`;
            meta.appendChild(sub);
            // A below-breadth narrative is shown inside its theme and marked,
            // never silently included and never silently dropped.
            if (m.carried_by_few_shows) {
                const flag = document.createElement('span');
                flag.className = 'np-few-shows';
                flag.textContent = 'carried by few shows';
                flag.title = `Only ${m.podcasts} podcasts carry this narrative, below the `
                           + `breadth floor of 8. It counts toward the theme but is not `
                           + `listed as an archive-wide narrative.`;
                meta.appendChild(flag);
            }
            li.appendChild(meta);

            const open = () => {
                // Straight into the chain Market Narratives already owns.
                const n = this.narrativeOptions.find(x => x.cluster_id === m.cluster_id);
                if (window.NotableSignalsLive && n) {
                    this.closeDrilldown();
                    window.NotableSignalsLive.buildNarrativePanel();
                    window.NotableSignalsLive.npanel.setAttribute('data-state', 'open');
                    window.NotableSignalsLive.nbackdrop.setAttribute('data-state', 'open');
                    window.NotableSignalsLive.openNarrative(n);
                }
            };
            // Below-breadth narratives are not in /api/narratives, so there is
            // nothing to open. The row still renders, marked, but does not
            // pretend to be a control.
            const openable = !!(window.NotableSignalsLive
                && this.narrativeOptions.some(x => x.cluster_id === m.cluster_id));
            if (openable) {
                li.addEventListener('click', open);
                li.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
                });
            } else {
                li.removeAttribute('role');
                li.removeAttribute('tabindex');
                li.classList.add('np-row--inert');
                li.title = 'Below the breadth floor, so it has no archive-wide drilldown.';
            }
            list.appendChild(li);
        });
        body.appendChild(list);
    },

    // -------------------------------------------------------- the watchlist

    /**
     * The Topics gear. Overlay specific narratives or the five legacy tracked
     * topics on top of the theme lines, up to MAX_SERIES in total.
     *
     * Stored in localStorage, and the panel says so - v1 of Company Tracking
     * set that precedent and a second silent browser-only store would be worse
     * than the first.
     */
    openWatchlist() {
        this.buildWatchlist();
        this.wpanel.setAttribute('data-state', 'open');
        this.wbackdrop.setAttribute('data-state', 'open');
        this.renderWatchlist();
    },

    renderWatchlist() {
        const body = this.wpanel.querySelector('.drilldown-live-body');
        const overlays = this.watchlist.length;
        const room = this.MAX_SERIES - overlays;
        body.innerHTML = '';

        const note = document.createElement('div');
        note.className = 'drilldown-live-summary';
        note.textContent = `Overlay narratives or legacy topics on the theme lines. `
            + `Six series maximum: ${overlays} overlaid, so ${Math.max(room, 0)} theme`
            + `${room === 1 ? '' : 's'} still plot.`;
        body.appendChild(note);

        const saved = document.createElement('div');
        saved.className = 'np-watch-saved';
        saved.textContent = 'Saved in this browser';
        saved.title = 'This overlay is stored in this browser’s local storage only. '
                    + 'It is not saved to an account, and it will not follow you to another '
                    + 'browser, another device, or a private window.';
        body.appendChild(saved);

        const section = (title, items, kind) => {
            const h = document.createElement('div');
            h.className = 'np-watch-head';
            h.textContent = title;
            body.appendChild(h);
            const list = document.createElement('div');
            list.className = 'np-watch-list';
            items.forEach(it => {
                const on = this.watchlist.some(w => w.kind === kind && String(w.id) === String(it.id));
                const full = !on && this.watchlist.length >= this.MAX_SERIES;
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'np-watch-item' + (on ? ' is-on' : '') + (full ? ' is-full' : '');
                b.setAttribute('aria-pressed', String(on));
                b.disabled = full;
                if (full) b.title = `Six series is the maximum. Remove one to add another.`;
                const nm = document.createElement('span');
                nm.className = 'np-watch-name';
                nm.textContent = it.topic;
                b.appendChild(nm);
                const meta = document.createElement('span');
                meta.className = 'np-watch-meta';
                meta.textContent = kind === 'legacy'
                    ? `${(it.total_mentions || 0).toLocaleString()} mentions`
                    : `${(it.podcasts || 0)} pods · ${(it.total_mentions || 0).toLocaleString()} passages`;
                b.appendChild(meta);
                b.addEventListener('click', () => this.toggleOverlay(kind, it));
                list.appendChild(b);
            });
            body.appendChild(list);
        };

        if (this.narrativeOptions.length) section('NARRATIVES', this.narrativeOptions, 'narrative');
        if (this.legacyTopics.length) section('LEGACY TRACKED TOPICS', this.legacyTopics, 'legacy');
        if (!this.narrativeOptions.length && !this.legacyTopics.length) {
            const e = document.createElement('div');
            e.className = 'drilldown-live-empty';
            e.textContent = 'No overlay options could be loaded.';
            body.appendChild(e);
        }
    },

    toggleOverlay(kind, item) {
        const i = this.watchlist.findIndex(w => w.kind === kind && String(w.id) === String(item.id));
        if (i >= 0) this.watchlist.splice(i, 1);
        else if (this.watchlist.length < this.MAX_SERIES)
            this.watchlist.push({ kind: kind, id: String(item.id), label: item.topic });
        this.saveWatchlist();
        this.composeSeries();
        this.renderLegend();
        this.renderChart();
        this.updateSubtitle();
        this.renderWatchlist();
    },

    buildWatchlist() {
        if (this.wpanel) return;
        this.wpanel = document.createElement('div');
        this.wpanel.className = 'drilldown-live np-watch-panel';
        this.wpanel.setAttribute('data-state', 'closed');
        this.wpanel.setAttribute('role', 'dialog');
        this.wpanel.setAttribute('aria-modal', 'true');
        this.wpanel.innerHTML = `
            <div class="drilldown-live-header">
                <div>
                    <h3 class="drilldown-live-title">Chart watchlist</h3>
                    <p class="drilldown-live-sub">Your agenda on the market's agenda</p>
                </div>
                <button type="button" class="drilldown-live-close" aria-label="Close" title="Close">✕</button>
            </div>
            <div class="drilldown-live-body"></div>`;
        document.body.appendChild(this.wpanel);
        this.wbackdrop = document.createElement('div');
        this.wbackdrop.className = 'drilldown-live-backdrop';
        this.wbackdrop.setAttribute('data-state', 'closed');
        document.body.appendChild(this.wbackdrop);
        const close = () => {
            this.wpanel.setAttribute('data-state', 'closed');
            this.wbackdrop.setAttribute('data-state', 'closed');
        };
        this.wpanel.querySelector('.drilldown-live-close').addEventListener('click', close);
        this.wbackdrop.addEventListener('click', close);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.wpanel.getAttribute('data-state') === 'open') close();
        });
    },

    buildDrilldown() {
        if (this.dpanel) return;
        // The existing drilldown's markup and classes, so this is the same
        // surface the Narrative Pulse drilldown and Market Narratives use.
        this.dpanel = document.createElement('div');
        this.dpanel.className = 'drilldown-live np-theme-panel';
        this.dpanel.setAttribute('data-state', 'closed');
        this.dpanel.setAttribute('role', 'dialog');
        this.dpanel.setAttribute('aria-modal', 'true');
        this.dpanel.innerHTML = `
            <div class="drilldown-live-header">
                <div>
                    <h3 class="drilldown-live-title"></h3>
                    <p class="drilldown-live-sub"></p>
                </div>
                <button type="button" class="drilldown-live-close" aria-label="Close" title="Close">✕</button>
            </div>
            <div class="drilldown-live-body"></div>`;
        document.body.appendChild(this.dpanel);
        this.dbackdrop = document.createElement('div');
        this.dbackdrop.className = 'drilldown-live-backdrop';
        this.dbackdrop.setAttribute('data-state', 'closed');
        document.body.appendChild(this.dbackdrop);
        const close = () => this.closeDrilldown();
        this.dpanel.querySelector('.drilldown-live-close').addEventListener('click', close);
        this.dbackdrop.addEventListener('click', close);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.dpanel.getAttribute('data-state') === 'open') close();
        });
    },

    closeDrilldown() {
        if (!this.dpanel) return;
        this.dpanel.setAttribute('data-state', 'closed');
        this.dbackdrop.setAttribute('data-state', 'closed');
    },


    colorFor(topicName) {
        const index = this.topics.findIndex(t => t.topic === topicName);
        return this.COLORS[index % this.COLORS.length];
    },

    // "Topic momentum across 1,498 episodes" was never true of this corpus
    updateSubtitle() {
        const subtitle = this.container.querySelector('.section-subtitle');
        if (!subtitle) return;

        if (this.dataState !== 'ready') {
            // Same reason as the legend: the template's own subtitle is
            // "Topic momentum across 1,498 episodes", a number from the mock
            // corpus. It must not survive a failed load.
            subtitle.textContent = 'Themes across the transcript corpus';
            subtitle.title = '';
            return;
        }
        const overlaid = this.topics.filter(t => t.kind !== 'theme').length;
        const themes = this.topics.length - overlaid;
        subtitle.textContent =
            `${themes} theme${themes === 1 ? '' : 's'}`
            + (overlaid ? ` + ${overlaid} overlaid` : '')
            + ` · passages across ${this.meta.episodesScanned.toLocaleString()} episodes`
            + ` · ${this.formatRange()} · monthly`;
        subtitle.title = 'Themes are a versioned map over the discovered narratives. '
            + 'A passage is a chunk of transcript; one episode contributes several. '
            + 'June is 23 of 30 days and is drawn dashed.';
    },

    formatRange() {
        if (!this.meta || !this.meta.from || !this.meta.to) return '';
        const fmt = iso => new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
        return `${fmt(this.meta.from)}–${fmt(this.meta.to)}`;
    },

    renderLegend() {
        const legend = this.container.querySelector('.pulse-legend');
        if (!legend) return;

        // The section template ships a STATIC legend - "Enterprise Agents
        // +107%", "Defense Tech +111%" - from the July 2025 mock. Returning
        // early on a failed load left those fabricated figures on screen under
        // an error message, which is worse than an empty chart. Clear first,
        // always, then paint only what actually loaded.
        if (this.dataState !== 'ready') {
            legend.innerHTML = '';
            const note = document.createElement('div');
            note.className = 'legend-item legend-item--empty';
            note.textContent = this.dataState === 'error'
                ? 'No themes to show.' : 'Loading…';
            legend.appendChild(note);
            return;
        }

        legend.innerHTML = '';
        this.topics.forEach(topic => {
            const plotted = this.plotted.includes(topic);
            const color = plotted ? this.colorFor(topic.topic) : '#9ca3af';
            // One formatter for every trend on the page, so a series cannot
            // read "+136%" here and "low volume" in the sidebar. Themes and
            // narratives count passages; the legacy topics count mentions.
            const unit = topic.kind === 'legacy' ? 'mention' : 'passage';
            const fmt = window.SyntheaTrend.format(topic, unit);
            const value = plotted ? fmt.text : 'no data';

            const item = document.createElement(topic.kind === 'theme' ? 'button' : 'div');
            if (topic.kind === 'theme') {
                item.type = 'button';
                item.setAttribute('aria-label', `Show the narratives under ${topic.topic}`);
                item.addEventListener('click', () => this.openTheme(topic));
                item.classList.add('legend-item--openable');
            }
            item.className += (item.className ? ' ' : '') + 'legend-item'
                            + (plotted ? '' : ' legend-item--empty');
            item.title = `${(topic.total_mentions || 0).toLocaleString()} ${unit}s in `
                       + `${(topic.episodes_with_mentions || 0).toLocaleString()} of `
                       + `${this.meta.episodesScanned.toLocaleString()} episodes`
                       + (topic.kind === 'theme' ? ' — click for its narratives' : '');

            const dot = document.createElement('span');
            dot.className = 'legend-dot';
            dot.style.background = color;
            item.appendChild(dot);

            const label = document.createElement('span');
            label.className = 'legend-label';
            if (!plotted) label.style.color = '#9ca3af';
            label.textContent = topic.topic;
            item.appendChild(label);

            if (topic.kind !== 'theme') {
                const badge = document.createElement('span');
                badge.className = 'np-overlay-badge';
                badge.textContent = topic.kind === 'legacy' ? 'topic' : 'narrative';
                badge.title = topic.kind === 'legacy'
                    ? 'One of the five legacy tracked topics, counted in mentions'
                    : 'A discovered narrative, counted in passages';
                item.appendChild(badge);
            }

            const val = document.createElement('span');
            val.className = 'legend-value';
            val.style.color = plotted ? fmt.colour : '#9ca3af';
            val.title = plotted ? fmt.title : 'Not enough populated months to plot';
            val.textContent = value;
            item.appendChild(val);

            legend.appendChild(item);
        });
    },

    // ---------------------------------------------------------------- chart

    monthLabel(bucket) {
        const [year, month] = bucket.split('-');
        const date = new Date(Number(year), Number(month) - 1, 1);
        return date.toLocaleDateString('en-GB', { month: 'short' });
    },

    xFor(index, count) {
        if (count <= 1) return (this.LEFT + this.RIGHT) / 2;
        return this.LEFT + (index / (count - 1)) * (this.RIGHT - this.LEFT);
    },

    yFor(value, max) {
        if (max <= 0) return this.BOTTOM;
        return this.BOTTOM - (value / max) * (this.BOTTOM - this.TOP);
    },

    valuesFor(topic) {
        return this.view === 'volume'
            ? topic.series.map(p => p.mentions)
            : topic.series.map(p => p.mentions_per_episode);
    },

    formatValue(value) {
        // Axis ticks are fractions of the max, so round volume to whole mentions
        return this.view === 'volume' ? String(Math.round(value)) : value.toFixed(2);
    },

    renderChart() {
        const chartContent = this.container.querySelector('#chartContent');
        if (!chartContent) return;

        if (this.dataState === 'loading') {
            chartContent.innerHTML = `<text x="400" y="140" text-anchor="middle" fill="#9ca3af"
                font-size="13">Loading themes…</text>`;
            return;
        }

        if (this.dataState === 'error') {
            chartContent.innerHTML = `
                <text x="400" y="130" text-anchor="middle" fill="#c77d7d" font-size="13"
                      font-weight="600">Themes unavailable</text>
                <text x="400" y="152" text-anchor="middle" fill="#9ca3af" font-size="11">${this.dataError || ''}</text>`;
            return;
        }

        if (!this.plotted.length) {
            chartContent.innerHTML = `<text x="400" y="140" text-anchor="middle" fill="#9ca3af"
                font-size="13">No theme has enough data to plot.</text>`;
            return;
        }

        const buckets = this.meta.buckets;
        const max = Math.max(...this.plotted.flatMap(t => this.valuesFor(t))) || 1;
        const niceMax = max * 1.15;

        const parts = [];

        // y axis: four ticks with a gridline each
        for (let tick = 0; tick <= 3; tick++) {
            const value = (niceMax / 3) * tick;
            const y = this.yFor(value, niceMax);
            parts.push(`<line x1="${this.LEFT}" y1="${y}" x2="${this.RIGHT}" y2="${y}"
                        stroke="#e5e7eb" stroke-width="1" opacity="0.6"/>`);
            parts.push(`<text x="${this.LEFT - 10}" y="${y + 4}" text-anchor="end" fill="#9ca3af"
                        font-size="10">${this.formatValue(value)}</text>`);
        }

        parts.push(`<text x="6" y="${this.TOP - 14}" fill="#6b7280"
                    font-size="10" font-weight="600">${this.view === 'volume' ? 'Passages' : 'Per episode'}</text>`);

        // x labels, one per month, with the episode count that month
        buckets.forEach((bucket, index) => {
            const x = this.xFor(index, buckets.length);
            const episodes = this.plotted[0].series[index].episodes;
            parts.push(`<text x="${x}" y="258" text-anchor="middle" fill="#6b7280"
                        font-size="11">${this.monthLabel(bucket)}</text>`);
            parts.push(`<text x="${x}" y="270" text-anchor="middle" fill="#c4c4c4"
                        font-size="9">${episodes} eps</text>`);
        });

        if (this.view === 'volume') {
            parts.push(this.renderBars(buckets, niceMax));
        } else {
            parts.push(this.renderLines(buckets, niceMax));
        }

        // Name the topics that have no line, on the chart itself
        if (this.empty.length) {
            // Left-aligned: the view-toggle buttons overlay the top right of the SVG
            const names = this.empty
                .map((t, index) => index === 0
                    ? `${t.topic} (${t.total_mentions} mentions)`
                    : `${t.topic} (${t.total_mentions})`)
                .join(', ');
            parts.push(`<text x="150" y="26" fill="#9ca3af" font-size="10.5">
                        No data to plot: ${names}</text>`);
        }

        // Invisible hover columns
        buckets.forEach((bucket, index) => {
            const x = this.xFor(index, buckets.length);
            const half = (this.RIGHT - this.LEFT) / (buckets.length - 1) / 2;
            parts.push(`<rect class="np-hover" x="${x - half}" y="${this.TOP}" width="${half * 2}"
                        height="${this.BOTTOM - this.TOP}" fill="transparent" data-index="${index}"
                        style="cursor: crosshair;"/>`);
        });

        chartContent.innerHTML = parts.join('');
        this.bindTooltip();
    },

    isPartial(index) {
        return !!(this.meta && this.meta.partialBuckets && this.meta.partialBuckets[index]);
    },

    firstPartialIndex() {
        const flags = (this.meta && this.meta.partialBuckets) || [];
        const i = flags.indexOf(true);
        return i === -1 ? flags.length : i;
    },

    renderLines(buckets, max) {
        // A partial bucket is drawn, but dashed and hollow, so the reader can
        // see the value without reading a truncated month as a decline.
        const cut = this.firstPartialIndex();
        return this.plotted.map(topic => {
            const color = this.colorFor(topic.topic);
            const values = this.valuesFor(topic);
            const xy = values.map((value, index) =>
                `${this.xFor(index, buckets.length)},${this.yFor(value, max)}`);

            const solid = xy.slice(0, cut).join(' ');
            const dashed = cut > 0 ? xy.slice(cut - 1).join(' ') : xy.join(' ');

            const dots = values.map((value, index) => {
                const partial = this.isPartial(index);
                return `<circle cx="${this.xFor(index, buckets.length)}" cy="${this.yFor(value, max)}" r="3.5"
                         fill="${partial ? 'var(--bg-primary, #fff)' : color}"
                         stroke="${color}" stroke-width="${partial ? 2 : 0}"/>`;
            }).join('');

            const solidLine = solid.split(' ').length > 1
                ? `<polyline points="${solid}" fill="none" stroke="${color}" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" class="topic-line"/>` : '';
            const dashedLine = (cut < values.length && dashed.split(' ').length > 1)
                ? `<polyline points="${dashed}" fill="none" stroke="${color}" stroke-width="2"
                        stroke-dasharray="4 3" stroke-linecap="round" stroke-linejoin="round"
                        class="topic-line topic-line--partial"/>` : '';

            return `${solidLine}${dashedLine}${dots}`;
        }).join('');
    },

    renderBars(buckets, max) {
        const slot = (this.RIGHT - this.LEFT) / buckets.length;
        const barWidth = Math.min(22, (slot * 0.6) / this.plotted.length);

        return this.plotted.map((topic, topicIndex) => {
            const color = this.colorFor(topic.topic);
            const values = this.valuesFor(topic);

            return values.map((value, index) => {
                const centre = this.xFor(index, buckets.length);
                const offset = (topicIndex - (this.plotted.length - 1) / 2) * (barWidth + 3);
                const y = this.yFor(value, max);
                const height = Math.max(this.BOTTOM - y, value > 0 ? 1 : 0);
                return `<rect x="${centre + offset - barWidth / 2}" y="${y}" width="${barWidth}"
                            height="${height}" fill="${color}" rx="2" opacity="0.85"/>`;
            }).join('');
        }).join('');
    },

    bindTooltip() {
        const tooltip = this.container.querySelector('#chartTooltip');
        if (!tooltip) return;

        this.container.querySelectorAll('.np-hover').forEach(rect => {
            rect.addEventListener('mouseenter', event => {
                const index = Number(rect.dataset.index);
                const bucket = this.meta.buckets[index];
                // Episodes differ per series once overlays are on, so the
                // header states the bucket only and each row carries its own.
                const episodes = (this.plotted[0].series[index] || {}).episodes || 0;

                const rows = this.plotted.map(topic => {
                    const point = topic.series[index];
                    const per = (point.mentions_per_episode || 0).toFixed(2);
                    return `<div style="display:flex;gap:8px;justify-content:space-between;">
                        <span style="color:${this.colorFor(topic.topic)};">${topic.topic}</span>
                        <span>${point.mentions} (${per}/ep)</span>
                    </div>`;
                }).join('');

                tooltip.innerHTML = `<div style="font-weight:600;margin-bottom:4px;">${bucket} · ${episodes} episodes</div>${rows}`;
                tooltip.classList.add('visible');
                tooltip.style.display = 'block';

                const bounds = this.container.querySelector('.chart-container').getBoundingClientRect();
                tooltip.style.left = `${event.clientX - bounds.left + 12}px`;
                tooltip.style.top = `${event.clientY - bounds.top - 10}px`;
            });

            rect.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
                tooltip.style.display = 'none';
            });
        });
    }
};

window.NarrativePulseLive = NarrativePulseLive;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => NarrativePulseLive.init());
} else {
    NarrativePulseLive.init();
}
