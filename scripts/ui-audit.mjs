#!/usr/bin/env node
/**
 * Measures the built site's interface page by page: layout shift, horizontal
 * overflow, touch-target height, smallest type, contrast, and what each page
 * downloads. It drives headless Chrome over the DevTools protocol, so it needs
 * no dependency beyond a local Chrome and Node's built-in WebSocket.
 *
 * It is a report, not a gate: the exit code is 0 unless Chrome cannot start.
 * Start the site first (`npm run build && npm run serve:dist`), then:
 *
 *   npm run audit:ui -- [--base http://localhost:4180] [--only <substring>]
 *                       [--out tmp/ui-audit] [--shots] [--scheme light|dark]
 *                       [--media print] [--default-font-size <px>]
 *
 * Job names read <lang>-<viewport>-<scheme>-<page>; --only filters on them.
 */
import { spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

const args = process.argv.slice(2)
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`)
  return at >= 0 ? args[at + 1] : fallback
}
const base = option('base', 'http://localhost:4180').replace(/\/$/, '')
const only = option('only', '')
const outDir = option('out', 'tmp/ui-audit')
const scheme = option('scheme', 'light')
const media = option('media', '')
const defaultFontSize = Number.parseInt(option('default-font-size', '0'), 10)
const shots = args.includes('--shots')
const chromePath = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const VIEWPORTS = {
  m: { w: 390, h: 844, mobile: true },
  d: { w: 1440, h: 900, mobile: false },
  s: { w: 320, h: 640, mobile: true },
}
const PAGES = {
  tr: {
    home: '/',
    about: '/kimdir',
    columns: '/kose-yazilari',
    article: '/kose-yazilari/1915-tabusu',
    reader: '/kose-yazilari/hocam-ve-dostum-tomas-hammara-veda',
    interviews: '/soylesiler',
    academic: '/akademik-makaleler',
    scan: '/akademik-makaleler/68-kusagi-uzerine-bir-deneme-1988',
    books: '/kitaplar',
    trial: '/yargilanma-surecim',
    press: '/basinda-hakkimda',
    photos: '/fotograflarla-hikayem',
    cookies: '/cerez-politikasi',
    notfound: '/yok-boyle-bir-sayfa',
  },
  en: { home: '/en', columns: '/en/columns', books: '/en/books' },
}
const SMALL_SCREEN_PAGES = ['home', 'columns', 'article', 'books']

const jobs = []
const addJob = (lang, viewport, page) =>
  jobs.push({ name: `${lang}-${viewport}-${scheme}-${page}`, url: base + PAGES[lang][page], ...VIEWPORTS[viewport] })
for (const lang of ['tr', 'en']) {
  for (const page of Object.keys(PAGES[lang])) {
    addJob(lang, 'm', page)
    addJob(lang, 'd', page)
  }
}
for (const page of SMALL_SCREEN_PAGES) addJob('tr', 's', page)
const selected = jobs.filter((job) => job.name.includes(only))

/* Runs before the page's own scripts: dismisses the cookie notice, which would
   otherwise cover the page, and starts the layout-shift observer early enough
   to see every shift. */
const BEFORE_LOAD = `(() => {
  try { localStorage.setItem('cookie-consent', 'ok') } catch {}
  window.__cls = 0
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value
    }).observe({ type: 'layout-shift', buffered: true })
  } catch {}
})()`

/* Scrolls the whole page once so scroll-revealed content is visible to the
   measurements that follow. */
const SCROLL_PASS = `(async () => {
  let y = 0, i = 0
  while (y < document.documentElement.scrollHeight && i++ < 80) {
    window.scrollTo({ top: y, behavior: 'instant' })
    await new Promise((r) => setTimeout(r, 80))
    y += innerHeight
  }
  window.scrollTo({ top: 0, behavior: 'instant' })
  await new Promise((r) => setTimeout(r, 300))
})()`

const METRICS = String.raw`(() => {
  const all = [...document.querySelectorAll('body *')]
  const visible = (el) => {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return false
    const cs = getComputedStyle(el)
    return cs.visibility !== 'hidden' && cs.display !== 'none'
  }
  const label = (el) =>
    el.tagName.toLowerCase() +
    (typeof el.className === 'string' && el.className.trim()
      ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
      : '')
  const top = (counts, n) =>
    Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => k + ' ×' + v)

  // Interactive elements under 44px high; a link inside a sentence is exempt.
  const inline = (el) => {
    if (getComputedStyle(el).display !== 'inline') return false
    const p = el.parentElement
    return !!p && [...p.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
  }
  const short = {}
  for (const el of document.querySelectorAll(
    'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [tabindex]:not([tabindex="-1"])',
  )) {
    if (!visible(el) || inline(el)) continue
    const h = el.getBoundingClientRect().height
    if (h < 43.5) {
      const k = label(el) + ' ' + Math.round(h) + 'px'
      short[k] = (short[k] || 0) + 1
    }
  }

  // Smallest type, and contrast of every visible text element.
  const textEls = all.filter(
    (el) => visible(el) && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1),
  )
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const cache = new Map()
  const rgba = (color) => {
    if (cache.has(color)) return cache.get(color)
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = '#000'
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 1, 1)
    const d = ctx.getImageData(0, 0, 1, 1).data
    const v = d[3] === 0 ? [0, 0, 0, 0] : [d[0], d[1], d[2], d[3] / 255]
    cache.set(color, v)
    return v
  }
  const blend = (fg, bg) => {
    const a = fg[3]
    return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a), 1]
  }
  const luminance = (c) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
  }
  const ratio = (a, b) => {
    const l1 = luminance(a)
    const l2 = luminance(b)
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  }
  const backgroundOf = (el) => {
    const layers = []
    for (let p = el; p; p = p.parentElement) {
      const c = rgba(getComputedStyle(p).backgroundColor)
      if (c[3] > 0) {
        layers.push(c)
        if (c[3] >= 0.999) break
      }
    }
    let result = [255, 255, 255, 1]
    for (const layer of layers.reverse()) result = blend(layer, result)
    return result
  }
  let minFont = Infinity
  let minFontEl = ''
  const fails = {}
  for (const el of textEls) {
    const cs = getComputedStyle(el)
    const size = parseFloat(cs.fontSize)
    if (size < minFont) {
      minFont = size
      minFontEl = label(el)
    }
    let opacity = 1
    for (let p = el; p; p = p.parentElement) opacity *= parseFloat(getComputedStyle(p).opacity)
    if (opacity < 0.05) continue
    const bg = backgroundOf(el)
    const c = rgba(cs.color)
    const r = ratio(blend([c[0], c[1], c[2], c[3] * opacity], bg), bg)
    const large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight) >= 700)
    if (r < (large ? 3 : 4.5)) {
      const k = label(el) + ' ' + r.toFixed(2) + ':1'
      fails[k] = (fails[k] || 0) + 1
    }
  }
  return {
    viewportWidth: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    under44: Object.values(short).reduce((a, b) => a + b, 0),
    under44Els: top(short, 10),
    minFont: Number.isFinite(minFont) ? Math.round(minFont * 10) / 10 : null,
    minFontEl,
    contrastFails: Object.values(fails).reduce((a, b) => a + b, 0),
    contrastFailEls: top(fails, 10),
    h1: document.querySelectorAll('h1').length,
  }
})()`

/* ---- Chrome and the protocol connection ---- */

const profileDir = mkdtempSync(path.join(tmpdir(), 'ui-audit-'))
const port = 9400 + Math.floor(Math.random() * 400)
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ],
  { stdio: 'ignore' },
)
/* Chrome is still writing its profile when it is told to stop, so the folder
   is removed only once the process has gone. */
const quit = async () => {
  const exited = new Promise((resolve) => chrome.once('exit', resolve))
  if (chrome.exitCode === null && chrome.kill()) await Promise.race([exited, sleep(5000)])
  rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
}
let chromeFailed = false
chrome.on('error', () => (chromeFailed = true))

let socketUrl
for (let attempt = 0; attempt < 60 && !socketUrl && !chromeFailed; attempt++) {
  try {
    socketUrl = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl
  } catch {
    await sleep(200)
  }
}
if (!socketUrl) {
  await quit()
  console.error(`Chrome did not start from ${chromePath}. Set CHROME_PATH to a Chrome or Chromium binary.`)
  process.exit(1)
}

const socket = new WebSocket(socketUrl)
await new Promise((resolve, reject) => {
  socket.onopen = resolve
  socket.onerror = reject
})
let nextId = 1
const pending = new Map()
const listeners = new Set()
socket.onmessage = (event) => {
  const message = JSON.parse(event.data)
  const waiting = message.id && pending.get(message.id)
  if (waiting) {
    pending.delete(message.id)
    clearTimeout(waiting.timer)
    if (message.error) waiting.reject(new Error(message.error.message))
    else waiting.resolve(message.result)
  } else for (const listener of listeners) listener(message)
}
/* Every call times out: a page that never settles must not hang the run. */
const send = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    const id = nextId++
    const timer = setTimeout(() => {
      pending.delete(id)
      reject(new Error(`timeout ${method}`))
    }, 45000)
    pending.set(id, { resolve, reject, timer })
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
  })

/* ---- one job ---- */

async function measure(job) {
  const record = { name: job.name, url: job.url, fonts: new Set(), jsBytes: 0, imgBytes: 0 }
  const { browserContextId } = await send('Target.createBrowserContext')
  const { targetId } = await send('Target.createTarget', { url: 'about:blank', browserContextId })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
  const call = (method, params) => send(method, params, sessionId)

  let loaded
  const loadEvent = new Promise((resolve) => (loaded = resolve))
  const requestTypes = new Map()
  const onMessage = (message) => {
    if (message.sessionId !== sessionId) return
    const p = message.params
    if (message.method === 'Page.loadEventFired') loaded()
    else if (message.method === 'Network.responseReceived') {
      requestTypes.set(p.requestId, p.type)
      if (p.response.url.includes('/fonts/')) record.fonts.add(p.response.url.split('/').pop().split('?')[0])
    } else if (message.method === 'Network.loadingFinished') {
      const type = requestTypes.get(p.requestId)
      if (type === 'Script') record.jsBytes += p.encodedDataLength
      else if (type === 'Image') record.imgBytes += p.encodedDataLength
    }
  }
  listeners.add(onMessage)
  try {
    await call('Page.enable')
    await call('Network.enable')
    await call('Emulation.setDeviceMetricsOverride', {
      width: job.w,
      height: job.h,
      deviceScaleFactor: 1,
      mobile: job.mobile,
    })
    if (job.mobile) await call('Emulation.setTouchEmulationEnabled', { enabled: true })
    await call('Emulation.setEmulatedMedia', {
      media,
      features: [{ name: 'prefers-color-scheme', value: scheme }],
    })
    if (defaultFontSize > 0)
      await call('Page.setFontSizes', { fontSizes: { standard: defaultFontSize, fixed: defaultFontSize } })
    await call('Page.addScriptToEvaluateOnNewDocument', { source: BEFORE_LOAD })
    const navigation = await call('Page.navigate', { url: job.url })
    if (navigation.errorText) throw new Error(navigation.errorText)
    await Promise.race([loadEvent, sleep(15000)])

    // Layout shift is read before anything scrolls, so it is the load's own.
    await sleep(1800)
    const cls = await call('Runtime.evaluate', { expression: 'window.__cls', returnByValue: true })
    record.clsLoad = Math.round((cls.result.value ?? 0) * 1000) / 1000

    await call('Runtime.evaluate', { expression: SCROLL_PASS, awaitPromise: true })
    const metrics = await call('Runtime.evaluate', { expression: METRICS, returnByValue: true })
    if (metrics.exceptionDetails) throw new Error(metrics.exceptionDetails.exception?.description ?? 'metrics failed')
    Object.assign(record, metrics.result.value)
    // A phone widens its layout viewport to fit an overflowing page, so the
    // page is compared with the screen's width, not with innerWidth.
    record.hscroll = record.scrollWidth > job.w

    if (shots) {
      const layout = await call('Page.getLayoutMetrics')
      const height = Math.min(Math.ceil(layout.cssContentSize.height), 4000)
      const shot = await call('Page.captureScreenshot', {
        format: 'png',
        clip: { x: 0, y: 0, width: job.w, height, scale: 1 },
        captureBeyondViewport: true,
      })
      writeFileSync(path.join(outDir, `${job.name}.png`), Buffer.from(shot.data, 'base64'))
    }
  } catch (error) {
    record.error = String(error).slice(0, 300)
  } finally {
    listeners.delete(onMessage)
    await send('Target.closeTarget', { targetId }).catch(() => {})
    await send('Target.disposeBrowserContext', { browserContextId }).catch(() => {})
  }
  record.fonts = [...record.fonts]
  record.jsKb = Math.round(record.jsBytes / 1024)
  record.imgKb = Math.round(record.imgBytes / 1024)
  delete record.jsBytes
  delete record.imgBytes
  return record
}

/* ---- run ---- */

mkdirSync(outDir, { recursive: true })
const pad = (value, width) => String(value ?? '–').padEnd(width)
const COLUMNS = [
  ['job', 28, (r) => r.name],
  ['hscroll', 8, (r) => (r.hscroll ? `yes ${r.scrollWidth}` : 'no')],
  ['clsLoad', 8, (r) => r.clsLoad],
  ['under44', 8, (r) => r.under44],
  ['minFont', 8, (r) => r.minFont],
  ['contrastFails', 14, (r) => r.contrastFails],
  ['h1', 3, (r) => r.h1],
  ['fonts', 6, (r) => r.fonts.length],
  ['jsKb', 6, (r) => r.jsKb],
  ['imgKb', 6, (r) => r.imgKb],
]
console.log(COLUMNS.map(([title, width]) => pad(title, width)).join(' '))

const results = []
for (const job of selected) {
  let record
  try {
    record = await measure(job)
  } catch (error) {
    record = { name: job.name, url: job.url, fonts: [], error: String(error).slice(0, 300) }
  }
  results.push(record)
  writeFileSync(path.join(outDir, 'results.json'), JSON.stringify(results, null, 1))
  console.log(
    record.error && record.h1 === undefined
      ? `${pad(record.name, 28)} ERROR ${record.error}`
      : COLUMNS.map(([, width, value]) => pad(value(record), width)).join(' '),
  )
}
console.log(`\n${results.length} job(s). Details per job (which elements, which fonts): ${path.join(outDir, 'results.json')}`)
if (results.some((r) => r.error?.includes('net::ERR_')))
  console.log(`Nothing answered at ${base} — start the site with "npm run build && npm run serve:dist".`)

socket.close()
await quit()
