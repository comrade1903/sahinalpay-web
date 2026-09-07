/**
 * @vitest-environment node
 *
 * These exercise scripts/lib/net-guard.mjs, which runs in Node on a
 * maintainer's machine, not in the browser — happy-dom would apply CORS to
 * the loopback server this file stands up.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import http from 'node:http'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  NET_DEFAULTS,
  NetGuardError,
  assertAllowedUrl,
  downloadGuarded,
  fetchTextGuarded,
  hostAllowlist,
  isAllowedUrl,
} from '../scripts/lib/net-guard.mjs'

/* The research tools follow links off a remote index page, so the URL they end
   up requesting is chosen by that page. These exercise the refusals against a
   real server rather than a mock, because two of the bugs they now pin were
   invisible to reasoning about the code: a loopback hostname skipped the
   allowlist whether or not the caller had opted in, and redirect and error
   bodies were read whole with no cap. */

const ALLOWED = hostAllowlist(['https://www.tustav.org/x'])

let server: http.Server
let origin: string
let allowedLocal: Set<string>

function bodyOf(size: number) {
  return Buffer.alloc(size, 0x61)
}

beforeAll(async () => {
  server = http.createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost')
    switch (url.pathname) {
      case '/ok':
        response.writeHead(200, { 'content-type': 'text/plain' })
        response.end('hello')
        return
      case '/big-declared':
        response.writeHead(200, { 'content-length': '99999999' })
        response.end(bodyOf(16))
        return
      case '/big-actual':
        // Lies by omission: chunked, so there is no content-length to check.
        response.writeHead(200, { 'content-type': 'application/octet-stream' })
        response.end(bodyOf(4096))
        return
      case '/redirect-offsite':
        response.writeHead(302, { location: 'https://evil.example/x' })
        response.end(bodyOf(1024))
        return
      case '/redirect-loop':
        response.writeHead(302, { location: '/redirect-loop' })
        response.end(bodyOf(1024))
        return
      case '/redirect-ok':
        response.writeHead(302, { location: '/ok' })
        response.end(bodyOf(1024))
        return
      case '/redirect-endless': {
        /* A redirect whose body never ends. Reading it (arrayBuffer) hangs
           until the timeout; cancelling it lets the next hop proceed at once,
           which is what makes the difference observable rather than a claim
           about memory. */
        response.writeHead(302, { location: '/ok' })
        let open = true
        const pump = () => {
          while (open && response.write(bodyOf(64 * 1024))) {
            /* keep writing until the socket pushes back */
          }
        }
        response.on('drain', pump)
        response.on('close', () => {
          open = false
        })
        pump()
        return
      }
      case '/stall':
        // Headers, then silence — the shape a timeout has to cut short.
        response.writeHead(200, { 'content-type': 'text/plain' })
        response.write('a')
        return
      case '/boom':
        response.writeHead(500)
        response.end(bodyOf(1024))
        return
      default:
        response.writeHead(404)
        response.end(bodyOf(1024))
    }
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (typeof address === 'string' || address === null) throw new Error('no port')
  origin = `http://127.0.0.1:${address.port}`
  allowedLocal = hostAllowlist([`http://127.0.0.1:${address.port}/`])
})

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()))
})

describe('assertAllowedUrl', () => {
  it('accepts an https URL on the allowlist', () => {
    expect(() =>
      assertAllowedUrl('https://www.tustav.org/a.pdf', { allowedHosts: ALLOWED }),
    ).not.toThrow()
  })

  it('refuses a host that is not on the allowlist, however similar', () => {
    for (const url of [
      'https://tustav.org/a.pdf',
      'https://evil.tustav.org.attacker.example/a.pdf',
      'https://filedn.eu/x/a.pdf',
    ]) {
      expect(isAllowedUrl(url, { allowedHosts: ALLOWED }), url).toBe(false)
    }
  })

  it('refuses every non-https protocol', () => {
    for (const url of [
      'http://www.tustav.org/a.pdf',
      'file:///etc/passwd',
      'ftp://www.tustav.org/a.pdf',
      'data:text/plain,hi',
    ]) {
      expect(isAllowedUrl(url, { allowedHosts: ALLOWED }), url).toBe(false)
    }
  })

  /* The regression: any loopback hostname used to bypass the allowlist even
     with allowLocalhost unset, so a redirect could land on a local service. */
  it('refuses loopback hosts unless the caller asked for them', () => {
    for (const url of [
      'https://localhost/evil',
      'https://127.0.0.1/evil',
      'https://[::1]/evil',
      'http://localhost/evil',
    ]) {
      expect(isAllowedUrl(url, { allowedHosts: ALLOWED }), url).toBe(false)
    }
  })

  it('accepts loopback over http only when the caller opts in', () => {
    expect(
      isAllowedUrl('http://localhost:1/x', { allowedHosts: ALLOWED, allowLocalhost: true }),
    ).toBe(true)
  })

  it('marks policy refusals as permanent so callers do not retry them', () => {
    try {
      assertAllowedUrl('https://evil.example/x', { allowedHosts: ALLOWED })
      throw new Error('should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(NetGuardError)
      expect((error as NetGuardError & { permanent: boolean }).permanent).toBe(true)
    }
  })
})

describe('fetchTextGuarded', () => {
  const options = () => ({ allowedHosts: allowedLocal, allowLocalhost: true })

  it('reads a normal response', async () => {
    await expect(fetchTextGuarded(`${origin}/ok`, options())).resolves.toBe('hello')
  })

  it('refuses a body that declares a size over the cap', async () => {
    await expect(
      fetchTextGuarded(`${origin}/big-declared`, { ...options(), maxBytes: 64 }),
    ).rejects.toBeInstanceOf(NetGuardError)
  })

  it('refuses a body that goes over the cap while streaming', async () => {
    await expect(
      fetchTextGuarded(`${origin}/big-actual`, { ...options(), maxBytes: 64 }),
    ).rejects.toBeInstanceOf(NetGuardError)
  })

  it('follows a same-host redirect', async () => {
    await expect(fetchTextGuarded(`${origin}/redirect-ok`, options())).resolves.toBe('hello')
  })

  it('refuses a redirect to another host', async () => {
    await expect(
      fetchTextGuarded(`${origin}/redirect-offsite`, options()),
    ).rejects.toThrow(/allowlist/)
  })

  it('gives up on a redirect loop', async () => {
    await expect(
      fetchTextGuarded(`${origin}/redirect-loop`, { ...options(), maxRedirects: 2 }),
    ).rejects.toThrow(/redirects/)
  })

  /* Redirect and error bodies used to be read whole with arrayBuffer(), under
     no cap, on a response the remote end sizes. They are cancelled now. The
     assertion is behavioural: this redirect's body never ends, so reading it
     would hang until the timeout and the follow-on request would never
     happen. Reaching /ok proves the body was released, not buffered. */
  it('releases a redirect body instead of reading it', async () => {
    /* Reading it does not fail the request — the read is caught and the next
       hop is a fresh fetch — it just stalls for the whole timeout first. So
       the assertion is the elapsed time: the fixed path is a few
       milliseconds, the reading path is at least `timeoutMs`. */
    const started = Date.now()
    await expect(
      fetchTextGuarded(`${origin}/redirect-endless`, { ...options(), timeoutMs: 1500 }),
    ).resolves.toBe('hello')
    expect(Date.now() - started).toBeLessThan(1000)
  })

  it('applies the cap to the body it does read, not to a redirect body', async () => {
    await expect(
      fetchTextGuarded(`${origin}/redirect-ok`, { ...options(), maxBytes: 1 }),
    ).rejects.toThrow(/cap/)
    await expect(
      fetchTextGuarded(`${origin}/redirect-offsite`, { ...options(), maxBytes: 1 }),
    ).rejects.toThrow(/allowlist/)
  })

  it('does not read an error body, whatever the cap', async () => {
    await expect(
      fetchTextGuarded(`${origin}/boom`, { ...options(), maxBytes: 1 }),
    ).rejects.toThrow(/^500/)
  })

  it('times out rather than hanging on a response that never ends', async () => {
    await expect(
      fetchTextGuarded(`${origin}/stall`, { ...options(), timeoutMs: 150 }),
    ).rejects.toBeTruthy()
  })
})

describe('downloadGuarded', () => {
  let dir: string
  beforeAll(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'net-guard-'))
  })

  it('writes a file and reports its size', async () => {
    const target = path.join(dir, 'ok.txt')
    const result = await downloadGuarded(`${origin}/ok`, target, {
      allowedHosts: allowedLocal,
      allowLocalhost: true,
    })
    expect(result.bytes).toBe(5)
    expect(fs.readFileSync(target, 'utf8')).toBe('hello')
  })

  it('leaves no partial file when the body goes over the cap', async () => {
    const target = path.join(dir, 'toobig.bin')
    await expect(
      downloadGuarded(`${origin}/big-actual`, target, {
        allowedHosts: allowedLocal,
        allowLocalhost: true,
        maxBytes: 64,
      }),
    ).rejects.toBeInstanceOf(NetGuardError)
    expect(fs.existsSync(target)).toBe(false)
    expect(fs.readdirSync(dir).filter((f) => f.includes('.tmp-'))).toEqual([])
  })
})

describe('NET_DEFAULTS', () => {
  it('caps size, time and redirects out of the box', () => {
    expect(NET_DEFAULTS.maxBytes).toBeGreaterThan(0)
    expect(NET_DEFAULTS.timeoutMs).toBeGreaterThan(0)
    expect(NET_DEFAULTS.maxRedirects).toBeLessThanOrEqual(5)
  })
})
