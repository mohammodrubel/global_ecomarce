import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import config from '../../config';
import { PaymentService } from './payment.service';

const InitOrderPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.InitOrderPayment(
    req.params.orderId,
    req.user.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'EPS payment initialized',
    data: result,
  });
});

const successCallback = catchAsync(async (req: Request, res: Response) => {
  const orderId = String(req.query.orderId || '');
  const mtid = String(req.query.mtid || '');
  await PaymentService.HandleCallback(orderId, mtid, 'success');
  res.redirect(
    `${config.frontend_url}/payment/success?orderId=${orderId}&mtid=${mtid}`,
  );
});

const failCallback = catchAsync(async (req: Request, res: Response) => {
  const orderId = String(req.query.orderId || '');
  const mtid = String(req.query.mtid || '');
  await PaymentService.HandleCallback(orderId, mtid, 'fail');
  res.redirect(
    `${config.frontend_url}/payment/fail?orderId=${orderId}&mtid=${mtid}`,
  );
});

const cancelCallback = catchAsync(async (req: Request, res: Response) => {
  const orderId = String(req.query.orderId || '');
  const mtid = String(req.query.mtid || '');
  await PaymentService.HandleCallback(orderId, mtid, 'cancel');
  res.redirect(
    `${config.frontend_url}/payment/cancel?orderId=${orderId}&mtid=${mtid}`,
  );
});

const verifyStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.VerifyStatus(
    req.params.orderId,
    req.user.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment status',
    data: result,
  });
});

export const PaymentController = {
  InitOrderPayment,
  successCallback,
  failCallback,
  cancelCallback,
  verifyStatus,
};
