import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CouponService } from './coupon.service';

const CreateCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.CreateCoupon(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Coupon created successfully',
    data: result,
  });
});

const GetAllCoupons = catchAsync(async (_req: Request, res: Response) => {
  const result = await CouponService.GetAllCoupons();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupons retrieved successfully',
    data: result,
  });
});

const GetLatestCoupon = catchAsync(async (_req: Request, res: Response) => {
  const result = await CouponService.GetLatestCoupon();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Latest coupon retrieved',
    data: result,
  });
});

const ToggleCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.ToggleCoupon(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupon status updated',
    data: result,
  });
});

const DeleteCoupon = catchAsync(async (req: Request, res: Response) => {
  await CouponService.DeleteCoupon(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupon deleted successfully',
  });
});

const ApplyCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.ApplyCoupon(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Coupon applied',
    data: result,
  });
});

export const CouponController = {
  CreateCoupon,
  GetAllCoupons,
  GetLatestCoupon,
  ToggleCoupon,
  DeleteCoupon,
  ApplyCoupon,
};
