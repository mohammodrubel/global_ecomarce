import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { advertisementService } from './add.service';

// Create Add
const createAdd = catchAsync(async (req, res) => {
  const result = await advertisementService.createAdd(req.body);

  res.set('Cache-Control', 'no-store');

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Add created successfully',
    data: result,
  });
});

// Get All Adds
const getAllAdd = catchAsync(async (req, res) => {
  const result = await advertisementService.getAllAdd();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Adds retrieved successfully',
    data: result,
  });
});

// Get Single Add
const getSingleAdd = catchAsync(async (req, res) => {
  res.set('Cache-Control', 'no-store');

  const { id } = req.params;

  const result = await advertisementService.getSingleAdd(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Add retrieved successfully',
    data: result,
  });
});

// Update Add
const updateSingleAdd = catchAsync(async (req, res) => {
  res.set('Cache-Control', 'no-store');

  const { id } = req.params;

  const result = await advertisementService.updateSingleAdd(
    id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Add updated successfully',
    data: result,
  });
});

// Delete Add
const deleteAdd = catchAsync(async (req, res) => {
  res.set('Cache-Control', 'no-store');

  const { id } = req.params;

  const result = await advertisementService.deleteAdd(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Add deleted successfully',
    data: result,
  });
});

export const advertisementController = {
  createAdd,
  getAllAdd,
  getSingleAdd,
  updateSingleAdd,
  deleteAdd,
};