import { type Stay } from '@/modules/stays/types'

export interface Booking {
  id: string
  guestName: string
  guestEmail: string
  checkIn: string
  checkOut: string
  totalPrice: number
  status: string
  stayId: string
  stay: Stay
}

export interface BookingPayload {
  stayId: string
  guestName: string
  guestEmail: string
  checkIn: string
  checkOut: string
  totalPrice: number
}

export interface BookingResponse {
  message: string
  booking: {
    id: string
  }
}
