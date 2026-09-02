#!/usr/bin/env python3
"""Prove the three badge states on screen: MOCK, PENDING and ERROR.

  python3 prove_badges.py

styles/utilities.css killed `div::before` with !important to remove a vignette,
and every module root on demo.html is a div, so the resolver's badge painted on
exactly one element in the page - <header>, the only root that is not a div.
That rule is now scoped to the page containers a vignette can attach to.

Three passes, each screenshotted:

  live    the ordinary page. Panels that fetched successfully stamp `live` and
          carry no badge by design; anything still waiting shows PENDING.
  error   the same page with the API base pointed at a dead port, so every
          fetch genuinely fails. This is not a simulated state: the components
          take their real error path and the resolver stamps what it saw.
  vision  the mock exhibit, every module MOCK.

For each element it records the state the resolver stamped, whether the badge
actually paints, and whether the old rule would have suppressed it - which is
the list of elements that newly show a badge.
"""
import asyncio, base64, json, os, subprocess, sys, time, urllib.request
import websockets

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE = "http://localhost:5173/demo.html"
PORT = 9415
DEAD_API = "http://127.0.0.1:9"

SCAN = r"""
(() => {
  const clean = s => (s || '').replace(/\s+/g, ' ').trim();
  const rows = [...document.querySelectorAll('[data-synthea-source]')].map(e => {
    const cs = getComputedStyle(e, '::before');
    const r = e.getBoundingClientRect();
    const tag = e.tagName.toLowerCase();
    return {
      el: e.id || (e.className || '').toString().trim().split(/\s+/)[0] || tag,
      tag: tag,
      state: e.getAttribute('data-synthea-source'),
      detail: e.getAttribute('data-synthea-detail'),
      badge: cs.content !== 'none' && cs.display !== 'none' ? cs.content.replace(/"/g, '') : null,
      // The old rule was `div::after, div::before, aside::after, aside::before,
      // body/html/main/.container`. Anything matching those was suppressed.
      wasSuppressed: tag === 'div' || tag === 'aside' || tag === 'main'
                     || tag === 'body' || tag === 'html'
                     || e.classList.contains('container'),
      visible: !!(e.offsetParent || e.getClientRects().length) && r.width > 1,
      // First line of what the panel says, so the badge can be read for truth
      // against the thing it is badging.
      says: clean(e.innerText).slice(0, 90)
    };
  });
  return {
    mode: (window.SyntheaData && window.SyntheaData.isVision()) ? 'vision' : 'live',
    counts: rows.reduce((a, r) => { a[r.state] = (a[r.state] || 0) + 1; return a; }, {}),
    painted: rows.filter(r => r.badge).length,
    rows: rows
  };
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


async def pass_(c, name, mode, out_dir, dead_api=False, settle=22):
    # A dead API base is installed before any page script, so every component
    # takes its real failure path rather than being told to look failed.
    src = (f"window.SYNTHEA_API_BASE = {json.dumps(DEAD_API)};"
           if dead_api else "delete window.SYNTHEA_API_BASE;")
    ident = await c.send("Page.addScriptToEvaluateOnNewDocument", source=src)
    await c.send("Page.navigate", url=f"{BASE}?data={mode}")
    await asyncio.sleep(settle)
    data = await c.js(SCAN)
    shots = 0
    h = await c.js("document.body.scrollHeight")
    for y in range(0, min(h, 6000), 900):
        await c.js(f"window.scrollTo(0,{y});1"); await asyncio.sleep(0.6)
        s = await c.send("Page.captureScreenshot", format="png")
        open(f"{out_dir}/{name}-{shots:02d}.png", "wb").write(base64.b64decode(s["data"]))
        shots += 1
    await c.send("Page.removeScriptToEvaluateOnNewDocument",
                 identifier=ident["identifier"])
    print(f"  {name:6} states={data['counts']} badges painted={data['painted']} "
          f"({shots} shots)")
    return data


async def run():
    out_dir = "docs/ui-acceptance/finding6-live-repair-2026-09-03"
    os.makedirs(out_dir, exist_ok=True)
    proc = subprocess.Popen(
        [CHROME, f"--remote-debugging-port={PORT}", "--headless=new", "--hide-scrollbars",
         "--window-size=1440,1000", "--no-first-run", "--disable-gpu",
         "--user-data-dir=" + os.path.expanduser("~/.cache/synthea-badges"), "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    out = {}
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

            out["live"] = await pass_(c, "live", "live", out_dir)
            out["error"] = await pass_(c, "error", "live", out_dir, dead_api=True, settle=26)
            out["vision"] = await pass_(c, "vision", "vision", out_dir)

        json.dump(out, open(f"{out_dir}/badges.json", "w"), indent=1)
        print(f"wrote {out_dir}/badges.json")
    finally:
        proc.terminate()


asyncio.run(run())
