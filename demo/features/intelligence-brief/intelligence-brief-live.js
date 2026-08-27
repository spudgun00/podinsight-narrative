/**
 * The Intelligence Brief — one cached document for the period.
 *
 * GET /api/intelligence-brief. Generated once by
 * podinsight-aws-pilot/build_intelligence_brief.py and cached; nothing is
 * generated per view.
 *
 * What the mock had and this does not: the word "Weekly" over a corpus that is
 * six fixed months; Consensus Forming, Contrarian Signals and Emerging
 * Blindspots, all three of which need claim matching across episodes - the same
 * wall Consensus Monitor was dropped for; a Download Brief (PDF) button and
 * Share and Email links, none of which had a handler in Live at all.
 *
 * What replaces them: four sections, in order. The Period in Numbers is rollup
 * arithmetic with nothing generated. What Dominated is the only generated prose
 * on the page, and every sentence of it carries the claim ids it rests on, each
 * opening to a verbatim quote with a timestamp and Play. Notable Claims states
 * its selection rule. And the absence note says plainly what is not here.
 *
 * The citation markers are the point of the section, not decoration: a reader
 * who does not believe a sentence can open the claim it came from and hear it.
 */
const IntelligenceBriefLive = {
    apiBaseUrl: window.SYNTHEA_API_BASE || 'http://localhost:8000',
    data: null,
    expanded: false,

    async init() {
        if (window.SyntheaData && window.SyntheaData.isVision()) return;
        // init.js injects intelligence-brief.html asynchronously, and the live
        // sidebar components live in that same template, so it cannot be
        // skipped in Live. Wait for the slot rather than race it.
        const slot = await this.waitFor('.intelligence-brief-sidebar .brief-content', 8000);
        if (!slot) return;
        this.slot = slot;
        window.SyntheaData.claim('intelligence-brief', slot);

        slot.innerHTML = '<div class="ibl"><p class="ibl-status">Loading the brief…</p></div>';
        try {
            this.data = await window.SyntheaData.fetchJSON(
                'intelligence-brief', '/api/intelligence-brief');
        } catch (err) {
            slot.innerHTML = '';
            const box = document.createElement('div');
            box.className = 'ibl';
            const p = document.createElement('p');
            p.className = 'ibl-status';
            p.textContent = 'Could not load the brief.';
            box.appendChild(p);
            const retry = document.createElement('button');
            retry.type = 'button';
            retry.className = 'ibl-retry';
            retry.textContent = 'Try again';
            retry.addEventListener('click', () => this.init());
            box.appendChild(retry);
            slot.appendChild(box);
            return;
        }
        this.render();
    },

    waitFor(sel, ms) {
        return new Promise(resolve => {
            const found = document.querySelector(sel);
            if (found) return resolve(found);
            const t0 = Date.now();
            const iv = setInterval(() => {
                const el = document.querySelector(sel);
                if (el || Date.now() - t0 > ms) { clearInterval(iv); resolve(el || null); }
            }, 100);
        });
    },

    // --------------------------------------------------------------- render

    render() {
        const d = this.data;
        this.slot.innerHTML = '';
        const root = document.createElement('div');
        root.className = 'ibl';
        this.slot.appendChild(root);

        // Header. The Vision brief's grammar - title, meta line - without its
        // Share, Email and Download PDF, none of which does anything.
        const head = document.createElement('div');
        head.className = 'brief-header ibl-head';
        const h = document.createElement('h3');
        h.className = 'section-title';
        h.textContent = d.title;
        head.appendChild(h);
        const meta = document.createElement('p');
        meta.className = 'section-description ibl-meta';
        meta.textContent = `${d.facts.episodes.toLocaleString()} episodes · `
                         + `${d.facts.podcasts} podcasts · `
                         + `${d.facts.hours.toLocaleString()} hours`;
        meta.title = `Generated once from the brief store by ${d.model}. `
                   + `Nothing on this page is generated per view.`;
        head.appendChild(meta);
        root.appendChild(head);

        root.appendChild(this.numbersSection(d));
        root.appendChild(this.dominatedSection(d));
        root.appendChild(this.notableSection(d));
        root.appendChild(this.absenceSection(d));
        this.applyExpanded();

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'brief-expand-btn ibl-expand';
        btn.addEventListener('click', () => {
            this.expanded = !this.expanded;
            this.applyExpanded();
            btn.textContent = this.expanded ? 'Collapse brief' : 'Expand brief';
            btn.setAttribute('aria-expanded', String(this.expanded));
        });
        btn.textContent = 'Expand brief';
        btn.setAttribute('aria-expanded', 'false');
        root.appendChild(btn);
        this.root = root;
    },

    applyExpanded() {
        if (!this.slot) return;
        this.slot.querySelectorAll('.ibl-collapsible').forEach(el => {
            el.style.display = this.expanded ? '' : 'none';
        });
    },

    section(title, klass) {
        const s = document.createElement('div');
        s.className = 'brief-section ibl-section' + (klass ? ' ' + klass : '');
        const t = document.createElement('h4');
        t.className = 'brief-section-title';
        t.textContent = title;
        s.appendChild(t);
        return s;
    },

    // (a) ------------------------------------------------------------------
    numbersSection(d) {
        const f = d.facts;
        const s = this.section('The Period in Numbers');

        const grid = document.createElement('div');
        grid.className = 'ibl-numbers';
        [[f.episodes.toLocaleString(), 'episodes'],
         [f.podcasts.toLocaleString(), 'podcasts'],
         [f.hours.toLocaleString(), 'hours']].forEach(([v, l]) => {
            const cell = document.createElement('div');
            cell.className = 'ibl-number';
            const n = document.createElement('span');
            n.className = 'ibl-number-value';
            n.textContent = v;
            cell.appendChild(n);
            const lab = document.createElement('span');
            lab.className = 'ibl-number-label';
            lab.textContent = l;
            if (l === 'hours') cell.title = f.hours_basis;
            cell.appendChild(lab);
            grid.appendChild(cell);
        });
        s.appendChild(grid);

        s.appendChild(this.rankList('Topics', f.topics.map(t => ({
            name: t.topic, value: t.mentions,
            title: `${t.mentions.toLocaleString()} mentions across `
                 + `${t.episodes.toLocaleString()} episodes`
        })), 'mentions'));

        s.appendChild(this.rankList('Most-mentioned companies', f.companies.map(c => ({
            name: c.name, value: c.episodes,
            title: `Named in ${c.episodes.toLocaleString()} episodes, `
                 + `${c.mentions.toLocaleString()} times in total`
        })), 'episodes'));

        s.appendChild(this.rankList('Most-mentioned people', f.people.map(c => ({
            name: c.name, value: c.episodes,
            title: `Named in ${c.episodes.toLocaleString()} episodes, `
                 + `${c.mentions.toLocaleString()} times in total`
        })), 'episodes'));

        // The company/person split is curated, and says so where it is used.
        const note = document.createElement('p');
        note.className = 'ibl-note ibl-collapsible';
        note.textContent = f.entity_note || '';
        s.appendChild(note);
        return s;
    },

    rankList(label, rows, unit) {
        const wrap = document.createElement('div');
        wrap.className = 'ibl-rank';
        const l = document.createElement('div');
        l.className = 'ibl-rank-label';
        l.textContent = label;
        wrap.appendChild(l);
        rows.forEach(r => {
            const row = document.createElement('div');
            row.className = 'ibl-rank-row';
            row.title = r.title || '';
            const n = document.createElement('span');
            n.className = 'ibl-rank-name';
            n.textContent = r.name;
            row.appendChild(n);
            const v = document.createElement('span');
            v.className = 'ibl-rank-value';
            v.textContent = `${r.value.toLocaleString()} ${unit}`;
            row.appendChild(v);
            wrap.appendChild(row);
        });
        return wrap;
    },

    // (b) ------------------------------------------------------------------
    dominatedSection(d) {
        const s = this.section('What Dominated');
        const rule = document.createElement('p');
        rule.className = 'ibl-rule';
        rule.textContent = 'Written from verified claims in the brief store. '
                         + 'Every sentence cites the claims it rests on; open one to read '
                         + 'the quote and play it.';
        s.appendChild(rule);

        d.dominated.forEach((t, i) => {
            const block = document.createElement('div');
            // The first topic is the preview; the rest expand, which is the
            // Vision brief's own collapsed/expanded grammar.
            block.className = 'ibl-topic' + (i ? ' ibl-collapsible' : '');
            const tt = document.createElement('div');
            tt.className = 'ibl-topic-title';
            tt.textContent = t.topic;
            block.appendChild(tt);

            const p = document.createElement('p');
            p.className = 'ibl-para';
            t.sentences.forEach((sen, j) => {
                if (j) p.appendChild(document.createTextNode(' '));
                p.appendChild(document.createTextNode(sen.text));
                sen.claim_ids.forEach(id => {
                    const cite = document.createElement('button');
                    cite.type = 'button';
                    cite.className = 'ibl-cite';
                    const c = d.citations[id];
                    cite.textContent = '◆';
                    cite.setAttribute('aria-label',
                        c ? `Show the claim behind this: ${c.episode_title}` : 'Show the claim');
                    cite.title = c ? `${c.podcast_name} · ${c.published_at}` : '';
                    cite.addEventListener('click', () => this.toggleCitation(cite, id));
                    p.appendChild(cite);
                });
            });
            block.appendChild(p);
            s.appendChild(block);
        });

        (d.dominated_excluded || []).forEach(x => {
            const e = document.createElement('p');
            e.className = 'ibl-excluded ibl-collapsible';
            e.textContent = `${x.topic} has no paragraph: ${x.mentions} `
                          + `${x.mentions === 1 ? 'mention' : 'mentions'}, ${x.reason}.`;
            s.appendChild(e);
        });

        // A dropped sentence is recorded, not hidden.
        if ((d.sentences_dropped || []).length) {
            const dr = document.createElement('p');
            dr.className = 'ibl-excluded ibl-collapsible';
            dr.textContent = `${d.sentences_dropped.length} sentence`
                + `${d.sentences_dropped.length === 1 ? '' : 's'} did not pass validation `
                + `and ${d.sentences_dropped.length === 1 ? 'was' : 'were'} removed: `
                + d.sentences_dropped.map(x => `${x.topic} (${x.reason})`).join('; ') + '.';
            s.appendChild(dr);
        }
        return s;
    },

    toggleCitation(btn, id) {
        const existing = btn.parentNode.querySelector(`[data-cite="${CSS.escape(id)}"]`);
        if (existing) { existing.remove(); btn.classList.remove('is-open'); return; }
        const c = this.data.citations[id];
        if (!c) return;
        btn.classList.add('is-open');
        const box = this.citationBox(c, id);
        btn.parentNode.insertBefore(box, btn.nextSibling);
    },

    /** A citation, opened: the claim, the verbatim quote, timestamp, Play. */
    citationBox(c, id) {
        const box = document.createElement('span');
        box.className = 'ibl-cite-box';
        box.setAttribute('data-cite', id);

        const src = document.createElement('span');
        src.className = 'ibl-cite-src';
        src.textContent = `${c.podcast_name} · ${c.published_at}`;
        box.appendChild(src);

        const title = document.createElement('span');
        title.className = 'ibl-cite-title';
        title.textContent = c.episode_title || '';
        box.appendChild(title);

        const claim = document.createElement('span');
        claim.className = 'ibl-cite-claim';
        claim.textContent = c.claim;
        box.appendChild(claim);

        const q = document.createElement('blockquote');
        q.className = 'ibl-cite-quote';
        q.textContent = '“' + c.quote + '”';
        box.appendChild(q);

        const foot = document.createElement('span');
        foot.className = 'ibl-cite-foot';
        if (c.timestamp) {
            const ts = document.createElement('span');
            ts.className = 'ibl-cite-ts';
            ts.textContent = c.timestamp;
            foot.appendChild(ts);
        }
        if (c.located && c.start_seconds != null) {
            const play = document.createElement('button');
            play.type = 'button';
            play.className = 'ibl-cite-play';
            play.textContent = '▶ Play';
            play.addEventListener('click', () => this.playClip(c.episode_id, c.start_seconds, play));
            foot.appendChild(play);
        }
        const open = document.createElement('button');
        open.type = 'button';
        open.className = 'ibl-cite-open';
        open.textContent = 'Full brief';
        open.addEventListener('click', () => {
            if (window.BriefingsLive) window.BriefingsLive.openById(c.episode_id);
        });
        // A control that cannot do its job does not render.
        if (window.BriefingsLive) foot.appendChild(open);
        box.appendChild(foot);
        return box;
    },

    // (c) ------------------------------------------------------------------
    notableSection(d) {
        const s = this.section('Notable Claims', 'ibl-collapsible');
        const rule = document.createElement('p');
        rule.className = 'ibl-rule';
        rule.textContent = d.notable_rule || '';
        s.appendChild(rule);
        (d.notable_claims || []).forEach(c => {
            s.appendChild(this.citationBox(c, c.id));
        });
        return s;
    },

    // (d) ------------------------------------------------------------------
    absenceSection(d) {
        const s = this.section('What is not here', 'ibl-collapsible ibl-absence');
        const p = document.createElement('p');
        p.className = 'ibl-note';
        p.textContent = d.absence_note || '';
        s.appendChild(p);
        const v = document.createElement('p');
        v.className = 'ibl-note ibl-validation';
        v.textContent = 'Validation: ' + (d.validation_rules || '');
        s.appendChild(v);
        return s;
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
    }
};

window.IntelligenceBriefLive = IntelligenceBriefLive;

if (!(window.SyntheaData && window.SyntheaData.isVision())) {
    document.addEventListener('DOMContentLoaded', () => IntelligenceBriefLive.init());
}
