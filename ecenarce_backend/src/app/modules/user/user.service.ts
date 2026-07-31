import prisma from '../../utils/prisma';

const GetAllUsers = async () => {
  const result = await prisma.user.findMany({
    where: {
      isDeleted: false,
    },
  });
  return result;
};

const GetSingleUser = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
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
  DeleteUser,
};
