import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAddReview } from '../hooks/useAddReview'
import { AddReviewForm } from './AddReviewForm'

vi.mock('../hooks/useAddReview')

describe('AddReviewForm', () => {
  const mockMutate = vi.fn()
  const stayId = 'stay-123'

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAddReview).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any)
  })

  it('submits the form with correct data', () => {
    render(<AddReviewForm stayId={stayId} />)

    fireEvent.change(screen.getByPlaceholderText(/e.g. Andrei/i), {
      target: { value: 'Andrei' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Describe your experience/i), {
      target: { value: 'Great place!' },
    })
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '4' },
    })

    fireEvent.click(screen.getByText('Post Review'))

    expect(mockMutate).toHaveBeenCalledWith(
      { authorName: 'Andrei', rating: 4, comment: 'Great place!' },
      expect.any(Object),
    )
  })

  it('shows loading state when pending', () => {
    vi.mocked(useAddReview).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any)

    render(<AddReviewForm stayId={stayId} />)
    expect(screen.getByText('Posting...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
