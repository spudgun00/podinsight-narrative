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

    /** The corpus's real period, from the index. Null until it arrives, and a
     *  surface shows no range rather than a stale one. */
    rangeLabel: null,

    loadRangeLabel() {
        return window.SyntheaData.corpus().then(f => {
            if (!f || !f.rangeLabel) return;
            this.rangeLabel = f.rangeLabel;
            try { this.render(); } catch (e) { /* not rendered yet; it will pick it up */ }
        });
    },
    data: null,

    async init() {
        this.loadRangeLabel();
        if (window.SyntheaData && window.SyntheaData.isVision()) return;
        const container = document.getElementById('notable-signals-container');
        if (!container) return;
        this.container = container;
        window.SyntheaData.claim('notable-signals', container);

        container.innerHTML = `
            <section class="notable-signals nsl">
                <div class="section-header nsl-head">
                    <h2 class="section-title">NOTABLE SIGNALS</h2>
                    <span class="section-subtitle nsl-sub" data-corpus-range></span>
                </div>
                <div class="signals-grid nsl-grid"></div>
                <div class="ai-search-callout nsl-callout"></div>
            </section>`;
        this.grid = container.querySelector('.nsl-grid');
        this.grid.innerHTML = '<p class="nsl-status">Loading signals…</p>';
        this.buildCallout();

        // All three reads are independent, so they go out together. Chained,
        // they made this component the last thing on the page to settle.
        const signalsReq = window.SyntheaData
            .fetchJSON('notable-signals', '/api/signals?limit=200');
        const movementReq = window.SyntheaData
            .fetchJSON('notable-signals', '/api/topic-mentions?bucket=month')
            .catch(() => null);
        const narrativesReq = window.SyntheaData
            .fetchJSON('notable-signals', '/api/narratives?limit=12')
            .catch(() => null);

        try {
            this.data = await signalsReq;
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
        this.movement = await movementReq;
        // Market Narratives. The slot stayed absent until the discovery engine
        // existed; it exists now, so the card renders - and if the endpoint is
        // not there, the slot goes back to being absent rather than empty.
        this.narratives = await narrativesReq;

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
        const nar = this.narrativesCard();
        if (nar) this.grid.appendChild(nar);
        this.grid.appendChild(this.watchlistCard());
        this.grid.appendChild(this.figuresCard());
        this.grid.appendChild(this.movementCard());
        this.grid.appendChild(this.libraryCard());
    },

    /**
     * A card. Finding 3, 2 Sep 2026: the FACE carries a title, one number and
     * one line of context, and nothing else - the vision mock's grammar.
     *
     * Everything that used to sit on the face - methodology sentences, floor
     * explanations, the little row lists - moves behind a per-card info
     * affordance, **word for word**. Nothing is summarised away and nothing is
     * dropped; it is one click down instead of in the way.
     *
     * Permanently banned from a face, whatever a future card wants to say:
     * confidence percentages, sentiment, and any figure with no machinery
     * behind it. The mock had all three. The layout was right and the numbers
     * were fiction, and only the layout is being adopted.
     */
    card(title, {big, label, note, detail, onClick, ariaLabel}) {
        const el = document.createElement('div');
        el.className = 'signal-card nsl-card' + (onClick ? ' is-openable' : '');

        const head = document.createElement('div');
        head.className = 'nsl-card-head';
        const t = document.createElement('div');
        t.className = 'nsl-card-title';
        t.textContent = title;
        head.appendChild(t);

        // The disclosure. Only rendered when there is something to disclose -
        // an icon that looks clickable and does nothing is a dead control.
        const disclosures = [].concat(note || [], detail || []).filter(Boolean);
        if (disclosures.length) {
            const info = document.createElement('button');
            info.type = 'button';
            info.className = 'nsl-info';
            info.textContent = 'i';
            info.setAttribute('aria-label', `How ${title} is calculated`);
            info.setAttribute('aria-expanded', 'false');
            const pop = document.createElement('div');
            pop.className = 'nsl-pop';
            pop.hidden = true;
            disclosures.forEach(d => {
                if (typeof d === 'string') {
                    const q = document.createElement('p');
                    q.className = 'nsl-pop-note';
                    q.textContent = d;               // word for word
                    pop.appendChild(q);
                } else {
                    pop.appendChild(d);
                }
            });
            info.addEventListener('click', (e) => {
                e.stopPropagation();
                const open = pop.hidden;
                document.querySelectorAll('.nsl-pop').forEach(x => { x.hidden = true; });
                document.querySelectorAll('.nsl-info').forEach(x => x.setAttribute('aria-expanded', 'false'));
                pop.hidden = !open;
                info.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            head.appendChild(info);
            el._pop = pop;
        }
        el.appendChild(head);

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
        if (el._pop) el.appendChild(el._pop);

        // The whole card opens, and it carries no extra label to say so - a
        // button captioned "Show the claims citing a figure of $1bn or more"
        // is a fourth thing on a face the ruling limits to three. The card is a
        // div with a button role rather than a <button>, because the info
        // affordance is itself a button and a button inside a button is invalid
        // markup that makes the inner one unclickable.
        if (onClick) {
            el.setAttribute('role', 'button');
            el.tabIndex = 0;
            el.setAttribute('aria-label', ariaLabel || `Open ${title}`);
            const go = (e) => {
                if (e.target.closest('.nsl-info, .nsl-pop')) return;   // disclosure, not open
                onClick(e);
            };
            el.addEventListener('click', go);
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); }
            });
        }
        return el;
    },

    /** A detail list for the popover, built from the rows a face used to show. */
    detailList(rows) {
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
            v.textContent = r.value;
            if (r.colour) v.style.color = r.colour;
            if (r.title) v.title = r.title;
            row.appendChild(v);
            list.appendChild(row);
        });
        return list;
    },

    // ------------------------------------------------------------ the cards

    watchlistCard() {
        const ct = window.CompanyTrackingLive;
        const names = ct ? ct.names() : [];
        if (!names.length) {
            // The empty card keeps its one-line add prompt ON the face: it is
            // the only instruction that makes the card actionable, and hiding
            // it behind an affordance would leave a card that says nothing.
            const c = this.card('Watchlist Mentions', {
                label: 'Add companies in Company Tracking to see how often the library names them.'
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
            note: [`${names.length} ${names.length === 1 ? 'company' : 'companies'}: `
                   + names.slice(0, 4).join(', ') + (names.length > 4 ? '…' : ''),
                   'Summed per company, so an episode naming two watchlist '
                   + 'companies counts in both.'],
            ariaLabel: 'Open Company Tracking',
            onClick: () => { if (ct.open) ct.open(); }
        });
        return c;
    },

    /**
     * Market Narratives. Absent until the discovery engine existed; present now.
     *
     * Ranked by BREADTH - distinct podcasts, then episodes - not by volume,
     * because the engine's own second rule is that a cluster one show talks
     * about constantly is that show's preoccupation. The number on the card is
     * how many narratives cleared all three rules, out of how many clusters.
     */
    narrativesCard() {
        const d = this.narratives;
        if (!d || !d.narratives || !d.narratives.length) return null;
        const rows = d.narratives.slice(0, 3).map(n => ({
            name: n.topic,
            value: `${n.podcasts} pods`,
            title: `${n.podcasts} distinct podcasts, ${n.episodes.toLocaleString()} episodes, `
                 + `${n.chunks.toLocaleString()} passages`
        }));
        return this.card('Market Narratives', {
            big: d.count.toLocaleString(),
            label: `discovered topics, ${d.excluded_count} clusters excluded`,
            detail: [this.detailList(rows)],
            note: d.ranking,
            ariaLabel: 'Show the discovered market narratives',
            onClick: () => this.openNarratives()
        });
    },

    openNarratives() {
        this.buildNarrativePanel();
        this.npanel.setAttribute('data-state', 'open');
        this.nbackdrop.setAttribute('data-state', 'open');
        this.renderNarrativeList();
    },

    renderNarrativeList() {
        const d = this.narratives;
        const body = this.npanel.querySelector('.drilldown-live-body');
        const sub = this.npanel.querySelector('.drilldown-live-sub');
        this.npanel.querySelector('.drilldown-live-title').textContent = 'Market Narratives';
        sub.textContent = `${d.count} narratives from ${d.count + d.excluded_count} clusters, `
                        + `k=${d.k}.` + (this.rangeLabel ? ` ${this.rangeLabel}.` : '');
        body.innerHTML = '';

        const method = document.createElement('div');
        method.className = 'drilldown-live-summary';
        method.textContent = d.method;
        body.appendChild(method);

        const T = window.SyntheaTrend;
        const list = document.createElement('ol');
        list.className = 'drilldown-live-list';
        d.narratives.forEach(n => {
            const li = document.createElement('li');
            li.className = 'drilldown-live-row';
            li.tabIndex = 0;
            li.setAttribute('role', 'button');
            li.setAttribute('aria-label', `Show the episodes behind ${n.topic}`);

            const count = document.createElement('span');
            count.className = 'drilldown-live-count';
            count.textContent = n.podcasts;
            count.title = `${n.podcasts} distinct podcasts — the breadth this list is ranked by`;
            li.appendChild(count);

            const meta = document.createElement('div');
            meta.className = 'drilldown-live-meta';
            const title = document.createElement('div');
            title.className = 'drilldown-live-episode';
            title.textContent = n.topic;
            meta.appendChild(title);
            const s2 = document.createElement('div');
            s2.className = 'drilldown-live-podcast';
            // The unit is passages, not mentions, and the floor is the shared
            // one - same function, same threshold, same colours as every other
            // trend on the page.
            const fmt = T ? T.format(n, 'passage') : null;
            s2.textContent = `${n.episodes.toLocaleString()} episodes · `
                           + `${n.chunks.toLocaleString()} passages`;
            meta.appendChild(s2);
            li.appendChild(meta);

            if (fmt) {
                const tr = document.createElement('span');
                tr.className = 'nsl-nar-trend';
                tr.textContent = fmt.text;
                tr.style.color = fmt.colour;
                tr.title = fmt.title;
                li.appendChild(tr);
            }

            const open = () => this.openNarrative(n);
            li.addEventListener('click', open);
            li.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
            });
            list.appendChild(li);
        });
        body.appendChild(list);
    },

    /** Topic -> episodes. A row opens that episode's brief. */
    async openNarrative(n) {
        const body = this.npanel.querySelector('.drilldown-live-body');
        this.npanel.querySelector('.drilldown-live-title').textContent = n.topic;
        this.npanel.querySelector('.drilldown-live-sub').textContent =
            `${n.podcasts} podcasts · ${n.episodes.toLocaleString()} episodes · `
            + `${n.chunks.toLocaleString()} passages`;
        body.innerHTML = '<div class="drilldown-live-empty">Loading…</div>';

        const back = document.createElement('button');
        back.type = 'button';
        back.className = 'nsl-nar-back';
        back.textContent = '← All narratives';
        back.addEventListener('click', () => this.renderNarrativeList());

        let d;
        try {
            d = await window.SyntheaData.fetchJSON(
                'notable-signals', '/api/narratives/' + n.cluster_id + '?limit=300');
        } catch (err) {
            body.innerHTML = '';
            body.appendChild(back);
            const e = document.createElement('div');
            e.className = 'drilldown-live-empty';
            e.textContent = 'Could not load the episodes behind this narrative.';
            body.appendChild(e);
            return;
        }
        body.innerHTML = '';
        body.appendChild(back);

        const summary = document.createElement('div');
        summary.className = 'drilldown-live-summary';
        summary.textContent = `${d.chunks.toLocaleString()} passages across `
                            + `${d.episodes.toLocaleString()} episodes. Biggest contributor first.`;
        body.appendChild(summary);

        const list = document.createElement('ol');
        list.className = 'drilldown-live-list';
        d.episodes_listed.forEach(ep => {
            const li = document.createElement('li');
            li.className = 'drilldown-live-row';
            li.tabIndex = 0;
            li.setAttribute('role', 'button');
            li.setAttribute('aria-label', `Open the brief for ${ep.episode_title}`);

            const count = document.createElement('span');
            count.className = 'drilldown-live-count';
            count.textContent = ep.chunk_count;
            count.title = `${ep.chunk_count} passage${ep.chunk_count === 1 ? '' : 's'} `
                        + `from this episode in this narrative`;
            li.appendChild(count);

            const meta = document.createElement('div');
            meta.className = 'drilldown-live-meta';
            const t = document.createElement('div');
            t.className = 'drilldown-live-episode';
            t.textContent = ep.episode_title;
            meta.appendChild(t);
            const sub2 = document.createElement('div');
            sub2.className = 'drilldown-live-podcast';
            sub2.textContent = ep.podcast_name
                + (ep.published_at ? ' · ' + this.dateLabel(ep.published_at) : '');
            meta.appendChild(sub2);
            li.appendChild(meta);

            // Episodes to briefs, the same surface every other list opens.
            if (window.BriefingsLive) {
                const open = () => window.BriefingsLive.openById(ep.episode_id);
                li.addEventListener('click', open);
                li.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
                });
            }
            list.appendChild(li);
        });
        body.appendChild(list);

        if (d.truncated) {
            const more = document.createElement('div');
            more.className = 'drilldown-live-empty';
            more.textContent = `Showing the top ${d.episodes_listed.length} of `
                             + `${d.episodes.toLocaleString()}.`;
            body.appendChild(more);
        }
    },

    dateLabel(iso) {
        const d = new Date(iso);
        if (isNaN(d)) return (iso || '').slice(0, 10);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    },

    buildNarrativePanel() {
        if (this.npanel) return;
        // The existing drilldown's own markup and classes, so this reads as the
        // same surface the Narrative Pulse drilldown does.
        this.npanel = document.createElement('div');
        this.npanel.className = 'drilldown-live nsl-nar-panel';
        this.npanel.setAttribute('data-state', 'closed');
        this.npanel.setAttribute('role', 'dialog');
        this.npanel.setAttribute('aria-modal', 'true');
        this.npanel.innerHTML = `
            <div class="drilldown-live-header">
                <div>
                    <h3 class="drilldown-live-title"></h3>
                    <p class="drilldown-live-sub"></p>
                </div>
                <button type="button" class="drilldown-live-close" aria-label="Close" title="Close">✕</button>
            </div>
            <div class="drilldown-live-body"></div>`;
        document.body.appendChild(this.npanel);
        this.nbackdrop = document.createElement('div');
        this.nbackdrop.className = 'drilldown-live-backdrop';
        this.nbackdrop.setAttribute('data-state', 'closed');
        document.body.appendChild(this.nbackdrop);
        const close = () => {
            this.npanel.setAttribute('data-state', 'closed');
            this.nbackdrop.setAttribute('data-state', 'closed');
        };
        this.npanel.querySelector('.drilldown-live-close').addEventListener('click', close);
        this.nbackdrop.addEventListener('click', close);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.npanel.getAttribute('data-state') === 'open') close();
        });
    },

    figuresCard() {
        const d = this.data;
        return this.card('Notable Figures', {
            big: d.figures_count.toLocaleString(),
            label: 'claims citing $1bn or more',
            note: d.figures_rule,          // word for word, one click down
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

        // fmt.text is the shared formatter's own wording - "low volume",
        // "N mentions", or the percentage. Re-deriving it here is how the same
        // topic ends up reading "low volume" on one surface and "no data" on
        // another, which is the drift trend.js exists to stop. The one addition
        // is Velocity Tracking's zero case, which it also handles before
        // calling the formatter.
        const detail = rows.map(r => ({
            name: r.name,
            value: (r.total === 0) ? 'no mentions' : r.fmt.text,
            colour: r.fmt.colour,
            title: r.fmt.title || ''
        }));

        const notes = [];
        if (suppressed) {
            notes.push(`${suppressed} of ${rows.length} are below the `
                     + `${T.MIN_BASELINE_MENTIONS}-mention floor, so they report volume rather than a `
                     + `percentage. The floor is not loosened inside a window.`);
        }
        return this.card('Topic Movement', {
            big: String(printable.length),
            label: printable.length
                ? `of ${rows.length} tracked topics move enough to report`
                : `of ${rows.length} tracked topics clear the floor`,
            detail: [this.detailList(detail)],
            note: notes
        });
    },

    libraryCard() {
        const d = this.data;
        return this.card('Library', {
            big: d.episodes.toLocaleString(),
            label: 'episodes in this window',
            detail: [this.detailList([
                { name: 'hours', value: d.hours.toLocaleString() },
                { name: 'verified claims', value: d.verified_claims.toLocaleString() },
                { name: 'podcasts', value: d.podcasts.toLocaleString() }
            ])]
        });
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
