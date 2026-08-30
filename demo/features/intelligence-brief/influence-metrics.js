/**
 * Influence Metrics - live entity rankings
 *
 * This section used to render seven podcasts with a mock "influence score"
 * percentage. It now renders the real quantity the data supports: named
 * entities ranked by how many of the 50 loaded episodes mention them, from
 * GET /api/entities.
 *
 * The two are not the same measure and one cannot be derived from the other:
 *   - the mock ranked *podcasts* on a 0-100 score
 *   - the entity data ranks *entities* on a whole number of episodes
 * So the bar is drawn relative to the top entity's episode count, and the value
 * is labelled in episodes. It is deliberately not rendered as a percentage.
 *
 * It lives in its own file rather than inside intelligence-brief.js because
 * that module also renders Velocity Tracking, Consensus Monitor and Topic
 * Correlations, which are all still on unified-data.js.
 */
const InfluenceMetrics = {
    apiBaseUrl: window.SYNTHEA_API_BASE || 'http://localhost:8000',
    apiTimeoutMs: 60000,   // 60s, not 30s. A search engine waking from idle measured 38s on a cold
    // page, and a genuine wake must not render as failure.
    limit: 7,

    entities: [],
    episodesCovered: 0,
    dataState: 'loading',   // 'loading' | 'ready' | 'error'
    dataError: null,

    // Warm editorial palette, matching the previous fallback thumbnails
    FALLBACK_COLORS: ['#4a7c59', '#c77d7d', '#f4a261', '#5a6c8c'],

    init() {
        // The list lives in a template intelligence-brief/init.js fetches, so
        // wait for it before rendering into it.
        this.waitForList(() => this.load());
    },

    waitForList(callback, attempt = 0) {
        if (document.getElementById('influence-metrics-list')) {
            callback();
            return;
        }
        if (attempt > 100) {
            console.warn('[Influence Metrics] #influence-metrics-list never appeared');
            return;
        }
        setTimeout(() => this.waitForList(callback, attempt + 1), 100);
    },

    async load() {
        this.dataState = 'loading';
        this.dataError = null;
        this.render();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.apiTimeoutMs);

        try {
            const response = await (window.SyntheaData.claim('influence-metrics', '#influence-metrics-section'), window.SyntheaData).fetchResponse('influence-metrics', `${this.apiBaseUrl}/api/entities?limit=${this.limit}`, {
                signal: controller.signal
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            this.entities = Array.isArray(data.entities) ? data.entities : [];
            this.episodesCovered = data.episodes_covered || 0;
            this.countBasis = data.count_basis || 'episodes';
            this.dataState = 'ready';

            console.log('[Influence Metrics] Loaded', this.entities.length,
                'entities across', this.episodesCovered, 'episodes');
        } catch (error) {
            console.error('[Influence Metrics] Failed to load entities:', error);
            this.dataState = 'error';
            this.dataError = window.SyntheaData.describeError(error, 'Influence metrics');
        } finally {
            clearTimeout(timeoutId);
        }

        this.render();
        this.updateDescription();
    },

    retryLoad() {
        this.load();
    },

    // The section subtitle states what the numbers actually are.
    updateDescription() {
        const section = document.getElementById('influence-metrics-section')
            || document.querySelector('.synthesis-section:has(#influence-metrics-list)');
        const description = section && section.querySelector('.section-description');
        if (!description) return;

        description.textContent = this.dataState === 'ready'
            ? `Named entities by episodes mentioning them (of ${this.episodesCovered})`
            : 'Named entities by episodes mentioning them';
        // Entity extraction lags the corpus. Say so, from the data, and let the
        // label remove itself when it catches up.
        let cov = description.querySelector('[data-entity-coverage]');
        if (!cov) {
            cov = document.createElement('span');
            cov.className = 'synthea-coverage-note';
            cov.setAttribute('data-entity-coverage', '');
            cov.hidden = true;
            description.appendChild(cov);
        }
        if (window.SyntheaData.fillEntityCoverage) {
            window.SyntheaData.fillEntityCoverage(description);
        }
    },

    render() {
        const listElement = document.getElementById('influence-metrics-list');
        if (!listElement) return;

        listElement.innerHTML = '';

        if (this.dataState === 'loading') {
            listElement.innerHTML = '<div class="influence-empty">Loading entities…</div>';
            return;
        }

        if (this.dataState === 'error') {
            const error = document.createElement('div');
            error.className = 'influence-empty influence-empty--error';
            error.textContent = this.dataError || 'Entities unavailable.';
            listElement.appendChild(error);

            const retry = document.createElement('button');
            retry.className = 'influence-retry';
            retry.textContent = 'Try again';
            retry.addEventListener('click', () => this.retryLoad());
            listElement.appendChild(retry);
            return;
        }

        if (!this.entities.length) {
            listElement.innerHTML = '<div class="influence-empty">No entities returned.</div>';
            return;
        }

        // Bars are relative to the most-mentioned entity, not a percentage.
        const topCount = this.entities[0].episode_count || 1;

        this.entities.forEach(entity => {
            const width = Math.round((entity.episode_count / topCount) * 100);

            const item = document.createElement('div');
            item.className = 'influence-item influence-metric-item';

            const thumbnail = document.createElement('div');
            thumbnail.className = 'influence-thumbnail';
            thumbnail.setAttribute('aria-hidden', 'true');
            this.applyThumbnailFallback(thumbnail, entity.text);
            item.appendChild(thumbnail);

            const name = document.createElement('span');
            name.className = 'influence-name';
            name.textContent = entity.text;
            // The spaCy category label is deliberately NOT shown. The 2025
            // extraction mislabels routinely - bitcoin as PERSON, gpt as ORG -
            // and a flat ranked list hides an error that putting the type on
            // screen would advertise as fact. The names are right; the types
            // are not reliable enough to publish.
            name.title = `${entity.episode_count} episodes · ${entity.podcast_count} podcasts`;
            item.appendChild(name);

            // Render the true value up front. animate() rewinds to zero and
            // counts up, so if the animation never runs (backgrounded tab, no
            // requestAnimationFrame) the row still shows the real number rather
            // than a misleading zero.
            const barContainer = document.createElement('div');
            barContainer.className = 'influence-bar-container';
            barContainer.innerHTML = `<div class="influence-bar" data-percentage="${width}" style="width: ${width}%;"></div>`;
            item.appendChild(barContainer);

            const score = document.createElement('span');
            score.className = 'influence-score';
            score.setAttribute('data-target', entity.episode_count);
            score.setAttribute('data-unit', ' eps');
            score.textContent = `${entity.episode_count} eps`;
            item.appendChild(score);

            listElement.appendChild(item);
        });

        this.armAnimation();
    },

    /**
     * intelligence-brief.js observes this section too, but its observer is
     * one-shot and can fire before the fetch resolves, which would leave the
     * rows sitting at zero. So own the trigger here: animate now if the section
     * is already on screen, otherwise watch for it.
     */
    armAnimation() {
        const section = document.getElementById('influence-metrics-section')
            || document.querySelector('.synthesis-section:has(#influence-metrics-list)');

        if (!section) {
            this.animate();
            return;
        }

        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            this.animate();
            return;
        }

        if (this.observer) this.observer.disconnect();
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                this.observer.disconnect();
                this.animate();
            });
        }, { threshold: 0.2 });
        this.observer.observe(section);
    },

    applyThumbnailFallback(element, name) {
        const initial = name.trim().charAt(0).toUpperCase();

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        const color = this.FALLBACK_COLORS[Math.abs(hash) % this.FALLBACK_COLORS.length];

        element.style.backgroundColor = color;
        element.textContent = initial;
    },

    // Counts up to the episode count while the bar grows to its relative width.
    animate() {
        const items = document.querySelectorAll('#influence-metrics-list .influence-item');
        const ROW_STAGGER_MS = 100;

        items.forEach((item, index) => {
            const bar = item.querySelector('.influence-bar');
            const scoreSpan = item.querySelector('.influence-score');
            if (!bar || !scoreSpan) return;

            const barWidth = parseInt(bar.dataset.percentage, 10) || 0;
            const target = parseInt(scoreSpan.dataset.target, 10) || 0;
            const unit = scoreSpan.dataset.unit || '';

            setTimeout(() => {
                item.classList.add('visible');

                // Rewind, then grow to the real value
                bar.style.width = '0%';
                scoreSpan.textContent = `0${unit}`;
                requestAnimationFrame(() => { bar.style.width = `${barWidth}%`; });

                const duration = 800;
                const startTime = performance.now();

                const animateCount = (currentTime) => {
                    const progress = Math.min((currentTime - startTime) / duration, 1);
                    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                    scoreSpan.textContent = Math.round(target * easeOutCubic) + unit;
                    if (progress < 1) requestAnimationFrame(animateCount);
                };

                requestAnimationFrame(animateCount);
            }, 50 + (index * ROW_STAGGER_MS));
        });
    }
};

window.InfluenceMetrics = InfluenceMetrics;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => InfluenceMetrics.init());
} else {
    InfluenceMetrics.init();
}
