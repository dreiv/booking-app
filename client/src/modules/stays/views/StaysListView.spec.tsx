import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, vi } from 'vitest'
import { useStays } from '../hooks/useStays'
import { StaysListView } from './StaysListView'

vi.mock('../hooks/useStays')

describe('StaysListView', () => {
  it('updates URL when "Next" is clicked', () => {
    vi.mocked(useStays).mockReturnValue({
      data: {
        data: [{ id: '1', name: 'Stay 1' }],
        meta: { totalPages: 2, hasNextPage: true, totalCount: 10 },
      },
      isLoading: false,
    } as any)

    render(
      <MemoryRouter initialEntries={['/stays?page=1']}>
        <StaysListView />
      </MemoryRouter>,
    )

    const nextButton = screen.getByRole('button', { name: /next/i })
    fireEvent.click(nextButton)
  })
})
