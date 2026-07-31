// app/modules/discount/discount.service.ts
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import calculatePagination from '../../utils/pagination';

export const createDiscount = async (data: {
  productId: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  startDate: Date;
  endDate: Date;
}) => {
  // Validate product exists
  const product = await prisma.product.findUnique({
    where: { id: data.productId, isDeleted: false },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Validate dates
  if (new Date(data.startDate) >= new Date(data.endDate)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'End date must be after start date',
    );
  }

  // Validate start date is not in the past
  if (new Date(data.startDate) < new Date()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Start date cannot be in the past',
    );
  }

  // Check for overlapping discounts
  const overlappingDiscount = await prisma.discount.findFirst({
    where: {
      productId: data.productId,
      isActive: true,
      OR: [
        {
          startDate: { lte: data.endDate },
          endDate: { gte: data.startDate },
        },
      ],
    },
  });

  if (overlappingDiscount) {
    throw new AppError(
      httpStatus.CONFLICT,
      'An active discount already exists for this time period',
    );
  }

  // Validate discount value
  if (data.type === 'PERCENTAGE' && (data.value <= 0 || data.value > 100)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Percentage discount must be between 1 and 100',
    );
  }

  if (
    data.type === 'FIXED_AMOUNT' &&
    (data.value <= 0 || data.value >= product.price)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Fixed amount discount must be greater than 0 and less than product price',
    );
  }

  // Create discount
  const discount = await prisma.discount.create({
    data: {
      ...data,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          originalPrice: true,
          images: true,
          category: true,
          brand: true,
        },
      },
    },
  });

  // Update product pricing and badge if discount is active now
  if (
    new Date(data.startDate) <= new Date() &&
    new Date(data.endDate) >= new Date()
  ) {
    await updateProductPricing(data.productId);
  }

  return discount;
};

export const updateProductPricing = async (productId: string) => {
  const activeDiscount = await prisma.discount.findFirst({
    where: {
      productId,
      isActive: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) return;

  let updateData: any = {};

  if (activeDiscount) {
    // Set original price to current price if not already set
    if (product.originalPrice === product.price) {
      updateData.originalPrice = product.price;
    }

    // Calculate discounted price
    let discountedPrice = product.originalPrice || product.price;

    if (activeDiscount.type === 'PERCENTAGE') {
      discountedPrice =
        (product.originalPrice || product.price) *
        (1 - activeDiscount.value / 100);
    } else if (activeDiscount.type === 'FIXED_AMOUNT') {
      discountedPrice = Math.max(
        0,
        (product.originalPrice || product.price) - activeDiscount.value,
      );
    }

    updateData.price = Math.round(discountedPrice * 100) / 100;
    updateData.badge = 'SALE';
  } else {
    // No active discount, reset to original price
    updateData.price = product.originalPrice || product.price;
    // Reset badge to NEW if it was SALE
    if (product.badge === 'SALE') {
      updateData.badge = 'NEW';
    }
  }

  await prisma.product.update({
    where: { id: productId },
    data: updateData,
  });
};

export const deactivateDiscount = async (discountId: string) => {
  const discount = await prisma.discount.findUnique({
    where: { id: discountId },
  });

  if (!discount) {
    throw new AppError(httpStatus.NOT_FOUND, 'Discount not found');
  }

  const updatedDiscount = await prisma.discount.update({
    where: { id: discountId },
    data: { isActive: false },
  });

  // Update product pricing
  await updateProductPricing(discount.productId);

  return updatedDiscount;
};

export const deleteDiscount = async (discountId: string) => {
  const discount = await prisma.discount.findUnique({
    where: { id: discountId },
  });

  if (!discount) {
    throw new AppError(httpStatus.NOT_FOUND, 'Discount not found');
  }

  const deletedDiscount = await prisma.discount.delete({
    where: { id: discountId },
  });

  // Update product pricing
  await updateProductPricing(discount.productId);

  return deletedDiscount;
};

export const getProductDiscounts = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId, isDeleted: false },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return await prisma.discount.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          originalPrice: true,
        },
      },
    },
  });
};

export const getActiveDiscounts = async () => {
  return await prisma.discount.findMany({
    where: {
      isActive: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          originalPrice: true,
          images: true,
          category: true,
          brand: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateDiscount = async (discountId: string, data: any) => {
  const discount = await prisma.discount.findUnique({
    where: { id: discountId },
  });

  if (!discount) {
    throw new AppError(httpStatus.NOT_FOUND, 'Discount not found');
  }

  // Validate dates if provided
  if (data.startDate && data.endDate) {
    if (new Date(data.startDate) >= new Date(data.endDate)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'End date must be after start date',
      );
    }
  }

  const updatedDiscount = await prisma.discount.update({
    where: { id: discountId },
    data: {
      ...data,
      updatedAt: new Date(),
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          originalPrice: true,
        },
      },
    },
  });

  // Update product pricing
  await updateProductPricing(discount.productId);

  return updatedDiscount;
};

export const getDiscountById = async (discountId: string) => {
  const discount = await prisma.discount.findUnique({
    where: { id: discountId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          originalPrice: true,
          images: true,
          category: true,
          brand: true,
        },
      },
    },
  });

  if (!discount) {
    throw new AppError(httpStatus.NOT_FOUND, 'Discount not found');
  }

  return discount;
};

export const getAllDiscounts = async (query: any) => {
  const { page = 1, limit = 10, productId, isActive } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};

  if (productId) {
    where.productId = productId;
  }

  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const [discounts, total] = await Promise.all([
    prisma.discount.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            originalPrice: true,
            images: true,
          },
        },
      },
    }),
    prisma.discount.count({ where }),
  ]);

  return {
    data: discounts,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// Cron job function to update expired discounts
export const updateExpiredDiscounts = async () => {
  const now = new Date();

  const expiredDiscounts = await prisma.discount.findMany({
    where: {
      isActive: true,
      endDate: { lt: now },
    },
  });

  for (const discount of expiredDiscounts) {
    await prisma.discount.update({
      where: { id: discount.id },
      data: { isActive: false },
    });

    await updateProductPricing(discount.productId);
  }

  return { updated: expiredDiscounts.length };
};

export const DiscountService = {
  createDiscount,
  deactivateDiscount,
  deleteDiscount,
  getProductDiscounts,
  getActiveDiscounts,
  updateDiscount,
  getDiscountById,
  getAllDiscounts,
  updateProductPricing,
  updateExpiredDiscounts,
};
