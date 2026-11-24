#!/usr/bin/env node
// Takes screenshots of the running app with real device emulation (phone widths, dark mode),
// using Chrome's DevTools protocol directly. No dependencies; needs Node 22+ and Google Chrome.
//
// Usage: node scripts/screenshot.mjs <out-dir> <base-url> <name>=<path>[@<width>x<height>][:dark][:full][:js=<code>] ...
// Example: node scripts/screenshot.mjs shots http://localhost:3001 home=/ home-phone=/@400x860 brief=/target?id=emberline&tab=brief:full
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [outDir, base, ...specs] = process.argv.slice(2);
if (!outDir || !base || specs.length === 0) {
  console.error("usage: screenshot.mjs <out-dir> <base-url> name=path[@WxH][:dark][:full][:js=code] ...");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333;
const profile = mkdtempSync(join(tmpdir(), "lg-shot-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitForChrome() {
  for (let i = 0; i < 50; i++) {
    try { return await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch { await sleep(200); }
  }
  throw new Error("Chrome did not start");
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    else listeners.forEach((l) => l(msg));
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const n = ++id;
    pending.set(n, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)));
    ws.send(JSON.stringify({ id: n, method, params }));
  });
  const once = (method) => new Promise((resolve) => listeners.push((m) => m.method === method && resolve(m.params)));
  return new Promise((resolve) => (ws.onopen = () => resolve({ send, once, close: () => ws.close() })));
}

function parse(spec) {
  const [name, rest] = spec.split(/=(.*)/s);
  const parts = rest.split(/:(?=dark|full|js=)/);
  let [path, size] = parts[0].split("@");
  const [width, height] = (size ?? "1440x900").split("x").map(Number);
  const opts = { name, path, width, height, dark: false, full: false, js: null };
  for (const p of parts.slice(1)) {
    if (p === "dark") opts.dark = true;
    else if (p === "full") opts.full = true;
    else if (p.startsWith("js=")) opts.js = p.slice(3);
  }
  return opts;
}

try {
  await waitForChrome();
  for (const spec of specs) {
    const o = parse(spec);
    const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
    const page = await connect(target.webSocketDebuggerUrl);
    await page.send("Page.enable");
    await page.send("Emulation.setDeviceMetricsOverride", { width: o.width, height: o.height, deviceScaleFactor: 2, mobile: o.width < 768 });
    await page.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: o.dark ? "dark" : "light" }] });
    const loaded = page.once("Page.loadEventFired");
    await page.send("Page.navigate", { url: base + o.path });
    await loaded;
    await sleep(Number(process.env.SETTLE_MS ?? 1500));
    if (o.js) {
      const r = await page.send("Runtime.evaluate", { expression: o.js, awaitPromise: true });
      if (r.exceptionDetails) console.error(`js error in ${o.name}: ${r.exceptionDetails.exception?.description ?? r.exceptionDetails.text}`);
      await sleep(1500);
    }
    const shot = await page.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: o.full });
    writeFileSync(join(outDir, `${o.name}.png`), Buffer.from(shot.data, "base64"));
    console.log(`saved ${o.name}.png`);
    page.close();
    await fetch(`http://127.0.0.1:${PORT}/json/close/${target.id}`);
  }
} finally {
  chrome.kill();
}
