#!/usr/bin/env python3
"""Screenshot the Company Tracking metrics line, before and after the fix.

Drives the chrome-headless-shell already on this machine over CDP. Standing
rule 8 applies: the portfolio panel is position: fixed, so this captures the
VIEWPORT only - captureBeyondViewport relays fixed elements against the full
page and has produced wrong screenshots in this project before.

  python3 shoot_range_fix.py <label> <outdir>

Assumes the demo is served on :5173 and the API on :8000.
"""
import asyncio, base64, json, os, subprocess, sys, time
import urllib.request

import websockets

# The bundled chrome-headless-shell will not start here - it dies on
# "bootstrap_look_up org.chromium.Chromium.MachPortRendezvousServer" before it
# opens a debugging port. The installed Google Chrome does start, so use it.
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
URL = "http://localhost:5173/demo.html"
PORT = 9333
WATCHLIST = [{"name": "Google"}, {"name": "Stripe"}]
# States, per UI_ACCEPTANCE.md 3. "empty" is no watchlist; "apidown" points the
# page at a port nothing listens on, which is what a user sees when the API is
# unreachable.
STATES = {
    "before":  {"watchlist": WATCHLIST, "api": None},
    "after":   {"watchlist": WATCHLIST, "api": None},
    "empty":   {"watchlist": [],        "api": None},
    "apidown": {"watchlist": [{"name": "Google", "episode_count": 592,
                               "total_mentions": 594, "podcast_count": 29}],
                "api": "http://localhost:9"},
    # 31 Aug: the two corpus-range defects. `range-live` is the search dropdown
    # with the API reachable, `range-apidown` with it unreachable - the state
    # that used to render the hardcoded "Jan-Jun 2025".
    "range-live":    {"watchlist": [], "api": None, "open": "search"},
    "range-apidown": {"watchlist": [], "api": "http://localhost:9", "open": "search"},
    # 31 Aug, after the full entity run: the coverage labels must be GONE from
    # both entity surfaces because the data completed, not because anyone
    # touched a label. Company Tracking's range must now span the whole library.
    "postrun-company":   {"watchlist": WATCHLIST, "api": None},
    "postrun-influence": {"watchlist": [], "api": None, "open": "influence"},
}


class CDP:
    def __init__(self, ws):
        self.ws, self.n = ws, 0

    async def send(self, method, **params):
        self.n += 1
        await self.ws.send(json.dumps({"id": self.n, "method": method,
                                       "params": params}))
        while True:
            m = json.loads(await self.ws.recv())
            if m.get("id") == self.n:
                if "error" in m:
                    raise RuntimeError(f"{method}: {m['error']}")
                return m.get("result", {})

    async def js(self, expr, await_promise=False):
        r = await self.send("Runtime.evaluate", expression=expr,
                            returnByValue=True, awaitPromise=await_promise)
        return r.get("result", {}).get("value")


async def run(label, outdir):
    proc = subprocess.Popen(
        [CHROME, f"--remote-debugging-port={PORT}", "--headless=new",
         "--hide-scrollbars", "--window-size=1440,1000", "--no-first-run",
         "--disable-gpu", "--user-data-dir=" + os.path.join(
             os.path.expanduser("~"), ".cache", "synthea-shots"),
         "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(60):
            try:
                tabs = json.load(urllib.request.urlopen(
                    f"http://127.0.0.1:{PORT}/json/list"))
                page = [t for t in tabs if t["type"] == "page"][0]
                break
            except Exception:
                time.sleep(0.5)
        else:
            sys.exit("chrome did not come up")

        async with websockets.connect(page["webSocketDebuggerUrl"],
                                      max_size=40 * 1024 * 1024) as ws:
            c = CDP(ws)
            await c.send("Page.enable")
            await c.send("Runtime.enable")
            # demo.html itself carries no ?v= tag, so a persisted profile will
            # happily serve a stale copy of the document that references the
            # previous version of every script. This shot compared two builds
            # and showed one, twice, until the cache was turned off.
            await c.send("Network.enable")
            await c.send("Network.setCacheDisabled", cacheDisabled=True)
            await c.send("Emulation.setDeviceMetricsOverride",
                         width=1440, height=1000, deviceScaleFactor=2,
                         mobile=False)

            st = STATES[label]
            # Seed the watchlist, then load the page so init() reads it.
            await c.send("Page.navigate", url=URL)
            await asyncio.sleep(3)
            await c.js("localStorage.setItem('synthea.watchlist.v1', "
                       + json.dumps(json.dumps(st["watchlist"])) + "); 1")
            if st["api"]:
                await c.send("Page.addScriptToEvaluateOnNewDocument",
                             source=f"window.SYNTHEA_API_BASE = {json.dumps(st['api'])};")
            await c.send("Page.navigate", url=URL)
            await asyncio.sleep(6)

            # Open the surface this shot is about.
            if st.get("open") == "influence":
                # Influence Metrics lives in the right sidebar; nothing to open,
                # just scroll it into view once its fetch has landed.
                await c.js("var e=document.getElementById('influence-metrics-section'); if(e) e.scrollIntoView({block:'center'}); 1")
            elif st.get("open") == "search":
                # The dropdown opens on focus, but a headless focus() does not
                # always fire the app's handler; add the class the app itself
                # adds (search.js:285) so the shot is of the real element in
                # its real open state rather than a synthetic panel.
                await c.js("document.getElementById('searchInput').focus();"
                           "document.getElementById('searchDropdown')"
                           ".classList.add('active'); 1")
            else:
                await c.js("document.querySelector('button.portfolio-button').click(); 1")
            # refreshAll() looks each company up in turn; give both round trips
            # room, or the line is screenshotted mid-refresh.
            await asyncio.sleep(14)

            line = await c.js(
                "(document.querySelector('#ctl-metrics .ctl-metrics-text')||{}).textContent")
            stamp = await c.js(
                "(document.querySelector('meta[name=build-version]')||{}).content")
            print(f"build-version  : {stamp}")
            cov = await c.js(
                "(document.querySelector('[data-entity-coverage]')||{}).textContent")
            corpus = await c.js(
                "(document.querySelector('[data-corpus-range]')||{}).textContent")
            print(f"metrics line   : {line}")
            print(f"coverage label : {cov}")
            print(f"corpus range   : {corpus}")

            os.makedirs(outdir, exist_ok=True)
            sel = {"search": "#searchDropdown",
                   "influence": "#influence-metrics-section"
                   }.get(st.get("open"), ".portfolio-panel")
            box = await c.js("JSON.stringify(document.querySelector('" + sel + "')"
                             ".getBoundingClientRect().toJSON())")
            b = json.loads(box)
            # Viewport-only. No captureBeyondViewport: the panel is fixed.
            shot = await c.send("Page.captureScreenshot", format="png",
                                clip={"x": max(0, b["x"] - 8),
                                      "y": max(0, b["y"] - 8),
                                      "width": min(b["width"] + 16, 1440),
                                      "height": min(b["height"] + 16, 900),
                                      "scale": 1})
            p = os.path.join(outdir, f"{label}-panel.png")
            open(p, "wb").write(base64.b64decode(shot["data"]))
            print("wrote", p)

            shot = await c.send("Page.captureScreenshot", format="png")
            p = os.path.join(outdir, f"{label}-page.png")
            open(p, "wb").write(base64.b64decode(shot["data"]))
            print("wrote", p)

            json.dump({"label": label, "metrics_line": line,
                       "coverage_label": cov, "corpus_range": corpus,
                       "build_version": stamp},
                      open(os.path.join(outdir, f"{label}.json"), "w"), indent=1)
    finally:
        proc.terminate()


if __name__ == "__main__":
    asyncio.run(run(sys.argv[1], sys.argv[2]))
