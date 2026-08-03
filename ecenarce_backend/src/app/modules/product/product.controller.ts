// app/modules/product/product.controller.ts
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductService } from './product.service';
import pick from '../../utils/PickFunction';
import { paginationFields, productSearchFields } from './productContains';

// Create a new product
const createProduct = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;
  const result = await ProductService.createProduct(req.body, files);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'New product created successfully',
    data: result,
  });
});

// Get a product by ID
const getProduct = catchAsync(async (req, res) => {
  const result = await ProductService.getProduct(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product fetched successfully',
    data: result,
  });
});

// Get all products
const getAllProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, productSearchFields);
  const options = pick(req.query, paginationFields);
  const result = await ProductService.getAllProducts(filter, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All products fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

// Get featured products
const fetchersProduct = catchAsync(async (req, res) => {
  const result = await ProductService.fetchersProduct();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Featured products fetched successfully',
    data: result,
  });
});

// Get new products
const newProduct = catchAsync(async (req, res) => {
  const result = await ProductService.newProduct();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'New products fetched successfully',
    data:await result,
  });
});

// Get bestsellers (top delivered)
const getBestsellers = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const result = await ProductService.getBestsellers(limit);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bestseller products fetched successfully',
    data: result,
  });
});

// Get discounted products
const getDiscountedProducts = catchAsync(async (req, res) => {
  const result = await ProductService.getDiscountedProducts();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Discounted products fetched successfully',
    data: result,
  });
});

// Update a product by ID
const updateProduct = catchAsync(async (req, res) => {
  const result = await ProductService.updateProduct(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product updated successfully',
    data: result,
  });
});

// Delete a product by ID
const deleteProduct = catchAsync(async (req, res) => {
  const result = await ProductService.deleteProduct(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product deleted successfully',
    data: result,
  });
});

// Update a product's images independently (add / replace / remove)
const updateProductImages = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;
  const result = await ProductService.updateProductImages(
    req.params.id,
    files,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product images updated successfully',
    data: result,
  });
});

// Get related products by category
const relatedCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductService.getRelatedCategory(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Related products fetched successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  fetchersProduct,
  newProduct,
  relatedCategory,
  getDiscountedProducts,
  updateProductImages,
  getBestsellers,
};
