import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { blogService } from './blog.service';
import AppError from '../../errors/AppError';
import pick from '../../utils/PickFunction';

const createBlog = catchAsync(async (req, res) => {
    const file = req.file;
    if (!file) {
      throw new AppError(httpStatus.CONFLICT, 'blog image is required');
    }

  const result = await blogService.createBlog(file,req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Blog created successfully',
    data: result,
  });
});

const getAllBlog = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['shot_title']);
    const options = pick(req.query, ['limit', 'page', 'sort', 'order']);
  const result = await blogService.getAllBlog(filter,options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blogs retrieved successfully',
    data: result,
  });
});

const getSingleBlog = catchAsync(async (req, res) => {
  const result = await blogService.getSingleBlog(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blog retrieved successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const result = await blogService.updateBlog(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const result = await blogService.deleteBlog(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blog deleted successfully',
    data: result,
  });
});

export const blogController = {
  createBlog,
  getAllBlog,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
