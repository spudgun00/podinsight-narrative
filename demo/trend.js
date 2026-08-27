/**
 * Shared trend formatting: one low-volume floor, one colour per direction.
 *
 * Used by the Narrative Pulse legend, Velocity Tracking and the topic movement
 * widget so the same topic cannot report a percentage in one place and
 * "low volume" in another.
 *
 * THE FLOOR, AND WHY IT IS 50
 *
 * A percentage change is only worth printing if it survives one more mention
 * landing in the corpus. The sensitivity of a month-over-month change to a
 * single mention is 100 / baseline percentage points:
 *
 *   Crypto/Web3         baseline 1695   0.1 pp per mention
 *   AI Agents           baseline  242   0.4 pp per mention
 *   Capital Efficiency  baseline   27   3.7 pp per mention
 *   B2B SaaS            baseline   14   7.1 pp per mention
 *
 * B2B SaaS reported "+136%" off a baseline of 14 mentions: a single extra
 * mention would have moved that headline by seven points. Capital Efficiency
 * reported "-63%" off 27.
 *
 * The floor is set so one mention can move the printed figure by at most
 * 2 percentage points, which gives baseline >= 100 / 2 = 50. On this corpus
 * that keeps AI Agents and Crypto/Web3 and suppresses Capital Efficiency and
 * B2B SaaS, which is the correct split: those two are real topics with thin
 * monthly counts, and the honest statement about them is the volume, not a
 * rate of change.
 */
(function () {
    'use strict';

    var MAX_PP_PER_MENTION = 2;
    var MIN_BASELINE_MENTIONS = Math.ceil(100 / MAX_PP_PER_MENTION);   // 50

    // One colour per direction, everywhere a trend renders.
    var COLOURS = {
        rising:  'var(--sage, #4a7c59)',
        falling: 'var(--dusty-rose, #b06a5c)',
        flat:    'var(--text-tertiary, #8a8a8a)',
        none:    'var(--gray-400, #9ca3af)'
    };

    function direction(changePct) {
        if (changePct === null || changePct === undefined) return 'none';
        if (Math.abs(changePct) < 1) return 'flat';
        return changePct > 0 ? 'rising' : 'falling';
    }

    /**
     * Baseline is the earlier of the two complete buckets the change is
     * computed across — the denominator that makes the percentage fragile.
     */
    function baselineOf(topic) {
        if (!topic || !topic.series) return null;
        var full = topic.series.filter(function (p) { return !p.partial; });
        if (full.length < 2) return null;
        return full[full.length - 2].mentions;
    }

    /**
     * The single formatting decision. Returns what to print, the direction, and
     * the colour, so callers never re-derive any of the three.
     */
    function format(topic) {
        var change = topic ? topic.change_pct : null;
        var baseline = baselineOf(topic);
        var total = (topic && topic.total_mentions) || 0;

        if (change === null || change === undefined || baseline === null) {
            return { text: total + ' mentions', dir: 'none', colour: COLOURS.none,
                     suppressed: true,
                     title: total + ' mentions in total — not enough complete months for a rate of change' };
        }
        if (baseline < MIN_BASELINE_MENTIONS) {
            var pp = (100 / Math.max(baseline, 1)).toFixed(1);
            return { text: 'low volume', dir: 'flat', colour: COLOURS.flat,
                     suppressed: true,
                     title: 'Only ' + baseline + ' mentions in the previous complete month. '
                          + 'One more mention would move the figure by ' + pp
                          + ' percentage points, so the percentage is not printed. '
                          + total + ' mentions in total.' };
        }
        var dir = direction(change);
        return { text: (change >= 0 ? '+' : '') + Math.round(change) + '%',
                 dir: dir, colour: COLOURS[dir], suppressed: false,
                 title: 'Change against the previous complete month, from a baseline of '
                      + baseline + ' mentions. ' + total + ' mentions in total.' };
    }

    window.SyntheaTrend = {
        MIN_BASELINE_MENTIONS: MIN_BASELINE_MENTIONS,
        MAX_PP_PER_MENTION: MAX_PP_PER_MENTION,
        COLOURS: COLOURS,
        direction: direction,
        baselineOf: baselineOf,
        format: format
    };
})();
