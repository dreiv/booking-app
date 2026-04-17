import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get('/api/stays', async (req, res) => {
  const stays = await prisma.stay.findMany({ include: { reviews: true } });
  res.json(stays)
})

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${port}`);
});
