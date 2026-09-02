/**
 * Topic Correlations - real co-occurrence, or an honest blank
 *
 * The section used to render four donut charts with invented percentages
 * ("82% AI + Infrastructure"). It now reads GET /api/topic-correlations, which
 * counts how many episodes mention each pair of tracked topics.
 *
 * With this corpus there is exactly one pair where both topics appear in enough
 * episodes to be worth counting, so this renders one number and states what it
 * is. It never draws a chart from a single pair, and when the overlap is no
 * bigger than chance would produce it says so instead of implying a signal.
 */
const TopicCorrelations = {
    apiBaseUrl: window.SYNTHEA_API_BASE || 'http://localhost:8000',
    apiTimeoutMs: 60000,   // 60s, not 30s. A search engine waking from idle measured 38s on a cold
    // page, and a genuine wake must not render as failure.

    dataState: 'loading',
    dataError: null,
    data: null,

    init() {
        this.waitForContainer(() => {
            // Finding 6, 2 Sep 2026. See velocity-tracking.js. In Vision this
            // printed "Topic correlations could not be loaded. Try again."
            // beside a MOCK badge, which is two contradictory claims about the
            // same panel.
            if (window.SyntheaData && window.SyntheaData.isVision()) {
                this.renderVisionMock();
                return;
            }
            this.load();
        });
    },

    /** The July 2025 mock donuts, from the mock dataset. Never fetches. */
    renderVisionMock() {
        const E = window.SyntheaData.esc;
        const host = document.getElementById('topicCorrelationsContainer');
        if (!host) return;
        const rows = ((((window.unifiedData || {}).intelligenceBrief || {}).metrics || {})
                      .topicCorrelations) || [];
        const section = document.getElementById('topic-correlations-section');
        if (section) {
            const desc = section.querySelector('.section-description');
            if (desc) desc.textContent = 'How narratives cluster in conversation';
        }
        // The mock's four-colour rotation, kept so the exhibit looks like the
        // exhibit rather than like a recolouring of it.
        //
        // `visible animated` are not decoration: components.css ships
        // .mini-pie-chart at opacity 0 and its percentage text at opacity 0,
        // waiting for an animator that intelligence-brief.js gutted to a no-op
        // when the live panel replaced this one. Without them the six donuts
        // render at the right size, in the right grid, and paint nothing - which
        // is how the first pass of this restoration shipped a badged, titled,
        // completely blank panel.
        const COLOURS = ['#4a7c59', '#f4a261', '#5a6c8c', '#c77d7d'];
        const CIRC = 2 * Math.PI * 40;   // r=40 in the 100x100 viewBox
        host.innerHTML = rows.map((r, i) => {
            const pct = Math.max(0, Math.min(100, Number(r.percentage) || 0));
            const dash = (CIRC * pct / 100).toFixed(1) + ' ' + CIRC.toFixed(1);
            return '<div class="mini-pie-chart visible animated">' +
                   '<svg viewBox="0 0 100 100" style="width: 80px; height: 80px;" aria-hidden="true">' +
                   '<circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="20"/>' +
                   '<circle cx="50" cy="50" r="40" fill="none" stroke="' + COLOURS[i % COLOURS.length] +
                   '" stroke-width="20" stroke-dasharray="' + dash + '" transform="rotate(-90 50 50)"/>' +
                   '<text x="50" y="55" text-anchor="middle" fill="#1a1a2e" font-size="16" ' +
                   'font-weight="600">' + pct + '%</text></svg>' +
                   '<span class="pie-label">' + E(r.topics) + '</span></div>';
        }).join('');
        if (!rows.length) {
            host.innerHTML = '<div class="influence-empty">' +
                'The mock dataset carries no correlation pairs.</div>';
        }
        window.SyntheaData.claim('topic-correlations', '#topic-correlations-section');
        window.SyntheaData.mark('topic-correlations', 'vision', 'July 2025 mock donuts');
    },

    waitForContainer(callback, attempt = 0) {
        if (document.getElementById('topicCorrelationsContainer')) {
            callback();
            return;
        }
        if (attempt > 100) {
            console.warn('[Topic Correlations] #topicCorrelationsContainer never appeared');
            return;
        }
        setTimeout(() => this.waitForContainer(callback, attempt + 1), 100);
    },

    async load() {
        this.dataState = 'loading';
        this.render();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.apiTimeoutMs);

        try {
            const response = await (window.SyntheaData.claim('topic-correlations', '#topic-correlations-section'), window.SyntheaData).fetchResponse('topic-correlations', `${this.apiBaseUrl}/api/topic-correlations`, { signal: controller.signal });
            if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
            this.data = await response.json();
            this.dataState = 'ready';
            console.log('[Topic Correlations]', this.data.meaningful_pairs, 'meaningful pair(s) of',
                this.data.pairs.length);
        } catch (error) {
            console.error('[Topic Correlations] Failed to load:', error);
            this.dataState = 'error';
            this.dataError = window.SyntheaData.describeError(error, 'Topic correlations');
        } finally {
            clearTimeout(timeoutId);
        }

        this.render();
        this.updateDescription();
    },

    retryLoad() { this.load(); },

    updateDescription() {
        const section = document.getElementById('topic-correlations-section')
            || document.querySelector('.synthesis-section:has(#topicCorrelationsContainer)');
        const description = section && section.querySelector('.section-description');
        if (!description) return;
        description.textContent = 'Episodes mentioning both tracked topics';
    },

    render() {
        const container = document.getElementById('topicCorrelationsContainer');
        if (!container) return;

        container.innerHTML = '';

        if (this.dataState === 'loading') {
            container.innerHTML = '<div class="influence-empty">Loading co-occurrence…</div>';
            return;
        }

        if (this.dataState === 'error') {
            const error = document.createElement('div');
            error.className = 'influence-empty influence-empty--error';
            error.textContent = this.dataError || 'Correlations unavailable.';
            container.appendChild(error);

            const retry = document.createElement('button');
            retry.className = 'influence-retry';
            retry.textContent = 'Try again';
            retry.addEventListener('click', () => this.retryLoad());
            container.appendChild(retry);
            return;
        }

        const meaningful = (this.data.pairs || []).filter(p => p.meaningful);
        const counts = this.data.topic_episode_counts || {};
        const thin = Object.entries(counts)
            .filter(([, n]) => n < 5)
            .map(([topic, n]) => `${topic} (${n})`);

        if (!meaningful.length) {
            container.appendChild(this.buildNotice(
                'Insufficient data',
                `No pair of tracked topics appears in enough episodes to count. ` +
                `Episode counts: ${Object.entries(counts).map(([t, n]) => `${t} ${n}`).join(', ')}.`));
            return;
        }

        container.appendChild(this.buildTable(meaningful));

        // One explanatory line for the whole table, rather than repeating the
        // same sentence under each of six blocks.
        const note = document.createElement('p');
        note.className = 'correlation-note';
        note.textContent =
            `Expected is what the overlap would be if the two topics were unrelated, ` +
            `given how many episodes mention each. A pair only reads as above chance if ` +
            `observed clears expected by two standard deviations` +
            (thin.length ? `. Too few episodes mention ${thin.join(', ')} to include.` : '.');
        container.appendChild(note);
    },

    buildTable(pairs) {
        const total = this.data.episodes_scanned;
        const table = document.createElement('table');
        table.className = 'correlation-table';

        const head = document.createElement('thead');
        head.innerHTML =
            '<tr><th scope="col">Topic pair</th>' +
            '<th scope="col" class="num">Observed</th>' +
            '<th scope="col" class="num">Expected</th>' +
            '<th scope="col">Verdict</th></tr>';
        table.appendChild(head);

        const body = document.createElement('tbody');
        pairs.forEach(pair => {
            // Compare against independence, allowing for small-count noise.
            // A plain "observed > expected" test called 4-vs-2.3 a correlation,
            // which is one episode away from nothing. Counting overlaps is a
            // Poisson process, so the standard deviation of the expected count
            // is sqrt(expected); a pair only reads as above chance if it clears
            // expected by two of those. On this corpus that leaves all six
            // pairs indistinguishable from chance, which is the honest answer.
            const sigma = Math.sqrt(Math.max(pair.expected_if_unrelated, 1));
            const chance = pair.both <= pair.expected_if_unrelated + 2 * sigma;
            const row = document.createElement('tr');

            const cell = document.createElement('th');
            cell.scope = 'row';
            cell.className = 'correlation-pair';
            cell.textContent = `${pair.topic_a} + ${pair.topic_b}`;
            cell.title =
                `${pair.topic_a} appears in ${pair.episodes_a} episodes, ` +
                `${pair.topic_b} in ${pair.episodes_b}, of ${total}.`;
            row.appendChild(cell);

            const observed = document.createElement('td');
            observed.className = 'num';
            observed.textContent = pair.both;
            row.appendChild(observed);

            const expected = document.createElement('td');
            expected.className = 'num correlation-expected';
            expected.textContent = Math.round(pair.expected_if_unrelated);
            row.appendChild(expected);

            const verdict = document.createElement('td');
            verdict.className = 'correlation-verdict' + (chance ? ' is-chance' : ' is-signal');
            verdict.textContent = chance
                ? 'Indistinguishable from chance'
                : 'Above chance';
            row.appendChild(verdict);

            body.appendChild(row);
        });
        table.appendChild(body);
        return table;
    },

    buildNotice(title, body) {
        const wrapper = document.createElement('div');
        wrapper.className = 'correlation-notice';

        const heading = document.createElement('div');
        heading.className = 'correlation-notice-title';
        heading.textContent = title;
        wrapper.appendChild(heading);

        const text = document.createElement('div');
        text.className = 'correlation-detail';
        text.textContent = body;
        wrapper.appendChild(text);

        return wrapper;
    }
};

window.TopicCorrelations = TopicCorrelations;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TopicCorrelations.init());
} else {
    TopicCorrelations.init();
}
