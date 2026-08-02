import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';

const userSafeSelect = {
  id: true,
  full_name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

const GetAllUsers = async () => {
  const result = await prisma.user.findMany({
    where: {
      isDeleted: false,
    },
    select: userSafeSelect,
  });
  return result;
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
  DeleteUser,
};
