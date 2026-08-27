/**
 * Topic drilldown — the real episodes behind a topic-mentions number.
 *
 * GET /api/topic-drilldown?topic=X[&month=YYYY-MM]
 *
 * Opens from a topic in the Narrative Pulse legend or a row in Velocity
 * Tracking. Clicking an episode hands off to the existing live episode panel.
 *
 * No volume floor here. The floor in trend.js exists because a *rate of change*
 * on a small denominator is unstable; a count of episodes is a fact. DePIN
 * opens to its two episodes rather than being suppressed, which is the point of
 * being able to drill in at all.
 *
 * The old mock drilldown (narrative-pulse-drilldown.js) renders "Key Drivers
 * This Week" and "Market Consensus" from unified-data. It stays for Vision;
 * this replaces it in Live.
 */
const DrilldownLive = {
    panel: null,
    apiBaseUrl: window.SYNTHEA_API_BASE || 'http://localhost:8000',
    current: null,

    init() {
        if (window.SyntheaData && window.SyntheaData.isVision()) return;
        this.build();
        this.bindTriggers();
    },

    build() {
        this.panel = document.createElement('div');
        this.panel.className = 'drilldown-live';
        this.panel.setAttribute('data-state', 'closed');
        this.panel.setAttribute('role', 'dialog');
        this.panel.setAttribute('aria-modal', 'true');
        this.panel.setAttribute('aria-labelledby', 'drilldown-live-title');
        this.panel.innerHTML = `
            <div class="drilldown-live-header">
                <div>
                    <h2 id="drilldown-live-title"></h2>
                    <p class="drilldown-live-sub"></p>
                </div>
                <button class="drilldown-live-close" aria-label="Close" title="Close">✕</button>
            </div>
            <div class="drilldown-live-body"></div>`;
        document.body.appendChild(this.panel);

        this.backdrop = document.createElement('div');
        this.backdrop.className = 'drilldown-live-backdrop';
        this.backdrop.addEventListener('click', () => this.close());
        document.body.appendChild(this.backdrop);

        this.panel.querySelector('.drilldown-live-close')
            .addEventListener('click', () => this.close());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.getAttribute('data-state') === 'open') this.close();
        });

        if (window.SyntheaData) window.SyntheaData.claim('drilldown', this.panel);
    },

    /** Legend items and velocity rows both carry their topic name as text. */
    bindTriggers() {
        document.addEventListener('click', (e) => {
            const legend = e.target.closest('.legend-item');
            if (legend && !legend.classList.contains('legend-item--empty')) {
                const label = legend.querySelector('.legend-label');
                if (label) { e.preventDefault(); this.open(label.textContent.trim()); return; }
            }
            // Empty legend items (DePIN) are still worth opening - two episodes
            // is a real answer, and it is the one people will want to check.
            if (legend) {
                const label = legend.querySelector('.legend-label');
                if (label) { e.preventDefault(); this.open(label.textContent.trim()); return; }
            }
            const row = e.target.closest('#velocityTrackingList .influence-item, #velocityTrackingList .velocity-item');
            if (row) {
                const name = row.querySelector('.influence-name, .velocity-topic');
                if (name) { e.preventDefault(); this.open(name.textContent.trim()); }
            }
        });
    },

    async open(topic, month) {
        this.current = { topic, month };
        this.panel.setAttribute('data-state', 'open');
        this.backdrop.setAttribute('data-state', 'open');
        this.panel.querySelector('#drilldown-live-title').textContent = topic;
        this.panel.querySelector('.drilldown-live-sub').textContent =
            month ? `Episodes mentioning this topic in ${this.monthLabel(month)}` : 'Episodes mentioning this topic';
        const body = this.panel.querySelector('.drilldown-live-body');
        body.innerHTML = '<div class="drilldown-live-empty">Loading…</div>';

        let data;
        try {
            const q = `/api/topic-drilldown?topic=${encodeURIComponent(topic)}`
                    + (month ? `&month=${encodeURIComponent(month)}` : '');
            data = await window.SyntheaData.fetchJSON('drilldown', q);
        } catch (err) {
            body.innerHTML = `<div class="drilldown-live-empty">Could not load the episodes behind this number.</div>`;
            return;
        }
        this.render(data);
    },

    monthLabel(m) {
        const names = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];
        const [y, mo] = m.split('-');
        return `${names[parseInt(mo, 10) - 1]} ${y}`;
    },

    render(data) {
        const body = this.panel.querySelector('.drilldown-live-body');
        body.innerHTML = '';

        const summary = document.createElement('div');
        summary.className = 'drilldown-live-summary';
        summary.textContent = data.episode_count === 0
            ? 'No episodes mention this topic.'
            : `${data.total_mentions.toLocaleString()} mention${data.total_mentions === 1 ? '' : 's'} `
              + `across ${data.episode_count.toLocaleString()} episode${data.episode_count === 1 ? '' : 's'}`
              + (data.month ? ` in ${this.monthLabel(data.month)}` : ', whole corpus')
              + '.';
        body.appendChild(summary);

        if (!data.episodes.length) {
            const none = document.createElement('div');
            none.className = 'drilldown-live-empty';
            none.textContent = 'Nothing to list.';
            body.appendChild(none);
            return;
        }

        const list = document.createElement('ol');
        list.className = 'drilldown-live-list';
        data.episodes.forEach(ep => {
            const li = document.createElement('li');
            li.className = 'drilldown-live-row';
            li.tabIndex = 0;
            li.setAttribute('role', 'button');

            const count = document.createElement('span');
            count.className = 'drilldown-live-count';
            count.textContent = ep.mention_count;
            count.title = `${ep.mention_count} mention${ep.mention_count === 1 ? '' : 's'} `
                        + `across ${ep.chunks_scanned} passages`;
            li.appendChild(count);

            const meta = document.createElement('div');
            meta.className = 'drilldown-live-meta';
            const title = document.createElement('div');
            title.className = 'drilldown-live-episode';
            title.textContent = ep.episode_title;
            meta.appendChild(title);
            const sub = document.createElement('div');
            sub.className = 'drilldown-live-podcast';
            sub.textContent = ep.podcast_name + (ep.published_at ? ` · ${this.dateLabel(ep.published_at)}` : '');
            meta.appendChild(sub);
            li.appendChild(meta);

            const openEp = () => {
                if (window.episodePanelV2 && typeof window.episodePanelV2.open === 'function') {
                    this.close();
                    window.episodePanelV2.open(ep.episode_id);
                }
            };
            li.addEventListener('click', openEp);
            li.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEp(); }
            });
            list.appendChild(li);
        });
        body.appendChild(list);

        if (data.truncated) {
            const more = document.createElement('div');
            more.className = 'drilldown-live-empty';
            more.textContent = `Showing the top ${data.episodes.length} of ${data.episode_count}.`;
            body.appendChild(more);
        }
    },

    /** Absolute dates only. The corpus is fixed; "3 days ago" would be a lie. */
    dateLabel(iso) {
        const d = new Date(iso);
        if (isNaN(d)) return iso.slice(0, 10);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    },

    close() {
        this.panel.setAttribute('data-state', 'closed');
        this.backdrop.setAttribute('data-state', 'closed');
    }
};

window.DrilldownLive = DrilldownLive;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DrilldownLive.init());
} else {
    DrilldownLive.init();
}
