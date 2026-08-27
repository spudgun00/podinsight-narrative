/**
 * Narrative Pulse - live topic mentions
 *
 * Replaces the mock chart (narrative-pulse.js, unified-data-adapter.js,
 * generate-dynamic-insights.js, init.js) with one driven by
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

    // Editorial palette, assigned in rank order
    COLORS: ['#4a7c59', '#f4a261', '#5a6c8c', '#c77d7d', '#8a68a8'],

    view: 'momentum',
    topics: [],
    plotted: [],
    empty: [],
    meta: null,
    dataState: 'loading',
    dataError: null,

    // SVG geometry (viewBox is 0 0 800 280)
    LEFT: 62, RIGHT: 770, TOP: 40, BOTTOM: 240,

    async init() {
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
        // Tracked topics come from the API (TOPICS_TO_TRACK), not user selection
        disable('[data-action="customizeTopics"]', null,
            'Tracked topics are fixed by the API (TOPICS_TO_TRACK).');

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
        this.dataState = 'loading';
        this.renderChart();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.apiTimeoutMs);

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/topic-mentions?bucket=month`,
                { signal: controller.signal });
            if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);

            const data = await response.json();
            this.meta = {
                buckets: data.buckets || [],
                // The corpus stops mid-month, so the last bucket covers part of
                // a month. Plotting it like a whole one shows a fall that is an
                // artefact of where the data ends.
                partialBuckets: (((data.topics || [])[0] || {}).series || [])
                    .map(p => !!p.partial),
                episodesScanned: data.episodes_scanned,
                from: data.range_from,
                to: data.range_to
            };
            this.topics = (data.topics || []).slice().sort((a, b) =>
                (b.total_mentions - a.total_mentions) || a.topic.localeCompare(b.topic));

            this.plotted = this.topics.filter(t =>
                t.series.filter(p => p.mentions > 0).length >= this.MIN_BUCKETS);
            this.empty = this.topics.filter(t => !this.plotted.includes(t));

            this.dataState = 'ready';
            console.log('[Narrative Pulse] Loaded', this.plotted.length, 'plottable topics of',
                this.topics.length, 'over', this.meta.buckets.length, 'monthly buckets');
        } catch (error) {
            console.error('[Narrative Pulse] Failed to load topic mentions:', error);
            this.dataState = 'error';
            this.dataError = error && error.name === 'AbortError'
                ? `No response from ${this.apiBaseUrl} after ${Math.round(this.apiTimeoutMs / 1000)} seconds.`
                : `Could not reach ${this.apiBaseUrl}/api/topic-mentions.`;
        } finally {
            clearTimeout(timeoutId);
        }

        this.updateSubtitle();
        this.renderLegend();
        this.renderChart();
    },

    retryLoad() { this.load(); },

    colorFor(topicName) {
        const index = this.topics.findIndex(t => t.topic === topicName);
        return this.COLORS[index % this.COLORS.length];
    },

    // "Topic momentum across 1,498 episodes" was never true of this corpus
    updateSubtitle() {
        const subtitle = this.container.querySelector('.section-subtitle');
        if (!subtitle) return;

        if (this.dataState !== 'ready') {
            subtitle.textContent = 'Topic mentions across the transcript corpus';
            return;
        }
        subtitle.textContent =
            `Topic mentions across ${this.meta.episodesScanned} episodes · ${this.formatRange()} · monthly`;
    },

    formatRange() {
        if (!this.meta || !this.meta.from || !this.meta.to) return '';
        const fmt = iso => new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
        return `${fmt(this.meta.from)}–${fmt(this.meta.to)}`;
    },

    renderLegend() {
        const legend = this.container.querySelector('.pulse-legend');
        if (!legend || this.dataState !== 'ready') return;

        legend.innerHTML = this.topics.map(topic => {
            const plotted = this.plotted.includes(topic);
            const color = plotted ? this.colorFor(topic.topic) : '#9ca3af';
            const value = plotted
                ? (topic.change_pct === null || topic.change_pct === undefined
                    ? `${topic.total_mentions} mentions`
                    : `${topic.change_pct >= 0 ? '+' : ''}${Math.round(topic.change_pct)}%`)
                : 'no data';
            return `
                <div class="legend-item${plotted ? '' : ' legend-item--empty'}"
                     title="${topic.total_mentions} mentions in ${topic.episodes_with_mentions} of ${this.meta.episodesScanned} episodes">
                    <span class="legend-dot" style="background: ${color};"></span>
                    <span class="legend-label"${plotted ? '' : ' style="color:#9ca3af;"'}>${topic.topic}</span>
                    <span class="legend-value" style="color: ${color};">${value}</span>
                </div>
            `;
        }).join('');
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
                font-size="13">Loading topic mentions…</text>`;
            return;
        }

        if (this.dataState === 'error') {
            chartContent.innerHTML = `
                <text x="400" y="130" text-anchor="middle" fill="#c77d7d" font-size="13"
                      font-weight="600">Topic mentions unavailable</text>
                <text x="400" y="152" text-anchor="middle" fill="#9ca3af" font-size="11">${this.dataError || ''}</text>`;
            return;
        }

        if (!this.plotted.length) {
            chartContent.innerHTML = `<text x="400" y="140" text-anchor="middle" fill="#9ca3af"
                font-size="13">No tracked topic has enough data to plot.</text>`;
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
                    font-size="10" font-weight="600">${this.view === 'volume' ? 'Mentions' : 'Per episode'}</text>`);

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
                const episodes = this.plotted[0].series[index].episodes;

                const rows = this.plotted.map(topic => {
                    const point = topic.series[index];
                    return `<div style="display:flex;gap:8px;justify-content:space-between;">
                        <span style="color:${this.colorFor(topic.topic)};">${topic.topic}</span>
                        <span>${point.mentions} (${point.mentions_per_episode.toFixed(2)}/ep)</span>
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
