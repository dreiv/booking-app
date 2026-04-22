import { prisma } from '@/db';
import { CreateReviewInput, GetStaysInput } from '@/schemas/staySchema';
import { asyncHandler } from '@/utils/asyncHandler';
import { Request, Response } from 'express';

export const getAllStays = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, location } = req.query as unknown as GetStaysInput;

  const validatedPage = Number(page) || 1;
  const validatedLimit = Number(limit) || 9;
  const skip = (validatedPage - 1) * validatedLimit;

  const where = {
    location: location ? { contains: location, mode: 'insensitive' as const } : undefined,
  };

  const [stays, totalCount] = await Promise.all([
    prisma.stay.findMany({
      where,
      skip,
      take: validatedLimit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.stay.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / validatedLimit);

  res.json({
    data: stays,
    meta: {
      totalCount,
      page: validatedPage,
      limit: validatedLimit,
      totalPages,
      hasNextPage: validatedPage < totalPages,
      hasPrevPage: validatedPage > 1,
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
  const { rating, comment, authorName } = req.body as CreateReviewInput['body'];

  const newReview = await prisma.review.create({
    data: {
      rating,
      comment,
      authorName,
      stayId: id,
    },
  });

  res.status(201).json(newReview);
});
