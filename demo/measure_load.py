#!/usr/bin/env python3
"""Front-page load timing, the same instrument before and after finding 5.

  python3 measure_load.py before|after [runs]

For each of the four windows it takes a COLD reading and a WARM one.

**What "cold" can and cannot mean here, stated plainly.** The API server is
restarted before every cold reading, which empties every in-process cache: the
signals scan, the episode catalogue, the window anchor. What this cannot force is
OpenSearch Serverless scaling back to zero OCU - that happens on its own after a
long idle and cannot be triggered on demand. So "cold" here is *process-cold*,
and the true worst case, a collection asleep at 0 OCU, is worse than any number
this script prints. That figure is recorded separately from an observed reading
rather than pretended into this table.

"Fully rendered" is not a load event: it is the page actually carrying its
numbers - the flagship chart plotted, the signal cards showing values, the
episode list populated, the header counts filled. The script polls for that
condition and records the elapsed time from navigation start.
"""
import asyncio, json, os, statistics, subprocess, sys, time, urllib.request
import websockets

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
URL = "http://localhost:5173/demo.html"
API_DIR = "/Users/jamesgill/projects/podinsight/podinsight-api"
PORT = 9400
WINDOWS = ["30d", "90d", "12m", "all"]

# Every one of these must be true before the page counts as rendered.
READY = r"""
(() => {
  const n = s => document.querySelectorAll(s).length;
  const txt = s => { const e = document.querySelector(s); return e ? e.textContent.trim() : ''; };
  return {
    header:  /\d/.test(txt('.header-metrics-inner')),
    chart:   n('#narrative-pulse-container svg path, #narrative-pulse-container svg circle') > 0,
    cards:   n('.nsl-card-value') >= 3,
    list:    n('.nfl-list > *') > 0,
    span:    /\d{4}/.test(txt('.dw-span'))
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


def restart_api():
    subprocess.run("lsof -ti:8000 | xargs kill", shell=True,
                   capture_output=True)
    time.sleep(2)
    subprocess.Popen(
        f"cd {API_DIR} && ./venv/bin/python -m uvicorn api.index:app --port 8000 "
        f"--log-level warning > /tmp/podinsight-api.log 2>&1",
        shell=True, start_new_session=True)
    for _ in range(90):
        try:
            urllib.request.urlopen("http://localhost:8000/api/health", timeout=2)
            return
        except Exception:
            time.sleep(1)


async def one_load(c, w, budget=90):
    """Navigate and time to fully rendered. Returns seconds, or None on timeout."""
    await c.send("Page.navigate", url="about:blank")
    await asyncio.sleep(0.4)
    await c.send("Page.navigate", url=URL)
    await asyncio.sleep(0.3)
    await c.js(f"localStorage.setItem('synthea.window.v1','{w}');1")
    t0 = time.time()
    await c.send("Page.navigate", url=URL)
    while time.time() - t0 < budget:
        st = await c.js(READY)
        if st and all(st.values()):
            return round(time.time() - t0, 2), st
        await asyncio.sleep(0.25)
    return None, (await c.js(READY))


async def run(phase, runs):
    out = {}
    proc = subprocess.Popen(
        [CHROME, f"--remote-debugging-port={PORT}", "--headless=new", "--hide-scrollbars",
         "--window-size=1440,1000", "--no-first-run", "--disable-gpu",
         "--user-data-dir=" + os.path.expanduser("~/.cache/synthea-perf"), "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
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
                restart_api()                       # process-cold
                cold, cst = await one_load(c, w)
                warm = []
                for _ in range(runs):
                    t, _ = await one_load(c, w)
                    if t:
                        warm.append(t)
                out[w] = {"cold_s": cold, "cold_state": cst,
                          "warm_s": warm,
                          "warm_median_s": round(statistics.median(warm), 2) if warm else None}
                print(f"  {w:4} cold {str(cold)+'s':>8}   warm median "
                      f"{str(out[w]['warm_median_s'])+'s':>7}   warm runs {warm}")
        d = f"docs/ui-acceptance/finding5-perf-2026-09-02"
        os.makedirs(d, exist_ok=True)
        json.dump(out, open(f"{d}/{phase}.json", "w"), indent=1)
        print(f"wrote {d}/{phase}.json")
    finally:
        proc.terminate()


asyncio.run(run(sys.argv[1] if len(sys.argv) > 1 else "before",
                int(sys.argv[2]) if len(sys.argv) > 2 else 3))
