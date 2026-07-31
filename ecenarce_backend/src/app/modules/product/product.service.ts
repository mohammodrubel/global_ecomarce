// app/modules/product/product.service.ts
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import { sendImageCloudinary } from '../../utils/sendImageToCloudinary';
import { Product, ProductType } from '@prisma/client';
import calculatePagination from '../../utils/pagination';

export const createProduct = async (
  data: Product & { colors?: string[] },
  files?: Express.Multer.File[],
) => {
  // Validate images
  if (!files || files.length === 0) {
    throw new AppError(httpStatus.CONFLICT, 'At least one image is required');
  }

  if (files.length > 3) {
    throw new AppError(httpStatus.CONFLICT, 'Maximum 3 images are allowed');
  }

  // Validate category
  const isCategoryExist = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!isCategoryExist) {
    throw new AppError(httpStatus.CONFLICT, 'Invalid category Id');
  }

  // Validate brand
  const isBrandExist = await prisma.brand.findUnique({
    where: { id: data.brandId },
  });

  if (!isBrandExist) {
    throw new AppError(httpStatus.CONFLICT, 'Invalid Brand Id');
  }

  // Validate colors if provided
  if (data.colors && data.colors.length > 0) {
    const existingColors = await prisma.color.findMany({
      where: { id: { in: data.colors } },
    });

    if (existingColors.length !== data.colors.length) {
      throw new AppError(
        httpStatus.CONFLICT,
        'One or more color IDs are invalid',
      );
    }
  }

  // Check if SKU already exists
  const existingProduct = await prisma.product.findUnique({
    where: { sku: data.sku },
  });

  if (existingProduct) {
    throw new AppError(httpStatus.CONFLICT, 'SKU already exists');
  }

  // Upload images to Cloudinary
  const imageUrls: string[] = [];
  for (const file of files) {
    const imageName = `${new Date().toTimeString().replace(/:/g, '-')}-${file.originalname}`;
    const uploadResult: any = await sendImageCloudinary(file.buffer, imageName);
    imageUrls.push(uploadResult.secure_url);
  }

  // Prepare product data with proper many-to-many relationships
  const productData: any = {
    name: data.name,
    description: data.description,
    price: data.price,
    originalPrice: data.originalPrice || data.price,
    stock: data.stock,
    sku: data.sku,
    brandId: data.brandId,
    categoryId: data.categoryId,
    subcategory: data.subcategory,
    badge: data.badge,
    inStock: data.stock > 0,
    images: imageUrls,
  };

  // Add colors connection if colors are provided
  if (data.colors && data.colors.length > 0) {
    productData.colors = {
      connect: data.colors.map((colorId: string) => ({ id: colorId })),
    };
  }

  // Save product with image URLs and relations
  const result = await prisma.product.create({
    data: productData,
    include: {
      category: true,
      brand: true,
      colors: true,
    },
  });

  return result;
};

export const getProduct = async (id: string) => {
  try {
    const result = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        colors: true,
      },
    });

    return result;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const getAllProducts = async (query: any, options: any) => {
  const { searchTerm, ...filter } = query;
  const { limit, page, order, skip, sort } = calculatePagination(options);
  const andCondition: any[] = [{ isDeleted: false }];
  console.log(searchTerm);
  if (searchTerm) {
    andCondition.push({
      OR: ['name', 'description'].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (filter.minPrice || filter.maxPrice) {
    const priceCondition: any = {};

    if (filter.minPrice) {
      priceCondition.gte = Number(filter.minPrice);
    }

    if (filter.maxPrice) {
      priceCondition.lte = Number(filter.maxPrice);
    }

    andCondition.push({
      price: priceCondition,
    });
  }

  if (Object.keys(filter).length > 0) {
    Object.keys(filter).forEach((field) => {
      const value = filter[field];

      // Handle array values (multiple categoryIds)
      if (Array.isArray(value)) {
        andCondition.push({
          [field]: {
            in: value,
          },
        });
      } else {
        // Handle single values
        andCondition.push({
          [field]: {
            equals: value,
          },
        });
      }
    });
  }

  const whereCondition = andCondition.length ? { AND: andCondition } : {};

  // Fix the orderBy syntax - swap sort and order
  const result = await prisma.product.findMany({
    where: whereCondition,
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy:
      options.sort && options.order
        ? {
            [sort]: order, // Correct: { name: 'desc' }
          }
        : { createdAt: 'desc' },
    include: {
      category: true,
      brand: true,
    },
  });

  const total = await prisma.product.count({
    where: whereCondition,
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: result,
  };
};
export const updateProduct = async (id: string, data: any) => {
  const product = await prisma.product.findUnique({
    where: { id, isDeleted: false },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Separate relation fields and any nested objects from the scalar payload.
  // `colors` is a many-to-many relation, so it cannot be spread directly into
  // prisma.update (Prisma expects connect/set, not a raw array). We also drop
  // any nested category/brand objects and immutable fields the client may send.
  const {
    colors,
    category: _category,
    brand: _brand,
    discounts: _discounts,
    id: _id,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...scalarData
  } = data;

  // If SKU is being updated, check for uniqueness
  if (scalarData.sku && scalarData.sku !== product.sku) {
    const existingProduct = await prisma.product.findUnique({
      where: { sku: scalarData.sku },
    });

    if (existingProduct) {
      throw new AppError(httpStatus.CONFLICT, 'SKU already exists');
    }
  }

  // If stock is being updated, update inStock status
  if (scalarData.stock !== undefined) {
    scalarData.inStock = scalarData.stock > 0;
  }

  // If price is being updated and there's no active discount, update originalPrice too
  if (scalarData.price && product.originalPrice === product.price) {
    scalarData.originalPrice = scalarData.price;
  }

  const updateData: any = {
    ...scalarData,
    updatedAt: new Date(),
  };

  // Resolve the many-to-many colors relation by id (same contract as
  // createProduct). `set` replaces the whole relation with the selected colors,
  // so removed colors are disconnected and newly selected ones connected.
  if (Array.isArray(colors)) {
    const colorIds = colors
      .map((c: any) => (typeof c === 'object' ? c.id : c))
      .filter((id: any): id is string => typeof id === 'string' && !!id);

    if (colorIds.length > 0) {
      const existingColors = await prisma.color.findMany({
        where: { id: { in: colorIds } },
      });

      if (existingColors.length !== colorIds.length) {
        throw new AppError(
          httpStatus.CONFLICT,
          'One or more color IDs are invalid',
        );
      }
    }

    updateData.colors = {
      set: colorIds.map((id) => ({ id })),
    };
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      brand: true,
      colors: true,
      discounts: {
        where: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      },
    },
  });

  return updatedProduct;
};

export const fetchersProduct = async () => {
  const result = await prisma.product.findMany({
    where: {
      badge: 'FEATURED',
      isDeleted: false,
      inStock: true,
    },
    include: {
      discounts: {
        where: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      brand: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

export const newProduct = async () => {
  const result = await prisma.product.findMany({
    where: {
      badge: ProductType.NEW,
      isDeleted: false,
      inStock: true,
    },
    include: {
      discounts: {
        where: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      brand: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
  });
  console.log(result,'data')
  return await result;
};

export const getDiscountedProducts = async () => {
  const result = await prisma.product.findMany({
    where: {
      isDeleted: false,
      inStock: true,
      discounts: {
        some: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      },
    },
    include: {
      discounts: {
        where: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      brand: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

export const deleteProduct = async (id: string) => {
  const isExistProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!isExistProduct) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  await prisma.product.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });

  return { message: 'Product deleted successfully' };
};

export const getRelatedCategory = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id, isDeleted: false },
    select: { categoryId: true },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const result = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: id },
      isDeleted: false,
      inStock: true,
    },
    take: 8,
    include: {
      discounts: {
        where: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      brand: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
  });

  return result;
};

// Manage product images independently (add / replace / remove)
export const updateProductImages = async (
  id: string,
  files: Express.Multer.File[] | undefined,
  options: { removeImages?: string[]; mode?: 'edit' | 'replace' | 'remove' },
) => {
  const product = await prisma.product.findUnique({
    where: { id, isDeleted: false },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const mode = options.mode ?? 'edit';
  const removeImages = Array.isArray(options.removeImages)
    ? options.removeImages
    : [];

  // Upload any newly provided files to Cloudinary
  const uploadedUrls: string[] = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const imageName = `${new Date().toTimeString().replace(/:/g, '-')}-${file.originalname}`;
      const uploadResult: any = await sendImageCloudinary(
        file.buffer,
        imageName,
      );
      uploadedUrls.push(uploadResult.secure_url);
    }
  }

  let finalImages: string[];

  if (mode === 'replace') {
    // Replace the entire image set with the freshly uploaded files
    if (uploadedUrls.length === 0) {
      throw new AppError(
        httpStatus.CONFLICT,
        'At least one new image is required to replace',
      );
    }
    finalImages = uploadedUrls;
  } else {
    // edit / remove: keep existing images minus the removed ones, then append new
    const keptImages = product.images.filter(
      (img) => !removeImages.includes(img),
    );
    finalImages = [...keptImages, ...uploadedUrls];
  }

  if (finalImages.length === 0) {
    throw new AppError(httpStatus.CONFLICT, 'At least one image is required');
  }

  if (finalImages.length > 3) {
    throw new AppError(httpStatus.CONFLICT, 'Maximum 3 images are allowed');
  }

  const result = await prisma.product.update({
    where: { id },
    data: {
      images: finalImages,
      updatedAt: new Date(),
    },
    include: {
      category: true,
      brand: true,
    },
  });

  return result;
};

export const ProductService = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  fetchersProduct,
  newProduct,
  getRelatedCategory,
  getDiscountedProducts,
  updateProductImages,
};
