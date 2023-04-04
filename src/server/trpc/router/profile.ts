import { router, publicProcedure } from "../trpc";
import { prisma } from "../../db/client";
import { z } from "zod";

export const profileRouter = router({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      return user;
    }),
});
