import { describe, expect, it } from 'vitest'
import { act, render } from '@testing-library/react'
import { useState } from 'react'
import { installTranslateGuard } from '../src/lib/translateGuard'

describe('installTranslateGuard', () => {
  installTranslateGuard()
  installTranslateGuard()

  it('ignores removal of a node that was moved away', () => {
    const parent = document.createElement('div')
    const stray = document.createElement('span')
    expect(() => parent.removeChild(stray)).not.toThrow()
    expect(parent.removeChild(stray)).toBe(stray)
  })
  it('ignores an insert before a node that was moved away', () => {
    const parent = document.createElement('div')
    const stray = document.createElement('span')
    expect(() => parent.insertBefore(document.createElement('b'), stray)).not.toThrow()
  })
  it('still removes and inserts real children', () => {
    const parent = document.createElement('div')
    const first = parent.appendChild(document.createElement('i'))
    const added = parent.insertBefore(document.createElement('b'), first)
    expect(parent.firstChild).toBe(added)
    parent.removeChild(first)
    expect(parent.childNodes).toHaveLength(1)
  })
  it('still appends when the reference node is null', () => {
    const parent = document.createElement('div')
    parent.insertBefore(document.createElement('b'), null)
    expect(parent.childNodes).toHaveLength(1)
  })
})

/* What the owner saw: a translator replaced a text node React still owned,
   and the next update that removed it threw NotFoundError and blanked the
   page. Without the guard this exact test throws (checked 2026-11-10). */
describe('a React page under a translator', () => {
  it('keeps working when a translated text node is removed', () => {
    function Toggle() {
      const [on, setOn] = useState(true)
      return (
        <p onClick={() => setOn((value) => !value)}>
          {on && 'Bir yazı'}
          <b>x</b>
        </p>
      )
    }
    const { container } = render(<Toggle />)
    const paragraph = container.querySelector('p')!
    const font = document.createElement('font')
    font.textContent = 'A piece'
    paragraph.replaceChild(font, paragraph.firstChild!)

    const flip = () => act(() => paragraph.click())
    expect(flip).not.toThrow()
    expect(flip).not.toThrow()
    expect(container.querySelector('b')?.textContent).toBe('x')
  })
})
