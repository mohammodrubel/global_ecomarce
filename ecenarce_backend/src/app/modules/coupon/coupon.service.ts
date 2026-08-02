import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import { DiscountType } from '@prisma/client';

type CreateCouponInput = {
  code: string;
  description?: string;
  discountType?: DiscountType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number | null;
  expiresAt?: string | Date | null;
  usageLimit?: number | null;
  isActive?: boolean;
};

const CreateCoupon = async (payload: CreateCouponInput) => {
  const code = payload.code.trim().toUpperCase();
  const existing = await prisma.coupon.findFirst({
    where: { code, isDeleted: false },
  });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, 'Coupon code already exists');
  }
  const coupon = await prisma.coupon.create({
    data: {
      code,
      description: payload.description,
      discountType: payload.discountType || 'PERCENTAGE',
      value: payload.value,
      minPurchase: payload.minPurchase ?? 0,
      maxDiscount: payload.maxDiscount ?? null,
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
      usageLimit: payload.usageLimit ?? null,
      isActive: payload.isActive ?? true,
    },
  });
  return coupon;
};

const GetAllCoupons = async () => {
  return prisma.coupon.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
  });
};

const GetLatestCoupon = async () => {
  const now = new Date();
  return prisma.coupon.findFirst({
    where: {
      isDeleted: false,
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    orderBy: { createdAt: 'desc' },
  });
};

const ToggleCoupon = async (id: string) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon || coupon.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  return prisma.coupon.update({
    where: { id },
    data: { isActive: !coupon.isActive },
  });
};

const DeleteCoupon = async (id: string) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon || coupon.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  await prisma.coupon.update({
    where: { id },
    data: { isDeleted: true, isActive: false },
  });
};

const ApplyCoupon = async (payload: { code: string; subtotal: number }) => {
  const code = payload.code.trim().toUpperCase();
  const subtotal = Number(payload.subtotal) || 0;

  const coupon = await prisma.coupon.findFirst({
    where: { code, isDeleted: false },
  });

  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid coupon code');
  }
  if (!coupon.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Coupon is inactive');
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Coupon expired');
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Coupon usage limit reached');
  }
  if (subtotal < coupon.minPurchase) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Minimum purchase of ${coupon.minPurchase} required`,
    );
  }

  let discount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.value;
  }
  if (discount > subtotal) discount = subtotal;

  return {
    code: coupon.code,
    description: coupon.description,
    discountType: coupon.discountType,
    value: coupon.value,
    discount: Number(discount.toFixed(2)),
  };
};

export const CouponService = {
  CreateCoupon,
  GetAllCoupons,
  GetLatestCoupon,
  ToggleCoupon,
  DeleteCoupon,
  ApplyCoupon,
};
