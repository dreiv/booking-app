import { Request, Response } from "express"; // Ensure these are from 'express'
import { prisma } from "../db";
import { asyncHandler } from "../utils/asyncHandler";

export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { stayId, checkIn, checkOut, guestName, guestEmail, totalPrice } =
      req.body;

    if (!stayId) {
      return res.status(400).json({ error: "stayId is required" });
    }

    const booking = await prisma.booking.create({
      data: {
        guestName: String(guestName),
        guestEmail: String(guestEmail),
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalPrice: Number(totalPrice),
        stayId: stayId as string,
        status: "CONFIRMED",
      },
    });

    res.status(201).json({ message: "Booking confirmed!", booking });
  },
);
