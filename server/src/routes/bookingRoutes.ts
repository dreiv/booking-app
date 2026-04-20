import { Router } from "express";
import { createBooking } from "../controllers/bookingController";

const router = Router();

// /api/bookings
router.post("/", createBooking);

export default router;
