/* eslint-disable @typescript-eslint/no-explicit-any */


import { Category } from '@prisma/client';
import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { sendImageCloudinary } from '../../utils/sendImageToCloudinary';

// Create Category
// Sanitize filename for Cloudinary
function sanitizeFileName(filename: string) {
  return filename
    .replace(/[:\s()+]/g, '_') // replace spaces, :, (), +
    .replace(/&/g, 'and');     // replace & with 'and'
}

const createCategory = async (
  file: Express.Multer.File,
  data: any
) => {
  const imageName = sanitizeFileName(
    new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
  );

  const uploadResult: any = await sendImageCloudinary(file.buffer, imageName);

  const category = await prisma.category.create({
    data: {
      ...data,
      icon: uploadResult.secure_url,
    },
  });

  return category;
};

export default {
  createCategory,
};
// Get All Categories
const getCategories = async () => {
  const reuslt = await prisma.category.findMany({
    where: {
      isDeleted: false,
    },
  });
  return reuslt;
};
const getCategoryForRelations = async () => {
  const result = await prisma.category.findMany({
    where:{
      isDeleted:false 
    },
    select: {
      id: true,
      name: true,
      subcategories: true,
    },
  });

  return result;
};
// Get Single Category by ID
const getCategory = async (id: string) => {
  const findCategory = await prisma.category.findUnique({ where: { id } });
  if (!findCategory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  const result = await prisma.category.findFirst({
    where: {
      id,
    },
  });
  return result;
};

const updateCategory = async (id: string, updateData: Partial<Category>) => {
  const findCategory = await prisma.category.findUnique({ where: { id } });
  if (!findCategory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  // Decide new subcategories
  let newSubcategories: string[] = [];
  if (updateData.subcategories) {
    newSubcategories = updateData.subcategories;
  }

  const result = await prisma.category.update({
    where: { id },
    data: {
      ...updateData,
      subcategories: newSubcategories,
    },
  });

  return result;
};
const deleteCategory = async (id: string) => {
  // Check if category exists
  const findCategory = await prisma.category.findUnique({ where: { id } });
  if (!findCategory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  // Soft-delete the category
  const updatedCategory = await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });

  // Delete all products related to this category
  await prisma.product.updateMany({
    where: { categoryId: id },
    data: { isDeleted: true }, 
  });

  return updatedCategory;
};

export const CategoryService = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryForRelations,
};