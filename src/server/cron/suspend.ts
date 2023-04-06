// suspendedUsers.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSuspendedUsers = async () => {
  const suspendedUsers = await prisma.user.findMany({
    where: {
      suspended: true,
      suspendDate: new Date().toISOString(),
    },
  });

  return suspendedUsers;
};

export const unsuspendUsers = async () => {
  const suspendedUsers = await getSuspendedUsers();

  const unsuspendPromises = suspendedUsers.map((user) =>
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        suspended: false,
        suspendReason: null,
        suspendDate: null,
      },
    })
  );

  await Promise.all(unsuspendPromises);
};
