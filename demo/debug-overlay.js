/**
 * Synthea.ai - Debug Overlay (instrumentation only)
 *
 * Toggle with Ctrl+Shift+D. Off by default.
 *
 * Nothing in here changes component behaviour. It observes three things and
 * draws its findings in a separate fixed-position layer:
 *
 *   1. window.fetch          -> which component made a network request, where
 *                               to, and how long it took (LIVE evidence)
 *   2. window.unifiedData    -> which component read the mock data graph, and
 *                               which paths it touched (MOCK evidence)
 *   3. DOM writes            -> which source file rendered which part of the
 *                               page, so components can be discovered and the
 *                               reads/fetches above can be attributed to them
 *
 * The LIVE/MOCK verdict is derived entirely from (1) and (2) at runtime. There
 * is no list of "known live components" anywhere in this file.
 *
 * Load order matters: this file must run after data/unified-data.js (so the
 * data object exists to wrap) and before every consumer script.
 */
(function () {
    'use strict';

    if (window.__syntheaDebug) return;

    var SELF_FILE = 'debug-overlay.js';
    var MAX_STACK_CAPTURES = 6000;   // stack capture is the expensive part
    var MAX_WRITES = 6000;
    var MAX_BODY_CHARS = 400000;
    var PROXY_MAX_DEPTH = 4;

    var captures = 0;
    var fetchRecords = [];
    var dataReads = new Map();       // "file\npath" -> {file, path, count}
    var writes = [];                 // {el, file}
    var fetchSeq = 0;

    // ------------------------------------------------------------------
    // Stack inspection
    // ------------------------------------------------------------------

    var FRAME_RE = /https?:\/\/[^/\s]+\/([^\s()]+?\.js)(?:\?[^\s():]*)?:\d+:\d+/g;

    /**
     * Source files on the call stack, innermost first, this file excluded.
     * Returns null once the capture budget is spent.
     */
    function callerFiles() {
        if (captures >= MAX_STACK_CAPTURES) return null;
        captures++;

        var previousLimit = Error.stackTraceLimit;
        Error.stackTraceLimit = 25;
        var stack = new Error().stack || '';
        Error.stackTraceLimit = previousLimit;

        var files = [];
        var match;
        FRAME_RE.lastIndex = 0;
        while ((match = FRAME_RE.exec(stack)) !== null) {
            var file = match[1];
            if (file.indexOf(SELF_FILE) !== -1) continue;
            if (files.indexOf(file) === -1) files.push(file);
        }
        return files;
    }

    // ------------------------------------------------------------------
    // 1. fetch()
    // ------------------------------------------------------------------

    var nativeFetch = window.fetch ? window.fetch.bind(window) : null;

    if (nativeFetch) {
        window.fetch = function (input, init) {
            var files = callerFiles() || [];
            var url = typeof input === 'string' ? input : (input && input.url) || String(input);
            var method = (init && init.method) || (input && input.method) || 'GET';

            var record = {
                id: ++fetchSeq,
                files: files,
                url: url,
                method: String(method).toUpperCase(),
                requestBody: init && typeof init.body === 'string' ? init.body : null,
                startedAt: new Date().toISOString(),
                status: null,
                ok: null,
                contentType: null,
                ms: null,
                bodyMs: null,
                body: null,
                bodyIsJson: false,
                error: null
            };
            fetchRecords.push(record);

            var start = performance.now();

            return nativeFetch(input, init).then(function (response) {
                record.ms = Math.round(performance.now() - start);
                record.status = response.status;
                record.ok = response.ok;
                try { record.contentType = response.headers.get('content-type'); } catch (e) { /* opaque */ }

                // Read a clone so the caller's response is untouched.
                try {
                    response.clone().text().then(function (text) {
                        record.bodyMs = Math.round(performance.now() - start);
                        var trimmed = text.length > MAX_BODY_CHARS
                            ? text.slice(0, MAX_BODY_CHARS) + '\n... [truncated]'
                            : text;
                        try {
                            record.body = JSON.parse(text);
                            record.bodyIsJson = true;
                        } catch (e) {
                            record.body = trimmed;
                            record.bodyIsJson = false;
                        }
                    }, function () { /* body unavailable */ });
                } catch (e) { /* clone unsupported */ }

                return response;
            }, function (error) {
                record.ms = Math.round(performance.now() - start);
                record.error = (error && (error.name === 'AbortError' ? 'AbortError (timed out or cancelled)' : error.message)) || String(error);
                throw error;
            });
        };
    }

    /**
     * A request only counts as live data if the server answered with JSON.
     * Components also fetch their own .html templates over the network; those
     * are page assets, not a data source, and must not turn a badge green.
     */
    function isDataRequest(record) {
        if (record.error) return false;
        if (record.contentType && /json/i.test(record.contentType)) return true;
        return record.bodyIsJson === true;
    }

    // ------------------------------------------------------------------
    // 2. unified-data.js reads
    // ------------------------------------------------------------------

    function recordRead(path) {
        var files = callerFiles();
        if (!files || !files.length) return;
        var file = files[0];
        var key = file + '\n' + path;
        var entry = dataReads.get(key);
        if (entry) {
            entry.count++;
        } else {
            dataReads.set(key, { file: file, path: path, count: 1 });
        }
    }

    var proxyCache = new WeakMap();

    function isWrappable(value) {
        if (!value || typeof value !== 'object') return false;
        if (value instanceof Node || value instanceof Date || value instanceof RegExp) return false;
        if (value instanceof Map || value instanceof Set || value instanceof Promise) return false;
        return Array.isArray(value) || Object.getPrototypeOf(value) === Object.prototype;
    }

    /**
     * Recording proxy over the unified-data object graph. Reads are logged with
     * the reading file; values pass through unchanged. Proxies are cached per
     * target so object identity stays stable.
     */
    function wrap(target, path, depth) {
        if (!isWrappable(target)) return target;
        if (depth > PROXY_MAX_DEPTH) return target;
        if (proxyCache.has(target)) return proxyCache.get(target);

        var proxy = new Proxy(target, {
            get: function (obj, prop, receiver) {
                var value = Reflect.get(obj, prop, receiver);
                if (typeof prop === 'string' && !/^\d+$/.test(prop) && prop !== 'length' && prop !== 'constructor') {
                    recordRead(path + '.' + prop);
                }
                if (typeof value === 'function') return value;
                return wrap(value, Array.isArray(obj) ? path : path + '.' + String(prop), depth + 1);
            }
        });

        proxyCache.set(target, proxy);
        return proxy;
    }

    var rawUnifiedData = window.unifiedData;
    var unifiedDataProxy = null;

    if (rawUnifiedData) {
        unifiedDataProxy = wrap(rawUnifiedData, 'unifiedData', 1);
        window.unifiedData = unifiedDataProxy;

        // Any other global already aliasing the same object (e.g. window.masterData)
        // gets the proxy too, so reads through the alias are still recorded.
        Object.keys(window).forEach(function (key) {
            try {
                if (window[key] === rawUnifiedData) window[key] = unifiedDataProxy;
            } catch (e) { /* non-writable global */ }
        });
    }

    // ------------------------------------------------------------------
    // 3. DOM writes (used to discover components and their source files)
    // ------------------------------------------------------------------

    function recordWrite(el) {
        if (writes.length >= MAX_WRITES) return;
        if (!el || el.nodeType !== 1) return;
        if (el.closest && el.closest('#synthea-debug-layer')) return;
        var files = callerFiles();
        if (!files || !files.length) return;
        writes.push({ el: el, file: files[0], files: files });
    }

    var innerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    if (innerHTMLDescriptor && innerHTMLDescriptor.set) {
        Object.defineProperty(Element.prototype, 'innerHTML', {
            configurable: true,
            enumerable: innerHTMLDescriptor.enumerable,
            get: innerHTMLDescriptor.get,
            set: function (value) {
                innerHTMLDescriptor.set.call(this, value);
                recordWrite(this);
            }
        });
    }

    ['appendChild', 'insertBefore', 'replaceChild'].forEach(function (name) {
        var original = Node.prototype[name];
        if (!original) return;
        Node.prototype[name] = function () {
            var result = original.apply(this, arguments);
            var added = arguments[0];
            recordWrite(added && added.nodeType === 1 ? added : this);
            return result;
        };
    });

    var originalInsertAdjacentHTML = Element.prototype.insertAdjacentHTML;
    if (originalInsertAdjacentHTML) {
        Element.prototype.insertAdjacentHTML = function () {
            var result = originalInsertAdjacentHTML.apply(this, arguments);
            recordWrite(this);
            return result;
        };
    }

    // ------------------------------------------------------------------
    // Component discovery
    // ------------------------------------------------------------------

    /**
     * Layout wrappers are transparent: a "component" is a direct child of one.
     * This is structural, so no component names are baked in anywhere.
     */
    function isLayoutContainer(el) {
        if (!el) return false;
        if (el === document.body) return true;
        if (el.tagName === 'MAIN' || el.tagName === 'ASIDE') return true;
        return el.classList.contains('container') || el.classList.contains('sidebar');
    }

    function rootOf(el) {
        var current = el;
        while (current && current.parentElement && !isLayoutContainer(current.parentElement)) {
            current = current.parentElement;
        }
        return current && current.parentElement ? current : null;
    }

    function titleize(value) {
        return String(value)
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }

    function nameFor(root) {
        if (root.id) {
            return titleize(root.id.replace(/-(container|section|wrapper)$/, ''));
        }
        if (root.classList.length) return titleize(root.classList[0]);
        var heading = root.querySelector('h1, h2, h3, .section-title, .panel-title, .synthesis-section-title');
        if (heading && heading.textContent.trim()) {
            return titleize(heading.textContent.trim().slice(0, 40).toLowerCase());
        }
        return root.tagName.toLowerCase();
    }

    /**
     * A rendered component has structure. Bare text holders such as the hidden
     * #queryDisplay compatibility div are bookkeeping, not components.
     */
    function hasContent(root) {
        return root.children.length > 0;
    }

    /**
     * Some roots (the sticky header) collapse to a zero-width box, so fall back
     * to the union of their children.
     */
    function rectOf(root) {
        var rect = root.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) return rect;

        var box = null;
        for (var i = 0; i < root.children.length; i++) {
            var child = root.children[i].getBoundingClientRect();
            if (child.width === 0 || child.height === 0) continue;
            box = box ? {
                top: Math.min(box.top, child.top),
                left: Math.min(box.left, child.left),
                right: Math.max(box.right, child.right),
                bottom: Math.max(box.bottom, child.bottom)
            } : { top: child.top, left: child.left, right: child.right, bottom: child.bottom };
        }
        if (!box) return rect;
        return {
            top: box.top, left: box.left, right: box.right, bottom: box.bottom,
            width: box.right - box.left, height: box.bottom - box.top
        };
    }

    function isVisible(root) {
        if (!root.isConnected) return false;
        var style = getComputedStyle(root);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
        var rect = rectOf(root);
        if (rect.width === 0 || rect.height === 0) return false;
        // Closed slide-in panels are translated horizontally out of the page
        // rather than hidden, so treat those as not on screen either.
        var pageWidth = Math.max(window.innerWidth, document.documentElement.scrollWidth);
        return rect.right > 0 && rect.left < pageWidth;
    }

    function directoryOf(file) {
        var index = file.lastIndexOf('/');
        return index === -1 ? '' : file.slice(0, index);
    }

    /**
     * Walks everything recorded this page load and produces the component list
     * with a LIVE/MOCK verdict per component.
     */
    function scan() {
        var byRoot = new Map();

        writes.forEach(function (write) {
            if (!write.el.isConnected) return;
            var root = rootOf(write.el);
            if (!root || root.id === 'synthea-debug-layer') return;
            if (['SCRIPT', 'NOSCRIPT', 'STYLE', 'LINK'].indexOf(root.tagName) !== -1) return;
            if (!hasContent(root)) return;

            var entry = byRoot.get(root);
            if (!entry) {
                entry = { el: root, files: new Set(), fetches: [], reads: [] };
                byRoot.set(root, entry);
            }
            entry.files.add(write.file);
        });

        // file -> components that file rendered into
        var ownersByFile = new Map();
        var ownersByDirectory = new Map();
        byRoot.forEach(function (entry) {
            entry.files.forEach(function (file) {
                if (!ownersByFile.has(file)) ownersByFile.set(file, new Set());
                ownersByFile.get(file).add(entry);

                var dir = directoryOf(file);
                if (!dir) return;
                if (!ownersByDirectory.has(dir)) ownersByDirectory.set(dir, new Set());
                ownersByDirectory.get(dir).add(entry);
            });
        });

        // Attribute to the innermost stack frame that maps to a component;
        // fall back to the feature directory the frame lives in.
        function attribute(files) {
            for (var i = 0; i < files.length; i++) {
                if (ownersByFile.has(files[i])) return ownersByFile.get(files[i]);
            }
            for (var j = 0; j < files.length; j++) {
                var dir = directoryOf(files[j]);
                if (dir && ownersByDirectory.has(dir)) return ownersByDirectory.get(dir);
            }
            return null;
        }

        var unattributedFetches = [];
        fetchRecords.forEach(function (record) {
            var owners = attribute(record.files);
            if (!owners) { unattributedFetches.push(record); return; }
            owners.forEach(function (entry) { entry.fetches.push(record); });
        });

        var unattributedReads = [];
        dataReads.forEach(function (read) {
            var owners = attribute([read.file]);
            if (!owners) { unattributedReads.push(read); return; }
            owners.forEach(function (entry) { entry.reads.push(read); });
        });

        var components = [];
        byRoot.forEach(function (entry) {
            var dataRequests = entry.fetches.filter(isDataRequest);
            var assetRequests = entry.fetches.filter(function (r) { return !isDataRequest(r); });
            components.push({
                el: entry.el,
                name: nameFor(entry.el),
                files: Array.from(entry.files).sort(),
                fetches: dataRequests,
                assetRequests: assetRequests,
                reads: entry.reads.sort(function (a, b) { return b.count - a.count; }),
                isLive: dataRequests.length > 0,
                visible: isVisible(entry.el)
            });
        });

        components.sort(function (a, b) {
            if (a.visible !== b.visible) return a.visible ? -1 : 1;
            var ra = rectOf(a.el);
            var rb = rectOf(b.el);
            return (ra.top + window.scrollY) - (rb.top + window.scrollY) || ra.left - rb.left;
        });

        return {
            components: components,
            unattributedFetches: unattributedFetches,
            unattributedReads: unattributedReads
        };
    }

    window.__syntheaDebug = {
        scan: scan,
        rectOf: rectOf,
        isDataRequest: isDataRequest,
        fetchRecords: fetchRecords,
        dataReads: dataReads,
        writes: writes,
        stats: function () {
            return { stackCaptures: captures, writes: writes.length, fetches: fetchRecords.length, reads: dataReads.size };
        }
    };
}());

/**
 * Synthea.ai - Debug Overlay (presentation)
 *
 * Draws the badges, the counter and the raw-response panel. Everything lives in
 * a single fixed-position layer appended to <body>; component elements are
 * never touched, so nothing here can affect page layout or behaviour.
 */
(function () {
    'use strict';

    var LAYER_ID = 'synthea-debug-layer';
    var open = false;
    var layer = null;
    var bar = null;
    var badgeHost = null;
    var detail = null;
    var badges = [];
    var repositionTimer = null;
    var listExpanded = false;

    var STYLES = [
        '#' + LAYER_ID + ' { position: fixed; inset: 0; z-index: 2147483000; pointer-events: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }',
        '#' + LAYER_ID + ' * { box-sizing: border-box; }',
        '.sdbg-bar { position: fixed; top: 10px; left: 50%; transform: translateX(-50%); pointer-events: auto; background: #14141f; color: #f5f5f4; border: 1px solid #33334a; border-radius: 999px; padding: 7px 8px 7px 16px; display: flex; align-items: center; gap: 12px; font-size: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 24px rgba(0,0,0,0.35); max-width: 92vw; }',
        '.sdbg-count { font-weight: 600; white-space: nowrap; }',
        '.sdbg-count b { color: #6ee7a0; font-weight: 700; }',
        '.sdbg-sub { color: #9a9aae; white-space: nowrap; }',
        '.sdbg-bar button { pointer-events: auto; background: #26263a; color: #e8e8ef; border: 1px solid #3d3d57; border-radius: 999px; padding: 4px 10px; font-size: 11px; cursor: pointer; font-family: inherit; }',
        '.sdbg-bar button:hover { background: #33334d; }',
        '.sdbg-badge { position: fixed; pointer-events: auto; display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 5px; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; border: 1px solid; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.18); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }',
        '.sdbg-badge--live { background: #e8f6ed; color: #1f6b3f; border-color: #4a7c59; }',
        '.sdbg-badge--mock { background: #fdf0dd; color: #8a5416; border-color: #f4a261; }',
        '.sdbg-badge:hover { filter: brightness(0.96); }',
        '.sdbg-badge .sdbg-meta { font-weight: 500; text-transform: none; letter-spacing: 0; opacity: 0.85; }',
        '.sdbg-panel { position: fixed; top: 56px; right: 16px; width: min(560px, calc(100vw - 32px)); max-height: calc(100vh - 76px); pointer-events: auto; background: #14141f; color: #e8e8ef; border: 1px solid #33334a; border-radius: 10px; display: flex; flex-direction: column; box-shadow: 0 18px 50px rgba(0,0,0,0.45); font-size: 12px; }',
        '.sdbg-panel-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #2a2a3d; }',
        '.sdbg-panel-title { font-size: 14px; font-weight: 700; }',
        '.sdbg-panel-title span { display: block; font-size: 11px; font-weight: 400; color: #9a9aae; margin-top: 3px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }',
        '.sdbg-panel-close { background: none; border: none; color: #9a9aae; font-size: 18px; line-height: 1; cursor: pointer; padding: 0 2px; }',
        '.sdbg-panel-body { overflow: auto; padding: 14px 16px 18px; }',
        '.sdbg-section { margin-bottom: 16px; }',
        '.sdbg-section h4 { margin: 0 0 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #8f8fa6; font-weight: 700; }',
        '.sdbg-kv { display: grid; grid-template-columns: 110px 1fr; gap: 4px 10px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }',
        '.sdbg-kv dt { color: #8f8fa6; }',
        '.sdbg-kv dd { margin: 0; word-break: break-all; }',
        '.sdbg-pre { background: #0d0d16; border: 1px solid #2a2a3d; border-radius: 6px; padding: 10px; margin: 0; overflow: auto; max-height: 340px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; line-height: 1.5; color: #cfe8d8; white-space: pre; }',
        '.sdbg-list { list-style: none; margin: 0; padding: 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }',
        '.sdbg-list li { display: flex; justify-content: space-between; gap: 10px; padding: 3px 0; border-bottom: 1px solid #21212f; }',
        '.sdbg-list li span:last-child { color: #8f8fa6; }',
        '.sdbg-note { color: #9a9aae; line-height: 1.6; }',
        '.sdbg-roster { position: fixed; top: 52px; left: 50%; transform: translateX(-50%); pointer-events: auto; width: min(520px, calc(100vw - 32px)); max-height: 50vh; overflow: auto; background: #14141f; color: #e8e8ef; border: 1px solid #33334a; border-radius: 10px; box-shadow: 0 18px 50px rgba(0,0,0,0.45); font-size: 12px; padding: 8px; }',
        '.sdbg-roster-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 6px 8px; border-radius: 6px; cursor: pointer; }',
        '.sdbg-roster-row:hover { background: #21212f; }',
        '.sdbg-roster-row em { font-style: normal; color: #7a7a92; font-size: 10px; }',
        '.sdbg-tag { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9px; font-weight: 700; letter-spacing: 0.06em; padding: 2px 6px; border-radius: 4px; }',
        '.sdbg-tag--live { background: #1f6b3f; color: #e8f6ed; }',
        '.sdbg-tag--mock { background: #8a5416; color: #fdf0dd; }'
    ].join('\n');

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    function shortUrl(url) {
        try {
            var parsed = new URL(url, location.href);
            return parsed.pathname + parsed.search;
        } catch (e) {
            return url;
        }
    }

    // ------------------------------------------------------------------
    // Rendering
    // ------------------------------------------------------------------

    var lastSignature = null;

    /**
     * Re-scan on a timer, but only rebuild the badges when the component set,
     * their verdicts or their visibility actually changed. Keeps the overlay
     * current as panels open and close without flickering every second.
     */
    function refresh() {
        var components = window.__syntheaDebug.scan().components;
        var signature = components.map(function (c) {
            return c.name + '|' + c.isLive + '|' + c.visible + '|' + c.fetches.length;
        }).join(',');
        if (signature === lastSignature) {
            position();
            return;
        }
        render();
    }

    function render() {
        var result = window.__syntheaDebug.scan();
        var components = result.components;
        lastSignature = components.map(function (c) {
            return c.name + '|' + c.isLive + '|' + c.visible + '|' + c.fetches.length;
        }).join(',');
        var liveCount = components.filter(function (c) { return c.isLive; }).length;
        var hiddenCount = components.filter(function (c) { return !c.visible; }).length;

        // --- counter bar
        bar.textContent = '';
        var count = el('div', 'sdbg-count');
        count.innerHTML = '<b>' + liveCount + '</b> of ' + components.length + ' components live';
        bar.appendChild(count);

        var subText = hiddenCount
            ? hiddenCount + ' not currently on screen'
            : 'all on screen';
        bar.appendChild(el('div', 'sdbg-sub', subText));

        var listButton = el('button', null, listExpanded ? 'Hide list' : 'List');
        listButton.addEventListener('click', function () {
            listExpanded = !listExpanded;
            render();
        });
        bar.appendChild(listButton);

        var rescanButton = el('button', null, 'Rescan');
        rescanButton.addEventListener('click', function () { render(); });
        bar.appendChild(rescanButton);

        var closeButton = el('button', null, 'Close');
        closeButton.addEventListener('click', function () { toggle(false); });
        bar.appendChild(closeButton);

        // --- badges
        badgeHost.textContent = '';
        badges = [];
        components.forEach(function (component) {
            if (!component.visible) return;
            var node = el('div', 'sdbg-badge sdbg-badge--' + (component.isLive ? 'live' : 'mock'));
            node.appendChild(el('span', null, component.isLive ? 'LIVE' : 'MOCK'));

            if (component.isLive) {
                var latest = component.fetches[component.fetches.length - 1];
                var meta = shortUrl(latest.url) + ' · ' + (latest.bodyMs != null ? latest.bodyMs : latest.ms) + 'ms';
                if (component.fetches.length > 1) meta += ' · ×' + component.fetches.length;
                node.appendChild(el('span', 'sdbg-meta', meta));
            }

            node.title = component.name + ' — click for details';
            node.addEventListener('click', function (event) {
                event.stopPropagation();
                showDetail(component);
            });
            badgeHost.appendChild(node);
            badges.push({ node: node, component: component });
        });
        position();

        // --- roster
        var existingRoster = layer.querySelector('.sdbg-roster');
        if (existingRoster) existingRoster.remove();
        if (listExpanded) {
            var roster = el('div', 'sdbg-roster');
            components.forEach(function (component) {
                var row = el('div', 'sdbg-roster-row');
                var left = el('div');
                left.appendChild(el('div', null, component.name));
                left.appendChild(el('em', null, component.files.join(', ') + (component.visible ? '' : ' · off screen')));
                row.appendChild(left);
                row.appendChild(el('span', 'sdbg-tag sdbg-tag--' + (component.isLive ? 'live' : 'mock'), component.isLive ? 'LIVE' : 'MOCK'));
                row.addEventListener('click', function () { showDetail(component); });
                roster.appendChild(row);
            });
            layer.appendChild(roster);
        }
    }

    var INTERACTIVE = 'button, a, input, select, textarea, [role="button"], [onclick]';

    /** Topmost page element at a point, ignoring the debug layer itself. */
    function pageElementAt(x, y) {
        var stack = document.elementsFromPoint(x, y);
        for (var i = 0; i < stack.length; i++) {
            if (!stack[i].closest('#' + LAYER_ID)) return stack[i];
        }
        return null;
    }

    function overlaps(a, b) {
        return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
    }

    /**
     * Places each badge in its component's top corner while refusing to sit on
     * top of another badge or of any control the page owns, and hiding itself
     * when the component is covered by something else (an open panel, say).
     * The overlay must never intercept a click the page expects.
     */
    function position() {
        var placed = [];

        badges.forEach(function (badge) {
            var node = badge.node;
            var component = badge.component;
            var rect = window.__syntheaDebug.rectOf(component.el);

            var offscreen = rect.bottom < 0 || rect.top > window.innerHeight ||
                rect.right < 0 || rect.left > window.innerWidth || rect.width === 0;
            if (offscreen) { node.style.display = 'none'; return; }

            node.style.display = 'inline-flex';
            var width = node.offsetWidth;
            var height = node.offsetHeight || 20;

            var anchorTop = Math.max(4, Math.min(rect.top + 6, window.innerHeight - height - 4));
            var rightLeft = Math.max(4, Math.min(rect.right - width - 6, window.innerWidth - width - 4));
            var leftLeft = Math.max(4, Math.min(rect.left + 6, window.innerWidth - width - 4));

            var slots = [
                { top: anchorTop, left: rightLeft },
                { top: anchorTop + height + 4, left: rightLeft },
                { top: anchorTop, left: leftLeft },
                { top: anchorTop + height + 4, left: leftLeft }
            ];

            var chosen = null;
            var covered = false;

            for (var i = 0; i < slots.length; i++) {
                var slot = slots[i];
                var box = { top: slot.top, left: slot.left, right: slot.left + width, bottom: slot.top + height };

                if (placed.some(function (other) { return overlaps(box, other); })) continue;

                var probe = pageElementAt(slot.left + width / 2, slot.top + height / 2);
                if (!probe) continue;

                // Something else is painted over this component here.
                var withinComponent = probe === component.el || component.el.contains(probe) || probe.contains(component.el);
                if (!withinComponent) { covered = true; continue; }

                // Never park on one of the page's own controls.
                if (probe.closest && probe.closest(INTERACTIVE)) continue;

                chosen = { slot: slot, box: box };
                break;
            }

            if (!chosen) {
                if (covered) { node.style.display = 'none'; return; }
                // Nowhere clean: fall back to the top-right corner, nudged down
                // past whatever is in the way.
                chosen = {
                    slot: { top: anchorTop + height + 4, left: rightLeft },
                    box: { top: anchorTop + height + 4, left: rightLeft, right: rightLeft + width, bottom: anchorTop + 2 * height + 4 }
                };
            }

            node.style.top = chosen.slot.top + 'px';
            node.style.left = chosen.slot.left + 'px';
            placed.push(chosen.box);
        });
    }

    var positionQueued = false;
    function schedulePosition() {
        if (positionQueued) return;
        positionQueued = true;
        requestAnimationFrame(function () {
            positionQueued = false;
            position();
        });
    }

    // ------------------------------------------------------------------
    // Detail panel
    // ------------------------------------------------------------------

    function showDetail(component) {
        if (detail) detail.remove();
        detail = el('div', 'sdbg-panel');

        var head = el('div', 'sdbg-panel-head');
        var title = el('div', 'sdbg-panel-title', component.name);
        title.appendChild(el('span', null, component.files.join('\n')));
        head.appendChild(title);
        var close = el('button', 'sdbg-panel-close', '×');
        close.addEventListener('click', hideDetail);
        head.appendChild(close);
        detail.appendChild(head);

        var body = el('div', 'sdbg-panel-body');

        var verdict = el('div', 'sdbg-section');
        verdict.appendChild(el('h4', null, 'Verdict'));
        verdict.appendChild(el('div', 'sdbg-note', component.isLive
            ? 'LIVE — returned JSON from ' + component.fetches.length + ' request' + (component.fetches.length === 1 ? '' : 's') + ' during this page load.'
            : 'MOCK — no request returning data was observed during this page load.'));
        if (component.assetRequests.length) {
            verdict.appendChild(el('div', 'sdbg-note',
                'Also made ' + component.assetRequests.length + ' asset request' + (component.assetRequests.length === 1 ? '' : 's') +
                ' (' + component.assetRequests.map(function (r) { return shortUrl(r.url); }).join(', ') +
                ') — markup, not a data source, so they do not count towards LIVE.'));
        }
        body.appendChild(verdict);

        component.fetches.forEach(function (record) {
            var section = el('div', 'sdbg-section');
            section.appendChild(el('h4', null, 'Request #' + record.id));

            var kv = el('dl', 'sdbg-kv');
            [
                ['endpoint', record.method + ' ' + record.url],
                ['status', record.error ? 'failed — ' + record.error : record.status + (record.ok ? ' OK' : '')],
                ['response time', record.ms != null ? record.ms + 'ms to headers' + (record.bodyMs != null ? ', ' + record.bodyMs + 'ms to full body' : '') : '—'],
                ['started', record.startedAt]
            ].forEach(function (pair) {
                kv.appendChild(el('dt', null, pair[0]));
                kv.appendChild(el('dd', null, pair[1]));
            });
            if (record.requestBody) {
                kv.appendChild(el('dt', null, 'request'));
                kv.appendChild(el('dd', null, record.requestBody));
            }
            section.appendChild(kv);

            var pre = el('pre', 'sdbg-pre');
            if (record.body == null) {
                pre.textContent = record.error ? 'No response body (request failed).' : 'Response body not captured yet.';
            } else {
                pre.textContent = record.bodyIsJson ? JSON.stringify(record.body, null, 2) : String(record.body);
            }
            section.appendChild(pre);
            body.appendChild(section);
        });

        var reads = el('div', 'sdbg-section');
        reads.appendChild(el('h4', null, 'unified-data.js reads (by this component\u2019s source files)'));
        if (component.reads.length) {
            var list = el('ul', 'sdbg-list');
            component.reads.slice(0, 40).forEach(function (read) {
                var item = el('li');
                item.appendChild(el('span', null, read.path));
                item.appendChild(el('span', null, '×' + read.count));
                list.appendChild(item);
            });
            reads.appendChild(list);
            if (component.reads.length > 40) {
                reads.appendChild(el('div', 'sdbg-note', '+ ' + (component.reads.length - 40) + ' more paths'));
            }
        } else {
            reads.appendChild(el('div', 'sdbg-note',
                'No direct reads of the unified-data.js object graph were recorded for this component. It renders from static markup in demo.html, from a global the data adapter derived earlier, or from values copied before this overlay was installed.'));
        }
        body.appendChild(reads);

        detail.appendChild(body);
        layer.appendChild(detail);
    }

    function hideDetail() {
        if (detail) { detail.remove(); detail = null; }
    }

    // ------------------------------------------------------------------
    // Toggle
    // ------------------------------------------------------------------

    function build() {
        var style = el('style');
        style.textContent = STYLES;
        document.head.appendChild(style);

        layer = el('div');
        layer.id = LAYER_ID;
        badgeHost = el('div');
        layer.appendChild(badgeHost);
        bar = el('div', 'sdbg-bar');
        layer.appendChild(bar);
        document.body.appendChild(layer);
    }

    function toggle(next) {
        open = next == null ? !open : next;

        window.removeEventListener('scroll', schedulePosition, true);
        window.removeEventListener('resize', schedulePosition);
        clearInterval(repositionTimer);

        if (open) {
            if (!layer) build();
            layer.style.display = '';
            lastSignature = null;
            render();
            window.addEventListener('scroll', schedulePosition, true);
            window.addEventListener('resize', schedulePosition);
            repositionTimer = setInterval(refresh, 700);
        } else if (layer) {
            hideDetail();
            listExpanded = false;
            layer.style.display = 'none';
        }
    }

    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.shiftKey && (event.key === 'D' || event.key === 'd')) {
            event.preventDefault();
            toggle();
            return;
        }
        // Only swallow Escape while our own panel is open, so the page's own
        // Escape handling is untouched the rest of the time.
        if (event.key === 'Escape' && open && detail) {
            event.stopPropagation();
            hideDetail();
        }
    }, true);

    window.__syntheaDebug.toggle = toggle;
    console.log('%cDebug overlay ready — press Ctrl+Shift+D', 'color:#4a7c59;font-weight:600');
}());
