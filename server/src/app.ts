import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import bookingRoutes from './routes/bookingRoutes';
import stayRoutes from './routes/stayRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stays', stayRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Booking API is live! 🚀' });
});

interface HttpError extends Error {
  status?: number;
}

// Centralized Error Handling
app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
  console.error('🔥 Error:', err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
});

export default app;
