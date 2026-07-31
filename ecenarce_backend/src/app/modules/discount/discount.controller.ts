// app/modules/discount/discount.controller.ts
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DiscountService } from './discount.service';

const createDiscount = catchAsync(async (req, res) => {
  const result = await DiscountService.createDiscount(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Discount created successfully',
    data: result,
  });
});

const getAllDiscounts = catchAsync(async (req, res) => {
  const result = await DiscountService.getAllDiscounts(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Discounts retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getActiveDiscounts = catchAsync(async (req, res) => {
  const result = await DiscountService.getActiveDiscounts();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Active discounts retrieved successfully',
    data: result,
  });
});

const getProductDiscounts = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await DiscountService.getProductDiscounts(productId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product discounts retrieved successfully',
    data: result,
  });
});

const getDiscountById = catchAsync(async (req, res) => {
  const { discountId } = req.params;
  const result = await DiscountService.getDiscountById(discountId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Discount retrieved successfully',
    data: result,
  });
});

const updateDiscount = catchAsync(async (req, res) => {
  const { discountId } = req.params;
  const result = await DiscountService.updateDiscount(discountId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Discount updated successfully',
    data: result,
  });
});

const deactivateDiscount = catchAsync(async (req, res) => {
  const { discountId } = req.params;
  const result = await DiscountService.deactivateDiscount(discountId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Discount deactivated successfully',
    data: result,
  });
});

const deleteDiscount = catchAsync(async (req, res) => {
  const { discountId } = req.params;
  const result = await DiscountService.deleteDiscount(discountId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Discount deleted successfully',
    data: result,
  });
});

export const DiscountController = {
  createDiscount,
  getAllDiscounts,
  getActiveDiscounts,
  getProductDiscounts,
  getDiscountById,
  updateDiscount,
  deactivateDiscount,
  deleteDiscount,
};
