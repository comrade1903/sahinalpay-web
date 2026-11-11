/**
 * Lets React survive a page translator.
 *
 * Google Translate (and Chrome's built-in translation) replaces each text node
 * it translates with <font> elements. React still holds the original nodes, so
 * the next update that removes or inserts next to one of them asks a parent
 * to remove a child it no longer has, the browser throws NotFoundError, and
 * the whole page goes blank. The owner saw exactly that on 2026-11-09.
 *
 * The two DOM methods React uses are wrapped so that, when the node is no
 * longer where React left it, the call returns quietly instead of throwing.
 * Every other call goes to the browser's own method unchanged.
 */

const GUARDED = Symbol.for('sahinalpay.translateGuard')

/** Lets React survive a translator that wraps text nodes in <font> elements:
 *  removeChild and insertBefore return quietly, instead of throwing
 *  NotFoundError, when the node is no longer where React left it. Idempotent. */
export function installTranslateGuard(): void {
  if (typeof Node === 'undefined') return
  const proto = Node.prototype as Node & { [GUARDED]?: true }
  if (proto[GUARDED]) return
  proto[GUARDED] = true

  const removeChild = proto.removeChild
  proto.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child
    return removeChild.call(this, child) as T
  }

  const insertBefore = proto.insertBefore
  proto.insertBefore = function <T extends Node>(this: Node, node: T, reference: Node | null): T {
    if (reference && reference.parentNode !== this) return node
    return insertBefore.call(this, node, reference) as T
  }
}
