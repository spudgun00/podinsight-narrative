/**
 * Narrative Feed, from the brief store.
 *
 * GET /api/feed, pre-generated. Nothing is generated per view.
 *
 * What the mock had and this does not: "2h ago" against a corpus that ends
 * 23 June 2025; a synthesised event line ("consensus forming across 8
 * sources") that nothing counts; a stance pill - CONSENSUS, DIVERGENCE, TREND,
 * LP INTEL, PATTERN - which needs claim matching and stance detection the stack
 * cannot do; and Share and Email links that raised "coming soon" alerts.
 *
 * What replaces them is one item per episode, in date order, and a rule the
 * panel states in a sentence so the reader can check it: every episode's brief,
 * newest first. The only numbers on a row are the episode's own - its date and
 * how many quotes its brief carries.
 *
 * A row opens that episode's full brief through BriefingsLive, the same panel
 * Notable Episodes and the episode panel open. One brief surface, not two.
 */
const NarrativeFeedLive = {
    PAGE: 30,

    topic: null,        // null = All
    offset: 0,
    total: 0,
    loading: false,

    async init() {
        if (window.SyntheaData && window.SyntheaData.isVision()) return;

        const container = document.getElementById('narrative-feed-container');
        if (!container) return;
        window.SyntheaData.claim('narrative-feed', container);
        this.container = container;

        // The section chrome is built here rather than fetched from
        // narrative-feed.html: that template is the Vision one, and carries the
        // "Pattern emergence • Last 48 hours" subtitle this component exists to
        // stop printing.
        container.innerHTML = `
            <section class="narrative-feed narrative-feed-live">
                <div class="section-header">
                    <div class="feed-title-group">
                        <h2 class="section-title">NARRATIVE FEED</h2>
                        <span class="section-subtitle nfl-period"></span>
                    </div>
                </div>
                <p class="nfl-rule"></p>
                <div class="nfl-chips" role="group" aria-label="Filter by tracked topic"></div>
                <p class="nfl-status" role="status" aria-live="polite"></p>
                <div class="feed-container nfl-list"></div>
                <div class="nfl-foot"></div>
            </section>`;

        this.list = container.querySelector('.nfl-list');
        this.statusEl = container.querySelector('.nfl-status');
        this.chipsEl = container.querySelector('.nfl-chips');
        this.footEl = container.querySelector('.nfl-foot');

        await this.load({ reset: true });
    },

    // ------------------------------------------------------------- fetching

    path() {
        const p = ['limit=' + this.PAGE, 'offset=' + this.offset];
        if (this.topic) p.push('topic=' + encodeURIComponent(this.topic));
        return '/api/feed?' + p.join('&');
    },

    async load({ reset }) {
        if (this.loading) return;
        this.loading = true;
        if (reset) {
            this.offset = 0;
            this.list.innerHTML = '';
            this.footEl.innerHTML = '';
            this.status('Loading episodes…');
        } else {
            this.setMoreBusy(true);
        }

        let data;
        try {
            data = await window.SyntheaData.fetchJSON('narrative-feed', this.path());
        } catch (err) {
            this.loading = false;
            this.renderError(reset);
            return;
        }

        this.total = data.total;
        // The rule sentence and the chips describe the whole store, not the
        // page, so they are built once and never rebuilt - rebuilding them on
        // a filter click would throw away the focus the click just gave.
        if (!this.chromeBuilt) {
            this.renderRule(data);
            this.renderChips(data);
            this.chromeBuilt = true;
        }
        data.items.forEach(it => this.list.appendChild(this.row(it)));
        this.offset += data.items.length;
        this.loading = false;

        if (!this.offset) { this.renderEmpty(); return; }
        this.status(`Showing ${this.offset.toLocaleString()} of `
                  + `${this.total.toLocaleString()} ${this.total === 1 ? 'episode' : 'episodes'}`
                  + (this.topic ? ` mentioning ${this.topic}.` : '.'));
        this.renderFoot(data.has_more);
    },

    // ------------------------------------------------------------- chrome

    renderRule(data) {
        this.topicCoverage = data.topic_coverage || null;
        this.container.querySelector('.nfl-period').textContent = this.periodLabel(data.period);
        // The panel's own rule, from the endpoint, so the sentence and the sort
        // cannot drift apart.
        this.container.querySelector('.nfl-rule').textContent = data.ordering;
    },

    periodLabel(period) {
        const [a, b] = (period || '').split(' to ');
        if (!a || !b) return '';
        return `${this.dateLabel(a)} – ${this.dateLabel(b)}`;
    },

    dateLabel(iso) {
        const d = new Date(iso);
        if (isNaN(d)) return (iso || '').slice(0, 10);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    },

    renderChips(data) {
        this.chipsEl.innerHTML = '';
        const untagged = data.untagged || 0;
        const chips = [{
            topic: null, label: 'All', count: data.corpus_total,
            title: untagged
                ? `Every brief in the store. ${untagged.toLocaleString()} of them mention `
                  + `none of the five tracked topics, so the topic counts do not sum to this.`
                : 'Every brief in the store.'
        }].concat((data.topics || []).map(t => ({
            topic: t.name, label: t.name, count: t.count,
            title: `${t.count.toLocaleString()} episodes mention ${t.name}.`
        })));

        chips.forEach(c => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'nfl-chip' + (c.topic === this.topic ? ' is-active' : '');
            b.setAttribute('aria-pressed', String(c.topic === this.topic));
            b.title = c.title;
            const label = document.createElement('span');
            label.textContent = c.label;
            b.appendChild(label);
            const n = document.createElement('span');
            n.className = 'nfl-chip-count';
            n.textContent = c.count.toLocaleString();
            b.appendChild(n);
            b.addEventListener('click', () => {
                if (this.loading || c.topic === this.topic) return;
                this.topic = c.topic;
                this.chipsEl.querySelectorAll('.nfl-chip').forEach(x => {
                    x.classList.remove('is-active');
                    x.setAttribute('aria-pressed', 'false');
                });
                b.classList.add('is-active');
                b.setAttribute('aria-pressed', 'true');
                this.load({ reset: true });
            });
            this.chipsEl.appendChild(b);
        });
        this.renderTopicNote();
    },

    /**
     * Tracked-topic tagging reaches only to 23 Jun 2025: the backfill wrote
     * briefs for 3,301 episodes and never tagged them. Inside any window newer
     * than that the chips are all zero, so the panel says why instead of
     * rendering a lone "All" chip and letting the reader assume the topics
     * vanished. Derived from the API's topic_coverage, so it removes itself if
     * tagging ever catches up.
     */
    /** 2025-06-21 -> 21 June 2025. Never used to invent a date, only to format one. */
    dateLabel(iso) {
        const M = ['January','February','March','April','May','June',
                   'July','August','September','October','November','December'];
        const d = new Date(iso + 'T00:00:00Z');
        if (isNaN(d)) return iso;
        return d.getUTCDate() + ' ' + M[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
    },

    renderTopicNote() {
        const old = this.chipsEl.parentNode.querySelector('.dw-note[data-panel="feed-topics"]');
        if (old) old.remove();
        const c = this.topicCoverage;
        if (!c || c.complete || c.tagged_in_window > 0) return;
        const n = document.createElement('p');
        n.className = 'dw-note';
        n.setAttribute('data-panel', 'feed-topics');
        // NO fallback date. The first version of this note read
        // `c.tagged_through || 'June 2025'`, and because the reach was being
        // measured inside the window - where there are no tagged briefs to take
        // a max over - it came back null and the page printed a date I had
        // typed. A note about a data gap must not itself state an unverified
        // date. If the reach is unknown, the note says less.
        const through = c.tagged_through ? this.dateLabel(c.tagged_through) : null;
        n.textContent = through
            ? 'No topic chips for this period. The five tracked topics were only '
              + 'ever tagged on episodes up to ' + through + ', so every chip here '
              + 'would read zero. '
              + (this.total ? 'All ' + this.total.toLocaleString() + ' episodes in '
                              + 'the period are listed below, untagged.'
                            : 'Every episode in the period is still listed below.')
            : 'No topic chips for this period: none of these episodes carries a '
              + 'tracked-topic tag. Every episode in the period is still listed below.';
        this.chipsEl.parentNode.insertBefore(n, this.chipsEl.nextSibling);
    },

    status(text) { this.statusEl.textContent = text; },

    renderEmpty() {
        this.list.innerHTML = '';
        this.footEl.innerHTML = '';
        const p = document.createElement('p');
        p.className = 'nfl-empty';
        p.textContent = this.topic
            ? `No episode in the corpus mentions ${this.topic}.`
            : 'No briefs in the store yet.';
        this.list.appendChild(p);
        this.status('');
    },

    renderError(reset) {
        this.footEl.innerHTML = '';
        this.status('');
        if (reset) this.list.innerHTML = '';
        const box = document.createElement('div');
        box.className = 'nfl-error';
        const msg = document.createElement('p');
        msg.className = 'nfl-error-msg';
        // The user's language, not the endpoint's. The failure detail is on the
        // resolver's data-synthea-detail attribute for the overlay to read.
        msg.textContent = reset
            ? 'Could not load the feed.'
            : 'Could not load more episodes.';
        box.appendChild(msg);
        const retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'nfl-retry';
        retry.textContent = 'Try again';
        retry.addEventListener('click', () => { box.remove(); this.load({ reset: reset }); });
        box.appendChild(retry);
        (reset ? this.list : this.footEl).appendChild(box);
    },

    renderFoot(hasMore) {
        this.footEl.innerHTML = '';
        if (!hasMore) {
            const end = document.createElement('p');
            end.className = 'nfl-end';
            // With a filter on, this is the end of the filtered list, not of
            // the corpus. Saying "End of the corpus" under two DePIN episodes
            // would read as a claim about the whole store.
            end.textContent = this.topic
                ? `That is every episode mentioning ${this.topic}.`
                : 'End of the corpus.';
            this.footEl.appendChild(end);
            return;
        }
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'nfl-more';
        b.textContent = 'Load more';
        b.addEventListener('click', () => this.load({ reset: false }));
        this.footEl.appendChild(b);
        this.moreBtn = b;
        this.watchMore(b);
    },

    /**
     * Lazy load. The button is the control - it works on its own, from the
     * keyboard, and is what the observer presses when it scrolls into view.
     * One code path, so there is nothing that can only be reached by scrolling.
     */
    watchMore(btn) {
        if (typeof IntersectionObserver !== 'function') return;
        if (this.io) this.io.disconnect();
        this.io = new IntersectionObserver(entries => {
            if (entries.some(e => e.isIntersecting) && !this.loading) {
                this.io.disconnect();
                btn.click();
            }
        }, { rootMargin: '300px' });
        this.io.observe(btn);
    },

    setMoreBusy(busy) {
        if (!this.moreBtn || !this.moreBtn.isConnected) return;
        this.moreBtn.disabled = busy;
        this.moreBtn.textContent = busy ? 'Loading…' : 'Load more';
    },

    // --------------------------------------------------------------- a row

    row(it) {
        const el = document.createElement('div');
        // The Vision entry's classes, so the visual grammar matches, with only
        // honest slots filled: feed-date replaces feed-time (a real date, not
        // "2h ago"), and there is no feed-category pill because nothing in the
        // stack measures stance.
        el.className = 'feed-entry nfl-entry';
        el.setAttribute('data-episode-id', it.episode_id);

        const head = document.createElement('div');
        head.className = 'feed-entry-header nfl-entry-header';

        const date = document.createElement('span');
        date.className = 'feed-date nfl-date';
        date.textContent = this.dateLabel(it.published_at);
        head.appendChild(date);

        const pod = document.createElement('span');
        pod.className = 'podcast-badge nfl-podcast';
        pod.textContent = it.podcast_name;
        pod.title = it.podcast_name;      // the chip truncates; the tooltip does not
        head.appendChild(pod);

        const hook = document.createElement('span');
        hook.className = 'feed-event nfl-hook';
        hook.textContent = it.hook || it.episode_title;
        hook.title = it.episode_title;
        head.appendChild(hook);

        const claims = document.createElement('span');
        claims.className = 'nfl-claims';
        claims.textContent = it.claim_count
            ? `${it.claim_count} ${it.claim_count === 1 ? 'quote' : 'quotes'}`
            : 'No quotes';
        claims.title = it.claim_count
            ? `${it.claim_count} verbatim quotes in this episode's brief, each timestamped to the transcript.`
            : 'Every quote generated for this episode failed the verbatim or timestamp check.';
        head.appendChild(claims);

        el.appendChild(head);

        if (it.topic_tags && it.topic_tags.length) {
            const tags = document.createElement('div');
            tags.className = 'card-tags nfl-tags';
            it.topic_tags.forEach(t => {
                const s = document.createElement('span');
                s.className = 'tag';
                s.textContent = '#' + t.replace(/[^A-Za-z0-9]/g, '');
                s.title = `${t} is mentioned in this episode`;
                tags.appendChild(s);
            });
            el.appendChild(tags);
        }

        // The whole row is the route to the brief. If the brief panel is not on
        // the page there is nothing for a click to do, so the row does not
        // pretend to be a control.
        if (window.BriefingsLive) {
            el.tabIndex = 0;
            el.setAttribute('role', 'button');
            el.classList.add('is-openable');
            el.setAttribute('aria-label', `Open the brief for ${it.episode_title}`);
            const open = () => window.BriefingsLive.openById(it.episode_id);
            el.addEventListener('click', open);
            el.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
            });
        }
        return el;
    }
};

window.NarrativeFeedLive = NarrativeFeedLive;

if (!(window.SyntheaData && window.SyntheaData.isVision())) {
    document.addEventListener('DOMContentLoaded', () => NarrativeFeedLive.init());
}
