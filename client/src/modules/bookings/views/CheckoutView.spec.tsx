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
      isSuccess: false,
      isError: false,
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

    expect(screen.getByText(/loading booking details/i)).toBeInTheDocument()
  })

  it('renders stay details and handles form submission', async () => {
    const mockStay = {
      id: '123',
      name: 'Cozy Cabin',
      location: 'Transylvania',
      price: 500,
      images: ['test-image.jpg'],
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
    expect(screen.getAllByText('500 RON')).toHaveLength(2)

    const nameInput = screen.getByPlaceholderText(/full name/i)
    const emailInput = screen.getByPlaceholderText(/email address/i)
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
      data: {
        id: '1',
        name: 'Test',
        price: 100,
        images: ['test-image.jpg'],
        location: 'Loc',
      },
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
