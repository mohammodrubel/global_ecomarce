import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryService } from './category.service';
import AppError from '../../errors/AppError';

// Create Category
const createCategory = catchAsync(async (req, res) => {
const file = req.file;

if (!file) {
  throw new AppError(httpStatus.CONFLICT, 'Icon is required');
}

const result = await CategoryService.createCategory(file, req.body);

sendResponse(res, {
  success: true,
  statusCode: httpStatus.CREATED,
  message: 'Category Created Successfully',
  data: result,
});
});

// Get All Categories
const getCategories = catchAsync(async (req, res) => {
  const result = await CategoryService.getCategories();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Categories fetched successfully',
    data: result,
  });
});

// Get Single Category by ID
const getCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.getCategory(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category fetched successfully',
    data: result,
  });
});

const getCategoryForRelations = catchAsync(async(req,res)=>{
  const result = await CategoryService.getCategoryForRelations()
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'relations for Category and subcategories fetched successfully',
    data: result,
  });
})

// Update Category by ID
const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.updateCategory(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category updated successfully',
    data: result,
  });
});

// Delete Category by ID
const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.deleteCategory(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryForRelations,
};
