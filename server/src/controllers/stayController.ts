import { Request, Response } from 'express';
import { prisma } from '../db';
import { asyncHandler } from '../utils/asyncHandler';

export const getAllStays = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const location = req.query.location as string | undefined;

  const where = {
    location: location ? { contains: location, mode: 'insensitive' as const } : undefined,
  };

  const [stays, totalCount] = await Promise.all([
    prisma.stay.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.stay.count({ where }),
  ]);

  res.json({
    data: stays,
    meta: {
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: skip + stays.length < totalCount,
      hasPreviousPage: page > 1,
    },
  });
});

export const getStayById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const stay = await prisma.stay.findUnique({
    where: { id },
    include: { reviews: true },
  });

  if (!stay) {
    res.status(404);
    throw new Error('Stay not found');
  }

  res.json(stay);
});

export const getStayReviews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const reviews = await prisma.review.findMany({
    where: { stayId: id },
    orderBy: { createdAt: 'desc' },
  });

  res.json(reviews);
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { rating, comment, authorName } = req.body;

  const newReview = await prisma.review.create({
    data: {
      rating: Number(rating),
      comment: String(comment),
      authorName: String(authorName),
      stayId: id,
    },
  });

  res.status(201).json(newReview);
});
