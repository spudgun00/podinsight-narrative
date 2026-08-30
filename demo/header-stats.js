/**
 * Header stats - live corpus counts
 *
 * The header ticker previously showed mock topic momentum ("Enterprise Agents
 * ↑107%", "Defense Tech ↑111%", "AI Infrastructure ↑64%") for topics that are
 * not even tracked. Those have no real equivalent, so they are gone rather than
 * approximated.
 *
 * What replaces them is what the corpus can actually answer, from
 * GET /api/episodes: episode count, podcast count, and total hours summed from
 * duration_seconds.
 */
const HeaderStats = {
    apiBaseUrl: window.SYNTHEA_API_BASE || 'http://localhost:8000',
    apiTimeoutMs: 60000,   // 60s, not 30s. A search engine waking from idle measured 38s on a cold
    // page, and a genuine wake must not render as failure.

    dataState: 'loading',
    stats: null,

    init() {
        this.inner = document.querySelector('.header-metrics-inner');
        this.outer = document.querySelector('.header-metrics');
        if (!this.inner) return;
        this.load();
    },

    async load() {
        this.dataState = 'loading';
        this.render();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.apiTimeoutMs);

        try {
            const response = await (window.SyntheaData.claim('header-stats', '.header-stats, .header-stat, header'), window.SyntheaData).fetchResponse('header-stats', `${this.apiBaseUrl}/api/episodes`, { signal: controller.signal });
            if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);

            const data = await response.json();
            const episodes = Array.isArray(data.episodes) ? data.episodes : [];
            const seconds = episodes.reduce((sum, e) => sum + (e.duration_seconds || 0), 0);

            this.stats = {
                episodes: typeof data.total === 'number' ? data.total : episodes.length,
                podcasts: typeof data.podcast_count === 'number'
                    ? data.podcast_count
                    : new Set(episodes.map(e => e.podcast_name)).size,
                // Prefer the API's whole-catalogue total; summing the page
                // under-reported once the corpus outgrew the default limit.
                hours: typeof data.total_hours === 'number'
                    ? data.total_hours
                    : Math.round(seconds / 3600)
            };
            this.dataState = 'ready';
            console.log('[Header Stats]', this.stats);
        } catch (error) {
            console.error('[Header Stats] Failed to load:', error);
            this.dataState = 'error';
        }

        this.render();
    },

    render() {
        if (!this.inner) return;

        if (this.dataState !== 'ready') {
            // Nothing real to show yet, so show nothing rather than a placeholder
            this.inner.innerHTML = '';
            if (this.outer) this.outer.classList.remove('header-metrics--live');
            return;
        }

        const items = [
            { label: 'Episodes', value: this.stats.episodes.toLocaleString() },
            { label: 'Podcasts', value: String(this.stats.podcasts) },
            { label: 'Hours analysed', value: this.stats.hours.toLocaleString() }
        ];

        this.inner.innerHTML = items
            .map(item => `<span class="ticker-item">${item.label} <span class="ticker-value">${item.value}</span></span>`)
            .join('<span class="ticker-item">•</span>');

        // Reveals the row. It is display:none by default so it never appears
        // holding placeholder or mock numbers.
        if (this.outer) this.outer.classList.add('header-metrics--live');
    }
};

window.HeaderStats = HeaderStats;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HeaderStats.init());
} else {
    HeaderStats.init();
}
