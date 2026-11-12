#!/usr/bin/env node
/**
 * Serves dist/ the way Vercel's static hosting does, so local verification
 * matches production instead of the SPA fallback `vite preview` uses.
 *
 * Differences that matter, and the reason this exists: `vite preview` rewrites
 * every unmatched path to index.html and answers 200, so a URL that does not
 * exist looked fine locally and only revealed itself as a soft 404 in the
 * wild. Here, as on Vercel, a path resolves to an exact file, then
 * `<path>/index.html`, then `<path>.html`, and otherwise returns 404.html with
 * a real 404 status. The redirects and headers in vercel.json are applied too.
 *
 *   npm run serve:dist -- --port 4180
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { projectRoot } from './lib/load-archive.mjs'

const distDir = path.join(projectRoot, 'dist')
const config = JSON.parse(fs.readFileSync(path.join(projectRoot, 'vercel.json'), 'utf8'))

const portArg = process.argv.indexOf('--port')
const port = portArg >= 0 ? Number.parseInt(process.argv[portArg + 1], 10) : 4180

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
}

/** vercel.json's `:param` and `:param*` source patterns, as regular
 *  expressions: `:param` is one path segment, `:param*` any number of them
 *  (the /tr/:path* rule for the layout before 2026-11-12). */
const redirects = (config.redirects ?? []).map((rule) => ({
  pattern: new RegExp(
    `^${rule.source
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/:(\w+)\\\*/g, '(?<$1>.*)')
      .replace(/:(\w+)/g, '(?<$1>[^/]+)')}$`,
  ),
  destination: rule.destination,
  status: rule.permanent ? 308 : 307,
}))

function headersFor(pathname) {
  const result = {}
  for (const rule of config.headers ?? []) {
    const pattern = new RegExp(`^${rule.source.replace(/\(\.\*\)/g, '.*')}$`)
    if (!pattern.test(pathname)) continue
    for (const header of rule.headers) result[header.key] = header.value
  }
  return withoutHttpsOnlyRules(result)
}

/* Two production rules tell a browser to use https, and this server speaks
   plain http. Chrome exempts localhost; Safari does not, so it rewrote every
   script and stylesheet request to https://localhost, got no answer, and
   showed a blank page. Both rules are dropped here and nowhere else. */
function withoutHttpsOnlyRules(headers) {
  const result = { ...headers }
  delete result['Strict-Transport-Security']
  const policy = result['Content-Security-Policy']
  if (policy) {
    result['Content-Security-Policy'] = policy
      .split(';')
      .map((directive) => directive.trim())
      .filter((directive) => directive && directive !== 'upgrade-insecure-requests')
      .join('; ')
  }
  return result
}

function resolveFile(pathname) {
  const relative = decodeURIComponent(pathname).replace(/^\/+/, '')
  const base = path.join(distDir, relative)
  if (!path.resolve(base).startsWith(distDir)) return null
  for (const candidate of [base, path.join(base, 'index.html'), `${base}.html`]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate
  }
  return null
}

const server = http.createServer((request, response) => {
  const { pathname } = new URL(request.url, `http://localhost:${port}`)

  for (const rule of redirects) {
    const match = rule.pattern.exec(pathname)
    if (!match) continue
    const location = rule.destination.replace(
      /:(\w+)\*?/g,
      (_, name) => match.groups?.[name] ?? '',
    )
    response.writeHead(rule.status, { Location: location })
    response.end()
    return
  }

  const file = resolveFile(pathname === '/' ? '/index.html' : pathname)
  const headers = headersFor(pathname)

  if (!file) {
    const notFound = path.join(distDir, '404.html')
    response.writeHead(404, { ...headers, 'Content-Type': MIME['.html'] })
    response.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not found')
    return
  }

  response.writeHead(200, {
    ...headers,
    'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream',
  })
  response.end(fs.readFileSync(file))
})

server.listen(port, () => {
  console.log(`Serving dist/ like Vercel on http://localhost:${port}`)
})
