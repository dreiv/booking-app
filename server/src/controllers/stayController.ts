import { Prisma } from '@/_generated/client/client';
import { prisma } from '@/db';
import { CreateReviewInput, GetStaysSchema } from '@/schemas/staySchema';
import { asyncHandler } from '@/utils/asyncHandler';
import { Request, Response } from 'express';

export const getStays = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, location, ids, minPrice, maxPrice, sort, nwLat, nwLng, seLat, seLng } =
    GetStaysSchema.shape.query.parse(req.query);

  const skip = (page - 1) * limit;
  const where: Prisma.StayWhereInput = {};

  if (ids) {
    const idArray = Array.isArray(ids) ? ids : [ids];
    where.id = { in: idArray };
  } else {
    where.bookings = { none: {} };

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (nwLat !== undefined && seLat !== undefined && nwLng !== undefined && seLng !== undefined) {
      where.latitude = { gte: Math.min(nwLat, seLat), lte: Math.max(nwLat, seLat) };
      where.longitude = { gte: Math.min(nwLng, seLng), lte: Math.max(nwLng, seLng) };
    }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined && { gte: minPrice }),
      ...(maxPrice !== undefined && { lte: maxPrice }),
    };
  }

  let orderBy: Prisma.StayOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'rating_desc') orderBy = { rating: 'desc' };

  const [stays, totalCount] = await Promise.all([
    prisma.stay.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      // CRITICAL: Include booking count so frontend knows status
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    }),
    prisma.stay.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  res.json({
    data: stays,
    meta: {
      totalCount,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

export const getStayById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const stay = await prisma.stay.findUnique({
    where: { id },
    include: {
      reviews: true,
      _count: {
        select: { bookings: true },
      },
    },
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

  const result = await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        rating,
        comment,
        authorName,
        stayId: id,
      },
    });

    const stats = await tx.review.aggregate({
      where: { stayId: id },
      _avg: { rating: true },
    });

    await tx.stay.update({
      where: { id },
      data: { rating: stats._avg.rating || 0 },
    });

    return newReview;
  });

  res.status(201).json(result);
});
