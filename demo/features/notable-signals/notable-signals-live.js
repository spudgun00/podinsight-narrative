/**
 * Notable Signals, honest v1.
 *
 * GET /api/signals for two of the four cards; the other two are composed here
 * because their sources already exist and duplicating them would let the same
 * number disagree with itself:
 *
 *   Watchlist Mentions  from CompanyTrackingLive, which owns the watchlist
 *   Notable Figures     GET /api/signals
 *   Topic Movement      GET /api/topic-mentions through SyntheaTrend, the same
 *                       floor and the same colours as Velocity Tracking and the
 *                       Narrative Pulse legend
 *   Library             GET /api/signals
 *
 * What the mock had and this does not: "67 narrative shifts detected, up 24
 * from last week" and five per-card counts that nothing produced; confidence
 * percentages; sentiment counts; four-dot strength meters; and a Market
 * Narratives card. Market Narratives needs topics the corpus discovers for
 * itself rather than the five tracked by hand, which is the parked
 * topic-discovery engine, so that slot does not render at all - an absent card
 * is honest, an empty one invites a reader to wonder what broke.
 *
 * The subtitle is "Jan-Jun 2025". Nothing here is weekly and nothing is new.
 */
const NotableSignalsLive = {
    data: null,

    async init() {
        if (window.SyntheaData && window.SyntheaData.isVision()) return;
        const container = document.getElementById('notable-signals-container');
        if (!container) return;
        this.container = container;
        window.SyntheaData.claim('notable-signals', container);

        container.innerHTML = `
            <section class="notable-signals nsl">
                <div class="section-header nsl-head">
                    <h2 class="section-title">NOTABLE SIGNALS</h2>
                    <span class="section-subtitle nsl-sub">Jan–Jun 2025</span>
                </div>
                <div class="signals-grid nsl-grid"></div>
                <div class="ai-search-callout nsl-callout"></div>
            </section>`;
        this.grid = container.querySelector('.nsl-grid');
        this.grid.innerHTML = '<p class="nsl-status">Loading signals…</p>';
        this.buildCallout();

        try {
            this.data = await window.SyntheaData.fetchJSON('notable-signals', '/api/signals?limit=200');
        } catch (err) {
            this.grid.innerHTML = '';
            const p = document.createElement('p');
            p.className = 'nsl-status';
            p.textContent = 'Could not load signals.';
            this.grid.appendChild(p);
            const retry = document.createElement('button');
            retry.type = 'button'; retry.className = 'nsl-retry'; retry.textContent = 'Try again';
            retry.addEventListener('click', () => this.init());
            this.grid.appendChild(retry);
            return;
        }
        try {
            this.movement = await window.SyntheaData.fetchJSON(
                'notable-signals', '/api/topic-mentions?bucket=month');
        } catch (err) { this.movement = null; }

        this.render();
        // The watchlist card is live against Company Tracking, so it repaints
        // when the watchlist changes rather than going stale until reload.
        document.addEventListener('synthea:watchlist', () => this.render());
    },

    buildCallout() {
        const c = this.container.querySelector('.nsl-callout');
        c.innerHTML = '';
        const q = document.createElement('span');
        q.textContent = 'Have a specific question about these episodes?';
        c.appendChild(q);
        // The Vision pointer was decoration. Wire it to the real search panel,
        // or do not render it: a control that cannot do its job does not render.
        const opensSearch = !!(window.SyntheaSearch || document.querySelector('.search-input'));
        if (!opensSearch) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ai-search-pointer nsl-ask';
        btn.textContent = 'Ask our AI →';
        btn.addEventListener('click', () => this.openSearch());
        c.appendChild(btn);
    },

    /** Focus and open the real search panel, the same one ⌘K opens. */
    openSearch() {
        const input = document.querySelector('.search-input');
        if (!input) return;
        input.focus();
        input.click();
        input.dispatchEvent(new Event('focus', { bubbles: true }));
        input.scrollIntoView({ block: 'center', behavior: 'smooth' });
    },

    render() {
        this.grid.innerHTML = '';
        this.grid.appendChild(this.watchlistCard());
        this.grid.appendChild(this.figuresCard());
        this.grid.appendChild(this.movementCard());
        this.grid.appendChild(this.libraryCard());
    },

    card(title, {big, label, note, onClick, ariaLabel}) {
        const el = document.createElement(onClick ? 'button' : 'div');
        if (onClick) { el.type = 'button'; el.addEventListener('click', onClick); }
        el.className = 'signal-card nsl-card' + (onClick ? ' is-openable' : '');
        if (ariaLabel) el.setAttribute('aria-label', ariaLabel);
        const t = document.createElement('div');
        t.className = 'nsl-card-title';
        t.textContent = title;
        el.appendChild(t);
        if (big != null) {
            const b = document.createElement('div');
            b.className = 'signal-count nsl-card-value';
            b.textContent = big;
            el.appendChild(b);
        }
        if (label) {
            const l = document.createElement('div');
            l.className = 'signal-label nsl-card-label';
            l.textContent = label;
            el.appendChild(l);
        }
        if (note) {
            const n = document.createElement('div');
            n.className = 'nsl-card-note';
            n.textContent = note;
            el.appendChild(n);
        }
        return el;
    },

    // ------------------------------------------------------------ the cards

    watchlistCard() {
        const ct = window.CompanyTrackingLive;
        const names = ct ? ct.names() : [];
        if (!names.length) {
            const c = this.card('Watchlist Mentions', {
                label: 'No companies configured',
                note: 'Add companies in Company Tracking to see how often the library names them.'
            });
            c.classList.add('nsl-card--empty');
            return c;
        }
        const eps = ct.companies.reduce((a, x) => a + (x.episode_count || 0), 0);
        const mentions = ct.companies.reduce((a, x) => a + (x.total_mentions || 0), 0);
        const c = this.card('Watchlist Mentions', {
            big: mentions.toLocaleString(),
            label: `${mentions === 1 ? 'mention' : 'mentions'} across `
                 + `${eps.toLocaleString()} ${eps === 1 ? 'episode' : 'episodes'}`,
            note: `${names.length} ${names.length === 1 ? 'company' : 'companies'}: `
                 + names.slice(0, 4).join(', ') + (names.length > 4 ? '…' : ''),
            ariaLabel: 'Open Company Tracking',
            onClick: () => { if (ct.open) ct.open(); }
        });
        c.title = 'Summed per company, so an episode naming two watchlist '
                + 'companies counts in both.';
        return c;
    },

    figuresCard() {
        const d = this.data;
        return this.card('Notable Figures', {
            big: d.figures_count.toLocaleString(),
            label: 'claims citing $1bn or more',
            note: d.figures_rule,
            ariaLabel: 'Show the claims citing a figure of $1bn or more',
            onClick: () => this.openFigures()
        });
    },

    movementCard() {
        const T = window.SyntheaTrend;
        const topics = (this.movement && this.movement.topics) || [];
        if (!T || !topics.length) {
            return this.card('Topic Movement', { label: 'Movement unavailable' });
        }
        // The shared formatter decides what may be printed. A topic under the
        // floor reports its volume, never a percentage.
        const rows = topics.map(t => ({ name: t.topic, fmt: T.format(t),
                                        total: t.total_mentions || 0 }));
        const printable = rows.filter(r => !r.fmt.suppressed && r.fmt.dir !== 'none');
        const suppressed = rows.length - printable.length;
        const c = this.card('Topic Movement', {
            label: printable.length
                ? `${printable.length} of ${rows.length} tracked topics move enough to report`
                : 'No tracked topic clears the floor'
        });
        const list = document.createElement('div');
        list.className = 'nsl-move';
        rows.forEach(r => {
            const row = document.createElement('div');
            row.className = 'nsl-move-row';
            const n = document.createElement('span');
            n.className = 'nsl-move-name';
            n.textContent = r.name;
            row.appendChild(n);
            const v = document.createElement('span');
            v.className = 'nsl-move-value';
            // fmt.text is the shared formatter's own wording - "low volume",
            // "N mentions", or the percentage. Re-deriving it here is how the
            // same topic ends up reading "low volume" on one surface and
            // "no data" on another, which is the drift trend.js exists to stop.
            // The one addition is Velocity Tracking's zero case, which it also
            // handles before calling the formatter.
            v.textContent = (r.total === 0) ? 'no mentions' : r.fmt.text;
            v.style.color = r.fmt.colour;
            v.title = r.fmt.title || '';
            row.appendChild(v);
            list.appendChild(row);
        });
        c.appendChild(list);
        if (suppressed) {
            const n = document.createElement('div');
            n.className = 'nsl-card-note';
            n.textContent = `${suppressed} of ${rows.length} are below the `
                + `${window.SyntheaTrend.MIN_BASELINE_MENTIONS}-mention floor, so their `
                + `volume is shown instead of a percentage.`;
            c.appendChild(n);
        }
        return c;
    },

    libraryCard() {
        const d = this.data;
        const c = this.card('Library', {
            big: d.episodes.toLocaleString(),
            label: 'episodes'
        });
        const list = document.createElement('div');
        list.className = 'nsl-move';
        [[d.hours.toLocaleString(), 'hours'],
         [d.verified_claims.toLocaleString(), 'verified claims'],
         [d.podcasts.toLocaleString(), 'podcasts']].forEach(([v, l]) => {
            const row = document.createElement('div');
            row.className = 'nsl-move-row';
            const n = document.createElement('span');
            n.className = 'nsl-move-name'; n.textContent = l;
            row.appendChild(n);
            const s = document.createElement('span');
            s.className = 'nsl-move-value'; s.textContent = v;
            row.appendChild(s);
            list.appendChild(row);
        });
        c.appendChild(list);
        return c;
    },

    // --------------------------------------------------------- figures list

    openFigures() {
        this.buildPanel();
        this.panel.setAttribute('data-state', 'open');
        this.backdrop.setAttribute('data-state', 'open');
        const body = this.panel.querySelector('.nsl-panel-body');
        body.innerHTML = '';
        const rule = document.createElement('p');
        rule.className = 'nsl-panel-rule';
        rule.textContent = this.data.figures_rule;
        body.appendChild(rule);
        const count = document.createElement('p');
        count.className = 'nsl-panel-count';
        count.textContent = `${this.data.figures_count.toLocaleString()} claims. `
            + `Showing ${Math.min(this.data.figures.length, this.data.figures_count).toLocaleString()}, `
            + `largest figure first.`;
        body.appendChild(count);
        this.data.figures.forEach(f => body.appendChild(this.figureRow(f)));
    },

    figureRow(f) {
        const row = document.createElement('div');
        row.className = 'nsl-fig';

        const head = document.createElement('div');
        head.className = 'nsl-fig-head';
        const amt = document.createElement('span');
        amt.className = 'nsl-fig-amount';
        amt.textContent = f.figure;
        head.appendChild(amt);
        const src = document.createElement('span');
        src.className = 'nsl-fig-src';
        src.textContent = `${f.podcast_name} · ${f.published_at}`;
        head.appendChild(src);
        row.appendChild(head);

        const claim = document.createElement('div');
        claim.className = 'nsl-fig-claim';
        claim.textContent = f.claim;
        row.appendChild(claim);

        const q = document.createElement('blockquote');
        q.className = 'nsl-fig-quote';
        q.textContent = '“' + f.quote + '”';
        row.appendChild(q);

        const foot = document.createElement('div');
        foot.className = 'nsl-fig-foot';
        if (f.timestamp) {
            const ts = document.createElement('span');
            ts.className = 'nsl-fig-ts'; ts.textContent = f.timestamp;
            foot.appendChild(ts);
        }
        if (f.located && f.start_seconds != null) {
            const play = document.createElement('button');
            play.type = 'button'; play.className = 'nsl-fig-play'; play.textContent = '▶ Play';
            play.addEventListener('click', () => this.playClip(f.episode_id, f.start_seconds, play));
            foot.appendChild(play);
        }
        if (window.BriefingsLive) {
            const open = document.createElement('button');
            open.type = 'button'; open.className = 'nsl-fig-open'; open.textContent = 'Full brief';
            open.addEventListener('click', () => window.BriefingsLive.openById(f.episode_id));
            foot.appendChild(open);
        }
        row.appendChild(foot);
        return row;
    },

    buildPanel() {
        if (this.panel) return;
        this.panel = document.createElement('div');
        this.panel.className = 'nsl-panel';
        this.panel.setAttribute('data-state', 'closed');
        this.panel.setAttribute('role', 'dialog');
        this.panel.setAttribute('aria-modal', 'true');
        this.panel.setAttribute('aria-label', 'Claims citing a figure of $1bn or more');
        this.panel.innerHTML = `
            <div class="nsl-panel-head">
                <h3>Notable Figures</h3>
                <button type="button" class="nsl-panel-close" aria-label="Close">✕</button>
            </div>
            <div class="nsl-panel-body"></div>`;
        document.body.appendChild(this.panel);
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'nsl-backdrop';
        this.backdrop.setAttribute('data-state', 'closed');
        document.body.appendChild(this.backdrop);
        const close = () => this.closeFigures();
        this.panel.querySelector('.nsl-panel-close').addEventListener('click', close);
        this.backdrop.addEventListener('click', close);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.getAttribute('data-state') === 'open') close();
        });
    },

    closeFigures() {
        this.panel.setAttribute('data-state', 'closed');
        this.backdrop.setAttribute('data-state', 'closed');
        if (this.audio) this.audio.pause();
    },

    async playClip(episodeId, startSeconds, btn) {
        const original = btn.textContent;
        btn.textContent = 'Loading…'; btn.disabled = true;
        try {
            const base = window.SYNTHEA_API_BASE || 'http://localhost:8000';
            const ms = Math.max(0, Math.round(startSeconds * 1000));
            const r = await window.SyntheaData.fetchResponse('audio-clips',
                `${base}/api/v1/audio_clips/${encodeURIComponent(episodeId)}`
                + `?start_time_ms=${ms}&duration_ms=30000`);
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
    }
};

window.NotableSignalsLive = NotableSignalsLive;

if (!(window.SyntheaData && window.SyntheaData.isVision())) {
    document.addEventListener('DOMContentLoaded', () => NotableSignalsLive.init());
}
