import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';

type CreateReviewInput = {
  productId: string;
  rating: number;
  comment?: string;
};

const CreateReview = async (userId: string, payload: CreateReviewInput) => {
  const { productId, rating, comment } = payload;

  if (!productId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'productId is required');
  }
  if (!rating || rating < 1 || rating > 5) {
    throw new AppError(httpStatus.BAD_REQUEST, 'rating must be between 1 and 5');
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, isDeleted: false },
  });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const deliveredOrder = await prisma.order.findFirst({
    where: {
      userId,
      status: 'DELIVERED',
      items: { some: { productId } },
    },
    select: { id: true },
  });
  if (!deliveredOrder) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only review products from delivered orders',
    );
  }

  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      'You have already reviewed this product',
    );
  }

  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      orderId: deliveredOrder.id,
      rating: Math.round(rating),
      comment: comment?.trim() || null,
    },
  });

  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { _all: true },
  });
  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: agg._avg.rating ?? 0,
      reviewsCount: agg._count._all,
    },
  });

  return review;
};

const GetProductReviews = async (productId: string) => {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, full_name: true, profile_photo: true },
      },
    },
  });
};

const GetMyReviewForProduct = async (userId: string, productId: string) => {
  return prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });
};

const GetMyReviews = async (userId: string) => {
  return prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      productId: true,
      rating: true,
      comment: true,
      createdAt: true,
      product: {
        select: {
          id: true,
          name: true,
          images: true,
          price: true,
          brand: { select: { name: true } },
        },
      },
    },
  });
};

export const ReviewService = {
  CreateReview,
  GetProductReviews,
  GetMyReviewForProduct,
  GetMyReviews,
};
