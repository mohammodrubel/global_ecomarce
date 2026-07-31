import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductColorService } from './productColor.service';

// CREATE
const createProductColor = catchAsync(async (req, res) => {
  const result = await ProductColorService.createProductColor(req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Product Color Created Successfully',
    data: result,
  });
});

// GET ALL
const getAllProductColors = catchAsync(async (req, res) => {
  const result = await ProductColorService.getAllProductColors()

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All Product Colors Retrieved Successfully',
    data: result,
  });
});

// GET SINGLE
const getSingleProductColor = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductColorService.getSingleProductColor(id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Single Product Color Retrieved Successfully',
    data: result,
  });
});

// UPDATE
const updateProductColor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await ProductColorService.updateProductColor(id,payload)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product Color Updated Successfully',
    data: result,
  });
});

// DELETE
const deleteProductColor = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductColorService.deleteProductColor(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product Color Deleted Successfully',
    data: result,
  });
});


export const ProductColorController = {
  createProductColor,
  getAllProductColors,
  getSingleProductColor,
  updateProductColor,
  deleteProductColor,
};
