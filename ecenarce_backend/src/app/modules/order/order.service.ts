import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import config from '../../config';
import { initializeEPS } from '../payment/eps.client';
import { PaymentService } from '../payment/payment.service';

type CartItem = {
  productId: string;
  quantity: number;
};

type CreateOrderInput = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
  paymentMethod?: PaymentMethod;
  couponCode?: string | null;
  items: CartItem[];
};

const INSIDE_DHAKA_SHIPPING = 70;
const OUTSIDE_DHAKA_SHIPPING = 120;

const CreateOrder = async (userId: string, payload: CreateOrderInput) => {
  if (!payload.items?.length) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cart is empty');
  }

  const productIds = payload.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isDeleted: false },
  });

  if (products.length !== productIds.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'One or more products no longer exist',
    );
  }

  let subtotal = 0;
  const itemsData = payload.items.map((it) => {
    const product = products.find((p) => p.id === it.productId)!;
    if (it.quantity > product.stock) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient stock for ${product.name}`,
      );
    }
    subtotal += product.price * it.quantity;
    return {
      productId: product.id,
      quantity: it.quantity,
      price: product.price,
    };
  });

  // Coupon
  let discount = 0;
  let appliedCouponCode: string | null = null;
  if (payload.couponCode) {
    const code = payload.couponCode.trim().toUpperCase();
    const coupon = await prisma.coupon.findFirst({
      where: { code, isDeleted: false },
    });
    if (
      coupon &&
      coupon.isActive &&
      (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
      (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
      subtotal >= coupon.minPurchase
    ) {
      if (coupon.discountType === 'PERCENTAGE') {
        discount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.value;
      }
      if (discount > subtotal) discount = subtotal;
      appliedCouponCode = coupon.code;
    }
  }

  const shipping =
    payload.city.trim().toLowerCase() === 'dhaka'
      ? INSIDE_DHAKA_SHIPPING
      : OUTSIDE_DHAKA_SHIPPING;

  const totalPrice = Math.max(0, subtotal - discount) + shipping;

  const paymentMethod: PaymentMethod = payload.paymentMethod || 'COD';
  const merchantTransactionId =
    paymentMethod === 'EPS' ? PaymentService.genMerchantTxnId() : null;

  // Transaction: create order + decrement stock + bump coupon usage
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        city: payload.city,
        postalCode: payload.postalCode,
        country: payload.country,
        notes: payload.notes,
        subtotal,
        discount,
        couponCode: appliedCouponCode,
        shipping,
        totalPrice,
        paymentMethod,
        merchantTransactionId,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    for (const it of itemsData) {
      await tx.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.quantity } },
      });
    }

    if (appliedCouponCode) {
      await tx.coupon.update({
        where: { code: appliedCouponCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    return created;
  });

  if (paymentMethod === 'EPS' && merchantTransactionId) {
    const productList = order.items.map((it) => ({
      ProductName: it.product?.name || 'Product',
      NoOfItem: String(it.quantity),
      ProductProfile: it.product?.images?.[0] || '',
      ProductCategory: '',
      ProductPrice: String(it.price),
    }));

    const successUrl = `${config.backend_url}/api/payment/eps/success?orderId=${order.id}&mtid=${merchantTransactionId}`;
    const failUrl = `${config.backend_url}/api/payment/eps/fail?orderId=${order.id}&mtid=${merchantTransactionId}`;
    const cancelUrl = `${config.backend_url}/api/payment/eps/cancel?orderId=${order.id}&mtid=${merchantTransactionId}`;

    try {
      const { redirectUrl } = await initializeEPS({
        merchantTransactionId,
        customerOrderId: order.id,
        totalAmount: order.totalPrice,
        successUrl,
        failUrl,
        cancelUrl,
        customerName: order.fullName,
        customerEmail: order.email,
        customerAddress: order.address,
        customerCity: order.city,
        customerPostcode: order.postalCode,
        customerCountry: order.country,
        customerPhone: order.phone,
        productList,
      });

      return { ...order, redirectUrl };
    } catch (err) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'FAILED' },
      });
      throw err;
    }
  }

  return order;
};

const GetMyOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { product: true } },
    },
  });
};

const GetAllOrders = async () => {
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, full_name: true, email: true } },
      items: { include: { product: true } },
    },
  });
};

const GetOrderById = async (
  id: string,
  requesterId: string,
  isAdmin: boolean,
) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, full_name: true, email: true } },
      items: { include: { product: true } },
    },
  });
  if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  if (!isAdmin && order.userId !== requesterId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Not your order');
  }
  return order;
};

const UpdateOrderStatus = async (id: string, status: OrderStatus) => {
  const exists = await prisma.order.findUnique({ where: { id } });
  if (!exists) throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  return prisma.order.update({
    where: { id },
    data: { status },
    include: { items: { include: { product: true } } },
  });
};

const CancelOrder = async (id: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  if (order.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Not your order');
  }
  if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Order can no longer be cancelled',
    );
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
    for (const it of order.items) {
      await tx.product.update({
        where: { id: it.productId },
        data: { stock: { increment: it.quantity } },
      });
    }
    return updated;
  });
};

export const OrderService = {
  CreateOrder,
  GetMyOrders,
  GetAllOrders,
  GetOrderById,
  UpdateOrderStatus,
  CancelOrder,
};
