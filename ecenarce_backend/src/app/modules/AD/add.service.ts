import { advertisement } from '@prisma/client';
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createAdd = async (data: advertisement) => {
  if (!data || !data.productId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid advertisement data: productId missing',
    );
  }

  const isExistProduct = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  // if (isExistProduct) {
  //   throw new AppError(
  //     httpStatus.CONFLICT,
  //     'This product already has an active advertisement. Please choose another product.',
  //   );
  // }

  return await prisma.advertisement.create({ data });
};
const getAllAdd = async () => {
  const result = await prisma.advertisement.findMany({
    select: {
      id: true,
      title: true,
      action: true,
      active: true,
      product: true,
    },
  });
  console.log(result,"ad")
  return result;
};


const getSingleAdd = async (id:string) => {
    const reuslt = await prisma.advertisement.findUnique({
      where: {
        id: id,
      },
    });

    return reuslt
};

const updateSingleAdd = async (id: string, data: Partial<advertisement>) => {
  // Fetch the existing advertisement
  const existingAd = await prisma.advertisement.findUnique({
    where: { id },
  });

  if (!existingAd) {
    throw new AppError(httpStatus.NOT_FOUND, 'Advertisement not found');
  }

  // If the update includes setting active to true
  if (data.active) {
    // Check mutual exclusivity for Fetchers
    if (existingAd.action === 'Fetchers') {
      const activeFetcher = await prisma.advertisement.findFirst({
        where: { action: 'Fetchers', active: true, NOT: { id } },
      });
      if (activeFetcher) {
        throw new AppError(
          httpStatus.CONFLICT,
          'Another Fetchers advertisement is already active',
        );
      }
    }

    // Check mutual exclusivity for NewProduct
    if (existingAd.action === 'NewProduct') {
      const activeNewProduct = await prisma.advertisement.findFirst({
        where: { action: 'NewProduct', active: true, NOT: { id } },
      });
      if (activeNewProduct) {
        throw new AppError(
          httpStatus.CONFLICT,
          'Another NewProduct advertisement is already active',
        );
      }
    }
  }

  // Update the advertisement
  const updatedAd = await prisma.advertisement.update({
    where: { id },
    data: { ...data },
  });

  return updatedAd;
};

const deleteAdd = async (id:string) => {
    const reuslt = await prisma.advertisement.delete(
        {
            where:{
                id
            }
        }
    )
    return reuslt
};
export const advertisementService = {
  createAdd,
  getAllAdd,
  getSingleAdd,
  updateSingleAdd,
  deleteAdd,
};
