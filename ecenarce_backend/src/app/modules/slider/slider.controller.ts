import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SliderService } from './slider.service';

// Create slider
const createSlider = catchAsync(async (req, res) => {
  const result = await SliderService.createSlider(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Slider created successfully',
    data: result,
  });
});

// Get all sliders
const getAllSliders = catchAsync(async (req, res) => {
  const result = await SliderService.getAllSliders();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Sliders retrieved successfully',
    data: result,
  });
});

// Get single slider
const getSingleSlider = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Slider ID is required',
    });
  }

  const result = await SliderService.getSingleSlider(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Slider retrieved successfully',
    data: result,
  });
});

// Update slider
const updateSlider = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Slider ID is required',
    });
  }

  const payload = req.body;
  const result = await SliderService.updateSlider(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Slider updated successfully',
    data: result,
  });
});

// Delete slider
const deleteSlider = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Slider ID is required',
    });
  }

  const result = await SliderService.deleteSlider(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Slider deleted successfully',
    data: result,
  });
});

export const SliderController = {
  createSlider,
  getAllSliders,
  getSingleSlider,
  updateSlider,
  deleteSlider,
};

export default SliderController;
