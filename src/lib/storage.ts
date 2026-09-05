/**
 * localStorage that never throws.
 *
 * Safari's Lockdown/private mode, Firefox with `dom.storage.enabled=false`
 * and enterprise "block all site data" policies make every `localStorage`
 * access raise a SecurityError — not just writes. An unguarded read in the
 * language toggle used to take the whole header down with it, so all access
 * goes through here and degrades to "no stored preference".
 */

export function readStoredValue(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStoredValue(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* Storage unavailable — the choice still applies to this visit. */
  }
}

export function removeStoredValue(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* See readStoredValue. */
  }
}

/** True when storage is readable and writable; used by the cookie notice. */
export function isStorageAvailable(): boolean {
  try {
    const probe = '__sa_probe__'
    localStorage.setItem(probe, probe)
    localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}
