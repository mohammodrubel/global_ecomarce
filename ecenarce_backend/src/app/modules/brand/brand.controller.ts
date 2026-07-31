import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { brandService } from './brand.service';
import AppError from '../../errors/AppError';

const createBrand = catchAsync(async (req, res) => {
  const file = req.file;
  if (!file) {
    throw new AppError(httpStatus.CONFLICT, 'Brand image is required');
  }

 const reuslt = await brandService.createBrand(file,req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Brand created successfully',
    data: reuslt,
  });
});


const getAllBrand = catchAsync(async (req, res) => {
  const result = await brandService.getAllBrand();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brands fetched successfully',
    data: result,
  });
});


const getBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await brandService.getBrand(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand fetched successfully',
    data: result,
  });
});


const updateBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await brandService.updateBrand(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand updated successfully',
    data: result,
  });
});


const deleteBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await brandService.deleteBrand(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand deleted successfully',
    data: result,
  });
});

const updateBrandPhoto = catchAsync(async(req,res)=>{
  const file = req.file 
  const id =  req.params.id 
  const result =await brandService.updatebrandPhoto(file,id)
   sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'update image successfully',
    data: result,
  });
})

export const BrandController = {
  createBrand,
  getAllBrand,
  getBrand,
  updateBrandPhoto,
  updateBrand,
  deleteBrand,
};
