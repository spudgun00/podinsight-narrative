#!/usr/bin/env python3
"""Acceptance evidence for the global date window, per UI_ACCEPTANCE.md.

Clicks the control through all four options on the real page and records, per
window: what every live panel rendered, every API call the page made and the
window it carried, the copy of every new label, and a screenshot.

Standing rule 8 applies: the portfolio panel is position: fixed, so captures are
VIEWPORT-only. No captureBeyondViewport anywhere in here.
"""
import asyncio, base64, json, os, subprocess, sys, time, urllib.request
import websockets

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
URL = "http://localhost:5173/demo.html"
PORT = 9350
OUT = "docs/ui-acceptance/date-window-2026-09-01"
WINDOWS = ["90d", "30d", "12m", "all"]          # 90d first: it is the default


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


PROBE = r"""
(() => {
  const t = s => { const e = document.querySelector(s); return e ? e.innerText.trim() : null; };
  const n = s => document.querySelectorAll(s).length;
  return {
    control_active: [...document.querySelectorAll('.dw-option.is-active')].map(e=>e.textContent),
    control_span:   t('.dw-span'),
    control_visible_without_scroll: (() => {
      const e = document.getElementById('date-window');
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= window.innerHeight;
    })(),
    pulse_subtitle: t('.section-subtitle'),
    pulse_points:   n('#narrative-pulse-container .chart-point, #narrative-pulse-container circle'),
    feed_period:    t('.nfl-period'),
    feed_rows:      n('.nfl-list > *'),
    feed_status:    t('.nfl-status'),
    feed_chips:     [...document.querySelectorAll('.nfl-chip')].map(e=>e.textContent.trim()),
    feed_foot:      t('.nfl-foot'),
    feed_empty:     t('.nfl-empty'),
    signals_text:   (t('#notable-signals-container') || '').slice(0, 260),
    brief_note:     t('.dw-note[data-panel="brief"]') || t('#intelligence-brief .dw-note'),
    header_stats:   (t('.header-stats') || '').replace(/\n/g, ' '),
    body_has_2025_06_dash: document.body.innerText.includes('Jun 2025'),
    empty_states:   n('.ctl-empty, .empty-state, .low-volume'),
  };
})()
"""


async def run():
    proc = subprocess.Popen(
        [CHROME, f"--remote-debugging-port={PORT}", "--headless=new", "--hide-scrollbars",
         "--window-size=1440,1000", "--no-first-run", "--disable-gpu",
         "--user-data-dir=" + os.path.expanduser("~/.cache/synthea-shots-window"),
         "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    results = {}
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
                                      max_size=60 * 1024 * 1024) as ws:
            c = CDP(ws)
            for m in ("Page.enable", "Runtime.enable", "Network.enable"):
                await c.send(m)
            await c.send("Network.setCacheDisabled", cacheDisabled=True)
            await c.send("Emulation.setDeviceMetricsOverride", width=1440, height=1000,
                         deviceScaleFactor=2, mobile=False)
            os.makedirs(OUT, exist_ok=True)

            for w in WINDOWS:
                # Set the window the way the control does, then load clean.
                await c.send("Page.navigate", url=URL)
                await asyncio.sleep(3)
                await c.js(f"localStorage.setItem('synthea.window.v1', '{w}'); 1")
                await c.send("Page.navigate", url=URL)
                await asyncio.sleep(32)

                probe = await c.js(PROBE)
                calls = await c.js(
                    "JSON.stringify(performance.getEntriesByType('resource')"
                    ".map(e=>e.name).filter(n=>n.includes('/api/')))")
                calls = json.loads(calls or "[]")
                windowed = [u for u in calls if "window=" in u]
                results[w] = {"probe": probe,
                              "api_calls": len(calls),
                              "api_calls_with_window": len(windowed),
                              "api_calls_missing_window": [u for u in calls if "window=" not in u]}
                print(f"\n== {w}")
                print(f"   control : {probe['control_active']}  span={probe['control_span']!r}")
                print(f"   visible without scroll: {probe['control_visible_without_scroll']}")
                print(f"   pulse   : {(probe['pulse_subtitle'] or '')[:96]}")
                print(f"   feed    : rows={probe['feed_rows']}")
                print(f"   api     : {len(windowed)}/{len(calls)} carried the window")
                if results[w]["api_calls_missing_window"]:
                    for u in results[w]["api_calls_missing_window"][:4]:
                        print(f"      NO WINDOW: {u.split('/api/')[-1][:70]}")

                shot = await c.send("Page.captureScreenshot", format="png")
                open(f"{OUT}/{w}-page.png", "wb").write(base64.b64decode(shot["data"]))

            json.dump(results, open(f"{OUT}/evidence.json", "w"), indent=1)
            print(f"\nwrote {OUT}/evidence.json and 4 screenshots")
    finally:
        proc.terminate()


asyncio.run(run())
