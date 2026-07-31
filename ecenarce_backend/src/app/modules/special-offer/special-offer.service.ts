import { SpecialOffer } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import prisma from '../../utils/prisma';

// ✅ Create Special Offer
const createSpecialOffer = async (data: Partial<SpecialOffer>) => {
  if (!data.title || !data.productId || !data.validFrom) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Title, ProductID, and validFrom are required',
    );
  }

  // Check product exists
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });
  if (!product || product.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const result = await prisma.specialOffer.create({
    data: {
      title: data.title,
      productId: data.productId,
      validFrom: new Date(data.validFrom),
      validUntil: data.validUntil ? new Date(data.validUntil) : null,
      description: data.description ?? null,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          images: true,
        },
      },
    },
  });

  return result;
};

// ✅ Edit Special Offer
const editSpecialOffer = async (id: string, data: Partial<SpecialOffer>) => {
  const offer = await prisma.specialOffer.findUnique({ where: { id } });
  if (!offer)
    throw new AppError(httpStatus.NOT_FOUND, 'Special offer not found');

  // Validate product if changed
  if (data.productId && data.productId !== offer.productId) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product || product.isDeleted)
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const updatedOffer = await prisma.specialOffer.update({
    where: { id },
    data: {
      title: data.title ?? offer.title,
      productId: data.productId ?? offer.productId,
      validFrom: data.validFrom ? new Date(data.validFrom) : offer.validFrom,
      validUntil: data.validUntil
        ? new Date(data.validUntil)
        : offer.validUntil,
      description: data.description ?? offer.description,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          images: true,
        },
      },
    },
  });

  return updatedOffer;
};

// ✅ Delete Special Offer
const deleteSpecialOffer = async (id: string) => {
  const offer = await prisma.specialOffer.findUnique({ where: { id } });
  if (!offer)
    throw new AppError(httpStatus.NOT_FOUND, 'Special offer not found');

  return await prisma.specialOffer.delete({
    where: { id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

// ✅ Get all special offers
const getAllSpecialOffers = async () => {
  return await prisma.specialOffer.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
          images: true,
          price:true
        },
      },
    },
  });
};

// ✅ Get single special offer
const getSingleSpecialOffer = async (id: string) => {
  const offer = await prisma.specialOffer.findUnique({
    where: { id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          images: true,
        },
      },
    },
  });
  if (!offer)
    throw new AppError(httpStatus.NOT_FOUND, 'Special offer not found');
  return offer;
};

export const SpecialOfferService = {
  createSpecialOffer,
  editSpecialOffer,
  deleteSpecialOffer,
  getAllSpecialOffers,
  getSingleSpecialOffer,
};
