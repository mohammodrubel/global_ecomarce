import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import { sendImageCloudinary } from '../../utils/sendImageToCloudinary';

const userSafeSelect = {
  id: true,
  full_name: true,
  email: true,
  role: true,
  profile_photo: true,
  createdAt: true,
  updatedAt: true,
};

const GetAllUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      role: 'USER',
    },
    select: {
      ...userSafeSelect,
      orders: {
        where: { status: { not: 'CANCELLED' } },
        select: {
          totalPrice: true,
          createdAt: true,
          phone: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return users.map((u) => {
    const ordersCount = u.orders.length;
    const totalSpent = u.orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const lastOrder = u.orders[0]?.createdAt || null;
    const phone = u.orders[0]?.phone || null;
    const { orders: _orders, ...rest } = u;
    return {
      ...rest,
      phone,
      ordersCount,
      totalSpent: Number(totalSpent.toFixed(2)),
      lastOrder,
    };
  });
};

const GetSingleUser = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
    select: userSafeSelect,
  });
  return result;
};

const GetMe = async (id: string) => {
  const result = await prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: userSafeSelect,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const UpdateMe = async (
  id: string,
  payload: { full_name?: string; email?: string },
) => {
  const existing = await prisma.user.findFirst({
    where: { id, isDeleted: false },
  });
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (payload.email && payload.email !== existing.email) {
    const emailTaken = await prisma.user.findFirst({
      where: { email: payload.email, NOT: { id } },
    });
    if (emailTaken) {
      throw new AppError(httpStatus.CONFLICT, 'Email already in use');
    }
  }

  const data: { full_name?: string; email?: string } = {};
  if (payload.full_name !== undefined) data.full_name = payload.full_name;
  if (payload.email !== undefined) data.email = payload.email;

  const result = await prisma.user.update({
    where: { id },
    data,
    select: userSafeSelect,
  });
  return result;
};

const UpdateMyPhoto = async (id: string, file: Express.Multer.File) => {
  const existing = await prisma.user.findFirst({
    where: { id, isDeleted: false },
  });
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Image is required');
  }

  const imageName =
    new Date().toTimeString().replace(/:/g, '-') + '-' + file.originalname;

  const uploadResult: any = await sendImageCloudinary(
    file.buffer,
    imageName,
    'user_profiles',
  );

  const result = await prisma.user.update({
    where: { id },
    data: { profile_photo: uploadResult.secure_url },
    select: userSafeSelect,
  });
  return result;
};

const DeleteUser = async (id: string) => {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });
};

export const UserService = {
  GetAllUsers,
  GetSingleUser,
  GetMe,
  UpdateMe,
  UpdateMyPhoto,
  DeleteUser,
};
