import cors from "cors";
import "dotenv/config";
import express from "express";

import bookingRoutes from "./routes/bookingRoutes";
import stayRoutes from "./routes/stayRoutes";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/stays", stayRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Booking API is live! 🚀" });
});

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${port}`);
});
