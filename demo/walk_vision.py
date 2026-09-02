#!/usr/bin/env python3
"""Walk the Vision page and record what every module actually renders.

  python3 walk_vision.py before|after

Finding 6 acceptance. For every top-level module on the Vision page this records
its heading, whether it carries a MOCK badge, whether it is empty, whether it is
showing an error or a retry control, and its first line of visible text.

It also runs the Live-mode wall audit in the same pass: whether any mock script
is loaded, whether the mock dataset is reachable from the page, and the
panel-identity numbers Live must not move by a digit.
"""
import asyncio, base64, json, os, subprocess, sys, time, urllib.request
import websockets

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE = "http://localhost:5173/demo.html"
PORT = 9410

VISION_WALK = r"""
(() => {
  const clean = s => (s || '').replace(/\s+/g, ' ').trim();
  const mods = [...document.querySelectorAll('main > *, .sidebar > *, aside > *')];
  const seen = new Set();
  const out = [];
  mods.forEach(m => {
    if (!m || seen.has(m)) return; seen.add(m);
    const txt = clean(m.innerText);
    const h = m.querySelector('h1,h2,h3,.section-title,.briefings-live-section-title');
    out.push({
      tag: m.tagName.toLowerCase(),
      id: m.id || null,
      cls: (m.className || '').toString().slice(0, 60),
      heading: clean(h ? h.textContent : '') || null,
      // The MOCK badge is a CSS ::before on [data-synthea-source="vision"], not
      // an element. An earlier version of this walk looked for a .synthea-badge
      // node, found none anywhere, and reported "0 badges" on a page that in
      // fact had three. Read the attribute the CSS reads.
      badge: m.getAttribute('data-synthea-source') === 'vision'
             || !!m.querySelector('[data-synthea-source="vision"]'),
      state: m.getAttribute('data-synthea-source')
             || ((m.querySelector('[data-synthea-source]') || {}).getAttribute
                 ? m.querySelector('[data-synthea-source]').getAttribute('data-synthea-source')
                 : null),
      empty: txt.length === 0,
      height: Math.round(m.getBoundingClientRect().height),
      hasError: /could not be loaded|failed to load|unavailable|try again|retry/i.test(txt),
      hasRetry: !!m.querySelector('button[class*="retry"], .nsl-retry, .nfl-retry'),
      unbuilt: !!m.querySelector('.synthea-unbuilt'),
      firstLine: txt.split('. ')[0].slice(0, 110)
    });
  });
  return {
    mode: (window.SyntheaData && window.SyntheaData.isVision && window.SyntheaData.isVision())
          ? 'vision' : 'live',
    banner: clean((document.querySelector('.synthea-vision-banner') || {}).innerText),
    modules: out,
    badged: [...document.querySelectorAll('[data-synthea-source="vision"]')]
              .map(e => e.id || (e.className || '').toString().trim().split(/\s+/)[0]),
    gaps: (window.SyntheaData && window.SyntheaData.visionGaps) ? window.SyntheaData.visionGaps() : null,
    mockScripts: [...document.scripts].filter(e => e.getAttribute('data-synthea-mock'))
                   .map(e => e.src.split('/').pop().split('?')[0]),
    confidenceTheatre: document.querySelectorAll('.confidence-bar, .signal-strength').length,
    // Only what a reader can actually see: hidden panels carry their Live error
    // markup until they are opened, and the click audit below opens them.
    errorsVisible: [...document.querySelectorAll('*')].filter(e =>
        e.children.length === 0
        && /could not be loaded|failed to load|unavailable|try again/i.test(e.textContent || '')
        && (e.offsetParent || e.getClientRects().length)
      ).map(e => clean(e.textContent).slice(0, 90))
  };
})()
"""

WALL_AUDIT = r"""
(() => {
  const scripts = [...document.scripts].map(s => s.src || '(inline)');
  const mockScripts = scripts.filter(s => /unified-data|mock|demo-data|data-furniture/i.test(s));
  return {
    mode: (window.SyntheaData && window.SyntheaData.isLive && window.SyntheaData.isLive())
          ? 'live' : 'vision',
    mockScriptsLoaded: mockScripts,
    mockGlobals: ['unifiedData','demoData','mockData','tickerData','UNIFIED_DATA']
                   .filter(k => typeof window[k] !== 'undefined'),
    visionBanner: !!document.querySelector('.synthea-vision-banner'),
    // Panel identity: the numbers Live must not move by a digit.
    identity: {
      headerStats: (document.querySelector('.header-metrics-inner')||{}).innerText || null,
      dwSpan: (document.querySelector('.dw-span')||{}).textContent || null,
      cardValues: [...document.querySelectorAll('.nsl-card-value')].map(e=>e.textContent),
      cardTitles: [...document.querySelectorAll('.nsl-card-title')].map(e=>e.textContent),
      feedTitle: (document.querySelector('.nfl-period')||{}).textContent || null,
      feedRows: document.querySelectorAll('.nfl-list > *').length,
      pulseSubtitle: (document.querySelector('.section-subtitle')||{}).textContent || null
    }
  };
})()
"""



# Interaction audit. UI_ACCEPTANCE.md section 2: record what each control
# ACTUALLY DID, not that it exists. Each entry clicks one control and reports
# the surface it opened plus any Live-mode failure copy visible afterwards.
CLICKS = [
    ("Pulse: time range (7d)",       "#narrative-pulse-container [data-action='toggleTimeRange']"),
    ("Pulse: customise topics",      "#narrative-pulse-container [data-action='customizeTopics']"),
    ("Pulse: share",                 "#narrative-pulse-container [data-action='shareChart']"),
    ("Pulse: a topic in the legend", "#narrative-pulse-container .pulse-legend .legend-item"),
    ("Signals: first card",          ".signal-card"),
    ("Briefings: a card",            "#priority-briefings-container .briefing-card"),
    ("Briefings: show more",         "#priority-briefings-container .show-more-btn, "
                                     "#priority-briefings-container .show-more-container button"),
    ("Briefings: all briefings",     "#priority-briefings-container .view-all-link"),
    ("Weekly Brief: expand",         "#expandBriefBtn"),
    ("Weekly Brief: download PDF",   "#downloadBriefBtn"),
    ("Feed: a row",                  "#narrative-feed-container .feed-container > *"),
    ("Header: search",               ".search-input, #searchInput"),
]

CLICK_JS = r"""
(sel => {
  const clean = s => (s || '').replace(/\s+/g, ' ').trim();
  const el = document.querySelector(sel);
  if (!el) return { found: false };
  el.click();
  return { found: true, label: clean(el.textContent).slice(0, 34) };
})
"""

# An overlay in this page is present in the DOM at all times and opened by an
# `active` class, so presence is not openness. The first version of this audit
# tested for client rects and reported every panel open on every click, which
# is the same class of mistake as reading a label for presence rather than for
# truth. Test what the component actually toggles.
AFTER_CLICK_JS = r"""
(() => {
  const clean = s => (s || '').replace(/\s+/g, ' ').trim();
  const shown = e => {
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    const r = e.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  const opened = [...document.querySelectorAll(
      '.search-panel, .episode-library-overlay, .signal-panel, .drilldown-panel, ' +
      '#episodePanel, .episode-panel, .share-menu, .customization-panel, .topic-drilldown')]
      .filter(e => shown(e) && /(^|\s)(active|is-open|open)(\s|$)/.test(e.className || ''))
      .map(e => e.id || (e.className || '').toString().trim().split(/\s+/)[0]);
  const bad = [...document.querySelectorAll('*')].filter(e =>
      e.children.length === 0 && shown(e)
      && /could not be loaded|failed to load|unavailable|try again/i.test(e.textContent || ''))
      .map(e => clean(e.textContent).slice(0, 80));
  return { opened: opened, liveErrorCopy: [...new Set(bad)] };
})()
"""

class CDP:
    def __init__(self, ws):
        self.ws, self.n = ws, 0

    async def send(self, method, **params):
        self.n += 1
        await self.ws.send(json.dumps({"id": self.n, "method": method, "params": params}))
        while True:
            m = json.loads(await self.ws.recv())
            if m.get("id") == self.n:
                if "error" in m:
                    raise RuntimeError(f"{method}: {m['error']}")
                return m.get("result", {})

    async def js(self, expr):
        r = await self.send("Runtime.evaluate", expression=expr, returnByValue=True,
                            awaitPromise=True)
        return r.get("result", {}).get("value")


async def run(phase):
    out_dir = f"docs/ui-acceptance/finding6-vision-2026-09-02/{phase}"
    os.makedirs(out_dir, exist_ok=True)
    proc = subprocess.Popen(
        [CHROME, f"--remote-debugging-port={PORT}", "--headless=new", "--hide-scrollbars",
         "--window-size=1440,1000", "--no-first-run", "--disable-gpu",
         "--user-data-dir=" + os.path.expanduser("~/.cache/synthea-vision"), "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    result = {}
    try:
        for _ in range(60):
            try:
                page = [t for t in json.load(urllib.request.urlopen(
                    f"http://127.0.0.1:{PORT}/json/list")) if t["type"] == "page"][0]
                break
            except Exception:
                time.sleep(0.5)
        else:
            sys.exit("chrome did not come up")

        async with websockets.connect(page["webSocketDebuggerUrl"],
                                      max_size=80 * 1024 * 1024) as ws:
            c = CDP(ws)
            for m in ("Page.enable", "Runtime.enable", "Network.enable"):
                await c.send(m)
            await c.send("Network.setCacheDisabled", cacheDisabled=True)
            await c.send("Emulation.setDeviceMetricsOverride", width=1440, height=1000,
                         deviceScaleFactor=2, mobile=False)

            # ---- Vision
            await c.send("Page.navigate", url=BASE + "?data=vision")
            await asyncio.sleep(22)
            result["vision"] = await c.js(VISION_WALK)

            audit = []
            for name, sel in CLICKS:
                r = await c.js(f"{CLICK_JS}({json.dumps(sel)})")
                if not r or not r.get("found"):
                    audit.append({"control": name, "result": "not present"})
                    continue
                await asyncio.sleep(1.6)
                after = await c.js(AFTER_CLICK_JS)
                audit.append({"control": name, "label": r.get("label"), **(after or {})})
                # Close whatever opened, so the next click starts from the page.
                await c.js("document.body.dispatchEvent("
                           "new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));"
                           "document.dispatchEvent("
                           "new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));1")
                await asyncio.sleep(0.6)
            result["clicks"] = audit
            for a in audit:
                print(f"  click {a['control']:32} -> {a.get('result') or (a.get('opened') or 'in place')}"
                      + (f"  LIVE-ERROR {a['liveErrorCopy']}" if a.get("liveErrorCopy") else ""))

            await c.js("location.reload();1"); await asyncio.sleep(18)
            full = await c.send("Page.captureScreenshot", format="png", captureBeyondViewport=False)
            open(f"{out_dir}/vision-top.png", "wb").write(base64.b64decode(full["data"]))
            h = await c.js("document.body.scrollHeight")
            shots = 0
            for y in range(0, min(h, 9000), 900):
                await c.js(f"window.scrollTo(0,{y});1"); await asyncio.sleep(0.6)
                s = await c.send("Page.captureScreenshot", format="png")
                open(f"{out_dir}/vision-{shots:02d}.png", "wb").write(base64.b64decode(s["data"]))
                shots += 1
            v = result["vision"]
            print(f"  vision: {len(v['modules'])} modules, {len(v['badged'])} badged, "
                  f"gaps {v['gaps']}, mock scripts {v['mockScripts']}, "
                  f"confidence theatre {v['confidenceTheatre']}, "
                  f"visible errors {v['errorsVisible']}, {shots} screenshots, page {h}px")

            # ---- Live wall audit
            await c.send("Page.navigate", url=BASE + "?data=live")
            await asyncio.sleep(25)
            result["live"] = await c.js(WALL_AUDIT)
            await c.js("window.scrollTo(0,0);1"); await asyncio.sleep(0.5)
            s = await c.send("Page.captureScreenshot", format="png")
            open(f"{out_dir}/live-top.png", "wb").write(base64.b64decode(s["data"]))
            print(f"  live: mock scripts {result['live']['mockScriptsLoaded']}, "
                  f"mock globals {result['live']['mockGlobals']}")

        json.dump(result, open(f"{out_dir}/walk.json", "w"), indent=1)
        print(f"wrote {out_dir}/walk.json")
    finally:
        proc.terminate()


asyncio.run(run(sys.argv[1] if len(sys.argv) > 1 else "before"))
