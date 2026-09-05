import fs from 'node:fs'

import { openAtomicTarget } from './fs-guard.mjs'

/* Bounded, allowlisted fetching for the archive research tools.
   These scripts follow links off a remote index page, so the URL they end up
   requesting is chosen by that page, not by us: an off-host link, a redirect
   to somewhere else, a response that never ends, or one that is 40 GB, all
   arrive through the same code path. Every request goes through here, and
   every one of those is capped or refused. */

export class NetGuardError extends Error {
  /** `permanent` marks a policy refusal — a bad protocol, an off-allowlist
   *  host, too many redirects, a body over the cap. Retrying those only
   *  repeats the same refusal, so callers skip their backoff loop. */
  constructor(message, { permanent = false } = {}) {
    super(message)
    this.name = 'NetGuardError'
    this.permanent = permanent
  }
}

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

export const NET_DEFAULTS = {
  maxBytes: 32 * 1024 * 1024,
  timeoutMs: 60_000,
  maxRedirects: 3,
}

/** The allowlist is derived from the configured sources rather than written
 *  out separately, so adding a source cannot forget to widen it — and, more
 *  to the point, a link discovered on one of those pages can never widen it. */
export function hostAllowlist(sourceUrls) {
  const hosts = new Set()
  for (const sourceUrl of sourceUrls) {
    hosts.add(new URL(sourceUrl).hostname.toLowerCase())
  }
  return hosts
}

/** https only. http is accepted solely for an explicit localhost target, and
 *  only when the caller asked for it. */
export function assertAllowedUrl(rawUrl, { allowedHosts, allowLocalhost = false, label = 'url' }) {
  let parsed
  try {
    parsed = new URL(rawUrl)
  } catch {
    throw new NetGuardError(`${label} is not a valid URL: ${rawUrl}`, { permanent: true })
  }

  const hostname = parsed.hostname.toLowerCase()
  const isLocal = LOCAL_HOSTNAMES.has(hostname)

  if (parsed.protocol !== 'https:') {
    if (!(parsed.protocol === 'http:' && allowLocalhost && isLocal)) {
      throw new NetGuardError(
        `${label} must use https (http is allowed only for localhost): ${rawUrl}`,
        { permanent: true },
      )
    }
  }

  if (!isLocal && !allowedHosts.has(hostname)) {
    throw new NetGuardError(
      `${label} host "${hostname}" is not in the allowlist [${[...allowedHosts].join(', ')}]: ${rawUrl}`,
      { permanent: true },
    )
  }

  return parsed
}

/** True when `rawUrl` would pass assertAllowedUrl — for filtering a page's
 *  links down to the ones worth requesting, without throwing on each reject. */
export function isAllowedUrl(rawUrl, options) {
  try {
    assertAllowedUrl(rawUrl, options)
    return true
  } catch {
    return false
  }
}

/** fetch() with redirects followed by hand, so every hop is re-validated
 *  against the allowlist. `redirect: 'follow'` would happily land on any host
 *  the server names, which is exactly the guarantee we need to keep. */
export async function fetchGuarded(rawUrl, options = {}) {
  const {
    allowedHosts,
    allowLocalhost = false,
    timeoutMs = NET_DEFAULTS.timeoutMs,
    maxRedirects = NET_DEFAULTS.maxRedirects,
    maxBytes = NET_DEFAULTS.maxBytes,
    accept,
    label = 'url',
  } = options

  let current = assertAllowedUrl(rawUrl, { allowedHosts, allowLocalhost, label }).href

  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    const response = await fetch(current, {
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
      headers: accept ? { accept } : undefined,
    })

    if (response.status >= 300 && response.status < 400 && response.headers.has('location')) {
      // Drain the redirect body so the socket is not left hanging.
      await response.arrayBuffer().catch(() => {})
      if (hop === maxRedirects) {
        throw new NetGuardError(`${label} exceeded ${maxRedirects} redirects: ${rawUrl}`, {
          permanent: true,
        })
      }
      const next = new URL(response.headers.get('location'), current).href
      assertAllowedUrl(next, { allowedHosts, allowLocalhost, label: `${label} redirect` })
      current = next
      continue
    }

    if (!response.ok) {
      await response.arrayBuffer().catch(() => {})
      throw new NetGuardError(`${response.status} ${response.statusText}: ${current}`)
    }

    assertUnderDeclaredSize(response, maxBytes, current)
    return { response, url: current }
  }

  throw new NetGuardError(`${label} exceeded ${maxRedirects} redirects: ${rawUrl}`, {
    permanent: true,
  })
}

function assertUnderDeclaredSize(response, maxBytes, url) {
  const declared = Number(response.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > maxBytes) {
    throw new NetGuardError(`${url} declares ${declared} bytes, over the ${maxBytes}-byte cap`, {
      permanent: true,
    })
  }
}

/** Reads a response body into memory, stopping the moment it goes over the
 *  cap rather than after the fact — a server that lies about content-length
 *  should not be able to fill the heap. */
async function readCapped(response, maxBytes, url) {
  const reader = response.body?.getReader()
  if (!reader) return Buffer.alloc(0)

  const chunks = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) {
      await reader.cancel().catch(() => {})
      throw new NetGuardError(`${url} exceeded the ${maxBytes}-byte cap`, { permanent: true })
    }
    chunks.push(Buffer.from(value))
  }
  return Buffer.concat(chunks)
}

export async function fetchTextGuarded(rawUrl, options = {}) {
  const maxBytes = options.maxBytes ?? NET_DEFAULTS.maxBytes
  const { response, url } = await fetchGuarded(rawUrl, options)
  return (await readCapped(response, maxBytes, url)).toString('utf8')
}

/** Streams a download straight to disk under the same caps, through a temp
 *  file so an interrupted transfer never leaves a partial file that a later
 *  run would mistake for a completed download. `destPath` must already have
 *  been validated with fs-guard's ensureInside(). */
export async function downloadGuarded(rawUrl, destPath, options = {}) {
  const maxBytes = options.maxBytes ?? NET_DEFAULTS.maxBytes
  const { response, url } = await fetchGuarded(rawUrl, options)

  const target = openAtomicTarget(destPath)
  const handle = await fs.promises.open(target.tempPath, 'w')
  let total = 0
  try {
    const reader = response.body?.getReader()
    if (reader) {
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        total += value.byteLength
        if (total > maxBytes) {
          await reader.cancel().catch(() => {})
          throw new NetGuardError(`${url} exceeded the ${maxBytes}-byte cap`, { permanent: true })
        }
        await handle.write(value)
      }
    }
    await handle.close()
    target.commit()
  } catch (error) {
    await handle.close().catch(() => {})
    target.discard()
    throw error
  }

  return { bytes: total, url }
}
