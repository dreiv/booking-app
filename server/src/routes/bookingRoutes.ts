import { Router } from "express";
import { createBooking, getBookings } from "../controllers/bookingController";

const router = Router();

// /api/bookings
router.get("/", getBookings);
router.post("/", createBooking);

export default router;
