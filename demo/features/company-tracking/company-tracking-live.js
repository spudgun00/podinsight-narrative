/**
 * Company Tracking v1 — a watchlist over the filtered entity index.
 *
 * GET /api/companies/search, /api/companies/{name}, /api/companies/mentions.
 *
 * What the mock had and this does not: mention counts, a sentiment breakdown,
 * a "last insight" line and a status ring, all fabricated per company by
 * _generateMockCompanyData in main.js; and a badge that cycled 1 -> 2 -> 3
 * every five minutes as "new mentions". Nothing in the corpus produced any of
 * it, and nothing can produce "new" at all: the corpus is six fixed months
 * ending 23 June 2025, so there is no alerting here and will not be until
 * forward ingestion exists.
 *
 * What replaces them, for each company: the number of episodes that name it and
 * the total number of times they do, over Jan-Jun 2025. Counts only. The one
 * percentage this surface could show - a share of episodes - is the unstable
 * kind the project's volume floor exists to suppress, and most watchlist
 * companies sit at the low end where it is least trustworthy, so none is shown.
 *
 * Names come from the same curated index the entity list uses, so a user picks
 * a canonical spelling or nothing. Free text would let a watchlist fill up with
 * spellings the corpus never uses, each reporting zero forever.
 */
const CompanyTrackingLive = {

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
    KEY: 'synthea.watchlist.v1',
    companies: [],          // [{name, episode_count, total_mentions, podcast_count}]
    view: 'list',           // list | company
    current: null,

    async init() {
        this.loadRangeLabel();
        if (window.SyntheaData && window.SyntheaData.isVision()) return;
        const panel = document.querySelector('.portfolio-panel');
        if (!panel) return;
        this.panel = panel;
        this.content = panel.querySelector('.panel-content');
        if (!this.content) return;
        window.SyntheaData.claim('company-tracking', panel);

        this.companies = this.load();
        this.renderShell();
        this.bindPanel();
        await this.refreshAll();
        window.SyntheaData.mark('company-tracking',
            this.companies.length ? 'live' : 'empty',
            this.companies.length ? 'localStorage watchlist + /api/companies' : 'no companies configured');
    },

    // ------------------------------------------------------------- storage

    load() {
        try {
            const raw = localStorage.getItem(this.KEY);
            const v = raw ? JSON.parse(raw) : [];
            return Array.isArray(v) ? v.filter(c => c && c.name) : [];
        } catch (e) { return []; }
    },

    save() {
        try { localStorage.setItem(this.KEY, JSON.stringify(this.companies)); }
        catch (e) { /* private mode; the list simply does not survive the reload */ }
    },

    // --------------------------------------------------------------- shell

    renderShell() {
        this.content.innerHTML = `
            <div class="ctl">
                <div class="ctl-metrics" id="ctl-metrics"></div>
                <div class="ctl-add">
                    <label class="ctl-add-label" for="ctl-input">Add a company</label>
                    <div class="ctl-add-row">
                        <input id="ctl-input" class="ctl-input" type="text" autocomplete="off"
                               placeholder="Start typing a company name"
                               aria-describedby="ctl-add-help" role="combobox"
                               aria-expanded="false" aria-controls="ctl-suggest">
                        <button type="button" class="ctl-add-btn" disabled>Add</button>
                    </div>
                    <div class="ctl-suggest" id="ctl-suggest" role="listbox" hidden></div>
                    <p class="ctl-add-help" id="ctl-add-help"></p>
                </div>
                <div class="ctl-body" id="ctl-body"></div>
                <p class="ctl-note" id="ctl-note"></p>
            </div>`;
        this.input = this.content.querySelector('.ctl-input');
        this.addBtn = this.content.querySelector('.ctl-add-btn');
        this.suggestEl = this.content.querySelector('.ctl-suggest');
        this.helpEl = this.content.querySelector('.ctl-add-help');
        this.bodyEl = this.content.querySelector('#ctl-body');
        this.metricsEl = this.content.querySelector('#ctl-metrics');
        this.noteEl = this.content.querySelector('#ctl-note');
        this.bindAdd();
    },

    /**
     * Open and close, which PortfolioManager used to own.
     *
     * That class is now Vision-only, so nothing else wires the Company
     * Tracking button in Live. The open/close mechanics are its - the same
     * data-state, the same backdrop and body class - so the panel animates
     * exactly as it did; what is gone is the mock's badge, its "mark mentions
     * as viewed" timer and the invented counts it rendered on the way in.
     */
    bindPanel() {
        this.backdrop = document.querySelector('.portfolio-backdrop');
        const btn = document.querySelector('.portfolio-button');
        if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); this.toggle(); });
        const close = this.panel.querySelector('.close-button');
        if (close) close.addEventListener('click', () => this.close());
        if (this.backdrop) this.backdrop.addEventListener('click', () => this.close());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.getAttribute('data-state') === 'open') this.close();
        });

        // The badge and the pulse were the mock's "new mentions" indicator.
        // Nothing is new in a corpus that ends 23 June 2025, so they do not
        // render at all rather than render a zero.
        //
        // The panel footer's "Import companies from CSV or CRM" goes with them.
        // Its only handler is PortfolioManager.initializeScaffold, which is now
        // Vision-only, so in Live it is an <a href="#"> nothing listens to. It
        // sits outside .panel-content, which is why rebuilding the panel body
        // left it behind - the same way a retired mock survives when only its
        // slot is replaced. Vision still has both the link and its dialog.
        ['.notification-badge', '.pulse-indicator',
         '.portfolio-panel .panel-footer'].forEach(sel => {
            const el = document.querySelector(sel);
            if (el && el.parentNode) el.parentNode.removeChild(el);
        });
    },

    toggle() {
        if (this.panel.getAttribute('data-state') === 'open') this.close();
        else this.open();
    },

    open() {
        this.panel.setAttribute('data-state', 'open');
        document.body.classList.add('portfolio-open');
        if (this.backdrop) {
            this.backdrop.style.display = 'block';
            setTimeout(() => this.backdrop.classList.add('active'), 10);
        }
        this.render();
        if (this.input) this.input.focus();
    },

    close() {
        this.panel.setAttribute('data-state', 'closed');
        document.body.classList.remove('portfolio-open');
        if (this.backdrop) {
            this.backdrop.classList.remove('active');
            setTimeout(() => { this.backdrop.style.display = 'none'; }, 300);
        }
        // Returning to the panel shows the list, not whichever company happened
        // to be open when it was closed.
        this.view = 'list';
        this.current = null;
        this.hideSuggest();
        this.render();
    },

    // ------------------------------------------------------------ typeahead

    bindAdd() {
        let seq = 0;
        const run = async () => {
            const q = this.input.value.trim();
            this.chosen = null;
            this.addBtn.disabled = true;
            if (q.length < 2) { this.hideSuggest(); this.help(''); return; }
            const mine = ++seq;
            let data;
            try {
                data = await window.SyntheaData.fetchJSON(
                    'company-tracking', '/api/companies/search?limit=8&q=' + encodeURIComponent(q));
            } catch (err) { this.hideSuggest(); this.help('Could not reach the company index.'); return; }
            if (mine !== seq) return;                     // a later keystroke won
            this.versions = data;
            this.renderNote();
            if (!data.matches.length) {
                this.hideSuggest();
                // The stated rule: a name the corpus never uses is not added.
                this.help(`No mentions found in the library for “${q}”.`, 'miss');
                return;
            }
            this.help('');
            this.showSuggest(data.matches);
        };
        let t = null;
        this.input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(run, 180); });
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { this.hideSuggest(); return; }
            if (e.key === 'Enter') {
                e.preventDefault();
                const first = this.suggestEl.querySelector('.ctl-suggest-item');
                if (this.chosen) this.add(this.chosen);
                else if (first) first.click();
            }
        });
        this.addBtn.addEventListener('click', () => { if (this.chosen) this.add(this.chosen); });
    },

    showSuggest(matches) {
        this.suggestEl.innerHTML = '';
        matches.forEach(m => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'ctl-suggest-item';
            b.setAttribute('role', 'option');
            const already = this.companies.some(c => c.name === m.name);
            const n = document.createElement('span');
            n.className = 'ctl-suggest-name';
            n.textContent = m.name;
            b.appendChild(n);
            const c = document.createElement('span');
            c.className = 'ctl-suggest-count';
            c.textContent = already
                ? 'already tracked'
                : `${m.episode_count.toLocaleString()} ${m.episode_count === 1 ? 'episode' : 'episodes'}`;
            b.appendChild(c);
            if (already) b.classList.add('is-tracked');
            b.addEventListener('click', () => {
                if (already) { this.help(`${m.name} is already on the watchlist.`); return; }
                this.chosen = m;
                this.input.value = m.name;
                this.addBtn.disabled = false;
                this.hideSuggest();
                this.add(m);
            });
            this.suggestEl.appendChild(b);
        });
        this.suggestEl.hidden = false;
        this.input.setAttribute('aria-expanded', 'true');
    },

    hideSuggest() {
        this.suggestEl.hidden = true;
        this.suggestEl.innerHTML = '';
        this.input.setAttribute('aria-expanded', 'false');
    },

    help(text, kind) {
        this.helpEl.textContent = text || '';
        this.helpEl.className = 'ctl-add-help' + (kind ? ' is-' + kind : '');
    },

    // ----------------------------------------------------------- watchlist

    async add(match) {
        if (this.companies.some(c => c.name === match.name)) return;
        this.companies.push({
            name: match.name,
            episode_count: match.episode_count,
            total_mentions: match.occurrences,
            podcast_count: match.podcast_count
        });
        this.save();
        this.input.value = '';
        this.chosen = null;
        this.addBtn.disabled = true;
        this.help(`${match.name} added.`, 'ok');
        this.render();
        await this.refresh(match.name);
        document.dispatchEvent(new CustomEvent('synthea:watchlist'));
    },

    remove(name) {
        this.companies = this.companies.filter(c => c.name !== name);
        this.save();
        if (this.current && this.current.name === name) { this.view = 'list'; this.current = null; }
        this.help(`${name} removed.`, 'ok');
        this.render();
        document.dispatchEvent(new CustomEvent('synthea:watchlist'));
    },

    names() { return this.companies.map(c => c.name); },

    /** Totals come from the API, never from what was stored at add time. */
    async refresh(name) {
        try {
            const d = await window.SyntheaData.fetchJSON(
                'company-tracking', '/api/companies/' + encodeURIComponent(name));
            const c = this.companies.find(x => x.name === name);
            if (c) {
                c.episode_count = d.episode_count;
                c.total_mentions = d.total_mentions;
                c.podcast_count = d.podcast_count;
                this.save();
            }
            this.versions = this.versions || d;
        } catch (err) { /* leave the stored numbers; the row says nothing new */ }
        this.render();
    },

    async refreshAll() {
        for (const c of this.companies.slice()) await this.refresh(c.name);
        this.render();
    },

    // -------------------------------------------------------------- render

    render() {
        if (!this.bodyEl) return;
        this.renderMetrics();
        this.renderNote();
        if (this.view === 'company' && this.current) this.renderCompany();
        else this.renderList();
    },

    renderMetrics() {
        const n = this.companies.length;
        const mentions = this.companies.reduce((a, c) => a + (c.total_mentions || 0), 0);
        const eps = this.companies.reduce((a, c) => a + (c.episode_count || 0), 0);
        this.metricsEl.innerHTML = '';
        const line = document.createElement('span');
        line.className = 'ctl-metrics-text';
        line.textContent = n
            ? `Tracking ${n} ${n === 1 ? 'company' : 'companies'} · `
              + `${mentions.toLocaleString()} ${mentions === 1 ? 'mention' : 'mentions'} across `
              + `${eps.toLocaleString()} ${eps === 1 ? 'episode' : 'episodes'}`
              + (this.rangeLabel ? `, ${this.rangeLabel}` : '')
            : 'No companies configured';
        this.metricsEl.appendChild(line);
        // Persistence is stated, not assumed - v1 keeps the list in this
        // browser only, and a user should know that before building one.
        const save = document.createElement('span');
        save.className = 'ctl-metrics-save';
        save.textContent = 'Saved in this browser';
        save.title = 'This watchlist is stored in this browser’s local storage only. '
                   + 'It is not saved to an account, and it will not follow you to another '
                   + 'browser, another device, or a private window.';
        this.metricsEl.appendChild(save);
        // The episode total double-counts an episode naming two watchlist
        // companies. Say so rather than let it be read as distinct episodes.
        if (n > 1) line.title = 'Episode and mention totals are summed per company, so an '
                              + 'episode naming two watchlist companies counts in both.';
    },

    renderNote() {
        const v = this.versions;
        this.noteEl.textContent = v && v.extraction_note ? v.extraction_note : '';
        if (v && v.filter_version != null) {
            this.noteEl.title = `Entity filter v${v.filter_version}, stoplist v${v.stoplist_version}, `
                              + `alias table v${v.alias_version}.`;
        }
    },

    renderList() {
        this.bodyEl.innerHTML = '';
        if (!this.companies.length) {
            const e = document.createElement('div');
            e.className = 'ctl-empty';
            e.innerHTML = '<p class="ctl-empty-title">No companies configured</p>'
                        + '<p class="ctl-empty-body">Add a company above to see which episodes '
                        + 'name it, and how often.</p>';
            this.bodyEl.appendChild(e);
            return;
        }
        const head = document.createElement('div');
        head.className = 'ctl-list-head';
        head.textContent = 'WATCHLIST';
        this.bodyEl.appendChild(head);

        this.companies.forEach(c => {
            const row = document.createElement('div');
            row.className = 'ctl-card';

            const open = document.createElement('button');
            open.type = 'button';
            open.className = 'ctl-card-open';
            open.setAttribute('aria-label', `Show the episodes that mention ${c.name}`);
            const nm = document.createElement('span');
            nm.className = 'ctl-card-name';
            nm.textContent = c.name;
            open.appendChild(nm);
            const met = document.createElement('span');
            met.className = 'ctl-card-metrics';
            met.textContent = `${(c.episode_count || 0).toLocaleString()} `
                            + `${c.episode_count === 1 ? 'episode' : 'episodes'} · `
                            + `${(c.total_mentions || 0).toLocaleString()} `
                            + `${c.total_mentions === 1 ? 'mention' : 'mentions'}`;
            // The corpus total is fetched, not baked in: it changed on 28 Aug 2026.
            met.title = `Named in ${c.episode_count} episodes, across `
                      + `${c.podcast_count || 0} podcasts, ${c.total_mentions} times in total.`;
            window.SyntheaData.corpus().then(f => {
                if (!f || !f.episodes) return;
                met.title = `Named in ${c.episode_count} of `
                          + `${f.episodes.toLocaleString()} episodes, across `
                          + `${c.podcast_count || 0} podcasts, ${c.total_mentions} times in total.`;
            });
            open.appendChild(met);
            open.addEventListener('click', () => this.openCompany(c.name));
            row.appendChild(open);

            const rm = document.createElement('button');
            rm.type = 'button';
            rm.className = 'ctl-card-remove';
            rm.setAttribute('aria-label', `Remove ${c.name} from the watchlist`);
            rm.textContent = '×';
            rm.addEventListener('click', (e) => { e.stopPropagation(); this.remove(c.name); });
            row.appendChild(rm);

            this.bodyEl.appendChild(row);
        });
    },

    // ------------------------------------------------------- company view

    async openCompany(name) {
        this.view = 'company';
        this.current = { name: name, loading: true };
        this.render();
        try {
            this.current = await window.SyntheaData.fetchJSON(
                'company-tracking', '/api/companies/' + encodeURIComponent(name) + '?limit=1000');
            this.versions = this.current;
        } catch (err) {
            this.current = { name: name, error: true };
        }
        this.render();
    },

    renderCompany() {
        const c = this.current;
        this.bodyEl.innerHTML = '';

        const back = document.createElement('button');
        back.type = 'button';
        back.className = 'ctl-back';
        back.textContent = '← Watchlist';
        back.addEventListener('click', () => { this.view = 'list'; this.current = null; this.render(); });
        this.bodyEl.appendChild(back);

        const h = document.createElement('h3');
        h.className = 'ctl-co-name';
        h.textContent = c.name;
        this.bodyEl.appendChild(h);

        if (c.loading) {
            const l = document.createElement('p');
            l.className = 'ctl-co-status';
            l.textContent = 'Loading episodes…';
            this.bodyEl.appendChild(l);
            return;
        }
        if (c.error) {
            const l = document.createElement('p');
            l.className = 'ctl-co-status';
            l.textContent = 'Could not load the episodes for this company.';
            this.bodyEl.appendChild(l);
            const retry = document.createElement('button');
            retry.type = 'button';
            retry.className = 'ctl-retry';
            retry.textContent = 'Try again';
            retry.addEventListener('click', () => this.openCompany(c.name));
            this.bodyEl.appendChild(retry);
            return;
        }

        const sub = document.createElement('p');
        sub.className = 'ctl-co-sub';
        sub.textContent = `${c.episode_count.toLocaleString()} `
                        + `${c.episode_count === 1 ? 'episode' : 'episodes'} · `
                        + `${c.total_mentions.toLocaleString()} `
                        + `${c.total_mentions === 1 ? 'mention' : 'mentions'} · `
                        + `${c.podcast_count} ${c.podcast_count === 1 ? 'podcast' : 'podcasts'}`;
        this.bodyEl.appendChild(sub);

        const order = document.createElement('p');
        order.className = 'ctl-co-order';
        order.textContent = 'Most mentions first.';
        this.bodyEl.appendChild(order);

        if (c.truncated) {
            const t = document.createElement('p');
            t.className = 'ctl-co-order';
            t.textContent = `Showing the first ${c.episodes.length.toLocaleString()} of `
                          + `${c.episode_count.toLocaleString()}.`;
            this.bodyEl.appendChild(t);
        }

        const list = document.createElement('div');
        list.className = 'ctl-eps';
        c.episodes.forEach(e => list.appendChild(this.episodeRow(e)));
        this.bodyEl.appendChild(list);
    },

    /** The drilldown's row grammar: date, podcast, count, opens the brief. */
    episodeRow(e) {
        const row = document.createElement('div');
        row.className = 'ctl-ep';

        const d = document.createElement('span');
        d.className = 'ctl-ep-date';
        d.textContent = this.dateLabel(e.published_at);
        row.appendChild(d);

        const mid = document.createElement('span');
        mid.className = 'ctl-ep-mid';
        const pod = document.createElement('span');
        pod.className = 'ctl-ep-pod';
        pod.textContent = e.podcast_name;
        mid.appendChild(pod);
        const t = document.createElement('span');
        t.className = 'ctl-ep-title';
        t.textContent = e.episode_title;
        mid.appendChild(t);
        row.appendChild(mid);

        const n = document.createElement('span');
        n.className = 'ctl-ep-count';
        n.textContent = `${e.mention_count} ×`;
        n.title = `${e.mention_count} mention${e.mention_count === 1 ? '' : 's'} in this episode`;
        row.appendChild(n);

        if (window.BriefingsLive) {
            row.tabIndex = 0;
            row.setAttribute('role', 'button');
            row.classList.add('is-openable');
            row.setAttribute('aria-label', `Open the brief for ${e.episode_title}`);
            const open = () => window.BriefingsLive.openById(e.episode_id);
            row.addEventListener('click', open);
            row.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); open(); }
            });
        }
        return row;
    },

    dateLabel(iso) {
        const d = new Date(iso);
        if (isNaN(d)) return (iso || '').slice(0, 10);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
};

window.CompanyTrackingLive = CompanyTrackingLive;

if (!(window.SyntheaData && window.SyntheaData.isVision())) {
    document.addEventListener('DOMContentLoaded', () => CompanyTrackingLive.init());
}
