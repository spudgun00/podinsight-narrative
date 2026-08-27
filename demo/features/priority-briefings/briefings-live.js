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
        btn.addEventListener('click', (e) => { e.stopPropagation(); this.openFull(b); });
        footer.appendChild(btn);

        el.appendChild(footer);
        // One surface: the whole card is the route to the brief, not just the
        // button. Nothing else opens from a card.
        el.tabIndex = 0;
        el.setAttribute('role', 'button');
        el.addEventListener('click', () => this.openFull(b));
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.openFull(b); }
        });
        return el;
    },

    buildFullBriefPanel() {
        if (this.panel) return;
        // Rebuilt on the Vision brief's own layout and classes, so it reads as
        // the same product. Slots with nothing honest behind them are absent
        // rather than empty: no score, no relative time, and no
        // Portfolio/Watchlist tiles while Company Tracking is unbuilt.
        this.panel = document.createElement('div');
        this.panel.className = 'epb-panel briefings-live-epb';
        this.panel.setAttribute('data-state', 'closed');
        this.panel.setAttribute('role', 'dialog');
        this.panel.setAttribute('aria-modal', 'true');
        this.panel.innerHTML = `
            <div class="epb-header">
                <div class="epb-header-top">
                    <div class="epb-meta">
                        <span class="epb-podcast"></span> •
                        <span class="epb-date"></span> •
                        <span class="epb-duration"></span>
                    </div>
                    <div class="epb-actions">
                        <div class="epb-btn epb-close" title="Close" role="button" tabindex="0">✕</div>
                    </div>
                </div>
                <div class="epb-header-middle">
                    <h1 class="epb-title"></h1>
                </div>
                <div class="epb-header-bottom">
                    <div class="epb-speakers"></div>
                </div>
            </div>
            <div class="epb-content">
                <div class="epb-main">
                    <div class="epb-section">
                        <div class="epb-section-title">THE CONVERSATION</div>
                        <div class="epb-conversation"></div>
                    </div>
                    <div class="epb-section epb-quotes-section">
                        <div class="epb-section-header">
                            <div class="epb-section-title">KEY QUOTES</div>
                            <span class="epb-quote-count"></span>
                        </div>
                        <div class="epb-key-quotes"></div>
                    </div>
                </div>
                <div class="epb-sidebar">
                    <div class="epb-quote epb-essential">
                        <div class="epb-section-title">ESSENTIAL QUOTE</div>
                        <div class="epb-quote-text"></div>
                        <div class="epb-quote-author"></div>
                    </div>
                    <div class="epb-section epb-numbers-section">
                        <div class="epb-section-title">NOTABLE NUMBERS</div>
                        <div class="epb-numbers"></div>
                    </div>
                    <div class="epb-topics">
                        <div class="epb-section-title">RELATED TOPICS</div>
                        <div class="epb-tags"></div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(this.panel);

        this.backdrop = document.createElement('div');
        this.backdrop.className = 'briefings-live-backdrop';
        this.backdrop.addEventListener('click', () => this.closeFull());
        document.body.appendChild(this.backdrop);

        const close = () => this.closeFull();
        this.panel.querySelector('.epb-close').addEventListener('click', close);
        this.panel.querySelector('.epb-close').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(); }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.getAttribute('data-state') === 'open') close();
        });
    },

    /** Open by episode id, for the episode panel and the drilldown. */
    async openById(episodeId) {
        this.buildFullBriefPanel();
        let brief = (this.data && this.data.briefs || []).find(b => b.episode_id === episodeId);
        if (!brief) {
            try {
                brief = await window.SyntheaData.fetchJSON(
                    'briefings', `/api/briefings/${encodeURIComponent(episodeId)}`);
            } catch (err) {
                this.openMissing(episodeId);
                return;
            }
        }
        this.openFull(brief);
    },

    /** Briefs are still generating; say so plainly rather than show scaffolding. */
    openMissing(episodeId) {
        this.panel.setAttribute('data-state', 'open');
        this.backdrop.setAttribute('data-state', 'open');
        // Hide the meta line entirely rather than leaving its separators
        // stranded as "• •".
        this.panel.querySelector('.epb-meta').style.display = 'none';
        this.panel.querySelector('.epb-title').textContent = 'No brief for this episode yet';
        this.panel.querySelector('.epb-speakers').textContent = '';
        this.panel.querySelector('.epb-conversation').textContent =
            'This episode is in the corpus and searchable, but its brief has not been '
            + 'generated yet. It will appear here once it has.';
        this.panel.querySelector('.epb-key-quotes').innerHTML = '';
        this.panel.querySelector('.epb-quote-count').textContent = '';
        this.panel.querySelector('.epb-quotes-section').style.display = 'none';
        this.panel.querySelector('.epb-essential').style.display = 'none';
        this.panel.querySelector('.epb-numbers-section').style.display = 'none';
        this.panel.querySelector('.epb-topics').style.display = 'none';
    },

    /**
     * Essential Quote, chosen post-hoc from the claims already generated - no
     * second model call. Rule: the longest quote that carries a numeric figure,
     * falling back to the longest quote. Length stands in for substance and a
     * number makes a quote checkable, and both are properties of text already
     * on the page.
     */
    essentialQuote(b) {
        const withNum = b.claims.filter(c => /\d/.test(c.quote));
        const pool = withNum.length ? withNum : b.claims;
        return pool.slice().sort((a, c) => c.quote.length - a.quote.length)[0] || null;
    },

    /**
     * Notable Numbers, extracted post-hoc from claim text. Nothing is generated:
     * these are figures the claims already state, each linking back to the claim
     * it came from. Section is omitted when a brief has none.
     */
    notableNumbers(b) {
        const out = [];
        const seen = new Set();
        b.claims.forEach((c, i) => {
            const re = /(\$\s?\d[\d,.]*\s?(?:billion|million|trillion|bn|m|k)?|\d[\d,.]*\s?(?:%|percent)|\d[\d,.]*\s?(?:billion|million|trillion))/gi;
            (c.claim.match(re) || []).forEach(m => {
                const key = m.replace(/\s+/g, '').toLowerCase();
                if (seen.has(key)) return;
                seen.add(key);
                out.push({ value: m.trim(), claimIndex: i });
            });
        });
        return out.slice(0, 6);
    },

    speakerLine(b) {
        // From the v3 speakers field, not from entity data: role and
        // affiliation are only present where the transcript stated them.
        const sp = b.speakers && b.speakers.length ? b.speakers : null;
        if (!sp) return (b.guests || []).join(', ');
        return sp.map(s => {
            const detail = [s.role, s.affiliation].filter(Boolean).join(', ');
            return detail ? `${s.name} (${detail})` : s.name;
        }).join(' · ');
    },

    openFull(b) {
        this.buildFullBriefPanel();
        this.current = b;
        this.panel.setAttribute('data-state', 'open');
        this.backdrop.setAttribute('data-state', 'open');

        this.panel.querySelector('.epb-meta').style.display = '';
        this.panel.querySelector('.epb-quotes-section').style.display = '';
        this.panel.querySelector('.epb-podcast').textContent = b.podcast_name;
        this.panel.querySelector('.epb-date').textContent = this.dateLabel(b.published_at);
        this.panel.querySelector('.epb-duration').textContent =
            b.duration_minutes ? `${b.duration_minutes} min` : '';
        this.panel.querySelector('.epb-title').textContent = b.episode_title;
        this.panel.querySelector('.epb-speakers').textContent = this.speakerLine(b);
        this.panel.querySelector('.epb-conversation').textContent = b.summary || '';

        const quotes = this.panel.querySelector('.epb-key-quotes');
        quotes.innerHTML = '';
        this.panel.querySelector('.epb-quote-count').textContent =
            b.claims.length ? `${b.claims.length}` : '';

        if (!b.claims.length) {
            const none = document.createElement('div');
            none.className = 'epb-noquotes';
            none.textContent = b.no_playable_claims
                ? 'No playable quotes. Every quote generated for this episode failed the '
                  + 'verbatim or timestamp check, so none is shown.'
                : 'No quotes for this episode.';
            quotes.appendChild(none);
        }

        b.claims.forEach((c, i) => {
            const row = document.createElement('div');
            row.className = 'epb-quote-row';
            row.id = `epb-claim-${i}`;

            const claim = document.createElement('div');
            claim.className = 'epb-quote-claim';
            claim.textContent = c.claim;
            row.appendChild(claim);

            const q = document.createElement('blockquote');
            q.className = 'epb-quote-body';
            q.textContent = '\u201C' + c.quote + '\u201D';
            row.appendChild(q);

            const foot = document.createElement('div');
            foot.className = 'epb-quote-foot';
            const attribution = this.attributionFor(b, c);
            if (attribution) {
                const who = document.createElement('span');
                who.className = 'epb-quote-who';
                who.textContent = attribution;
                foot.appendChild(who);
            }
            const ts = document.createElement('span');
            ts.className = 'epb-quote-ts';
            ts.textContent = c.timestamp || '';
            foot.appendChild(ts);
            if (c.located && c.start_seconds != null) {
                const play = document.createElement('button');
                play.type = 'button';
                play.className = 'epb-quote-play';
                play.textContent = '\u25B6 Play';
                play.addEventListener('click', () => this.playClip(b.episode_id, c.start_seconds, play));
                foot.appendChild(play);
            }
            row.appendChild(foot);
            quotes.appendChild(row);
        });

        // Essential Quote
        const ess = this.essentialQuote(b);
        const essBox = this.panel.querySelector('.epb-essential');
        if (ess) {
            essBox.style.display = '';
            essBox.querySelector('.epb-quote-text').textContent = '\u201C' + ess.quote + '\u201D';
            essBox.querySelector('.epb-quote-author').textContent =
                [this.attributionFor(b, ess), ess.timestamp].filter(Boolean).join(' · ');
        } else {
            essBox.style.display = 'none';
        }

        // Notable Numbers
        const nums = this.notableNumbers(b);
        const numBox = this.panel.querySelector('.epb-numbers-section');
        const numList = this.panel.querySelector('.epb-numbers');
        numList.innerHTML = '';
        if (nums.length) {
            numBox.style.display = '';
            nums.forEach(n => {
                const a = document.createElement('button');
                a.type = 'button';
                a.className = 'epb-number';
                a.textContent = n.value;
                a.title = 'Jump to the claim this figure comes from';
                a.addEventListener('click', () => {
                    const el = this.panel.querySelector(`#epb-claim-${n.claimIndex}`);
                    if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' });
                              el.classList.add('is-flash');
                              setTimeout(() => el.classList.remove('is-flash'), 1200); }
                });
                numList.appendChild(a);
            });
        } else {
            numBox.style.display = 'none';        // omitted, not shown empty
        }

        // Related Topics
        const topics = this.panel.querySelector('.epb-topics');
        const tags = this.panel.querySelector('.epb-tags');
        tags.innerHTML = '';
        if (b.topic_tags && b.topic_tags.length) {
            topics.style.display = '';
            b.topic_tags.forEach(t => {
                const sp = document.createElement('span');
                sp.className = 'epb-tag';
                sp.textContent = t;
                tags.appendChild(sp);
            });
        } else {
            topics.style.display = 'none';
        }
    },

    /** Attribution only where the brief names exactly one plausible speaker. */
    attributionFor(b, claim) {
        const sp = (b.speakers || []).filter(s => s.name);
        if (sp.length === 1) return sp[0].name;
        return '';
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
        if (!this.panel) return;
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
