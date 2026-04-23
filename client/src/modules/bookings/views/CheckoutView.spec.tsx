import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useStayDetails } from '@/modules/stays/hooks/useStayDetails'
import { useCheckout } from '../hooks/useCheckout'
import { CheckoutView } from './CheckoutView'

vi.mock('@/modules/stays/hooks/useStayDetails')
vi.mock('../hooks/useCheckout')
vi.mock('@/core/utils/formatters')

describe('CheckoutView', () => {
  const mockMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useCheckout).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any)
  })

  it('renders loading state correctly', () => {
    vi.mocked(useStayDetails).mockReturnValue({
      data: null,
      isLoading: true,
    } as any)

    render(
      <MemoryRouter>
        <CheckoutView />
      </MemoryRouter>,
    )

    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toBeInTheDocument()
  })

  it('renders stay details and handles form submission', async () => {
    const mockStay = {
      id: '123',
      name: 'Cozy Cabin',
      location: 'Transylvania, Romania',
      price: 500,
      images: ['test-image.jpg'],
      rating: 4.5,
    }

    vi.mocked(useStayDetails).mockReturnValue({
      data: mockStay,
      isLoading: false,
    } as any)

    render(
      <MemoryRouter initialEntries={['/checkout/123']}>
        <CheckoutView />
      </MemoryRouter>,
    )

    expect(screen.getByText('Cozy Cabin')).toBeInTheDocument()

    expect(screen.getAllByText(/500 RON/i)).toHaveLength(2)

    const nameInput = screen.getByPlaceholderText(/e.g. John Doe/i)
    const emailInput = screen.getByPlaceholderText(/john@example.com/i)
    const submitBtn = screen.getByRole('button', { name: /confirm booking/i })

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })

    fireEvent.click(submitBtn)

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        stayId: '123',
        totalPrice: 500,
      }),
    )
  })

  it('disables button when mutation is pending', () => {
    vi.mocked(useStayDetails).mockReturnValue({
      data: { id: '1', price: 100, images: ['img'], location: 'Loc', name: 'Test' },
      isLoading: false,
    } as any)

    vi.mocked(useCheckout).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any)

    render(
      <MemoryRouter>
        <CheckoutView />
      </MemoryRouter>,
    )

    const submitBtn = screen.getByRole('button')
    expect(submitBtn).toBeDisabled()
    expect(submitBtn).toHaveTextContent(/processing/i)
  })
})
