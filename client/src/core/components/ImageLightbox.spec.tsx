import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ImageLightbox } from './ImageLightbox'

describe('ImageLightbox', () => {
  const mockImages = ['img1.jpg', 'img2.jpg', 'img3.jpg']
  const mockHandlers = {
    onClose: vi.fn(),
    onNext: vi.fn(),
    onPrev: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.style.overflow = 'visible'
  })

  it('renders the correct image and counter', () => {
    render(<ImageLightbox images={mockImages} index={1} {...mockHandlers} />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'img2.jpg')
    expect(screen.getByText('2 / 3')).toBeDefined()
  })

  it('calls onNext and onPrev when navigation buttons are clicked', () => {
    render(<ImageLightbox images={mockImages} index={0} {...mockHandlers} />)

    // Using getAllByRole because navigation buttons don't have unique text,
    // but we can find them by their position or add aria-labels.
    const buttons = screen.getAllByRole('button')
    const prevBtn = buttons[1]
    const nextBtn = buttons[2]

    fireEvent.click(nextBtn)
    expect(mockHandlers.onNext).toHaveBeenCalledTimes(1)

    fireEvent.click(prevBtn)
    expect(mockHandlers.onPrev).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the close button is clicked', () => {
    render(<ImageLightbox images={mockImages} index={0} {...mockHandlers} />)

    const closeBtn = screen.getAllByRole('button')[0]
    fireEvent.click(closeBtn)

    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1)
  })

  it('responds to keyboard shortcuts', () => {
    render(<ImageLightbox images={mockImages} index={0} {...mockHandlers} />)

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(mockHandlers.onNext).toHaveBeenCalled()

    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(mockHandlers.onPrev).toHaveBeenCalled()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(mockHandlers.onClose).toHaveBeenCalled()
  })

  it('locks body scroll on mount and restores it on unmount', () => {
    const { unmount } = render(<ImageLightbox images={mockImages} index={0} {...mockHandlers} />)

    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('visible')
  })

  it('calls onClose when clicking the backdrop but not the image', () => {
    render(<ImageLightbox images={mockImages} index={0} {...mockHandlers} />)

    fireEvent.click(screen.getByAltText('View 1'))
    expect(mockHandlers.onClose).not.toHaveBeenCalled()

    fireEvent.click(screen.getByTestId('lightbox-backdrop'))
    expect(mockHandlers.onClose).toHaveBeenCalled()
  })
})
