import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const CreateReview = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await ReviewService.CreateReview(userId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Review submitted',
    data: result,
  });
});

const GetProductReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.GetProductReviews(req.params.productId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reviews retrieved',
    data: result,
  });
});

const GetMyReviews = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await ReviewService.GetMyReviews(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'My reviews retrieved',
    data: result,
  });
});

export const ReviewController = {
  CreateReview,
  GetProductReviews,
  GetMyReviews,
};
