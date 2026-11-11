import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render } from '@testing-library/react'
import { Reveal } from '../src/components/Reveal'

afterEach(() => vi.unstubAllGlobals())

describe('Reveal', () => {
  /* Old browsers and some embedded readers have no IntersectionObserver: the
     content must not wait for an event that never comes. */
  it('shows its content at once where IntersectionObserver does not exist', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const { container } = render(<Reveal>metin</Reveal>)
    expect(container.firstElementChild!.getAttribute('data-inview')).toBe('true')
    expect(container.textContent).toBe('metin')
  })
  it('reveals when the element enters the viewport', () => {
    let enter = (_entries: { isIntersecting: boolean }[]) => {}
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: typeof enter) {
          enter = callback
        }
        observe() {}
        disconnect() {}
      },
    )
    const { container } = render(<Reveal>metin</Reveal>)
    expect(container.firstElementChild!.getAttribute('data-inview')).toBe('false')
    act(() => enter([{ isIntersecting: true }]))
    expect(container.firstElementChild!.getAttribute('data-inview')).toBe('true')
  })
  it('keeps the tag, class, id and style it is given', () => {
    const { container } = render(
      <Reveal as="section" className="prose" id="x" delay={0.1} style={{ fontSize: '20px' }}>
        metin
      </Reveal>,
    )
    const element = container.firstElementChild as HTMLElement
    expect(element.tagName).toBe('SECTION')
    expect(element.classList.contains('prose')).toBe(true)
    expect(element.classList.contains('reveal')).toBe(true)
    expect(element.id).toBe('x')
    expect(element.style.fontSize).toBe('20px')
    expect(element.style.getPropertyValue('--reveal-delay')).toBe('0.1s')
  })
})
