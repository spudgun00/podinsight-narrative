/**
 * The global date window control.
 *
 * James's ruling, 1 Sep 2026: twenty months of library makes unbounded panels
 * unreadable. One control governs every panel; four choices; default 90 days.
 *
 * This file renders the control and nothing else. The window itself lives in
 * `SyntheaData.getWindow()/setWindow()`, and `SyntheaData.fetchJSON` stamps it
 * onto every API call from one place, so a panel cannot forget it and no row is
 * ever hidden client-side.
 *
 * **Every date in the label comes from the API.** The control shows
 * "Last 90 days: 31 May to 28 Aug 2026", and those dates are resolved
 * server-side from the newest episode in the library - not from today's
 * calendar. Until that response arrives the control shows its four choices with
 * no span, because a made-up date is worse than a missing one.
 */
(function () {
    'use strict';

    var DateWindow = {
        el: null,

        init: function () {
            this.el = document.getElementById('date-window');
            if (!this.el) return;
            if (window.SyntheaData && window.SyntheaData.isVision &&
                window.SyntheaData.isVision()) {
                // Vision is the badged mock and is out of scope for the window.
                this.el.hidden = true;
                return;
            }
            this.render(null);
            this.loadSpan();
        },

        /** The real dates, from whichever endpoint answers first. */
        loadSpan: function () {
            var self = this;
            window.SyntheaData.fetchJSON('date-window', '/api/signals?limit=1')
                .then(function (d) {
                    if (d && d.window) self.render(d.window);
                })
                .catch(function () { /* the control still works; it just shows no span */ });
        },

        render: function (win) {
            var active = window.SyntheaData.getWindow();
            var opts = window.SyntheaData.WINDOWS;
            this.el.innerHTML = '';

            var group = document.createElement('div');
            group.className = 'dw-options';
            opts.forEach(function (o) {
                var b = document.createElement('button');
                b.className = 'dw-option' + (o.key === active ? ' is-active' : '');
                b.type = 'button';
                b.textContent = o.label;
                b.setAttribute('aria-pressed', o.key === active ? 'true' : 'false');
                b.addEventListener('click', function () {
                    window.SyntheaData.setWindow(o.key);
                });
                group.appendChild(b);
            });
            this.el.appendChild(group);

            var span = document.createElement('span');
            span.className = 'dw-span';
            if (win && win.span) {
                // "31 May 2026 to 28 Aug 2026" - what the window actually covers.
                span.textContent = win.span;
                span.title = 'Counted back from the newest episode in the library ('
                           + (win.anchor || '') + '), not from today’s date, so the '
                           + 'window cannot empty on its own while ingestion is paused.';
            } else {
                span.textContent = '';
            }
            this.el.appendChild(span);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { DateWindow.init(); });
    } else {
        DateWindow.init();
    }
    window.DateWindow = DateWindow;
})();
