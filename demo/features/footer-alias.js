/**
 * Footer alias-version line.
 *
 * Reads `alias_version` from the LIVE /api/entities response on every load.
 * Never a constant and never a build-time value: if the call fails, or the
 * field is absent, the line reads "aliases: unknown" rather than a guess.
 *
 * The date, when shown, is `entity_coverage.entity_coverage_through` — the only
 * date this endpoint reports about entities. It is coverage, not a build
 * timestamp, and the label says so.
 */
(function () {
  'use strict';
  var EL_ID = 'footerAlias';
  var BASE = window.SYNTHEA_API_BASE || 'http://localhost:8000';

  function el() { return document.getElementById(EL_ID); }

  function render(text) {
    var node = el();
    if (node) node.textContent = text;
  }

  function fmt(iso) {
    // "2026-08-28" -> "28 Aug 2026". Returns null on anything unexpected, so a
    // malformed value is omitted rather than printed raw.
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (!m) return null;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var mi = parseInt(m[2], 10) - 1;
    if (mi < 0 || mi > 11) return null;
    return parseInt(m[3], 10) + ' ' + months[mi] + ' ' + m[1];
  }

  function load() {
    render('aliases: unknown');
    fetch(BASE + '/api/entities?limit=1', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (d) {
        var v = d && d.alias_version;
        if (v === null || v === undefined) { render('aliases: unknown'); return; }
        var line = 'aliases v' + v;
        var through = d.entity_coverage && d.entity_coverage.entity_coverage_through;
        var when = fmt(through);
        if (when) line += ' · entities through ' + when;
        render(line);
      })
      .catch(function () { render('aliases: unknown'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
