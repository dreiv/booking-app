import 'dotenv/config';

import { prisma } from './db';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "Booking API is live! 🚀" });
});

app.get('/api/stays', async (req, res) => {
  try {
    const stays = await prisma.stay.findMany({
      include: { reviews: true }
    });
    res.json(stays);
  } catch (error) {
    console.error("Error fetching stays:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${port}`);
});
