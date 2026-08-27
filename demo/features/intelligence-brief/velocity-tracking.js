/**
 * Velocity Tracking - live topic mention counts
 *
 * Renders the five tracked topics from GET /api/topic-mentions, which serves
 * the precomputed topic_mentions collection (regex counts over the transcript
 * text in transcript_chunks_768d).
 *
 * Bucket size is monthly, not weekly. 50 episodes across Jan-Jun 2025 give 23
 * weekly buckets in which even the two topics that do occur are non-zero only
 * ~52% of the time; monthly gives 6 buckets with no gaps. The series is not
 * smoothed or interpolated - every point is a real bucket.
 *
 * The sparkline plots mentions per episode rather than raw mentions, because
 * episodes are unevenly spread (13 in January, 3 in the partial June), so raw
 * totals would track corpus volume as much as topic prominence.
 *
 * Topics with no mentions render as "no mentions" with no sparkline and no
 * percentage. There is no trend to draw for them.
 *
 * Separate file from intelligence-brief.js because that module still renders
 * Consensus Monitor and Topic Correlations from unified-data.js.
 *
 * (This replaces an earlier dead script of the same name that read
 * window.narrativePulseData and was not loaded by demo.html.)
 */
const VelocityTracking = {
    apiBaseUrl: window.SYNTHEA_API_BASE || 'http://localhost:8000',
    apiTimeoutMs: 30000,
    bucket: 'month',

    topics: [],
    meta: null,
    dataState: 'loading',   // 'loading' | 'ready' | 'error'
    dataError: null,

    init() {
        this.waitForList(() => this.load());
    },

    waitForList(callback, attempt = 0) {
        if (document.getElementById('velocityTrackingList')) {
            callback();
            return;
        }
        if (attempt > 100) {
            console.warn('[Velocity Tracking] #velocityTrackingList never appeared');
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
            window.SyntheaData.claim('velocity-tracking', '#velocity-tracking-section');
            const response = await window.SyntheaData.fetchResponse(
                'velocity-tracking',
                `${this.apiBaseUrl}/api/topic-mentions?bucket=${this.bucket}`,
                { signal: controller.signal }
            );
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            // Topics with data first, then by total mentions
            this.topics = (data.topics || []).slice().sort((a, b) =>
                (b.total_mentions - a.total_mentions) || a.topic.localeCompare(b.topic));
            this.meta = {
                bucket: data.bucket,
                buckets: data.buckets || [],
                episodesScanned: data.episodes_scanned,
                from: data.range_from,
                to: data.range_to
            };
            this.dataState = 'ready';

            console.log('[Velocity Tracking] Loaded', this.topics.length, 'topics over',
                this.meta.buckets.length, this.meta.bucket + ' buckets');
        } catch (error) {
            console.error('[Velocity Tracking] Failed to load topic mentions:', error);
            this.dataState = 'error';
            this.dataError = error && error.name === 'AbortError'
                ? `No response from ${this.apiBaseUrl} after ${Math.round(this.apiTimeoutMs / 1000)} seconds.`
                : `Could not reach ${this.apiBaseUrl}/api/topic-mentions.`;
        } finally {
            clearTimeout(timeoutId);
        }

        this.render();
        this.updateDescription();
    },

    retryLoad() {
        this.load();
    },

    // State what the numbers and the buckets actually are.
    updateDescription() {
        const section = document.getElementById('velocity-tracking-section')
            || document.querySelector('.synthesis-section:has(#velocityTrackingList)');
        const description = section && section.querySelector('.section-description');
        if (!description || !this.meta) return;

        const label = { month: 'monthly', fortnight: 'fortnightly', week: 'weekly' }[this.meta.bucket] || this.meta.bucket;
        description.textContent =
            `Mentions per episode, ${label} · ${this.formatRange()} · ${this.meta.episodesScanned} episodes`;
    },

    formatRange() {
        if (!this.meta || !this.meta.from || !this.meta.to) return '';
        const fmt = iso => new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
        return `${fmt(this.meta.from)}–${fmt(this.meta.to)}`;
    },

    render() {
        const container = document.getElementById('velocityTrackingList');
        if (!container) return;

        container.innerHTML = '';

        if (this.dataState === 'loading') {
            container.innerHTML = '<div class="influence-empty">Loading topic mentions…</div>';
            return;
        }

        if (this.dataState === 'error') {
            const error = document.createElement('div');
            error.className = 'influence-empty influence-empty--error';
            error.textContent = this.dataError || 'Topic mentions unavailable.';
            container.appendChild(error);

            const retry = document.createElement('button');
            retry.className = 'influence-retry';
            retry.textContent = 'Try again';
            retry.addEventListener('click', () => this.retryLoad());
            container.appendChild(retry);
            return;
        }

        if (!this.topics.length) {
            container.innerHTML = '<div class="influence-empty">No tracked topics returned.</div>';
            return;
        }

        this.topics.forEach(topic => {
            container.appendChild(this.renderRow(topic));
        });

        this.armAnimation();
    },

    renderRow(topic) {
        const item = document.createElement('div');
        item.className = 'influence-item velocity-item';

        const name = document.createElement('span');
        name.className = 'influence-name';
        name.textContent = topic.topic;
        name.title = `${topic.total_mentions} mentions in ${topic.episodes_with_mentions} of ` +
                     `${this.meta.episodesScanned} episodes`;
        item.appendChild(name);

        // Nothing was said about this topic, so there is no trend to draw.
        if (!topic.has_data) {
            const empty = document.createElement('span');
            empty.className = 'velocity-nodata';
            empty.textContent = 'no mentions';
            item.appendChild(empty);
            return item;
        }

        // A line through one or two non-zero buckets reads as a trend that
        // isn't there, so only draw one when at least three buckets have data.
        const nonZeroBuckets = topic.series.filter(point => point.mentions > 0).length;
        const rates = topic.series.map(point => point.mentions_per_episode);
        const rising = rates[rates.length - 1] >= rates[0];

        if (nonZeroBuckets >= 3) {
            item.appendChild(this.renderSparkline(rates, rising, topic));
        } else {
            const sparse = document.createElement('span');
            sparse.className = 'velocity-nodata';
            sparse.textContent = `${nonZeroBuckets} of ${topic.series.length} months`;
            sparse.title = 'Too few populated buckets to plot';
            item.appendChild(sparse);
        }

        const change = document.createElement('span');
        change.className = 'velocity-change ' + (rising ? 'trend-up' : 'trend-down');
        change.style.fontWeight = '600';

        if (topic.change_pct === null || topic.change_pct === undefined) {
            // Too little data for a rate of change - show the raw total instead
            // of inventing a percentage.
            change.style.color = 'var(--gray-400, #9ca3af)';
            change.textContent = `${topic.total_mentions}×`;
            change.title = `${topic.total_mentions} mentions total — too few for a rate of change`;
        } else {
            const positive = topic.change_pct >= 0;
            change.style.color = positive ? 'var(--sage)' : 'var(--dusty-rose)';
            change.setAttribute('data-value', Math.abs(Math.round(topic.change_pct)));
            change.setAttribute('data-positive', positive);
            change.innerHTML = `${positive ? '↑' : '↓'} <span class="velocity-percentage">${Math.abs(Math.round(topic.change_pct))}</span>%`;
            change.title = `Change in mentions per episode, ${this.lastTwoBuckets()}`;
        }

        item.appendChild(change);
        return item;
    },

    lastTwoBuckets() {
        const buckets = (this.meta && this.meta.buckets) || [];
        return buckets.length >= 2 ? `${buckets[buckets.length - 2]} → ${buckets[buckets.length - 1]}` : '';
    },

    renderSparkline(values, rising, topic) {
        const width = 45;
        const height = 18;
        const padding = 2;

        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = (max - min) || 1;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('class', 'velocity-sparkline');
        svg.setAttribute('aria-label',
            `${topic.topic}: mentions per episode by ${this.meta.bucket}, ` +
            values.map(v => v.toFixed(2)).join(', '));

        const d = values.map((value, index) => {
            const x = (index / Math.max(values.length - 1, 1)) * (width - 2 * padding) + padding;
            const y = height - padding - ((value - min) / range) * (height - 2 * padding);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', rising ? '#10B981' : '#EF4444');
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('class', 'sparkline-path');
        svg.appendChild(path);

        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = topic.series
            .map(point => `${point.bucket}: ${point.mentions} in ${point.episodes} eps`)
            .join('\n');
        svg.appendChild(title);

        return svg;
    },

    /**
     * intelligence-brief.js observes this section with a one-shot observer that
     * can fire before the fetch resolves, so own the trigger here.
     */
    armAnimation() {
        const section = document.getElementById('velocity-tracking-section')
            || document.querySelector('.synthesis-section:has(#velocityTrackingList)');

        if (!section) { this.animate(); return; }

        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) { this.animate(); return; }

        if (this.observer) this.observer.disconnect();
        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                this.observer.disconnect();
                this.animate();
            });
        }, { threshold: 0.2 });
        this.observer.observe(section);
    },

    animate() {
        const items = document.querySelectorAll('#velocityTrackingList .velocity-item');
        const ROW_STAGGER_MS = 100;
        const SPARKLINE_DELAY_MS = 200;

        items.forEach((item, index) => {
            setTimeout(() => item.classList.add('visible'), index * ROW_STAGGER_MS);
        });

        document.querySelectorAll('#velocityTrackingList .velocity-sparkline path').forEach((path, index) => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.transition = 'none';
            path.getBoundingClientRect();   // force a style recalculation

            setTimeout(() => {
                path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.42, 0, 0.58, 1)';
                path.style.strokeDashoffset = '0';
            }, SPARKLINE_DELAY_MS + (index * ROW_STAGGER_MS));
        });
    }
};

window.VelocityTracking = VelocityTracking;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VelocityTracking.init());
} else {
    VelocityTracking.init();
}
