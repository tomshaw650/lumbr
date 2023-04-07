import { prisma } from "../../../server/db/client";
import { NextApiRequest, NextApiResponse } from "next";

export const getSuspendedUsers = async () => {
  const currentDate = new Date();
  const midnightUTC = new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate()
    )
  );

  const suspendedUsers = await prisma.user.findMany({
    where: {
      suspended: true,
      suspendDate: midnightUTC,
    },
  });

  return suspendedUsers;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
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

    res.status(200).json({ success: true, data: suspendedUsers });
  } catch (error) {
    console.error("Error unsuspending users:", error);
    res.status(500).json({ success: false });
  }
};

export default handler;
