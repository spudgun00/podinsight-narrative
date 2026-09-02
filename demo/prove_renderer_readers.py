#!/usr/bin/env python3
"""Who actually calls window.renderBriefingCards? Proven by running the page.

  python3 prove_renderer_readers.py

The shared briefing-card renderer was deleted on 27 Aug 2026 as "read by nothing
since the live cards replaced it". A text search agreed with that: the surviving
call sites are behind `window.` on a global, in two files nobody was looking at.
Two things read it, and both broke - the Vision mock briefings went blank and the
Episode Library's card view in LIVE rendered "Shared renderer not loaded."

So this does not search. It installs a property trap on `window` BEFORE any page
script runs, wraps the real function the moment it is defined, and records the
call stack of every caller while both modes are driven through the surfaces that
could reach it. What comes out is a list of readers observed, not inferred.
"""
import asyncio, base64, json, os, subprocess, sys, time, urllib.request
import websockets

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE = "http://localhost:5173/demo.html"
PORT = 9414

# Installed before any page script. A setter trap is the only way to see the
# definition happen: the file assigns straight to window.renderBriefingCards.
TRAP = r"""
(() => {
  window.__rbcCalls = [];
  let real = undefined;
  Object.defineProperty(window, 'renderBriefingCards', {
    configurable: true,
    get() {
      if (!real) return undefined;
      return function (...args) {
        const stack = (new Error()).stack || '';
        window.__rbcCalls.push({
          episodes: Array.isArray(args[0]) ? args[0].length : null,
          // Frame 2 is the caller; frame 1 is this wrapper.
          caller: stack.split('\n').slice(2, 4).map(s => s.trim()).join(' <- ')
        });
        return real.apply(this, args);
      };
    },
    set(v) { real = v; }
  });
})()
"""

REPORT = r"""
(() => {
  const seen = {};
  (window.__rbcCalls || []).forEach(c => {
    const m = /https?:\/\/[^\s)]*\/([^\/\s)?]+)(\?[^\s)]*)?:(\d+):\d+/.exec(c.caller || '');
    const key = m ? `${m[1]}:${m[3]}` : (c.caller || 'unknown').slice(0, 90);
    seen[key] = (seen[key] || 0) + 1;
  });
  return { defined: typeof window.renderBriefingCards,
           callCount: (window.__rbcCalls || []).length,
           callers: seen,
           samples: (window.__rbcCalls || []).slice(0, 3) };
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


async def drive(c, mode, out_dir):
    """Load one mode and touch every surface that could render a briefing card."""
    await c.send("Page.navigate", url=f"{BASE}?data={mode}")
    await asyncio.sleep(20)
    # Priority Briefings renders on load in Vision; in Live the live component
    # owns that container, so the only reader left is the library.
    await c.js("window.EpisodeLibrary && window.EpisodeLibrary.open();1")
    await asyncio.sleep(3)
    await c.js("window.EpisodeLibrary && window.EpisodeLibrary.setViewMode('cards');1")
    await asyncio.sleep(3)
    shot = await c.send("Page.captureScreenshot", format="png")
    open(f"{out_dir}/library-cards-{mode}.png", "wb").write(base64.b64decode(shot["data"]))
    state = await c.js("""(() => {
      const clean = s => (s||'').replace(/\\s+/g,' ').trim();
      const ov = document.querySelector('.episode-library-overlay');
      return {
        cards: document.querySelectorAll('.episode-library-cards-grid .briefing-card').length,
        apology: /Shared renderer not loaded/i.test(ov ? ov.innerText : ''),
        stats: clean((document.querySelector('.library-stats')||{}).textContent),
        firstCard: clean(((document.querySelector('.episode-library-cards-grid .briefing-card'))||{}).innerText).slice(0,110)
      };
    })()""")
    report = await c.js(REPORT)
    await c.js("window.EpisodeLibrary && window.EpisodeLibrary.close && window.EpisodeLibrary.close();1")
    return {"mode": mode, "library": state, "renderer": report}


async def run():
    out_dir = "docs/ui-acceptance/finding6-live-repair-2026-09-03"
    os.makedirs(out_dir, exist_ok=True)
    proc = subprocess.Popen(
        [CHROME, f"--remote-debugging-port={PORT}", "--headless=new", "--hide-scrollbars",
         "--window-size=1440,1000", "--no-first-run", "--disable-gpu",
         "--user-data-dir=" + os.path.expanduser("~/.cache/synthea-readers"), "about:blank"],
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
            await c.send("Page.addScriptToEvaluateOnNewDocument", source=TRAP)

            for mode in ("live", "vision"):
                r = await drive(c, mode, out_dir)
                result[mode] = r
                print(f"  {mode}: cards={r['library']['cards']} "
                      f"apology={r['library']['apology']} "
                      f"renderer calls={r['renderer']['callCount']} "
                      f"callers={list(r['renderer']['callers'])}")

        json.dump(result, open(f"{out_dir}/renderer-readers.json", "w"), indent=1)
        print(f"wrote {out_dir}/renderer-readers.json")
    finally:
        proc.terminate()


asyncio.run(run())
