import { Slider } from '@prisma/client';
import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

// Create slider
const createSlider = async (payload: Slider) => {
  // Check if the product exists
  const validProduct = await prisma.product.findUnique({
    where: { id: payload.productId },
  });

  if (!validProduct) {
    throw new AppError(httpStatus.NOT_FOUND, 'This product does not exist');
  }

  // Check if a slider for this product already exists
  const existingSlider = await prisma.slider.findUnique({
    where: { productId: payload.productId },
  });

  if (existingSlider) {
    throw new AppError(httpStatus.CONFLICT, 'This product banner already exists');
  }

  // Create slider
  const result = await prisma.slider.create({
    data: payload,
  });

  return result;
};

// Get all sliders with product details
const getAllSliders = async () => {
  const sliders = await prisma.slider.findMany({
    include: { product: true }, // Include related product info
  });
  return sliders;
};

// Get single slider by id
const getSingleSlider = async (id: string) => {
  const slider = await prisma.slider.findUnique({
    where: { id },
    include: { product: true },
  });

  if (!slider) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slider not found');
  }

  return slider;
};

// Update slider
const updateSlider = async (id: string, payload: Partial<Slider>) => {
  // Check if slider exists
  const slider = await prisma.slider.findUnique({ where: { id } });
  if (!slider) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slider not found');
  }

  // If productId is being updated, check if new product exists
  if (payload.productId && payload.productId !== slider.productId) {
    const validProduct = await prisma.product.findUnique({
      where: { id: payload.productId },
    });
    if (!validProduct) {
      throw new AppError(httpStatus.NOT_FOUND, 'The new product does not exist');
    }

    // Check if another slider already exists for the new product
    const existingSlider = await prisma.slider.findUnique({
      where: { productId: payload.productId },
    });
    if (existingSlider) {
      throw new AppError(httpStatus.CONFLICT, 'A slider for this product already exists');
    }
  }

  // Update slider
  const updatedSlider = await prisma.slider.update({
    where: { id },
    data: payload,
  });

  return updatedSlider;
};

// Delete slider
const deleteSlider = async (id: string) => {
  const slider = await prisma.slider.findUnique({ where: { id } });
  if (!slider) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slider not found');
  }

  await prisma.slider.delete({ where: { id } });

  return { message: 'Slider deleted successfully' };
};

export const SliderService = {
  createSlider,
  getAllSliders,
  getSingleSlider,
  updateSlider,
  deleteSlider,
};
