import { Brand } from "@prisma/client";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { sendImageCloudinary } from "../../utils/sendImageToCloudinary";

const createBrand = async (
    file: Express.Multer.File,
    data:Brand,
) => {
    console.log(data,'data')
    if (!file) throw new AppError(httpStatus.CONFLICT, 'Image is required');
    const imageName =
        new Date().toTimeString().replace(/:/g, '-') + '-' + file.originalname;

    const uploadResult: any = await sendImageCloudinary(file.buffer, imageName);

    // Prisma expects description to be a string (required)
    const result = await prisma.brand.create({
        data: {
            name: data.name,
            description: data.description,
            logo: uploadResult.secure_url,
        },
    });

    return result;
};
// Get All Categories
const getAllBrand = async () => {
    const reuslt = await prisma.brand.findMany({})
    return reuslt

};

// Get Single Category by ID
const getBrand = async (id: string) => {
    const isExist = await prisma.brand.findUnique(
        {
            where: { id }
        }
    )
    if (!isExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Brand  Not Found")
    }

    return isExist
};

// Update Category by ID
const updateBrand = async (id: string, updateData: Partial<Brand>) => {
    const isExist = await prisma.brand.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Brand  Not Found');
    }
    const result = await prisma.brand.update(
        {
            where: {
                id: id
            },
            data: {
                name:updateData.name,
                description:updateData.description
            }
        }
    )

    return result

};

const updatebrandPhoto = async (file: any, id: string) => {
    const isExist = await prisma.brand.findUnique({
        where: { id }, 
    });
    if(!isExist){
        throw new AppError(httpStatus.CONFLICT,"invalid id ")
    }
    if (!file) throw new AppError(httpStatus.CONFLICT, 'Image is required');
    const imageName =
        new Date().toTimeString().replace(/:/g, '-') + '-' + file.originalname;

    const uploadResult: any = await sendImageCloudinary(file.buffer, imageName);
    await prisma.brand.update({
        data: {
            logo: uploadResult.secure_url,
        },
        where: {
            id: id
        }
    });

    return await isExist;

}

// Delete Brand by ID and all associated products
const deleteBrand = async (id: string) => {
    const isExist = await prisma.brand.findUnique({
        where: { id },
    });
    
    if (!isExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Brand Not Found');
    }

    // First delete all products associated with this brand
    await prisma.product.deleteMany({
        where: {
            brandId: id
        }
    });

    // Then delete the brand
    const result = await prisma.brand.delete({
        where: {
            id
        }
    });

    return result;
};
export const brandService = {
    createBrand,
    getAllBrand,
    getBrand,
    updateBrand,
    deleteBrand,
    updatebrandPhoto
};
