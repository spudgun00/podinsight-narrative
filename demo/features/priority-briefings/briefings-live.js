/**
 * Notable episodes — the honest Priority Briefings.
 *
 * GET /api/briefings, pre-generated and cached. Nothing is generated per view.
 *
 * What the mock had and this does not: a "Score: 97" nothing computes, "3h ago"
 * against a corpus that ends 23 June 2025, and stance labels (CONSENSUS
 * FORMING, DIVERGENCE) that would need claim matching and stance detection the
 * stack cannot do.
 *
 * What replaces them: the ranking is stated on the panel, and the only numbers
 * shown are its inputs - mentions, words, and the density derived from them.
 * Every claim carries a verbatim quote whose timestamp was resolved against the
 * nested Whisper segments, so Play clip lands on the sentence.
 */
const BriefingsLive = {
    apiBaseUrl: window.SYNTHEA_API_BASE || 'http://localhost:8000',
    data: null,

    async init() {
        if (window.SyntheaData && window.SyntheaData.isVision()) return;
        // The mount point is an empty div in demo.html; the section chrome was
        // previously built by the mock renderer, which is now Vision-only, so
        // this builds its own.
        const container = document.getElementById('priority-briefings-container')
                       || document.querySelector('.priority-briefings-container');
        if (!container) return;
        window.SyntheaData.claim('priority-briefings', container);

        container.innerHTML = `
            <div class="briefings-live-section">
                <div class="briefings-live-section-head">
                    <h2 class="briefings-live-section-title">Notable Episodes</h2>
                    <span class="section-subtitle briefings-live-section-sub"></span>
                </div>
                <p class="briefings-live-ranking"></p>
                <div class="briefings-grid" id="briefings-grid"></div>
            </div>`;
        this.container = container;
        this.grid = container.querySelector('#briefings-grid');
        this.grid.innerHTML = '<div class="briefings-live-empty">Loading notable episodes…</div>';

        try {
            this.data = await window.SyntheaData.fetchJSON('priority-briefings', '/api/briefings?limit=12');
        } catch (err) {
            this.grid.innerHTML = '<div class="briefings-live-empty">Could not load briefs.</div>';
            return;
        }
        this.renderHeader();
        this.render();
        this.buildFullBriefPanel();
    },

    renderHeader() {
        const sub = this.container.querySelector('.briefings-live-section-sub');
        if (sub) sub.textContent = this.periodLabel();
        const note = this.container.querySelector('.briefings-live-ranking');
        if (note) note.textContent = this.data.ranking;
    },

    periodLabel() {
        const [a, b] = (this.data.period || '').split(' to ');
        if (!a || !b) return 'the corpus';
        const f = (d) => new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
        return `${f(a)} – ${f(b)}`;
    },

    dateLabel(iso) {
        const d = new Date(iso);
        if (isNaN(d)) return (iso || '').slice(0, 10);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    },

    render() {
        this.grid.innerHTML = '';
        this.data.briefs.forEach(b => this.grid.appendChild(this.card(b)));
    },

    card(b) {
        const el = document.createElement('article');
        el.className = 'briefings-live-card';

        const head = document.createElement('div');
        head.className = 'briefings-live-head';
        head.innerHTML =
            `<span class="briefings-live-podcast"></span>` +
            `<span class="briefings-live-meta"></span>`;
        head.querySelector('.briefings-live-podcast').textContent = b.podcast_name;
        // Absolute date, and the ranking inputs rather than a synthesised score.
        head.querySelector('.briefings-live-meta').textContent =
            `${this.dateLabel(b.published_at)} · ${b.rank_mentions} topic mentions in `
            + `${b.rank_words.toLocaleString()} words (${b.rank_density}/1k)`;
        el.appendChild(head);

        const h = document.createElement('h3');
        h.className = 'briefings-live-title';
        h.textContent = b.episode_title;
        el.appendChild(h);

        if (b.guests && b.guests.length) {
            const g = document.createElement('div');
            g.className = 'briefings-live-guests';
            g.textContent = 'Guests: ' + b.guests.join(', ');
            el.appendChild(g);
        }

        const p = document.createElement('p');
        p.className = 'briefings-live-summary';
        p.textContent = b.summary;
        el.appendChild(p);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'briefings-live-open';
        btn.textContent = `View Full Brief (${b.claims.length} claims) →`;
        btn.addEventListener('click', () => this.openFull(b));
        el.appendChild(btn);
        return el;
    },

    buildFullBriefPanel() {
        if (this.panel) return;
        this.panel = document.createElement('div');
        this.panel.className = 'briefings-live-panel';
        this.panel.setAttribute('data-state', 'closed');
        this.panel.setAttribute('role', 'dialog');
        this.panel.setAttribute('aria-modal', 'true');
        this.panel.innerHTML = `
            <div class="briefings-live-panel-head">
                <div>
                    <h2 class="briefings-live-panel-title"></h2>
                    <p class="briefings-live-panel-sub"></p>
                </div>
                <button class="briefings-live-close" aria-label="Close">✕</button>
            </div>
            <div class="briefings-live-panel-body"></div>`;
        document.body.appendChild(this.panel);

        this.backdrop = document.createElement('div');
        this.backdrop.className = 'briefings-live-backdrop';
        this.backdrop.addEventListener('click', () => this.closeFull());
        document.body.appendChild(this.backdrop);

        this.panel.querySelector('.briefings-live-close')
            .addEventListener('click', () => this.closeFull());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.getAttribute('data-state') === 'open') this.closeFull();
        });
    },

    openFull(b) {
        this.panel.setAttribute('data-state', 'open');
        this.backdrop.setAttribute('data-state', 'open');
        this.panel.querySelector('.briefings-live-panel-title').textContent = b.episode_title;
        this.panel.querySelector('.briefings-live-panel-sub').textContent =
            `${b.podcast_name} · ${this.dateLabel(b.published_at)}`
            + (b.guests && b.guests.length ? ` · ${b.guests.join(', ')}` : '');

        const body = this.panel.querySelector('.briefings-live-panel-body');
        body.innerHTML = '';

        const sum = document.createElement('p');
        sum.className = 'briefings-live-panel-summary';
        sum.textContent = b.summary;
        body.appendChild(sum);

        const h = document.createElement('h4');
        h.className = 'briefings-live-claims-head';
        h.textContent = 'What was said';
        body.appendChild(h);

        b.claims.forEach(c => {
            const row = document.createElement('div');
            row.className = 'briefings-live-claim';

            const claim = document.createElement('div');
            claim.className = 'briefings-live-claim-text';
            claim.textContent = c.claim;
            row.appendChild(claim);

            const q = document.createElement('blockquote');
            q.className = 'briefings-live-quote';
            q.textContent = '“' + c.quote + '”';
            row.appendChild(q);

            const foot = document.createElement('div');
            foot.className = 'briefings-live-claim-foot';
            const ts = document.createElement('span');
            ts.className = 'briefings-live-ts';
            ts.textContent = c.timestamp || '—';
            foot.appendChild(ts);

            if (c.located && c.start_seconds != null) {
                const play = document.createElement('button');
                play.type = 'button';
                play.className = 'briefings-live-play';
                play.textContent = '▶ Play clip';
                play.addEventListener('click', () => this.playClip(b.episode_id, c.start_seconds, play));
                foot.appendChild(play);
            }
            row.appendChild(foot);
            body.appendChild(row);
        });

        const openEp = document.createElement('button');
        openEp.type = 'button';
        openEp.className = 'briefings-live-open-episode';
        openEp.textContent = 'Open episode →';
        openEp.addEventListener('click', () => {
            if (window.episodePanelV2 && window.episodePanelV2.open) {
                this.closeFull();
                window.episodePanelV2.open(b.episode_id);
            }
        });
        body.appendChild(openEp);
    },

    async playClip(episodeId, startSeconds, btn) {
        const original = btn.textContent;
        btn.textContent = 'Loading…';
        btn.disabled = true;
        try {
            const ms = Math.max(0, Math.round(startSeconds * 1000));
            const url = `${this.apiBaseUrl}/api/v1/audio_clips/${encodeURIComponent(episodeId)}`
                      + `?start_time_ms=${ms}&duration_ms=30000`;
            const r = await window.SyntheaData.fetchResponse('audio-clips', url);
            const d = await r.json();
            if (!d.clip_url) throw new Error('no clip');
            if (this.audio) this.audio.pause();
            this.audio = new Audio(d.clip_url);
            await this.audio.play();
            btn.textContent = '▮▮ Playing';
        } catch (e) {
            btn.textContent = 'Clip unavailable';
        } finally {
            btn.disabled = false;
            setTimeout(() => { btn.textContent = original; }, 30000);
        }
    },

    closeFull() {
        this.panel.setAttribute('data-state', 'closed');
        this.backdrop.setAttribute('data-state', 'closed');
        if (this.audio) this.audio.pause();
    }
};

window.BriefingsLive = BriefingsLive;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BriefingsLive.init());
} else {
    BriefingsLive.init();
}
