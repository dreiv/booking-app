import { Request, Response } from "express";
import { prisma } from "../db";

export const getAllStays = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const location = req.query.location as string | undefined;

    const [stays, totalCount] = await Promise.all([
      prisma.stay.findMany({
        where: {
          location: location
            ? { contains: location, mode: "insensitive" }
            : undefined,
        },
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.stay.count({
        where: {
          location: location
            ? { contains: location, mode: "insensitive" }
            : undefined,
        },
      }),
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
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stays with pagination" });
  }
};

export const getStayById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const stay = await prisma.stay.findUnique({
      where: { id },
      include: { reviews: true },
    });

    if (!stay) return res.status(404).json({ error: "Stay not found" });
    res.json(stay);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getStayReviews = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const reviews = await prisma.review.findMany({
      where: { stayId: id },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
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
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Could not post review" });
  }
};
