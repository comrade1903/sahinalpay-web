import { describe, expect, it } from 'vitest'
import { act } from 'react'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { ArchiveSearchField } from '../src/components/archive/searchField'

/* The archive query lives in the URL, and react-router applies a
   setSearchParams call on its own schedule. A keystroke that lands before that
   update is committed used to be thrown away, because the input rendered the
   URL's value and React reset the DOM back to it. This stands in for that lag:
   the parent only adopts a new value on the next tick. */
function LaggingParent({ onValue }: { onValue: (value: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <ArchiveSearchField
      lang="tr"
      value={value}
      onChange={(next) => {
        onValue(next)
        setTimeout(() => setValue(next), 0)
      }}
    />
  )
}

describe('the archive search field', () => {
  it('keeps every keystroke typed before the URL catches up', async () => {
    const seen: string[] = []
    render(<LaggingParent onValue={(value) => seen.push(value)} />)
    const input = screen.getByRole('textbox') as HTMLInputElement

    /* Three keystrokes inside one tick — faster than the parent can answer. */
    act(() => {
      fireEvent.change(input, { target: { value: 'd' } })
      fireEvent.change(input, { target: { value: 'de' } })
      fireEvent.change(input, { target: { value: 'dem' } })
    })

    expect(input.value).toBe('dem')
    expect(seen.at(-1)).toBe('dem')

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
    })
    expect(input.value).toBe('dem')
  })

  it('follows the value when it changes from outside, as clearing filters does', async () => {
    function Outside() {
      const [value, setValue] = useState('demokrasi')
      return (
        <>
          <button onClick={() => setValue('')}>clear</button>
          <ArchiveSearchField lang="tr" value={value} onChange={setValue} />
        </>
      )
    }
    render(<Outside />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('demokrasi')

    await act(async () => {
      fireEvent.click(screen.getByText('clear'))
    })
    expect(input.value).toBe('')
  })
})
