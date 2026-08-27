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
        // Deliberately the Vision card's structure and classes, so the visual
        // grammar matches, with only honest slots filled:
        //   podcast-badge -> podcast          episode-info -> date, duration, density
        //   guest-info    -> guests           card-title   -> title
        //   card-summary  -> hook (one line)  card-tags    -> tracked topics mentioned
        //   mentions      -> entity counts    view-brief-btn -> claim count
        // The Vision card's "Score: 97" and its stance tag have no slot here:
        // nothing computes either.
        const el = document.createElement('div');
        el.className = 'briefing-card briefings-live-card';

        const header = document.createElement('div');
        header.className = 'card-header';

        const badge = document.createElement('span');
        badge.className = 'podcast-badge';
        badge.textContent = b.podcast_name;
        header.appendChild(badge);

        const info = document.createElement('div');
        info.className = 'episode-info';
        const bits = [this.dateLabel(b.published_at)];
        if (b.duration_minutes) bits.push(`${b.duration_minutes} min`);
        bits.forEach((t, i) => {
            if (i) {
                const sep = document.createElement('span');
                sep.className = 'separator'; sep.textContent = '•';
                info.appendChild(sep);
            }
            const sp = document.createElement('span');
            sp.textContent = t;
            info.appendChild(sp);
        });
        const sep2 = document.createElement('span');
        sep2.className = 'separator'; sep2.textContent = '•';
        info.appendChild(sep2);
        const dens = document.createElement('span');
        dens.className = 'briefings-live-density';
        dens.textContent = `${b.rank_density}/1k`;
        // Methodology in the tooltip rather than on the card.
        dens.title = `${b.rank_mentions} tracked-topic mentions in ${b.rank_words.toLocaleString()} `
                   + `words = ${b.rank_density} per 1,000 words. This is the ranking input, `
                   + `not a score.`;
        info.appendChild(dens);
        header.appendChild(info);
        el.appendChild(header);

        if (b.guests && b.guests.length) {
            const g = document.createElement('div');
            g.className = 'guest-info';
            g.textContent = b.guests.join(', ');
            el.appendChild(g);
        }

        const h = document.createElement('h3');
        h.className = 'card-title';
        h.textContent = b.episode_title;
        el.appendChild(h);

        const hook = document.createElement('p');
        hook.className = 'card-summary';
        hook.textContent = b.hook || '';
        el.appendChild(hook);

        if (b.topic_tags && b.topic_tags.length) {
            const tags = document.createElement('div');
            tags.className = 'card-tags';
            b.topic_tags.forEach(t => {
                const a = document.createElement('span');
                a.className = 'tag';
                a.textContent = '#' + t.replace(/[^A-Za-z0-9]/g, '');
                a.title = `${t} is mentioned in this episode`;
                tags.appendChild(a);
            });
            el.appendChild(tags);
        }

        const footer = document.createElement('div');
        footer.className = 'card-footer';

        const mentions = document.createElement('div');
        mentions.className = 'mentions';
        if (b.top_entities && b.top_entities.length) {
            const eye = document.createElement('span');
            eye.textContent = '👁';
            mentions.appendChild(eye);
            const list = document.createElement('span');
            list.className = 'mention-count';
            list.textContent = b.top_entities.map(e => `${e.name} (${e.count})`).join(', ');
            list.title = 'Most-mentioned named entities, counted from the 2025 extraction';
            mentions.appendChild(list);
        }
        footer.appendChild(mentions);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'view-brief-btn';
        btn.textContent = `View Full Brief (${b.claims.length}) →`;
        btn.addEventListener('click', () => this.openFull(b));
        footer.appendChild(btn);

        el.appendChild(footer);
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
        sum.textContent = b.summary;          // the long summary lives here, not on the card
        body.appendChild(sum);

        if (b.no_playable_claims) {
            const none = document.createElement('p');
            none.className = 'briefings-live-noclaims';
            none.textContent = 'No playable claims. Every quote this episode produced failed '
                             + 'the verbatim or timestamp check, so none is shown rather than '
                             + 'shipping a Play clip that lands on the wrong audio.';
            body.appendChild(none);
        }

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
