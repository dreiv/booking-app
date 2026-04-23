import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAddReview } from '../hooks/useAddReview'
import { AddReviewForm } from './AddReviewForm'

vi.mock('../hooks/useAddReview')

describe('AddReviewForm Component', () => {
  const stayId = 'test-stay-id'
  const mockMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the form fields correctly', () => {
    ;(useAddReview as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    })

    render(<AddReviewForm stayId={stayId} />)

    expect(screen.getByPlaceholderText(/e.g. Andrei/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Describe your experience/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Post Review/i })).toBeInTheDocument()
  })

  it('displays the simplified error message when an error occurs', () => {
    ;(useAddReview as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: { status: 400 }, // Mocking any truthy error
    })

    render(<AddReviewForm stayId={stayId} />)

    const errorMsg = screen.getByText(
      /Could not post review. Please check for inappropriate language and try again./i,
    )
    expect(errorMsg).toBeInTheDocument()
    expect(errorMsg).toHaveClass('text-red-500')
  })

  it('disables the button and shows loading state when pending', () => {
    ;(useAddReview as any).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null,
    })

    render(<AddReviewForm stayId={stayId} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent(/Posting.../i)
  })

  it('submits the form with correct values', () => {
    ;(useAddReview as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    })

    render(<AddReviewForm stayId={stayId} />)

    const nameInput = screen.getByPlaceholderText(/e.g. Andrei/i)
    const commentInput = screen.getByPlaceholderText(/Describe your experience/i)
    const submitButton = screen.getByRole('button', { name: /Post Review/i })

    fireEvent.change(nameInput, { target: { value: 'Andrei' } })
    fireEvent.change(commentInput, { target: { value: 'This is a test comment' } })
    fireEvent.click(submitButton)

    expect(mockMutate).toHaveBeenCalledWith(
      { authorName: 'Andrei', rating: 5, comment: 'This is a test comment' },
      expect.any(Object),
    )
  })
})
