import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { sendImageCloudinary } from "../../utils/sendImageToCloudinary";
import prisma from "../../utils/prisma";
import { blog, Prisma } from "@prisma/client";
import calculatePagination from "../../utils/pagination";


const createBlog = async (file: Express.Multer.File, data: blog) => {

    if (!file) throw new AppError(httpStatus.CONFLICT, 'Image is required');
    const imageName = new Date().toTimeString().replace(/:/g, '-') + '-' + file.originalname;
    const uploadResult: any = await sendImageCloudinary(file.buffer, imageName);
    const reuslt = await prisma.blog.create(
        {
            data: {
                title: data.title,
                shot_title: data.shot_title,
                descrioption: data?.descrioption,
                date_for_publish: data?.date_for_publish,
                image: uploadResult.secure_url
            }
        }
    )
    return reuslt
};

const getAllBlog = async (query: any, options: any) => {
    const { limit, page, order, sort } = calculatePagination(options);
    //   blogwhareInput;
    const { searchTerm, ...filterData } = query;
    const productSearchFields = ['title', 'descrioption', 'shot_title'];

    const andConditions: Prisma.blogWhereInput[] = [];

    // SearchTerm condition
    if (searchTerm) {
        andConditions.push({
            OR: productSearchFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    // Exact match filters
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }

    const whereCondition: Prisma.blogWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.blog.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy:
            options.sort && options.order
                ? {
                    [options.order]: sort || 'createdAt',
                }
                : { createdAt: 'desc' },

    });
    const total = await prisma.blog.count({
        where: whereCondition,
    });
    console.log(total) // i got vlaue
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total, // i dindet get vlue
        },
        data: result,
    };
};
// Get a single blog by ID
const getSingleBlog = async (id: string) => {
    const blogItem = await prisma.blog.findUnique({ where: { id } });
    if (!blogItem)
        throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
    return blogItem;
};

// Update a blog
const updateBlog = async (id: string, data: Partial<blog>, file?: Express.Multer.File) => {
    const existingBlog = await prisma.blog.findUnique({ where: { id } });
    if (!existingBlog)
        throw new AppError(httpStatus.NOT_FOUND, "Blog not found");

    if (!data.descrioption && !existingBlog.descrioption) {
        throw new AppError(httpStatus.BAD_REQUEST, "Descrioption is required");
    }

    let imageUrl = existingBlog.image;

    if (file) {
        const imageName =
            new Date().toTimeString().replace(/:/g, "-") + "-" + file.originalname;
        const uploadResult: any = await sendImageCloudinary(file.buffer, imageName);
        imageUrl = uploadResult.secure_url;
    }

    const updatedBlog = await prisma.blog.update({
        where: { id },
        data: {
            title: data.title ?? existingBlog.title,
            shot_title: data.shot_title ?? existingBlog.shot_title,
            descrioption: data.descrioption ?? existingBlog.descrioption,
            date_for_publish: data.date_for_publish ?? existingBlog.date_for_publish,
            image: imageUrl,
        },
    });

    return updatedBlog;
};

// Delete a blog
const deleteBlog = async (id: string) => {
    const existingBlog = await prisma.blog.findUnique({ where: { id } });
    if (!existingBlog)
        throw new AppError(httpStatus.NOT_FOUND, "Blog not found");

    await prisma.blog.delete({ where: { id } });
    return { message: "Blog deleted successfully" };
};


export const blogService = {
    createBlog,
    getAllBlog,
    getSingleBlog,
    updateBlog,
    deleteBlog
}