import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SpecialOfferService } from './special-offer.service';
import AppError from '../../errors/AppError';

const createSpecialOffer = catchAsync(async (req, res, next) => {

  const result = await SpecialOfferService.createSpecialOffer( req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Special offer created successfully',
    data: result,
  });
});

const getAllSpecialOffers = catchAsync(async (req, res, next) => {
  const result = await SpecialOfferService.getAllSpecialOffers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Special offers retrieved successfully',
    data: result,
  });
});

const getSingleSpecialOffer = catchAsync(async (req, res, next) => {
  const result = await SpecialOfferService.getSingleSpecialOffer(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Special offer retrieved successfully',
    data: result,
  });
});

const editSpecialOffer = catchAsync(async (req, res, next) => {
  const file = req.file;
  const result = await SpecialOfferService.editSpecialOffer(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Special offer updated successfully',
    data: result,
  });
});

const deleteSpecialOffer = catchAsync(async (req, res, next) => {
  const result = await SpecialOfferService.deleteSpecialOffer(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Special offer deleted successfully',
    data: result,
  });
});

export const SpecialOfferController = {
  createSpecialOffer, // Fixed typo
  getAllSpecialOffers,
  getSingleSpecialOffer,
  editSpecialOffer,
  deleteSpecialOffer,
};
