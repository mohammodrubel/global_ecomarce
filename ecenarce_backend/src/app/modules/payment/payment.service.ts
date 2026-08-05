import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import config from '../../config';
import {
  checkEPSTransactionStatus,
  initializeEPS,
  mapEPSStatus,
} from './eps.client';

const genMerchantTxnId = () => {
  const ts = Date.now().toString();
  const rand = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0');
  return `EPS${ts}${rand}`;
};

const InitOrderPayment = async (orderId: string, requesterId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  if (order.userId !== requesterId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Not your order');
  }
  if (order.paymentMethod !== 'EPS') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Order is not marked for EPS payment',
    );
  }
  if (order.paymentStatus === 'PAID') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order already paid');
  }

  const merchantTransactionId = order.merchantTransactionId || genMerchantTxnId();

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

  await prisma.order.update({
    where: { id: order.id },
    data: {
      merchantTransactionId,
      paymentStatus: 'PENDING',
    },
  });

  return { redirectUrl, merchantTransactionId };
};

const HandleCallback = async (
  orderId: string,
  merchantTransactionId: string,
  outcome: 'success' | 'fail' | 'cancel',
) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found');

  let finalStatus: 'PAID' | 'FAILED' | 'CANCELLED' | 'PENDING' = 'PENDING';
  let epsTransactionId: string | undefined;

  try {
    const raw = await checkEPSTransactionStatus(merchantTransactionId);
    finalStatus = mapEPSStatus(raw);
    epsTransactionId =
      (raw.epsTransactionId as string) ||
      ((raw.data as Record<string, unknown>)?.epsTransactionId as string) ||
      undefined;
  } catch {
    if (outcome === 'success') finalStatus = 'PAID';
    else if (outcome === 'fail') finalStatus = 'FAILED';
    else if (outcome === 'cancel') finalStatus = 'CANCELLED';
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: finalStatus,
      epsTransactionId,
      paidAt: finalStatus === 'PAID' ? new Date() : null,
      status:
        finalStatus === 'PAID'
          ? 'PROCESSING'
          : finalStatus === 'CANCELLED'
            ? 'CANCELLED'
            : order.status,
    },
  });

  if (finalStatus !== 'PAID' && order.status === 'PENDING') {
    const items = await prisma.orderItem.findMany({ where: { orderId } });
    await prisma.$transaction(
      items.map((it) =>
        prisma.product.update({
          where: { id: it.productId },
          data: { stock: { increment: it.quantity } },
        }),
      ),
    );
  }

  return { order: updated, finalStatus };
};

const VerifyStatus = async (orderId: string, requesterId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  if (order.userId !== requesterId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Not your order');
  }
  if (!order.merchantTransactionId) {
    return { paymentStatus: order.paymentStatus, order };
  }
  const raw = await checkEPSTransactionStatus(order.merchantTransactionId);
  const mapped = mapEPSStatus(raw);
  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: mapped,
      paidAt: mapped === 'PAID' ? order.paidAt || new Date() : order.paidAt,
    },
  });
  return { paymentStatus: mapped, order: updated, raw };
};

export const PaymentService = {
  InitOrderPayment,
  HandleCallback,
  VerifyStatus,
  genMerchantTxnId,
};
