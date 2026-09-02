#!/usr/bin/env python3
"""Acceptance capture for tour findings 2-4, per UI_ACCEPTANCE.md.

  python3 shoot_tour.py before|after

Captures, in all four windows at 1440x1000: a full-page screenshot, the header
region, the Notable Signals region, and the feed region; plus the DOM text of
every label the copy check has to read for truth.

Standing rule 8: viewport-only captures. The portfolio panel is position: fixed
and captureBeyondViewport relays it against the full page.
"""
import asyncio, base64, json, os, subprocess, sys, time, urllib.request
import websockets

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
URL = "http://localhost:5173/demo.html"
PORT = 9380
WINDOWS = ["90d", "30d", "12m", "all"]


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
  const all = s => [...document.querySelectorAll(s)].map(e => e.innerText.trim());
  const card = c => ({
    title: (c.querySelector('.nsl-card-title')||{}).textContent,
    value: (c.querySelector('.nsl-card-value')||{}).textContent || null,
    label: (c.querySelector('.nsl-card-label')||{}).textContent || null,
    notes: [...c.querySelectorAll('.nsl-card-note')].map(e=>e.textContent),
    rows:  [...c.querySelectorAll('.nsl-move-row')].map(e=>e.innerText.replace(/\n/g,' ')),
    info:  !!c.querySelector('.nsl-info'),
    face_text: c.innerText.trim()
  });
  return {
    header_text:   t('header'),
    header_height: (() => { const e=document.querySelector('header');
                            return e ? Math.round(e.getBoundingClientRect().height) : null; })(),
    dw_span:       t('.dw-span'),
    dw_active:     all('.dw-option.is-active'),
    signals_cards: [...document.querySelectorAll('.nsl-card')].map(card),
    feed_title:    t('.narrative-feed .section-title, #narrative-feed-container .section-title'),
    feed_period:   t('.nfl-period'),
    feed_rows:     document.querySelectorAll('.nfl-list > *').length,
    feed_foot:     t('.nfl-foot'),
    feed_more:     t('.nfl-more'),
    banned: {
      confidence: /\b\d+%\s*confidence|confidence[:\s]*\d+%/i.test(document.body.innerText),
      sentiment:  /\bsentiment\b/i.test(document.body.innerText),
      lp:         /\bLP sentiment\b/i.test(document.body.innerText)
    }
  };
})()
"""


async def shoot(c, sel, path, min_h=200):
    box = await c.js("JSON.stringify((()=>{const e=document.querySelector('" + sel + "');"
                     "if(!e)return null;e.scrollIntoView({block:'center'});"
                     "const r=e.getBoundingClientRect();"
                     "return{x:r.x,y:r.y,w:r.width,h:r.height};})())")
    b = json.loads(box or "null")
    if not b:
        return False
    await asyncio.sleep(1.2)
    b = json.loads(await c.js("JSON.stringify((()=>{const e=document.querySelector('" + sel + "');"
                              "const r=e.getBoundingClientRect();"
                              "return{x:r.x,y:r.y,w:r.width,h:r.height};})())"))
    shot = await c.send("Page.captureScreenshot", format="png", clip={
        "x": max(0, b["x"] - 8), "y": max(0, b["y"] - 8),
        "width": min(b["w"] + 16, 1440),
        "height": min(max(b["h"] + 16, min_h), 1000), "scale": 1})
    open(path, "wb").write(base64.b64decode(shot["data"]))
    return True


async def run(phase):
    out = f"docs/ui-acceptance/tour-findings-2026-09-02/{phase}"
    os.makedirs(out, exist_ok=True)
    proc = subprocess.Popen(
        [CHROME, f"--remote-debugging-port={PORT}", "--headless=new", "--hide-scrollbars",
         "--window-size=1440,1000", "--no-first-run", "--disable-gpu",
         "--user-data-dir=" + os.path.expanduser("~/.cache/synthea-tour"), "about:blank"],
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
                                      max_size=80 * 1024 * 1024) as ws:
            c = CDP(ws)
            for m in ("Page.enable", "Runtime.enable", "Network.enable"):
                await c.send(m)
            await c.send("Network.setCacheDisabled", cacheDisabled=True)
            await c.send("Emulation.setDeviceMetricsOverride", width=1440, height=1000,
                         deviceScaleFactor=2, mobile=False)

            for w in WINDOWS:
                await c.send("Page.navigate", url=URL); await asyncio.sleep(3)
                await c.js(f"localStorage.setItem('synthea.window.v1','{w}');1")
                await c.send("Page.navigate", url=URL); await asyncio.sleep(30)

                results[w] = await c.js(PROBE)
                await c.js("window.scrollTo(0,0);1"); await asyncio.sleep(0.8)
                shot = await c.send("Page.captureScreenshot", format="png")
                open(f"{out}/{w}-page.png", "wb").write(base64.b64decode(shot["data"]))
                await shoot(c, "header", f"{out}/{w}-header.png", 120)
                await shoot(c, ".nsl-grid, .signals-grid", f"{out}/{w}-signals.png", 240)
                await shoot(c, "#narrative-feed-container", f"{out}/{w}-feed.png", 260)
                h = results[w]["header_height"]
                nc = len(results[w]["signals_cards"])
                print(f"  {w:4} header={h}px  signal cards={nc}  feed rows={results[w]['feed_rows']}"
                      f"  banned={results[w]['banned']}")

            json.dump(results, open(f"{out}/probe.json", "w"), indent=1)
            print(f"wrote {out}/")
    finally:
        proc.terminate()


asyncio.run(run(sys.argv[1] if len(sys.argv) > 1 else "before"))
