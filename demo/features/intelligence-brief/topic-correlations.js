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
    apiTimeoutMs: 30000,

    dataState: 'loading',
    dataError: null,
    data: null,

    init() {
        this.waitForContainer(() => this.load());
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
            this.dataError = error && error.name === 'AbortError'
                ? `No response from ${this.apiBaseUrl} after ${Math.round(this.apiTimeoutMs / 1000)} seconds.`
                : `Could not reach ${this.apiBaseUrl}/api/topic-correlations.`;
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

        meaningful.forEach(pair => container.appendChild(this.buildPair(pair)));

        if (thin.length) {
            container.appendChild(this.buildNotice(
                'Nothing else is computable',
                `Too few episodes mention ${thin.join(', ')}, so no other pair can be counted.`));
        }
    },

    buildPair(pair) {
        const total = this.data.episodes_scanned;
        // Compare with what independence alone would produce before calling it a correlation
        const chance = pair.both <= Math.ceil(pair.expected_if_unrelated);

        const wrapper = document.createElement('div');
        wrapper.className = 'correlation-figure';

        const value = document.createElement('div');
        value.className = 'correlation-value';
        value.textContent = `${pair.both} of ${total}`;
        wrapper.appendChild(value);

        const label = document.createElement('div');
        label.className = 'correlation-label';
        label.textContent = `episodes mention both ${pair.topic_a} and ${pair.topic_b}`;
        wrapper.appendChild(label);

        const detail = document.createElement('div');
        detail.className = 'correlation-detail';
        detail.textContent =
            `${pair.topic_a} appears in ${pair.episodes_a}, ${pair.topic_b} in ${pair.episodes_b}. ` +
            `If the two were unrelated you would expect about ${pair.expected_if_unrelated}.`;
        wrapper.appendChild(detail);

        if (chance) {
            const verdict = document.createElement('div');
            verdict.className = 'correlation-verdict';
            verdict.textContent = 'Indistinguishable from chance — not a correlation.';
            wrapper.appendChild(verdict);
        }

        return wrapper;
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
