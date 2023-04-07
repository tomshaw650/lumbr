import { prisma } from "../db/client";

export const getSuspendedUsers = async () => {
  const suspendedUsers = await prisma.user.findMany({
    where: {
      suspended: true,
      suspendDate: new Date().toISOString(),
    },
  });

  console.log("suspended users", suspendedUsers);

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
