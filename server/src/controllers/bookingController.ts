import { Request, Response } from "express";
import { prisma } from "../db";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { stayId, checkIn, checkOut, guestName, guestEmail, totalPrice } =
      req.body;

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

    res.status(201).json({
      message: "Booking confirmed!",
      booking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res
      .status(400)
      .json({ error: "Booking failed. Ensure all fields are correct." });
  }
};
